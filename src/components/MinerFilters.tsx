import { Search, Filter } from 'lucide-react';

interface MinerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export default function MinerFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange
}: MinerFiltersProps) {
  return (
    <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search miners..."
            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance Due</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="hashrate-high">Highest Hashrate</option>
            <option value="hashrate-low">Lowest Hashrate</option>
            <option value="efficiency-best">Best Efficiency</option>
            <option value="efficiency-worst">Worst Efficiency</option>
          </select>
        </div>
      </div>
    </div>
  );
}
