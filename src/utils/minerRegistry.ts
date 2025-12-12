import { supabase } from '../lib/supabase';

export interface MinerNFT {
  id: string;
  token_id: string;
  owner_id: string;
  name: string;
  power_th: number;
  efficiency_w_th: number;
  region: string;
  data_center_id: string | null;
  purchase_price_usd: number;
  purchase_date: string;
  status: 'active' | 'paused' | 'delinquent' | 'upgrading' | 'listed';
  maintenance_rate_daily: number;
  total_btc_earned: number;
  total_maintenance_paid: number;
  last_reward_date: string | null;
  reinvest_percentage: number;
  upgrade_tier: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MinerStats {
  totalMiners: number;
  totalHashrate: number;
  averageEfficiency: number;
  totalBtcEarned: number;
  activeMiners: number;
  delinquentMiners: number;
}

export interface MinerReward {
  id: string;
  miner_id: string;
  reward_date: string;
  gross_btc: number;
  electricity_cost_usd: number;
  service_fee_usd: number;
  maintenance_fee_usd: number;
  discount_applied: number;
  net_btc: number;
  btc_price_usd: number;
  merkle_proof: string | null;
  status: 'pending' | 'calculated' | 'distributed' | 'claimed';
}

export interface DataCenter {
  id: string;
  name: string;
  region: string;
  country: string;
  electricity_rate_kwh: number;
  pue_ratio: number;
  total_capacity_th: number;
  used_capacity_th: number;
  uptime_percentage: number;
  status: 'operational' | 'maintenance' | 'offline';
}

export async function getUserMiners(userId: string): Promise<MinerNFT[]> {
  const { data, error } = await supabase
    .from('nft_miners')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMinerById(minerId: string): Promise<MinerNFT | null> {
  const { data, error } = await supabase
    .from('nft_miners')
    .select('*')
    .eq('id', minerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserMinerStats(userId: string): Promise<MinerStats> {
  const miners = await getUserMiners(userId);

  const activeMiners = miners.filter(m => m.status === 'active');
  const delinquentMiners = miners.filter(m => m.status === 'delinquent');

  const totalHashrate = miners.reduce((sum, m) => sum + m.power_th, 0);
  const totalBtcEarned = miners.reduce((sum, m) => sum + m.total_btc_earned, 0);

  const avgEfficiency = miners.length > 0
    ? miners.reduce((sum, m) => sum + m.efficiency_w_th, 0) / miners.length
    : 0;

  return {
    totalMiners: miners.length,
    totalHashrate,
    averageEfficiency: avgEfficiency,
    totalBtcEarned,
    activeMiners: activeMiners.length,
    delinquentMiners: delinquentMiners.length
  };
}

export async function getMinerRewards(
  minerId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<MinerReward[]> {
  const { limit = 30, offset = 0 } = options;

  const { data, error } = await supabase
    .from('mining_rewards')
    .select('*')
    .eq('miner_id', minerId)
    .order('reward_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function getUserTotalRewards(userId: string): Promise<{
  totalGrossBtc: number;
  totalNetBtc: number;
  totalMaintenancePaid: number;
  totalDiscountsSaved: number;
  rewardCount: number;
}> {
  const { data, error } = await supabase
    .from('mining_rewards')
    .select(`
      gross_btc,
      net_btc,
      maintenance_fee_usd,
      discount_applied,
      nft_miners!inner(owner_id)
    `)
    .eq('nft_miners.owner_id', userId)
    .eq('status', 'distributed');

  if (error) throw error;

  const rewards = data || [];
  return {
    totalGrossBtc: rewards.reduce((sum, r) => sum + (r.gross_btc || 0), 0),
    totalNetBtc: rewards.reduce((sum, r) => sum + (r.net_btc || 0), 0),
    totalMaintenancePaid: rewards.reduce((sum, r) => sum + (r.maintenance_fee_usd || 0), 0),
    totalDiscountsSaved: rewards.reduce((sum, r) => sum + (r.discount_applied || 0), 0),
    rewardCount: rewards.length
  };
}

export async function getDataCenters(): Promise<DataCenter[]> {
  const { data, error } = await supabase
    .from('data_centers')
    .select('*')
    .eq('status', 'operational')
    .order('region');

  if (error) throw error;
  return data || [];
}

export async function updateMinerReinvestPercentage(
  minerId: string,
  percentage: number
): Promise<void> {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Reinvest percentage must be between 0 and 100');
  }

  const { error } = await supabase
    .from('nft_miners')
    .update({ reinvest_percentage: percentage, updated_at: new Date().toISOString() })
    .eq('id', minerId);

  if (error) throw error;
}

export async function pauseMiner(minerId: string): Promise<void> {
  const { error } = await supabase
    .from('nft_miners')
    .update({ status: 'paused', updated_at: new Date().toISOString() })
    .eq('id', minerId);

  if (error) throw error;
}

export async function resumeMiner(minerId: string): Promise<void> {
  const { error } = await supabase
    .from('nft_miners')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', minerId);

  if (error) throw error;
}

export async function listMinerForSale(
  minerId: string,
  priceInTyt: number
): Promise<string> {
  const { data: miner } = await supabase
    .from('nft_miners')
    .select('id, status')
    .eq('id', minerId)
    .maybeSingle();

  if (!miner) throw new Error('Miner not found');
  if (miner.status === 'listed') throw new Error('Miner is already listed');

  const { data: listing, error } = await supabase
    .from('marketplace_listings')
    .insert({
      miner_id: minerId,
      price_tyt: priceInTyt,
      status: 'active'
    })
    .select('id')
    .single();

  if (error) throw error;

  await supabase
    .from('nft_miners')
    .update({ status: 'listed' })
    .eq('id', minerId);

  return listing.id;
}

export async function cancelListing(listingId: string): Promise<void> {
  const { data: listing } = await supabase
    .from('marketplace_listings')
    .select('miner_id')
    .eq('id', listingId)
    .maybeSingle();

  if (!listing) throw new Error('Listing not found');

  await supabase
    .from('marketplace_listings')
    .update({ status: 'cancelled' })
    .eq('id', listingId);

  await supabase
    .from('nft_miners')
    .update({ status: 'active' })
    .eq('id', listing.miner_id);
}

export function calculateEstimatedDailyReward(
  powerTh: number,
  efficiencyWTh: number,
  btcPrice: number,
  networkHashrate: number = 600000000,
  blockReward: number = 3.125,
  blocksPerDay: number = 144,
  electricityRateKwh: number = 0.05
): {
  grossBtc: number;
  grossUsd: number;
  electricityCostUsd: number;
  estimatedNetBtc: number;
  estimatedNetUsd: number;
} {
  const dailyBtcReward = blocksPerDay * blockReward;
  const hashShareRatio = powerTh / networkHashrate;
  const grossBtc = dailyBtcReward * hashShareRatio;
  const grossUsd = grossBtc * btcPrice;

  const powerWatts = powerTh * efficiencyWTh;
  const dailyKwh = (powerWatts * 24) / 1000;
  const electricityCostUsd = dailyKwh * electricityRateKwh;

  const serviceFee = grossUsd * 0.15;
  const netUsd = grossUsd - electricityCostUsd - serviceFee;
  const netBtc = netUsd / btcPrice;

  return {
    grossBtc,
    grossUsd,
    electricityCostUsd,
    estimatedNetBtc: Math.max(0, netBtc),
    estimatedNetUsd: Math.max(0, netUsd)
  };
}

export function calculateROI(
  purchasePriceUsd: number,
  dailyNetUsd: number
): {
  dailyRoi: number;
  monthlyRoi: number;
  yearlyRoi: number;
  breakEvenDays: number;
} {
  if (dailyNetUsd <= 0 || purchasePriceUsd <= 0) {
    return { dailyRoi: 0, monthlyRoi: 0, yearlyRoi: 0, breakEvenDays: Infinity };
  }

  const dailyRoi = (dailyNetUsd / purchasePriceUsd) * 100;
  const monthlyRoi = dailyRoi * 30;
  const yearlyRoi = dailyRoi * 365;
  const breakEvenDays = purchasePriceUsd / dailyNetUsd;

  return { dailyRoi, monthlyRoi, yearlyRoi, breakEvenDays };
}
