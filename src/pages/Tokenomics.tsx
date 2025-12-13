import { Link } from 'react-router-dom';
import {
  Coins,
  TrendingUp,
  Shield,
  Users,
  Flame,
  Lock,
  Zap,
  DollarSign,
  PieChart,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Tokenomics() {
  const tokenDistribution = [
    { label: 'Mining Rewards', percentage: 40, color: '#F59E0B', description: 'Distributed to NFT miner owners over time' },
    { label: 'Ecosystem Fund', percentage: 20, color: '#3B82F6', description: 'Platform development and growth' },
    { label: 'Team & Advisors', percentage: 15, color: '#8B5CF6', description: '4-year vesting period' },
    { label: 'Foundation', percentage: 10, color: '#EC4899', description: 'Children\'s brain cancer research' },
    { label: 'Liquidity Pool', percentage: 10, color: '#10B981', description: 'DEX liquidity provision' },
    { label: 'Community', percentage: 5, color: '#06B6D4', description: 'Airdrops and rewards' }
  ];

  const burnMechanisms = [
    {
      icon: Flame,
      title: 'Maintenance Payments',
      description: 'All TYT used for miner maintenance is burned',
      burnRate: '100%',
      color: 'amber'
    },
    {
      icon: Zap,
      title: 'Miner Upgrades',
      description: 'TYT spent on hashrate and efficiency upgrades',
      burnRate: '100%',
      color: 'orange'
    },
    {
      icon: Users,
      title: 'Marketplace Fees',
      description: '50% of all marketplace transaction fees',
      burnRate: '50%',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Premium Features',
      description: 'Advanced analytics and VIP tier upgrades',
      burnRate: '75%',
      color: 'purple'
    }
  ];

  const utilities = [
    {
      icon: DollarSign,
      title: 'Maintenance Discounts',
      description: 'Pay maintenance fees with TYT and save 20% automatically. Additional discounts up to 18% based on VIP level.',
      benefit: 'Up to 38% total savings'
    },
    {
      icon: PieChart,
      title: 'Marketplace Currency',
      description: 'Buy and sell NFT miners exclusively with TYT. Trade freely on the secondary market.',
      benefit: 'Exclusive trading access'
    },
    {
      icon: Lock,
      title: 'Governance (veTYT)',
      description: 'Lock TYT for 1 week to 4 years and receive veTYT voting power. Influence platform decisions.',
      benefit: 'Platform governance rights'
    },
    {
      icon: Zap,
      title: 'Miner Upgrades',
      description: 'Upgrade your miners\' hashrate (TH/s) and efficiency (W/TH) using TYT tokens.',
      benefit: 'Enhanced mining performance'
    },
    {
      icon: TrendingUp,
      title: 'VIP Tier Access',
      description: 'Higher VIP levels unlock better discount curves, priority support, and exclusive features.',
      benefit: 'Premium platform benefits'
    },
    {
      icon: Users,
      title: 'Academy Access',
      description: 'Premium courses and advanced training materials available with TYT payment.',
      benefit: 'Educational content'
    }
  ];

  const vipDiscounts = [
    { level: 'Bronze', discount: '2%', color: '#CD7F32' },
    { level: 'Silver', discount: '5%', color: '#C0C0C0' },
    { level: 'Gold', discount: '9%', color: '#FFD700' },
    { level: 'Platinum', discount: '13%', color: '#E5E4E2' },
    { level: 'Diamond', discount: '18%', color: '#B9F2FF' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-medium">Deflationary Token</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                TYT Tokenomics
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A utility token designed for sustainable growth through continuous burning,
              real utility, and community governance. Built on Solana for speed and low fees.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center gap-2 group"
              >
                Start Mining with TYT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://pump.fun/8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Trade on Pump.fun
              </a>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Total Supply</div>
              <div className="text-3xl font-bold text-amber-400 mb-1">1B TYT</div>
              <div className="text-xs text-gray-500">Fixed maximum supply</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Blockchain</div>
              <div className="text-3xl font-bold text-blue-400 mb-1">Solana</div>
              <div className="text-xs text-gray-500">High-speed, low fees</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Burn Rate</div>
              <div className="text-3xl font-bold text-orange-400 mb-1">~5-10%</div>
              <div className="text-xs text-gray-500">Annual estimated burn</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="text-gray-400 text-sm mb-2">Foundation</div>
              <div className="text-3xl font-bold text-pink-400 mb-1">10%</div>
              <div className="text-xs text-gray-500">To charity research</div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Token Distribution</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Fair and transparent allocation designed for long-term sustainability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Pie Chart Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* SVG Pie Chart would go here - using grid for simplicity */}
                <div className="grid grid-cols-2 gap-4">
                  {tokenDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
                      style={{ borderLeftColor: item.color, borderLeftWidth: '4px' }}
                    >
                      <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                        {item.percentage}%
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution Details */}
            <div className="space-y-4">
              {tokenDistribution.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <div className="text-xl font-bold" style={{ color: item.color }}>
                      {item.percentage}%
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{item.label}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Burn Mechanisms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">Deflationary Mechanics</span>
            </div>

            <h2 className="text-4xl font-bold mb-4">Token Burn Mechanisms</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Multiple burn mechanisms ensure continuous supply reduction and value appreciation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {burnMechanisms.map((mechanism, index) => {
              const Icon = mechanism.icon;
              const colorClasses = {
                amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
                orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
                blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
                purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
              };

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${colorClasses[mechanism.color as keyof typeof colorClasses]} rounded-xl p-6 border hover:scale-105 transition-transform`}
                >
                  <div className="mb-4">
                    <Icon className={`w-12 h-12 text-${mechanism.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{mechanism.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{mechanism.description}</p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="font-bold text-orange-400">{mechanism.burnRate} Burned</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-orange-400">Estimated Annual Burn</h4>
                <p className="text-gray-300 mb-4">
                  Based on average platform activity, we estimate 5-10% of total supply will be burned annually.
                  As the platform grows and more miners are active, this rate may increase significantly.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-1">50M-100M</div>
                    <div className="text-sm text-gray-400">TYT burned Year 1</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-1">~500M</div>
                    <div className="text-sm text-gray-400">TYT burned 10 years</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400 mb-1">500M+</div>
                    <div className="text-sm text-gray-400">Remaining supply</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Utility */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">TYT Token Utility</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real utility across the entire ecosystem - not just speculation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilities.map((utility, index) => {
              const Icon = utility.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
                >
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{utility.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{utility.description}</p>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">{utility.benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIP Discount Curve */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">VIP Discount Curve</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Pay maintenance with TYT and save up to 38% (20% base + 18% VIP bonus)
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {vipDiscounts.map((tier, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center hover:scale-105 transition-transform"
                  style={{ borderTopColor: tier.color, borderTopWidth: '4px' }}
                >
                  <div className="text-2xl font-bold mb-2" style={{ color: tier.color }}>
                    {tier.level}
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mb-1">
                    +{tier.discount}
                  </div>
                  <div className="text-xs text-gray-400">Additional discount</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Maximum Savings Example
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Regular Price (USDT)</div>
                  <div className="text-2xl font-bold text-gray-300">$100.00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Diamond VIP with TYT</div>
                  <div className="text-2xl font-bold text-amber-400">$62.00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Savings</div>
                  <div className="text-2xl font-bold text-green-400">$38.00 (38%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Using TYT Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of miners saving money and earning rewards with TYT tokens
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/app/academy"
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
            >
              Learn More in Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
