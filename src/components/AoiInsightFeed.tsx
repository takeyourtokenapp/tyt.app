import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Info, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AoiInsight {
  id: string;
  type: 'info' | 'tip' | 'alert' | 'achievement';
  scope: 'rewards' | 'miners' | 'wallet' | 'ecosystem';
  title: string;
  message: string;
  created_at: string;
}

export function AoiInsightFeed() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AoiInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadInsights();
    }
  }, [user?.id]);

  async function loadInsights() {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('aoi_interactions')
        .select('*')
        .eq('user_id', user.id)
        .in('interaction_type', ['xp_gained', 'level_up', 'achievement_earned'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const generatedInsights: AoiInsight[] = data?.map((interaction) => ({
        id: interaction.id,
        type: interaction.interaction_type === 'achievement_earned' ? 'achievement' : 'info',
        scope: 'ecosystem',
        title: interaction.interaction_type === 'achievement_earned'
          ? 'Achievement Unlocked!'
          : interaction.interaction_type === 'level_up'
          ? 'Level Up!'
          : 'XP Earned',
        message: interaction.response_summary || 'Keep up the great work!',
        created_at: interaction.created_at
      })) || [];

      const staticInsights: AoiInsight[] = [
        {
          id: 'static-1',
          type: 'tip',
          scope: 'rewards',
          title: 'Maximize Your Rewards',
          message: 'Pay maintenance fees with TYT to unlock a 20% discount and contribute to token burns.',
          created_at: new Date().toISOString()
        },
        {
          id: 'static-2',
          type: 'info',
          scope: 'miners',
          title: 'Mining Efficiency',
          message: 'Your miners are operating at optimal efficiency. Network difficulty is stable.',
          created_at: new Date().toISOString()
        },
        {
          id: 'static-3',
          type: 'alert',
          scope: 'wallet',
          title: 'Foundation Contribution',
          message: '30% of all platform fees automatically support the Children\'s Brain Cancer Research Foundation.',
          created_at: new Date().toISOString()
        }
      ];

      setInsights([...generatedInsights, ...staticInsights].slice(0, 5));
    } catch (error) {
      console.error('Failed to load insights:', error);

      setInsights([
        {
          id: 'fallback-1',
          type: 'info',
          scope: 'ecosystem',
          title: 'Welcome to TYT',
          message: 'I\'m aOi, your AI guide. Ask me anything about mining, rewards, or the platform!',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case 'achievement':
        return <Zap className="w-4 h-4" />;
      case 'tip':
        return <TrendingUp className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  }

  function getColorClass(type: string) {
    switch (type) {
      case 'achievement':
        return 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400';
      case 'tip':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400';
      case 'alert':
        return 'from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-400';
      default:
        return 'from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-400';
    }
  }

  if (loading) {
    return (
      <div className="bg-secondary rounded-xl border border-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400 animate-pulse" />
          </div>
          <h3 className="font-semibold text-primary-text">aOi Insights</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-xl border border-secondary p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-primary-text">aOi Insights</h3>
          <p className="text-xs text-tertiary-text">Your AI-powered ecosystem overview</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-tertiary-text">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No insights yet</p>
            <p className="text-sm">Start exploring to see personalized tips!</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className={`
                bg-gradient-to-br rounded-lg border p-3
                transition-all hover:scale-[1.02]
                ${getColorClass(insight.type)}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-primary-text mb-1">
                    {insight.title}
                  </div>
                  <div className="text-xs text-secondary-text">
                    {insight.message}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-tertiary">
        <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Ask aOi a Question
        </button>
      </div>
    </div>
  );
}
