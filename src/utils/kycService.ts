/**
 * KYC Service - Integration with Sumsub
 *
 * This service handles KYC verification for users.
 * Before using in production, set up Sumsub account and add credentials to .env
 *
 * Setup:
 * 1. Sign up at https://sumsub.com/
 * 2. Get APP_TOKEN and SECRET_KEY
 * 3. Add to .env:
 *    VITE_SUMSUB_APP_TOKEN=your_token
 *    SUMSUB_SECRET_KEY=your_secret (in Supabase secrets)
 * 4. Deploy kyc-verification Edge Function
 */

import { supabase } from '@/lib/supabase';

export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected' | 'resubmission_required';

export interface KYCVerification {
  user_id: string;
  status: KYCStatus;
  provider: 'sumsub';
  provider_id: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  documents_verified: boolean;
  selfie_verified: boolean;
  address_verified: boolean;
  metadata: Record<string, any>;
}

/**
 * Start KYC verification process
 * Opens Sumsub iframe and returns access token
 */
export async function startKYCVerification(userId: string): Promise<string> {
  try {
    // Check if already verified
    const { data: existing } = await supabase
      .from('kyc_verifications')
      .select('status')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing?.status === 'approved') {
      throw new Error('KYC already approved');
    }

    // Call Edge Function to generate Sumsub access token
    const { data, error } = await supabase.functions.invoke('kyc-verification', {
      body: {
        action: 'start',
        userId
      }
    });

    if (error) {
      console.error('KYC start error:', error);
      throw new Error('Failed to start KYC verification');
    }

    // Create or update KYC record
    await supabase
      .from('kyc_verifications')
      .upsert({
        user_id: userId,
        status: 'pending',
        provider: 'sumsub',
        provider_id: data.applicantId,
        submitted_at: new Date().toISOString(),
        metadata: { session_started: true }
      });

    return data.accessToken;

  } catch (error) {
    console.error('Error starting KYC:', error);
    throw error;
  }
}

/**
 * Check KYC verification status
 */
export async function checkKYCStatus(userId: string): Promise<KYCVerification | null> {
  try {
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error checking KYC status:', error);
    return null;
  }
}

/**
 * Refresh KYC status from provider
 */
export async function refreshKYCStatus(userId: string): Promise<KYCStatus> {
  try {
    const { data, error } = await supabase.functions.invoke('kyc-verification', {
      body: {
        action: 'status',
        userId
      }
    });

    if (error) throw error;

    // Update local status
    await supabase
      .from('kyc_verifications')
      .update({
        status: data.status,
        documents_verified: data.documentsVerified || false,
        selfie_verified: data.selfieVerified || false,
        address_verified: data.addressVerified || false,
        approved_at: data.status === 'approved' ? new Date().toISOString() : null,
        rejected_at: data.status === 'rejected' ? new Date().toISOString() : null,
        rejection_reason: data.rejectionReason || null,
        metadata: { last_checked: new Date().toISOString(), ...data.metadata }
      })
      .eq('user_id', userId);

    return data.status;

  } catch (error) {
    console.error('Error refreshing KYC status:', error);
    throw error;
  }
}

/**
 * Get KYC requirements based on action
 */
export function getKYCRequirements(action: 'withdraw' | 'large_purchase' | 'marketplace'): {
  required: boolean;
  reason: string;
  threshold?: number;
} {
  const requirements = {
    withdraw: {
      required: true,
      reason: 'KYC verification is required for withdrawals',
      threshold: 100 // USD
    },
    large_purchase: {
      required: true,
      reason: 'KYC verification is required for purchases over $1000',
      threshold: 1000 // USD
    },
    marketplace: {
      required: false,
      reason: 'KYC is optional for marketplace trading',
      threshold: 5000 // USD
    }
  };

  return requirements[action];
}

/**
 * Check if user meets KYC requirements for action
 */
export async function checkKYCRequirements(
  userId: string,
  action: 'withdraw' | 'large_purchase' | 'marketplace',
  amount?: number
): Promise<{
  allowed: boolean;
  reason?: string;
  status: KYCStatus;
}> {
  try {
    const requirements = getKYCRequirements(action);
    const kycData = await checkKYCStatus(userId);

    // If not required, allow
    if (!requirements.required) {
      return {
        allowed: true,
        status: kycData?.status || 'not_started'
      };
    }

    // Check threshold
    if (requirements.threshold && amount && amount < requirements.threshold) {
      return {
        allowed: true,
        status: kycData?.status || 'not_started'
      };
    }

    // Check KYC status
    if (!kycData || kycData.status !== 'approved') {
      return {
        allowed: false,
        reason: requirements.reason,
        status: kycData?.status || 'not_started'
      };
    }

    return {
      allowed: true,
      status: 'approved'
    };

  } catch (error) {
    console.error('Error checking KYC requirements:', error);
    return {
      allowed: false,
      reason: 'Error checking KYC status',
      status: 'not_started'
    };
  }
}

/**
 * Mock KYC for development (DO NOT USE IN PRODUCTION!)
 */
export async function mockKYCApproval(userId: string): Promise<void> {
  if (import.meta.env.PROD) {
    throw new Error('Mock KYC not allowed in production');
  }

  await supabase
    .from('kyc_verifications')
    .upsert({
      user_id: userId,
      status: 'approved',
      provider: 'sumsub',
      provider_id: 'MOCK_' + userId,
      submitted_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
      documents_verified: true,
      selfie_verified: true,
      address_verified: true,
      metadata: { mock: true }
    });
}
