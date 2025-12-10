export interface MaintenanceCostParams {
  hashrateTerahash: number;
  efficiencyWattsPerTh: number;
  kwhPriceUsd: number;
  serviceFeeUsd: number;
}

export interface DiscountTier {
  name: string;
  coverageDays: number;
  discountPct: number;
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { name: 'Bronze', coverageDays: 30, discountPct: 2 },
  { name: 'Silver', coverageDays: 90, discountPct: 5 },
  { name: 'Gold', coverageDays: 180, discountPct: 9 },
  { name: 'Platinum', coverageDays: 270, discountPct: 13 },
  { name: 'Diamond', coverageDays: 360, discountPct: 18 },
];

export function calculateDailyMaintenanceCost(params: MaintenanceCostParams): number {
  const { hashrateTerahash, efficiencyWattsPerTh, kwhPriceUsd, serviceFeeUsd } = params;

  const dailyKwh = (efficiencyWattsPerTh * hashrateTerahash * 24) / 1000;

  const electricityCost = dailyKwh * kwhPriceUsd;

  const totalCost = electricityCost + serviceFeeUsd;

  return totalCost;
}

export function getUserDiscountTier(tytBalance: number, dailyCostUsd: number): DiscountTier | null {
  if (tytBalance <= 0 || dailyCostUsd <= 0) {
    return null;
  }

  const coverageDays = tytBalance / dailyCostUsd;

  let applicableTier: DiscountTier | null = null;

  for (const tier of DISCOUNT_TIERS) {
    if (coverageDays >= tier.coverageDays) {
      applicableTier = tier;
    }
  }

  return applicableTier;
}

export function applyDiscount(amount: number, discountPct: number): number {
  return amount * (1 - discountPct / 100);
}

export function calculateNetMaintenanceCost(
  params: MaintenanceCostParams,
  tytBalance: number
): {
  grossCost: number;
  discountTier: DiscountTier | null;
  discountAmount: number;
  netCost: number;
} {
  const grossCost = calculateDailyMaintenanceCost(params);
  const discountTier = getUserDiscountTier(tytBalance, grossCost);

  const discountPct = discountTier?.discountPct || 0;
  const discountAmount = grossCost * (discountPct / 100);
  const netCost = grossCost - discountAmount;

  return {
    grossCost,
    discountTier,
    discountAmount,
    netCost,
  };
}

export function estimateMonthlyROI(
  dailyRewardBtc: number,
  btcPriceUsd: number,
  dailyMaintenanceUsd: number,
  minerCostUsd: number
): {
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  breakEvenDays: number;
  monthlyROI: number;
} {
  const monthlyRevenue = dailyRewardBtc * btcPriceUsd * 30;
  const monthlyCost = dailyMaintenanceUsd * 30;
  const monthlyProfit = monthlyRevenue - monthlyCost;

  const breakEvenDays = monthlyProfit > 0 ? (minerCostUsd / (monthlyProfit / 30)) : Infinity;
  const monthlyROI = (monthlyProfit / minerCostUsd) * 100;

  return {
    monthlyRevenue,
    monthlyCost,
    monthlyProfit,
    breakEvenDays,
    monthlyROI,
  };
}
