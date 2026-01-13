import { Cpu, Zap, Settings, DollarSign, User, MapPin } from 'lucide-react';

interface MarketplaceListing {
  id: string;
  price_tyt: number;
  price_usd: number;
  miner: {
    token_id: number;
    hashrate: number;
    efficiency: number;
    name: string;
    status: string;
  };
  seller: {
    username: string;
  };
}

interface MarketplaceMinerCardProps {
  listing: MarketplaceListing;
  onBuy: (listingId: string) => void;
}

export default function MarketplaceMinerCard({ listing, onBuy }: MarketplaceMinerCardProps) {
  const dailyBTC = (listing.miner.hashrate * 0.00000015).toFixed(8);
  const efficiency = listing.miner.efficiency || 25;

  const estimatedROI = listing.price_usd > 0
    ? (parseFloat(dailyBTC) * 45000 * 365 / listing.price_usd * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6 hover:border-gold-500/40 transition-all hover:shadow-lg hover:shadow-gold-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-navy-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Miner #{listing.miner.token_id}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <User className="w-3 h-3" />
              <span>{listing.seller.username}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gold-400 font-bold text-xl">
            <DollarSign className="w-5 h-5" />
            <span>{listing.price_tyt}</span>
          </div>
          <p className="text-xs text-gray-400">TYT</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-navy-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Zap className="w-3 h-3" />
            <span>Hashrate</span>
          </div>
          <p className="text-lg font-bold text-white">
            {listing.miner.hashrate} <span className="text-xs text-gray-400">TH/s</span>
          </p>
        </div>

        <div className="bg-navy-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Settings className="w-3 h-3" />
            <span>Efficiency</span>
          </div>
          <p className="text-lg font-bold text-white">
            {efficiency} <span className="text-xs text-gray-400">W/TH</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div>
          <p className="text-xs text-gray-400 mb-1">Daily Earnings</p>
          <p className="text-sm font-bold text-green-400">{dailyBTC} BTC</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Est. ROI/Year</p>
          <p className="text-sm font-bold text-blue-400">{estimatedROI}%</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          <span>{listing.miner.name || 'Global'}</span>
        </div>
      </div>

      <button
        onClick={() => onBuy(listing.id)}
        className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-lg font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled
        title="Buy functionality will be enabled after smart contract deployment"
      >
        Buy Now
      </button>
    </div>
  );
}
