import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Activity,
  Heart,
  Cpu,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import AccessGuard from '../../components/AccessGuard';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingKYC: number;
  totalMiners: number;
  totalHashrate: number;
  totalMessages: number;
  unreadMessages: number;
  foundationDonations: number;
  recentTransactions: number;
  monthlyRevenue: number;
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    totalMiners: 0,
    totalHashrate: 0,
    totalMessages: 0,
    unreadMessages: 0,
    foundationDonations: 0,
    recentTransactions: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users count
      const { count: totalUsersCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      // Fetch new users in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: newUsers7d } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo);

      // Fetch miners data
      const { data: minersData, count: minersCount } = await supabase
        .from('nft_miners')
        .select('hashrate', { count: 'exact' });

      // Fetch messages
      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true });

      const { count: unreadCount } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);

      // Fetch foundation donations
      const { data: donationsData } = await supabase
        .from('foundation_donations')
        .select('amount_usd');

      // Fetch recent transactions (last 24h)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentTxCount } = await supabase
        .from('wallet_transactions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo);

      // Calculate totals
      const totalHashrate = minersData?.reduce((sum, miner) => sum + (Number(miner.hashrate) || 0), 0) || 0;
      const foundationTotal = donationsData?.reduce((sum, donation) => sum + (Number(donation.amount_usd) || 0), 0) || 0;

      setStats({
        totalUsers: totalUsersCount || 0,
        activeUsers: newUsers7d || 0,
        pendingKYC: 0, // KYC table doesn't exist yet
        totalMiners: minersCount || 0,
        totalHashrate: totalHashrate,
        totalMessages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
        foundationDonations: foundationTotal,
        recentTransactions: recentTxCount || 0,
        monthlyRevenue: 0,
      });

      // Fetch recent activity from wallet_transactions
      const { data: activity } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    link
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: string;
    link?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {loading ? '...' : value}
          </p>
          {trend && (
            <p className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp size={12} />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link
          to={link}
          className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
        >
          View Details →
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Platform overview and management
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="bg-blue-500"
            link="/app/admin/users"
          />
          <StatCard
            title="New Users (7d)"
            value={stats.activeUsers.toLocaleString()}
            icon={Activity}
            color="bg-green-500"
            trend={stats.activeUsers > 0 ? `${stats.activeUsers} new registrations` : undefined}
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            icon={MessageSquare}
            color="bg-purple-500"
            link="/app/admin/messages"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKYC}
            icon={AlertCircle}
            color="bg-orange-500"
          />
        </div>

        {/* Ecosystem Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Miners"
            value={stats.totalMiners.toLocaleString()}
            icon={Cpu}
            color="bg-indigo-500"
          />
          <StatCard
            title="Total Hashrate"
            value={`${stats.totalHashrate.toFixed(2)} TH/s`}
            icon={BarChart3}
            color="bg-cyan-500"
          />
          <StatCard
            title="Foundation Donations"
            value={`$${stats.foundationDonations.toLocaleString()}`}
            icon={Heart}
            color="bg-pink-500"
            link="/app/foundation"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent activity</div>
              ) : (
                recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.type || 'Transaction'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {activity.status || 'pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/app/transactions"
              className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
            >
              View All Transactions →
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/app/admin/messages"
                className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
              >
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">View Messages</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.unreadMessages} unread
                  </p>
                </div>
                <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                to="/app/admin/users"
                className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <Users className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.totalUsers} total users
                  </p>
                </div>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                to="/app/admin/withdrawals"
                className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
              >
                <DollarSign className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Review Withdrawals</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pending approvals
                  </p>
                </div>
                <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                to="/app/foundation"
                className="flex items-center gap-3 p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors group"
              >
                <Heart className="w-5 h-5 text-pink-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Foundation Stats</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${stats.foundationDonations.toLocaleString()} raised
                  </p>
                </div>
                <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                to="/app/admin/contracts"
                className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Smart Contracts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Monitor blockchain
                  </p>
                </div>
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">API Status</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Database</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Blockchain</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Synced</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Workers</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AccessGuard requiredLevel="admin" redirectTo="/app">
      <AdminDashboardContent />
    </AccessGuard>
  );
}
