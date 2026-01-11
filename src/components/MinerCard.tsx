import { Link } from 'react-router-dom';
import { Cpu, Zap, MapPin, TrendingUp, Settings } from 'lucide-react';
import type { NFTMiner } from '../types/database';

interface MinerCardProps {
  miner: NFTMiner;
}

export default function MinerCard({ miner }: MinerCardProps) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    maintenance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };

  const statusColor = statusColors[miner.status] || statusColors.inactive;

  const dailyBTC = (miner.power_th * 0.00000015).toFixed(8);
  const efficiency = miner.efficiency_w_th || 25;

  return (
    <Link
      to={`/app/miners/${miner.id}`}
      className="block bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6 hover:border-gold-500/40 transition-all hover:shadow-lg hover:shadow-gold-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-navy-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Miner #{miner.token_id}
            </h3>
            <p className="text-sm text-gray-400">
              {miner.region || 'Global'}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {miner.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-navy-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Zap className="w-3 h-3" />
            <span>Hashrate</span>
          </div>
          <p className="text-xl font-bold text-white">
            {miner.power_th} <span className="text-sm text-gray-400">TH/s</span>
          </p>
        </div>

        <div className="bg-navy-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Settings className="w-3 h-3" />
            <span>Efficiency</span>
          </div>
          <p className="text-xl font-bold text-white">
            {efficiency} <span className="text-sm text-gray-400">W/TH</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">Daily:</span>
          <span className="font-bold text-green-400">{dailyBTC} BTC</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{miner.data_center_id || 'DC-01'}</span>
        </div>
      </div>

      {miner.maintenance_due && new Date(miner.maintenance_due) < new Date() && (
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
          <p className="text-xs text-yellow-400 text-center">
            Maintenance payment required
          </p>
        </div>
      )}
    </Link>
  );
}
