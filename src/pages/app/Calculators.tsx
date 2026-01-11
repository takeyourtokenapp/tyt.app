import { useState } from 'react';
import { Calculator, TrendingUp, Award, Coins, Info } from 'lucide-react';
import MiningROICalculator from '../../components/calculators/MiningROICalculator';
import VIPBenefitsCalculator from '../../components/calculators/VIPBenefitsCalculator';

type CalculatorTab = 'roi' | 'vip' | 'staking' | 'compound';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('roi');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Advanced Calculators</h1>
        <p className="text-gray-400">
          Powerful tools to calculate mining profitability, VIP benefits, and investment returns
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-400 font-medium mb-1">
              Make Informed Decisions
            </p>
            <p className="text-xs text-blue-400/80">
              Use these calculators to project your earnings, optimize your mining strategy,
              and understand the benefits of different VIP tiers. All calculations are based on current market conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('roi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'roi'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 shadow-lg'
                : 'bg-navy-700 text-white hover:bg-navy-600'
            }`}
          >
            <Calculator className="w-5 h-5" />
            Mining ROI
          </button>

          <button
            onClick={() => setActiveTab('vip')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'vip'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 shadow-lg'
                : 'bg-navy-700 text-white hover:bg-navy-600'
            }`}
          >
            <Award className="w-5 h-5" />
            VIP Benefits
          </button>

          <button
            onClick={() => setActiveTab('staking')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'staking'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 shadow-lg'
                : 'bg-navy-700 text-white hover:bg-navy-600'
            }`}
          >
            <Coins className="w-5 h-5" />
            Staking Returns
          </button>

          <button
            onClick={() => setActiveTab('compound')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'compound'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 shadow-lg'
                : 'bg-navy-700 text-white hover:bg-navy-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Compound Interest
          </button>
        </div>
      </div>

      <div className="transition-all">
        {activeTab === 'roi' && <MiningROICalculator />}
        {activeTab === 'vip' && <VIPBenefitsCalculator />}
        {activeTab === 'staking' && <StakingCalculator />}
        {activeTab === 'compound' && <CompoundCalculator />}
      </div>
    </div>
  );
}

function StakingCalculator() {
  const [stakingAmount, setStakingAmount] = useState('10000');
  const [lockPeriod, setLockPeriod] = useState('365');
  const [aprRate, setAprRate] = useState('12');

  const calculateStaking = () => {
    const amount = parseFloat(stakingAmount) || 0;
    const days = parseFloat(lockPeriod) || 0;
    const apr = parseFloat(aprRate) || 0;

    const dailyRate = apr / 365 / 100;
    const totalRewards = amount * dailyRate * days;
    const finalAmount = amount + totalRewards;
    const effectiveAPY = ((finalAmount / amount - 1) * (365 / days)) * 100;

    const votingPower = amount * (1 + (days / 1460));

    return {
      totalRewards: totalRewards.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      dailyRewards: (totalRewards / days).toFixed(2),
      monthlyRewards: (totalRewards / (days / 30)).toFixed(2),
      effectiveAPY: effectiveAPY.toFixed(2),
      votingPower: votingPower.toFixed(2)
    };
  };

  const results = calculateStaking();

  return (
    <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Staking Returns Calculator</h3>
          <p className="text-sm text-gray-400">Calculate your veTYT staking rewards</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Staking Amount (TYT)
          </label>
          <input
            type="number"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lock Period (days)
          </label>
          <input
            type="number"
            value={lockPeriod}
            onChange={(e) => setLockPeriod(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="1"
          />
          <div className="flex gap-2 mt-2">
            {[7, 30, 90, 365, 1460].map((days) => (
              <button
                key={days}
                onClick={() => setLockPeriod(days.toString())}
                className="flex-1 px-2 py-1 bg-navy-600 hover:bg-navy-500 text-xs rounded transition-colors"
              >
                {days === 1460 ? '4Y' : days === 365 ? '1Y' : days === 90 ? '3M' : days === 30 ? '1M' : '1W'}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            APR Rate (%)
          </label>
          <input
            type="number"
            value={aprRate}
            onChange={(e) => setAprRate(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="0.1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border border-purple-500/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Total Rewards</span>
            <span className="text-2xl font-bold text-purple-400">{results.totalRewards} TYT</span>
          </div>
          <div className="text-xs text-gray-400">
            Final amount: {results.finalAmount} TYT
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Daily Rewards</div>
            <div className="text-xl font-bold text-green-400">{results.dailyRewards} TYT</div>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Monthly Rewards</div>
            <div className="text-xl font-bold text-blue-400">{results.monthlyRewards} TYT</div>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Effective APY</div>
            <div className="text-xl font-bold text-gold-400">{results.effectiveAPY}%</div>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Voting Power</div>
            <div className="text-xl font-bold text-purple-400">{results.votingPower}</div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-400">
              <p className="font-medium mb-1">Lock Period Bonus</p>
              <p className="text-xs text-blue-400/80">
                Longer lock periods increase your voting power multiplier. Maximum 4x bonus for 4-year locks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompoundCalculator() {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [annualReturn, setAnnualReturn] = useState('15');
  const [years, setYears] = useState('5');
  const [compoundFrequency, setCompoundFrequency] = useState('daily');

  const calculateCompound = () => {
    const principal = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 || 0;
    const timeYears = parseFloat(years) || 0;

    const frequencies: Record<string, number> = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      quarterly: 4,
      yearly: 1
    };

    const n = frequencies[compoundFrequency];
    const totalMonths = timeYears * 12;

    let futureValue = principal;
    for (let month = 0; month < totalMonths; month++) {
      futureValue = futureValue * Math.pow(1 + rate / n, n / 12) + monthly;
    }

    const totalContributions = principal + (monthly * totalMonths);
    const totalInterest = futureValue - totalContributions;
    const effectiveReturn = ((futureValue / totalContributions - 1) * 100);

    return {
      futureValue: futureValue.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      effectiveReturn: effectiveReturn.toFixed(2)
    };
  };

  const results = calculateCompound();

  return (
    <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Compound Interest Calculator</h3>
          <p className="text-sm text-gray-400">Project long-term investment growth</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Initial Investment ($)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Annual Return (%)
          </label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Period (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2 bg-navy-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            step="1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Compound Frequency
          </label>
          <div className="grid grid-cols-5 gap-2">
            {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setCompoundFrequency(freq)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  compoundFrequency === freq
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-navy-700 text-white hover:bg-navy-600'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Future Value</span>
            <span className="text-3xl font-bold text-green-400">${results.futureValue}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Interest Earned</span>
            <span className="font-bold text-green-300">${results.totalInterest}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Total Contributions</div>
            <div className="text-xl font-bold text-blue-400">${results.totalContributions}</div>
          </div>

          <div className="bg-navy-700/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Effective Return</div>
            <div className="text-xl font-bold text-gold-400">{results.effectiveReturn}%</div>
          </div>
        </div>

        <div className="bg-navy-700/50 rounded-lg p-4">
          <h5 className="font-semibold mb-3 text-white">Breakdown</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Initial Investment</span>
              <span className="font-medium text-white">${initialAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Monthly Contributions</span>
              <span className="font-medium text-white">
                ${(parseFloat(monthlyContribution) * parseFloat(years) * 12).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interest Earned</span>
              <span className="font-medium text-green-400">${results.totalInterest}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-600">
              <span className="text-white font-semibold">Final Amount</span>
              <span className="font-bold text-green-400">${results.futureValue}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-400">
              <p className="font-medium mb-1">The Power of Compounding</p>
              <p className="text-xs text-yellow-400/80">
                More frequent compounding leads to higher returns. Daily compounding maximizes growth potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
