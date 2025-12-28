import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

/**
 * aOi Platform Control Context
 *
 * Provides aOi with access and control over all platform elements.
 * This is the central nervous system connecting aOi to every feature.
 */

interface PlatformModule {
  id: string;
  name: string;
  category: 'mining' | 'finance' | 'academy' | 'foundation' | 'community' | 'account';
  access: boolean;
  data?: any;
}

interface AoiControlContextType {
  // Mining Ecosystem
  getMinerData: (minerId?: string) => Promise<any>;
  getDataCenterStatus: () => Promise<any>;
  getRewardsHistory: () => Promise<any>;
  getMarketplaceListings: () => Promise<any>;

  // Finance & Token
  getWalletBalance: () => Promise<any>;
  getTYTTradingData: () => Promise<any>;
  getBurnReports: () => Promise<any>;
  getGovernanceProposals: () => Promise<any>;

  // Academy
  getAcademyProgress: () => Promise<any>;
  getQuestsStatus: () => Promise<any>;
  getCertificates: () => Promise<any>;
  getOwlAvatars: () => Promise<any>;

  // Foundation
  getFoundationStats: () => Promise<any>;
  getGrantsInfo: () => Promise<any>;
  getCharityStaking: () => Promise<any>;

  // Community
  getLeaderboardPosition: () => Promise<any>;
  getClanInfo: () => Promise<any>;
  getReferralStats: () => Promise<any>;

  // Account
  getProfileData: () => Promise<any>;
  getKYCStatus: () => Promise<any>;
  getNotifications: () => Promise<any>;

  // Universal Access
  getPlatformModules: () => PlatformModule[];
  getModuleData: (moduleId: string) => Promise<any>;
  executeAction: (moduleId: string, action: string, params?: any) => Promise<any>;

  // aOi Context Awareness
  getCurrentContext: () => Promise<any>;
  getRecommendations: (context: string) => Promise<any>;
  logAoiAction: (action: string, details: any) => Promise<void>;
}

const AoiControlContext = createContext<AoiControlContextType | undefined>(undefined);

export function AoiControlProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const logInteraction = async (type: string, context?: Record<string, any>) => {
    if (!user) return;

    try {
      await supabase.from('aoi_interactions').insert({
        user_id: user.id,
        session_id: `session_${Date.now()}`,
        interaction_type: type,
        context: context || {},
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  // Mining Ecosystem Methods
  const getMinerData = async (minerId?: string) => {
    if (!user) return null;

    try {
      let query = supabase
        .from('user_miners')
        .select(`
          *,
          miner_nfts(*)
        `)
        .eq('user_id', user.id);

      if (minerId) {
        query = query.eq('id', minerId);
      }

      const { data, error } = await query;
      if (error) throw error;

      await logInteraction('aoi_access_miners', { miner_id: minerId });
      return data;
    } catch (error) {
      console.error('aOi: Error accessing miner data:', error);
      return null;
    }
  };

  const getDataCenterStatus = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_miners')
        .select('region, status, power_th')
        .eq('user_id', user.id);

      if (error) throw error;

      const summary = data?.reduce((acc: any, miner: any) => {
        acc[miner.region] = (acc[miner.region] || 0) + 1;
        acc.total_power = (acc.total_power || 0) + miner.power_th;
        return acc;
      }, {});

      await logInteraction('aoi_access_datacenters');
      return summary;
    } catch (error) {
      console.error('aOi: Error accessing data centers:', error);
      return null;
    }
  };

  const getRewardsHistory = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      await logInteraction('aoi_access_rewards');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing rewards:', error);
      return null;
    }
  };

  const getMarketplaceListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          user_miners(
            *,
            miner_nfts(*)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      await logInteraction('aoi_access_marketplace');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing marketplace:', error);
      return null;
    }
  };

  // Finance & Token Methods
  const getWalletBalance = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_wallet');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing wallet:', error);
      return null;
    }
  };

  const getTYTTradingData = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['buy', 'sell', 'swap'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      await logInteraction('aoi_access_trading');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing trading data:', error);
      return null;
    }
  };

  const getBurnReports = async () => {
    try {
      const { data, error } = await supabase
        .from('burn_events')
        .select('*')
        .order('burn_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      await logInteraction('aoi_access_burn_reports');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing burn reports:', error);
      return null;
    }
  };

  const getGovernanceProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      await logInteraction('aoi_access_governance');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing governance:', error);
      return null;
    }
  };

  // Academy Methods
  const getAcademyProgress = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('academy_progress')
        .select(`
          *,
          academy_lessons(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_academy');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing academy:', error);
      return null;
    }
  };

  const getQuestsStatus = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('academy_quest_progress')
        .select(`
          *,
          academy_quests(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_quests');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing quests:', error);
      return null;
    }
  };

  const getCertificates = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('academy_certificates')
        .select(`
          *,
          certificate_templates(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_certificates');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing certificates:', error);
      return null;
    }
  };

  const getOwlAvatars = async () => {
    if (!user) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('owl_rank, avatar_url, xp, level')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      await logInteraction('aoi_access_avatars');
      return profile;
    } catch (error) {
      console.error('aOi: Error accessing avatars:', error);
      return null;
    }
  };

  // Foundation Methods
  const getFoundationStats = async () => {
    try {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      await logInteraction('aoi_access_foundation');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing foundation:', error);
      return null;
    }
  };

  const getGrantsInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('foundation_grants')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      await logInteraction('aoi_access_grants');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing grants:', error);
      return null;
    }
  };

  const getCharityStaking = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('charity_stakes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_charity_staking');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing charity staking:', error);
      return null;
    }
  };

  // Community Methods
  const getLeaderboardPosition = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, total_hashpower, xp')
        .order('total_hashpower', { ascending: false });

      if (error) throw error;

      const position = data?.findIndex(p => p.user_id === user.id) + 1;

      await logInteraction('aoi_access_leaderboard');
      return { position, total: data?.length || 0, data: data?.slice(0, 10) };
    } catch (error) {
      console.error('aOi: Error accessing leaderboard:', error);
      return null;
    }
  };

  const getClanInfo = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_clan_memberships')
        .select(`
          *,
          clans(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      await logInteraction('aoi_access_clans');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing clans:', error);
      return null;
    }
  };

  const getReferralStats = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      if (error) throw error;

      await logInteraction('aoi_access_referrals');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing referrals:', error);
      return null;
    }
  };

  // Account Methods
  const getProfileData = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      await logInteraction('aoi_access_profile');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing profile:', error);
      return null;
    }
  };

  const getKYCStatus = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      await logInteraction('aoi_access_kyc');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing KYC:', error);
      return null;
    }
  };

  const getNotifications = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      await logInteraction('aoi_access_notifications');
      return data;
    } catch (error) {
      console.error('aOi: Error accessing notifications:', error);
      return null;
    }
  };

  // Universal Platform Access
  const getPlatformModules = (): PlatformModule[] => {
    return [
      // Mining Ecosystem
      { id: 'dashboard', name: 'Dashboard', category: 'mining', access: true },
      { id: 'miners', name: 'My Miners', category: 'mining', access: true },
      { id: 'datacenters', name: 'Data Centers', category: 'mining', access: true },
      { id: 'rewards', name: 'Rewards', category: 'mining', access: true },
      { id: 'marketplace', name: 'Marketplace', category: 'mining', access: true },

      // Finance & Token
      { id: 'wallet', name: 'Wallet', category: 'finance', access: true },
      { id: 'trading', name: 'TYT Trading', category: 'finance', access: true },
      { id: 'burn', name: 'Burn Reports', category: 'finance', access: true },
      { id: 'governance', name: 'Governance', category: 'finance', access: true },

      // Academy
      { id: 'lessons', name: 'Lessons', category: 'academy', access: true },
      { id: 'aoi_profile', name: 'aOi Profile', category: 'academy', access: true },
      { id: 'quests', name: 'Quests', category: 'academy', access: true },
      { id: 'calculators', name: 'Calculators', category: 'academy', access: true },
      { id: 'certificates', name: 'Certificates', category: 'academy', access: true },
      { id: 'avatars', name: 'Owl Avatars', category: 'academy', access: true },

      // Foundation
      { id: 'foundation', name: 'Foundation Overview', category: 'foundation', access: true },
      { id: 'grants', name: 'Grants', category: 'foundation', access: true },
      { id: 'charity_staking', name: 'Charity Staking', category: 'foundation', access: true },

      // Community
      { id: 'leaderboard', name: 'Leaderboard', category: 'community', access: true },
      { id: 'clans', name: 'Clans & Wars', category: 'community', access: true },
      { id: 'referrals', name: 'Referrals', category: 'community', access: true },

      // Account
      { id: 'profile', name: 'Profile', category: 'account', access: true },
      { id: 'kyc', name: 'KYC Verification', category: 'account', access: user !== null },
      { id: 'notifications', name: 'Notifications', category: 'account', access: user !== null },
      { id: 'settings', name: 'Settings', category: 'account', access: user !== null },
    ];
  };

  const getModuleData = async (moduleId: string) => {
    const moduleMap: Record<string, () => Promise<any>> = {
      miners: getMinerData,
      datacenters: getDataCenterStatus,
      rewards: getRewardsHistory,
      marketplace: getMarketplaceListings,
      wallet: getWalletBalance,
      trading: getTYTTradingData,
      burn: getBurnReports,
      governance: getGovernanceProposals,
      lessons: getAcademyProgress,
      quests: getQuestsStatus,
      certificates: getCertificates,
      avatars: getOwlAvatars,
      foundation: getFoundationStats,
      grants: getGrantsInfo,
      charity_staking: getCharityStaking,
      leaderboard: getLeaderboardPosition,
      clans: getClanInfo,
      referrals: getReferralStats,
      profile: getProfileData,
      kyc: getKYCStatus,
      notifications: getNotifications,
    };

    const fetchFunction = moduleMap[moduleId];
    if (!fetchFunction) {
      console.warn(`aOi: Unknown module "${moduleId}"`);
      return null;
    }

    return await fetchFunction();
  };

  const executeAction = async (moduleId: string, action: string, params?: any) => {
    await logInteraction('aoi_execute_action', {
      module: moduleId,
      action,
      params,
      timestamp: new Date().toISOString()
    });

    // Action execution logic will be implemented based on specific needs
    console.log(`aOi executing: ${action} on ${moduleId}`, params);

    return { success: true, message: 'Action logged by aOi' };
  };

  const getCurrentContext = async () => {
    if (!user) return null;

    const [
      profile,
      miners,
      rewards,
      academy
    ] = await Promise.all([
      getProfileData(),
      getMinerData(),
      getRewardsHistory(),
      getAcademyProgress()
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        profile
      },
      mining: {
        active_miners: miners?.length || 0,
        miners
      },
      rewards: {
        recent: rewards?.slice(0, 7)
      },
      academy: {
        progress: academy
      },
      timestamp: new Date().toISOString()
    };
  };

  const getRecommendations = async (context: string) => {
    const currentContext = await getCurrentContext();

    // AI-powered recommendations based on user context
    const recommendations = [];

    if (currentContext?.mining?.active_miners === 0) {
      recommendations.push({
        type: 'action',
        priority: 'high',
        message: 'Start your mining journey by purchasing your first NFT miner',
        link: '/app/marketplace'
      });
    }

    if (currentContext?.academy?.progress?.length === 0) {
      recommendations.push({
        type: 'learning',
        priority: 'medium',
        message: 'Begin your Web3 education with Academy lessons',
        link: '/app/academy'
      });
    }

    await logInteraction('aoi_recommendations', { context, recommendations });

    return recommendations;
  };

  const logAoiAction = async (action: string, details: any) => {
    await logInteraction(`aoi_${action}`, details);
  };

  return (
    <AoiControlContext.Provider
      value={{
        // Mining
        getMinerData,
        getDataCenterStatus,
        getRewardsHistory,
        getMarketplaceListings,

        // Finance
        getWalletBalance,
        getTYTTradingData,
        getBurnReports,
        getGovernanceProposals,

        // Academy
        getAcademyProgress,
        getQuestsStatus,
        getCertificates,
        getOwlAvatars,

        // Foundation
        getFoundationStats,
        getGrantsInfo,
        getCharityStaking,

        // Community
        getLeaderboardPosition,
        getClanInfo,
        getReferralStats,

        // Account
        getProfileData,
        getKYCStatus,
        getNotifications,

        // Universal
        getPlatformModules,
        getModuleData,
        executeAction,
        getCurrentContext,
        getRecommendations,
        logAoiAction,
      }}
    >
      {children}
    </AoiControlContext.Provider>
  );
}

export function useAoiControl() {
  const context = useContext(AoiControlContext);
  if (context === undefined) {
    throw new Error('useAoiControl must be used within an AoiControlProvider');
  }
  return context;
}
