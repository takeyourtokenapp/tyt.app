import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Plus, AlertCircle, TrendingUp, Cpu } from 'lucide-react';
import MarketplaceMinerCard from '../../components/MarketplaceMinerCard';
import MarketplaceFilters from '../../components/MarketplaceFilters';

export default function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [hashrateRange, setHashrateRange] = useState<[number, number]>([0, 999999]);
  const [sortBy, setSortBy] = useState('newest');

  const [stats, setStats] = useState({
    totalListings: 0,
    avgPrice: 0,
    totalVolume: 0,
    activeTraders: 0
  });

  useEffect(() => {
    loadMarketplace();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, search, priceRange, hashrateRange, sortBy]);

  const loadMarketplace = async () => {
    try {
      setLoading(true);

      const { data: listingsData, error: listingsError } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          miner:nft_miners!marketplace_listings_miner_id_fkey(
            token_id,
            power_th,
            efficiency_w_th,
            region,
            status
          ),
          seller:profiles!marketplace_listings_seller_id_fkey(username)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      const processedListings = (listingsData || []).map(listing => ({
        ...listing,
        price_usd: listing.price_tyt * 0.5
      }));

      setListings(processedListings);

      const { data: salesData } = await supabase
        .from('marketplace_sales')
        .select('sale_price_tyt');

      const totalVolume = (salesData || []).reduce((sum, s) => sum + (s.sale_price_tyt || 0), 0);

      setStats({
        totalListings: processedListings.length,
        avgPrice: processedListings.length > 0
          ? processedListings.reduce((sum, l) => sum + l.price_tyt, 0) / processedListings.length
          : 0,
        totalVolume,
        activeTraders: new Set((listingsData || []).map(l => l.seller_id)).size
      });
    } catch (err) {
      console.error('Error loading marketplace:', err);
      setError('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.miner?.token_id?.toString().includes(searchLower) ||
        l.miner?.region?.toLowerCase().includes(searchLower) ||
        l.seller?.username?.toLowerCase().includes(searchLower)
      );
    }

    filtered = filtered.filter(l =>
      l.price_tyt >= priceRange[0] &&
      l.price_tyt <= priceRange[1] &&
      (l.miner?.power_th || 0) >= hashrateRange[0] &&
      (l.miner?.power_th || 0) <= hashrateRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-low':
          return a.price_tyt - b.price_tyt;
        case 'price-high':
          return b.price_tyt - a.price_tyt;
        case 'hashrate-high':
          return (b.miner?.power_th || 0) - (a.miner?.power_th || 0);
        case 'hashrate-low':
          return (a.miner?.power_th || 0) - (b.miner?.power_th || 0);
        case 'roi-high':
          const roiA = (a.miner?.power_th || 0) * 0.00000015 * 45000 * 365 / (a.price_tyt * 0.5);
          const roiB = (b.miner?.power_th || 0) * 0.00000015 * 45000 * 365 / (b.price_tyt * 0.5);
          return roiB - roiA;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  };

  const handleBuy = (listingId: string) => {
    console.log('Buy listing:', listingId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadMarketplace}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">NFT Marketplace</h1>
          <p className="text-gray-400">
            Buy and sell NFT miners with TYT tokens
          </p>
        </div>
        <Link
          to="/app/miners"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          List Your Miner
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">Active Listings</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalListings}</p>
        </div>

        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Avg Price</span>
          </div>
          <p className="text-2xl font-bold text-gold-400">{stats.avgPrice.toFixed(0)} TYT</p>
        </div>

        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Cpu className="w-5 h-5" />
            <span className="text-sm">Total Volume</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.totalVolume.toFixed(0)} TYT</p>
        </div>

        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">Active Traders</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.activeTraders}</p>
        </div>
      </div>

      <MarketplaceFilters
        search={search}
        onSearchChange={setSearch}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        hashrateRange={hashrateRange}
        onHashrateRangeChange={setHashrateRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {filteredListings.length === 0 ? (
        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-12 text-center">
          {listings.length === 0 ? (
            <>
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Listings Available</h3>
              <p className="text-gray-400 mb-6">
                Be the first to list your miner on the marketplace
              </p>
              <Link
                to="/app/miners"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all"
              >
                <Plus className="w-5 h-5" />
                List Your Miner
              </Link>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Miners Match Your Filters</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Showing {filteredListings.length} of {listings.length} listings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <MarketplaceMinerCard
                key={listing.id}
                listing={listing}
                onBuy={handleBuy}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
