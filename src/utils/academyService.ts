/**
 * Academy Service
 *
 * Manages TYT Digital-Interactive-Technology-Blockchain Crypto Academia.
 * Handles tracks, lessons, quizzes, progress tracking, and certificate issuance.
 */

import { supabase } from '../lib/supabase';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface AcademyTrack {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  difficulty: LessonDifficulty;
  estimated_hours: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademyLesson {
  id: string;
  track_id: string;
  slug: string;
  title: string;
  description: string | null;
  content_mdx: string | null;
  sort_order: number;
  difficulty: LessonDifficulty;
  estimated_minutes: number;
  has_quiz: boolean;
  completion_xp: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  lesson_description: string | null;
  sort_order: number;
  difficulty: string;
  estimated_minutes: number;
  completion_xp: number;
  is_completed: boolean;
  quiz_score: number | null;
  completed_at: string | null;
}

export interface TrackProgress {
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  total_xp_earned: number;
  is_complete: boolean;
}

export interface TrackWithProgress extends AcademyTrack {
  track_id: string;
  track_slug: string;
  track_title: string;
  track_description: string | null;
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  total_xp_earned: number;
  is_complete: boolean;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  question_type: string;
  options: Array<{ id: string; text: string }>;
  correct_answer_id: string;
  explanation: string | null;
  sort_order: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, any>;
  created_at: string;
}

export interface AcademyCertificate {
  id: string;
  user_id: string;
  track_id: string;
  certificate_url: string | null;
  blockchain_tx: string | null;
  issued_at: string;
}

export interface AcademyStats {
  total_lessons_completed: number;
  total_xp: number;
  current_rank: string;
  certificates_earned: number;
  tracks_started: number;
  tracks_completed: number;
}

export interface LessonCompletionResult {
  success: boolean;
  completed: boolean;
  quiz_passed: boolean;
  xp_earned: number;
  already_completed: boolean;
  message?: string;
}

export class AcademyService {
  /**
   * Get all published tracks
   */
  async getTracks(): Promise<AcademyTrack[]> {
    const { data, error } = await supabase
      .from('academy_tracks')
      .select('*')
      .eq('is_published', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get single track by slug
   */
  async getTrackBySlug(slug: string): Promise<AcademyTrack | null> {
    const { data, error } = await supabase
      .from('academy_tracks')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get track by ID
   */
  async getTrackById(trackId: string): Promise<AcademyTrack | null> {
    const { data, error } = await supabase
      .from('academy_tracks')
      .select('*')
      .eq('id', trackId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get all lessons for a track
   */
  async getLessonsByTrack(trackId: string): Promise<AcademyLesson[]> {
    const { data, error } = await supabase
      .from('academy_lessons')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_published', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get lesson by slug
   */
  async getLessonBySlug(trackId: string, lessonSlug: string): Promise<AcademyLesson | null> {
    const { data, error } = await supabase
      .from('academy_lessons')
      .select('*')
      .eq('track_id', trackId)
      .eq('slug', lessonSlug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's progress for a track
   */
  async getTrackProgress(userId: string, trackId: string): Promise<TrackProgress> {
    const { data, error } = await supabase.rpc('get_track_progress', {
      p_user_id: userId,
      p_track_id: trackId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get user's lessons with progress for a track
   */
  async getUserLessonsByTrack(userId: string, trackId: string): Promise<LessonProgress[]> {
    const { data, error } = await supabase.rpc('get_user_lessons_by_track', {
      p_user_id: userId,
      p_track_id: trackId,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all tracks with user progress
   */
  async getTracksWithProgress(userId: string): Promise<TrackWithProgress[]> {
    const { data, error } = await supabase.rpc('get_tracks_with_progress', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get quiz questions for a lesson
   */
  async getQuizQuestions(lessonId: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
      .from('academy_quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's quiz attempts for a lesson
   */
  async getQuizAttempts(userId: string, lessonId: string): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from('academy_quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Complete a lesson with optional quiz score
   */
  async completeLesson(
    userId: string,
    lessonId: string,
    quizScore?: number,
    timeSpentSeconds?: number
  ): Promise<LessonCompletionResult> {
    const { data, error } = await supabase.rpc('complete_lesson', {
      p_user_id: userId,
      p_lesson_id: lessonId,
      p_quiz_score: quizScore || null,
      p_time_spent_seconds: timeSpentSeconds || 0,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Check if track is complete
   */
  async checkTrackCompletion(userId: string, trackId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('check_track_completion', {
      p_user_id: userId,
      p_track_id: trackId,
    });

    if (error) throw error;
    return data || false;
  }

  /**
   * Get user's certificates
   */
  async getUserCertificates(userId: string): Promise<AcademyCertificate[]> {
    const { data, error } = await supabase
      .from('academy_certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user's certificates with track info
   */
  async getUserCertificatesWithTracks(userId: string): Promise<Array<AcademyCertificate & { track: AcademyTrack }>> {
    const { data, error } = await supabase
      .from('academy_certificates')
      .select(`
        *,
        track:academy_tracks(*)
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((item: any) => ({
      ...item,
      track: item.track,
    }));
  }

  /**
   * Issue certificate for completed track
   */
  async issueCertificate(trackId: string): Promise<any> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/issue-certificate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ track_id: trackId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to issue certificate');
    }

    return await response.json();
  }

  /**
   * Get user's academy statistics
   */
  async getUserAcademyStats(userId: string): Promise<AcademyStats> {
    const { data, error } = await supabase.rpc('get_user_academy_stats', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Get current user's academy stats
   */
  async getMyAcademyStats(): Promise<AcademyStats> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    return this.getUserAcademyStats(session.session.user.id);
  }

  /**
   * Start lesson (mark as in progress)
   */
  async startLesson(lessonId: string): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('academy_progress')
      .upsert({
        user_id: session.session.user.id,
        lesson_id: lessonId,
        is_completed: false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
        ignoreDuplicates: false,
      });

    if (error) throw error;
  }

  /**
   * Get lesson progress
   */
  async getLessonProgress(userId: string, lessonId: string): Promise<any> {
    const { data, error } = await supabase
      .from('academy_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Subscribe to track progress updates
   */
  subscribeToTrackProgress(userId: string, trackId: string, callback: (progress: TrackProgress) => void) {
    const channel = supabase
      .channel(`track-progress-${userId}-${trackId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'academy_progress',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const progress = await this.getTrackProgress(userId, trackId);
          callback(progress);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to certificate updates
   */
  subscribeToCertificates(userId: string, callback: (certificate: AcademyCertificate) => void) {
    const channel = supabase
      .channel(`certificates-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'academy_certificates',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as AcademyCertificate);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const academyService = new AcademyService();
