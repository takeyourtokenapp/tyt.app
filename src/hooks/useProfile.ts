import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  full_name: string | null;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kyc_submitted_at: string | null;
  two_fa_enabled: boolean;
  referral_code: string;
  referred_by: string | null;
  vip_level: number;
  total_hashrate: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return { data: null, error: message };
    }
  };

  const refreshProfile = () => {
    if (user) {
      fetchProfile();
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
}
