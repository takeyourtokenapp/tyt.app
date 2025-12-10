import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Calendar, Download, Shield, CheckCircle2 } from 'lucide-react';
import type { DailyReward, NFTMiner } from '../../types/database';

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<(DailyReward & { miner?: NFTMiner })[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    if (user) {
      loadRewards();
    }
  }, [user, timeRange]);

  const loadRewards = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('daily_rewards')
        .select(`
          *,
          nft_miners!inner(id, hashrate_th, owner_id)
        `)
        .eq('nft_miners.owner_id', user.id)
        .order('reward_date', { ascending: false });

      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte('reward_date', cutoffDate.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      if (data) setRewards(data as any);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalGross = rewards.reduce((sum, r) => sum + parseFloat(r.gross_btc), 0);
  const totalMaintenance = rewards.reduce((sum, r) => sum + parseFloat(r.maintenance_cost_btc), 0);
  const totalNet = rewards.reduce((sum, r) => sum + parseFloat(r.net_btc), 0);

  const avgDailyNet = rewards.length > 0 ? totalNet / rewards.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards History</h1>
          <p className="text-gray-400">Track your daily BTC earnings</p>
        </div>
        <button className="px-4 py-2 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Total Net</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{totalNet.toFixed(8)} BTC</div>
          <div className="text-xs text-gray-500 mt-2">
            ≈ ${(totalNet * 95000).toFixed(2)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Avg Daily</div>
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{avgDailyNet.toFixed(8)} BTC</div>
          <div className="text-xs text-gray-500 mt-2">
            ≈ ${(avgDailyNet * 95000).toFixed(2)}/day
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Total Gross</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{totalGross.toFixed(8)} BTC</div>
          <div className="text-xs text-gray-500 mt-2">Before maintenance</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Maintenance</div>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{totalMaintenance.toFixed(8)} BTC</div>
          <div className="text-xs text-gray-500 mt-2">
            {totalGross > 0 ? ((totalMaintenance / totalGross) * 100).toFixed(1) : 0}% of gross
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['7d', '30d', '90d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              timeRange === range
                ? 'bg-amber-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
          </button>
        ))}
      </div>

      {rewards.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-12 border border-gray-700 text-center">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Rewards Yet</h3>
          <p className="text-gray-400">
            Your rewards will appear here once your miners start earning
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Miner</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Hashrate</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Gross BTC</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Maintenance</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Net BTC</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      {new Date(reward.reward_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">
                      #{reward.miner_id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {reward.hashrate_snapshot_th} TH/s
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      {parseFloat(reward.gross_btc).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-red-400">
                      -{parseFloat(reward.maintenance_cost_btc).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-amber-400">
                      {parseFloat(reward.net_btc).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {reward.merkle_leaf ? (
                        <button className="text-green-400 hover:text-green-300 transition-colors">
                          <CheckCircle2 size={20} />
                        </button>
                      ) : (
                        <span className="text-gray-600 text-xs">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Merkle Proof Verification
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          All rewards are recorded with cryptographic Merkle proofs. These proofs ensure transparency
          and allow you to independently verify that your rewards were included in the daily Merkle root
          published on-chain. Click the checkmark icon to view the proof for any reward.
        </p>
      </div>
    </div>
  );
}
