import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useAdminCheck() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('[useAdminCheck] Checking admin status for:', user.email, 'user.id:', user.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin, email, username')
          .eq('id', user.id)
          .maybeSingle();

        console.log('[useAdminCheck] Profile result:', { profile, error });

        if (error) {
          console.error('[useAdminCheck] Error fetching profile:', error);
        }

        if (mounted) {
          const adminStatus = profile?.is_admin === true;
          console.log('[useAdminCheck] Setting isAdmin to:', adminStatus, 'for user:', profile?.email);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('[useAdminCheck] Exception:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { isAdmin, loading };
}
