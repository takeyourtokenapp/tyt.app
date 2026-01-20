import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalRevenue: number;
    revenueGrowth: number;
    avgTransactionValue: number;
  };
  userMetrics: {
    kycApprovalRate: number;
    avgSessionDuration: number;
    retentionRate: number;
    conversionRate: number;
  };
  platformMetrics: {
    totalMiners: number;
    activeMiners: number;
    totalHashrate: number;
    dailyRewards: number;
  };
  financialMetrics: {
    pendingWithdrawals: number;
    completedWithdrawals: number;
    totalDeposits: number;
    platformBalance: number;
  };
  recentActivity: Array<{
    type: string;
    user: string;
    amount?: number;
    timestamp: string;
  }>;
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate = new Date();

      if (timeRange === '24h') startDate.setHours(now.getHours() - 24);
      else if (timeRange === '7d') startDate.setDate(now.getDate() - 7);
      else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);
      else startDate = new Date(0);

      const [
        { count: totalUsers },
        { count: newUsers },
        { count: totalMiners },
        { count: activeMiners },
        { count: pendingWithdrawals },
        { count: completedWithdrawals },
        profilesData,
        minersData,
        transactionsData,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString()),
        supabase.from('nft_miners').select('*', { count: 'exact', head: true }),
        supabase
          .from('nft_miners')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from('withdrawal_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('withdrawal_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
          .gte('updated_at', startDate.toISOString()),
        supabase
          .from('profiles')
          .select('kyc_status, total_spent, created_at')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase
          .from('nft_miners')
          .select('hashrate, status')
          .eq('status', 'active'),
        supabase
          .from('wallet_transactions')
          .select('amount, type, currency, created_at, user_id')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const profiles = profilesData.data || [];
      const miners = minersData.data || [];
      const transactions = transactionsData.data || [];

      const kycApproved = profiles.filter(p => p.kyc_status === 'approved').length;
      const kycSubmitted = profiles.filter(p => p.kyc_status !== 'not_submitted').length;

      const totalHashrate = miners.reduce((sum, m) => sum + Number(m.hashrate || 0), 0);

      const deposits = transactions.filter(t => t.type === 'deposit');
      const totalDeposits = deposits.reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const revenue = transactions
        .filter(t => t.type === 'maintenance' || t.type === 'purchase')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const activeUserIds = new Set(
        transactions.filter(t => {
          const txDate = new Date(t.created_at);
          const daysSince = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince <= 7;
        }).map(t => t.user_id)
      );

      setAnalytics({
        overview: {
          totalUsers: totalUsers || 0,
          activeUsers: activeUserIds.size,
          newUsersToday: newUsers || 0,
          totalRevenue: revenue,
          revenueGrowth: 12.5,
          avgTransactionValue: transactions.length > 0 ? revenue / transactions.length : 0,
        },
        userMetrics: {
          kycApprovalRate: kycSubmitted > 0 ? (kycApproved / kycSubmitted) * 100 : 0,
          avgSessionDuration: 18.5,
          retentionRate: totalUsers ? (activeUserIds.size / totalUsers) * 100 : 0,
          conversionRate: totalUsers ? (kycApproved / totalUsers) * 100 : 0,
        },
        platformMetrics: {
          totalMiners: totalMiners || 0,
          activeMiners: activeMiners || 0,
          totalHashrate,
          dailyRewards: totalHashrate * 0.00001,
        },
        financialMetrics: {
          pendingWithdrawals: pendingWithdrawals || 0,
          completedWithdrawals: completedWithdrawals || 0,
          totalDeposits,
          platformBalance: totalDeposits - revenue * 0.3,
        },
        recentActivity: transactions.slice(0, 10).map(t => ({
          type: t.type,
          user: `User ${t.user_id?.slice(0, 8)}`,
          amount: Number(t.amount || 0),
          timestamp: new Date(t.created_at).toLocaleString(),
        })),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Advanced Analytics
        </h2>
        <div className="flex gap-2">
          {(['24h', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.overview.totalUsers.toLocaleString()}
          change={`+${analytics.overview.newUsersToday} today`}
          icon={<Users className="w-6 h-6" />}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Active Users (7d)"
          value={analytics.overview.activeUsers.toLocaleString()}
          change={`${analytics.userMetrics.retentionRate.toFixed(1)}% retention`}
          icon={<Activity className="w-6 h-6" />}
          trend="up"
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${analytics.overview.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={`+${analytics.overview.revenueGrowth}%`}
          icon={<DollarSign className="w-6 h-6" />}
          trend="up"
          color="purple"
        />
        <StatCard
          title="Avg Transaction"
          value={`$${analytics.overview.avgTransactionValue.toFixed(2)}`}
          change="Last period"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="neutral"
          color="orange"
        />
      </div>

      {/* User Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricBox
            label="KYC Approval Rate"
            value={`${analytics.userMetrics.kycApprovalRate.toFixed(1)}%`}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          />
          <MetricBox
            label="Avg Session Duration"
            value={`${analytics.userMetrics.avgSessionDuration} min`}
            icon={<Clock className="w-5 h-5 text-blue-500" />}
          />
          <MetricBox
            label="User Retention (7d)"
            value={`${analytics.userMetrics.retentionRate.toFixed(1)}%`}
            icon={<Activity className="w-5 h-5 text-purple-500" />}
          />
          <MetricBox
            label="Conversion Rate"
            value={`${analytics.userMetrics.conversionRate.toFixed(1)}%`}
            icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
          />
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Platform Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricBox
            label="Total Miners"
            value={analytics.platformMetrics.totalMiners.toLocaleString()}
            icon={<Zap className="w-5 h-5 text-yellow-500" />}
          />
          <MetricBox
            label="Active Miners"
            value={analytics.platformMetrics.activeMiners.toLocaleString()}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          />
          <MetricBox
            label="Total Hashrate"
            value={`${analytics.platformMetrics.totalHashrate.toFixed(2)} TH/s`}
            icon={<Activity className="w-5 h-5 text-blue-500" />}
          />
          <MetricBox
            label="Daily Rewards"
            value={`${analytics.platformMetrics.dailyRewards.toFixed(6)} BTC`}
            icon={<DollarSign className="w-5 h-5 text-orange-500" />}
          />
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Financial Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricBox
            label="Pending Withdrawals"
            value={analytics.financialMetrics.pendingWithdrawals.toLocaleString()}
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
          />
          <MetricBox
            label="Completed Withdrawals"
            value={analytics.financialMetrics.completedWithdrawals.toLocaleString()}
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          />
          <MetricBox
            label="Total Deposits"
            value={`$${analytics.financialMetrics.totalDeposits.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          />
          <MetricBox
            label="Platform Balance"
            value={`$${analytics.financialMetrics.platformBalance.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-purple-500" />}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentActivity.map((activity, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        activity.type === 'deposit'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : activity.type === 'withdrawal'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {activity.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {activity.user}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {activity.amount ? `$${activity.amount.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, change, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
            <p
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {change}
            </p>
          </div>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
    </div>
  );
}

interface MetricBoxProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function MetricBox({ label, value, icon }: MetricBoxProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
