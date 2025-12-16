import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const authService = {
  async signUp({ email, password, username }: SignUpData): Promise<AuthResponse> {
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
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      return { user: null, error: message };
    }
  },

  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      return { user: null, error: message };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      return { error: message };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Failed to get current user:', error);
        return null;
      }
      return user;
    } catch (err) {
      console.error('Exception getting current user:', err);
      return null;
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to get session:', error);
        return null;
      }
      return session;
    } catch (err) {
      console.error('Exception getting session:', err);
      return null;
    }
  },

  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Failed to refresh session:', error);
        return null;
      }
      return session;
    } catch (err) {
      console.error('Exception refreshing session:', err);
      return null;
    }
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      return { error: message };
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      return { error: message };
    }
  },

  async updateEmail(newEmail: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update email';
      return { error: message };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export async function requireAuth(): Promise<User> {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await authService.getSession();
  if (!session?.access_token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export function isAuthenticated(): boolean {
  const session = supabase.auth.getSession();
  return !!session;
}
