import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, Zap, DollarSign } from 'lucide-react';
import { useRealtimePrice } from '../hooks/useRealtimePrice';

interface CryptoAsset {
  symbol: string;
  name: string;
  IconComponent?: React.ComponentType<{ className?: string; size?: number }>;
  emoji?: string;
  color: string;
}

const SUPPORTED_ASSETS: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', IconComponent: Bitcoin, color: 'orange' },
  { symbol: 'ETH', name: 'Ethereum', emoji: 'Ξ', color: 'blue' },
  { symbol: 'SOL', name: 'Solana', emoji: '◎', color: 'purple' },
  { symbol: 'TRX', name: 'Tron', emoji: 'Ⓣ', color: 'red' },
  { symbol: 'XRP', name: 'Ripple', emoji: 'Ⓧ', color: 'gray' },
  { symbol: 'TYT', name: 'TakeYourToken', emoji: '🦉', color: 'amber' },
  { symbol: 'USDT', name: 'Tether', IconComponent: DollarSign, color: 'green' },
];

export default function CryptoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const btcPrice = useRealtimePrice('BTC');

  const mockPrices: Record<string, { price: number; change24h: number; volume24h: number }> = {
    BTC: { price: btcPrice || 95000, change24h: 5.2, volume24h: 28500000000 },
    ETH: { price: 3500, change24h: 10.1, volume24h: 15200000000 },
    SOL: { price: 140, change24h: 0.26, volume24h: 2100000000 },
    TRX: { price: 0.15, change24h: -1.2, volume24h: 890000000 },
    XRP: { price: 2.5, change24h: 3.8, volume24h: 3200000000 },
    TYT: { price: 0.05, change24h: 5.2, volume24h: 1250000 },
    USDT: { price: 1.0, change24h: 0.0, volume24h: 45000000000 },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SUPPORTED_ASSETS.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleAssets = () => {
    const assets = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % SUPPORTED_ASSETS.length;
      assets.push(SUPPORTED_ASSETS[index]);
    }
    return assets;
  };

  const visibleAssets = getVisibleAssets();

  return (
    <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/50 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleAssets.map((asset, idx) => {
            const priceData = mockPrices[asset.symbol];
            const isPositive = priceData.change24h >= 0;

            return (
              <div
                key={`${asset.symbol}-${idx}`}
                className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-br ${
                  asset.color === 'orange' ? 'from-orange-500/10 to-amber-500/10 border-orange-500/30' :
                  asset.color === 'blue' ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/30' :
                  asset.color === 'purple' ? 'from-purple-500/10 to-pink-500/10 border-purple-500/30' :
                  asset.color === 'red' ? 'from-red-500/10 to-rose-500/10 border-red-500/30' :
                  asset.color === 'amber' ? 'from-amber-500/10 to-yellow-500/10 border-amber-500/30' :
                  asset.color === 'green' ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' :
                  'from-gray-500/10 to-slate-500/10 border-gray-500/30'
                } border transition-all duration-300 ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br ${
                    asset.color === 'orange' ? 'from-orange-500 to-amber-600' :
                    asset.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                    asset.color === 'purple' ? 'from-purple-500 to-pink-600' :
                    asset.color === 'red' ? 'from-red-500 to-rose-600' :
                    asset.color === 'amber' ? 'from-amber-500 to-yellow-600' :
                    asset.color === 'green' ? 'from-green-500 to-emerald-600' :
                    'from-gray-500 to-slate-600'
                  } shadow-lg`}>
                    {asset.IconComponent ? (
                      <asset.IconComponent className="text-white" size={24} />
                    ) : (
                      <span>{asset.emoji}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">{asset.symbol}</div>
                    <div className="text-xs text-gray-400">{asset.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-lg">
                    ${priceData.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.symbol === 'BTC' || asset.symbol === 'ETH' ? 0 : 2,
                      maximumFractionDigits: asset.symbol === 'USDT' ? 2 : asset.symbol === 'TYT' ? 4 : 2
                    })}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Vol: ${(priceData.volume24h / 1000000000).toFixed(2)}B
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-3">
          {SUPPORTED_ASSETS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-gold-400 w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
