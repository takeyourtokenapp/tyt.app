export interface Profile {
  id: string;
  email: string;
  username?: string;
  kyc_status: 'pending' | 'approved' | 'rejected';
  kyc_level: number;
  vip_level: number;
  rank_score: number;
  owl_rank: 'worker' | 'academic' | 'diplomat' | 'peacekeeper' | 'warrior';
  avatar_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CustodialWallet {
  id: string;
  user_id: string;
  asset: 'BTC' | 'USDT' | 'TYT' | 'ETH' | 'SOL' | 'TRX' | 'XRP';
  balance: string;
  locked_balance: string;
  created_at: string;
  updated_at: string;
}

export interface NFTMiner {
  id: string;
  owner_id: string;
  token_id?: string;
  hashrate_th: number;
  efficiency_w_per_th: number;
  farm_id: string;
  status: 'active' | 'inactive' | 'maintenance_due' | 'delinquent';
  reinvest_percentage: number;
  acquired_at: string;
  last_maintenance_paid: string;
  created_at: string;
  updated_at: string;
}

export interface DailyReward {
  id: string;
  miner_id: string;
  reward_date: string;
  gross_btc: string;
  maintenance_cost_btc: string;
  net_btc: string;
  hashrate_snapshot_th: number;
  global_difficulty?: string;
  pool_hashrate_th?: string;
  merkle_leaf?: string;
  created_at: string;
}

export interface MaintenanceInvoice {
  id: string;
  miner_id: string;
  invoice_date: string;
  electricity_cost_usd: string;
  service_fee_usd: string;
  total_usd: string;
  discount_applied_pct: number;
  final_amount_usd: string;
  paid_in_asset?: string;
  paid_amount?: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface MarketplaceListing {
  id: string;
  miner_id: string;
  seller_id: string;
  list_price_asset: string;
  list_price_amount: string;
  listing_type: 'fixed_price' | 'auction';
  min_bid_amount?: string;
  auction_end_time?: string;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface VIPTier {
  level: number;
  name: string;
  min_hashrate_th: number;
  min_tyt_balance: string;
  discount_boost_pct: number;
  marketplace_fee_discount_pct: number;
  priority_support: boolean;
  exclusive_drops: boolean;
}

export interface OwlRank {
  rank: 'worker' | 'academic' | 'diplomat' | 'peacekeeper' | 'warrior';
  min_xp: number;
  max_xp: number;
  benefits: string[];
}

export interface AcademyTrack {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty_level: number;
  estimated_hours: number;
  icon_name?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademyLesson {
  id: string;
  track_id: string;
  slug: string;
  title: string;
  content_mdx: string;
  difficulty_level: number;
  estimated_minutes: number;
  lesson_type: 'theory' | 'interactive' | 'quiz' | 'quest';
  xp_reward: number;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoundationCampaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  goal_usd: string;
  raised_usd: string;
  campaign_type: 'research' | 'family_support' | 'equipment' | 'general';
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
}
