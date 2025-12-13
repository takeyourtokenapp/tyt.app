import { Lock } from 'lucide-react';
import type { CustodialWallet } from '../../types/database';

interface AssetCardProps {
  wallet: CustodialWallet;
  usdPrice: number;
  onSelect: () => void;
}

export default function AssetCard({ wallet, usdPrice, onSelect }: AssetCardProps) {
  const usdValue = parseFloat(wallet.balance) * usdPrice;

  return (
    <div
      onClick={onSelect}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gold-500/50 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-amber-500/20 flex items-center justify-center text-xl font-bold text-gold-400">
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
          <div className="text-xs text-gold-400 mt-2 flex items-center gap-1">
            <Lock size={12} />
            Locked: {parseFloat(wallet.locked_balance).toFixed(wallet.asset === 'BTC' ? 8 : 2)}
          </div>
        )}
      </div>
    </div>
  );
}
