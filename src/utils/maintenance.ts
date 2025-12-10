export interface MaintenanceCostParams {
  hashrateTerahash: number;
  efficiencyWattsPerTh: number;
  kwhPriceUsd: number;
  serviceFeeUsd: number;
  vipLevel?: number;
  serviceButtonActive?: boolean;
  paymentMethod?: 'TYT' | 'USDT' | 'BTC';
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

/**
 * VIP tier discounts (0-10 levels)
 * From PDF: VIP levels 0-10, maintenance discount 0% → 15%
 */
export const VIP_DISCOUNTS: Record<number, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 7,
  7: 9,
  8: 11,
  9: 13,
  10: 15,
};

/**
 * Calculate comprehensive maintenance cost with all discounts
 * From PDF: Token payment (-20%), Service button (-3%), VIP (0-15%), Discount curve (2-18%)
 */
export function calculateNetMaintenanceCost(
  params: MaintenanceCostParams,
  tytBalance: number
): {
  grossCost: number;
  discountTier: DiscountTier | null;
  tokenPaymentDiscount: number;
  serviceButtonDiscount: number;
  vipDiscount: number;
  totalDiscountPct: number;
  discountAmount: number;
  netCost: number;
} {
  const grossCost = calculateDailyMaintenanceCost(params);
  const discountTier = getUserDiscountTier(tytBalance, grossCost);

  // 1. Discount curve (based on TYT balance coverage)
  const balanceDiscountPct = discountTier?.discountPct || 0;

  // 2. Token payment discount (-20% if paying with TYT)
  const tokenPaymentDiscount = params.paymentMethod === 'TYT' ? 20 : 0;

  // 3. Service button (-3% daily)
  const serviceButtonDiscount = params.serviceButtonActive ? 3 : 0;

  // 4. VIP discount (based on level)
  const vipDiscount = VIP_DISCOUNTS[params.vipLevel || 0] || 0;

  // Total discount (max 50% to prevent abuse)
  const totalDiscountPct = Math.min(
    balanceDiscountPct + tokenPaymentDiscount + serviceButtonDiscount + vipDiscount,
    50
  );

  const discountAmount = grossCost * (totalDiscountPct / 100);
  const netCost = grossCost - discountAmount;

  return {
    grossCost,
    discountTier,
    tokenPaymentDiscount,
    serviceButtonDiscount,
    vipDiscount,
    totalDiscountPct,
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
