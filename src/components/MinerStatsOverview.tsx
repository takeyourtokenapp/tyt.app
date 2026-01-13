import { Cpu, Zap, Activity, DollarSign } from 'lucide-react';
import type { NFTMiner } from '../types/database';

interface MinerStatsOverviewProps {
  miners: NFTMiner[];
}

export default function MinerStatsOverview({ miners }: MinerStatsOverviewProps) {
  const activeMiners = miners.filter(m => m.status === 'active').length;
  const totalHashrate = miners.reduce((sum, m) => sum + (m.hashrate || 0), 0);
  const totalPower = miners.reduce((sum, m) => sum + (m.hashrate || 0) * (m.efficiency || 25), 0);
  const dailyBTC = (totalHashrate * 0.00000015).toFixed(8);

  const stats = [
    {
      icon: Cpu,
      label: 'Total Miners',
      value: miners.length.toString(),
      subtext: `${activeMiners} active`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Zap,
      label: 'Total Hashrate',
      value: `${totalHashrate.toFixed(2)} TH/s`,
      subtext: 'Combined power',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Activity,
      label: 'Power Consumption',
      value: `${(totalPower / 1000).toFixed(2)} kW`,
      subtext: 'Total draw',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: DollarSign,
      label: 'Est. Daily Earnings',
      value: `${dailyBTC} BTC`,
      subtext: `≈ $${(parseFloat(dailyBTC) * 45000).toFixed(2)}`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
