import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Network {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  fee?: number;
}

interface NetworkSelectorProps {
  selectedNetwork: Network | null;
  networks: Network[];
  onSelect: (network: Network) => void;
  label?: string;
}

export default function NetworkSelector({ selectedNetwork, networks, onSelect, label }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredNetworks = networks.filter(network =>
    network.name.toLowerCase().includes(search.toLowerCase()) ||
    network.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getNetworkColor = (symbol: string) => {
    const colors: Record<string, string> = {
      BTC: 'from-orange-400 to-orange-600',
      ETH: 'from-purple-400 to-purple-600',
      MATIC: 'from-purple-500 to-purple-700',
      TRX: 'from-red-400 to-red-600',
      SOL: 'from-cyan-400 to-cyan-600',
      BNB: 'from-yellow-400 to-yellow-600',
      TON: 'from-blue-400 to-blue-600',
      XRP: 'from-gray-400 to-gray-600'
    };
    return colors[symbol] || 'from-gold-400 to-gold-600';
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg hover:border-gold-500 transition-colors"
      >
        {selectedNetwork ? (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${getNetworkColor(selectedNetwork.symbol)} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
              {selectedNetwork.symbol.substring(0, 3)}
            </div>
            <div className="text-left">
              <p className="text-white font-bold">{selectedNetwork.name}</p>
              {selectedNetwork.fee !== undefined && (
                <p className="text-xs text-gray-400">Fee: ~${selectedNetwork.fee.toFixed(2)}</p>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select network</span>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-navy-800 border border-gold-500/20 rounded-lg shadow-xl max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search networks..."
                  className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {filteredNetworks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => {
                    onSelect(network);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-navy-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getNetworkColor(network.symbol)} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                      {network.symbol.substring(0, 3)}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{network.name}</p>
                      <p className="text-xs text-gray-400">{network.symbol}</p>
                    </div>
                  </div>
                  {network.fee !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-gold-400 font-medium">~${network.fee.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">Est. Fee</p>
                    </div>
                  )}
                </button>
              ))}

              {filteredNetworks.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-400">No networks found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
