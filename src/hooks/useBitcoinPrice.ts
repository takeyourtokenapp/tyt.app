import { useState, useEffect } from 'react';
import { bitcoinPriceService, BitcoinPrice, NetworkStats, MiningEstimate } from '../utils/bitcoinPriceService';

interface UseBitcoinPriceReturn {
  price: BitcoinPrice | null;
  network: NetworkStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and monitor Bitcoin price and network stats
 */
export function useBitcoinPrice(autoRefresh = true, refreshInterval = 60000): UseBitcoinPriceReturn {
  const [price, setPrice] = useState<BitcoinPrice | null>(null);
  const [network, setNetwork] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [priceData, networkData] = await Promise.all([
        bitcoinPriceService.getBitcoinPrice(),
        bitcoinPriceService.getNetworkStats()
      ]);

      setPrice(priceData);
      setNetwork(networkData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bitcoin data');
      console.error('Error fetching Bitcoin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    price,
    network,
    loading,
    error,
    refresh: fetchData
  };
}

interface UseMiningCalculatorReturn {
  estimate: MiningEstimate | null;
  loading: boolean;
  error: string | null;
  calculate: (params: {
    powerTH: number;
    efficiencyWTH?: number;
    electricityCostKWh?: number;
    maintenanceRate?: number;
    serviceFee?: number;
    discountPercent?: number;
  }) => Promise<void>;
}

/**
 * Hook for real-time mining profitability calculations
 */
export function useMiningCalculator(): UseMiningCalculatorReturn {
  const [estimate, setEstimate] = useState<MiningEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (params: {
    powerTH: number;
    efficiencyWTH?: number;
    electricityCostKWh?: number;
    maintenanceRate?: number;
    serviceFee?: number;
    discountPercent?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await bitcoinPriceService.calculateMiningProfit(
        params.powerTH,
        params.efficiencyWTH,
        params.electricityCostKWh,
        params.maintenanceRate,
        params.serviceFee,
        params.discountPercent
      );

      setEstimate(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate mining profit');
      console.error('Error calculating mining profit:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    estimate,
    loading,
    error,
    calculate
  };
}

/**
 * Hook for formatted currency display
 */
export function useFormattedPrice(amount: number, currency: 'USD' | 'BTC' | 'EUR' = 'USD'): string {
  return bitcoinPriceService.formatCurrency(amount, currency);
}
