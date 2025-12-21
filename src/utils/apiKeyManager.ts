/**
 * API Key Management System
 *
 * Handles secure storage and rotation of API keys.
 * This is primarily for documentation - actual key storage
 * should be in Supabase Vault or environment variables.
 */

export interface APIKey {
  name: string;
  key: string;
  createdAt: Date;
  expiresAt?: Date;
  lastRotated?: Date;
  isActive: boolean;
}

export interface KeyRotationPolicy {
  rotationIntervalDays: number;
  warnBeforeDays: number;
  autoRotate: boolean;
}

/**
 * API Key Manager
 * DO NOT use this for storing actual keys client-side!
 * This is for managing key metadata only.
 */
export class APIKeyManager {
  private readonly ROTATION_POLICIES: Record<string, KeyRotationPolicy> = {
    supabase: {
      rotationIntervalDays: 90,
      warnBeforeDays: 14,
      autoRotate: false
    },
    alchemy: {
      rotationIntervalDays: 180,
      warnBeforeDays: 30,
      autoRotate: false
    },
    ramp: {
      rotationIntervalDays: 365,
      warnBeforeDays: 30,
      autoRotate: false
    },
    sumsub: {
      rotationIntervalDays: 90,
      warnBeforeDays: 14,
      autoRotate: false
    }
  };

  /**
   * Check if key needs rotation
   */
  needsRotation(keyName: string, lastRotated: Date): boolean {
    const policy = this.ROTATION_POLICIES[keyName];
    if (!policy) return false;

    const daysSinceRotation = Math.floor(
      (Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceRotation >= policy.rotationIntervalDays;
  }

  /**
   * Check if should warn about upcoming rotation
   */
  shouldWarn(keyName: string, lastRotated: Date): boolean {
    const policy = this.ROTATION_POLICIES[keyName];
    if (!policy) return false;

    const daysSinceRotation = Math.floor(
      (Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysUntilRotation = policy.rotationIntervalDays - daysSinceRotation;

    return daysUntilRotation <= policy.warnBeforeDays && daysUntilRotation > 0;
  }

  /**
   * Get rotation status for all keys
   */
  getRotationStatus(keys: Record<string, Date>): Record<string, {
    needsRotation: boolean;
    shouldWarn: boolean;
    daysUntilRotation: number;
  }> {
    const status: any = {};

    for (const [keyName, lastRotated] of Object.entries(keys)) {
      const policy = this.ROTATION_POLICIES[keyName];
      if (!policy) continue;

      const daysSinceRotation = Math.floor(
        (Date.now() - lastRotated.getTime()) / (1000 * 60 * 60 * 24)
      );

      const daysUntilRotation = policy.rotationIntervalDays - daysSinceRotation;

      status[keyName] = {
        needsRotation: this.needsRotation(keyName, lastRotated),
        shouldWarn: this.shouldWarn(keyName, lastRotated),
        daysUntilRotation
      };
    }

    return status;
  }
}

/**
 * Key Rotation Instructions
 *
 * IMPORTANT: Never rotate keys without a plan!
 */
export const KEY_ROTATION_GUIDE = {
  supabase: {
    steps: [
      '1. Go to Supabase Dashboard → Settings → API',
      '2. Generate new anon key',
      '3. Update .env with VITE_SUPABASE_ANON_KEY',
      '4. Deploy new version',
      '5. Wait 24 hours for all clients to update',
      '6. Revoke old key'
    ],
    docs: 'https://supabase.com/docs/guides/api#api-keys'
  },

  alchemy: {
    steps: [
      '1. Go to Alchemy Dashboard → Apps',
      '2. Create new API key',
      '3. Update .env with VITE_ALCHEMY_API_KEY',
      '4. Test RPC connection',
      '5. Deploy',
      '6. Delete old key after 7 days'
    ],
    docs: 'https://docs.alchemy.com/docs/alchemy-api-keys'
  },

  ramp: {
    steps: [
      '1. Contact Ramp Network support',
      '2. Request API key rotation',
      '3. Receive new key',
      '4. Update .env with VITE_RAMP_HOST_API_KEY',
      '5. Test payment flow',
      '6. Confirm old key deactivation'
    ],
    docs: 'https://docs.ramp.network/'
  },

  sumsub: {
    steps: [
      '1. Go to Sumsub Dashboard → Settings',
      '2. Generate new API token',
      '3. Update Supabase secrets with SUMSUB_SECRET_KEY',
      '4. Update .env with VITE_SUMSUB_APP_TOKEN',
      '5. Test KYC flow',
      '6. Revoke old token'
    ],
    docs: 'https://developers.sumsub.com/'
  }
};

/**
 * Emergency Key Rotation
 *
 * Use this if a key is compromised!
 */
export const EMERGENCY_ROTATION_STEPS = [
  '🚨 COMPROMISED KEY DETECTED',
  '',
  'IMMEDIATE ACTIONS:',
  '1. Revoke compromised key immediately',
  '2. Generate new key',
  '3. Update .env and deploy ASAP',
  '4. Check logs for unauthorized usage',
  '5. Notify affected users if data breach',
  '6. Document incident',
  '7. Review security procedures',
  '',
  'POST-INCIDENT:',
  '1. Conduct security audit',
  '2. Implement additional monitoring',
  '3. Update rotation policy if needed',
  '4. Train team on key security'
];

/**
 * Validate API key format (basic check)
 */
export function validateAPIKeyFormat(key: string, provider: string): boolean {
  const formats: Record<string, RegExp> = {
    supabase: /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
    alchemy: /^[A-Za-z0-9_-]{32,}$/,
    ramp: /^[a-z0-9_-]{32,}$/i
  };

  const format = formats[provider];
  return format ? format.test(key) : true;
}

/**
 * Mask API key for logging
 */
export function maskAPIKey(key: string): string {
  if (key.length <= 8) return '***';
  return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

/**
 * Check key strength
 */
export function checkKeyStrength(key: string): {
  isStrong: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (key.length < 32) {
    issues.push('Key too short (minimum 32 characters)');
  }

  if (!/[A-Z]/.test(key) && !/[a-z]/.test(key)) {
    issues.push('Key should contain letters');
  }

  if (!/[0-9]/.test(key)) {
    issues.push('Key should contain numbers');
  }

  return {
    isStrong: issues.length === 0,
    issues
  };
}

export const apiKeyManager = new APIKeyManager();
