import { TrendingUp, Zap, DollarSign, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface UpgradeTier {
  id: string;
  tier_name: string;
  power_increase_th: number;
  efficiency_improvement_w_th: number;
  cost_tyt: number;
  cost_usd: number;
  description: string;
}

interface MinerUpgradePanelProps {
  currentPower: number;
  currentEfficiency: number;
  availableUpgrades: UpgradeTier[];
  onUpgrade: (tierId: string) => void;
}

export default function MinerUpgradePanel({
  currentPower,
  currentEfficiency,
  availableUpgrades,
  onUpgrade
}: MinerUpgradePanelProps) {
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);

  if (availableUpgrades.length === 0) {
    return (
      <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Available Upgrades</h3>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No upgrades available at this time</p>
        </div>
      </div>
    );
  }

  const selected = availableUpgrades.find(u => u.id === selectedUpgrade);

  return (
    <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Available Upgrades</h3>

      <div className="space-y-3 mb-6">
        {availableUpgrades.map((upgrade) => {
          const newPower = currentPower + upgrade.power_increase_th;
          const newEfficiency = currentEfficiency - upgrade.efficiency_improvement_w_th;

          return (
            <div
              key={upgrade.id}
              onClick={() => setSelectedUpgrade(upgrade.id)}
              className={`bg-navy-700/50 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedUpgrade === upgrade.id
                  ? 'border-gold-500 shadow-lg shadow-gold-500/20'
                  : 'border-gray-700 hover:border-gold-500/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-bold">{upgrade.tier_name}</h4>
                  <p className="text-sm text-gray-400">{upgrade.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gold-400 font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>{upgrade.cost_tyt} TYT</span>
                  </div>
                  <p className="text-xs text-gray-400">${upgrade.cost_usd}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Zap className="w-3 h-3" />
                    <span>Hashrate</span>
                  </div>
                  <p className="text-white font-bold">
                    {currentPower} → <span className="text-green-400">{newPower} TH/s</span>
                  </p>
                  <p className="text-xs text-green-400">+{upgrade.power_increase_th} TH/s</p>
                </div>

                <div className="bg-navy-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Efficiency</span>
                  </div>
                  <p className="text-white font-bold">
                    {currentEfficiency} → <span className="text-green-400">{newEfficiency} W/TH</span>
                  </p>
                  <p className="text-xs text-green-400">-{upgrade.efficiency_improvement_w_th} W/TH</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-medium mb-1">
                Smart Contract Integration Required
              </p>
              <p className="text-xs text-yellow-400/80">
                Upgrade functionality will be available after smart contract deployment
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => selected && onUpgrade(selected.id)}
        disabled={!selected}
        className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-xl font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selected ? `Upgrade to ${selected.tier_name}` : 'Select an upgrade'}
      </button>
    </div>
  );
}
