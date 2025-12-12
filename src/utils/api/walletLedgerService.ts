import { supabase } from '../../lib/supabase';

export type AccountType =
  | 'user_main'
  | 'user_locked'
  | 'user_staking'
  | 'protocol_fees'
  | 'charity_fund'
  | 'academy_fund'
  | 'burn_pool'
  | 'treasury'
  | 'escrow';

export type LedgerEntryType =
  | 'deposit'
  | 'withdrawal'
  | 'reward'
  | 'maintenance_fee'
  | 'marketplace_fee'
  | 'miner_purchase'
  | 'miner_upgrade'
  | 'charity_donation'
  | 'academy_payment'
  | 'burn'
  | 'staking_lock'
  | 'staking_unlock'
  | 'referral_commission'
  | 'internal_transfer'
  | 'adjustment';

export interface WalletAccount {
  id: string;
  user_id: string | null;
  account_type: AccountType;
  currency: string;
  network: string | null;
  balance: number;
  locked_balance: number;
  pending_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  entry_batch_id: string;
  account_id: string;
  entry_type: LedgerEntryType;
  debit: number;
  credit: number;
  balance_after: number;
  currency: string;
  ref_type: string;
  ref_id: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AccountBalance {
  currency: string;
  network: string | null;
  available: number;
  locked: number;
  pending: number;
  total: number;
}

export interface FeeDistribution {
  protocol_share_bps: number;
  charity_share_bps: number;
  academy_share_bps: number;
  burn_share_bps: number;
}

export async function getUserAccounts(userId: string): Promise<WalletAccount[]> {
  const { data, error } = await supabase
    .from('wallet_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('currency');

  if (error) throw error;
  return data || [];
}

export async function getAccountBalances(userId: string): Promise<AccountBalance[]> {
  const accounts = await getUserAccounts(userId);

  const balanceMap = new Map<string, AccountBalance>();

  for (const account of accounts) {
    if (account.account_type !== 'user_main') continue;

    const key = `${account.currency}-${account.network || 'default'}`;
    const existing = balanceMap.get(key);

    if (existing) {
      existing.available += account.balance;
      existing.locked += account.locked_balance;
      existing.pending += account.pending_balance;
      existing.total = existing.available + existing.locked + existing.pending;
    } else {
      balanceMap.set(key, {
        currency: account.currency,
        network: account.network,
        available: account.balance,
        locked: account.locked_balance,
        pending: account.pending_balance,
        total: account.balance + account.locked_balance + account.pending_balance
      });
    }
  }

  return Array.from(balanceMap.values());
}

export async function getLedgerHistory(
  userId: string,
  options: {
    currency?: string;
    entryType?: LedgerEntryType;
    limit?: number;
    offset?: number;
  } = {}
): Promise<LedgerEntry[]> {
  const { currency, entryType, limit = 50, offset = 0 } = options;

  let query = supabase
    .from('ledger_entries')
    .select(`
      *,
      wallet_accounts!inner(user_id, currency)
    `)
    .eq('wallet_accounts.user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (currency) {
    query = query.eq('currency', currency);
  }

  if (entryType) {
    query = query.eq('entry_type', entryType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getFeeDistribution(feeType: string): Promise<FeeDistribution | null> {
  const { data, error } = await supabase
    .from('fee_distribution_config')
    .select('*')
    .eq('fee_type', feeType)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function calculateFeeShares(
  amount: number,
  distribution: FeeDistribution
): {
  protocol: number;
  charity: number;
  academy: number;
  burn: number;
} {
  return {
    protocol: (amount * distribution.protocol_share_bps) / 10000,
    charity: (amount * distribution.charity_share_bps) / 10000,
    academy: (amount * distribution.academy_share_bps) / 10000,
    burn: (amount * distribution.burn_share_bps) / 10000
  };
}

export async function getChainObserverStatus(): Promise<{
  network: string;
  is_active: boolean;
  last_processed_block: number;
  health_status: string;
  last_health_check: string | null;
}[]> {
  const { data, error } = await supabase
    .from('chain_observer_config')
    .select('network, is_active, last_processed_block, health_status, last_health_check')
    .order('network');

  if (error) throw error;
  return data || [];
}

export async function getRecentOnchainEvents(
  network?: string,
  limit: number = 20
): Promise<{
  id: string;
  network: string;
  tx_hash: string;
  event_type: string;
  amount: number | null;
  status: string;
  detected_at: string;
}[]> {
  let query = supabase
    .from('onchain_events')
    .select('id, network, tx_hash, event_type, amount, status, detected_at')
    .order('detected_at', { ascending: false })
    .limit(limit);

  if (network) {
    query = query.eq('network', network);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function verifyAccountBalance(accountId: string): Promise<{
  stored_balance: number;
  computed_balance: number;
  is_valid: boolean;
  discrepancy: number;
}> {
  const { data, error } = await supabase
    .from('account_balance_verification')
    .select('*')
    .eq('id', accountId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    return {
      stored_balance: 0,
      computed_balance: 0,
      is_valid: true,
      discrepancy: 0
    };
  }

  return {
    stored_balance: data.stored_balance,
    computed_balance: data.computed_balance,
    is_valid: data.discrepancy === 0,
    discrepancy: data.discrepancy
  };
}

export async function getSystemBalanceSummary(): Promise<{
  currency: string;
  account_type: AccountType;
  total_balance: number;
  account_count: number;
}[]> {
  const { data, error } = await supabase
    .from('system_balance_summary')
    .select('*');

  if (error) throw error;
  return data || [];
}
