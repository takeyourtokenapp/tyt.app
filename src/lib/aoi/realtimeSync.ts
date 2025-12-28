/**
 * aOi Realtime Synchronization Service
 *
 * Manages real-time updates of aOi user progress, achievements, and interactions
 * across multiple browser tabs and devices using Supabase Realtime.
 */

import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type { AoiUserProgress, AoiAchievement, AoiSyncState } from '../../types/aoi';

export type AoiSyncEventType = 'progress_updated' | 'achievement_earned' | 'level_up';

export interface AoiSyncEvent {
  type: AoiSyncEventType;
  data: AoiUserProgress | AoiAchievement;
  timestamp: string;
}

export type AoiSyncCallback = (event: AoiSyncEvent) => void;

class AoiRealtimeSync {
  private supabase: SupabaseClient | null = null;
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Set<AoiSyncCallback> = new Set();
  private userId: string | null = null;

  initialize(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
    this.setupChannels();
  }

  private setupChannels() {
    if (!this.supabase || !this.userId) {
      console.warn('aOi Realtime: Cannot setup channels without supabase client or userId');
      return;
    }

    this.setupProgressChannel();
    this.setupAchievementsChannel();
  }

  private setupProgressChannel() {
    if (!this.supabase || !this.userId) return;

    const progressChannel = this.supabase
      .channel(`aoi-progress-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'aoi_user_progress',
          filter: `user_id=eq.${this.userId}`,
        },
        (payload) => {
          const newProgress = payload.new as AoiUserProgress;
          const oldProgress = payload.old as AoiUserProgress;

          if (newProgress.level > oldProgress.level) {
            this.notifyCallbacks({
              type: 'level_up',
              data: newProgress,
              timestamp: new Date().toISOString(),
            });
          }

          this.notifyCallbacks({
            type: 'progress_updated',
            data: newProgress,
            timestamp: new Date().toISOString(),
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('aOi Realtime: Progress channel subscribed');
        }
      });

    this.channels.set('progress', progressChannel);
  }

  private setupAchievementsChannel() {
    if (!this.supabase || !this.userId) return;

    const achievementsChannel = this.supabase
      .channel(`aoi-achievements-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'aoi_achievements',
          filter: `user_id=eq.${this.userId}`,
        },
        (payload) => {
          const newAchievement = payload.new as AoiAchievement;

          this.notifyCallbacks({
            type: 'achievement_earned',
            data: newAchievement,
            timestamp: new Date().toISOString(),
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('aOi Realtime: Achievements channel subscribed');
        }
      });

    this.channels.set('achievements', achievementsChannel);
  }

  subscribe(callback: AoiSyncCallback): () => void {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }

  private notifyCallbacks(event: AoiSyncEvent) {
    this.callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('aOi Realtime: Error in callback:', error);
      }
    });
  }

  async broadcastProgressUpdate(progress: AoiUserProgress) {
    if (!this.supabase) return;

    const channel = this.channels.get('progress');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'progress_update',
        payload: progress,
      });
    }
  }

  async broadcastAchievement(achievement: AoiAchievement) {
    if (!this.supabase) return;

    const channel = this.channels.get('achievements');
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'achievement_earned',
        payload: achievement,
      });
    }
  }

  cleanup() {
    this.channels.forEach((channel) => {
      this.supabase?.removeChannel(channel);
    });

    this.channels.clear();
    this.callbacks.clear();
    this.userId = null;
  }

  getSyncState(): AoiSyncState | null {
    if (!this.userId) return null;

    const allChannelsConnected = Array.from(this.channels.values()).every(
      (channel) => channel.state === 'joined'
    );

    return {
      userId: this.userId,
      progress: {} as AoiUserProgress,
      achievements: [],
      lastSynced: new Date(),
      syncStatus: allChannelsConnected ? 'idle' : 'syncing',
    };
  }
}

export const aoiRealtimeSync = new AoiRealtimeSync();
