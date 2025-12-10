import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, Cpu, TrendingUp, AlertCircle, ArrowRight, Database } from 'lucide-react';
import type { CustodialWallet, NFTMiner, DailyReward } from '../../types/database';
import { seedDemoData } from '../../utils/seedData';

export default function Dashboard() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<CustodialWallet[]>([]);
  const [miners, setMiners] = useState<NFTMiner[]>([]);
  const [recentRewards, setRecentRewards] = useState<DailyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [walletsRes, minersRes, rewardsRes] = await Promise.all([
        supabase
          .from('custodial_wallets')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('nft_miners')
          .select('*')
          .eq('owner_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('daily_rewards')
          .select('*')
          .order('reward_date', { ascending: false })
          .limit(7)
      ]);

      if (walletsRes.data) setWallets(walletsRes.data);
      if (minersRes.data) setMiners(minersRes.data);
      if (rewardsRes.data) setRecentRewards(rewardsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      await seedDemoData(user.id);
      await loadDashboardData();
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setSeeding(false);
    }
  };

  const totalHashrate = miners.reduce((sum, miner) => sum + miner.hashrate_th, 0);
  const avgEfficiency = miners.length > 0
    ? miners.reduce((sum, miner) => sum + miner.efficiency_w_per_th, 0) / miners.length
    : 0;

  const todayReward = recentRewards[0];
  const weeklyRewards = recentRewards.reduce(
    (sum, reward) => sum + parseFloat(reward.net_btc),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your TYT mining platform</p>
        </div>
        {miners.length === 0 && wallets.length === 0 && (
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Database size={20} />
            {seeding ? 'Loading...' : 'Load Demo Data'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">BTC Balance</div>
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {wallets.find(w => w.asset === 'BTC')?.balance || '0.00000000'} BTC
          </div>
          <div className="text-xs text-gray-500 mt-2">
            ≈ ${(parseFloat(wallets.find(w => w.asset === 'BTC')?.balance || '0') * 95000).toFixed(2)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">TYT Balance</div>
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {wallets.find(w => w.asset === 'TYT')?.balance || '0'} TYT
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Maintenance discount available
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Total Hashrate</div>
            <Cpu className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {totalHashrate.toFixed(2)} TH/s
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {miners.length} active miner{miners.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Today's Reward</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {todayReward ? parseFloat(todayReward.net_btc).toFixed(8) : '0.00000000'} BTC
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last 7 days: {weeklyRewards.toFixed(8)} BTC
          </div>
        </div>
      </div>

      {miners.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-400 mb-2">No Active Miners</h3>
              <p className="text-gray-300 mb-4">
                You don't have any active miners yet. Purchase your first NFT miner to start earning daily BTC rewards.
              </p>
              <Link
                to="/app/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
              >
                Browse Marketplace
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Rewards</h2>
            <Link to="/app/rewards" className="text-sm text-amber-400 hover:text-amber-300">
              View All
            </Link>
          </div>

          {recentRewards.length > 0 ? (
            <div className="space-y-3">
              {recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-sm font-semibold">
                      {new Date(reward.reward_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Gross: {parseFloat(reward.gross_btc).toFixed(8)} BTC
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-400">
                      +{parseFloat(reward.net_btc).toFixed(8)} BTC
                    </div>
                    <div className="text-xs text-gray-400">
                      Maintenance: {parseFloat(reward.maintenance_cost_btc).toFixed(8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No rewards yet. Start mining to earn BTC!
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">My Miners</h2>
            <Link to="/app/miners" className="text-sm text-amber-400 hover:text-amber-300">
              Manage All
            </Link>
          </div>

          {miners.length > 0 ? (
            <div className="space-y-3">
              {miners.slice(0, 3).map((miner) => (
                <div key={miner.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Miner #{miner.id.slice(0, 8)}</div>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      {miner.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Hashrate</div>
                      <div className="font-semibold text-amber-400">{miner.hashrate_th} TH/s</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Efficiency</div>
                      <div className="font-semibold text-amber-400">{miner.efficiency_w_per_th} W/TH</div>
                    </div>
                  </div>
                </div>
              ))}
              {miners.length > 3 && (
                <div className="text-center text-sm text-gray-400">
                  +{miners.length - 3} more miner{miners.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No miners yet. Purchase your first miner!
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/app/marketplace"
            className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            <div>
              <div className="font-semibold">Buy Miners</div>
              <div className="text-sm text-gray-400">Browse marketplace</div>
            </div>
          </Link>

          <Link
            to="/app/academy"
            className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-3"
          >
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <div>
              <div className="font-semibold">Learn & Earn</div>
              <div className="text-sm text-gray-400">Visit Academy</div>
            </div>
          </Link>

          <Link
            to="/app/wallet"
            className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-3"
          >
            <Wallet className="w-6 h-6 text-amber-400" />
            <div>
              <div className="font-semibold">Manage Wallet</div>
              <div className="text-sm text-gray-400">Deposits & withdrawals</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
