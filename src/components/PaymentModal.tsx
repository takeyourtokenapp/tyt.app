import { useState, useEffect } from 'react';
import { X, CreditCard, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeRampPurchase, getSupportedAssets, calculatePurchaseFees } from '@/utils/paymentProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultAsset?: string;
  defaultAmount?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultAsset = 'MATIC_POLYGON',
  defaultAmount = 100
}: PaymentModalProps) {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);
  const [amount, setAmount] = useState(defaultAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assets = getSupportedAssets();
  const selectedAssetInfo = assets.find(a => a.symbol === selectedAsset);
  const fees = calculatePurchaseFees(amount);

  const handlePurchase = async () => {
    if (!user || !user.wallet_address) {
      setError('Please connect your wallet first');
      return;
    }

    if (amount < (selectedAssetInfo?.minAmount || 20)) {
      setError(`Minimum amount is $${selectedAssetInfo?.minAmount}`);
      return;
    }

    if (amount > (selectedAssetInfo?.maxAmount || 10000)) {
      setError(`Maximum amount is $${selectedAssetInfo?.maxAmount}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await initializeRampPurchase({
        userAddress: user.wallet_address,
        assetSymbol: selectedAsset,
        amount: amount,
        userId: user.id
      });

      // Ramp widget will handle the rest
      // onSuccess will be called from the widget callback

    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Buy Crypto</h2>
            <p className="text-gray-400 text-sm">Pay with credit card or bank transfer</p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Asset selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Asset
          </label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            {assets.map(asset => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.name} ({asset.network})
              </option>
            ))}
          </select>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              min={selectedAssetInfo?.minAmount}
              max={selectedAssetInfo?.maxAmount}
              step="10"
              className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="100"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Min: ${selectedAssetInfo?.minAmount} • Max: ${selectedAssetInfo?.maxAmount}
          </p>
        </div>

        {/* Fee breakdown */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount</span>
            <span className="text-white">${fees.amountUSD.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Ramp Fee (2.5%)</span>
            <span className="text-white">${fees.rampFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white">${fees.networkFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 flex justify-between">
            <span className="text-white font-medium">Total</span>
            <span className="text-yellow-500 font-bold">${fees.totalCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Info note */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500 rounded-lg flex gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-400 text-sm">
            Powered by Ramp Network. Your payment is secure and processed instantly.
            Crypto will be sent directly to your wallet.
          </p>
        </div>

        {/* Development notice */}
        {import.meta.env.DEV && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
            <p className="text-yellow-500 text-sm">
              Development mode: Ramp widget not loaded. Set VITE_RAMP_HOST_API_KEY in production.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading || !user?.wallet_address}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Opening...' : `Buy ${selectedAssetInfo?.name.split(' ')[1] || 'Crypto'}`}
          </button>
        </div>

        {/* Supported methods */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Supports: Credit/Debit Cards, Bank Transfer, Apple Pay, Google Pay
          </p>
        </div>
      </div>
    </div>
  );
}
