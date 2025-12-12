import { supabase } from '../lib/supabase';

export interface RewardCalculation {
  minerId: string;
  rewardDate: string;
  powerTh: number;
  networkHashrate: number;
  blockReward: number;
  blocksPerDay: number;
  btcPrice: number;
  grossBtc: number;
  grossUsd: number;
  electricityCostUsd: number;
  serviceFeeeUsd: number;
  maintenanceFeeUsd: number;
  discountApplied: number;
  netBtc: number;
  netUsd: number;
  reinvestAmount: number;
  toWalletBtc: number;
}

export interface DailyRewardsSummary {
  date: string;
  totalMinersProcessed: number;
  totalGrossBtc: number;
  totalNetBtc: number;
  totalMaintenanceCollected: number;
  totalReinvested: number;
  networkHashrate: number;
  btcPrice: number;
  merkleRoot: string | null;
}

export interface MerkleProof {
  leaf: string;
  proof: string[];
  root: string;
  index: number;
}

const BLOCKS_PER_DAY = 144;
const BLOCK_REWARD = 3.125;
const SERVICE_FEE_BPS = 1500;

export async function getNetworkStats(): Promise<{
  networkHashrate: number;
  difficulty: number;
  btcPrice: number;
  blockHeight: number;
}> {
  try {
    const response = await fetch('https://api.blockchain.info/stats');
    const data = await response.json();

    return {
      networkHashrate: data.hash_rate || 600000000000000000,
      difficulty: data.difficulty || 80000000000000,
      btcPrice: data.market_price_usd || 100000,
      blockHeight: data.n_blocks_total || 850000
    };
  } catch {
    return {
      networkHashrate: 600000000000000000,
      difficulty: 80000000000000,
      btcPrice: 100000,
      blockHeight: 850000
    };
  }
}

export function calculateMinerReward(
  powerTh: number,
  efficiencyWTh: number,
  electricityRateKwh: number,
  networkHashrateTh: number,
  btcPrice: number,
  discountBps: number = 0,
  reinvestPercentage: number = 0
): RewardCalculation {
  const dailyBtcPool = BLOCKS_PER_DAY * BLOCK_REWARD;

  const hashShareRatio = powerTh / networkHashrateTh;
  const grossBtc = dailyBtcPool * hashShareRatio;
  const grossUsd = grossBtc * btcPrice;

  const powerWatts = powerTh * efficiencyWTh;
  const dailyKwh = (powerWatts * 24) / 1000;
  const electricityCostUsd = dailyKwh * electricityRateKwh;

  const serviceFeeeUsd = grossUsd * (SERVICE_FEE_BPS / 10000);

  const maintenanceBeforeDiscount = electricityCostUsd + serviceFeeeUsd;
  const discountAmount = maintenanceBeforeDiscount * (discountBps / 10000);
  const maintenanceFeeUsd = maintenanceBeforeDiscount - discountAmount;

  const netUsd = grossUsd - maintenanceFeeUsd;
  const netBtc = netUsd / btcPrice;

  const reinvestBtc = netBtc * (reinvestPercentage / 100);
  const toWalletBtc = netBtc - reinvestBtc;

  return {
    minerId: '',
    rewardDate: new Date().toISOString().split('T')[0],
    powerTh,
    networkHashrate: networkHashrateTh,
    blockReward: BLOCK_REWARD,
    blocksPerDay: BLOCKS_PER_DAY,
    btcPrice,
    grossBtc,
    grossUsd,
    electricityCostUsd,
    serviceFeeeUsd,
    maintenanceFeeUsd,
    discountApplied: discountAmount,
    netBtc: Math.max(0, netBtc),
    netUsd: Math.max(0, netUsd),
    reinvestAmount: reinvestBtc,
    toWalletBtc: Math.max(0, toWalletBtc)
  };
}

export async function getDailyRewardsSummary(date: string): Promise<DailyRewardsSummary | null> {
  const { data, error } = await supabase
    .from('daily_rewards_summary')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserRewardsHistory(
  userId: string,
  options: { limit?: number; offset?: number; startDate?: string; endDate?: string } = {}
): Promise<{
  rewards: RewardCalculation[];
  totalGrossBtc: number;
  totalNetBtc: number;
  totalDays: number;
}> {
  const { limit = 30, offset = 0, startDate, endDate } = options;

  let query = supabase
    .from('mining_rewards')
    .select(`
      *,
      nft_miners!inner(owner_id, power_th, efficiency_w_th)
    `)
    .eq('nft_miners.owner_id', userId)
    .order('reward_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (startDate) {
    query = query.gte('reward_date', startDate);
  }
  if (endDate) {
    query = query.lte('reward_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rewards = (data || []).map(row => ({
    minerId: row.miner_id,
    rewardDate: row.reward_date,
    powerTh: row.nft_miners?.power_th || 0,
    networkHashrate: row.network_hashrate || 0,
    blockReward: BLOCK_REWARD,
    blocksPerDay: BLOCKS_PER_DAY,
    btcPrice: row.btc_price_usd || 0,
    grossBtc: row.gross_btc || 0,
    grossUsd: (row.gross_btc || 0) * (row.btc_price_usd || 0),
    electricityCostUsd: row.electricity_cost_usd || 0,
    serviceFeeeUsd: row.service_fee_usd || 0,
    maintenanceFeeUsd: row.maintenance_fee_usd || 0,
    discountApplied: row.discount_applied || 0,
    netBtc: row.net_btc || 0,
    netUsd: (row.net_btc || 0) * (row.btc_price_usd || 0),
    reinvestAmount: row.reinvest_amount || 0,
    toWalletBtc: (row.net_btc || 0) - (row.reinvest_amount || 0)
  }));

  const totalGrossBtc = rewards.reduce((sum, r) => sum + r.grossBtc, 0);
  const totalNetBtc = rewards.reduce((sum, r) => sum + r.netBtc, 0);

  return {
    rewards,
    totalGrossBtc,
    totalNetBtc,
    totalDays: rewards.length
  };
}

export async function getRewardMerkleProof(
  userId: string,
  rewardDate: string
): Promise<MerkleProof | null> {
  const { data, error } = await supabase
    .from('mining_rewards')
    .select(`
      merkle_proof,
      merkle_leaf,
      merkle_index,
      daily_rewards_summary!inner(merkle_root)
    `)
    .eq('reward_date', rewardDate)
    .eq('nft_miners.owner_id', userId)
    .maybeSingle();

  if (error || !data || !data.merkle_proof) return null;

  const summary = data.daily_rewards_summary as { merkle_root: string } | null;

  return {
    leaf: data.merkle_leaf,
    proof: JSON.parse(data.merkle_proof),
    root: summary?.merkle_root || '',
    index: data.merkle_index
  };
}

export async function claimServiceButtonReward(userId: string): Promise<{
  success: boolean;
  tytAmount: number;
  nextClaimTime: Date;
  message: string;
}> {
  const { data: lastClaim, error: claimError } = await supabase
    .from('service_button_claims')
    .select('claimed_at')
    .eq('user_id', userId)
    .order('claimed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (claimError) throw claimError;

  const now = new Date();
  const lastClaimTime = lastClaim ? new Date(lastClaim.claimed_at) : null;
  const cooldownMs = 24 * 60 * 60 * 1000;

  if (lastClaimTime && now.getTime() - lastClaimTime.getTime() < cooldownMs) {
    const nextClaimTime = new Date(lastClaimTime.getTime() + cooldownMs);
    return {
      success: false,
      tytAmount: 0,
      nextClaimTime,
      message: 'Service button already claimed today'
    };
  }

  const { data: vipLevel } = await supabase
    .from('vip_levels')
    .select('level')
    .eq('user_id', userId)
    .maybeSingle();

  const rewardsByLevel: Record<number, number> = {
    1: 10,
    2: 15,
    3: 25,
    4: 40,
    5: 100
  };

  const level = vipLevel?.level || 1;
  const tytAmount = rewardsByLevel[level] || 10;

  const { error: insertError } = await supabase
    .from('service_button_claims')
    .insert({
      user_id: userId,
      tyt_amount: tytAmount,
      vip_level: level
    });

  if (insertError) throw insertError;

  await supabase.rpc('credit_user_tyt', {
    p_user_id: userId,
    p_amount: tytAmount,
    p_ref_type: 'service_button',
    p_ref_id: userId
  });

  const nextClaimTime = new Date(now.getTime() + cooldownMs);

  return {
    success: true,
    tytAmount,
    nextClaimTime,
    message: `Claimed ${tytAmount} TYT!`
  };
}

export function formatBtcAmount(btc: number, decimals: number = 8): string {
  return btc.toFixed(decimals);
}

export function formatSatoshis(btc: number): string {
  return Math.round(btc * 100000000).toLocaleString();
}

export function btcToSatoshis(btc: number): number {
  return Math.round(btc * 100000000);
}

export function satoshisToBtc(sats: number): number {
  return sats / 100000000;
}

export async function getProjectedEarnings(
  userId: string,
  days: number = 30
): Promise<{
  projectedGrossBtc: number;
  projectedNetBtc: number;
  projectedNetUsd: number;
  assumptions: {
    networkHashrate: number;
    btcPrice: number;
    totalHashrate: number;
  };
}> {
  const { data: miners } = await supabase
    .from('nft_miners')
    .select('power_th, efficiency_w_th, reinvest_percentage')
    .eq('owner_id', userId)
    .eq('status', 'active');

  if (!miners || miners.length === 0) {
    return {
      projectedGrossBtc: 0,
      projectedNetBtc: 0,
      projectedNetUsd: 0,
      assumptions: { networkHashrate: 0, btcPrice: 0, totalHashrate: 0 }
    };
  }

  const stats = await getNetworkStats();
  const networkHashrateTh = stats.networkHashrate / 1e12;

  let totalProjectedGross = 0;
  let totalProjectedNet = 0;

  for (const miner of miners) {
    const reward = calculateMinerReward(
      miner.power_th,
      miner.efficiency_w_th,
      0.05,
      networkHashrateTh,
      stats.btcPrice,
      500,
      miner.reinvest_percentage
    );

    totalProjectedGross += reward.grossBtc * days;
    totalProjectedNet += reward.netBtc * days;
  }

  const totalHashrate = miners.reduce((sum, m) => sum + m.power_th, 0);

  return {
    projectedGrossBtc: totalProjectedGross,
    projectedNetBtc: totalProjectedNet,
    projectedNetUsd: totalProjectedNet * stats.btcPrice,
    assumptions: {
      networkHashrate: networkHashrateTh,
      btcPrice: stats.btcPrice,
      totalHashrate
    }
  };
}
