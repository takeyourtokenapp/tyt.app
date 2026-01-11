import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface MarketplaceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  hashrateRange: [number, number];
  onHashrateRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export default function MarketplaceFilters({
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  hashrateRange,
  onHashrateRangeChange,
  sortBy,
  onSortByChange
}: MarketplaceFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by miner ID, region, seller..."
            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="hashrate-high">Highest Hashrate</option>
          <option value="hashrate-low">Lowest Hashrate</option>
          <option value="roi-high">Best ROI</option>
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showAdvanced
              ? 'bg-gold-500 text-navy-900'
              : 'bg-navy-700 text-white hover:bg-navy-600'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price Range (TYT)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                placeholder="Min"
                className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 999999])}
                placeholder="Max"
                className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hashrate Range (TH/s)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={hashrateRange[0]}
                onChange={(e) => onHashrateRangeChange([parseInt(e.target.value) || 0, hashrateRange[1]])}
                placeholder="Min"
                className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={hashrateRange[1]}
                onChange={(e) => onHashrateRangeChange([hashrateRange[0], parseInt(e.target.value) || 999999])}
                placeholder="Max"
                className="w-full px-3 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
