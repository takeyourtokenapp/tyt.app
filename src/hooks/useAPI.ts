import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type {
  NFTMiner,
  CustodialWallet,
  DailyReward,
  Profile,
  MarketplaceListing,
  MaintenanceInvoice,
  AcademyTrack,
  AcademyLesson,
  FoundationCampaign
} from '../types/database';

export function useDashboardData(userId?: string) {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const [walletsRes, minersRes, rewardsRes, profileRes] = await Promise.all([
        supabase
          .from('custodial_wallets')
          .select('*')
          .eq('user_id', userId),
        supabase
          .from('nft_miners')
          .select('*')
          .eq('owner_id', userId)
          .eq('status', 'active'),
        supabase
          .from('daily_rewards')
          .select('*')
          .order('reward_date', { ascending: false })
          .limit(30),
        supabase
          .from('user_profiles')
          .select('*, vip_levels(*)')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      return {
        wallets: walletsRes.data || [],
        miners: minersRes.data || [],
        recentRewards: rewardsRes.data || [],
        profile: profileRes.data
      };
    },
    enabled: !!userId,
    refetchInterval: 30000
  });
}

export function useMiners(userId?: string) {
  return useQuery({
    queryKey: ['miners', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('nft_miners')
        .select('*, nft_collections(*), data_centers(*)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NFTMiner[];
    },
    enabled: !!userId
  });
}

export function useMinerDetail(minerId?: string) {
  return useQuery({
    queryKey: ['miner', minerId],
    queryFn: async () => {
      if (!minerId) throw new Error('Miner ID required');

      const [minerRes, rewardsRes, invoicesRes] = await Promise.all([
        supabase
          .from('nft_miners')
          .select('*, nft_collections(*), data_centers(*)')
          .eq('id', minerId)
          .maybeSingle(),
        supabase
          .from('daily_rewards')
          .select('*')
          .eq('miner_id', minerId)
          .order('reward_date', { ascending: false })
          .limit(30),
        supabase
          .from('maintenance_invoices')
          .select('*')
          .eq('miner_id', minerId)
          .order('invoice_date', { ascending: false })
          .limit(10)
      ]);

      if (minerRes.error) throw minerRes.error;

      return {
        miner: minerRes.data,
        rewards: rewardsRes.data || [],
        invoices: invoicesRes.data || []
      };
    },
    enabled: !!minerId
  });
}

export function useMarketplace(filters?: {
  minHashrate?: number;
  maxHashrate?: number;
  minPrice?: number;
  maxPrice?: number;
  asset?: string;
  region?: string;
}) {
  return useQuery({
    queryKey: ['marketplace', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_listings')
        .select('*, nft_miners(*), user_profiles!seller_id(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.minHashrate) {
        query = query.gte('nft_miners.hashrate_th', filters.minHashrate);
      }
      if (filters?.maxHashrate) {
        query = query.lte('nft_miners.hashrate_th', filters.maxHashrate);
      }
      if (filters?.minPrice) {
        query = query.gte('list_price_amount', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('list_price_amount', filters.maxPrice);
      }
      if (filters?.asset) {
        query = query.eq('list_price_asset', filters.asset);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketplaceListing[];
    }
  });
}

export function useRewards(userId?: string, filters?: {
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['rewards', userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      let query = supabase
        .from('daily_rewards')
        .select('*, nft_miners!inner(*)')
        .eq('nft_miners.owner_id', userId)
        .order('reward_date', { ascending: false });

      if (filters?.dateFrom) {
        query = query.gte('reward_date', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('reward_date', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as DailyReward[];
    },
    enabled: !!userId
  });
}

export function useWallets(userId?: string) {
  return useQuery({
    queryKey: ['wallets', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', userId)
        .order('asset');

      if (error) throw error;
      return data as CustodialWallet[];
    },
    enabled: !!userId,
    refetchInterval: 10000
  });
}

export function useAcademyTracks() {
  return useQuery({
    queryKey: ['academy-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academy_tracks')
        .select('*, academy_lessons(count)')
        .eq('is_published', true)
        .order('display_order');

      if (error) throw error;
      return data as AcademyTrack[];
    }
  });
}

export function useAcademyTrack(trackId?: string, userId?: string) {
  return useQuery({
    queryKey: ['academy-track', trackId, userId],
    queryFn: async () => {
      if (!trackId) throw new Error('Track ID required');

      const [trackRes, lessonsRes, progressRes] = await Promise.all([
        supabase
          .from('academy_tracks')
          .select('*')
          .eq('id', trackId)
          .maybeSingle(),
        supabase
          .from('academy_lessons')
          .select('*')
          .eq('track_id', trackId)
          .eq('is_published', true)
          .order('display_order'),
        userId
          ? supabase
              .from('user_course_progress')
              .select('*')
              .eq('user_id', userId)
              .eq('course_id', trackId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null })
      ]);

      if (trackRes.error) throw trackRes.error;

      return {
        track: trackRes.data,
        lessons: lessonsRes.data || [],
        progress: progressRes.data
      };
    },
    enabled: !!trackId
  });
}

export function useFoundationCampaigns() {
  return useQuery({
    queryKey: ['foundation-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('*')
        .in('status', ['active', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FoundationCampaign[];
    }
  });
}

export function useFoundationStats() {
  return useQuery({
    queryKey: ['foundation-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('raised_usd, goal_usd');

      if (error) throw error;

      const totalRaised = data.reduce((sum, c) => sum + parseFloat(c.raised_usd), 0);
      const totalGoal = data.reduce((sum, c) => sum + parseFloat(c.goal_usd), 0);

      return {
        totalRaised,
        totalGoal,
        campaignCount: data.length
      };
    }
  });
}

export function useUpgradeMiner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      minerId,
      upgradeType,
      newValue
    }: {
      minerId: string;
      upgradeType: 'hashrate' | 'efficiency' | 'power_level';
      newValue: number;
    }) => {
      const { data, error } = await supabase
        .from('nft_miners')
        .update({ [upgradeType === 'hashrate' ? 'hashrate_th' : upgradeType === 'efficiency' ? 'efficiency_w_per_th' : 'power_level']: newValue })
        .eq('id', minerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miners'] });
      queryClient.invalidateQueries({ queryKey: ['miner'] });
    }
  });
}

export function useUpdateMinerSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      minerId,
      settings
    }: {
      minerId: string;
      settings: {
        reinvest_percentage?: number;
        donate_percentage?: number;
      };
    }) => {
      const { data, error } = await supabase
        .from('nft_miners')
        .update(settings)
        .eq('id', minerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miners'] });
      queryClient.invalidateQueries({ queryKey: ['miner'] });
    }
  });
}

export function useServiceButton(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardAmount }: { rewardAmount: number }) => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          service_button_last_pressed: new Date().toISOString(),
          service_button_presses: supabase.rpc('increment')
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('add_wallet_balance', {
        p_user_id: userId,
        p_asset: 'TYT',
        p_amount: rewardAmount
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    }
  });
}
