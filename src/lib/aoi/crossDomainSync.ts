/**
 * aOi Cross-Domain Synchronization
 *
 * Enables communication between takeyourtoken.app and tyt.foundation
 * using postMessage API for secure cross-domain data sharing.
 */

import type { AoiCrossDomainMessage, AoiUserProgress, AoiAchievement } from '../../types/aoi';

const ALLOWED_ORIGINS = [
  'https://tyt.foundation',
  'https://takeyourtoken.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

export type CrossDomainMessageHandler = (message: AoiCrossDomainMessage) => void;

class AoiCrossDomainSync {
  private handlers: Map<AoiCrossDomainMessage['type'], Set<CrossDomainMessageHandler>> = new Map();
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) {
      console.warn('aOi Cross-Domain: Already initialized');
      return;
    }

    window.addEventListener('message', this.handleMessage.bind(this));
    this.isInitialized = true;

    console.log('aOi Cross-Domain: Sync initialized');
  }

  private handleMessage(event: MessageEvent) {
    if (!ALLOWED_ORIGINS.includes(event.origin)) {
      console.warn('aOi Cross-Domain: Blocked message from unauthorized origin:', event.origin);
      return;
    }

    const message = event.data as AoiCrossDomainMessage;

    if (!this.isValidMessage(message)) {
      console.warn('aOi Cross-Domain: Invalid message format:', message);
      return;
    }

    console.log('aOi Cross-Domain: Received message:', message.type, 'from', event.origin);

    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('aOi Cross-Domain: Handler error:', error);
        }
      });
    }
  }

  private isValidMessage(message: any): message is AoiCrossDomainMessage {
    return (
      message &&
      typeof message === 'object' &&
      'type' in message &&
      'data' in message &&
      'source' in message &&
      typeof message.data === 'object' &&
      'timestamp' in message.data
    );
  }

  on(type: AoiCrossDomainMessage['type'], handler: CrossDomainMessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  sendToFoundation(message: Omit<AoiCrossDomainMessage, 'source'>) {
    const fullMessage: AoiCrossDomainMessage = {
      ...message,
      source: 'takeyourtoken.app',
    };

    const foundationOrigin = 'https://tyt.foundation';

    if (window.opener && window.opener !== window) {
      window.opener.postMessage(fullMessage, foundationOrigin);
    } else {
      console.log('aOi Cross-Domain: No opener window, message not sent');
    }
  }

  sendLevelUpdate(progress: AoiUserProgress) {
    this.sendToFoundation({
      type: 'AOI_LEVEL_UPDATE',
      data: {
        level: progress.level,
        xp: progress.experience_points,
        timestamp: new Date().toISOString(),
      },
    });
  }

  sendKnowledgeShared(content: string) {
    this.sendToFoundation({
      type: 'AOI_KNOWLEDGE_SHARED',
      data: {
        content,
        timestamp: new Date().toISOString(),
      },
    });
  }

  sendAchievementEarned(achievement: AoiAchievement) {
    this.sendToFoundation({
      type: 'AOI_ACHIEVEMENT_EARNED',
      data: {
        achievement,
        timestamp: new Date().toISOString(),
      },
    });
  }

  requestSync() {
    this.sendToFoundation({
      type: 'AOI_SYNC_REQUEST',
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  cleanup() {
    if (this.isInitialized) {
      window.removeEventListener('message', this.handleMessage.bind(this));
      this.handlers.clear();
      this.isInitialized = false;
      console.log('aOi Cross-Domain: Sync cleaned up');
    }
  }
}

export const aoiCrossDomainSync = new AoiCrossDomainSync();

export function setupAoiCrossDomainSync(
  onLevelUpdate?: (level: number, xp: number) => void,
  onKnowledgeShared?: (content: string) => void,
  onAchievementEarned?: (achievement: AoiAchievement) => void
) {
  aoiCrossDomainSync.initialize();

  const unsubscribers: Array<() => void> = [];

  if (onLevelUpdate) {
    unsubscribers.push(
      aoiCrossDomainSync.on('AOI_LEVEL_UPDATE', (message) => {
        if (message.data.level !== undefined && message.data.xp !== undefined) {
          onLevelUpdate(message.data.level, message.data.xp);
        }
      })
    );
  }

  if (onKnowledgeShared) {
    unsubscribers.push(
      aoiCrossDomainSync.on('AOI_KNOWLEDGE_SHARED', (message) => {
        if (message.data.content) {
          onKnowledgeShared(message.data.content);
        }
      })
    );
  }

  if (onAchievementEarned) {
    unsubscribers.push(
      aoiCrossDomainSync.on('AOI_ACHIEVEMENT_EARNED', (message) => {
        if (message.data.achievement) {
          onAchievementEarned(message.data.achievement);
        }
      })
    );
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}
