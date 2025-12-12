import { supabase } from '../lib/supabase';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'mining_reward'
  | 'maintenance_payment'
  | 'nft_purchase'
  | 'nft_sale'
  | 'marketplace_buy'
  | 'marketplace_sell'
  | 'upgrade'
  | 'reinvest'
  | 'foundation_donation'
  | 'referral_bonus'
  | 'staking_reward';

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  blockchain?: string;
  tx_hash?: string;
  from_address?: string;
  to_address?: string;
  miner_id?: string;
  metadata?: Record<string, any>;
  description: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TransactionFilters {
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus | TransactionStatus[];
  currency?: string;
  blockchain?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class TransactionService {
  /**
   * Get transaction history for a user
   */
  static async getUserTransactions(
    userId: string,
    filters?: TransactionFilters
  ): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type);
        } else {
          query = query.eq('type', filters.type);
        }
      }

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.currency) {
        query = query.eq('currency', filters.currency);
      }

      if (filters?.blockchain) {
        query = query.eq('blockchain', filters.blockchain);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      // Pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      return { data, error };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { data: null, error };
    }
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(
    transactionId: string
  ): Promise<{ data: Transaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .maybeSingle();

      return { data, error };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return { data: null, error };
    }
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(
    transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: Transaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { data: null, error };
    }
  }

  /**
   * Update transaction status
   */
  static async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<{ data: Transaction | null; error: any }> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (metadata) {
        updateData.metadata = metadata;
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { data: null, error };
    }
  }

  /**
   * Get transaction statistics for a user
   */
  static async getUserTransactionStats(userId: string): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalMiningRewards: number;
    totalMaintenancePaid: number;
    totalNFTPurchases: number;
    totalNFTSales: number;
    foundationContributions: number;
  }> {
    try {
      const { data: transactions } = await this.getUserTransactions(userId, {
        status: 'completed'
      });

      if (!transactions) {
        return {
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalMiningRewards: 0,
          totalMaintenancePaid: 0,
          totalNFTPurchases: 0,
          totalNFTSales: 0,
          foundationContributions: 0
        };
      }

      const stats = transactions.reduce(
        (acc, tx) => {
          switch (tx.type) {
            case 'deposit':
              acc.totalDeposits += tx.amount;
              break;
            case 'withdrawal':
              acc.totalWithdrawals += tx.amount;
              break;
            case 'mining_reward':
              acc.totalMiningRewards += tx.amount;
              break;
            case 'maintenance_payment':
              acc.totalMaintenancePaid += tx.amount;
              break;
            case 'nft_purchase':
            case 'marketplace_buy':
              acc.totalNFTPurchases += tx.amount;
              break;
            case 'nft_sale':
            case 'marketplace_sell':
              acc.totalNFTSales += tx.amount;
              break;
            case 'foundation_donation':
              acc.foundationContributions += tx.amount;
              break;
          }
          return acc;
        },
        {
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalMiningRewards: 0,
          totalMaintenancePaid: 0,
          totalNFTPurchases: 0,
          totalNFTSales: 0,
          foundationContributions: 0
        }
      );

      return stats;
    } catch (error) {
      console.error('Error calculating transaction stats:', error);
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalMiningRewards: 0,
        totalMaintenancePaid: 0,
        totalNFTPurchases: 0,
        totalNFTSales: 0,
        foundationContributions: 0
      };
    }
  }

  /**
   * Get recent transactions (last 10)
   */
  static async getRecentTransactions(
    userId: string
  ): Promise<{ data: Transaction[] | null; error: any }> {
    return this.getUserTransactions(userId, { limit: 10 });
  }

  /**
   * Get pending transactions
   */
  static async getPendingTransactions(
    userId: string
  ): Promise<{ data: Transaction[] | null; error: any }> {
    return this.getUserTransactions(userId, {
      status: ['pending', 'processing'],
      limit: 20
    });
  }

  /**
   * Cancel a pending transaction
   */
  static async cancelTransaction(
    transactionId: string
  ): Promise<{ data: Transaction | null; error: any }> {
    try {
      // Check if transaction can be cancelled
      const { data: tx, error: fetchError } = await this.getTransactionById(transactionId);

      if (fetchError || !tx) {
        return { data: null, error: fetchError || new Error('Transaction not found') };
      }

      if (tx.status !== 'pending' && tx.status !== 'processing') {
        return {
          data: null,
          error: new Error('Transaction cannot be cancelled in current status')
        };
      }

      // Update to cancelled
      return this.updateTransactionStatus(transactionId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      return { data: null, error };
    }
  }

  /**
   * Export transactions to CSV
   */
  static async exportTransactionsToCSV(
    userId: string,
    filters?: TransactionFilters
  ): Promise<string> {
    const { data: transactions } = await this.getUserTransactions(userId, filters);

    if (!transactions || transactions.length === 0) {
      return 'No transactions found';
    }

    // CSV Headers
    const headers = [
      'Date',
      'Type',
      'Status',
      'Amount',
      'Currency',
      'Blockchain',
      'TX Hash',
      'Description'
    ];

    // CSV Rows
    const rows = transactions.map(tx => [
      new Date(tx.created_at).toLocaleString(),
      tx.type,
      tx.status,
      tx.amount.toString(),
      tx.currency,
      tx.blockchain || '',
      tx.tx_hash || '',
      tx.description
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Get transaction type display name
   */
  static getTransactionTypeDisplay(type: TransactionType): string {
    const displayNames: Record<TransactionType, string> = {
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      mining_reward: 'Mining Reward',
      maintenance_payment: 'Maintenance Payment',
      nft_purchase: 'NFT Purchase',
      nft_sale: 'NFT Sale',
      marketplace_buy: 'Marketplace Purchase',
      marketplace_sell: 'Marketplace Sale',
      upgrade: 'Miner Upgrade',
      reinvest: 'Auto Reinvest',
      foundation_donation: 'Foundation Donation',
      referral_bonus: 'Referral Bonus',
      staking_reward: 'Staking Reward'
    };

    return displayNames[type] || type;
  }

  /**
   * Get transaction status display
   */
  static getTransactionStatusDisplay(status: TransactionStatus): {
    label: string;
    color: string;
  } {
    const displays: Record<TransactionStatus, { label: string; color: string }> = {
      pending: { label: 'Pending', color: 'yellow' },
      processing: { label: 'Processing', color: 'blue' },
      completed: { label: 'Completed', color: 'green' },
      failed: { label: 'Failed', color: 'red' },
      cancelled: { label: 'Cancelled', color: 'gray' }
    };

    return displays[status] || { label: status, color: 'gray' };
  }

  /**
   * Format transaction amount with currency
   */
  static formatAmount(amount: number, currency: string): string {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else if (currency === 'USD' || currency === 'USDT') {
      return `$${amount.toFixed(2)}`;
    } else if (currency === 'TYT') {
      return `${amount.toLocaleString()} TYT`;
    } else {
      return `${amount} ${currency}`;
    }
  }

  /**
   * Get blockchain explorer URL for transaction
   */
  static getBlockchainExplorerUrl(blockchain: string, txHash: string): string | null {
    const explorers: Record<string, string> = {
      bitcoin: `https://blockchain.info/tx/${txHash}`,
      ethereum: `https://etherscan.io/tx/${txHash}`,
      polygon: `https://polygonscan.com/tx/${txHash}`,
      solana: `https://solscan.io/tx/${txHash}`,
      tron: `https://tronscan.org/#/transaction/${txHash}`,
      xrp: `https://xrpscan.com/tx/${txHash}`,
      ton: `https://tonscan.org/tx/${txHash}`
    };

    return explorers[blockchain.toLowerCase()] || null;
  }
}

export default TransactionService;
