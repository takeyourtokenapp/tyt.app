import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

/**
 * Record Charity Income Edge Function
 *
 * Records all foundation income from platform fees and donations.
 * Validates source types and automatically tracks charity/academy split.
 *
 * Valid Source Types:
 * - DEPOSIT_FEE_CHARITY / DEPOSIT_FEE_ACADEMY
 * - MARKETPLACE_FEE_CHARITY / MARKETPLACE_FEE_ACADEMY
 * - MINT_FEE_CHARITY / MINT_FEE_ACADEMY
 * - UPGRADE_FEE_CHARITY / UPGRADE_FEE_ACADEMY
 * - MAINTENANCE_FEE_CHARITY / MAINTENANCE_FEE_ACADEMY
 * - USER_DIRECT
 * - REWARDS_PERCENT
 * - BURN_CHARITY_MINT
 * - CHARITY_STAKING_REWARDS
 */

interface CharityIncomeRequest {
  source_type: string;
  source_id?: string;
  user_id?: string;
  asset: string;
  amount: number;
  usd_value?: number;
  tx_hash?: string;
}

const VALID_SOURCE_TYPES = [
  'DEPOSIT_FEE_CHARITY',
  'DEPOSIT_FEE_ACADEMY',
  'MARKETPLACE_FEE_CHARITY',
  'MARKETPLACE_FEE_ACADEMY',
  'MINT_FEE_CHARITY',
  'MINT_FEE_ACADEMY',
  'UPGRADE_FEE_CHARITY',
  'UPGRADE_FEE_ACADEMY',
  'MAINTENANCE_FEE_CHARITY',
  'MAINTENANCE_FEE_ACADEMY',
  'USER_DIRECT',
  'REWARDS_PERCENT',
  'BURN_CHARITY_MINT',
  'CHARITY_STAKING_REWARDS',
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // This endpoint should only be called by service role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body: CharityIncomeRequest = await req.json();
    const {
      source_type,
      source_id,
      user_id,
      asset,
      amount,
      usd_value,
      tx_hash,
    } = body;

    // Validate required fields
    if (!source_type || !asset || !amount) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          required: ['source_type', 'asset', 'amount'],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate source type
    if (!VALID_SOURCE_TYPES.includes(source_type)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid source type',
          valid_types: VALID_SOURCE_TYPES,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Determine destination based on source type
    let destination: 'charity' | 'academy';
    if (source_type.endsWith('_ACADEMY')) {
      destination = 'academy';
    } else if (source_type.endsWith('_CHARITY')) {
      destination = 'charity';
    } else if (source_type === 'USER_DIRECT' || source_type === 'REWARDS_PERCENT') {
      destination = 'charity'; // Direct donations go to charity
    } else if (source_type === 'BURN_CHARITY_MINT' || source_type === 'CHARITY_STAKING_REWARDS') {
      destination = 'charity';
    } else {
      return new Response(
        JSON.stringify({
          error: 'Cannot determine destination from source_type',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate USD value if not provided
    let finalUsdValue = usd_value;
    if (!finalUsdValue) {
      // TODO: Get price from oracle
      // For now, assume stablecoins = 1:1
      if (asset === 'USDT' || asset === 'USDC' || asset === 'DAI') {
        finalUsdValue = amount;
      } else {
        finalUsdValue = amount; // Placeholder
      }
    }

    // Record transaction using RPC function
    const { data: txId, error: recordError } = await supabaseAdmin.rpc(
      'record_charity_transaction',
      {
        p_source_type: source_type,
        p_source_id: source_id || null,
        p_user_id: user_id || null,
        p_asset: asset,
        p_amount: amount,
        p_usd_value: finalUsdValue,
        p_destination: destination,
        p_tx_hash: tx_hash || null,
      }
    );

    if (recordError) {
      console.error('Error recording charity transaction:', recordError);
      return new Response(
        JSON.stringify({
          error: 'Failed to record transaction',
          details: recordError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get transaction details
    const { data: transaction, error: fetchError } = await supabaseAdmin
      .from('foundation_transactions')
      .select('*')
      .eq('id', txId)
      .single();

    if (fetchError) {
      console.error('Error fetching transaction:', fetchError);
    }

    const response = {
      success: true,
      transaction_id: txId,
      transaction: transaction || null,
      destination,
      message: `Recorded ${destination} income from ${source_type}`,
    };

    console.log('Charity income recorded:', {
      transaction_id: txId,
      source_type,
      destination,
      asset,
      amount,
      usd_value: finalUsdValue,
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Record charity income error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
