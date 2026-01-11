import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Bridge as BridgeIcon,
  ArrowDownUp,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import NetworkSelector from '../../components/wallet/NetworkSelector';
import TokenSelector from '../../components/wallet/TokenSelector';

interface Network {
  id: string;
  name: string;
  symbol: string;
  fee: number;
}

interface Token {
  symbol: string;
  name: string;
  balance: number;
}

export default function Bridge() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bridging, setBridging] = useState(false);

  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');

  const [recentBridges, setRecentBridges] = useState<any[]>([]);

  const networks: Network[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', fee: 2.5 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', fee: 15.0 },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', fee: 0.1 },
    { id: 'tron', name: 'Tron', symbol: 'TRX', fee: 1.0 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', fee: 0.05 },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', fee: 0.5 },
    { id: 'ton', name: 'TON', symbol: 'TON', fee: 0.3 },
    { id: 'xrp', name: 'XRP Ledger', symbol: 'XRP', fee: 0.01 }
  ];

  const tokens: Token[] = [
    { symbol: 'TYT', name: 'TakeYourToken', balance: 1000 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.5 },
    { symbol: 'USDT', name: 'Tether USD', balance: 5000 }
  ];

  useEffect(() => {
    if (user) {
      loadBridgeHistory();
    }
  }, [user]);

  const loadBridgeHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('cross_chain_transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentBridges(data || []);

      if (!fromNetwork) setFromNetwork(networks[2]);
      if (!toNetwork) setToNetwork(networks[4]);
      if (!selectedToken) setSelectedToken(tokens[0]);
    } catch (err) {
      console.error('Error loading bridge history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const handleBridge = async () => {
    if (!user || !fromNetwork || !toNetwork || !selectedToken || !amount || parseFloat(amount) <= 0) return;

    const bridgeAmount = parseFloat(amount);
    if (bridgeAmount > selectedToken.balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      setBridging(true);

      const { error } = await supabase
        .from('cross_chain_transfers')
        .insert({
          user_id: user.id,
          from_chain: fromNetwork.symbol,
          to_chain: toNetwork.symbol,
          token_symbol: selectedToken.symbol,
          amount: bridgeAmount,
          fee_amount: fromNetwork.fee,
          status: 'pending',
          estimated_time_minutes: 15
        });

      if (error) throw error;

      await loadBridgeHistory();
      setAmount('');

      alert('Bridge transfer initiated! Check your recent transfers below.');
    } catch (err) {
      console.error('Bridge error:', err);
      alert('Bridge transfer failed. Please try again.');
    } finally {
      setBridging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  const estimatedTime = 15;
  const totalFee = fromNetwork ? fromNetwork.fee : 0;
  const receiveAmount = amount && parseFloat(amount) > 0
    ? (parseFloat(amount) - (totalFee / 1000)).toFixed(6)
    : '0.00';

  const isBridgeValid = fromNetwork && toNetwork && selectedToken && amount &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= selectedToken.balance &&
    fromNetwork.id !== toNetwork.id;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cross-Chain Bridge</h1>
        <p className="text-gray-400">
          Transfer assets securely between different blockchains
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-400 font-medium mb-1">
              How Bridge Works
            </p>
            <p className="text-xs text-blue-400/80">
              Your tokens are locked on the source chain and equivalent tokens are minted on the destination chain.
              The process is secured by smart contracts and typically takes 10-30 minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6 space-y-4">
        <div className="bg-navy-700/50 rounded-lg p-4">
          <NetworkSelector
            label="From Network"
            selectedNetwork={fromNetwork}
            networks={networks}
            onSelect={setFromNetwork}
          />

          <div className="mt-4">
            <TokenSelector
              label="Token"
              selectedToken={selectedToken}
              tokens={tokens}
              onSelect={setSelectedToken}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-navy-800 border border-gray-600 rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {selectedToken && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Balance: {selectedToken.balance.toFixed(4)}</span>
                <button
                  onClick={() => setAmount(selectedToken.balance.toString())}
                  className="text-gold-400 hover:text-gold-300 font-medium"
                >
                  Max
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwitchNetworks}
            className="p-3 bg-navy-700 border border-gold-500/20 rounded-lg hover:border-gold-500 transition-all hover:rotate-180"
          >
            <ArrowDownUp className="w-5 h-5 text-gold-400" />
          </button>
        </div>

        <div className="bg-navy-700/50 rounded-lg p-4">
          <NetworkSelector
            label="To Network"
            selectedNetwork={toNetwork}
            networks={networks.filter(n => n.id !== fromNetwork?.id)}
            onSelect={setToNetwork}
          />

          <div className="mt-4 bg-navy-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">You will receive</span>
              <span className="text-xl font-bold text-green-400">
                {receiveAmount} {selectedToken?.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Est. time: {estimatedTime} minutes</span>
              <span>Fee: ${totalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleBridge}
          disabled={!isBridgeValid || bridging}
          className="w-full py-4 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {bridging ? 'Bridging...' : 'Bridge Tokens'}
        </button>

        {!isBridgeValid && amount && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                {parseFloat(amount) > (selectedToken?.balance || 0)
                  ? 'Insufficient balance'
                  : fromNetwork?.id === toNetwork?.id
                  ? 'Source and destination networks must be different'
                  : 'Enter a valid amount'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Bridge Details</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Bridge Fee</span>
            <span className="text-white font-medium">${totalFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Estimated Time</span>
            <span className="text-white font-medium">{estimatedTime} minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Security</span>
            <span className="text-green-400 font-medium">Multi-Sig Contracts</span>
          </div>
        </div>
      </div>

      {recentBridges.length > 0 && (
        <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-400" />
            Recent Transfers
          </h3>
          <div className="space-y-3">
            {recentBridges.map((bridge) => {
              const statusColors = {
                pending: 'text-yellow-400',
                completed: 'text-green-400',
                failed: 'text-red-400'
              };
              const statusIcons = {
                pending: Clock,
                completed: CheckCircle,
                failed: AlertTriangle
              };
              const StatusIcon = statusIcons[bridge.status as keyof typeof statusIcons] || Clock;

              return (
                <div
                  key={bridge.id}
                  className="flex items-center justify-between bg-navy-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusColors[bridge.status as keyof typeof statusColors]}`} />
                    <div>
                      <p className="text-white font-medium">
                        {bridge.amount} {bridge.token_symbol}
                      </p>
                      <p className="text-xs text-gray-400">
                        {bridge.from_chain} → {bridge.to_chain}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bridge.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium capitalize ${statusColors[bridge.status as keyof typeof statusColors]}`}>
                      {bridge.status}
                    </p>
                    {bridge.tx_hash && (
                      <button className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 mt-1">
                        <ExternalLink className="w-3 h-3" />
                        View TX
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-400 font-medium mb-1">
              Important Bridge Safety Tips
            </p>
            <ul className="text-xs text-yellow-400/80 space-y-1 list-disc list-inside">
              <li>Always verify the destination address before bridging</li>
              <li>Bridge transfers are irreversible once confirmed</li>
              <li>Large transfers may take longer to process</li>
              <li>Keep your transaction hash for tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
