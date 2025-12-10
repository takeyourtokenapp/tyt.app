import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, TrendingUp, Zap, Shield, Coins, BarChart3, Wallet, CheckCircle2, AlertCircle, DollarSign, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-xl">
              TYT
            </div>
            <span className="text-xl font-semibold">Take Your Token</span>
          </div>

          <nav className="hidden md:flex gap-8">
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#tokenomics" className="hover:text-amber-400 transition-colors">Tokenomics</a>
            <a href="#academy" className="hover:text-amber-400 transition-colors">Academy</a>
          </nav>

          <Link
            to="/app"
            className="hidden md:block px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all"
          >
            Launch App
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 transition-colors">How It Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 transition-colors">Features</a>
              <a href="#tokenomics" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 transition-colors">Tokenomics</a>
              <a href="#academy" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 transition-colors">Academy</a>
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="text-amber-400 font-semibold">Launch App</Link>
            </nav>
          </div>
        )}
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 bg-clip-text text-transparent">
              NFT Bitcoin Hashpower Protocol
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-semibold">
              Own Digital Miners. Earn Daily BTC.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Take Your Token is a digital multi-chain mining platform. Purchase NFT miners, receive daily BTC rewards, pay maintenance with TYT tokens and benefit from burn cycles.
            </p>
            <p className="text-sm text-gray-500 italic mb-8">
              No device mining. Cloud-based digital mining platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2"
              >
                Launch App <ChevronRight size={20} />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 border-2 border-amber-500 rounded-lg font-semibold hover:bg-amber-500/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
            {[
              { label: 'Blockchain', value: 'Multi-Chain' },
              { label: 'Token', value: 'TYT' },
              { label: 'Rewards', value: 'BTC' },
              { label: 'Status', value: 'MVP' }
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-700 hover:border-amber-500/50 transition-colors">
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xl md:text-2xl font-bold text-amber-400">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up & KYC',
                description: 'Create account and complete verification'
              },
              {
                step: '2',
                title: 'Buy NFT Miner',
                description: 'Purchase digital miner with hashrate (TH/s) and efficiency (W/TH)'
              },
              {
                step: '3',
                title: 'Earn BTC Daily',
                description: 'Receive daily BTC rewards directly to your wallet'
              },
              {
                step: '4',
                title: 'Trade & Govern',
                description: 'Trade miners on marketplace, participate in governance'
              }
            ].map((item) => (
              <div key={item.step} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:border-amber-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Dashboard',
                description: 'Track hashrate, rewards, maintenance costs, and portfolio performance'
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                title: 'Marketplace',
                description: 'Buy and sell NFT miners with transparent pricing'
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'TYT Discounts',
                description: 'Pay maintenance with TYT tokens for up to 18% discount'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Upgrades',
                description: 'Increase hashrate or improve efficiency of your miners'
              },
              {
                icon: <Wallet className="w-8 h-8" />,
                title: 'Multi-Asset Wallet',
                description: 'Custodial wallet supporting BTC, ETH, SOL, TRX, XRP, and more'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Weekly Burn',
                description: 'TYT tokens from maintenance are burned weekly'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/20"
              >
                <div className="text-amber-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tokenomics" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-amber-400">TYT</span> Token
            </h2>
            <h3 className="text-2xl font-semibold mb-4">Utility Token That Reduces Costs</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400" />
                Utility
              </h4>
              <ul className="space-y-4">
                {[
                  'Pay maintenance for NFT miners',
                  'Discounts up to 18% when paying with TYT',
                  'Marketplace transaction fees',
                  'Governance participation (veTYT)',
                  'Weekly burn cycles with public reports'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-amber-400" />
                Burn & Mint Mechanism
              </h4>
              <p className="text-gray-300 mb-6 leading-relaxed">
                All TYT tokens paid for maintenance and fees are accumulated and burned weekly. This deflationary mechanism is transparent with public on-chain events and detailed reports.
              </p>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">Coming Soon</div>
                  <div className="text-sm text-gray-400">Burn statistics will be published weekly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="academy" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-amber-400">Crypto Academia</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn about crypto, mining, NFTs, and blockchain technology through our interactive academy. Earn Owl ranks as you progress.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4 mb-12">
            {[
              { rank: 'Worker', xp: '0-99' },
              { rank: 'Academic', xp: '100-299' },
              { rank: 'Diplomat', xp: '300-699' },
              { rank: 'Peacekeeper', xp: '700-1499' },
              { rank: 'Warrior', xp: '1500+' }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 text-center">
                <div className="text-4xl mb-2">🦉</div>
                <h4 className="text-lg font-semibold mb-1">{item.rank}</h4>
                <p className="text-sm text-gray-400">{item.xp} XP</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/app/academy"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-block"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-gray-800 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="border-t border-gray-800 pt-8">
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-500 mb-2">Legal Disclosure</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Take Your Token (TYT) is a digital mining platform. Not investment advice, not a security, not a deposit. Review risks, terms, and your jurisdiction requirements. Rewards and costs are variable. No device mining is performed. Availability depends on region.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400">
              <p className="text-sm">© Take Your Token (TYT), 2025. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
