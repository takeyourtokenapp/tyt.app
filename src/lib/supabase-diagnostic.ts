import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('=== Supabase Connection Diagnostic ===');

  const config = {
    url: import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    keyPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20)
  };

  console.log('1. Configuration:', config);

  try {
    console.log('2. Testing database connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('Database test failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { success: false, error };
    }

    console.log('Database connection: OK');
  } catch (err) {
    console.error('Database test exception:', err);
    return { success: false, error: err };
  }

  try {
    console.log('3. Testing auth session...');
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth test failed:', error);
      return { success: false, error };
    }

    console.log('Auth session:', session.session ? 'Active' : 'No session');
  } catch (err) {
    console.error('Auth test exception:', err);
    return { success: false, error: err };
  }

  console.log('=== All tests passed ===');
  return { success: true };
}

export async function testSignUp(testEmail: string, testPassword: string) {
  console.log('=== Testing Sign Up ===');
  console.log('Email:', testEmail);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (error) {
      console.error('Sign up failed:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      return { success: false, error };
    }

    console.log('Sign up result:', {
      userId: data.user?.id,
      email: data.user?.email,
      hasSession: !!data.session
    });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (profileError) {
      console.error('Profile check failed:', profileError);
    } else {
      console.log('Profile created:', profile);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Sign up exception:', err);
    return { success: false, error: err };
  }
}
