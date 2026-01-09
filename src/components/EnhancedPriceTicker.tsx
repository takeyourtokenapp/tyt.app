import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign } from 'lucide-react';
import { fetchCryptoPrices } from '../utils/api/cryptoPriceService';

interface CryptoAsset {
  symbol: string;
  name: string;
  IconComponent?: React.ComponentType<{ className?: string; size?: number }>;
  emoji?: string;
  color: string;
  gradient: string;
}

const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    IconComponent: Bitcoin,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-600/20 border-orange-500/30'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    emoji: 'Ξ',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    emoji: '◎',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-pink-600/20 border-purple-500/30'
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    emoji: 'Ⓑ',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    emoji: 'Ⓧ',
    color: 'text-slate-400',
    gradient: 'from-slate-500/20 to-gray-600/20 border-slate-500/30'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    emoji: '₳',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-blue-600/20 border-indigo-500/30'
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    emoji: 'Ⓐ',
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-pink-600/20 border-rose-500/30'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    emoji: '●',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-fuchsia-600/20 border-pink-500/30'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    emoji: 'Ⓜ',
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 to-purple-600/20 border-violet-500/30'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    emoji: '⬡',
    color: 'text-sky-400',
    gradient: 'from-sky-500/20 to-blue-600/20 border-sky-500/30'
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    emoji: '🦄',
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-500/20 to-pink-600/20 border-fuchsia-500/30'
  },
  {
    symbol: 'TON',
    name: 'Toncoin',
    emoji: '💎',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30'
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    emoji: 'Ⓣ',
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-rose-600/20 border-red-500/30'
  },
  {
    symbol: 'TYT',
    name: 'TakeYourToken',
    emoji: '🦉',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-yellow-600/20 border-amber-500/30'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    IconComponent: DollarSign,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-600/20 border-green-500/30'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    IconComponent: DollarSign,
    color: 'text-teal-400',
    gradient: 'from-teal-500/20 to-cyan-600/20 border-teal-500/30'
  },
];

export default function EnhancedPriceTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [prices, setPrices] = useState<Record<string, { price: number; change24h: number; volume24h: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        console.log('[PriceTicker] Fetching prices...');
        const data = await fetchCryptoPrices();
        console.log('[PriceTicker] Received data:', {
          BTC: data.BTC?.price,
          ETH: data.ETH?.price,
          SOL: data.SOL?.price,
          timestamp: new Date().toISOString()
        });
        setPrices(data);
        setLastUpdate(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('[PriceTicker] Failed to load prices:', error);
        setIsLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 180000);

    return () => clearInterval(interval);
  }, []);

  const duplicatedAssets = [...CRYPTO_ASSETS, ...CRYPTO_ASSETS, ...CRYPTO_ASSETS];

  const hasData = Object.keys(prices).length > 0;

  return (
    <div className="bg-tertiary border-b-2 border-amber-500/20 overflow-hidden relative shadow-lg">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-green-400/30 shadow-lg shadow-green-500/20">
        <div className={`w-2 h-2 rounded-full ${hasData ? 'bg-green-400 animate-pulse shadow-sm shadow-green-400' : 'bg-tertiary-text'}`}></div>
        <span className={`text-xs font-bold ${hasData ? 'text-green-400' : 'text-tertiary-text'}`}>
          {isLoading ? 'Loading...' : 'LIVE'}
        </span>
        {lastUpdate && (
          <span className="text-[10px] text-tertiary-text">
            {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-4 py-3 pl-28 ${isPaused ? '' : 'animate-scroll'}`}
        >
          {duplicatedAssets.map((asset, idx) => {
            const priceData = prices[asset.symbol] || { price: 0, change24h: 0, volume24h: 0 };
            const isPositive = priceData.change24h >= 0;

            return (
              <div
                key={`${asset.symbol}-${idx}`}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary backdrop-blur-sm border border-secondary hover:border-amber-500/40 whitespace-nowrap hover:bg-tertiary transition-all shadow-sm hover:shadow-md hover:shadow-amber-500/10"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${asset.color} bg-primary/80 border-2 border-current/20 shadow-inner`}>
                  {asset.IconComponent ? (
                    <asset.IconComponent size={16} />
                  ) : (
                    <span className="text-base">{asset.emoji}</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-primary-text text-sm tracking-wide">{asset.symbol}</span>

                  <div className="h-5 w-px bg-secondary" />

                  <span className="font-bold text-primary-text text-sm">
                    ${priceData.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.symbol === 'BTC' || asset.symbol === 'ETH' ? 0 : 2,
                      maximumFractionDigits: asset.symbol === 'USDT' || asset.symbol === 'USDC' ? 2 : asset.symbol === 'TYT' ? 4 : 2
                    })}
                  </span>

                  <div className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded ${isPositive ? 'text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-400/10' : 'text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10'}`}>
                    {isPositive ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          .animate-scroll {
            animation: scroll 80s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
