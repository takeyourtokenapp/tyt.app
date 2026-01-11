import { TrendingUp, Info, AlertTriangle } from 'lucide-react';

interface SwapPreviewProps {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  priceImpact: number;
  fee: number;
  slippage: number;
  minReceived: number;
}

export default function SwapPreview({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  exchangeRate,
  priceImpact,
  fee,
  slippage,
  minReceived
}: SwapPreviewProps) {
  const isPriceImpactHigh = priceImpact > 5;
  const isPriceImpactWarning = priceImpact > 1;

  return (
    <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gold-400" />
        Swap Details
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Exchange Rate</span>
          <span className="text-white font-medium">
            1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Price Impact</span>
          <span className={`font-medium ${
            isPriceImpactHigh ? 'text-red-400' :
            isPriceImpactWarning ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {priceImpact.toFixed(2)}%
          </span>
        </div>

        {isPriceImpactHigh && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-medium">High Price Impact</p>
                <p className="text-xs text-red-400/80 mt-1">
                  This swap will significantly affect the price. Consider splitting into smaller trades.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Platform Fee</span>
            <Info className="w-3 h-3 text-gray-500" />
          </div>
          <span className="text-white font-medium">
            {fee.toFixed(4)} {fromToken}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Max Slippage</span>
          <span className="text-white font-medium">{slippage}%</span>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Minimum Received</span>
            <span className="text-white font-bold">
              {minReceived.toFixed(6)} {toToken}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-400">
            Output is estimated. You will receive at least {minReceived.toFixed(6)} {toToken} or the transaction will revert.
          </p>
        </div>
      </div>
    </div>
  );
}
