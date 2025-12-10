import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserProfile,
  checkFeatureAccess,
  getAllFeatures,
  getUserAccessibleFeatures,
  getKYCStatus,
  type UserProfile,
  type AccessFeature,
  type FeatureAccessResult
} from '../utils/accessControl';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const data = await getUserProfile(user.id);
      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  return { profile, loading };
}

export function useFeatureAccess(featureCode: string) {
  const { user } = useAuth();
  const [accessResult, setAccessResult] = useState<FeatureAccessResult>({
    hasAccess: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setAccessResult({ hasAccess: false, reason: 'Not authenticated' });
        setLoading(false);
        return;
      }

      const result = await checkFeatureAccess(user.id, featureCode);
      setAccessResult(result);
      setLoading(false);
    }

    checkAccess();
  }, [user, featureCode]);

  return { ...accessResult, loading };
}

export function useAllFeatures() {
  const [features, setFeatures] = useState<AccessFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatures() {
      const data = await getAllFeatures();
      setFeatures(data);
      setLoading(false);
    }

    loadFeatures();
  }, []);

  return { features, loading };
}

export function useAccessibleFeatures() {
  const { user } = useAuth();
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccessibleFeatures() {
      if (!user) {
        setFeatures([]);
        setLoading(false);
        return;
      }

      const data = await getUserAccessibleFeatures(user.id);
      setFeatures(data);
      setLoading(false);
    }

    loadAccessibleFeatures();
  }, [user]);

  return { features, loading, hasAccess: (code: string) => features.includes(code) };
}

export function useKYCStatus() {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<{
    status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
    tier: number;
    documents: Array<{
      type: string;
      status: string;
      uploaded_at: string;
      rejection_reason?: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKYCStatus() {
      if (!user) {
        setKycStatus(null);
        setLoading(false);
        return;
      }

      const data = await getKYCStatus(user.id);
      setKycStatus(data);
      setLoading(false);
    }

    loadKYCStatus();
  }, [user]);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getKYCStatus(user.id);
    setKycStatus(data);
    setLoading(false);
  };

  return { kycStatus, loading, refresh };
}
