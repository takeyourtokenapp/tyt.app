/**
 * Real Bitcoin Price Service
 * Fetches live BTC price and network stats from multiple sources
 */

interface BitcoinPrice {
  usd: number;
  eur: number;
  timestamp: number;
  source: string;
}

interface NetworkStats {
  difficulty: number;
  hashrate: number; // EH/s
  blockHeight: number;
  blockReward: number;
  timestamp: number;
}

interface MiningEstimate {
  dailyBTC: number;
  dailyUSD: number;
  monthlyBTC: number;
  monthlyUSD: number;
  yearlyBTC: number;
  yearlyUSD: number;
  breakEvenDays: number;
  roi30Days: number;
  roi365Days: number;
}

class BitcoinPriceService {
  private priceCache: BitcoinPrice | null = null;
  private networkCache: NetworkStats | null = null;
  private readonly CACHE_DURATION = 60000; // 1 minute

  /**
   * Get current BTC price from CoinGecko
   */
  async getBitcoinPrice(): Promise<BitcoinPrice> {
    // Check cache
    if (this.priceCache && Date.now() - this.priceCache.timestamp < this.CACHE_DURATION) {
      return this.priceCache;
    }

    try {
      // CoinGecko Free API (no API key needed)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_last_updated_at=true'
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      this.priceCache = {
        usd: data.bitcoin.usd,
        eur: data.bitcoin.eur,
        timestamp: Date.now(),
        source: 'coingecko'
      };

      return this.priceCache;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);

      // Fallback to cached data if available
      if (this.priceCache) {
        console.warn('Using stale price data');
        return this.priceCache;
      }

      // Ultimate fallback - use estimated price
      return {
        usd: 43500,
        eur: 40000,
        timestamp: Date.now(),
        source: 'fallback'
      };
    }
  }

  /**
   * Get Bitcoin network statistics from Blockchain.info
   */
  async getNetworkStats(): Promise<NetworkStats> {
    // Check cache
    if (this.networkCache && Date.now() - this.networkCache.timestamp < this.CACHE_DURATION * 5) {
      return this.networkCache;
    }

    try {
      const response = await fetch('https://blockchain.info/q/getdifficulty');
      const difficulty = await response.json();

      const hashrateResponse = await fetch('https://blockchain.info/q/hashrate');
      const hashrate = await hashrateResponse.json();

      const blockHeightResponse = await fetch('https://blockchain.info/q/getblockcount');
      const blockHeight = await blockHeightResponse.json();

      // Current block reward is 6.25 BTC (until 2024 halving)
      // After April 2024 halving: 3.125 BTC
      const blockReward = Date.now() > new Date('2024-04-20').getTime() ? 3.125 : 6.25;

      this.networkCache = {
        difficulty: difficulty,
        hashrate: hashrate / 1000000000000000000, // Convert to EH/s
        blockHeight: blockHeight,
        blockReward: blockReward,
        timestamp: Date.now()
      };

      return this.networkCache;
    } catch (error) {
      console.error('Error fetching network stats:', error);

      // Fallback values
      if (this.networkCache) {
        return this.networkCache;
      }

      return {
        difficulty: 73197634206448,
        hashrate: 550, // ~550 EH/s
        blockHeight: 820000,
        blockReward: 3.125,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Calculate mining profitability for given hashrate
   *
   * @param powerTH - Hashpower in TH/s
   * @param efficiencyWTH - Power efficiency in W/TH
   * @param electricityCostKWh - Electricity cost per kWh (USD)
   * @param maintenanceRate - Daily maintenance rate (USD)
   * @param serviceFee - Platform service fee (0-1, e.g., 0.15 = 15%)
   * @param discountPercent - Discount percentage (0-1, e.g., 0.20 = 20%)
   */
  async calculateMiningProfit(
    powerTH: number,
    efficiencyWTH: number = 25,
    electricityCostKWh: number = 0.06,
    maintenanceRate: number = 0,
    serviceFee: number = 0.15,
    discountPercent: number = 0
  ): Promise<MiningEstimate> {
    const [price, network] = await Promise.all([
      this.getBitcoinPrice(),
      this.getNetworkStats()
    ]);

    // Calculate daily BTC production
    // Formula: (Your TH/s / Network TH/s) * Blocks per Day * Block Reward
    const networkTH = network.hashrate * 1000000; // Convert EH/s to TH/s
    const blocksPerDay = 144; // ~6 blocks per hour * 24 hours
    const grossDailyBTC = (powerTH / networkTH) * blocksPerDay * network.blockReward;

    // Calculate electricity cost
    const powerKW = (powerTH * efficiencyWTH) / 1000; // Convert to kW
    const dailyElectricityCost = powerKW * 24 * electricityCostKWh;

    // Calculate service fee
    const grossDailyUSD = grossDailyBTC * price.usd;
    const serviceFeeUSD = grossDailyUSD * serviceFee;

    // Apply discount to maintenance
    const effectiveMaintenanceRate = maintenanceRate * (1 - discountPercent);

    // Calculate net daily profit
    const dailyCosts = dailyElectricityCost + effectiveMaintenanceRate + serviceFeeUSD;
    const dailyCostsBTC = dailyCosts / price.usd;
    const netDailyBTC = grossDailyBTC - dailyCostsBTC;
    const netDailyUSD = netDailyBTC * price.usd;

    // Monthly/Yearly projections
    const monthlyBTC = netDailyBTC * 30;
    const monthlyUSD = netDailyUSD * 30;
    const yearlyBTC = netDailyBTC * 365;
    const yearlyUSD = netDailyUSD * 365;

    // ROI calculations (assuming initial cost)
    const estimatedInitialCost = powerTH * 150; // ~$150 per TH/s
    const breakEvenDays = netDailyUSD > 0 ? estimatedInitialCost / netDailyUSD : Infinity;
    const roi30Days = (monthlyUSD / estimatedInitialCost) * 100;
    const roi365Days = (yearlyUSD / estimatedInitialCost) * 100;

    return {
      dailyBTC: netDailyBTC,
      dailyUSD: netDailyUSD,
      monthlyBTC,
      monthlyUSD,
      yearlyBTC,
      yearlyUSD,
      breakEvenDays,
      roi30Days,
      roi365Days
    };
  }

  /**
   * Get simplified mining estimate with network stats
   */
  async getSimplifiedEstimate(powerTH: number): Promise<{
    price: BitcoinPrice;
    network: NetworkStats;
    estimate: MiningEstimate;
  }> {
    const [price, network] = await Promise.all([
      this.getBitcoinPrice(),
      this.getNetworkStats()
    ]);

    const estimate = await this.calculateMiningProfit(powerTH);

    return { price, network, estimate };
  }

  /**
   * Format currency with proper symbols
   */
  formatCurrency(amount: number, currency: 'USD' | 'BTC' | 'EUR' = 'USD'): string {
    if (currency === 'BTC') {
      return `₿${amount.toFixed(8)}`;
    } else if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  /**
   * Clear all caches (useful for testing)
   */
  clearCache(): void {
    this.priceCache = null;
    this.networkCache = null;
  }
}

// Singleton instance
export const bitcoinPriceService = new BitcoinPriceService();

// Export types
export type { BitcoinPrice, NetworkStats, MiningEstimate };
