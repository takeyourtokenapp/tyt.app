import { useEffect, useState } from 'react';
import { useAoi } from '../../contexts/AoiContext';
import { AOI_CONFIG, getAoiLevelInfo, getXpForNextLevel } from '../../config/aoiConfig';
import AoiAvatar from '../../components/AoiAvatar';
import AoiFoundationBadge from '../../components/AoiFoundationBadge';
import {
  Sparkles,
  Award,
  TrendingUp,
  Heart,
  BookOpen,
  Target,
  ExternalLink,
} from 'lucide-react';

export default function AoiProfile() {
  const { progress, achievements, loading, getFoundationLinks } = useAoi();
  const links = getFoundationLinks();

  const [xpProgress, setXpProgress] = useState({ current: 0, next: 100, progress: 0 });
  const [levelInfo, setLevelInfo] = useState(getAoiLevelInfo(1));

  useEffect(() => {
    if (progress) {
      const xp = getXpForNextLevel(progress.experience_points);
      setXpProgress(xp);
      setLevelInfo(getAoiLevelInfo(progress.level));
    }
  }, [progress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading aOi profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-lavender-500/10 rounded-2xl border border-blue-500/30 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <AoiAvatar
              level={progress?.level || 1}
              size="xl"
              showName
              showLevel
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {levelInfo.name}
              </h2>
              <p className="text-sm text-gray-400">{levelInfo.description}</p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Experience Points</span>
                <span className="text-sm font-semibold text-blue-400">
                  {xpProgress.current} / {xpProgress.next} XP
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-lavender-500 transition-all duration-500"
                  style={{ width: `${xpProgress.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {progress?.level === 4
                  ? 'Maximum level reached!'
                  : `${Math.round(xpProgress.next - xpProgress.current)} XP until next level`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {progress?.level || 1}
                </div>
                <div className="text-xs text-gray-400">Current Level</div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {progress?.experience_points || 0}
                </div>
                <div className="text-xs text-gray-400">Total XP</div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {achievements.length}
                </div>
                <div className="text-xs text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Achievements</h3>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No achievements yet</p>
              <p className="text-sm mt-1">
                Complete lessons and quizzes to earn your first achievement!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {achievement.achievement_code}
                    </div>
                    <div className="text-xs text-gray-400">
                      {achievement.achievement_type}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.earned_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">About aOi</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              aOi is your AI learning companion, designed to help you master
              Web3, cryptocurrency, and blockchain technology while supporting
              children with brain cancer.
            </p>

            <div className="bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-lg p-4 border border-pink-500/30">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-white mb-1">
                    Making a Difference
                  </div>
                  <p className="text-xs text-gray-400">
                    Every interaction with aOi contributes to the TYT Children's
                    Brain Cancer Research & Support Foundation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={links.aboutAoi}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    Learn more about aOi
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
              </a>

              <a
                href={links.home}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    Visit TYT Foundation
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-pink-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <AoiFoundationBadge variant="full" showStatus />

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Evolution Timeline
        </h3>
        <div className="space-y-4">
          {AOI_CONFIG.evolution.levels.map((level, index) => {
            const isUnlocked = (progress?.level || 1) >= level.level;
            const isCurrent = (progress?.level || 1) === level.level;

            return (
              <div
                key={level.level}
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-blue-500/20 border-2 border-blue-500/50'
                    : isUnlocked
                    ? 'bg-gray-800/50'
                    : 'bg-gray-900/30 opacity-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={level.image}
                    alt={level.name}
                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                      isUnlocked ? 'border-blue-500' : 'border-gray-700'
                    } ${!isUnlocked && 'grayscale'}`}
                  />
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold ${
                        isUnlocked ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {level.name}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{level.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {level.xpRequired} XP required
                  </p>
                </div>
                {isUnlocked && (
                  <Award className="w-5 h-5 text-amber-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
