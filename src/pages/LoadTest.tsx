import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoadTest() {
  const [status, setStatus] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const { i18n, ready } = useTranslation();

  useEffect(() => {
    const checks = [];

    checks.push('✅ Component mounted');
    checks.push(`✅ i18n ready: ${ready}`);
    checks.push(`✅ i18n language: ${i18n.language}`);
    checks.push(`✅ Auth loading: ${authLoading}`);
    checks.push(`✅ User: ${user ? 'Logged in' : 'Not logged in'}`);

    setStatus(checks);
  }, [ready, i18n.language, authLoading, user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 TYT Load Test</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-2">
          {status.map((s, i) => (
            <div key={i} className="font-mono text-sm">{s}</div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
        <div className="space-y-2 font-mono text-sm">
          <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
          <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
        </div>
      </div>

      <div className="mt-6">
        <a href="/" className="px-6 py-3 bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors inline-block">
          Go to Landing Page
        </a>
      </div>
    </div>
  );
}
