import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Award,
  ArrowRight,
  X,
  Info,
  Calendar,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import type { FoundationCampaign } from '../../types/database';
import { makeDonation } from '../../utils/payments';

type ModalType = 'donate' | 'detail' | 'impact' | 'donors' | null;
type CampaignFilter = 'all' | 'research' | 'family_support' | 'equipment' | 'other';

export default function Foundation() {
  const { user } = useAuth();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<FoundationCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<FoundationCampaign | null>(null);

  const [donateAmount, setDonateAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<'TYT' | 'USDT' | 'BTC' | 'ETH'>('TYT');
  const [processing, setProcessing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CampaignFilter>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
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
        setActiveModal(null);
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

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterType !== 'all' && campaign.campaign_type !== filterType) return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(search) ||
        campaign.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const totalRaised = campaigns.reduce((sum, c) => sum + parseFloat(c.raised_usd), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + parseFloat(c.goal_usd), 0);
  const donorCount = 156;

  const getCampaignTypeInfo = (type: string) => {
    const types = {
      research: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', label: 'Research' },
      family_support: { color: 'bg-green-500/20 text-green-400 border-green-500/50', label: 'Family Support' },
      equipment: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/50', label: 'Equipment' },
      other: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/50', label: 'Other' }
    };
    return types[type as keyof typeof types] || types.other;
  };

  const impactStories = [
    {
      title: "Sarah's Journey",
      description: "Thanks to your donations, 8-year-old Sarah received the treatment she needed and is now in remission.",
      image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?w=400"
    },
    {
      title: "Research Breakthrough",
      description: "Funded research led to a new treatment protocol showing 40% better outcomes for patients.",
      image: "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?w=400"
    },
    {
      title: "Family Support",
      description: "15 families received housing assistance during their child's extended treatment period.",
      image: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?w=400"
    }
  ];

  const topDonors = [
    { name: 'Anonymous', amount: 50000, rank: 1 },
    { name: 'CryptoPhilanthropist', amount: 25000, rank: 2 },
    { name: 'BlockchainHeart', amount: 15000, rank: 3 },
    { name: 'TokenGiver', amount: 10000, rank: 4 },
    { name: 'MiningForGood', amount: 8500, rank: 5 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400">Loading foundation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            TYT Foundation
          </h1>
          <p className="text-gray-400">Supporting pediatric brain tumor research and families in need</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('impact')}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold hover:bg-green-500/30 transition-all flex items-center gap-2"
          >
            <Award size={18} />
            Impact Stories
          </button>
          <button
            onClick={() => setActiveModal('donors')}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-all flex items-center gap-2"
          >
            <Users size={18} />
            Top Donors
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-8 border border-red-500/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Total Raised
            </div>
            <div className="text-4xl font-bold text-red-400 mb-1">
              ${totalRaised.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Across all campaigns</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <Heart size={16} />
              Active Campaigns
            </div>
            <div className="text-4xl font-bold text-red-400 mb-1">{campaigns.length}</div>
            <div className="text-xs text-gray-400">Making a difference</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <Users size={16} />
              Total Donors
            </div>
            <div className="text-4xl font-bold text-red-400 mb-1">{donorCount}</div>
            <div className="text-xs text-gray-400">Generous supporters</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <Target size={16} />
              Goal Progress
            </div>
            <div className="text-4xl font-bold text-red-400 mb-1">
              {totalGoal > 0 ? ((totalRaised / totalGoal) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-gray-400">Of ${totalGoal.toLocaleString()} goal</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Research Grants</div>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">12</div>
          <div className="text-xs text-gray-500">Funded projects</div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">Latest: Immunotherapy Research</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Families Helped</div>
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mb-1">47</div>
          <div className="text-xs text-gray-500">Direct support provided</div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">Housing, meals, travel assistance</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Equipment Donations</div>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
          <div className="text-xs text-gray-500">Medical devices donated</div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">MRI, surgical equipment</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as CampaignFilter)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="all">All Campaign Types</option>
              <option value="research">Research</option>
              <option value="family_support">Family Support</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {(searchQuery || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="self-start px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-12 border border-gray-700 text-center">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Campaigns Found</h3>
          <p className="text-gray-400">
            {searchQuery || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Check back soon for new fundraising initiatives'}
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => {
              const progress = parseFloat(campaign.goal_usd) > 0
                ? (parseFloat(campaign.raised_usd) / parseFloat(campaign.goal_usd)) * 100
                : 0;
              const typeInfo = getCampaignTypeInfo(campaign.campaign_type);

              return (
                <div
                  key={campaign.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all overflow-hidden"
                >
                  {campaign.featured_image_url && (
                    <div className="w-full h-48 bg-gray-800 overflow-hidden">
                      <img
                        src={campaign.featured_image_url}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold flex-1 group-hover:text-red-400 transition-colors">
                        {campaign.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeInfo.color}`}>
                        {typeInfo.label}
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
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">{progress.toFixed(1)}% funded</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Users size={12} />
                          {Math.floor(Math.random() * 50) + 10} donors
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setActiveModal('detail');
                        }}
                        className="flex-1 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setActiveModal('donate');
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Heart size={20} />
                        Donate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              and purchase life-saving medical equipment. Together, we can make a difference.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-400" />
              Fund Allocation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Research Funding</span>
                </div>
                <span className="font-bold text-blue-400">45%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Family Support</span>
                </div>
                <span className="font-bold text-green-400">35%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Equipment</span>
                </div>
                <span className="font-bold text-purple-400">15%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-300">Operations</span>
                </div>
                <span className="font-bold text-gray-400">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'donate' && selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                Make a Donation
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Donating to:</div>
              <div className="font-semibold">{selectedCampaign.title}</div>
            </div>

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

              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <div className="text-sm text-gray-300 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-green-400 inline mr-2" />
                  Your donation is tax-deductible and 100% goes to the cause.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveModal(null)}
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

      {activeModal === 'detail' && selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{selectedCampaign.title}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {selectedCampaign.featured_image_url && (
              <div className="w-full h-64 bg-gray-800 rounded-lg mb-6 overflow-hidden">
                <img
                  src={selectedCampaign.featured_image_url}
                  alt={selectedCampaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCampaignTypeInfo(selectedCampaign.campaign_type).color}`}>
                  {getCampaignTypeInfo(selectedCampaign.campaign_type).label}
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  Started {new Date(selectedCampaign.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                {selectedCampaign.description}
              </p>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Campaign Progress</span>
                  <span className="font-semibold">
                    ${parseFloat(selectedCampaign.raised_usd).toLocaleString()} / ${parseFloat(selectedCampaign.goal_usd).toLocaleString()}
                  </span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                    style={{
                      width: `${Math.min((parseFloat(selectedCampaign.raised_usd) / parseFloat(selectedCampaign.goal_usd)) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {((parseFloat(selectedCampaign.raised_usd) / parseFloat(selectedCampaign.goal_usd)) * 100).toFixed(1)}% funded
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {Math.floor(Math.random() * 50) + 10} donors
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveModal('donate');
                }}
                className="flex-1 px-4 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Donate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'impact' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-green-400" />
                Impact Stories
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {impactStories.map((story, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 h-48 md:h-auto">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-2 p-6">
                      <h4 className="text-xl font-bold mb-3">{story.title}</h4>
                      <p className="text-gray-300 leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'donors' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Top Donors
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {topDonors.map((donor) => (
                <div
                  key={donor.rank}
                  className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      donor.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      donor.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      donor.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      #{donor.rank}
                    </div>
                    <div>
                      <div className="font-semibold">{donor.name}</div>
                      <div className="text-sm text-gray-400">Philanthropist</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-400">${donor.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg text-center">
              <p className="text-sm text-gray-300">
                Thank you to all our donors! Your generosity makes a real difference.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
