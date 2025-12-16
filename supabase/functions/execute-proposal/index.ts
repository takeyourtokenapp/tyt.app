import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

/**
 * Execute Proposal Edge Function
 *
 * Executes passed governance proposals after timelock period.
 * Applies parameter changes on-chain and updates database.
 */

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const cronSecret = Deno.env.get('CRON_SECRET');
    const authHeader = req.headers.get('Authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { proposal_id } = await req.json();

    const { data: proposal, error: proposalError } = await supabase
      .from('governance_proposals')
      .select('*')
      .eq('id', proposal_id)
      .maybeSingle();

    if (proposalError || !proposal) {
      return new Response(
        JSON.stringify({ error: 'Proposal not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (proposal.status === 'executed') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Proposal already executed',
          proposal_id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: tallyResult } = await supabase.rpc('tally_proposal_v2', {
      p_proposal_id: proposal_id,
    });

    if (!tallyResult || !tallyResult.passed) {
      await supabase
        .from('governance_proposals')
        .update({ status: 'rejected' })
        .eq('id', proposal_id);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Proposal did not pass',
          tally: tallyResult,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const now = new Date();
    const votingEnded = new Date(proposal.end_time || proposal.voting_ends_at);
    const timelockHours = 24;
    const canExecute = now.getTime() >= votingEnded.getTime() + timelockHours * 60 * 60 * 1000;

    if (!canExecute) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Timelock period not expired',
          can_execute_at: new Date(
            votingEnded.getTime() + timelockHours * 60 * 60 * 1000
          ).toISOString(),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let executionResult: any = {};
    let executionTx = '';

    try {
      switch (proposal.param_key) {
        case 'deposit.fee_bps_total':
          executionResult = await updateDepositFee(
            proposal.proposed_value,
            supabase
          );
          break;

        case 'charity.split_pct':
          executionResult = await updateCharitySplit(
            proposal.proposed_value,
            supabase
          );
          break;

        case 'marketplace.fee_bps':
          executionResult = await updateMarketplaceFee(
            proposal.proposed_value,
            supabase
          );
          break;

        case 'maintenance.discount_cap':
          executionResult = await updateDiscountCap(
            proposal.proposed_value,
            supabase
          );
          break;

        default:
          executionResult = {
            success: false,
            message: `Unknown parameter: ${proposal.param_key}`,
          };
      }

      executionTx = executionResult.tx_hash || `offchain-${Date.now()}`;
    } catch (error) {
      console.error('Execution error:', error);

      await supabase.from('governance_execution_queue').insert({
        proposal_id,
        scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        last_error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed',
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Execution failed',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (executionResult.success) {
      await supabase
        .from('governance_proposals')
        .update({
          status: 'executed',
          executed_at: new Date().toISOString(),
          execution_tx: executionTx,
        })
        .eq('id', proposal_id);

      return new Response(
        JSON.stringify({
          success: true,
          proposal_id,
          execution_tx: executionTx,
          result: executionResult,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: executionResult.message || 'Execution failed',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Execute proposal error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function updateDepositFee(newValue: string, supabase: any) {
  const feeBps = parseInt(newValue);

  if (feeBps < 0 || feeBps > 200) {
    throw new Error('Invalid fee value. Must be 0-200 bps (0-2%)');
  }

  await supabase
    .from('platform_fee_config')
    .update({ fee_bps_total: feeBps })
    .eq('category', 'deposit')
    .eq('subcategory', 'stables');

  return {
    success: true,
    message: `Deposit fee updated to ${feeBps} bps`,
    tx_hash: `offchain-deposit-fee-${Date.now()}`,
  };
}

async function updateCharitySplit(newValue: string, supabase: any) {
  const splitPct = parseInt(newValue);

  if (splitPct < 0 || splitPct > 50) {
    throw new Error('Invalid charity split. Must be 0-50%');
  }

  await supabase
    .from('platform_fee_config')
    .update({ charity_pct: splitPct })
    .eq('category', 'deposit');

  return {
    success: true,
    message: `Charity split updated to ${splitPct}%`,
    tx_hash: `offchain-charity-split-${Date.now()}`,
  };
}

async function updateMarketplaceFee(newValue: string, supabase: any) {
  const feeBps = parseInt(newValue);

  if (feeBps < 0 || feeBps > 500) {
    throw new Error('Invalid marketplace fee. Must be 0-500 bps (0-5%)');
  }

  await supabase
    .from('platform_fee_config')
    .update({ fee_bps_total: feeBps })
    .eq('category', 'marketplace');

  return {
    success: true,
    message: `Marketplace fee updated to ${feeBps} bps`,
    tx_hash: `offchain-marketplace-fee-${Date.now()}`,
  };
}

async function updateDiscountCap(newValue: string, supabase: any) {
  const capPct = parseInt(newValue);

  if (capPct < 0 || capPct > 50) {
    throw new Error('Invalid discount cap. Must be 0-50%');
  }

  await supabase
    .from('maintenance_discounts')
    .update({ max_discount_pct: capPct })
    .eq('discount_type', 'combined');

  return {
    success: true,
    message: `Discount cap updated to ${capPct}%`,
    tx_hash: `offchain-discount-cap-${Date.now()}`,
  };
}
