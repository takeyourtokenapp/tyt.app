import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Heart, TrendingUp, Users, DollarSign, Target, Award, ArrowRight } from 'lucide-react';
import type { FoundationCampaign } from '../../types/database';
import { makeDonation } from '../../utils/payments';

export default function Foundation() {
  const { user } = useAuth();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<FoundationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<FoundationCampaign | null>(null);
  const [donateAmount, setDonateAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<'TYT' | 'USDT' | 'BTC' | 'ETH'>('TYT');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('foundation_campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!user || !selectedCampaign || !donateAmount) return;

    setProcessing(true);
    try {
      const prices: Record<string, number> = { TYT: 0.05, USDT: 1, BTC: 95000, ETH: 3500 };
      const amountInAsset = parseFloat(donateAmount) / prices[selectedAsset];

      const result = await makeDonation(
        selectedCampaign.id,
        user.id,
        amountInAsset,
        selectedAsset
      );

      if (result.success) {
        toast.showSuccess(`Thank you! Your donation of $${donateAmount} has been processed.`);
        setSelectedCampaign(null);
        setDonateAmount('');
        await loadCampaigns();
      } else {
        toast.showError(result.error || 'Failed to process donation');
      }
    } catch (error) {
      toast.showError('Failed to process donation');
    } finally {
      setProcessing(false);
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + parseFloat(c.raised_usd), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + parseFloat(c.goal_usd), 0);

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'research': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'family_support': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'equipment': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading foundation...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-400" />
          TYT Foundation
        </h1>
        <p className="text-gray-400">Supporting pediatric brain tumor research and families in need</p>
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-8 border border-red-500/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-300 mb-2">Total Raised</div>
            <div className="text-3xl font-bold text-red-400">
              ${totalRaised.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">Across all campaigns</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-2">Active Campaigns</div>
            <div className="text-3xl font-bold text-red-400">{campaigns.length}</div>
            <div className="text-xs text-gray-400 mt-1">Making a difference</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-2">Total Goal</div>
            <div className="text-3xl font-bold text-red-400">
              ${totalGoal.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {totalGoal > 0 ? ((totalRaised / totalGoal) * 100).toFixed(1) : 0}% achieved
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Research Grants</div>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">12</div>
          <div className="text-xs text-gray-500 mt-2">Funded projects</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Families Helped</div>
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">47</div>
          <div className="text-xs text-gray-500 mt-2">Direct support</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Equipment Donations</div>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">8</div>
          <div className="text-xs text-gray-500 mt-2">Medical devices</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
        {campaigns.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-12 border border-gray-700 text-center">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Campaigns</h3>
            <p className="text-gray-400">Check back soon for new fundraising initiatives</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => {
              const progress = parseFloat(campaign.goal_usd) > 0
                ? (parseFloat(campaign.raised_usd) / parseFloat(campaign.goal_usd)) * 100
                : 0;

              return (
                <div
                  key={campaign.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all"
                >
                  {campaign.featured_image_url && (
                    <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={campaign.featured_image_url}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold flex-1">{campaign.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCampaignTypeColor(campaign.campaign_type)}`}>
                      {campaign.campaign_type.replace('_', ' ')}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {campaign.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-semibold">
                        ${parseFloat(campaign.raised_usd).toLocaleString()} / ${parseFloat(campaign.goal_usd).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% funded</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Heart size={20} />
                      Donate
                    </button>
                    <button className="px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400" />
              Our Mission
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The TYT Foundation is dedicated to supporting families affected by pediatric brain tumors
              and funding cutting-edge research to find better treatments and cures.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Every donation helps fund critical research, provide financial assistance to families,
              and purchase life-saving medical equipment.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-400" />
              Transparency
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Research Funding</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Family Support</span>
                <span className="font-bold">35%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Equipment</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Operations</span>
                <span className="font-bold">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Donate to {selectedCampaign.title}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Donation Amount (USD)</label>
                <input
                  type="number"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonateAmount(amount.toString())}
                    className="px-4 py-2 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="TYT">TYT Token</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>

              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <div className="text-sm text-gray-300 leading-relaxed">
                  Your donation is tax-deductible and 100% goes to the cause.
                  You'll receive a receipt via email.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  disabled={processing || !donateAmount}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart size={20} />
                  {processing ? 'Processing...' : `Donate $${donateAmount || 0}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
