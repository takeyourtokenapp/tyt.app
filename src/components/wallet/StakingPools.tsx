import { Lock, Zap } from 'lucide-react';

const STAKING_POOLS = [
  { duration: 30, apy: 8, label: '30 Days' },
  { duration: 90, apy: 15, label: '90 Days' },
  { duration: 180, apy: 25, label: '180 Days' },
  { duration: 365, apy: 40, label: '1 Year' }
];

export default function StakingPools() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Stake TYT</h2>
        <p className="text-gray-400">Lock TYT tokens to earn rewards and governance power</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STAKING_POOLS.map(pool => (
          <div
            key={pool.duration}
            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gold-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-lg">{pool.label}</div>
              <div className="text-green-400 font-bold text-xl">{pool.apy}% APY</div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Lock size={14} />
                <span>Lock period: {pool.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} />
                <span>Daily rewards</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all">
              Stake Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
