import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Zap, Calendar } from 'lucide-react';

export default function MiningROICalculator() {
  const [hashrate, setHashrate] = useState('100');
  const [efficiency, setEfficiency] = useState('25');
  const [electricityCost, setElectricityCost] = useState('0.10');
  const [btcPrice, setBtcPrice] = useState('95000');
  const [initialInvestment, setInitialInvestment] = useState('5000');

  const calculateResults = () => {
    const hashrateNum = parseFloat(hashrate) || 0;
    const efficiencyNum = parseFloat(efficiency) || 0;
    const electricityCostNum = parseFloat(electricityCost) || 0;
    const btcPriceNum = parseFloat(btcPrice) || 0;
    const investmentNum = parseFloat(initialInvestment) || 0;

    const networkHashrate = 600000000;
    const blockReward = 3.125;
    const blocksPerDay = 144;

    const dailyBTC = (hashrateNum / networkHashrate) * blockReward * blocksPerDay;
    const dailyRevenue = dailyBTC * btcPriceNum;

    const powerConsumption = (hashrateNum * efficiencyNum) / 1000;
    const dailyElectricityCost = powerConsumption * 24 * electricityCostNum;

    const maintenanceFee = dailyRevenue * 0.15;

    const dailyProfit = dailyRevenue - dailyElectricityCost - maintenanceFee;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    const breakEvenDays = investmentNum / dailyProfit;
    const roi1Year = ((yearlyProfit / investmentNum) * 100);

    return {
      dailyBTC: dailyBTC.toFixed(8),
      dailyRevenue: dailyRevenue.toFixed(2),
      dailyElectricity: dailyElectricityCost.toFixed(2),
      maintenanceFee: maintenanceFee.toFixed(2),
      dailyProfit: dailyProfit.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(2),
      yearlyProfit: yearlyProfit.toFixed(2),
      breakEvenDays: breakEvenDays.toFixed(0),
      roi1Year: roi1Year.toFixed(2)
    };
  };

  const results = calculateResults();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Mining ROI Calculator</h3>
          <p className="text-sm text-gray-400">Calculate your mining profitability</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Hashrate (TH/s)
          </label>
          <input
            type="number"
            value={hashrate}
            onChange={(e) => setHashrate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Efficiency (W/TH)
          </label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Electricity Cost ($/kWh)
          </label>
          <input
            type="number"
            value={electricityCost}
            onChange={(e) => setElectricityCost(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            BTC Price ($)
          </label>
          <input
            type="number"
            value={btcPrice}
            onChange={(e) => setBtcPrice(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
            step="1000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Initial Investment ($)
          </label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
            step="100"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-lg mb-4">Results</h4>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg p-4 border border-amber-500/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Daily Profit
            </span>
            <span className="text-2xl font-bold text-amber-400">${results.dailyProfit}</span>
          </div>
          <div className="text-xs text-gray-400">
            {results.dailyBTC} BTC/day
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              Monthly Profit
            </div>
            <div className="text-xl font-bold text-green-400">${results.monthlyProfit}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              Yearly Profit
            </div>
            <div className="text-xl font-bold text-blue-400">${results.yearlyProfit}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              Break Even
            </div>
            <div className="text-xl font-bold text-purple-400">{results.breakEvenDays} days</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              1-Year ROI
            </div>
            <div className="text-xl font-bold text-amber-400">{results.roi1Year}%</div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h5 className="font-semibold mb-3">Cost Breakdown</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Revenue</span>
              <span className="font-semibold text-green-400">${results.dailyRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Electricity Cost</span>
              <span className="font-semibold text-red-400">-${results.dailyElectricity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Maintenance Fee (15%)</span>
              <span className="font-semibold text-red-400">-${results.maintenanceFee}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-700">
              <span className="text-gray-300 font-semibold">Net Daily Profit</span>
              <span className="font-bold text-amber-400">${results.dailyProfit}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
          <div className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-gray-300">
              <div className="font-semibold text-blue-400 mb-1">Pro Tip</div>
              Pay maintenance in TYT to get up to 20% discount, significantly increasing your profitability!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
