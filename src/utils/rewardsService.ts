/**
 * Rewards Engine Service
 *
 * Manages daily BTC reward distribution with Merkle proofs.
 * Handles reward queries, proof generation, and on-chain claiming.
 */

import { supabase } from '../lib/supabase';
import { buildMerkleTree, generateMerkleProof, type MerkleLeaf, type MerkleProof } from './merkleTree';

export interface RewardPool {
  date: string;
  gross_btc: number;
  btc_price_usd: number;
  total_hashrate_th: number;
  merkle_root: string | null;
  distributed_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DailyReward {
  id: string;
  date: string;
  miner_id: string;
  user_id: string;
  gross_btc: number;
  maintenance_btc: number;
  elec_usd: number;
  service_usd: number;
  discount_pct: number;
  net_btc: number;
  reinvest_btc: number;
  charity_btc: number;
  user_btc: number;
  proof_leaf: string | null;
  merkle_index: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DailyRewardWithMiner extends DailyReward {
  miner: {
    token_id: string;
    name: string;
    hashrate: number;
    efficiency: number;
  };
}

export interface RewardClaim {
  id: string;
  reward_id: string;
  user_id: string;
  amount_btc: number;
  transaction_hash: string | null;
  blockchain: string;
  claimed_at: string;
  metadata: Record<string, any>;
}

export interface RewardsSummary {
  total_gross_btc: number;
  total_maintenance_btc: number;
  total_net_btc: number;
  total_reinvest_btc: number;
  total_charity_btc: number;
  total_user_btc: number;
  reward_count: number;
  start_date: string | null;
  end_date: string | null;
}

export class RewardsService {
  /**
   * Get reward pool for a specific date
   */
  async getRewardPool(date: string): Promise<RewardPool | null> {
    const { data, error } = await supabase
      .from('reward_pools')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get all reward pools
   */
  async getAllRewardPools(limit = 30): Promise<RewardPool[]> {
    const { data, error } = await supabase
      .from('reward_pools')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's daily rewards
   */
  async getUserDailyRewards(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
      includeMiner?: boolean;
    } = {}
  ): Promise<DailyReward[] | DailyRewardWithMiner[]> {
    const { limit = 30, offset = 0, startDate, endDate, includeMiner = false } = options;

    let query = supabase
      .from('daily_rewards')
      .select(includeMiner ? '*, miner:nft_miners(token_id, name, hashrate, efficiency)' : '*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get rewards for a specific date
   */
  async getUserRewardsByDate(userId: string, date: string): Promise<jsonb> {
    const { data, error } = await supabase.rpc('get_user_daily_rewards', {
      p_user_id: userId,
      p_date: date,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get miner's total rewards
   */
  async getMinerTotalRewards(
    minerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<RewardsSummary> {
    const { data, error } = await supabase.rpc('get_miner_total_rewards', {
      p_miner_id: minerId,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
    });

    if (error) throw error;
    return data as RewardsSummary;
  }

  /**
   * Get user's reward summary
   */
  async getUserRewardsSummary(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('v_user_rewards_summary_v2')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get miner's reward summary
   */
  async getMinerRewardsSummary(minerId: string): Promise<any> {
    const { data, error } = await supabase
      .from('v_miner_rewards_summary_v2')
      .select('*')
      .eq('miner_id', minerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get reward by ID
   */
  async getReward(rewardId: string, includeMiner = false): Promise<DailyReward | DailyRewardWithMiner | null> {
    const { data, error } = await supabase
      .from('daily_rewards')
      .select(includeMiner ? '*, miner:nft_miners(token_id, name, hashrate, efficiency)' : '*')
      .eq('id', rewardId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Generate Merkle proof for a reward
   */
  async generateMerkleProof(minerId: string, date: string): Promise<MerkleProof | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-merkle-proof`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ miner_id: minerId, date }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate proof');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating Merkle proof:', error);
      throw error;
    }
  }

  /**
   * Get reward claims for a user
   */
  async getUserClaims(userId: string, limit = 50): Promise<RewardClaim[]> {
    const { data, error } = await supabase
      .from('reward_claims')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Record a claim
   */
  async recordClaim(
    rewardId: string,
    amountBtc: number,
    transactionHash: string,
    blockchain = 'polygon'
  ): Promise<RewardClaim> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('reward_claims')
      .insert({
        reward_id: rewardId,
        user_id: session.session.user.id,
        amount_btc: amountBtc,
        transaction_hash: transactionHash,
        blockchain,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Calculate reward share
   */
  async calculateRewardShare(
    minerHashrate: number,
    totalHashrate: number,
    poolBtc: number
  ): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_reward_share', {
      p_miner_hashrate: minerHashrate,
      p_total_hashrate: totalHashrate,
      p_pool_btc: poolBtc,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get recent reward pools with distribution status
   */
  async getRecentPools(limit = 7): Promise<RewardPool[]> {
    const { data, error } = await supabase
      .from('reward_pools')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Check if rewards have been distributed for a date
   */
  async isDistributed(date: string): Promise<boolean> {
    const { data } = await supabase
      .from('reward_pools')
      .select('distributed_at')
      .eq('date', date)
      .maybeSingle();

    return !!data?.distributed_at;
  }

  /**
   * Get total rewards distributed (all time)
   */
  async getTotalDistributed(): Promise<{
    total_pools: number;
    total_btc: number;
    total_usd: number;
  }> {
    const { data, error } = await supabase
      .from('reward_pools')
      .select('gross_btc, btc_price_usd')
      .not('distributed_at', 'is', null);

    if (error) throw error;

    const total_pools = data?.length || 0;
    const total_btc = data?.reduce((sum, pool) => sum + Number(pool.gross_btc), 0) || 0;
    const total_usd = data?.reduce(
      (sum, pool) => sum + Number(pool.gross_btc) * Number(pool.btc_price_usd),
      0
    ) || 0;

    return { total_pools, total_btc, total_usd };
  }

  /**
   * Subscribe to reward updates (real-time)
   */
  subscribeToUserRewards(userId: string, callback: (reward: DailyReward) => void) {
    const channel = supabase
      .channel(`rewards-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'daily_rewards',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as DailyReward);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get reward history with pagination
   */
  async getRewardHistory(params: {
    userId?: string;
    minerId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    data: DailyRewardWithMiner[];
    count: number;
  }> {
    const { userId, minerId, startDate, endDate, limit = 30, offset = 0 } = params;

    let query = supabase
      .from('daily_rewards')
      .select('*, miner:nft_miners(token_id, name, hashrate, efficiency)', { count: 'exact' })
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (minerId) {
      query = query.eq('miner_id', minerId);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
    };
  }

  /**
   * Estimate future rewards
   */
  estimateDailyReward(params: {
    hashrateTH: number;
    efficiencyWTH: number;
    region: string;
    totalPlatformHashrate: number;
    dailyPoolBTC: number;
    btcPriceUSD: number;
    vipLevel?: number;
    prepayDays?: number;
    vetytPower?: number;
    totalVetyt?: number;
    serviceButton?: boolean;
  }): {
    gross_btc: number;
    gross_usd: number;
    maintenance_usd: number;
    maintenance_btc: number;
    net_btc: number;
    net_usd: number;
    monthly_btc: number;
    monthly_usd: number;
    yearly_btc: number;
    yearly_usd: number;
  } {
    const share = params.hashrateTH / params.totalPlatformHashrate;
    const gross_btc = params.dailyPoolBTC * share;
    const gross_usd = gross_btc * params.btcPriceUSD;

    const maintenance_usd = 10;
    const maintenance_btc = maintenance_usd / params.btcPriceUSD;

    const net_btc = Math.max(0, gross_btc - maintenance_btc);
    const net_usd = net_btc * params.btcPriceUSD;

    return {
      gross_btc,
      gross_usd,
      maintenance_usd,
      maintenance_btc,
      net_btc,
      net_usd,
      monthly_btc: net_btc * 30,
      monthly_usd: net_usd * 30,
      yearly_btc: net_btc * 365,
      yearly_usd: net_usd * 365,
    };
  }
}

export const rewardsService = new RewardsService();
