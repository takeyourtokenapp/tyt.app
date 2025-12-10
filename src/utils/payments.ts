import { supabase } from '../lib/supabase';
import { calculateDailyMaintenanceCost } from './maintenance';

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export async function payMaintenanceInvoice(
  invoiceId: string,
  userId: string,
  paymentAsset: 'TYT' | 'USDT' | 'BTC'
): Promise<PaymentResult> {
  try {
    const { data: invoice, error: invoiceError } = await supabase
      .from('maintenance_invoices')
      .select('*, nft_miners(*)')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    const amount = parseFloat(invoice.final_amount_usd);

    const { data: wallet, error: walletError } = await supabase
      .from('custodial_wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('asset', paymentAsset)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: 'Wallet not found' };
    }

    const balance = parseFloat(wallet.balance);
    const prices: Record<string, number> = { TYT: 0.05, USDT: 1, BTC: 95000 };
    const requiredAmount = amount / prices[paymentAsset];

    if (balance < requiredAmount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const newBalance = (balance - requiredAmount).toFixed(8);
    await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .eq('asset', paymentAsset);

    await supabase
      .from('maintenance_invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    await supabase
      .from('nft_miners')
      .update({
        status: 'active',
        last_maintenance_paid: new Date().toISOString()
      })
      .eq('id', invoice.miner_id);

    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return {
      success: true,
      transactionHash: txHash
    };
  } catch (error) {
    console.error('Payment error:', error);
    return { success: false, error: 'Payment failed' };
  }
}

export async function purchaseMiner(
  minerId: string,
  userId: string,
  paymentAsset: 'TYT' | 'USDT' | 'BTC',
  price: number
): Promise<PaymentResult> {
  try {
    const { data: wallet } = await supabase
      .from('custodial_wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('asset', paymentAsset)
      .single();

    if (!wallet) {
      return { success: false, error: 'Wallet not found' };
    }

    const balance = parseFloat(wallet.balance);
    if (balance < price) {
      return { success: false, error: 'Insufficient balance' };
    }

    const newBalance = (balance - price).toFixed(8);
    await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .eq('asset', paymentAsset);

    await supabase
      .from('nft_miners')
      .update({ owner_id: userId })
      .eq('id', minerId);

    await supabase
      .from('marketplace_listings')
      .update({ status: 'sold' })
      .eq('miner_id', minerId);

    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return {
      success: true,
      transactionHash: txHash
    };
  } catch (error) {
    console.error('Purchase error:', error);
    return { success: false, error: 'Purchase failed' };
  }
}

export async function claimRewards(
  userId: string,
  rewardIds: string[]
): Promise<PaymentResult> {
  try {
    const { data: rewards } = await supabase
      .from('daily_rewards')
      .select('*')
      .in('id', rewardIds)
      .eq('claimed', false);

    if (!rewards || rewards.length === 0) {
      return { success: false, error: 'No claimable rewards' };
    }

    const totalClaimable = rewards.reduce(
      (sum, r) => sum + parseFloat(r.claimable_btc),
      0
    );

    const { data: wallet } = await supabase
      .from('custodial_wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('asset', 'BTC')
      .single();

    if (!wallet) {
      return { success: false, error: 'BTC wallet not found' };
    }

    const newBalance = (parseFloat(wallet.balance) + totalClaimable).toFixed(8);

    await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .eq('asset', 'BTC');

    await supabase
      .from('daily_rewards')
      .update({ claimed: true, claimed_at: new Date().toISOString() })
      .in('id', rewardIds);

    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return {
      success: true,
      transactionHash: txHash
    };
  } catch (error) {
    console.error('Claim error:', error);
    return { success: false, error: 'Claim failed' };
  }
}

export async function createMarketplaceListing(
  minerId: string,
  userId: string,
  price: number,
  asset: 'TYT' | 'USDT' | 'BTC'
): Promise<PaymentResult> {
  try {
    const { data: miner } = await supabase
      .from('nft_miners')
      .select('owner_id')
      .eq('id', minerId)
      .single();

    if (!miner || miner.owner_id !== userId) {
      return { success: false, error: 'Not your miner' };
    }

    await supabase.from('marketplace_listings').insert({
      miner_id: minerId,
      seller_id: userId,
      listing_type: 'fixed_price',
      list_price_amount: price.toString(),
      list_price_asset: asset,
      status: 'active'
    });

    return { success: true };
  } catch (error) {
    console.error('Listing error:', error);
    return { success: false, error: 'Failed to create listing' };
  }
}

export async function makeDonation(
  campaignId: string,
  userId: string,
  amount: number,
  asset: 'TYT' | 'USDT' | 'BTC' | 'ETH'
): Promise<PaymentResult> {
  try {
    const { data: wallet } = await supabase
      .from('custodial_wallets')
      .select('balance')
      .eq('user_id', userId)
      .eq('asset', asset)
      .single();

    if (!wallet) {
      return { success: false, error: 'Wallet not found' };
    }

    const balance = parseFloat(wallet.balance);
    if (balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const newBalance = (balance - amount).toFixed(8);
    await supabase
      .from('custodial_wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId)
      .eq('asset', asset);

    const prices: Record<string, number> = {
      TYT: 0.05,
      USDT: 1,
      BTC: 95000,
      ETH: 3500
    };
    const usdAmount = amount * prices[asset];

    const { data: campaign } = await supabase
      .from('foundation_campaigns')
      .select('raised_usd')
      .eq('id', campaignId)
      .single();

    if (campaign) {
      const newRaised = (parseFloat(campaign.raised_usd) + usdAmount).toFixed(2);
      await supabase
        .from('foundation_campaigns')
        .update({ raised_usd: newRaised })
        .eq('id', campaignId);
    }

    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return {
      success: true,
      transactionHash: txHash
    };
  } catch (error) {
    console.error('Donation error:', error);
    return { success: false, error: 'Donation failed' };
  }
}
