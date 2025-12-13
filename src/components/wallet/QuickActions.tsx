import { CreditCard, ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

interface QuickActionsProps {
  onDepositCard: () => void;
  onDepositCrypto: () => void;
  onWithdraw: () => void;
  onSwap: () => void;
}

export default function QuickActions({
  onDepositCard,
  onDepositCrypto,
  onWithdraw,
  onSwap
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button
        onClick={onDepositCard}
        className="group p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
            <CreditCard className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg mb-1">Deposit via Card</div>
            <div className="text-sm text-gray-400">Instant deposit (Stripe)</div>
          </div>
        </div>
      </button>

      <button
        onClick={onDepositCrypto}
        className="group p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
            <ArrowDownLeft className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg mb-1">Deposit Crypto</div>
            <div className="text-sm text-gray-400">Add funds via blockchain</div>
          </div>
        </div>
      </button>

      <button
        onClick={onWithdraw}
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
        onClick={onSwap}
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
  );
}
