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

const fallbackPrices = {
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

export default function EnhancedPriceTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [prices, setPrices] = useState<Record<string, { price: number; change24h: number; volume24h: number }>>(fallbackPrices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchCryptoPrices();
        setPrices(data);
        setIsLoading(false);
        console.log('Prices loaded:', data);
      } catch (error) {
        console.error('Failed to load prices:', error);
        setIsLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  const duplicatedAssets = [...CRYPTO_ASSETS, ...CRYPTO_ASSETS, ...CRYPTO_ASSETS];

  return (
    <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/50 overflow-hidden relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-gray-900/90 px-3 py-1 rounded-full border border-green-500/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-green-400">LIVE</span>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-3 py-2 pl-24 ${isPaused ? '' : 'animate-scroll'}`}
        >
          {duplicatedAssets.map((asset, idx) => {
            const priceData = prices[asset.symbol] || { price: 0, change24h: 0, volume24h: 0 };
            const isPositive = priceData.change24h >= 0;

            return (
              <div
                key={`${asset.symbol}-${idx}`}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-800/40 border border-gray-700/30 backdrop-blur-sm whitespace-nowrap hover:bg-gray-800/60 transition-colors duration-200"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${asset.color} bg-gray-900/50 border border-current/10`}>
                  {asset.IconComponent ? (
                    <asset.IconComponent size={14} />
                  ) : (
                    <span className="text-sm">{asset.emoji}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{asset.symbol}</span>

                  <div className="h-4 w-px bg-gray-700/50" />

                  <span className="font-semibold text-white text-xs">
                    ${priceData.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.symbol === 'BTC' || asset.symbol === 'ETH' ? 0 : 2,
                      maximumFractionDigits: asset.symbol === 'USDT' || asset.symbol === 'USDC' ? 2 : asset.symbol === 'TYT' ? 4 : 2
                    })}
                  </span>

                  <div className={`text-[10px] font-medium flex items-center gap-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? (
                      <TrendingUp size={9} />
                    ) : (
                      <TrendingDown size={9} />
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
