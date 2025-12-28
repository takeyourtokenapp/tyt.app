import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Zap, DollarSign } from 'lucide-react';

interface IncomeCalculatorProps {
  defaultTH?: number;
  defaultEfficiency?: number;
  defaultBTCPrice?: number;
  defaultKwhPrice?: number;
}

export default function IncomeCalculator({
  defaultTH = 100,
  defaultEfficiency = 30,
  defaultBTCPrice = 95000,
  defaultKwhPrice = 0.08
}: IncomeCalculatorProps) {
  const [hashrateTH, setHashrateTH] = useState(defaultTH);
  const [efficiency, setEfficiency] = useState(defaultEfficiency);
  const [btcPrice, setBtcPrice] = useState(defaultBTCPrice);
  const [kwhPrice, setKwhPrice] = useState(defaultKwhPrice);

  const [results, setResults] = useState({
    dailyBTC: 0,
    weeklyBTC: 0,
    monthlyBTC: 0,
    dailyUSD: 0,
    weeklyUSD: 0,
    monthlyUSD: 0,
    dailyElectricity: 0,
    dailyService: 0,
    dailyNet: 0
  });

  useEffect(() => {
    calculateIncome();
  }, [hashrateTH, efficiency, btcPrice, kwhPrice]);

  const calculateIncome = () => {
    const networkHashrate = 600_000_000;
    const blockReward = 3.125;
    const blocksPerDay = 144;
    const dailyBTCPool = blockReward * blocksPerDay;

    const userShare = (hashrateTH * 1_000_000) / networkHashrate;
    const grossDailyBTC = dailyBTCPool * userShare;

    const powerConsumptionKW = (hashrateTH * efficiency) / 1000;
    const dailyKWh = powerConsumptionKW * 24;
    const dailyElectricity = dailyKWh * kwhPrice;

    const dailyService = hashrateTH * 0.02;

    const totalDailyCost = dailyElectricity + dailyService;
    const dailyCostBTC = totalDailyCost / btcPrice;

    const netDailyBTC = Math.max(0, grossDailyBTC - dailyCostBTC);

    setResults({
      dailyBTC: netDailyBTC,
      weeklyBTC: netDailyBTC * 7,
      monthlyBTC: netDailyBTC * 30,
      dailyUSD: netDailyBTC * btcPrice,
      weeklyUSD: netDailyBTC * 7 * btcPrice,
      monthlyUSD: netDailyBTC * 30 * btcPrice,
      dailyElectricity,
      dailyService,
      dailyNet: netDailyBTC * btcPrice
    });
  };

  return (
    <div className="tyt-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="tyt-icon-container">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="tyt-heading-3">Income Calculator</h2>
          <p className="tyt-text-secondary text-sm">Estimate your daily, weekly & monthly earnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium tyt-text-secondary mb-3">
              Hashrate: <span className="tyt-text-accent font-bold">{hashrateTH} TH/s</span>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={hashrateTH}
              onChange={(e) => setHashrateTH(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs tyt-text-muted mt-1">
              <span>10 TH/s</span>
              <span>500 TH/s</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium tyt-text-secondary mb-3">
              Efficiency: <span className="tyt-text-accent font-bold">{efficiency} W/TH</span>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs tyt-text-muted mt-1">
              <span>20 W/TH (Best)</span>
              <span>80 W/TH</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium tyt-text-secondary mb-3">
              BTC Price: <span className="tyt-text-accent font-bold">${btcPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={btcPrice}
              onChange={(e) => setBtcPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs tyt-text-muted mt-1">
              <span>$30K</span>
              <span>$150K</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium tyt-text-secondary mb-3">
              Electricity Cost: <span className="tyt-text-accent font-bold">${kwhPrice.toFixed(3)}/kWh</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.20"
              step="0.01"
              value={kwhPrice}
              onChange={(e) => setKwhPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs tyt-text-muted mt-1">
              <span>$0.05/kWh</span>
              <span>$0.20/kWh</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium tyt-text-secondary">Daily Net Income</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {results.dailyBTC.toFixed(8)} BTC
              </div>
              <div className="text-lg tyt-text-secondary">
                ≈ ${results.dailyUSD.toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="text-xs tyt-text-tertiary mb-1">Weekly</div>
              <div className="text-lg font-bold tyt-text-accent">
                {results.weeklyBTC.toFixed(6)} BTC
              </div>
              <div className="text-sm tyt-text-tertiary">
                ${results.weeklyUSD.toFixed(2)}
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="text-xs tyt-text-tertiary mb-1">Monthly</div>
              <div className="text-lg font-bold tyt-text-accent">
                {results.monthlyBTC.toFixed(6)} BTC
              </div>
              <div className="text-sm tyt-text-tertiary">
                ${results.monthlyUSD.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="tyt-card-flat p-4">
            <div className="text-sm font-semibold tyt-text-secondary mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Daily Cost Breakdown
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="tyt-text-tertiary flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Electricity
                </span>
                <span className="font-semibold tyt-text-primary">
                  ${results.dailyElectricity.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="tyt-text-tertiary">Service Fee</span>
                <span className="font-semibold tyt-text-primary">
                  ${results.dailyService.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t tyt-divider flex justify-between">
                <span className="tyt-text-secondary font-semibold">Total Cost</span>
                <span className="font-bold tyt-text-error">
                  ${(results.dailyElectricity + results.dailyService).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="text-xs tyt-text-accent font-semibold mb-2">💡 Pro Tip</div>
            <div className="text-sm tyt-text-secondary">
              Pay maintenance with TYT tokens for up to 25% discount! VIP members get even better rates.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t tyt-divider">
        <div className="text-xs tyt-text-muted text-center">
          Calculations based on current network hashrate (~600 EH/s) and block reward (3.125 BTC).
          Actual earnings may vary based on network difficulty and luck.
        </div>
      </div>
    </div>
  );
}
