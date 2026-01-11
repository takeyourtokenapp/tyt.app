import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Cpu,
  Zap,
  MapPin,
  Activity,
  DollarSign,
  Settings,
  ShoppingCart,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import type { NFTMiner } from '../../types/database';
import MinerPerformanceWidget from '../../components/MinerPerformanceWidget';
import MinerMaintenanceHistory from '../../components/MinerMaintenanceHistory';
import MinerUpgradePanel from '../../components/MinerUpgradePanel';

export default function MinerDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [miner, setMiner] = useState<NFTMiner | null>(null);
  const [maintenancePayments, setMaintenancePayments] = useState<any[]>([]);
  const [availableUpgrades, setAvailableUpgrades] = useState<any[]>([]);
  const [dailyRewards, setDailyRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && id) {
      loadMinerDetails();
    }
  }, [user, id]);

  const loadMinerDetails = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);

      const [minerRes, paymentsRes, upgradesRes, rewardsRes] = await Promise.all([
        supabase
          .from('nft_miners')
          .select('*')
          .eq('id', id)
          .eq('owner_id', user.id)
          .maybeSingle(),
        supabase
          .from('maintenance_invoices')
          .select('*')
          .eq('miner_id', id)
          .eq('status', 'paid')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('miner_upgrade_tiers')
          .select('*')
          .order('cost_tyt', { ascending: true }),
        supabase
          .from('daily_rewards')
          .select('*')
          .eq('user_id', user.id)
          .order('reward_date', { ascending: false })
          .limit(30)
      ]);

      if (minerRes.error) throw minerRes.error;
      if (!minerRes.data) {
        setError('Miner not found or you do not have access to it');
        return;
      }

      setMiner(minerRes.data);
      setMaintenancePayments(paymentsRes.data || []);
      setAvailableUpgrades(upgradesRes.data || []);
      setDailyRewards(rewardsRes.data || []);
    } catch (err) {
      console.error('Error loading miner details:', err);
      setError('Failed to load miner details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (tierId: string) => {
    console.log('Upgrade to tier:', tierId);
  };

  const handleListForSale = () => {
    navigate('/app/marketplace');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (error || !miner) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 mb-4">{error || 'Miner not found'}</p>
        <Link
          to="/app/miners"
          className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Miners
        </Link>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    maintenance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };

  const statusColor = statusColors[miner.status] || statusColors.inactive;
  const dailyBTC = (miner.power_th * 0.00000015).toFixed(8);
  const monthlyBTC = (parseFloat(dailyBTC) * 30).toFixed(8);
  const yearlyBTC = (parseFloat(dailyBTC) * 365).toFixed(8);

  const totalEarned = dailyRewards
    .reduce((sum, r) => sum + (r.net_btc || 0), 0)
    .toFixed(8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/app/miners"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Miners
        </Link>

        <button
          onClick={handleListForSale}
          className="flex items-center gap-2 px-6 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg font-bold transition-colors"
          disabled
          title="Marketplace listing will be enabled after smart contract deployment"
        >
          <ShoppingCart className="w-4 h-4" />
          List for Sale
        </button>
      </div>

      <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-8 h-8 text-navy-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Miner #{miner.token_id}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
                  {miner.status}
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{miner.region || 'Global'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">NFT Token ID</p>
            <p className="text-xl font-bold text-white">#{miner.token_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>Hashrate</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {miner.power_th} <span className="text-sm text-gray-400">TH/s</span>
            </p>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Settings className="w-4 h-4" />
              <span>Efficiency</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {miner.efficiency_w_th || 25} <span className="text-sm text-gray-400">W/TH</span>
            </p>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Activity className="w-4 h-4" />
              <span>Power Draw</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {((miner.power_th * (miner.efficiency_w_th || 25)) / 1000).toFixed(2)}
              <span className="text-sm text-gray-400"> kW</span>
            </p>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>Minted</span>
            </div>
            <p className="text-sm font-bold text-white">
              {new Date(miner.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Daily Earnings</span>
          </div>
          <p className="text-2xl font-bold text-green-400 mb-1">{dailyBTC} BTC</p>
          <p className="text-xs text-gray-500">≈ ${(parseFloat(dailyBTC) * 45000).toFixed(2)}</p>
        </div>

        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Monthly Projection</span>
          </div>
          <p className="text-2xl font-bold text-blue-400 mb-1">{monthlyBTC} BTC</p>
          <p className="text-xs text-gray-500">≈ ${(parseFloat(monthlyBTC) * 45000).toFixed(2)}</p>
        </div>

        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-purple-400 mb-1">{totalEarned} BTC</p>
          <p className="text-xs text-gray-500">≈ ${(parseFloat(totalEarned) * 45000).toFixed(2)}</p>
        </div>
      </div>

      {miner.maintenance_due && new Date(miner.maintenance_due) < new Date() && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-1">
                Maintenance Payment Required
              </h3>
              <p className="text-sm text-yellow-400/80 mb-3">
                Your miner requires maintenance payment to continue earning rewards.
                Pay now to avoid interruption.
              </p>
              <Link
                to="/app/miners"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-navy-900 rounded-lg font-bold transition-colors"
              >
                Pay Maintenance Fee
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MinerPerformanceWidget minerId={miner.id} />
        <MinerMaintenanceHistory payments={maintenancePayments} />
      </div>

      <MinerUpgradePanel
        currentPower={miner.power_th}
        currentEfficiency={miner.efficiency_w_th || 25}
        availableUpgrades={availableUpgrades}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
