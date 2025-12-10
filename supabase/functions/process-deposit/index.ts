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
}

interface FeeBreakdown {
  fee_total: number;
  amount_user: number;
  fee_protocol: number;
  fee_charity: number;
  fee_academy: number;
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
    const { asset, amount, txHash } = depositRequest;

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

    // Calculate fees using database function
    const { data: feeData, error: feeError } = await supabase
      .rpc('calculate_deposit_fees', {
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

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabase
      .from('custodial_wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .eq('currency', asset)
      .maybeSingle();

    if (walletError && walletError.code !== 'PGRST116') {
      throw walletError;
    }

    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from('custodial_wallets')
        .insert({
          user_id: user.id,
          currency: asset,
          balance: 0
        })
        .select('id, balance')
        .single();

      if (createError) throw createError;
      wallet = newWallet;
    }

    // Update wallet balance
    const currentBalance = parseFloat(wallet.balance);
    const newBalance = currentBalance + fees.amount_user;

    const { error: updateError } = await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance.toString() })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: 'deposit',
        amount: depositAmount.toString(),
        currency: asset,
        status: 'completed',
        tx_hash: txHash || null,
        fee: fees.fee_total.toString(),
        metadata: {
          amount_gross: depositAmount,
          amount_net: fees.amount_user,
          fee_breakdown: {
            protocol: fees.fee_protocol,
            charity: fees.fee_charity,
            academy: fees.fee_academy
          }
        },
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (txError) throw txError;

    // Asset prices for USD conversion
    const prices: Record<string, number> = {
      BTC: 95000,
      ETH: 3500,
      SOL: 140,
      TRX: 0.15,
      XRP: 2.5,
      TYT: 0.05,
      USDT: 1,
      USDC: 1
    };

    const assetPrice = prices[asset] || 1;

    // Record protocol revenue (60%)
    await supabase
      .from('protocol_revenue')
      .insert({
        source_type: 'deposit_fee',
        source_id: transaction.id,
        asset: asset,
        amount: fees.fee_protocol.toString(),
        amount_usd: (fees.fee_protocol * assetPrice).toString(),
        transaction_id: transaction.id
      });

    // Record charity flows (30% + 10%)
    await supabase
      .from('charity_flows')
      .insert([
        {
          user_id: user.id,
          source_type: 'deposit_fee_charity',
          source_id: transaction.id,
          asset: asset,
          amount: fees.fee_charity.toString(),
          amount_usd: (fees.fee_charity * assetPrice).toString(),
          flow_type: 'charity',
          transaction_id: transaction.id
        },
        {
          user_id: user.id,
          source_type: 'deposit_fee_academy',
          source_id: transaction.id,
          asset: asset,
          amount: fees.fee_academy.toString(),
          amount_usd: (fees.fee_academy * assetPrice).toString(),
          flow_type: 'academy',
          transaction_id: transaction.id
        }
      ]);

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction.id,
        amount_deposited: depositAmount,
        amount_credited: fees.amount_user,
        fee_breakdown: {
          total: fees.fee_total,
          protocol: fees.fee_protocol,
          charity: fees.fee_charity,
          academy: fees.fee_academy
        },
        new_balance: newBalance
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