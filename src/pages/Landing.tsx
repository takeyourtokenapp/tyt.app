import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, TrendingUp, Zap, Shield, Coins, BarChart3, Wallet, CheckCircle2, AlertCircle, DollarSign, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import IncomeCalculator from '../components/IncomeCalculator';

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
    <div className="min-h-screen bg-gradient-to-b from-owl-dark via-owl-navy to-black text-white">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-owl-dark/95 backdrop-blur-md shadow-lg shadow-gold-glow' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/6d629383-acba-4396-8f01-4715f914aada.png" alt="TYT Logo" className="w-12 h-12" />
            <div>
              <span className="text-xl font-bold bg-owl-gradient bg-clip-text text-transparent">Take Your Token</span>
              <div className="text-xs text-gold-500">Owl Warrior Ecosystem</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-8">
            <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How It Works</a>
            <a href="#calculator" className="hover:text-gold-400 transition-colors">Calculator</a>
            <a href="#features" className="hover:text-gold-400 transition-colors">Features</a>
            <a href="#tokenomics" className="hover:text-gold-400 transition-colors">Tokenomics</a>
            <a href="#academy" className="hover:text-gold-400 transition-colors">Academy</a>
            <a href="#foundation" className="hover:text-neon-cyan transition-colors">Foundation</a>
          </nav>

          <Link
            to="/app"
            className="hidden md:block px-6 py-2 bg-owl-gradient rounded-lg font-semibold hover:shadow-gold-glow transition-all"
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
          <div className="md:hidden bg-owl-dark border-t border-gold-800">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-400 transition-colors">How It Works</a>
              <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-400 transition-colors">Calculator</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-400 transition-colors">Features</a>
              <a href="#tokenomics" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-400 transition-colors">Tokenomics</a>
              <a href="#academy" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-400 transition-colors">Academy</a>
              <a href="#foundation" onClick={() => setMobileMenuOpen(false)} className="hover:text-neon-cyan transition-colors">Foundation</a>
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="text-gold-400 font-semibold">Launch App</Link>
            </nav>
          </div>
        )}
      </header>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-shield-gradient opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <img src="/6d629383-acba-4396-8f01-4715f914aada.png" alt="TYT Owl Warrior" className="w-32 h-32 drop-shadow-[0_0_30px_rgba(210,164,76,0.6)]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-owl-gradient bg-clip-text text-transparent drop-shadow-lg">
              NFT Bitcoin Hashpower Protocol
            </h1>
            <p className="text-2xl md:text-3xl text-gold-200 mb-4 font-semibold">
              Join the Owl Warrior Ecosystem. Earn Daily BTC.
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
              Take Your Token is a digital multi-chain mining platform. Purchase NFT miners, receive daily rewards in BTC, ETH, XRP, SOL, TRON, TON and other Layer 1, 2, 3 tokens.
            </p>
            <p className="text-sm text-gold-400 italic mb-8">
              No device mining. Cloud-based digital mining powered by the Owl Warrior shield.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app"
                className="px-8 py-4 bg-owl-gradient rounded-lg font-semibold hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Launch App <Shield className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 border-2 border-gold-500 rounded-lg font-semibold hover:bg-gold-500/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
            {[
              { label: 'Blockchain', value: 'Multi-Chain', icon: '⚡' },
              { label: 'Token', value: 'TYT', icon: '🦉' },
              { label: 'Rewards', value: 'BTC + More', icon: '🛡️' },
              { label: 'Status', value: 'MVP Live', icon: '⚔️' }
            ].map((stat) => (
              <div key={stat.label} className="bg-owl-navy/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gold-700 hover:border-gold-500 hover:shadow-gold-glow transition-all">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xl md:text-2xl font-bold text-gold-400">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-owl-navy/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-owl-gradient bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the Owl Warrior ranks in 4 simple steps
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                icon: '🦉',
                title: 'Sign Up & KYC',
                description: 'Create account and complete verification to become an Owl Worker'
              },
              {
                step: '2',
                icon: '⚔️',
                title: 'Buy NFT Miner',
                description: 'Purchase digital miner with hashrate (TH/s) and efficiency (W/TH)'
              },
              {
                step: '3',
                icon: '💰',
                title: 'Earn Rewards',
                description: 'Receive daily BTC, ETH, SOL, XRP, and more to your wallet'
              },
              {
                step: '4',
                icon: '🛡️',
                title: 'Trade & Govern',
                description: 'Trade miners on marketplace, participate in governance'
              }
            ].map((item) => (
              <div key={item.step} className="bg-gradient-to-br from-owl-navy to-owl-slate rounded-xl p-8 border border-gold-700 hover:border-gold-500 hover:shadow-gold-glow transition-all group">
                <div className="w-12 h-12 bg-owl-gradient rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-gold-glow group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gold-300">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-owl-gradient bg-clip-text text-transparent">
              Calculate Your Earnings
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how much you can earn with TYT NFT miners. Adjust parameters to match your strategy.
            </p>
          </div>
          <IncomeCalculator />
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-owl-navy/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-owl-gradient bg-clip-text text-transparent">
            Owl Warrior Arsenal
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Powerful tools for the digital mining ecosystem
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Command Center',
                description: 'Track hashrate, rewards, maintenance costs, and portfolio performance',
                badge: '🛡️'
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                title: 'Marketplace',
                description: 'Buy and sell NFT miners with transparent pricing',
                badge: '⚔️'
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'TYT Discounts',
                description: 'Pay maintenance with TYT tokens for up to 18% discount',
                badge: '💎'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Miner Upgrades',
                description: 'Increase hashrate or improve efficiency of your miners',
                badge: '⚡'
              },
              {
                icon: <Wallet className="w-8 h-8" />,
                title: 'Multi-Chain Vault',
                description: 'Custodial wallet supporting BTC, ETH, SOL, TRX, TON, XRP, and more',
                badge: '🏦'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Weekly Burn Ritual',
                description: 'TYT tokens from maintenance are burned weekly in sacred ceremony',
                badge: '🔥'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-owl-navy to-owl-slate rounded-xl p-6 border border-gold-700 hover:border-gold-500 hover:shadow-gold-glow transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gold-400">{feature.icon}</div>
                  <div className="text-2xl">{feature.badge}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gold-300">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tokenomics" className="py-20 px-4 bg-owl-navy/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-owl-gradient bg-clip-text text-transparent">TYT</span> Token
            </h2>
            <h3 className="text-2xl font-semibold mb-4 text-gold-200">Deflationary Utility Token</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built on Solana for high performance and low fees
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-owl-navy to-owl-slate rounded-xl p-8 border border-gold-700 hover:shadow-gold-glow transition-all">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Coins className="w-6 h-6 text-gold-400" />
                <span className="text-gold-300">Utility Powers</span>
              </h4>
              <ul className="space-y-4">
                {[
                  'Pay maintenance for NFT miners',
                  'Discounts up to 18% when paying with TYT',
                  'Marketplace transaction fees',
                  'Governance participation (veTYT)',
                  'Weekly burn cycles with public reports',
                  'Owl rank progression & rewards'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-owl-navy to-owl-slate rounded-xl p-8 border border-gold-700 hover:shadow-gold-glow transition-all">
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-gold-400" />
                <span className="text-gold-300">Burn Mechanism</span>
              </h4>
              <p className="text-gray-300 mb-6 leading-relaxed">
                All TYT tokens paid for maintenance and fees are accumulated and burned weekly in the sacred Owl Warrior ritual. This deflationary mechanism is transparent with public on-chain events.
              </p>
              <div className="bg-gold-900/20 border border-gold-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-400 mb-2">🔥 Weekly Burns</div>
                  <div className="text-sm text-gray-400">Public reports & on-chain verification</div>
                  <a href="https://pump.fun/APadkPpjonaLBpLYDzKB6753QQU3s8VZhEtkvLgrpump" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-4 py-2 bg-owl-gradient rounded-lg text-sm font-semibold hover:shadow-gold-glow transition-all">
                    View on Pump.fun
                  </a>
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
              <span className="bg-owl-gradient bg-clip-text text-transparent">Digital-Interactive-Technology-Blockchain</span>
            </h2>
            <h3 className="text-2xl font-semibold mb-4 text-gold-200">Crypto Academia</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master crypto, mining, NFTs, and blockchain technology through our interactive academy. Rise through the Owl Warrior ranks as you learn.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { rank: 'Worker', xp: '0-99', icon: '🦉', color: 'from-gray-600 to-gray-700' },
              { rank: 'Academic', xp: '100-299', icon: '📚', color: 'from-blue-600 to-blue-700' },
              { rank: 'Diplomat', xp: '300-699', icon: '🤝', color: 'from-green-600 to-green-700' },
              { rank: 'Peacekeeper', xp: '700-1499', icon: '🛡️', color: 'from-purple-600 to-purple-700' },
              { rank: 'Warrior', xp: '1500+', icon: '⚔️', color: 'from-gold-600 to-gold-700' }
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.color} rounded-xl p-6 border border-gold-700 hover:border-gold-500 hover:shadow-gold-glow transition-all text-center group`}>
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-1 text-white">{item.rank}</h4>
                <p className="text-xs text-gray-200">{item.xp} XP</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/app/academy"
              className="px-8 py-3 bg-owl-gradient rounded-lg font-semibold hover:shadow-gold-glow transition-all inline-block"
            >
              Begin Your Journey
            </Link>
          </div>
        </div>
      </section>

      <section id="foundation" className="py-20 px-4 bg-gradient-to-b from-owl-navy/50 to-neon-cyan/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-gold-500 flex items-center justify-center text-4xl shadow-neon-cyan">
                🎗️
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-cyan to-gold-400 bg-clip-text text-transparent">TYT Foundation</span>
            </h2>
            <h3 className="text-2xl font-semibold mb-4 text-gold-200">Pediatric Brain Tumor Research & Care</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              A transparent, crypto-native fund dedicated to childhood brain tumor research, early detection, treatment access, and family support.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The Owl-Knight Shield with inverted sword subtly forms the gold childhood cancer awareness ribbon, symbolizing our commitment to protecting and healing children.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '🔬',
                title: 'Research Grants',
                description: 'Funding breakthrough research in pediatric neuro-oncology, imaging, and genomics'
              },
              {
                icon: '❤️',
                title: 'Family Support',
                description: 'Micro-grants for travel, housing, and rehabilitation for affected families'
              },
              {
                icon: '📊',
                title: 'Full Transparency',
                description: 'On-chain proof-of-use, public reports, and impact metrics'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-owl-navy to-owl-slate rounded-xl p-6 border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-neon-cyan transition-all">
                <div className="text-5xl mb-4 text-center">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-3 text-gold-300 text-center">{item.title}</h4>
                <p className="text-gray-400 text-center">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/app/foundation"
              className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-gold-500 text-owl-dark rounded-lg font-semibold hover:shadow-neon-cyan transition-all inline-block"
            >
              Learn More About The Foundation
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-gold-800 bg-owl-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <img src="/6d629383-acba-4396-8f01-4715f914aada.png" alt="TYT Logo" className="w-16 h-16" />
                <div>
                  <div className="text-xl font-bold bg-owl-gradient bg-clip-text text-transparent">Take Your Token</div>
                  <div className="text-sm text-gray-400">Owl Warrior Ecosystem</div>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="https://t.me/takeyourtoken" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-owl-gradient rounded-lg font-semibold hover:shadow-gold-glow transition-all">
                  Join Telegram
                </a>
                <a href="https://pump.fun/APadkPpjonaLBpLYDzKB6753QQU3s8VZhEtkvLgrpump" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gold-500 rounded-lg font-semibold hover:bg-gold-500/10 transition-all">
                  TYT Token
                </a>
              </div>
            </div>

            <div className="bg-owl-navy/50 rounded-lg p-6 mb-6 border border-gold-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gold-500 mb-2">⚠️ Legal Disclosure</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Take Your Token (TYT) is a digital mining platform. Not investment advice, not a security, not a deposit. Review risks, terms, and your jurisdiction requirements. Rewards and costs are variable. No physical device mining is performed. NFT miners represent access to cloud mining services. Platform availability depends on region and regulatory compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400">
              <p className="text-sm mb-2">© 2025 Take Your Token (TYT). All rights reserved.</p>
              <p className="text-xs text-gray-500">Built by the Owl Warriors. Protected by the Shield. Powered by the Sword.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
