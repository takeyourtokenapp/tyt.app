/**
 * aOi AI Character - TypeScript Types
 *
 * Centralized type definitions for the aOi intelligent guide system.
 * Used across takeyourtoken.app and synchronized with tyt.foundation.
 */

export type AoiLevel = 1 | 2 | 3 | 4;

export type AoiLevelName = 'beginner' | 'explorer' | 'builder' | 'guardian';

export type AoiSize = 'sm' | 'md' | 'lg' | 'xl';

export type AoiInteractionType =
  | 'question'
  | 'page_visit'
  | 'xp_gained'
  | 'level_up'
  | 'achievement_earned'
  | 'lesson_started'
  | 'lesson_completed'
  | 'quiz_passed'
  | 'donation_made'
  | 'miner_purchased';

export type AoiAchievementType = 'learning' | 'contribution' | 'milestone';

export type AoiSource = 'foundation' | 'local';

export type AoiBridgeType = 'to-foundation' | 'to-app';

export interface AoiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface AoiConversation {
  id: string;
  user_id: string;
  messages: AoiMessage[];
  context: Record<string, any>;
  started_at: string;
  last_message_at: string;
  is_active: boolean;
}

export interface AoiUserProgress {
  id: string;
  user_id: string;
  level: AoiLevel;
  experience_points: number;
  current_track: string | null;
  created_at: string;
  updated_at: string;
}

export interface AoiAchievement {
  id: string;
  user_id: string;
  achievement_code: string;
  achievement_type: AoiAchievementType;
  metadata: Record<string, any>;
  earned_at: string;
  on_chain_hash?: string | null;
}

export interface AoiInteraction {
  id: string;
  user_id: string;
  session_id: string;
  interaction_type: AoiInteractionType;
  agent_called?: string;
  context: Record<string, any>;
  response_summary?: string;
  created_at: string;
}

export interface AoiLevelInfo {
  level: AoiLevel;
  name: AoiLevelName;
  displayName: string;
  xpRequired: number;
  description: string;
  image: string;
  features: string[];
}

export interface AoiChatRequest {
  question: string;
  context?: Record<string, any>;
}

export interface AoiChatResponse {
  response: string;
  context?: Record<string, any>;
  source: AoiSource;
  foundationUrl?: string;
  timestamp?: string;
}

export interface AoiFoundationStatus {
  online: boolean;
  lastChecked: Date;
  latency?: number;
}

export interface AoiCrossDomainMessage {
  type: 'AOI_LEVEL_UPDATE' | 'AOI_KNOWLEDGE_SHARED' | 'AOI_SYNC_REQUEST' | 'AOI_ACHIEVEMENT_EARNED';
  data: {
    level?: AoiLevel;
    xp?: number;
    content?: string;
    achievement?: AoiAchievement;
    timestamp: string;
  };
  source: 'takeyourtoken.app' | 'tyt.foundation';
}

export interface AoiSyncState {
  userId: string;
  progress: AoiUserProgress;
  achievements: AoiAchievement[];
  lastSynced: Date;
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface AoiXPGainEvent {
  points: number;
  source: string;
  userId: string;
  newTotal: number;
  levelBefore: AoiLevel;
  levelAfter: AoiLevel;
}

export interface AoiBridgeConfig {
  targetDomain: string;
  targetPath: string;
  preserveContext: boolean;
  label: string;
  description?: string;
}

export const AOI_LEVEL_THRESHOLDS: Record<AoiLevel, number> = {
  1: 0,
  2: 100,
  3: 500,
  4: 1500,
};

export const AOI_LEVEL_NAMES: Record<AoiLevel, string> = {
  1: 'Beginner Guide',
  2: 'Explorer Mentor',
  3: 'Builder Advisor',
  4: 'Guardian Master',
};

export function calculateAoiLevel(xp: number): AoiLevel {
  if (xp >= 1500) return 4;
  if (xp >= 500) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function getXpForNextLevel(currentXp: number): {
  current: number;
  next: number;
  progress: number;
  remaining: number;
} {
  const currentLevel = calculateAoiLevel(currentXp);

  if (currentLevel === 4) {
    return {
      current: currentXp,
      next: currentXp,
      progress: 100,
      remaining: 0,
    };
  }

  const nextLevel = (currentLevel + 1) as AoiLevel;
  const currentThreshold = AOI_LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = AOI_LEVEL_THRESHOLDS[nextLevel];

  const range = nextThreshold - currentThreshold;
  const progressInLevel = currentXp - currentThreshold;
  const progress = (progressInLevel / range) * 100;

  return {
    current: currentXp,
    next: nextThreshold,
    progress: Math.min(100, Math.max(0, progress)),
    remaining: nextThreshold - currentXp,
  };
}

export function isAoiLevelUp(oldXp: number, newXp: number): boolean {
  return calculateAoiLevel(oldXp) < calculateAoiLevel(newXp);
}
