import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AoiProgress {
  id: string;
  user_id: string;
  level: 1 | 2 | 3 | 4;
  experience_points: number;
  current_track: string | null;
  created_at: string;
  updated_at: string;
}

interface AoiAchievement {
  id: string;
  achievement_code: string;
  achievement_type: 'learning' | 'contribution' | 'milestone';
  metadata: Record<string, any>;
  earned_at: string;
}

interface AoiContextType {
  progress: AoiProgress | null;
  achievements: AoiAchievement[];
  loading: boolean;
  addExperience: (points: number, source?: string) => Promise<void>;
  askAoi: (question: string, context?: Record<string, any>) => Promise<string>;
  logInteraction: (type: string, context?: Record<string, any>) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AoiContext = createContext<AoiContextType | undefined>(undefined);

export function AoiProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AoiProgress | null>(null);
  const [achievements, setAchievements] = useState<AoiAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
      loadAchievements();
    } else {
      setProgress(null);
      setAchievements([]);
      setLoading(false);
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('aoi_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProgress(data);
      } else {
        const { data: newProgress, error: insertError } = await supabase
          .from('aoi_user_progress')
          .insert({ user_id: user.id, level: 1, experience_points: 0 })
          .select()
          .single();

        if (insertError) throw insertError;
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error loading aOi progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('aoi_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const addExperience = async (points: number, source?: string) => {
    if (!user || !progress) return;

    try {
      const newXP = progress.experience_points + points;

      const { data, error } = await supabase
        .from('aoi_user_progress')
        .update({
          experience_points: newXP,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProgress(data);

      await logInteraction('xp_gained', {
        points,
        source,
        new_total: newXP,
        level: data.level
      });

      if (data.level > progress.level) {
        await logInteraction('level_up', {
          old_level: progress.level,
          new_level: data.level,
          xp: newXP
        });
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const askAoi = async (
    question: string,
    context?: Record<string, any>
  ): Promise<string> => {
    if (!user) {
      return "Please log in to chat with Aoi.";
    }

    try {
      const { data, error } = await supabase.functions.invoke('aoi-chat', {
        body: {
          question,
          context: {
            ...context,
            user_level: progress?.level || 1,
            user_xp: progress?.experience_points || 0,
          },
        },
      });

      if (error) throw error;

      await logInteraction('question', {
        question,
        context,
        response_preview: data.response?.substring(0, 100),
      });

      return data.response || "I'm here to help! Could you rephrase that?";
    } catch (error) {
      console.error('Error asking Aoi:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const logInteraction = async (
    type: string,
    context?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.from('aoi_interactions').insert({
        user_id: user.id,
        session_id: `session_${Date.now()}`,
        interaction_type: type,
        context: context || {},
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const refreshProgress = async () => {
    await loadProgress();
    await loadAchievements();
  };

  return (
    <AoiContext.Provider
      value={{
        progress,
        achievements,
        loading,
        addExperience,
        askAoi,
        logInteraction,
        refreshProgress,
      }}
    >
      {children}
    </AoiContext.Provider>
  );
}

export function useAoi() {
  const context = useContext(AoiContext);
  if (context === undefined) {
    throw new Error('useAoi must be used within an AoiProvider');
  }
  return context;
}
