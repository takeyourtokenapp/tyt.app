import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, TrendingUp, Filter, Search, Cpu, Zap, DollarSign } from 'lucide-react';
import type { MarketplaceListing, NFTMiner } from '../../types/database';

type ListingWithMiner = MarketplaceListing & {
  nft_miners: NFTMiner;
};

export default function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingWithMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'hashrate' | 'efficiency'>('price_low');
  const [filterAsset, setFilterAsset] = useState<'all' | 'TYT' | 'USDT' | 'BTC'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          nft_miners (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setListings(data as ListingWithMiner[]);
    } catch (error) {
      console.error('Error loading marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings
    .filter(listing => {
      if (filterAsset !== 'all' && listing.list_price_asset !== filterAsset) return false;
      if (searchQuery && !listing.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return parseFloat(a.list_price_amount) - parseFloat(b.list_price_amount);
        case 'price_high':
          return parseFloat(b.list_price_amount) - parseFloat(a.list_price_amount);
        case 'hashrate':
          return b.nft_miners.hashrate_th - a.nft_miners.hashrate_th;
        case 'efficiency':
          return a.nft_miners.efficiency_w_per_th - b.nft_miners.efficiency_w_per_th;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-400">Buy and sell NFT miners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Active Listings</div>
            <ShoppingCart className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{listings.length}</div>
          <div className="text-xs text-gray-500 mt-2">Available now</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Avg Price</div>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">
            {listings.length > 0
              ? (listings.reduce((sum, l) => sum + parseFloat(l.list_price_amount), 0) / listings.length).toFixed(0)
              : '0'}
          </div>
          <div className="text-xs text-gray-500 mt-2">USDT equiv.</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Total Hashrate</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">
            {listings.reduce((sum, l) => sum + l.nft_miners.hashrate_th, 0).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-2">TH/s available</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">24h Volume</div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">$12.5K</div>
          <div className="text-xs text-green-400 mt-2">+15.3%</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by miner ID..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="hashrate">Hashrate: High to Low</option>
              <option value="efficiency">Efficiency: Best First</option>
            </select>

            <select
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value as any)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="all">All Assets</option>
              <option value="TYT">TYT</option>
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-12 border border-gray-700 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Listings Found</h3>
          <p className="text-gray-400">
            {searchQuery || filterAsset !== 'all'
              ? 'Try adjusting your filters'
              : 'Be the first to list a miner for sale'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
                  {listing.listing_type === 'fixed_price' ? 'Fixed Price' : 'Auction'}
                </div>
                <div className="text-xs text-gray-400">
                  #{listing.nft_miners.id.slice(0, 8)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <Cpu size={14} />
                    Hashrate
                  </div>
                  <div className="text-lg font-bold text-amber-400">
                    {listing.nft_miners.hashrate_th} TH/s
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <Zap size={14} />
                    Efficiency
                  </div>
                  <div className="text-lg font-bold text-amber-400">
                    {listing.nft_miners.efficiency_w_per_th} W/TH
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <div className="text-xs text-gray-400 mb-1">Price</div>
                <div className="text-2xl font-bold text-amber-400">
                  {parseFloat(listing.list_price_amount).toLocaleString()} {listing.list_price_asset}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ $
                  {listing.list_price_asset === 'USDT'
                    ? parseFloat(listing.list_price_amount).toFixed(2)
                    : listing.list_price_asset === 'BTC'
                    ? (parseFloat(listing.list_price_amount) * 95000).toFixed(2)
                    : (parseFloat(listing.list_price_amount) * 0.05).toFixed(2)}
                </div>
              </div>

              <button
                disabled={listing.seller_id === user?.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {listing.seller_id === user?.id ? 'Your Listing' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-400" />
          Marketplace Fees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">Standard Fee</div>
            <div className="font-semibold">2.5%</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">VIP Discount</div>
            <div className="font-semibold text-amber-400">Up to 50% off</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Payment</div>
            <div className="font-semibold">TYT, USDT, BTC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
