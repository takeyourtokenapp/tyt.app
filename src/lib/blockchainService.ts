/**
 * Unified Blockchain Gateway Service
 *
 * Central service for all blockchain interactions across:
 * - Bitcoin (BTC, Lightning, Liquid)
 * - Ethereum & EVM chains (Polygon, BSC)
 * - Solana (SOL)
 * - TRON (TRX)
 * - XRP Ledger (XRP)
 * - TON
 */

import { supabase } from './supabase';
import * as blockchainGateway from '../utils/api/blockchainGateway';
import { bitcoinService } from '../utils/api/bitcoinService';
import type { SupportedNetwork } from '../utils/api/blockchainGateway';

export type { SupportedNetwork, DepositAddress, TransactionStatus } from '../utils/api/blockchainGateway';

export interface BlockchainNetwork {
  network_code: string;
  network_name: string;
  chain_id: string | null;
  native_symbol: string;
  rpc_endpoint: string;
  explorer_url: string;
  min_confirmations: number;
  supports_tokens: boolean;
  is_active: boolean;
}

export interface DepositAddressResponse {
  success: boolean;
  address?: string;
  network_name?: string;
  explorer_url?: string;
  qr_code?: string;
  derivation_path?: string;
  error?: string;
}

export interface WithdrawalLimits {
  min_amount: number;
  max_amount: number;
  daily_limit: number;
  monthly_limit: number;
  requires_approval: boolean;
  kyc_tier_required: number;
}

export class BlockchainService {
  /**
   * Get all active blockchain networks
   */
  async getActiveNetworks(): Promise<BlockchainNetwork[]> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('is_active', true)
      .order('network_name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get specific network configuration
   */
  async getNetwork(networkCode: string): Promise<BlockchainNetwork | null> {
    const { data, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('network_code', networkCode.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Generate deposit address for user
   */
  async generateDepositAddress(
    networkCode: string
  ): Promise<DepositAddressResponse> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-deposit-address`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          network_code: networkCode.toUpperCase(),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate deposit address');
    }

    return await response.json();
  }

  /**
   * Get user's deposit address for a network
   */
  async getUserDepositAddress(
    userId: string,
    networkCode: string
  ): Promise<blockchainGateway.DepositAddress | null> {
    return blockchainGateway.getUserDepositAddress(
      userId,
      networkCode.toLowerCase() as SupportedNetwork
    );
  }

  /**
   * Get user's deposit history
   */
  async getUserDeposits(
    userId: string,
    options: {
      network?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    let query = supabase
      .from('blockchain_deposits')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false });

    if (options.network) {
      query = query.eq('network_code', options.network.toUpperCase());
    }

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      txHash: row.tx_hash,
      network: row.network_code,
      asset: row.asset,
      amount: row.amount,
      amountUsd: row.amount_usd,
      status: row.status,
      confirmations: row.confirmations,
      requiredConfirmations: row.required_confirmations || 1,
      detectedAt: row.detected_at,
      confirmedAt: row.confirmed_at,
      creditedAt: row.credited_at,
      feeCharged: row.fee_charged,
      amountCredited: row.amount_credited,
    }));
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string, networkCode: string) {
    return blockchainGateway.getTransactionStatus(
      txHash,
      networkCode.toLowerCase() as SupportedNetwork
    );
  }

  /**
   * Get withdrawal limits for user
   */
  async getWithdrawalLimits(
    userId: string,
    asset: string
  ): Promise<WithdrawalLimits> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('kyc_level as kyc_tier, kyc_status')
      .eq('id', userId)
      .maybeSingle();

    const kycTier = profile?.kyc_tier || 0;
    const kycStatus = profile?.kyc_status || 'not_submitted';

    // KYC Tier-based limits
    const tierLimits: Record<number, WithdrawalLimits> = {
      0: {
        // No KYC
        min_amount: 10,
        max_amount: 100,
        daily_limit: 100,
        monthly_limit: 500,
        requires_approval: true,
        kyc_tier_required: 1,
      },
      1: {
        // Basic KYC
        min_amount: 10,
        max_amount: 5000,
        daily_limit: 5000,
        monthly_limit: 20000,
        requires_approval: false,
        kyc_tier_required: 1,
      },
      2: {
        // Enhanced KYC
        min_amount: 10,
        max_amount: 50000,
        daily_limit: 50000,
        monthly_limit: 200000,
        requires_approval: false,
        kyc_tier_required: 2,
      },
      3: {
        // VIP
        min_amount: 10,
        max_amount: 500000,
        daily_limit: 500000,
        monthly_limit: 2000000,
        requires_approval: false,
        kyc_tier_required: 3,
      },
    };

    return tierLimits[kycTier] || tierLimits[0];
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(params: {
    asset: string;
    amount: number;
    destinationAddress: string;
    networkCode: string;
  }) {
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
          asset: params.asset,
          amount: params.amount,
          destination_address: params.destinationAddress,
          network_code: params.networkCode,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Withdrawal failed');
    }

    return await response.json();
  }

  /**
   * Get user's withdrawal history
   */
  async getUserWithdrawals(
    userId: string,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    let query = supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      asset: row.asset,
      amount: row.amount,
      feeAmount: row.fee_amount,
      netAmount: row.net_amount,
      destinationAddress: row.destination_address,
      networkCode: row.network_code,
      status: row.status,
      txHash: row.tx_hash,
      requiresApproval: row.requires_approval,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    }));
  }

  /**
   * Validate blockchain address
   */
  validateAddress(address: string, networkCode: string): boolean {
    return blockchainGateway.validateAddress(
      address,
      networkCode.toLowerCase() as SupportedNetwork
    );
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerTxUrl(networkCode: string, txHash: string): string {
    return blockchainGateway.getExplorerTxUrl(
      networkCode.toLowerCase() as SupportedNetwork,
      txHash
    );
  }

  /**
   * Get explorer URL for address
   */
  getExplorerAddressUrl(networkCode: string, address: string): string {
    return blockchainGateway.getExplorerAddressUrl(
      networkCode.toLowerCase() as SupportedNetwork,
      address
    );
  }

  /**
   * Bitcoin-specific: Get user addresses
   */
  async getBitcoinAddresses(userId: string) {
    return bitcoinService.getUserAddresses(userId);
  }

  /**
   * Bitcoin-specific: Get balance
   */
  async getBitcoinBalance(userId: string) {
    return bitcoinService.getUserBalance(userId);
  }

  /**
   * Bitcoin-specific: Get fee estimates
   */
  async getBitcoinFeeEstimates() {
    return bitcoinService.getFeeEstimates();
  }

  /**
   * Bitcoin-specific: Create transaction
   */
  async createBitcoinTransaction(params: {
    userId: string;
    toAddress: string;
    amountSats: number;
    feePriority: 'economy' | 'normal' | 'high' | 'custom';
    customFeeRate?: number;
    enableRBF?: boolean;
  }) {
    return bitcoinService.createTransaction(params);
  }

  /**
   * Subscribe to deposit updates
   */
  subscribeToDeposits(userId: string, callback: (deposit: any) => void) {
    const channel = supabase
      .channel(`deposits-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blockchain_deposits',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to withdrawal updates
   */
  subscribeToWithdrawals(userId: string, callback: (withdrawal: any) => void) {
    const channel = supabase
      .channel(`withdrawals-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawal_requests',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const blockchainService = new BlockchainService();
