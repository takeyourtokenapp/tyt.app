import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CustodialWallet } from '../../types/database';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'maintenance' | 'purchase';
  asset: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  tx_hash?: string;
}

export default function Wallet() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<CustodialWallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [copiedAddress, setCopiedAddress] = useState('');

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;

    try {
      const { data: walletsData } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('asset', { ascending: true });

      if (walletsData) setWallets(walletsData);

      setTransactions([
        {
          id: '1',
          type: 'reward',
          asset: 'BTC',
          amount: '0.00012345',
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'maintenance',
          asset: 'TYT',
          amount: '150.00',
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, asset: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(asset);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const getDepositAddress = (asset: string): string => {
    const addresses: Record<string, string> = {
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      SOL: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      TRX: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
      XRP: 'rN7n7otQDd6FczFgLdZqxrqRq4xQASSKr2',
      TYT: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      USDT: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
    };
    return addresses[asset] || 'Address not available';
  };

  const totalBalanceUSD = wallets.reduce((sum, wallet) => {
    const prices: Record<string, number> = {
      BTC: 95000,
      ETH: 3500,
      SOL: 140,
      TRX: 0.15,
      XRP: 2.5,
      TYT: 0.05,
      USDT: 1
    };
    return sum + parseFloat(wallet.balance) * (prices[wallet.asset] || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-gray-400">Manage your multi-asset custodial wallet</p>
        </div>
        <button
          onClick={loadWalletData}
          className="px-4 py-2 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl p-8 border border-amber-500/50">
        <div className="text-sm text-gray-300 mb-2">Total Balance</div>
        <div className="text-4xl font-bold text-amber-400 mb-4">
          ${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-400">
          Across {wallets.length} assets
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedAsset(wallet.asset)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-xl font-bold">
                  {wallet.asset[0]}
                </div>
                <div>
                  <div className="font-bold">{wallet.asset}</div>
                  <div className="text-xs text-gray-400">Available</div>
                </div>
              </div>
              <WalletIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mb-2">
              {parseFloat(wallet.balance).toFixed(wallet.asset === 'BTC' ? 8 : 2)}
            </div>
            {parseFloat(wallet.locked_balance) > 0 && (
              <div className="text-xs text-gray-400">
                Locked: {parseFloat(wallet.locked_balance).toFixed(wallet.asset === 'BTC' ? 8 : 2)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-green-400" />
            Deposit {selectedAsset}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Deposit Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getDepositAddress(selectedAsset)}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(getDepositAddress(selectedAsset), selectedAsset)}
                  className="px-4 py-3 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all"
                >
                  {copiedAddress === selectedAsset ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                Only send {selectedAsset} to this address. Sending other assets may result in permanent loss.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-red-400" />
            Withdraw {selectedAsset}
          </h2>
          {showWithdraw ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Destination Address</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder={`Enter ${selectedAsset} address`}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-red-500 rounded-lg font-semibold hover:bg-red-400 transition-all">
                  Withdraw
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowWithdraw(true)}
              className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
            >
              Initiate Withdrawal
            </button>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No transactions yet
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' || tx.type === 'reward' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'reward' ? (
                        <ArrowDownLeft className={`w-5 h-5 ${tx.type === 'reward' ? 'text-green-400' : 'text-green-400'}`} />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{tx.type}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'}{tx.amount} {tx.asset}
                    </div>
                    <div className={`text-xs ${
                      tx.status === 'completed' ? 'text-green-400' :
                      tx.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
