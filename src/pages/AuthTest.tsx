import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthTest() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [details, setDetails] = useState<any>(null);

  const testConnection = async () => {
    setStatus('Testing connection...');
    setDetails(null);

    try {
      // Test 1: Check environment variables
      const envCheck = {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        keyPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)
      };

      console.log('Environment check:', envCheck);

      // Test 2: Try to get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', { sessionData, sessionError });

      // Test 3: Try a simple auth operation
      const testEmail = 'dolbpinisrail@gmail.com';
      const testPassword = 'test123456';

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
        setDetails({
          error: {
            message: error.message,
            status: error.status,
            name: error.name
          },
          env: envCheck
        });
      } else {
        setStatus('Success! Signed in');
        setDetails({
          user: {
            id: data.user?.id,
            email: data.user?.email
          },
          session: !!data.session
        });
      }
    } catch (err: any) {
      setStatus(`Exception: ${err.message}`);
      setDetails({
        error: err.toString(),
        type: err.constructor.name,
        isFetchError: err instanceof TypeError && err.message.includes('fetch')
      });
      console.error('Test error:', err);
    }
  };

  const testDirectFetch = async () => {
    setStatus('Testing direct fetch...');

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`;
      const response = await fetch(url);
      const data = await response.text();

      setStatus('Direct fetch succeeded');
      setDetails({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (err: any) {
      setStatus('Direct fetch failed');
      setDetails({
        error: err.message,
        type: err.constructor.name
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Auth Test</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>URL: {import.meta.env.VITE_SUPABASE_URL}</div>
            <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing'}</div>
            <div>Key length: {import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0}</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="flex gap-4">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Test Auth Login
            </button>
            <button
              onClick={testDirectFetch}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Test Direct Fetch
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="text-lg">{status}</div>
        </div>

        {details && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
