import { supabase } from '../lib/supabase';

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking email:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Exception checking email:', err);
    return false;
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Exception checking username:', err);
    return false;
  }
}

export async function checkReferralCode(code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();

    if (error) {
      console.error('Error checking referral code:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Exception checking referral code:', err);
    return false;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateUsername(username: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  if (typeof error === 'string') return error;

  if (error.message) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password';
    }

    if (message.includes('email not confirmed')) {
      return 'Please verify your email address';
    }

    if (message.includes('user already registered')) {
      return 'This email is already registered';
    }

    if (message.includes('password should be at least')) {
      return 'Password must be at least 6 characters';
    }

    if (message.includes('network')) {
      return 'Network error. Please check your connection';
    }

    return error.message;
  }

  return 'An unexpected error occurred';
}

export async function resendConfirmationEmail(email: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to resend email';
    return { success: false, error: message };
  }
}

export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { strength: 'weak', score };
  } else if (score <= 4) {
    return { strength: 'medium', score };
  } else {
    return { strength: 'strong', score };
  }
}
