/**
 * Payment Provider Service - Integration with Ramp Network
 *
 * This service handles fiat on-ramp for buying crypto with credit cards.
 * Before using in production, set up Ramp Network account.
 *
 * Setup:
 * 1. Sign up at https://ramp.network/
 * 2. Create app and get API key
 * 3. Add to .env:
 *    VITE_RAMP_HOST_API_KEY=your_key
 * 4. Configure webhook URL in Ramp dashboard
 */

import { supabase } from '@/lib/supabase';

export interface PaymentSession {
  id: string;
  user_id: string;
  provider: 'ramp' | 'moonpay' | 'transak';
  amount_usd: number;
  crypto_amount: number;
  crypto_currency: string;
  destination_address: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  provider_id: string | null;
  created_at: string;
  completed_at: string | null;
  metadata: Record<string, any>;
}

/**
 * Initialize Ramp Network widget
 * Opens modal for buying crypto with credit card
 */
export async function initializeRampPurchase(params: {
  userAddress: string;
  assetSymbol?: string;
  amount?: number;
  userId: string;
}): Promise<void> {
  try {
    // Check if Ramp SDK is loaded
    if (typeof window === 'undefined' || !(window as any).RampInstantSDK) {
      throw new Error('Ramp SDK not loaded');
    }

    const RampInstantSDK = (window as any).RampInstantSDK;

    // Get webhook URL for purchase confirmation
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const webhookUrl = `${supabaseUrl}/functions/v1/ramp-webhook`;

    // Create purchase session in database
    const { data: session, error } = await supabase
      .from('payment_sessions')
      .insert({
        user_id: params.userId,
        provider: 'ramp',
        crypto_currency: params.assetSymbol || 'MATIC_POLYGON',
        destination_address: params.userAddress,
        amount_usd: params.amount || 0,
        status: 'pending',
        metadata: {
          initiated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) throw error;

    // Initialize Ramp widget
    new RampInstantSDK({
      hostAppName: 'TYT Platform',
      hostLogoUrl: `${window.location.origin}/logo.png`,

      // Asset configuration
      swapAsset: params.assetSymbol || 'MATIC_POLYGON',
      swapAmount: params.amount?.toString(),

      // User configuration
      userAddress: params.userAddress,

      // Webhook for status updates
      webhookStatusUrl: webhookUrl,

      // API key
      hostApiKey: import.meta.env.VITE_RAMP_HOST_API_KEY,

      // Appearance
      variant: 'auto',

      // Callbacks
      onSuccess: async (payload: any) => {
        console.log('Ramp purchase successful:', payload);

        await supabase
          .from('payment_sessions')
          .update({
            status: 'completed',
            provider_id: payload.purchaseId,
            crypto_amount: parseFloat(payload.cryptoAmount),
            completed_at: new Date().toISOString(),
            metadata: { ...session.metadata, success_payload: payload }
          })
          .eq('id', session.id);
      },

      onClose: async () => {
        console.log('Ramp widget closed');
      }
    }).show();

  } catch (error) {
    console.error('Error initializing Ramp purchase:', error);
    throw error;
  }
}

/**
 * Get payment session status
 */
export async function getPaymentSession(sessionId: string): Promise<PaymentSession | null> {
  try {
    const { data, error } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error getting payment session:', error);
    return null;
  }
}

/**
 * Get user payment history
 */
export async function getUserPaymentHistory(userId: string): Promise<PaymentSession[]> {
  try {
    const { data, error } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];

  } catch (error) {
    console.error('Error getting payment history:', error);
    return [];
  }
}

/**
 * Get supported assets for purchase
 */
export function getSupportedAssets(): Array<{
  symbol: string;
  name: string;
  network: string;
  minAmount: number;
  maxAmount: number;
}> {
  return [
    {
      symbol: 'MATIC_POLYGON',
      name: 'Polygon (MATIC)',
      network: 'Polygon',
      minAmount: 20,
      maxAmount: 10000
    },
    {
      symbol: 'USDT_POLYGON',
      name: 'Tether (USDT)',
      network: 'Polygon',
      minAmount: 20,
      maxAmount: 10000
    },
    {
      symbol: 'USDC_POLYGON',
      name: 'USD Coin (USDC)',
      network: 'Polygon',
      minAmount: 20,
      maxAmount: 10000
    },
    {
      symbol: 'ETH_ETHEREUM',
      name: 'Ethereum (ETH)',
      network: 'Ethereum',
      minAmount: 50,
      maxAmount: 10000
    },
    {
      symbol: 'SOL_SOLANA',
      name: 'Solana (SOL)',
      network: 'Solana',
      minAmount: 20,
      maxAmount: 10000
    }
  ];
}

/**
 * Calculate fees for purchase
 */
export function calculatePurchaseFees(amountUSD: number): {
  amountUSD: number;
  rampFee: number;
  networkFee: number;
  totalFee: number;
  totalCost: number;
} {
  // Ramp Network fees (approximate, actual fees may vary)
  const rampFeePercent = 0.025; // 2.5%
  const networkFee = 2; // $2 fixed

  const rampFee = amountUSD * rampFeePercent;
  const totalFee = rampFee + networkFee;
  const totalCost = amountUSD + totalFee;

  return {
    amountUSD,
    rampFee: parseFloat(rampFee.toFixed(2)),
    networkFee,
    totalFee: parseFloat(totalFee.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2))
  };
}

/**
 * Mock payment for development (DO NOT USE IN PRODUCTION!)
 */
export async function mockPaymentCompletion(userId: string, amountUSD: number): Promise<PaymentSession> {
  if (import.meta.env.PROD) {
    throw new Error('Mock payment not allowed in production');
  }

  const { data, error } = await supabase
    .from('payment_sessions')
    .insert({
      user_id: userId,
      provider: 'ramp',
      amount_usd: amountUSD,
      crypto_amount: amountUSD * 0.5, // Mock conversion rate
      crypto_currency: 'MATIC_POLYGON',
      destination_address: '0xMOCK_ADDRESS',
      status: 'completed',
      provider_id: 'MOCK_' + Date.now(),
      completed_at: new Date().toISOString(),
      metadata: { mock: true }
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
