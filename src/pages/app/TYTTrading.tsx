import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/contexts/ToastContext';
import {
  getTYTTokenData,
  getUserTYTHoldings,
  getUserTrades,
  buyTYTToken,
  sellTYTToken,
  formatWalletAddress,
  formatTokenAmount,
  type TYTTokenData,
  type TradeSummary,
  type Trade,
} from '@/utils/pumpFun';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  DollarSign,
  Users,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import PriceAlertWidget from '@/components/PriceAlertWidget';
import OrderBookWidget from '@/components/OrderBookWidget';

export default function TYTTrading() {
  const { user } = useAuth();
  const { connectedWallet, connectPhantom, getProvider, isConnecting } = useWeb3();
  const { showToast } = useToast();

  const [tokenData, setTokenData] = useState<TYTTokenData | null>(null);
  const [holdings, setHoldings] = useState<TradeSummary | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<'chart' | 'trades' | 'portfolio'>('chart');

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [tokenDataResult, holdingsResult, tradesResult] = await Promise.all([
        getTYTTokenData(),
        getUserTYTHoldings(user.id),
        getUserTrades(user.id),
      ]);

      setTokenData(tokenDataResult);
      setHoldings(holdingsResult);
      setTrades(tradesResult);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load trading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Data refreshed', 'success');
  };

  const handleTrade = async () => {
    if (!connectedWallet) {
      showToast('Please connect your Phantom wallet first', 'error');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    const provider = getProvider();
    if (!provider) {
      showToast('Phantom wallet not available', 'error');
      return;
    }

    setIsTrading(true);
    try {
      let result;
      if (tradeType === 'buy') {
        result = await buyTYTToken(connectedWallet.wallet_address, parseFloat(amount), provider);
      } else {
        result = await sellTYTToken(connectedWallet.wallet_address, parseFloat(amount), provider);
      }

      if (result.success) {
        showToast(`${tradeType === 'buy' ? 'Purchase' : 'Sale'} successful!`, 'success');
        setAmount('');
        await loadData();
      } else {
        showToast(result.error || 'Transaction failed', 'error');
      }
    } catch (error) {
      console.error('Trade error:', error);
      showToast('Transaction failed', 'error');
    } finally {
      setIsTrading(false);
    }
  };

  const calculateEstimate = () => {
    if (!amount || !tokenData) return { tokens: 0, sol: 0, usd: 0 };

    const amountNum = parseFloat(amount);
    if (tradeType === 'buy') {
      const tokens = amountNum / tokenData.price;
      return {
        tokens,
        sol: amountNum,
        usd: amountNum * 140,
      };
    } else {
      const sol = amountNum * tokenData.price;
      return {
        tokens: amountNum,
        sol,
        usd: sol * 140,
      };
    }
  };

  const estimate = calculateEstimate();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
          <span className="text-primary-text text-lg">Loading trading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-text mb-2">TYT Trading</h1>
            <p className="text-tertiary-text">Real-time market data from pump.fun</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-secondary rounded-lg text-primary-text hover:bg-tertiary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className={`border rounded-xl p-4 ${
          tokenData?.source?.includes('Loading') || tokenData?.source?.includes('Error')
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : tokenData?.source?.includes('Cached') || tokenData?.source?.includes('old')
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-start gap-3">
            <Activity className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              tokenData?.source?.includes('Loading') || tokenData?.source?.includes('Error')
                ? 'text-yellow-500'
                : tokenData?.source?.includes('Cached') || tokenData?.source?.includes('old')
                  ? 'text-blue-500'
                  : 'text-green-500'
            }`} />
            <div className="flex-1">
              <h3 className="font-semibold text-primary-text mb-1">
                {tokenData?.source?.includes('Loading') || tokenData?.source?.includes('Error')
                  ? 'Connecting to Data Sources...'
                  : tokenData?.source?.includes('Cached') || tokenData?.source?.includes('old')
                    ? 'Recent Market Data (Cached)'
                    : 'Live Market Data'}
              </h3>
              <p className="text-sm text-tertiary-text leading-relaxed">
                {tokenData?.source?.includes('Loading') || tokenData?.source?.includes('Error') ? (
                  <>
                    Connecting to real-time data sources (Pump.fun, DexScreener, Jupiter).
                    The system is attempting to fetch live market data for TYT token.
                    Auto-retry every 15 seconds. Please wait...
                  </>
                ) : tokenData?.source?.includes('Cached') || tokenData?.source?.includes('old') ? (
                  <>
                    Displaying recent cached market data. Live sources are being checked in the background.
                    Data automatically updates every 15 seconds when new information becomes available.
                  </>
                ) : (
                  <>
                    Real-time market data from Solana blockchain and DEX aggregators.
                    Token: <span className="font-mono text-xs">8YuADot...v7rpump</span>
                    {' '}• Auto-updates every 15 seconds • Trading functionality coming soon
                  </>
                )}
              </p>
              {tokenData?.source && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-tertiary-text">Data source:</span>
                  <span className={`font-medium ${
                    tokenData.source.includes('Loading') || tokenData.source.includes('Error')
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : tokenData.source.includes('Cached') || tokenData.source.includes('old')
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-green-500 dark:text-green-400'
                  }`}>
                    {tokenData.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-secondary rounded-xl border border-secondary p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary-text">TYT Token</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-tertiary-text flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          tokenData?.source?.includes('Loading') || tokenData?.source?.includes('Error')
                            ? 'bg-yellow-500 animate-pulse'
                            : tokenData?.source?.includes('Cached') || tokenData?.source?.includes('old')
                              ? 'bg-blue-500 animate-pulse'
                              : tokenData?.source && tokenData.price > 0
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-red-500'
                        }`}></span>
                        {tokenData?.source || 'Connecting...'}
                      </p>
                      {tokenData?.lastUpdate && (
                        <span className="text-xs text-tertiary-text">
                          • Updated {new Date(tokenData.lastUpdate).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-tertiary-text hidden md:block">
                    Auto-refresh: 15s
                  </div>
                  <a
                    href="https://pump.fun/coin/8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 hover:bg-amber-500/20 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Pump.fun
                  </a>
                </div>
              </div>

              {tokenData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-tertiary/50 rounded-lg p-4">
                    <div className="text-sm text-tertiary-text mb-1">Price</div>
                    <div className="text-xl font-bold text-primary-text">
                      ${tokenData.price.toFixed(8)}
                    </div>
                    <div
                      className={`text-sm flex items-center gap-1 mt-1 ${
                        tokenData.priceChange24h >= 0
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {tokenData.priceChange24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(tokenData.priceChange24h).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-tertiary/50 rounded-lg p-4">
                    <div className="text-sm text-tertiary-text mb-1">Market Cap</div>
                    <div className="text-xl font-bold text-primary-text">
                      ${formatTokenAmount(tokenData.marketCap, 0)}
                    </div>
                  </div>

                  <div className="bg-tertiary/50 rounded-lg p-4">
                    <div className="text-sm text-tertiary-text mb-1">24h Volume</div>
                    <div className="text-xl font-bold text-primary-text">
                      ${formatTokenAmount(tokenData.volume24h, 0)}
                    </div>
                  </div>

                  <div className="bg-tertiary/50 rounded-lg p-4">
                    <div className="text-sm text-tertiary-text mb-1">Holders</div>
                    <div className="text-xl font-bold text-primary-text">{tokenData.holders}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedTab('chart')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedTab === 'chart'
                      ? 'bg-amber-500 text-white'
                      : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Chart
                </button>
                <button
                  onClick={() => setSelectedTab('trades')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedTab === 'trades'
                      ? 'bg-amber-500 text-white'
                      : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Trades
                </button>
                <button
                  onClick={() => setSelectedTab('portfolio')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedTab === 'portfolio'
                      ? 'bg-amber-500 text-white'
                      : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                  }`}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Portfolio
                </button>
              </div>

              <div className="bg-tertiary/30 rounded-lg p-6">
                {selectedTab === 'chart' && (
                  <div className="space-y-4">
                    <div className="bg-secondary border border-secondary rounded-lg p-6">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-primary-text mb-2">
                          Live Market Data
                        </p>
                        <p className="text-sm text-tertiary-text max-w-md mx-auto">
                          Real-time price data from pump.fun. Advanced charting features with TradingView integration coming soon.
                        </p>
                        <div className="mt-4">
                          <a
                            href="https://pump.fun/coin/8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump?tab=market_cap"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Full Chart on Pump.fun
                          </a>
                        </div>
                      </div>
                    </div>
                    {tokenData && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center gap-2 text-tertiary-text mb-2">
                            <Droplets className="w-4 h-4" />
                            <span className="text-sm">Liquidity</span>
                          </div>
                          <div className="text-lg font-bold text-primary-text">
                            ${formatTokenAmount(tokenData.liquidity, 0)}
                          </div>
                        </div>
                        <div className="bg-secondary rounded-lg p-4">
                          <div className="flex items-center gap-2 text-tertiary-text mb-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Total Supply</span>
                          </div>
                          <div className="text-lg font-bold text-primary-text">
                            {formatTokenAmount(tokenData.totalSupply, 0)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'trades' && (
                  <div className="space-y-4">
                    {trades.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <p className="text-tertiary-text">No trades yet</p>
                        <p className="text-sm text-tertiary-text mt-2">
                          Your trade history will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {trades.map((trade) => (
                          <div
                            key={trade.id}
                            className="bg-secondary rounded-lg p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  trade.trade_type === 'buy'
                                    ? 'bg-green-500/10'
                                    : 'bg-red-500/10'
                                }`}
                              >
                                {trade.trade_type === 'buy' ? (
                                  <ArrowUpRight
                                    className={`w-5 h-5 ${
                                      trade.trade_type === 'buy'
                                        ? 'text-green-500 dark:text-green-400'
                                        : 'text-red-500 dark:text-red-400'
                                    }`}
                                  />
                                ) : (
                                  <ArrowDownRight
                                    className={`w-5 h-5 ${
                                      trade.trade_type === 'buy'
                                        ? 'text-green-500 dark:text-green-400'
                                        : 'text-red-500 dark:text-red-400'
                                    }`}
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-primary-text capitalize">
                                  {trade.trade_type} TYT
                                </div>
                                <div className="text-sm text-tertiary-text">
                                  {new Date(trade.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-primary-text">
                                {formatTokenAmount(trade.tyt_amount)} TYT
                              </div>
                              <div className="text-sm text-tertiary-text">
                                {trade.sol_amount.toFixed(4)} SOL
                              </div>
                              <div className="flex items-center gap-1 justify-end mt-1">
                                {trade.status === 'confirmed' && (
                                  <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400" />
                                )}
                                {trade.status === 'pending' && (
                                  <Clock className="w-3 h-3 text-amber-500" />
                                )}
                                {trade.status === 'failed' && (
                                  <XCircle className="w-3 h-3 text-red-500 dark:text-red-400" />
                                )}
                                <span className="text-xs text-tertiary-text capitalize">
                                  {trade.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'portfolio' && holdings && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Total TYT Bought</div>
                        <div className="text-xl font-bold text-green-500 dark:text-green-400">
                          {formatTokenAmount(holdings.total_tyt_bought)}
                        </div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Total TYT Sold</div>
                        <div className="text-xl font-bold text-red-500 dark:text-red-400">
                          {formatTokenAmount(holdings.total_tyt_sold)}
                        </div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Net Balance</div>
                        <div className="text-xl font-bold text-primary-text">
                          {formatTokenAmount(holdings.net_tyt_balance)} TYT
                        </div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Avg Buy Price</div>
                        <div className="text-xl font-bold text-primary-text">
                          ${holdings.average_buy_price.toFixed(8)}
                        </div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Total SOL Spent</div>
                        <div className="text-xl font-bold text-primary-text">
                          {holdings.total_sol_spent.toFixed(4)} SOL
                        </div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="text-sm text-tertiary-text mb-1">Total Trades</div>
                        <div className="text-xl font-bold text-primary-text">
                          {holdings.trade_count}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {!connectedWallet ? (
              <div className="bg-secondary rounded-xl border border-secondary p-6">
                <div className="text-center">
                  <Wallet className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary-text mb-2">Connect Wallet</h3>
                  <p className="text-tertiary-text mb-6">
                    Connect your Phantom wallet to start trading TYT tokens
                  </p>
                  <button
                    onClick={connectPhantom}
                    disabled={isConnecting}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary rounded-xl border border-secondary p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-primary-text">Trade TYT</h3>
                  <div className="flex items-center gap-2 text-sm text-tertiary-text">
                    <Wallet className="w-4 h-4" />
                    {formatWalletAddress(connectedWallet.wallet_address)}
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      tradeType === 'buy'
                        ? 'bg-green-500 text-white'
                        : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      tradeType === 'sell'
                        ? 'bg-red-500 text-white'
                        : 'bg-tertiary text-tertiary-text hover:bg-tertiary/70'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-tertiary-text mb-2">
                      {tradeType === 'buy' ? 'SOL Amount' : 'TYT Amount'}
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-3 bg-tertiary border border-secondary rounded-lg text-primary-text focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {amount && tokenData && (
                    <div className="bg-tertiary/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-tertiary-text">You will {tradeType}:</span>
                        <span className="text-primary-text font-medium">
                          {tradeType === 'buy'
                            ? `${formatTokenAmount(estimate.tokens)} TYT`
                            : `${estimate.sol.toFixed(4)} SOL`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-tertiary-text">Price per token:</span>
                        <span className="text-primary-text font-medium">
                          ${tokenData.price.toFixed(8)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-tertiary-text">Est. USD value:</span>
                        <span className="text-primary-text font-medium">
                          ${estimate.usd.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={true}
                    className="w-full py-3 px-4 font-medium rounded-lg transition-colors opacity-50 cursor-not-allowed bg-tertiary text-tertiary-text"
                  >
                    Trading Coming Soon
                  </button>

                  <div className="mt-3 p-3 bg-tertiary/50 rounded-lg">
                    <p className="text-xs text-tertiary-text text-center">
                      Direct trading will be available soon through our wallet integration with pump.fun
                    </p>
                  </div>
                </div>
              </div>
            )}

            {holdings && (
              <div className="bg-secondary rounded-xl border border-secondary p-6">
                <h3 className="text-lg font-bold text-primary-text mb-4">Your Holdings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-tertiary-text">TYT Balance:</span>
                    <span className="text-lg font-bold text-primary-text">
                      {formatTokenAmount(holdings.net_tyt_balance)}
                    </span>
                  </div>
                  {tokenData && holdings.net_tyt_balance > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-tertiary-text">Current Value:</span>
                        <span className="text-primary-text font-medium">
                          ${(holdings.net_tyt_balance * tokenData.price * 140).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-tertiary-text">Total Trades:</span>
                        <span className="text-primary-text font-medium">
                          {holdings.trade_count}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tokenData && <PriceAlertWidget currentPrice={tokenData.price} />}

            {tokenData && <OrderBookWidget currentPrice={tokenData.price} />}
          </div>
        </div>
      </div>
    </div>
  );
}
