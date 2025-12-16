import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Failed to get session:', error);
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in:', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        throw new Error(error.message || 'Failed to sign in');
      }

      console.log('Sign in successful:', { userId: data.user?.id });
    } catch (err) {
      console.error('Sign in exception:', err);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    console.log('Attempting sign up:', { email, username });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Sign up error:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        throw new Error(error.message || 'Failed to create account');
      }

      console.log('Sign up successful:', {
        userId: data.user?.id,
        needsConfirmation: !data.session,
      });
    } catch (err) {
      console.error('Sign up exception:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('Cannot connect to Supabase. Please refresh the page and try again.');
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('Sign out successful');
    } catch (err) {
      console.error('Sign out exception:', err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw new Error(error.message || 'Failed to send reset email');
      }

      console.log('Password reset email sent to:', email);
    } catch (err) {
      console.error('Password reset exception:', err);
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        throw new Error(error.message || 'Failed to update password');
      }

      console.log('Password updated successfully');
    } catch (err) {
      console.error('Password update exception:', err);
      throw err;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
