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
    console.log('[CryptoPriceService] Using cached data');
    return cachedData.data as any;
  }

  try {
    const ids = Object.values(COIN_IDS).join(',');
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    console.log('[CryptoPriceService] Fetching from CoinGecko...');

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[CryptoPriceService] API response not OK:', response.status, response.statusText);
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }

    const data = await response.json();
    console.log('[CryptoPriceService] Successfully fetched data from CoinGecko');

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
  console.warn('[CryptoPriceService] Using fallback prices - API unavailable');
  return {
    BTC: { price: 86853, change24h: -0.56, volume24h: 35.0 },
    ETH: { price: 2913, change24h: -0.26, volume24h: 18.2 },
    SOL: { price: 121.66, change24h: -1.16, volume24h: 3.0 },
    BNB: { price: 589, change24h: 1.2, volume24h: 1.5 },
    TRX: { price: 0.24, change24h: 0.8, volume24h: 0.85 },
    XRP: { price: 2.24, change24h: -2.1, volume24h: 3.5 },
    ADA: { price: 0.89, change24h: -1.8, volume24h: 1.2 },
    AVAX: { price: 35.12, change24h: -0.9, volume24h: 0.82 },
    DOT: { price: 6.82, change24h: -1.5, volume24h: 0.55 },
    MATIC: { price: 0.47, change24h: -2.3, volume24h: 0.42 },
    LINK: { price: 22.34, change24h: 1.1, volume24h: 0.68 },
    UNI: { price: 13.52, change24h: -0.4, volume24h: 0.38 },
    TON: { price: 5.42, change24h: 0.9, volume24h: 0.35 },
    TYT: { price: 0.05, change24h: 5.2, volume24h: 0.0012 },
    USDT: { price: 1.0, change24h: 0.0, volume24h: 45.0 },
    USDC: { price: 1.0, change24h: 0.0, volume24h: 23.5 },
  };
}

export function clearPriceCache() {
  priceCache = {};
}
