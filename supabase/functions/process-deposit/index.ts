import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DepositRequest {
  asset: string;
  amount: string;
  txHash?: string;
  network?: string;
}

interface FeeBreakdown {
  fee_bps: number;
  fee_total: number;
  amount_user: number;
  fee_protocol: number;
  fee_charity: number;
  fee_academy: number;
  fee_burn: number;
  protocol_pct: number;
  charity_pct: number;
  academy_pct: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const depositRequest: DepositRequest = await req.json();
    const { asset, amount, txHash, network } = depositRequest;

    if (!asset || !amount) {
      return new Response(
        JSON.stringify({ error: 'Asset and amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: feeData, error: feeError } = await supabase
      .rpc('calculate_deposit_fees_v3', {
        p_amount: depositAmount,
        p_asset: asset
      });

    if (feeError || !feeData || feeData.length === 0) {
      console.error('Fee calculation error:', feeError);
      return new Response(
        JSON.stringify({ error: 'Failed to calculate fees' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fees: FeeBreakdown = feeData[0];

    const { data: userAccountId, error: userAccountError } = await supabase
      .rpc('get_or_create_wallet_account', {
        p_user_id: user.id,
        p_account_type: 'user_main',
        p_currency: asset,
        p_network: network || null
      });

    if (userAccountError) {
      console.error('User account error:', userAccountError);
      throw userAccountError;
    }

    const { data: protocolAccountId } = await supabase
      .rpc('get_or_create_wallet_account', {
        p_user_id: null,
        p_account_type: 'protocol_fees',
        p_currency: asset,
        p_network: null
      });

    const { data: charityAccountId } = await supabase
      .rpc('get_or_create_wallet_account', {
        p_user_id: null,
        p_account_type: 'charity_fund',
        p_currency: asset,
        p_network: null
      });

    const { data: academyAccountId } = await supabase
      .rpc('get_or_create_wallet_account', {
        p_user_id: null,
        p_account_type: 'academy_fund',
        p_currency: asset,
        p_network: null
      });

    const depositRefId = crypto.randomUUID();

    const { data: userBatchId, error: userCreditError } = await supabase
      .rpc('credit_account', {
        p_account_id: userAccountId,
        p_amount: fees.amount_user,
        p_entry_type: 'deposit',
        p_ref_type: 'blockchain_deposit',
        p_ref_id: depositRefId,
        p_description: `Deposit ${depositAmount} ${asset} (net after ${fees.fee_bps / 100}% fee)`,
        p_metadata: {
          tx_hash: txHash || null,
          network: network || null,
          gross_amount: depositAmount,
          fee_total: fees.fee_total,
          fee_breakdown: {
            protocol: fees.fee_protocol,
            charity: fees.fee_charity,
            academy: fees.fee_academy
          }
        }
      });

    if (userCreditError) {
      console.error('User credit error:', userCreditError);
      throw userCreditError;
    }

    if (fees.fee_protocol > 0) {
      await supabase.rpc('credit_account', {
        p_account_id: protocolAccountId,
        p_amount: fees.fee_protocol,
        p_entry_type: 'deposit',
        p_ref_type: 'deposit_fee_protocol',
        p_ref_id: depositRefId,
        p_description: `Protocol fee (${fees.protocol_pct}% of ${fees.fee_total} ${asset})`,
        p_metadata: { source_user_id: user.id, deposit_batch_id: userBatchId }
      });
    }

    if (fees.fee_charity > 0) {
      await supabase.rpc('credit_account', {
        p_account_id: charityAccountId,
        p_amount: fees.fee_charity,
        p_entry_type: 'charity_donation',
        p_ref_type: 'deposit_fee_charity',
        p_ref_id: depositRefId,
        p_description: `Charity fund (${fees.charity_pct}% of ${fees.fee_total} ${asset})`,
        p_metadata: { source_user_id: user.id, deposit_batch_id: userBatchId }
      });
    }

    if (fees.fee_academy > 0) {
      await supabase.rpc('credit_account', {
        p_account_id: academyAccountId,
        p_amount: fees.fee_academy,
        p_entry_type: 'academy_payment',
        p_ref_type: 'deposit_fee_academy',
        p_ref_id: depositRefId,
        p_description: `Academy fund (${fees.academy_pct}% of ${fees.fee_total} ${asset})`,
        p_metadata: { source_user_id: user.id, deposit_batch_id: userBatchId }
      });
    }

    const { data: accountBalance } = await supabase
      .from('wallet_accounts')
      .select('balance')
      .eq('id', userAccountId)
      .single();

    const prices: Record<string, number> = {
      BTC: 95000, ETH: 3500, SOL: 140, TRX: 0.15,
      XRP: 2.5, TYT: 0.05, USDT: 1, USDC: 1
    };
    const assetPrice = prices[asset] || 1;

    await supabase.from('protocol_revenue').insert({
      source_type: 'deposit_fee',
      source_id: depositRefId,
      asset: asset,
      amount: fees.fee_protocol.toString(),
      amount_usd: (fees.fee_protocol * assetPrice).toString(),
      transaction_id: depositRefId
    });

    await supabase.from('charity_flows').insert([
      {
        user_id: user.id,
        source_type: 'deposit_fee_charity',
        source_id: depositRefId,
        asset: asset,
        amount: fees.fee_charity.toString(),
        amount_usd: (fees.fee_charity * assetPrice).toString(),
        flow_type: 'charity',
        transaction_id: depositRefId
      },
      {
        user_id: user.id,
        source_type: 'deposit_fee_academy',
        source_id: depositRefId,
        asset: asset,
        amount: fees.fee_academy.toString(),
        amount_usd: (fees.fee_academy * assetPrice).toString(),
        flow_type: 'academy',
        transaction_id: depositRefId
      }
    ]);

    const { data: legacyWallet } = await supabase
      .from('custodial_wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .eq('currency', asset)
      .maybeSingle();

    if (legacyWallet) {
      const newLegacyBalance = parseFloat(legacyWallet.balance || '0') + fees.amount_user;
      await supabase
        .from('custodial_wallets')
        .update({ balance: newLegacyBalance.toString() })
        .eq('id', legacyWallet.id);
    } else {
      await supabase.from('custodial_wallets').insert({
        user_id: user.id,
        currency: asset,
        balance: fees.amount_user.toString()
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: depositRefId,
        ledger_batch_id: userBatchId,
        amount_deposited: depositAmount,
        amount_credited: fees.amount_user,
        fee_rate_bps: fees.fee_bps,
        fee_breakdown: {
          total: fees.fee_total,
          total_percent: fees.fee_bps / 100,
          protocol: fees.fee_protocol,
          protocol_percent: (fees.fee_bps / 100) * (fees.protocol_pct / 100),
          charity: fees.fee_charity,
          charity_percent: (fees.fee_bps / 100) * (fees.charity_pct / 100),
          academy: fees.fee_academy,
          academy_percent: (fees.fee_bps / 100) * (fees.academy_pct / 100)
        },
        new_balance: accountBalance?.balance || fees.amount_user
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Deposit processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Deposit processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});