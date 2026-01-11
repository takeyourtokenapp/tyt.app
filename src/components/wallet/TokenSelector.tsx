import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  icon?: string;
  balance?: number;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  tokens: Token[];
  onSelect: (token: Token) => void;
  label?: string;
}

export default function TokenSelector({ selectedToken, tokens, onSelect, label }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(search.toLowerCase()) ||
    token.name.toLowerCase().includes(search.toLowerCase())
  );

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
        {selectedToken ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold">
              {selectedToken.symbol.substring(0, 2)}
            </div>
            <div className="text-left">
              <p className="text-white font-bold">{selectedToken.symbol}</p>
              <p className="text-xs text-gray-400">{selectedToken.name}</p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select token</span>
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
                  placeholder="Search tokens..."
                  className="w-full pl-10 pr-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => {
                    onSelect(token);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-navy-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm">
                      {token.symbol.substring(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{token.symbol}</p>
                      <p className="text-xs text-gray-400">{token.name}</p>
                    </div>
                  </div>
                  {token.balance !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-white">{token.balance.toFixed(4)}</p>
                      <p className="text-xs text-gray-400">Balance</p>
                    </div>
                  )}
                </button>
              ))}

              {filteredTokens.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-400">No tokens found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
