import { supabase } from '../lib/supabase';

export type BurnType =
  | 'maintenance'
  | 'marketplace'
  | 'miner_upgrade'
  | 'scheduled_weekly'
  | 'governance_burn'
  | 'charity_mint';

export interface BurnEvent {
  id: string;
  burn_type: BurnType;
  amount_tyt: number;
  tx_hash: string | null;
  burn_address: string;
  source_ref_type: string | null;
  source_ref_id: string | null;
  report_uri: string | null;
  burned_at: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BurnReport {
  id: string;
  report_date: string;
  period_start: string;
  period_end: string;
  total_burned: number;
  burn_by_type: Record<BurnType, number>;
  charity_mint_amount: number;
  cumulative_total_burned: number;
  tx_hashes: string[];
  report_uri: string | null;
  created_at: string;
}

export interface BurnStats {
  totalBurned: number;
  burnedLast24h: number;
  burnedLast7d: number;
  burnedLast30d: number;
  nextScheduledBurn: Date | null;
  charityMintTotal: number;
}

const BURN_ADDRESS = 'TYTBurnAddressXXXXXXXXXXXXXXXXXX';
const WEEKLY_BURN_DAY = 2;
const WEEKLY_BURN_HOUR = 12;
const CHARITY_MINT_PERCENTAGE = 25;

export async function getBurnStats(): Promise<BurnStats> {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: allBurns } = await supabase
    .from('burn_events')
    .select('amount_tyt, burned_at, burn_type')
    .eq('status', 'confirmed');

  const burns = allBurns || [];

  const totalBurned = burns.reduce((sum, b) => sum + b.amount_tyt, 0);

  const burnedLast24h = burns
    .filter(b => new Date(b.burned_at) > oneDayAgo)
    .reduce((sum, b) => sum + b.amount_tyt, 0);

  const burnedLast7d = burns
    .filter(b => new Date(b.burned_at) > sevenDaysAgo)
    .reduce((sum, b) => sum + b.amount_tyt, 0);

  const burnedLast30d = burns
    .filter(b => new Date(b.burned_at) > thirtyDaysAgo)
    .reduce((sum, b) => sum + b.amount_tyt, 0);

  const charityMintTotal = burns
    .filter(b => b.burn_type === 'charity_mint')
    .reduce((sum, b) => sum + b.amount_tyt, 0);

  const nextScheduledBurn = getNextScheduledBurnTime();

  return {
    totalBurned,
    burnedLast24h,
    burnedLast7d,
    burnedLast30d,
    nextScheduledBurn,
    charityMintTotal
  };
}

export function getNextScheduledBurnTime(): Date {
  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();

  let daysUntilBurn = WEEKLY_BURN_DAY - currentDay;
  if (daysUntilBurn < 0 || (daysUntilBurn === 0 && currentHour >= WEEKLY_BURN_HOUR)) {
    daysUntilBurn += 7;
  }

  const nextBurn = new Date(now);
  nextBurn.setUTCDate(nextBurn.getUTCDate() + daysUntilBurn);
  nextBurn.setUTCHours(WEEKLY_BURN_HOUR, 0, 0, 0);

  return nextBurn;
}

export function getTimeUntilNextBurn(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const nextBurn = getNextScheduledBurnTime();
  const diffMs = nextBurn.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
}

export async function getBurnHistory(
  options: { limit?: number; offset?: number; burnType?: BurnType } = {}
): Promise<BurnEvent[]> {
  const { limit = 50, offset = 0, burnType } = options;

  let query = supabase
    .from('burn_events')
    .select('*')
    .order('burned_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (burnType) {
    query = query.eq('burn_type', burnType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBurnReports(
  options: { limit?: number } = {}
): Promise<BurnReport[]> {
  const { limit = 12 } = options;

  const { data, error } = await supabase
    .from('burn_reports')
    .select('*')
    .order('report_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getPendingBurnPool(): Promise<{
  totalPending: number;
  byType: Record<BurnType, number>;
}> {
  const { data, error } = await supabase
    .from('burn_pool')
    .select('burn_type, amount_tyt')
    .eq('status', 'pending');

  if (error) throw error;

  const byType: Record<BurnType, number> = {
    maintenance: 0,
    marketplace: 0,
    miner_upgrade: 0,
    scheduled_weekly: 0,
    governance_burn: 0,
    charity_mint: 0
  };

  let totalPending = 0;
  for (const item of data || []) {
    const type = item.burn_type as BurnType;
    byType[type] = (byType[type] || 0) + item.amount_tyt;
    totalPending += item.amount_tyt;
  }

  return { totalPending, byType };
}

export async function recordBurnContribution(
  amount: number,
  burnType: BurnType,
  refType?: string,
  refId?: string
): Promise<void> {
  const { error } = await supabase
    .from('burn_pool')
    .insert({
      amount_tyt: amount,
      burn_type: burnType,
      source_ref_type: refType,
      source_ref_id: refId,
      status: 'pending'
    });

  if (error) throw error;
}

export async function executeScheduledBurn(): Promise<{
  success: boolean;
  totalBurned: number;
  charityMinted: number;
  txHash: string | null;
  reportId: string | null;
}> {
  const { data: pendingPool, error: poolError } = await supabase
    .from('burn_pool')
    .select('*')
    .eq('status', 'pending');

  if (poolError) throw poolError;

  if (!pendingPool || pendingPool.length === 0) {
    return {
      success: false,
      totalBurned: 0,
      charityMinted: 0,
      txHash: null,
      reportId: null
    };
  }

  const totalToBurn = pendingPool.reduce((sum, p) => sum + p.amount_tyt, 0);
  const charityMintAmount = (totalToBurn * CHARITY_MINT_PERCENTAGE) / 100;

  const burnByType: Record<BurnType, number> = {
    maintenance: 0,
    marketplace: 0,
    miner_upgrade: 0,
    scheduled_weekly: 0,
    governance_burn: 0,
    charity_mint: 0
  };

  for (const item of pendingPool) {
    const type = item.burn_type as BurnType;
    burnByType[type] = (burnByType[type] || 0) + item.amount_tyt;
  }

  const txHash = `0x${Date.now().toString(16)}burn${Math.random().toString(16).slice(2, 10)}`;

  const { data: burnEvent, error: burnError } = await supabase
    .from('burn_events')
    .insert({
      burn_type: 'scheduled_weekly',
      amount_tyt: totalToBurn,
      tx_hash: txHash,
      burn_address: BURN_ADDRESS,
      status: 'confirmed',
      burned_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (burnError) throw burnError;

  if (charityMintAmount > 0) {
    await supabase
      .from('burn_events')
      .insert({
        burn_type: 'charity_mint',
        amount_tyt: charityMintAmount,
        tx_hash: `${txHash}_charity`,
        burn_address: 'CHARITY_FOUNDATION_WALLET',
        status: 'confirmed',
        burned_at: new Date().toISOString()
      });
  }

  const poolIds = pendingPool.map(p => p.id);
  await supabase
    .from('burn_pool')
    .update({ status: 'burned', burn_event_id: burnEvent.id })
    .in('id', poolIds);

  const { data: cumulative } = await supabase
    .from('burn_events')
    .select('amount_tyt')
    .eq('status', 'confirmed')
    .neq('burn_type', 'charity_mint');

  const cumulativeTotal = (cumulative || []).reduce((sum, b) => sum + b.amount_tyt, 0);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const { data: report, error: reportError } = await supabase
    .from('burn_reports')
    .insert({
      report_date: now.toISOString().split('T')[0],
      period_start: weekStart.toISOString().split('T')[0],
      period_end: now.toISOString().split('T')[0],
      total_burned: totalToBurn,
      burn_by_type: burnByType,
      charity_mint_amount: charityMintAmount,
      cumulative_total_burned: cumulativeTotal,
      tx_hashes: [txHash]
    })
    .select('id')
    .single();

  if (reportError) throw reportError;

  return {
    success: true,
    totalBurned: totalToBurn,
    charityMinted: charityMintAmount,
    txHash,
    reportId: report.id
  };
}

export function formatBurnAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M TYT`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K TYT`;
  }
  return `${amount.toFixed(2)} TYT`;
}

export function calculateBurnRate(burns: BurnEvent[], periodDays: number): number {
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - periodDays);

  const periodBurns = burns.filter(b => new Date(b.burned_at) > periodStart);
  const totalBurned = periodBurns.reduce((sum, b) => sum + b.amount_tyt, 0);

  return totalBurned / periodDays;
}
