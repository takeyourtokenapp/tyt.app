/**
 * Miner Upgrade System
 *
 * From PDF specification:
 * - 20 power levels (100 TH/s → 5000 TH/s max)
 * - Efficiency upgrades (5-20% improvement)
 * - Cheaper than buying new miner
 * - Paid in TYT (burns tokens)
 */

export interface UpgradeTier {
  level: number;
  maxHashrate: number;
  upgradeCostTyt: number;
  upgradeCostBtc?: number;
  efficiencyImprovementPercent: number;
  efficiencyUpgradeCostTyt?: number;
  description: string;
}

/**
 * All 20 upgrade tiers (as defined in migration)
 */
export const UPGRADE_TIERS: UpgradeTier[] = [
  { level: 1, maxHashrate: 100, upgradeCostTyt: 100, upgradeCostBtc: 0.0025, efficiencyImprovementPercent: 5, efficiencyUpgradeCostTyt: 50, description: 'Entry - 100 TH/s' },
  { level: 2, maxHashrate: 250, upgradeCostTyt: 200, upgradeCostBtc: 0.005, efficiencyImprovementPercent: 5, efficiencyUpgradeCostTyt: 75, description: 'Hobbyist - 250 TH/s' },
  { level: 3, maxHashrate: 500, upgradeCostTyt: 400, upgradeCostBtc: 0.01, efficiencyImprovementPercent: 5, efficiencyUpgradeCostTyt: 100, description: 'Enthusiast - 500 TH/s' },
  { level: 4, maxHashrate: 750, upgradeCostTyt: 600, upgradeCostBtc: 0.015, efficiencyImprovementPercent: 5, efficiencyUpgradeCostTyt: 150, description: 'Semi-Pro - 750 TH/s' },
  { level: 5, maxHashrate: 1000, upgradeCostTyt: 800, upgradeCostBtc: 0.02, efficiencyImprovementPercent: 5, efficiencyUpgradeCostTyt: 200, description: 'Pro - 1,000 TH/s' },
  { level: 6, maxHashrate: 1500, upgradeCostTyt: 1200, upgradeCostBtc: 0.03, efficiencyImprovementPercent: 7, efficiencyUpgradeCostTyt: 300, description: 'Advanced - 1,500 TH/s' },
  { level: 7, maxHashrate: 2000, upgradeCostTyt: 1600, upgradeCostBtc: 0.04, efficiencyImprovementPercent: 7, efficiencyUpgradeCostTyt: 400, description: 'Expert - 2,000 TH/s' },
  { level: 8, maxHashrate: 2500, upgradeCostTyt: 2000, upgradeCostBtc: 0.05, efficiencyImprovementPercent: 7, efficiencyUpgradeCostTyt: 500, description: 'Master - 2,500 TH/s' },
  { level: 9, maxHashrate: 3000, upgradeCostTyt: 2500, upgradeCostBtc: 0.0625, efficiencyImprovementPercent: 7, efficiencyUpgradeCostTyt: 600, description: 'Grandmaster - 3,000 TH/s' },
  { level: 10, maxHashrate: 3500, upgradeCostTyt: 3000, upgradeCostBtc: 0.075, efficiencyImprovementPercent: 10, efficiencyUpgradeCostTyt: 700, description: 'Elite - 3,500 TH/s' },
  { level: 11, maxHashrate: 4000, upgradeCostTyt: 3500, upgradeCostBtc: 0.0875, efficiencyImprovementPercent: 10, efficiencyUpgradeCostTyt: 800, description: 'Champion - 4,000 TH/s' },
  { level: 12, maxHashrate: 4200, upgradeCostTyt: 4000, upgradeCostBtc: 0.1, efficiencyImprovementPercent: 10, efficiencyUpgradeCostTyt: 900, description: 'Hero - 4,200 TH/s' },
  { level: 13, maxHashrate: 4400, upgradeCostTyt: 4500, upgradeCostBtc: 0.1125, efficiencyImprovementPercent: 10, efficiencyUpgradeCostTyt: 1000, description: 'Legend - 4,400 TH/s' },
  { level: 14, maxHashrate: 4600, upgradeCostTyt: 5000, upgradeCostBtc: 0.125, efficiencyImprovementPercent: 12, efficiencyUpgradeCostTyt: 1100, description: 'Mythic - 4,600 TH/s' },
  { level: 15, maxHashrate: 4750, upgradeCostTyt: 5500, upgradeCostBtc: 0.1375, efficiencyImprovementPercent: 12, efficiencyUpgradeCostTyt: 1200, description: 'Immortal - 4,750 TH/s' },
  { level: 16, maxHashrate: 4850, upgradeCostTyt: 6000, upgradeCostBtc: 0.15, efficiencyImprovementPercent: 12, efficiencyUpgradeCostTyt: 1300, description: 'Divine - 4,850 TH/s' },
  { level: 17, maxHashrate: 4925, upgradeCostTyt: 6500, upgradeCostBtc: 0.1625, efficiencyImprovementPercent: 15, efficiencyUpgradeCostTyt: 1400, description: 'Transcendent - 4,925 TH/s' },
  { level: 18, maxHashrate: 4975, upgradeCostTyt: 7000, upgradeCostBtc: 0.175, efficiencyImprovementPercent: 15, efficiencyUpgradeCostTyt: 1500, description: 'Celestial - 4,975 TH/s' },
  { level: 19, maxHashrate: 4990, upgradeCostTyt: 7500, upgradeCostBtc: 0.1875, efficiencyImprovementPercent: 15, efficiencyUpgradeCostTyt: 1600, description: 'Eternal - 4,990 TH/s' },
  { level: 20, maxHashrate: 5000, upgradeCostTyt: 8000, upgradeCostBtc: 0.2, efficiencyImprovementPercent: 20, efficiencyUpgradeCostTyt: 2000, description: 'Ultimate - 5,000 TH/s MAX' },
];

/**
 * Get upgrade tier by level
 */
export function getUpgradeTier(level: number): UpgradeTier | undefined {
  return UPGRADE_TIERS.find((t) => t.level === level);
}

/**
 * Get next upgrade tier for current level
 */
export function getNextUpgradeTier(currentLevel: number): UpgradeTier | undefined {
  if (currentLevel >= 20) return undefined;
  return UPGRADE_TIERS.find((t) => t.level === currentLevel + 1);
}

/**
 * Calculate hashrate upgrade cost
 */
export function calculateHashrateUpgradeCost(
  currentLevel: number,
  targetLevel: number
): {
  totalCostTyt: number;
  totalCostBtc: number;
  levels: number;
  isValid: boolean;
} {
  if (targetLevel <= currentLevel || targetLevel > 20 || currentLevel < 1) {
    return { totalCostTyt: 0, totalCostBtc: 0, levels: 0, isValid: false };
  }

  let totalTyt = 0;
  let totalBtc = 0;

  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    const tier = getUpgradeTier(level);
    if (tier) {
      totalTyt += tier.upgradeCostTyt;
      totalBtc += tier.upgradeCostBtc || 0;
    }
  }

  return {
    totalCostTyt: totalTyt,
    totalCostBtc: totalBtc,
    levels: targetLevel - currentLevel,
    isValid: true,
  };
}

/**
 * Calculate efficiency upgrade cost
 */
export function calculateEfficiencyUpgradeCost(level: number): {
  costTyt: number;
  improvementPercent: number;
  newEfficiency: number;
  isAvailable: boolean;
} {
  const tier = getUpgradeTier(level);

  if (!tier || !tier.efficiencyUpgradeCostTyt) {
    return { costTyt: 0, improvementPercent: 0, newEfficiency: 0, isAvailable: false };
  }

  return {
    costTyt: tier.efficiencyUpgradeCostTyt,
    improvementPercent: tier.efficiencyImprovementPercent,
    newEfficiency: 0, // To be calculated based on current efficiency
    isAvailable: true,
  };
}

/**
 * Apply efficiency improvement to current W/TH
 */
export function applyEfficiencyImprovement(
  currentEfficiency: number,
  improvementPercent: number
): number {
  // Lower W/TH is better, so we reduce it
  return currentEfficiency * (1 - improvementPercent / 100);
}

/**
 * Calculate estimated ROI improvement from upgrade
 */
export function calculateUpgradeROI(
  currentHashrate: number,
  targetHashrate: number,
  upgradeCost: number,
  dailyRewardPerTh: number,
  maintenanceCostPerTh: number
): {
  additionalDailyProfit: number;
  paybackDays: number;
  monthlyROI: number;
} {
  const additionalHashrate = targetHashrate - currentHashrate;
  const additionalDailyRevenue = additionalHashrate * dailyRewardPerTh;
  const additionalDailyCost = additionalHashrate * maintenanceCostPerTh;
  const additionalDailyProfit = additionalDailyRevenue - additionalDailyCost;

  const paybackDays = additionalDailyProfit > 0 ? upgradeCost / additionalDailyProfit : Infinity;
  const monthlyProfit = additionalDailyProfit * 30;
  const monthlyROI = (monthlyProfit / upgradeCost) * 100;

  return {
    additionalDailyProfit,
    paybackDays,
    monthlyROI,
  };
}

/**
 * Check if upgrade is available
 */
export function canUpgrade(
  currentLevel: number,
  currentHashrate: number,
  targetLevel: number
): {
  canUpgrade: boolean;
  reason?: string;
} {
  if (currentLevel >= 20) {
    return { canUpgrade: false, reason: 'Maximum level reached' };
  }

  if (targetLevel <= currentLevel) {
    return { canUpgrade: false, reason: 'Target level must be higher than current level' };
  }

  if (targetLevel > 20) {
    return { canUpgrade: false, reason: 'Maximum level is 20' };
  }

  const tier = getUpgradeTier(targetLevel);
  if (!tier) {
    return { canUpgrade: false, reason: 'Invalid target level' };
  }

  if (currentHashrate >= tier.maxHashrate) {
    return { canUpgrade: false, reason: 'Current hashrate already exceeds target tier' };
  }

  return { canUpgrade: true };
}

/**
 * Estimate new daily rewards after upgrade
 */
export function estimateUpgradedRewards(
  currentHashrate: number,
  currentEfficiency: number,
  targetLevel: number,
  btcNetworkHashrate: number = 400_000_000, // 400 EH/s in TH/s
  btcBlockReward: number = 3.125,
  blocksPerDay: number = 144
): {
  currentDailyBtc: number;
  upgradedDailyBtc: number;
  improvement: number;
  improvementPercent: number;
} {
  const tier = getUpgradeTier(targetLevel);
  if (!tier) {
    return {
      currentDailyBtc: 0,
      upgradedDailyBtc: 0,
      improvement: 0,
      improvementPercent: 0,
    };
  }

  // Current rewards
  const currentDailyBtc =
    (currentHashrate / btcNetworkHashrate) * (btcBlockReward * blocksPerDay);

  // Upgraded rewards (with higher hashrate)
  const upgradedHashrate = tier.maxHashrate;
  const upgradedDailyBtc =
    (upgradedHashrate / btcNetworkHashrate) * (btcBlockReward * blocksPerDay);

  const improvement = upgradedDailyBtc - currentDailyBtc;
  const improvementPercent = (improvement / currentDailyBtc) * 100;

  return {
    currentDailyBtc,
    upgradedDailyBtc,
    improvement,
    improvementPercent,
  };
}
