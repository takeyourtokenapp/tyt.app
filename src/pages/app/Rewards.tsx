import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp,
  Calendar,
  Download,
  Shield,
  CheckCircle2,
  BarChart3,
  Filter,
  Search,
  X,
  Eye,
  FileText,
  Activity,
  DollarSign
} from 'lucide-react';
import type { DailyReward, NFTMiner } from '../../types/database';
import { EnhancedMerkleProofViewer } from '../../components/EnhancedMerkleProofViewer';

type RewardWithMiner = DailyReward & { miner?: NFTMiner };
type ModalType = 'proof' | 'chart' | null;

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<RewardWithMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'net' | 'gross'>('date');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedReward, setSelectedReward] = useState<RewardWithMiner | null>(null);

  useEffect(() => {
    if (user) {
      loadRewards();
    }
  }, [user, timeRange]);

  const loadRewards = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('daily_rewards')
        .select(`
          *,
          nft_miners!inner(id, hashrate_th, owner_id, miner_model, tier, rarity)
        `)
        .eq('nft_miners.owner_id', user.id)
        .order('reward_date', { ascending: false });

      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte('reward_date', cutoffDate.toISOString());
      }

      const { data, error } = await query.limit(200);

      if (error) throw error;
      if (data) setRewards(data as any);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Miner ID', 'Hashrate (TH/s)', 'Gross BTC', 'Maintenance BTC', 'Net BTC', 'USD Value', 'Merkle Leaf'];
    const rows = filteredRewards.map(reward => [
      new Date(reward.reward_date).toLocaleDateString(),
      reward.miner_id,
      reward.hashrate_snapshot_th,
      reward.gross_btc,
      reward.maintenance_cost_btc,
      reward.net_btc,
      (parseFloat(reward.net_btc) * 95000).toFixed(2),
      reward.merkle_leaf || 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tyt-rewards-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredRewards = rewards
    .filter(reward => {
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        return (
          reward.miner_id.toLowerCase().includes(search) ||
          reward.id.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.reward_date).getTime() - new Date(a.reward_date).getTime();
        case 'net':
          return parseFloat(b.net_btc) - parseFloat(a.net_btc);
        case 'gross':
          return parseFloat(b.gross_btc) - parseFloat(a.gross_btc);
        default:
          return 0;
      }
    });

  const totalGross = rewards.reduce((sum, r) => sum + parseFloat(r.gross_btc), 0);
  const totalMaintenance = rewards.reduce((sum, r) => sum + parseFloat(r.maintenance_cost_btc), 0);
  const totalNet = rewards.reduce((sum, r) => sum + parseFloat(r.net_btc), 0);
  const avgDailyNet = rewards.length > 0 ? totalNet / rewards.length : 0;
  const totalUSD = totalNet * 95000;

  const chartData = rewards.slice(0, 30).reverse().map(r => ({
    date: new Date(r.reward_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    net: parseFloat(r.net_btc),
    gross: parseFloat(r.gross_btc)
  }));

  const maxChartValue = Math.max(...chartData.map(d => d.gross));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-tertiary-text">Loading rewards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards History</h1>
          <p className="text-tertiary-text">Track and analyze your mining rewards</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('chart')}
            className="px-4 py-2 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-all flex items-center gap-2"
          >
            <BarChart3 size={18} />
            Charts
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500/20 text-green-500 dark:text-green-400 rounded-lg font-semibold hover:bg-green-500/30 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-secondary-text text-sm font-medium">Total Net Earnings</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">{totalNet.toFixed(8)}</div>
          <div className="text-sm text-tertiary-text">BTC</div>
          <div className="text-xs text-tertiary-text mt-2">
            ≈ ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-secondary">
          <div className="flex items-center justify-between mb-4">
            <div className="text-tertiary-text text-sm">Avg Daily Net</div>
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">{avgDailyNet.toFixed(8)}</div>
          <div className="text-sm text-tertiary-text">BTC/day</div>
          <div className="text-xs text-tertiary-text mt-2">
            ≈ ${(avgDailyNet * 95000).toFixed(2)}/day
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-secondary">
          <div className="flex items-center justify-between mb-4">
            <div className="text-tertiary-text text-sm">Total Gross</div>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-1">{totalGross.toFixed(8)}</div>
          <div className="text-sm text-tertiary-text">BTC</div>
          <div className="text-xs text-tertiary-text mt-2">Before maintenance</div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-secondary">
          <div className="flex items-center justify-between mb-4">
            <div className="text-tertiary-text text-sm">Maintenance Costs</div>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-red-400 mb-1">{totalMaintenance.toFixed(8)}</div>
          <div className="text-sm text-tertiary-text">BTC</div>
          <div className="text-xs text-tertiary-text mt-2">
            {totalGross > 0 ? ((totalMaintenance / totalGross) * 100).toFixed(1) : 0}% of gross
          </div>
        </div>
      </div>

      <div className="bg-secondary rounded-xl p-6 border border-secondary">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tertiary-text" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by miner ID..."
                className="w-full pl-12 pr-4 py-3 bg-tertiary border border-secondary rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-tertiary border border-secondary rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="date">Sort by Date</option>
              <option value="net">Sort by Net (High to Low)</option>
              <option value="gross">Sort by Gross (High to Low)</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  timeRange === range
                    ? 'bg-amber-500 text-black'
                    : 'bg-tertiary text-tertiary-text hover:bg-secondary'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredRewards.length === 0 ? (
        <div className="bg-secondary rounded-xl p-12 border border-secondary text-center">
          <TrendingUp className="w-16 h-16 text-tertiary-text mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Rewards Found</h3>
          <p className="text-tertiary-text">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Your rewards will appear here once your miners start earning'}
          </p>
        </div>
      ) : (
        <div className="bg-secondary rounded-xl border border-secondary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-tertiary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-tertiary-text">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-tertiary-text">Miner</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-tertiary-text">Hashrate</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-tertiary-text">Gross BTC</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-tertiary-text">Maintenance</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-tertiary-text">Net BTC</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-tertiary-text">USD Value</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-tertiary-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filteredRewards.map((reward) => {
                  const usdValue = parseFloat(reward.net_btc) * 95000;

                  return (
                    <tr key={reward.id} className="hover:bg-tertiary transition-colors">
                      <td className="px-6 py-4 text-sm">
                        {new Date(reward.reward_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-mono text-tertiary-text">
                            #{reward.miner_id.slice(0, 8)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold">
                        {reward.hashrate_snapshot_th} TH/s
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-green-500 dark:text-green-400">
                        {parseFloat(reward.gross_btc).toFixed(8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-red-400">
                        -{parseFloat(reward.maintenance_cost_btc).toFixed(8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-amber-400">
                        {parseFloat(reward.net_btc).toFixed(8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-secondary-text">
                        ${usdValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {reward.merkle_leaf ? (
                            <button
                              onClick={() => {
                                setSelectedReward(reward);
                                setActiveModal('proof');
                              }}
                              className="text-green-500 dark:text-green-400 hover:text-green-300 transition-colors"
                              title="View Merkle Proof"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                          ) : (
                            <span className="text-gray-600 text-xs">Pending</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRewards.length > 0 && (
            <div className="px-6 py-4 bg-tertiary border-t border-secondary flex items-center justify-between text-sm text-tertiary-text">
              <div>
                Showing {filteredRewards.length} reward{filteredRewards.length !== 1 ? 's' : ''}
              </div>
              <div>
                Total: {totalNet.toFixed(8)} BTC (${totalUSD.toFixed(2)})
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-secondary rounded-xl p-6 border border-secondary">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Merkle Proof Verification
        </h3>
        <p className="text-sm text-tertiary-text leading-relaxed">
          All rewards are recorded with cryptographic Merkle proofs on the blockchain. These proofs ensure complete transparency
          and allow you to independently verify that your rewards were included in the daily Merkle root.
          Click the checkmark icon to view and verify the proof for any reward.
        </p>
      </div>

      {activeModal === 'proof' && selectedReward && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl border border-secondary max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                Merkle Proof Verification
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-tertiary-text hover:text-primary-text">
                <X size={24} />
              </button>
            </div>

            <EnhancedMerkleProofViewer
              data={{
                leafHash: selectedReward.merkle_leaf || 'pending',
                proof: selectedReward.merkle_proof ? JSON.parse(selectedReward.merkle_proof) : [],
                root: selectedReward.merkle_root || 'pending',
                index: parseInt(selectedReward.id?.slice(-4) || '0', 16),
                verified: !!selectedReward.merkle_root,
                epochOrDate: new Date(selectedReward.reward_date).toLocaleDateString(),
                rewardAmount: selectedReward.net_btc,
                minerId: selectedReward.miner_id
              }}
            />

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-4 px-4 py-3 bg-secondary rounded-lg font-semibold hover:bg-tertiary transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'chart' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl border border-secondary max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                Earnings Chart
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-tertiary-text hover:text-primary-text">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-tertiary rounded-lg p-4 text-center">
                  <div className="text-sm text-tertiary-text mb-1">Period</div>
                  <div className="text-xl font-bold text-amber-400">
                    {timeRange === '7d' ? '7 Days' : timeRange === '30d' ? '30 Days' : timeRange === '90d' ? '90 Days' : 'All Time'}
                  </div>
                </div>
                <div className="bg-tertiary rounded-lg p-4 text-center">
                  <div className="text-sm text-tertiary-text mb-1">Total Net</div>
                  <div className="text-xl font-bold text-green-500 dark:text-green-400">{totalNet.toFixed(6)} BTC</div>
                </div>
                <div className="bg-tertiary rounded-lg p-4 text-center">
                  <div className="text-sm text-tertiary-text mb-1">USD Value</div>
                  <div className="text-xl font-bold text-blue-500 dark:text-blue-400">${totalUSD.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-tertiary rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Daily Earnings (Last 30 Days)</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      <span className="text-tertiary-text">Gross</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-tertiary-text">Net</span>
                    </div>
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-1">
                  {chartData.map((item, index) => {
                    const grossHeight = (item.gross / maxChartValue) * 100;
                    const netHeight = (item.net / maxChartValue) * 100;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="w-full flex flex-col items-center justify-end h-full relative">
                          <div
                            className="w-full bg-green-500/30 dark:bg-green-400/30 hover:bg-green-500/50 dark:hover:bg-green-400/50 transition-all rounded-t relative group"
                            style={{ height: `${grossHeight}%` }}
                          >
                            <div
                              className="absolute bottom-0 w-full bg-amber-400 hover:bg-amber-500 transition-all rounded-t"
                              style={{ height: `${(netHeight / grossHeight) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-tertiary-text mt-2 rotate-45 origin-left whitespace-nowrap">
                          {item.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full px-4 py-3 bg-secondary rounded-lg font-semibold hover:bg-tertiary transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
