import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { Bell, BellOff, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceAlert {
  id: string;
  user_id: string;
  token_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
}

interface PriceAlertWidgetProps {
  currentPrice: number;
  tokenSymbol?: string;
}

export default function PriceAlertWidget({ currentPrice, tokenSymbol = 'TYT' }: PriceAlertWidgetProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('token_symbol', tokenSymbol)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const createAlert = async () => {
    if (!user) {
      showToast('Please log in to create alerts', 'error');
      return;
    }

    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('price_alerts').insert({
        user_id: user.id,
        token_symbol: tokenSymbol,
        target_price: parseFloat(targetPrice),
        condition,
        is_active: true,
      });

      if (error) throw error;

      showToast('Price alert created!', 'success');
      setTargetPrice('');
      setShowForm(false);
      await loadAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      showToast('Failed to create alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase.from('price_alerts').delete().eq('id', id);

      if (error) throw error;

      showToast('Alert deleted', 'success');
      await loadAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      showToast('Failed to delete alert', 'error');
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      await loadAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
      showToast('Failed to update alert', 'error');
    }
  };

  const activeAlerts = alerts.filter((a) => a.is_active && !a.triggered_at);
  const triggeredAlerts = alerts.filter((a) => a.triggered_at);

  return (
    <div className="bg-secondary rounded-xl border border-secondary p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-primary-text">Price Alerts</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
        >
          {showForm ? (
            <X className="w-4 h-4 text-amber-500" />
          ) : (
            <Plus className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-tertiary/50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm text-tertiary-text mb-2">Alert Condition</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCondition('above')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  condition === 'above'
                    ? 'bg-green-500 text-white'
                    : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Above
              </button>
              <button
                onClick={() => setCondition('below')}
                className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                  condition === 'below'
                    ? 'bg-red-500 text-white'
                    : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                }`}
              >
                <TrendingDown className="w-4 h-4 inline mr-1" />
                Below
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-tertiary-text mb-2">Target Price ($)</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="0.00000000"
              step="0.00000001"
              className="w-full px-4 py-2 bg-secondary border border-secondary rounded-lg text-primary-text focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
            <p className="text-xs text-tertiary-text mt-1">
              Current: ${currentPrice.toFixed(8)}
            </p>
          </div>

          <button
            onClick={createAlert}
            disabled={loading}
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      )}

      {activeAlerts.length === 0 && !showForm ? (
        <div className="text-center py-6">
          <Bell className="w-12 h-12 text-tertiary-text mx-auto mb-3 opacity-50" />
          <p className="text-sm text-tertiary-text">No active alerts</p>
          <p className="text-xs text-tertiary-text mt-1">Create an alert to get notified</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-tertiary/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    alert.condition === 'above'
                      ? 'bg-green-500/10'
                      : 'bg-red-500/10'
                  }`}
                >
                  {alert.condition === 'above' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-primary-text">
                    {alert.condition === 'above' ? 'Above' : 'Below'} $
                    {alert.target_price.toFixed(8)}
                  </div>
                  <div className="text-xs text-tertiary-text">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAlert(alert.id, alert.is_active)}
                  className="p-1.5 hover:bg-tertiary/50 rounded transition-colors"
                >
                  {alert.is_active ? (
                    <Bell className="w-4 h-4 text-amber-500" />
                  ) : (
                    <BellOff className="w-4 h-4 text-tertiary-text" />
                  )}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}

          {triggeredAlerts.length > 0 && (
            <>
              <div className="text-xs text-tertiary-text mt-4 mb-2 uppercase tracking-wider">
                Triggered Alerts
              </div>
              {triggeredAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-tertiary/20 rounded-lg opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-tertiary/30">
                      {alert.condition === 'above' ? (
                        <TrendingUp className="w-4 h-4 text-tertiary-text" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-tertiary-text" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-text">
                        ${alert.target_price.toFixed(8)}
                      </div>
                      <div className="text-xs text-tertiary-text">
                        Triggered {new Date(alert.triggered_at!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1.5 hover:bg-tertiary/30 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-tertiary-text" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
