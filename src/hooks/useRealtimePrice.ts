import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  btc: number;
  tyt: number;
  eth: number;
  sol: number;
  change24h: {
    btc: number;
    tyt: number;
    eth: number;
    sol: number;
  };
  lastUpdate: Date;
}

export function useRealtimePrice(updateInterval: number = 30000) {
  const [prices, setPrices] = useState<PriceData>({
    btc: 0,
    tyt: 0,
    eth: 0,
    sol: 0,
    change24h: {
      btc: 0,
      tyt: 0,
      eth: 0,
      sol: 0
    },
    lastUpdate: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
      );

      if (!response.ok) throw new Error('Failed to fetch prices');

      const data = await response.json();

      setPrices({
        btc: data.bitcoin?.usd || 0,
        tyt: 0.025,
        eth: data.ethereum?.usd || 0,
        sol: data.solana?.usd || 0,
        change24h: {
          btc: data.bitcoin?.usd_24h_change || 0,
          tyt: 5.2,
          eth: data.ethereum?.usd_24h_change || 0,
          sol: data.solana?.usd_24h_change || 0
        },
        lastUpdate: new Date()
      });

      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();

    const interval = setInterval(fetchPrices, updateInterval);

    return () => clearInterval(interval);
  }, [fetchPrices, updateInterval]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    fetchPrices();
  }, [fetchPrices]);

  return { prices, isLoading, error, refresh };
}
