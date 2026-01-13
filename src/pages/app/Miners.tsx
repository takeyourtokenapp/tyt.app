import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, AlertCircle, Cpu } from 'lucide-react';
import type { NFTMiner } from '../../types/database';
import MinerCard from '../../components/MinerCard';
import MinerFilters from '../../components/MinerFilters';
import MinerStatsOverview from '../../components/MinerStatsOverview';

export default function Miners() {
  const { user } = useAuth();
  const [miners, setMiners] = useState<NFTMiner[]>([]);
  const [filteredMiners, setFilteredMiners] = useState<NFTMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user) {
      loadMiners();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [miners, search, statusFilter, sortBy]);

  const loadMiners = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('nft_miners')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMiners(data || []);
    } catch (err) {
      console.error('Error loading miners:', err);
      setError('Failed to load miners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...miners];

    if (search) {
      filtered = filtered.filter(m =>
        m.token_id?.toString().includes(search) ||
        m.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'maintenance') {
        filtered = filtered.filter(m =>
          m.maintenance_due && new Date(m.maintenance_due) < new Date()
        );
      } else {
        filtered = filtered.filter(m => m.status === statusFilter);
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'hashrate-high':
          return (b.hashrate || 0) - (a.hashrate || 0);
        case 'hashrate-low':
          return (a.hashrate || 0) - (b.hashrate || 0);
        case 'efficiency-best':
          return (a.efficiency || 999) - (b.efficiency || 999);
        case 'efficiency-worst':
          return (b.efficiency || 0) - (a.efficiency || 0);
        default:
          return 0;
      }
    });

    setFilteredMiners(filtered);
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
          onClick={loadMiners}
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
          <h1 className="text-3xl font-bold text-white mb-2">My Miners</h1>
          <p className="text-gray-400">
            Manage your NFT miners and track their performance
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
          title="Minting will be enabled after smart contract deployment"
        >
          <Plus className="w-5 h-5" />
          Mint Miner
        </button>
      </div>

      {miners.length > 0 && (
        <>
          <MinerStatsOverview miners={miners} />

          <MinerFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </>
      )}

      {filteredMiners.length === 0 ? (
        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-12 text-center">
          {miners.length === 0 ? (
            <>
              <Cpu className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Miners Yet</h3>
              <p className="text-gray-400 mb-6">
                Get started by minting your first NFT miner to begin earning Bitcoin rewards
              </p>
              <button
                className="px-8 py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                title="Minting will be enabled after smart contract deployment"
              >
                Mint Your First Miner
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMiners.map((miner) => (
            <MinerCard key={miner.id} miner={miner} />
          ))}
        </div>
      )}
    </div>
  );
}
