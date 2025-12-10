import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallets } from '../../hooks/useAPI';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Filter,
  Download,
  Search,
  TrendingUp,
  Info,
  Heart,
  GraduationCap,
  Building2
} from 'lucide-react';
import type { CustodialWallet } from '../../types/database';
import { calculateDepositFees, processDeposit, formatFeeBreakdown, type FeeBreakdown } from '../../utils/depositFees';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'maintenance' | 'purchase' | 'swap' | 'transfer';
  asset: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  tx_hash?: string;
  from_asset?: string;
  to_asset?: string;
}

type ModalType = 'deposit' | 'withdraw' | 'swap' | null;

export default function Wallet() {
  const { user } = useAuth();
  const { data: wallets = [], isLoading, refetch } = useWallets(user?.id);

  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copiedAddress, setCopiedAddress] = useState('');

  const [depositAmount, setDepositAmount] = useState('');
  const [depositFees, setDepositFees] = useState<FeeBreakdown | null>(null);
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const [swapFromAsset, setSwapFromAsset] = useState('BTC');
  const [swapToAsset, setSwapToAsset] = useState('TYT');
  const [swapAmount, setSwapAmount] = useState('');

  const [txFilter, setTxFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFees = async () => {
      if (depositAmount && parseFloat(depositAmount) > 0) {
        const fees = await calculateDepositFees(parseFloat(depositAmount), selectedAsset);
        setDepositFees(fees);
      } else {
        setDepositFees(null);
      }
    };

    const debounce = setTimeout(() => {
      loadFees();
    }, 500);

    return () => clearTimeout(debounce);
  }, [depositAmount, selectedAsset]);

  const handleDepositSubmit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return;
    }

    setIsProcessingDeposit(true);
    try {
      const result = await processDeposit(
        selectedAsset,
        parseFloat(depositAmount)
      );

      if (result.success) {
        setActiveModal(null);
        setDepositAmount('');
        setDepositFees(null);
        refetch();
        alert(`Deposit successful! ${result.amount_credited} ${selectedAsset} credited to your wallet.`);
      } else {
        alert(`Deposit failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setIsProcessingDeposit(false);
    }
  };

  const mockTransactions: Transaction[] = [
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
    },
    {
      id: '3',
      type: 'deposit',
      asset: 'USDT',
      amount: '500.00',
      status: 'completed',
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '4',
      type: 'swap',
      asset: 'TYT',
      amount: '1000.00',
      status: 'completed',
      created_at: new Date(Date.now() - 259200000).toISOString(),
      from_asset: 'USDT',
      to_asset: 'TYT'
    }
  ];

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
      TYT: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      USDT: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9'
    };
    return addresses[asset] || 'Address not available';
  };

  const assetPrices: Record<string, number> = {
    BTC: 95000,
    ETH: 3500,
    SOL: 140,
    TRX: 0.15,
    XRP: 2.5,
    TYT: 0.05,
    USDT: 1
  };

  const totalBalanceUSD = wallets.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance) * (assetPrices[wallet.asset] || 0);
  }, 0);

  const filteredTransactions = mockTransactions.filter(tx => {
    if (txFilter !== 'all' && tx.type !== txFilter) return false;
    if (searchTerm && !tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !tx.type.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const selectedWallet = wallets.find(w => w.asset === selectedAsset);
  const swapFromWallet = wallets.find(w => w.asset === swapFromAsset);
  const swapRate = swapFromAsset && swapToAsset ?
    assetPrices[swapFromAsset] / assetPrices[swapToAsset] : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400">Loading wallet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-gray-400">Manage your multi-asset custodial wallet</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/30 transition-all flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-8 border border-amber-500/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Portfolio Value
            </div>
            <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
              ${totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-400">
              Across {wallets.length} assets
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">24h Change</div>
            <div className="text-lg font-bold text-green-400">+2.3%</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.map((wallet) => {
            const usdValue = parseFloat(wallet.balance) * (assetPrices[wallet.asset] || 0);

            return (
              <div
                key={wallet.id}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border transition-all cursor-pointer ${
                  selectedAsset === wallet.asset
                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'border-gray-700 hover:border-amber-500/50'
                }`}
                onClick={() => setSelectedAsset(wallet.asset)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-xl font-bold text-amber-400">
                      {wallet.asset[0]}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{wallet.asset}</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white">
                    {parseFloat(wallet.balance).toFixed(wallet.asset === 'BTC' ? 8 : 2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    ≈ ${usdValue.toFixed(2)} USD
                  </div>
                  {parseFloat(wallet.locked_balance) > 0 && (
                    <div className="text-xs text-amber-400 mt-2">
                      🔒 Locked: {parseFloat(wallet.locked_balance).toFixed(wallet.asset === 'BTC' ? 8 : 2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveModal('deposit')}
            className="group p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                <ArrowDownLeft className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg mb-1">Deposit</div>
                <div className="text-sm text-gray-400">Add funds to wallet</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('withdraw')}
            className="group p-6 bg-gradient-to-br from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-colors">
                <ArrowUpRight className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg mb-1">Withdraw</div>
                <div className="text-sm text-gray-400">Send to external wallet</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('swap')}
            className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <ArrowRightLeft className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg mb-1">Swap</div>
                <div className="text-sm text-gray-400">Exchange between assets</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Transaction History</h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-64 pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm"
                />
              </div>
              <select
                value={txFilter}
                onChange={(e) => setTxFilter(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="reward">Rewards</option>
                <option value="swap">Swaps</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit' || tx.type === 'reward' ? 'bg-green-500/20' :
                      tx.type === 'swap' ? 'bg-blue-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'reward' ? (
                        <ArrowDownLeft className="w-6 h-6 text-green-400" />
                      ) : tx.type === 'swap' ? (
                        <ArrowRightLeft className="w-6 h-6 text-blue-400" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold capitalize mb-1">
                        {tx.type === 'swap' && tx.from_asset && tx.to_asset
                          ? `Swap ${tx.from_asset} → ${tx.to_asset}`
                          : tx.type}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                      {tx.tx_hash && (
                        <div className="text-xs text-gray-500 font-mono mt-1">
                          {tx.tx_hash.slice(0, 16)}...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-400' :
                      tx.type === 'swap' ? 'text-blue-400' :
                      'text-red-400'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'reward' ? '+' :
                       tx.type === 'swap' ? '' : '-'}
                      {tx.amount} {tx.asset}
                    </div>
                    <div className={`text-xs font-semibold mt-1 ${
                      tx.status === 'completed' ? 'text-green-400' :
                      tx.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {tx.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {activeModal === 'deposit' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Deposit {selectedAsset}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Select Asset</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  {wallets.map(w => (
                    <option key={w.asset} value={w.asset}>{w.asset}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Amount to Deposit</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="any"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>

              {depositFees && (
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                    <Info size={18} />
                    <span>Fee Breakdown (1%)</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Gross Amount:</span>
                      <span className="font-bold">{parseFloat(depositAmount).toFixed(8)} {selectedAsset}</span>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-blue-400" />
                        <span className="text-gray-400">Protocol (60%):</span>
                      </div>
                      <span className="font-mono">{depositFees.fee_protocol.toFixed(8)} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart size={14} className="text-pink-400" />
                        <span className="text-gray-400">Foundation (30%):</span>
                      </div>
                      <span className="font-mono">{depositFees.fee_charity.toFixed(8)} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-purple-400" />
                        <span className="text-gray-400">Academy (10%):</span>
                      </div>
                      <span className="font-mono">{depositFees.fee_academy.toFixed(8)} {selectedAsset}</span>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-amber-400 font-semibold">You Receive:</span>
                      <span className="text-amber-400 font-bold text-lg">{depositFees.amount_user.toFixed(8)} {selectedAsset}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-3">Deposit Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={getDepositAddress(selectedAsset)}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono"
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
                  Only send {selectedAsset} to this address. A 1% deposit fee applies to support platform operations (60%),
                  children's brain cancer research (30%), and education (10%).
                </div>
              </div>

              <button
                onClick={handleDepositSubmit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isProcessingDeposit}
                className="w-full px-4 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingDeposit ? 'Processing...' : 'Confirm Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'withdraw' && selectedWallet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Withdraw {selectedAsset}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Available Balance</label>
                <div className="text-2xl font-bold text-amber-400">
                  {parseFloat(selectedWallet.balance).toFixed(selectedAsset === 'BTC' ? 8 : 2)} {selectedAsset}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Destination Address</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder={`Enter ${selectedAsset} address`}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm"
                />
              </div>
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  Double-check the address. Withdrawals are irreversible.
                  Network fee: ~$2.50
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-red-500 rounded-lg font-semibold hover:bg-red-400 transition-all">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'swap' && swapFromWallet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Swap Assets</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">From</label>
                <select
                  value={swapFromAsset}
                  onChange={(e) => setSwapFromAsset(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
                >
                  {wallets.map(w => (
                    <option key={w.asset} value={w.asset}>{w.asset}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
                <div className="text-xs text-gray-400 mt-2">
                  Balance: {parseFloat(swapFromWallet.balance).toFixed(8)} {swapFromAsset}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">To</label>
                <select
                  value={swapToAsset}
                  onChange={(e) => setSwapToAsset(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
                >
                  {wallets.filter(w => w.asset !== swapFromAsset).map(w => (
                    <option key={w.asset} value={w.asset}>{w.asset}</option>
                  ))}
                </select>
                <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-amber-400 font-bold">
                  {swapAmount ? (parseFloat(swapAmount) * swapRate).toFixed(8) : '0.00'}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Rate: 1 {swapFromAsset} = {swapRate.toFixed(8)} {swapToAsset}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <div className="text-sm text-gray-300">
                  Exchange fee: 0.5%
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-400 transition-all">
                  Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
