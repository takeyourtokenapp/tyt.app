interface CoinGeckoPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
}

interface PriceData {
  price: number;
  change24h: number;
  volume24h: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  TRX: 'tron',
  XRP: 'ripple',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  TON: 'the-open-network',
  USDT: 'tether',
  USDC: 'usd-coin',
};

let priceCache: Record<string, { data: PriceData; timestamp: number }> = {};
const CACHE_DURATION = 60000;

export async function fetchCryptoPrices(): Promise<Record<string, PriceData>> {
  const now = Date.now();

  const cachedData = priceCache['all'];
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data as any;
  }

  try {
    const ids = Object.values(COIN_IDS).join(',');
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    const data = await response.json();

    const prices: Record<string, PriceData> = {};

    for (const [symbol, coinId] of Object.entries(COIN_IDS)) {
      const coinData = data[coinId];
      if (coinData) {
        prices[symbol] = {
          price: coinData.usd || 0,
          change24h: coinData.usd_24h_change || 0,
          volume24h: (coinData.usd_24h_vol || 0) / 1e9,
        };
      }
    }

    prices['TYT'] = {
      price: 0.05,
      change24h: 5.2,
      volume24h: 0.0012,
    };

    priceCache['all'] = {
      data: prices as any,
      timestamp: now,
    };

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);

    return getFallbackPrices();
  }
}

function getFallbackPrices(): Record<string, PriceData> {
  return {
    BTC: { price: 95000, change24h: 5.2, volume24h: 28.5 },
    ETH: { price: 3500, change24h: 10.1, volume24h: 15.2 },
    SOL: { price: 140, change24h: 0.26, volume24h: 2.1 },
    BNB: { price: 620, change24h: 2.8, volume24h: 1.8 },
    TRX: { price: 0.15, change24h: -1.2, volume24h: 0.89 },
    XRP: { price: 2.5, change24h: 3.8, volume24h: 3.2 },
    ADA: { price: 1.05, change24h: 4.5, volume24h: 1.5 },
    AVAX: { price: 42.5, change24h: -2.1, volume24h: 0.95 },
    DOT: { price: 8.75, change24h: 1.9, volume24h: 0.67 },
    MATIC: { price: 1.15, change24h: 6.3, volume24h: 0.85 },
    LINK: { price: 18.5, change24h: 3.7, volume24h: 0.72 },
    UNI: { price: 12.8, change24h: -0.8, volume24h: 0.45 },
    TON: { price: 5.25, change24h: 7.2, volume24h: 0.38 },
    TYT: { price: 0.05, change24h: 5.2, volume24h: 0.0012 },
    USDT: { price: 1.0, change24h: 0.0, volume24h: 45.0 },
    USDC: { price: 1.0, change24h: 0.01, volume24h: 23.5 },
  };
}

export function clearPriceCache() {
  priceCache = {};
}
