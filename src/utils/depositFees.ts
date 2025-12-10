import { supabase } from '../lib/supabase';

export interface FeeBreakdown {
  fee_total: number;
  amount_user: number;
  fee_protocol: number;
  fee_charity: number;
  fee_academy: number;
}

export interface DepositResult {
  success: boolean;
  transaction_id?: string;
  amount_deposited?: number;
  amount_credited?: number;
  fee_breakdown?: FeeBreakdown;
  new_balance?: number;
  error?: string;
}

/**
 * Calculate deposit fees using the 60/30/10 split model
 * 60% → Protocol Revenue
 * 30% → Charity (детский фонд рака мозга)
 * 10% → Academy
 */
export async function calculateDepositFees(
  amount: number,
  asset: string
): Promise<FeeBreakdown | null> {
  try {
    const { data, error } = await supabase
      .rpc('calculate_deposit_fees', {
        p_amount: amount,
        p_asset: asset
      });

    if (error) {
      console.error('Fee calculation error:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Fee calculation failed:', error);
    return null;
  }
}

/**
 * Process deposit with automatic fee split
 */
export async function processDeposit(
  asset: string,
  amount: number,
  txHash?: string
): Promise<DepositResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-deposit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          asset,
          amount: amount.toString(),
          txHash
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Deposit failed'
      };
    }

    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('Deposit processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deposit failed'
    };
  }
}

/**
 * Get deposit fee configuration
 */
export async function getDepositFeeConfig(asset: string) {
  const feeKey = ['USDT', 'USDC', 'DAI'].includes(asset)
    ? 'deposit.stables'
    : 'deposit.crypto';

  const { data, error } = await supabase
    .from('fee_configurations')
    .select('*')
    .eq('fee_key', feeKey)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch fee config:', error);
    return null;
  }

  return data;
}

/**
 * Format fee breakdown for display
 */
export function formatFeeBreakdown(fees: FeeBreakdown, asset: string) {
  return {
    total: {
      label: 'Total Fee (1%)',
      value: fees.fee_total,
      formatted: `${fees.fee_total.toFixed(8)} ${asset}`
    },
    protocol: {
      label: 'Protocol Operations (60%)',
      value: fees.fee_protocol,
      formatted: `${fees.fee_protocol.toFixed(8)} ${asset}`,
      description: 'Platform development and maintenance'
    },
    charity: {
      label: 'Children\'s Brain Cancer Foundation (30%)',
      value: fees.fee_charity,
      formatted: `${fees.fee_charity.toFixed(8)} ${asset}`,
      description: 'Research grants and family support'
    },
    academy: {
      label: 'Digital Academy (10%)',
      value: fees.fee_academy,
      formatted: `${fees.fee_academy.toFixed(8)} ${asset}`,
      description: 'Educational content and certifications'
    },
    userReceives: {
      label: 'You Receive',
      value: fees.amount_user,
      formatted: `${fees.amount_user.toFixed(8)} ${asset}`
    }
  };
}

/**
 * Get charity and academy flow statistics
 */
export async function getCharitySummary(
  startDate?: string,
  endDate?: string
) {
  try {
    const { data, error } = await supabase
      .rpc('get_charity_summary', {
        p_start_date: startDate || null,
        p_end_date: endDate || new Date().toISOString()
      });

    if (error) {
      console.error('Failed to fetch charity summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Charity summary error:', error);
    return null;
  }
}

/**
 * Get recent charity flows
 */
export async function getRecentCharityFlows(limit = 10) {
  const { data, error } = await supabase
    .from('charity_flows')
    .select(`
      *,
      profiles:user_id (username, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch charity flows:', error);
    return null;
  }

  return data;
}
