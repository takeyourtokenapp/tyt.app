import { supabase } from './supabase';

export type WalletAccountType =
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
  account_type: WalletAccountType;
  currency: string;
  network: string | null;
  balance: number;
  locked_balance: number;
  pending_balance: number;
  is_active: boolean;
  metadata: Record<string, any>;
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
  metadata: Record<string, any>;
  created_at: string;
}

export interface FeeBreakdown {
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

export interface DepositResult {
  success: boolean;
  transaction_id: string;
  ledger_batch_id: string;
  amount_deposited: number;
  amount_credited: number;
  fee_rate_bps: number;
  fee_breakdown: {
    total: number;
    total_percent: number;
    protocol: number;
    protocol_percent: number;
    charity: number;
    charity_percent: number;
    academy: number;
    academy_percent: number;
  };
  new_balance: number;
}

export interface WithdrawalResult {
  success: boolean;
  withdrawal_id: string;
  status: 'pending' | 'completed';
  tx_hash?: string;
  amount: number;
  fee: number;
  net_amount: number;
  message: string;
}

export const walletService = {
  async getWalletAccounts(userId: string, currency?: string): Promise<WalletAccount[]> {
    let query = supabase
      .from('wallet_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (currency) {
      query = query.eq('currency', currency);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch wallet accounts:', error);
      throw error;
    }

    return data || [];
  },

  async getMainWallet(userId: string, currency: string): Promise<WalletAccount | null> {
    const { data, error } = await supabase
      .from('wallet_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('account_type', 'user_main')
      .eq('currency', currency)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch main wallet:', error);
      throw error;
    }

    return data;
  },

  async getBalance(userId: string, currency: string): Promise<number> {
    const wallet = await this.getMainWallet(userId, currency);
    return wallet?.balance || 0;
  },

  async getAvailableBalance(userId: string, currency: string): Promise<number> {
    const wallet = await this.getMainWallet(userId, currency);
    if (!wallet) return 0;
    return wallet.balance - wallet.locked_balance;
  },

  async getLedgerHistory(
    userId: string,
    options?: {
      currency?: string;
      entryType?: LedgerEntryType;
      limit?: number;
      offset?: number;
    }
  ): Promise<LedgerEntry[]> {
    let query = supabase
      .from('ledger_entries')
      .select(
        `
        *,
        wallet_accounts!inner(user_id, currency, account_type)
      `
      )
      .eq('wallet_accounts.user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.currency) {
      query = query.eq('currency', options.currency);
    }

    if (options?.entryType) {
      query = query.eq('entry_type', options.entryType);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch ledger history:', error);
      throw error;
    }

    return data || [];
  },

  async calculateDepositFees(amount: number, asset: string): Promise<FeeBreakdown> {
    const { data, error } = await supabase.rpc('calculate_deposit_fees_v3', {
      p_amount: amount,
      p_asset: asset,
    });

    if (error) {
      console.error('Failed to calculate deposit fees:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No fee calculation returned');
    }

    return data[0];
  },

  async processDeposit(
    amount: number,
    asset: string,
    options?: {
      txHash?: string;
      network?: string;
    }
  ): Promise<DepositResult> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-deposit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          asset,
          amount: amount.toString(),
          txHash: options?.txHash,
          network: options?.network,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Deposit failed');
    }

    const result = await response.json();
    return result;
  },

  async processWithdrawal(
    asset: string,
    amount: number,
    destinationAddress: string,
    networkCode?: string
  ): Promise<WithdrawalResult> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-withdrawal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          asset,
          amount,
          destination_address: destinationAddress,
          network_code: networkCode,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Withdrawal failed');
    }

    const result = await response.json();
    return result;
  },

  async getAccountBalanceVerification(userId: string): Promise<
    {
      id: string;
      account_type: WalletAccountType;
      currency: string;
      stored_balance: number;
      computed_balance: number;
      discrepancy: number;
    }[]
  > {
    const { data, error } = await supabase
      .from('account_balance_verification')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch balance verification:', error);
      throw error;
    }

    return data || [];
  },

  async getSystemBalanceSummary(): Promise<
    {
      currency: string;
      account_type: WalletAccountType;
      total_balance: number;
      account_count: number;
    }[]
  > {
    const { data, error } = await supabase
      .from('system_balance_summary')
      .select('*')
      .order('currency', { ascending: true });

    if (error) {
      console.error('Failed to fetch system balance summary:', error);
      throw error;
    }

    return data || [];
  },

  async getTotalBalancesByUser(userId: string): Promise<Record<string, number>> {
    const accounts = await this.getWalletAccounts(userId);

    const balances: Record<string, number> = {};
    accounts.forEach((account) => {
      if (account.account_type === 'user_main') {
        balances[account.currency] = account.balance;
      }
    });

    return balances;
  },

  async subscribeToWalletChanges(
    userId: string,
    callback: (account: WalletAccount) => void
  ) {
    const channel = supabase
      .channel(`wallet-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_accounts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as WalletAccount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async subscribeToPlatformFees(callback: (entry: LedgerEntry) => void) {
    const channel = supabase
      .channel('platform-fees')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ledger_entries',
          filter: 'entry_type=in.(deposit,marketplace_fee,miner_upgrade,charity_donation,academy_payment)',
        },
        (payload) => {
          callback(payload.new as LedgerEntry);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
