import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, Bell, Smartphone, Key, AlertCircle, CheckCircle2, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notifications_email: true,
    notifications_push: true,
    two_factor_enabled: false
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          email: user.email || '',
          notifications_email: true,
          notifications_push: true,
          two_factor_enabled: false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username
        })
        .eq('id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </span>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account ID</label>
            <input
              type="text"
              value={user?.id || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg opacity-50 cursor-not-allowed font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            KYC Verification
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold mb-1">Verification Status</div>
              <div className="text-sm text-gray-400">
                Current level: {profile?.kyc_level || 0} / 3
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border font-semibold ${
              profile?.kyc_status === 'approved'
                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                : profile?.kyc_status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
            }`}>
              {profile?.kyc_status || 'not_started'}
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-amber-500/20 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/30 transition-all">
            {profile?.kyc_status === 'approved' ? 'Upgrade KYC Level' : 'Start Verification'}
          </button>

          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              KYC verification is required to withdraw funds and access certain features.
              Higher KYC levels unlock increased limits.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            Security
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <div className="font-semibold mb-1">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Add an extra layer of security</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.two_factor_enabled}
                onChange={(e) => setFormData({ ...formData, two_factor_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <button className="w-full px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all">
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <div className="font-semibold mb-1">Email Notifications</div>
              <div className="text-sm text-gray-400">Rewards, maintenance, and updates</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications_email}
                onChange={(e) => setFormData({ ...formData, notifications_email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <div className="font-semibold mb-1">Push Notifications</div>
              <div className="text-sm text-gray-400">Mobile app alerts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications_push}
                onChange={(e) => setFormData({ ...formData, notifications_push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            Connected Devices
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">Current Device</div>
                <div className="text-sm text-gray-400">Web Browser - Last active now</div>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/50">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
