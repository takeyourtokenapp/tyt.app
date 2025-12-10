import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, BookOpen, Award, TrendingUp, Lock, CheckCircle2, Play } from 'lucide-react';
import type { AcademyTrack, AcademyLesson } from '../../types/database';

interface TrackWithProgress extends AcademyTrack {
  lessons_count: number;
  completed_count: number;
}

export default function Academy() {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<TrackWithProgress[]>([]);
  const [userXP, setUserXP] = useState(0);
  const [owlRank, setOwlRank] = useState<'worker' | 'academic' | 'diplomat' | 'peacekeeper' | 'warrior'>('worker');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAcademyData();
    }
  }, [user]);

  const loadAcademyData = async () => {
    if (!user) return;

    try {
      const [profileRes, tracksRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('rank_score, owl_rank')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('academy_tracks')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true })
      ]);

      if (profileRes.data) {
        setUserXP(profileRes.data.rank_score);
        setOwlRank(profileRes.data.owl_rank);
      }

      if (tracksRes.data) {
        const tracksWithProgress: TrackWithProgress[] = await Promise.all(
          tracksRes.data.map(async (track) => {
            const { count: lessonsCount } = await supabase
              .from('academy_lessons')
              .select('*', { count: 'exact', head: true })
              .eq('track_id', track.id)
              .eq('is_published', true);

            const { count: completedCount } = await supabase
              .from('academy_user_progress')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('completed', true);

            return {
              ...track,
              lessons_count: lessonsCount || 0,
              completed_count: completedCount || 0
            };
          })
        );

        setTracks(tracksWithProgress);
      }
    } catch (error) {
      console.error('Error loading academy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOwlRankInfo = (rank: string) => {
    const ranks = {
      worker: { emoji: '🦉', name: 'Worker', xp: '0-99', color: 'text-gray-400' },
      academic: { emoji: '📚', name: 'Academic', xp: '100-299', color: 'text-blue-400' },
      diplomat: { emoji: '🤝', name: 'Diplomat', xp: '300-699', color: 'text-purple-400' },
      peacekeeper: { emoji: '🛡️', name: 'Peacekeeper', xp: '700-1,499', color: 'text-green-400' },
      warrior: { emoji: '⚔️', name: 'Warrior', xp: '1,500+', color: 'text-amber-400' }
    };
    return ranks[rank as keyof typeof ranks] || ranks.worker;
  };

  const currentRank = getOwlRankInfo(owlRank);
  const nextRankXP = owlRank === 'worker' ? 100 : owlRank === 'academic' ? 300 : owlRank === 'diplomat' ? 700 : owlRank === 'peacekeeper' ? 1500 : 9999;
  const xpProgress = owlRank === 'warrior' ? 100 : (userXP / nextRankXP) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading academy...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crypto Academia</h1>
        <p className="text-gray-400">Learn, earn XP, and climb the Owl ranks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{currentRank.emoji}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">Current Rank</div>
              <div className={`text-2xl font-bold ${currentRank.color}`}>
                {currentRank.name}
              </div>
              <div className="text-sm text-gray-500">{currentRank.xp} XP</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-400">{userXP}</div>
              <div className="text-xs text-gray-400">Total XP</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to next rank</span>
              <span className="font-semibold">{owlRank === 'warrior' ? 'Max Rank' : `${userXP} / ${nextRankXP} XP`}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Your Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Tracks Started</span>
              <span className="font-bold">{tracks.filter(t => t.completed_count > 0).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lessons Completed</span>
              <span className="font-bold">{tracks.reduce((sum, t) => sum + t.completed_count, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total XP Earned</span>
              <span className="font-bold text-amber-400">{userXP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Certificates</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-6">All Owl Ranks</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['worker', 'academic', 'diplomat', 'peacekeeper', 'warrior'].map((rank) => {
            const info = getOwlRankInfo(rank);
            const isCurrentOrPast = ['worker', 'academic', 'diplomat', 'peacekeeper', 'warrior'].indexOf(owlRank) >=
                                    ['worker', 'academic', 'diplomat', 'peacekeeper', 'warrior'].indexOf(rank);

            return (
              <div
                key={rank}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isCurrentOrPast
                    ? 'bg-gray-800/50 border-amber-500/50'
                    : 'bg-gray-900 border-gray-700 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{info.emoji}</div>
                <div className={`font-bold ${info.color}`}>{info.name}</div>
                <div className="text-xs text-gray-500 mt-1">{info.xp}</div>
                {isCurrentOrPast && owlRank === rank && (
                  <div className="mt-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mx-auto" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Learning Tracks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tracks.map((track) => {
            const progress = track.lessons_count > 0 ? (track.completed_count / track.lessons_count) * 100 : 0;
            const isLocked = track.difficulty_level > 1 && userXP < (track.difficulty_level - 1) * 100;

            return (
              <div
                key={track.id}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border ${
                  isLocked ? 'border-gray-700 opacity-60' : 'border-gray-700 hover:border-amber-500/50'
                } transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {track.title}
                      {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{track.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
                        Level {track.difficulty_level}
                      </div>
                      <div className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-semibold">
                        {track.estimated_hours}h estimated
                      </div>
                      <div className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-semibold">
                        {track.lessons_count} lessons
                      </div>
                    </div>
                  </div>
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-semibold">{track.completed_count} / {track.lessons_count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  disabled={isLocked}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLocked ? (
                    <>
                      <Lock size={20} />
                      Locked
                    </>
                  ) : progress > 0 ? (
                    <>
                      <Play size={20} />
                      Continue
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      Start Learning
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          How to Earn XP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1">Complete Lessons</div>
            <div className="text-gray-400">10-50 XP per lesson</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Pass Quizzes</div>
            <div className="text-gray-400">20-100 XP per quiz</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Finish Quests</div>
            <div className="text-gray-400">50-200 XP per quest</div>
          </div>
        </div>
      </div>
    </div>
  );
}
