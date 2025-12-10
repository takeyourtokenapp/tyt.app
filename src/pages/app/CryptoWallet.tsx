import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMultiChainWeb3, BlockchainNetwork, NETWORK_CONFIGS } from '../../contexts/MultiChainWeb3Context';
import { getSwapQuote, executeSwap, getUserSwapHistory, POPULAR_TOKENS } from '../../utils/swapAggregator';
import { getStakingPools, getUserStakes, stakeTokens, unstakeTokens, getTotalStakingStats } from '../../utils/staking';
import { getBridgeQuote, initiateBridgeTransfer, getUserBridgeHistory } from '../../utils/crossChainBridge';
import { getBuyQuote, getSellQuote, initiateBuy, initiateSell, getUserFiatHistory } from '../../utils/fiatRamp';
import {
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  DollarSign,
  Lock,
  Send,
  Download,
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle2,
  Loader2,
  Copy,
  AlertCircle
} from 'lucide-react';

type Tab = 'overview' | 'swap' | 'bridge' | 'stake' | 'fiat';

export default function CryptoWallet() {
  const { user } = useAuth();
  const {
    connectedWallets,
    currentNetwork,
    setCurrentNetwork,
    connectWallet,
    disconnectWallet,
    isConnecting
  } = useMultiChainWeb3();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [bridgeHistory, setBridgeHistory] = useState<any[]>([]);
  const [fiatHistory, setFiatHistory] = useState<any[]>([]);
  const [stakingPools, setStakingPools] = useState<any[]>([]);
  const [userStakes, setUserStakes] = useState<any[]>([]);
  const [stakingStats, setStakingStats] = useState({ totalStaked: 0, estimatedRewards: 0, activeStakes: 0 });

  // Swap state
  const [swapFromToken, setSwapFromToken] = useState('SOL');
  const [swapToToken, setSwapToToken] = useState('TYT');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapQuote, setSwapQuote] = useState<any>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  // Bridge state
  const [bridgeFromChain, setBridgeFromChain] = useState<BlockchainNetwork>('solana');
  const [bridgeToChain, setBridgeToChain] = useState<BlockchainNetwork>('ethereum');
  const [bridgeToken, setBridgeToken] = useState('USDC');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [bridgeQuote, setBridgeQuote] = useState<any>(null);
  const [isBridging, setIsBridging] = useState(false);

  // Staking state
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  // Fiat state
  const [fiatMode, setFiatMode] = useState<'buy' | 'sell'>('buy');
  const [fiatAmount, setFiatAmount] = useState('');
  const [fiatCrypto, setFiatCrypto] = useState('SOL');
  const [fiatQuote, setFiatQuote] = useState<any>(null);
  const [isProcessingFiat, setIsProcessingFiat] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [swaps, bridges, fiats, pools, stakes, stats] = await Promise.all([
      getUserSwapHistory(user.id),
      getUserBridgeHistory(user.id),
      getUserFiatHistory(user.id),
      getStakingPools(),
      getUserStakes(user.id),
      getTotalStakingStats(user.id)
    ]);

    setSwapHistory(swaps);
    setBridgeHistory(bridges);
    setFiatHistory(fiats);
    setStakingPools(pools);
    setUserStakes(stakes);
    setStakingStats(stats);
  };

  useEffect(() => {
    const loadSwapQuote = async () => {
      if (swapAmount && parseFloat(swapAmount) > 0) {
        const quote = await getSwapQuote(currentNetwork, swapFromToken, swapToToken, parseFloat(swapAmount));
        setSwapQuote(quote);
      } else {
        setSwapQuote(null);
      }
    };

    const debounce = setTimeout(loadSwapQuote, 500);
    return () => clearTimeout(debounce);
  }, [swapAmount, swapFromToken, swapToToken, currentNetwork]);

  useEffect(() => {
    const loadBridgeQuote = async () => {
      if (bridgeAmount && parseFloat(bridgeAmount) > 0) {
        const quote = await getBridgeQuote(bridgeFromChain, bridgeToChain, bridgeToken, parseFloat(bridgeAmount));
        setBridgeQuote(quote);
      } else {
        setBridgeQuote(null);
      }
    };

    const debounce = setTimeout(loadBridgeQuote, 500);
    return () => clearTimeout(debounce);
  }, [bridgeAmount, bridgeFromChain, bridgeToChain, bridgeToken]);

  useEffect(() => {
    const loadFiatQuote = async () => {
      if (fiatAmount && parseFloat(fiatAmount) > 0) {
        const quote = fiatMode === 'buy'
          ? await getBuyQuote(parseFloat(fiatAmount), 'USD', fiatCrypto)
          : await getSellQuote(parseFloat(fiatAmount), fiatCrypto, 'USD');
        setFiatQuote(quote);
      } else {
        setFiatQuote(null);
      }
    };

    const debounce = setTimeout(loadFiatQuote, 500);
    return () => clearTimeout(debounce);
  }, [fiatAmount, fiatMode, fiatCrypto]);

  const handleSwap = async () => {
    if (!swapQuote || !user) return;

    const wallet = connectedWallets[currentNetwork];
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSwapping(true);
    try {
      const result = await executeSwap(user.id, currentNetwork, swapQuote, wallet.wallet_address, null);
      if (result.success) {
        alert(`Swap successful!\nTx: ${result.txHash}`);
        setSwapAmount('');
        loadData();
      } else {
        alert(`Swap failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleBridge = async () => {
    if (!bridgeQuote || !user) return;

    const fromWallet = connectedWallets[bridgeFromChain];
    const toWallet = connectedWallets[bridgeToChain];

    if (!fromWallet || !toWallet) {
      alert('Please connect wallets on both networks');
      return;
    }

    setIsBridging(true);
    try {
      const result = await initiateBridgeTransfer(
        user.id,
        bridgeQuote,
        fromWallet.wallet_address,
        toWallet.wallet_address,
        null
      );

      if (result.success) {
        alert(`Bridge initiated!\nTransfer ID: ${result.transferId}\nSource Tx: ${result.sourceTxHash}`);
        setBridgeAmount('');
        loadData();
      } else {
        alert(`Bridge failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsBridging(false);
    }
  };

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || !user) return;

    const wallet = connectedWallets[selectedPool.blockchain];
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    setIsStaking(true);
    try {
      const result = await stakeTokens(
        user.id,
        selectedPool.id,
        parseFloat(stakeAmount),
        wallet.wallet_address,
        null
      );

      if (result.success) {
        alert('Tokens staked successfully!');
        setStakeAmount('');
        setSelectedPool(null);
        loadData();
      } else {
        alert(`Staking failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (stakeId: string) => {
    if (!user) return;

    try {
      const result = await unstakeTokens(user.id, stakeId, null);
      if (result.success) {
        alert('Tokens unstaked successfully!');
        loadData();
      } else {
        alert(`Unstaking failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleFiat = async () => {
    if (!fiatQuote || !user) return;

    const wallet = connectedWallets[currentNetwork];
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessingFiat(true);
    try {
      const result = fiatMode === 'buy'
        ? await initiateBuy(user.id, fiatQuote, currentNetwork, wallet.wallet_address)
        : await initiateSell(user.id, fiatQuote, currentNetwork, wallet.wallet_address, 'IBAN123456');

      if (result.success) {
        if (result.paymentUrl) {
          window.open(result.paymentUrl, '_blank');
        }
        alert(`${fiatMode === 'buy' ? 'Purchase' : 'Sale'} initiated!\nTransaction ID: ${result.transactionId}`);
        setFiatAmount('');
        loadData();
      } else {
        alert(`Transaction failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessingFiat(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Multi-Chain Crypto Wallet</h1>
          <p className="text-gray-400">Connect wallets, swap tokens, stake, and bridge assets across 5 blockchains</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {(Object.keys(NETWORK_CONFIGS) as BlockchainNetwork[]).map((network) => {
          const config = NETWORK_CONFIGS[network];
          const wallet = connectedWallets[network];
          const isActive = currentNetwork === network;

          return (
            <div
              key={network}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border transition-all ${
                isActive ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-gray-700'
              }`}
            >
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-2xl`}>
                  {config.symbol[0]}
                </div>
                <div>
                  <div className="font-bold">{config.name}</div>
                  <div className="text-xs text-gray-400">{config.symbol}</div>
                </div>
                {wallet ? (
                  <div className="space-y-2">
                    <div className="text-xs text-green-400 flex items-center justify-center gap-1">
                      <CheckCircle2 size={12} />
                      Connected
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate">
                      {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                    </div>
                    <button
                      onClick={() => setCurrentNetwork(network)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? 'bg-amber-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Switch'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const walletType = network === 'solana' ? 'phantom' : network === 'tron' ? 'tronlink' : 'metamask';
                      connectWallet(network, walletType);
                    }}
                    disabled={isConnecting}
                    className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Staked
            </div>
            <div className="text-3xl font-bold text-amber-400">
              ${stakingStats.totalStaked.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Staking Rewards
            </div>
            <div className="text-3xl font-bold text-green-400">
              ${stakingStats.estimatedRewards.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Active Stakes
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {stakingStats.activeStakes}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'swap', label: 'Swap', icon: ArrowRightLeft },
            { id: 'bridge', label: 'Bridge', icon: Send },
            { id: 'stake', label: 'Staking', icon: Lock },
            { id: 'fiat', label: 'Buy/Sell', icon: DollarSign }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Recent Activity</h3>

              {[...swapHistory, ...bridgeHistory, ...fiatHistory]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 10)
                .map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-semibold mb-1">
                        {'from_token' in tx ? 'Swap' : 'from_blockchain' in tx ? 'Bridge' : 'Fiat'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">
                        {'to_amount' in tx && `+${tx.to_amount}`}
                        {'crypto_amount' in tx && tx.crypto_amount}
                      </div>
                      <div className="text-xs text-gray-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'swap' && (
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-xl font-bold text-center">Swap Tokens on {NETWORK_CONFIGS[currentNetwork].name}</h3>

              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <select
                  value={swapFromToken}
                  onChange={(e) => setSwapFromToken(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
                >
                  {POPULAR_TOKENS[currentNetwork].map(token => (
                    <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>

              <div className="flex justify-center">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <select
                  value={swapToToken}
                  onChange={(e) => setSwapToToken(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
                >
                  {POPULAR_TOKENS[currentNetwork].map(token => (
                    <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
                  ))}
                </select>
                <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-bold text-amber-400">
                  {swapQuote ? swapQuote.outputAmount.toFixed(6) : '0.00'}
                </div>
              </div>

              {swapQuote && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span>1 {swapFromToken} = {(swapQuote.outputAmount / swapQuote.inputAmount).toFixed(6)} {swapToToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Impact:</span>
                    <span>{swapQuote.priceImpact}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span>{swapQuote.provider}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSwap}
                disabled={!swapQuote || isSwapping}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSwapping ? 'Swapping...' : 'Swap Tokens'}
              </button>
            </div>
          )}

          {activeTab === 'bridge' && (
            <div className="max-w-md mx-auto space-y-6">
              <h3 className="text-xl font-bold text-center">Bridge Assets Cross-Chain</h3>

              <div>
                <label className="block text-sm font-medium mb-2">From Chain</label>
                <select
                  value={bridgeFromChain}
                  onChange={(e) => setBridgeFromChain(e.target.value as BlockchainNetwork)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  {(Object.keys(NETWORK_CONFIGS) as BlockchainNetwork[]).map(network => (
                    <option key={network} value={network}>{NETWORK_CONFIGS[network].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To Chain</label>
                <select
                  value={bridgeToChain}
                  onChange={(e) => setBridgeToChain(e.target.value as BlockchainNetwork)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  {(Object.keys(NETWORK_CONFIGS) as BlockchainNetwork[]).filter(n => n !== bridgeFromChain).map(network => (
                    <option key={network} value={network}>{NETWORK_CONFIGS[network].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={bridgeAmount}
                  onChange={(e) => setBridgeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>

              {bridgeQuote && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bridge Fee:</span>
                    <span>{bridgeQuote.bridgeFee.toFixed(6)} {bridgeToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Est. Time:</span>
                    <span>{bridgeQuote.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span>{bridgeQuote.provider}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBridge}
                disabled={!bridgeQuote || isBridging}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBridging ? 'Bridging...' : 'Bridge Assets'}
              </button>
            </div>
          )}

          {activeTab === 'stake' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Available Staking Pools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stakingPools.slice(0, 8).map(pool => (
                    <div
                      key={pool.id}
                      className={`p-4 bg-gray-800/50 border rounded-lg cursor-pointer transition-all ${
                        selectedPool?.id === pool.id ? 'border-amber-500' : 'border-gray-700 hover:border-amber-500/50'
                      }`}
                      onClick={() => setSelectedPool(pool)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">{pool.name}</div>
                        <div className="text-green-400 font-bold">{pool.apy}% APY</div>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Min: {pool.min_stake} {pool.token_symbol}</div>
                        <div>Lock: {pool.lock_period_days} days</div>
                        <div>Chain: {NETWORK_CONFIGS[pool.blockchain as BlockchainNetwork].name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPool && (
                <div className="max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
                  <h4 className="text-lg font-bold">Stake {selectedPool.token_symbol}</h4>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder={`Min: ${selectedPool.min_stake}`}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={handleStake}
                    disabled={isStaking}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all disabled:opacity-50"
                  >
                    {isStaking ? 'Staking...' : 'Stake Tokens'}
                  </button>
                </div>
              )}

              {userStakes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Your Stakes</h3>
                  <div className="space-y-3">
                    {userStakes.map(stake => (
                      <div key={stake.id} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{stake.amount} {stake.staking_pools?.token_symbol}</div>
                            <div className="text-sm text-gray-400">
                              APY: {stake.staking_pools?.apy}% • Unlock: {new Date(stake.unlock_date).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnstake(stake.id)}
                            disabled={new Date() < new Date(stake.unlock_date)}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                          >
                            Unstake
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fiat' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setFiatMode('buy')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    fiatMode === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  Buy Crypto
                </button>
                <button
                  onClick={() => setFiatMode('sell')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    fiatMode === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  Sell Crypto
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{fiatMode === 'buy' ? 'Spend (USD)' : 'Sell Amount'}</label>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cryptocurrency</label>
                <select
                  value={fiatCrypto}
                  onChange={(e) => setFiatCrypto(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <option value="SOL">Solana (SOL)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">BNB (BNB)</option>
                  <option value="MATIC">Polygon (MATIC)</option>
                  <option value="TRX">TRON (TRX)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>

              {fiatQuote && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span>1 {fiatQuote.cryptoCurrency} = ${fiatQuote.rate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{fiatMode === 'buy' ? 'You Get:' : 'You Receive:'}</span>
                    <span className="font-bold text-amber-400">
                      {fiatMode === 'buy' ? `${fiatQuote.cryptoAmount} ${fiatQuote.cryptoCurrency}` : `$${fiatQuote.fiatAmount}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee:</span>
                    <span>${fiatQuote.fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span>{fiatQuote.provider}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleFiat}
                disabled={!fiatQuote || isProcessingFiat}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  fiatMode === 'buy'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400'
                }`}
              >
                {isProcessingFiat ? 'Processing...' : fiatMode === 'buy' ? 'Buy Now' : 'Sell Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
