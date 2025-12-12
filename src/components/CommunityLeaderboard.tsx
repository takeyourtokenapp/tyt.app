import { Trophy, TrendingUp, Zap, Crown, Medal, Award, Star } from 'lucide-react';
import { useState } from 'react';

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  owlRank: string;
  totalHashrate: number;
  totalRewards: number;
  xp: number;
  badge?: string;
}

export default function CommunityLeaderboard() {
  const [activeTab, setActiveTab] = useState<'hashrate' | 'rewards' | 'xp'>('hashrate');

  const leaderboardData: LeaderboardUser[] = [
    {
      rank: 1,
      username: 'MiningKing_BTC',
      avatar: '👑',
      owlRank: 'Warrior',
      totalHashrate: 2500,
      totalRewards: 1.25,
      xp: 8500,
      badge: 'TOP_MINER'
    },
    {
      rank: 2,
      username: 'CryptoOliver',
      avatar: '🦉',
      owlRank: 'Warrior',
      totalHashrate: 2200,
      totalRewards: 1.15,
      xp: 7200,
      badge: 'COMMUNITY_HERO'
    },
    {
      rank: 3,
      username: 'HashMaster_2024',
      avatar: '⚡',
      owlRank: 'Peacekeeper',
      totalHashrate: 1800,
      totalRewards: 0.95,
      xp: 6800,
      badge: 'EARLY_ADOPTER'
    },
    {
      rank: 4,
      username: 'BlockchainSarah',
      avatar: '✨',
      owlRank: 'Diplomat',
      totalHashrate: 1500,
      totalRewards: 0.82,
      xp: 5200
    },
    {
      rank: 5,
      username: 'MiningMike',
      avatar: '⛏️',
      owlRank: 'Peacekeeper',
      totalHashrate: 1400,
      totalRewards: 0.78,
      xp: 4900
    },
    {
      rank: 6,
      username: 'TokenTina',
      avatar: '💎',
      owlRank: 'Warrior',
      totalHashrate: 1350,
      totalRewards: 0.71,
      xp: 7800
    },
    {
      rank: 7,
      username: 'BTCWhale_007',
      avatar: '🐋',
      owlRank: 'Diplomat',
      totalHashrate: 1200,
      totalRewards: 0.65,
      xp: 4200
    },
    {
      rank: 8,
      username: 'CryptoNinja',
      avatar: '🥷',
      owlRank: 'Academic',
      totalHashrate: 1100,
      totalRewards: 0.59,
      xp: 3800
    },
    {
      rank: 9,
      username: 'OwlTrader_X',
      avatar: '📊',
      owlRank: 'Peacekeeper',
      totalHashrate: 980,
      totalRewards: 0.52,
      xp: 5500
    },
    {
      rank: 10,
      username: 'MoonMiner',
      avatar: '🌙',
      owlRank: 'Academic',
      totalHashrate: 920,
      totalRewards: 0.48,
      xp: 3200
    }
  ];

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (activeTab === 'hashrate') return b.totalHashrate - a.totalHashrate;
    if (activeTab === 'rewards') return b.totalRewards - a.totalRewards;
    return b.xp - a.xp;
  });

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 border-yellow-400 bg-yellow-400/20';
    if (rank === 2) return 'text-gray-300 border-gray-300 bg-gray-300/20';
    if (rank === 3) return 'text-amber-600 border-amber-600 bg-amber-600/20';
    return 'text-gray-500 border-gray-600 bg-gray-600/10';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} />;
    if (rank === 2) return <Medal size={20} />;
    if (rank === 3) return <Award size={20} />;
    return <Star size={16} />;
  };

  const getBadge = (badge?: string) => {
    const badges = {
      TOP_MINER: { label: 'Top Miner', color: 'from-yellow-500 to-amber-500' },
      COMMUNITY_HERO: { label: 'Community Hero', color: 'from-blue-500 to-purple-500' },
      EARLY_ADOPTER: { label: 'Early Adopter', color: 'from-green-500 to-emerald-500' }
    };
    return badge ? badges[badge as keyof typeof badges] : null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-amber-700 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500">
            <Trophy size={28} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Community Leaderboard</h3>
            <p className="text-sm text-gray-400">Top performers this month</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('hashrate')}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'hashrate'
              ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Zap size={18} className="inline mr-2" />
          Hashrate
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'rewards'
              ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <TrendingUp size={18} className="inline mr-2" />
          Rewards
        </button>
        <button
          onClick={() => setActiveTab('xp')}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'xp'
              ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Star size={18} className="inline mr-2" />
          XP
        </button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedData.map((user) => {
          const badge = getBadge(user.badge);
          return (
            <div
              key={user.username}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                user.rank <= 3
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-amber-500/50 shadow-lg'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${getRankColor(user.rank)}`}>
                {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
              </div>

              <div className="text-4xl">{user.avatar}</div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{user.username}</span>
                  {badge && (
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${badge.color} text-white text-xs font-semibold rounded-full`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  🦉 {user.owlRank} Owl
                </div>
              </div>

              <div className="text-right">
                {activeTab === 'hashrate' && (
                  <>
                    <div className="text-2xl font-bold text-amber-400">{user.totalHashrate}</div>
                    <div className="text-xs text-gray-400">TH/s</div>
                  </>
                )}
                {activeTab === 'rewards' && (
                  <>
                    <div className="text-2xl font-bold text-green-400">{user.totalRewards.toFixed(4)}</div>
                    <div className="text-xs text-gray-400">BTC earned</div>
                  </>
                )}
                {activeTab === 'xp' && (
                  <>
                    <div className="text-2xl font-bold text-purple-400">{user.xp.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">XP points</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-300">
          Want to see your name here?
          <span className="font-bold text-amber-400 ml-2">Upgrade your miners and climb the ranks!</span>
        </p>
      </div>
    </div>
  );
}
