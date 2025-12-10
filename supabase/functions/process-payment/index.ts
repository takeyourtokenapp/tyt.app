import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentRequest {
  type: 'maintenance' | 'marketplace' | 'upgrade' | 'donation';
  userId: string;
  amount: string;
  asset: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
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

    const paymentRequest: PaymentRequest = await req.json();

    if (paymentRequest.userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: wallet, error: walletError } = await supabase
      .from('custodial_wallets')
      .select('balance')
      .eq('user_id', paymentRequest.userId)
      .eq('asset', paymentRequest.asset)
      .maybeSingle();

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentBalance = parseFloat(wallet.balance);
    const paymentAmount = parseFloat(paymentRequest.amount);

    if (currentBalance < paymentAmount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newBalance = currentBalance - paymentAmount;

    const { error: updateError } = await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance.toString() })
      .eq('user_id', paymentRequest.userId)
      .eq('asset', paymentRequest.asset);

    if (updateError) {
      throw updateError;
    }

    let result: any = { success: true };

    switch (paymentRequest.type) {
      case 'maintenance':
        result = await processMaintenancePayment(supabase, paymentRequest);
        break;
      case 'marketplace':
        result = await processMarketplacePayment(supabase, paymentRequest);
        break;
      case 'upgrade':
        result = await processUpgradePayment(supabase, paymentRequest);
        break;
      case 'donation':
        result = await processDonation(supabase, paymentRequest);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid payment type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});

async function processMaintenancePayment(supabase: any, payment: PaymentRequest) {
  const { minerId } = payment.metadata || {};
  
  if (!minerId) {
    throw new Error('Miner ID required for maintenance payment');
  }

  const { error } = await supabase
    .from('maintenance_invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_asset: payment.asset,
      payment_amount: payment.amount
    })
    .eq('miner_id', minerId)
    .eq('status', 'pending');

  if (error) throw error;

  await supabase
    .from('nft_miners')
    .update({
      last_maintenance_paid: new Date().toISOString(),
      status: 'active'
    })
    .eq('id', minerId);

  if (payment.asset === 'TYT') {
    await supabase
      .from('token_burns')
      .insert({
        amount_tyt: payment.amount,
        burn_source: 'maintenance',
        status: 'pending'
      });
  }

  return { success: true, message: 'Maintenance payment processed' };
}

async function processMarketplacePayment(supabase: any, payment: PaymentRequest) {
  return { success: true, message: 'Marketplace payment processed' };
}

async function processUpgradePayment(supabase: any, payment: PaymentRequest) {
  const { minerId, upgradeType } = payment.metadata || {};
  
  if (!minerId || !upgradeType) {
    throw new Error('Miner ID and upgrade type required');
  }

  if (payment.asset === 'TYT') {
    await supabase
      .from('token_burns')
      .insert({
        amount_tyt: payment.amount,
        burn_source: 'upgrade',
        status: 'pending'
      });
  }

  return { success: true, message: 'Upgrade payment processed' };
}

async function processDonation(supabase: any, payment: PaymentRequest) {
  const { campaignId } = payment.metadata || {};
  
  const prices: Record<string, number> = {
    TYT: 0.05,
    USDT: 1,
    BTC: 95000,
    ETH: 3500
  };

  const amountUsd = parseFloat(payment.amount) * (prices[payment.asset] || 1);

  const { error } = await supabase
    .from('foundation_donations')
    .insert({
      user_id: payment.userId,
      campaign_id: campaignId,
      amount_crypto: payment.amount,
      crypto_asset: payment.asset,
      amount_usd: amountUsd.toString(),
      donation_source: 'manual',
      is_automatic: false
    });

  if (error) throw error;

  if (campaignId) {
    const { data: campaign } = await supabase
      .from('foundation_campaigns')
      .select('raised_usd')
      .eq('id', campaignId)
      .maybeSingle();

    if (campaign) {
      const newRaised = parseFloat(campaign.raised_usd) + amountUsd;
      await supabase
        .from('foundation_campaigns')
        .update({ raised_usd: newRaised.toString() })
        .eq('id', campaignId);
    }
  }

  return { success: true, message: 'Donation processed successfully' };
}
