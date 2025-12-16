/**
 * Miner Registry Service
 *
 * Manages NFT miners synced from blockchain to database.
 * Provides CRUD operations and queries for miner management.
 */

import { supabase } from './supabase';

export type MinerStatus = 'active' | 'inactive' | 'maintenance' | 'listed_for_sale';
export type UpgradeType = 'hashrate' | 'efficiency' | 'power_level';

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  contract_address: string | null;
  total_supply: number;
  minted_supply: number;
  base_hashrate: number;
  base_efficiency: number;
  base_maintenance_rate: number;
  floor_price: number | null;
  floor_price_currency: string;
  is_active: boolean;
  image_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface NFTMiner {
  id: string;
  token_id: string;
  owner_id: string;
  collection_id: string;
  name: string;
  hashrate: number;
  efficiency: number;
  power_level: number;
  maintenance_rate: number;
  farm_id: string | null;
  purchase_price: number | null;
  purchase_currency: string;
  purchased_at: string;
  last_reward_at: string | null;
  last_maintenance_paid_at: string | null;
  total_rewards_btc: number;
  total_maintenance_paid: number;
  status: MinerStatus;
  is_listed: boolean;
  listed_price: number | null;
  metadata_uri: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MinerUpgrade {
  id: string;
  miner_id: string;
  user_id: string;
  upgrade_type: UpgradeType;
  from_value: number;
  to_value: number;
  cost: number;
  cost_currency: string;
  transaction_id: string | null;
  created_at: string;
}

export interface DataCenter {
  id: string;
  name: string;
  location: string;
  country_code: string | null;
  latitude: number | null;
  longitude: number | null;
  kwh_rate: number;
  total_capacity_th: number;
  used_capacity_th: number;
  live_stream_url: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MinerWithCollection extends NFTMiner {
  collection: NFTCollection;
}

export class MinerService {
  /**
   * Get all active NFT collections
   */
  async getCollections(): Promise<NFTCollection[]> {
    const { data, error } = await supabase
      .from('nft_collections')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get collection by ID
   */
  async getCollection(collectionId: string): Promise<NFTCollection | null> {
    const { data, error } = await supabase
      .from('nft_collections')
      .select('*')
      .eq('id', collectionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get collection by contract address
   */
  async getCollectionByAddress(contractAddress: string): Promise<NFTCollection | null> {
    const { data, error } = await supabase
      .from('nft_collections')
      .select('*')
      .eq('contract_address', contractAddress)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's miners
   */
  async getUserMiners(userId: string, options: {
    status?: MinerStatus;
    includeCollection?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<NFTMiner[] | MinerWithCollection[]> {
    const { status, includeCollection = false, limit = 50, offset = 0 } = options;

    let query = supabase
      .from('nft_miners')
      .select(includeCollection ? '*, collection:nft_collections(*)' : '*')
      .eq('owner_id', userId)
      .order('hashrate', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get single miner by ID
   */
  async getMiner(minerId: string, includeCollection = false): Promise<NFTMiner | MinerWithCollection | null> {
    const { data, error } = await supabase
      .from('nft_miners')
      .select(includeCollection ? '*, collection:nft_collections(*)' : '*')
      .eq('id', minerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get miner by token ID
   */
  async getMinerByTokenId(tokenId: string, includeCollection = false): Promise<NFTMiner | MinerWithCollection | null> {
    const { data, error } = await supabase
      .from('nft_miners')
      .select(includeCollection ? '*, collection:nft_collections(*)' : '*')
      .eq('token_id', tokenId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get miners listed for sale (marketplace)
   */
  async getListedMiners(options: {
    minHashrate?: number;
    maxHashrate?: number;
    minEfficiency?: number;
    maxEfficiency?: number;
    maxPrice?: number;
    collectionId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<MinerWithCollection[]> {
    const {
      minHashrate,
      maxHashrate,
      minEfficiency,
      maxEfficiency,
      maxPrice,
      collectionId,
      limit = 50,
      offset = 0,
    } = options;

    let query = supabase
      .from('nft_miners')
      .select('*, collection:nft_collections(*)')
      .eq('is_listed', true)
      .order('listed_price', { ascending: true })
      .range(offset, offset + limit - 1);

    if (minHashrate) query = query.gte('hashrate', minHashrate);
    if (maxHashrate) query = query.lte('hashrate', maxHashrate);
    if (minEfficiency) query = query.gte('efficiency', minEfficiency);
    if (maxEfficiency) query = query.lte('efficiency', maxEfficiency);
    if (maxPrice) query = query.lte('listed_price', maxPrice);
    if (collectionId) query = query.eq('collection_id', collectionId);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Update miner settings (owner only)
   */
  async updateMinerSettings(
    minerId: string,
    settings: {
      status?: MinerStatus;
      is_listed?: boolean;
      listed_price?: number | null;
    }
  ): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('nft_miners')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', minerId)
      .eq('owner_id', session.session.user.id);

    if (error) throw error;
  }

  /**
   * List miner for sale
   */
  async listMinerForSale(minerId: string, price: number): Promise<void> {
    await this.updateMinerSettings(minerId, {
      is_listed: true,
      listed_price: price,
      status: 'listed_for_sale',
    });
  }

  /**
   * Unlist miner from sale
   */
  async unlistMiner(minerId: string): Promise<void> {
    await this.updateMinerSettings(minerId, {
      is_listed: false,
      listed_price: null,
      status: 'active',
    });
  }

  /**
   * Get miner upgrade history
   */
  async getMinerUpgrades(minerId: string, limit = 50): Promise<MinerUpgrade[]> {
    const { data, error } = await supabase
      .from('miner_upgrades')
      .select('*')
      .eq('miner_id', minerId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's upgrade history
   */
  async getUserUpgrades(userId: string, limit = 50): Promise<MinerUpgrade[]> {
    const { data, error } = await supabase
      .from('miner_upgrades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all data centers
   */
  async getDataCenters(): Promise<DataCenter[]> {
    const { data, error } = await supabase
      .from('data_centers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get data center by ID
   */
  async getDataCenter(dataCenterId: string): Promise<DataCenter | null> {
    const { data, error } = await supabase
      .from('data_centers')
      .select('*')
      .eq('id', dataCenterId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Register user's blockchain address for NFT sync
   */
  async registerBlockchainAddress(
    blockchain: string,
    address: string,
    isPrimary = false
  ): Promise<string> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.rpc('register_user_address', {
      p_user_id: session.session.user.id,
      p_blockchain: blockchain,
      p_address: address,
      p_address_type: null,
      p_is_primary: isPrimary,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get user's registered blockchain addresses
   */
  async getUserBlockchainAddresses(userId: string): Promise<{
    id: string;
    blockchain: string;
    address: string;
    is_primary: boolean;
    is_verified: boolean;
    last_used_at: string | null;
  }[]> {
    const { data, error } = await supabase
      .from('user_blockchain_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Calculate daily BTC reward for a miner
   */
  calculateDailyBTCReward(
    hashrate: number,
    efficiency: number,
    networkHashrate = 400000000,
    blockReward = 3.125,
    blocksPerDay = 144
  ): number {
    const dailyBTC = (hashrate / networkHashrate) * (blockReward * blocksPerDay);
    const efficiencyMultiplier = 25.0 / Math.max(efficiency, 1);
    return dailyBTC * efficiencyMultiplier;
  }

  /**
   * Calculate daily maintenance cost for a miner
   */
  calculateDailyMaintenance(
    hashrate: number,
    efficiency: number,
    kwhRate = 0.05,
    btcPriceUSD = 40000
  ): number {
    const dailyKWh = (efficiency * hashrate * 24) / 1000.0;
    return dailyKWh * kwhRate;
  }

  /**
   * Calculate miner ROI
   */
  calculateROI(
    purchasePrice: number,
    hashrate: number,
    efficiency: number,
    maintenanceRate: number,
    btcPriceUSD: number
  ): {
    dailyRewardBTC: number;
    dailyRewardUSD: number;
    dailyMaintenanceUSD: number;
    dailyNetUSD: number;
    roiDays: number;
    roiMonths: number;
    annualReturnPercent: number;
  } {
    const dailyRewardBTC = this.calculateDailyBTCReward(hashrate, efficiency);
    const dailyRewardUSD = dailyRewardBTC * btcPriceUSD;
    const dailyMaintenanceUSD = maintenanceRate;
    const dailyNetUSD = dailyRewardUSD - dailyMaintenanceUSD;
    const roiDays = dailyNetUSD > 0 ? purchasePrice / dailyNetUSD : Infinity;
    const roiMonths = roiDays / 30;
    const annualReturnPercent = purchasePrice > 0 ? (dailyNetUSD * 365 / purchasePrice) * 100 : 0;

    return {
      dailyRewardBTC,
      dailyRewardUSD,
      dailyMaintenanceUSD,
      dailyNetUSD,
      roiDays,
      roiMonths,
      annualReturnPercent,
    };
  }

  /**
   * Subscribe to miner updates (real-time)
   */
  subscribeToUserMiners(userId: string, callback: (miner: NFTMiner) => void) {
    const channel = supabase
      .channel(`miners-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nft_miners',
          filter: `owner_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as NFTMiner);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to marketplace listings (real-time)
   */
  subscribeToMarketplace(callback: (miner: NFTMiner) => void) {
    const channel = supabase
      .channel('marketplace-listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nft_miners',
          filter: 'is_listed=eq.true',
        },
        (payload) => {
          callback(payload.new as NFTMiner);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const minerService = new MinerService();
