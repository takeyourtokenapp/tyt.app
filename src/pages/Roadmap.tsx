import { ArrowLeft, CheckCircle2, Circle, Clock, Rocket, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-lg">Product Roadmap</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">TYT Roadmap</h1>
          <p className="text-xl text-gray-400">Our journey from MVP to full ecosystem</p>
        </div>

        {/* Phase 0 - COMPLETED */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 0: Foundation</h2>
              <p className="text-gray-400">December 2024 • COMPLETED ✓</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-green-500/50 p-6 ml-20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Database Architecture</strong>
                  <p className="text-gray-400 text-sm">Complete schema for all ecosystem components</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Core UI Components</strong>
                  <p className="text-gray-400 text-sm">Dashboard, wallet, marketplace interfaces</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Authentication System</strong>
                  <p className="text-gray-400 text-sm">Supabase auth with email/password</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Email Notifications</strong>
                  <p className="text-gray-400 text-sm">10 professional email templates via SendGrid</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Phase 1 - MVP */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 1: MVP Launch</h2>
              <p className="text-gray-400">December 2024 • IN PROGRESS 🚀</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-amber-500/50 p-6 ml-20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Marketplace Transactions</strong>
                  <p className="text-gray-400 text-sm">Full buy/sell/listing functionality complete</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Admin Dashboard</strong>
                  <p className="text-gray-400 text-sm">KYC review and withdrawal approval systems</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-green-400">Legal Framework</strong>
                  <p className="text-gray-400 text-sm">Terms of Service, Privacy Policy, Risk Disclosures</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Real Blockchain Integration</strong>
                  <p className="text-gray-400 text-sm">Multi-chain withdrawal broadcasting (in progress)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">KYC Service Integration</strong>
                  <p className="text-gray-400 text-sm">Third-party identity verification (planned)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-400">Production Deployment</strong>
                  <p className="text-gray-400 text-sm">Live at takeyourtoken.app (coming soon)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Phase 2 - Growth */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 2: Growth & Scale</h2>
              <p className="text-gray-400">Q1 2025 • 8-12 Weeks</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-blue-500/50 p-6 ml-20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Complete Multi-Chain Support</strong>
                  <p className="text-gray-400 text-sm">BTC, ETH, SOL, XRP, TRON deposit monitoring and withdrawals</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Academy Content Launch</strong>
                  <p className="text-gray-400 text-sm">5-10 courses with video lessons, quizzes, and certificates</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Mobile Applications</strong>
                  <p className="text-gray-400 text-sm">Native iOS and Android apps</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Governance UI</strong>
                  <p className="text-gray-400 text-sm">veTYT locking and proposal voting interface</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Foundation Grant System</strong>
                  <p className="text-gray-400 text-sm">Application, review, and distribution workflow</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Advanced Analytics</strong>
                  <p className="text-gray-400 text-sm">ROI tracking, performance insights, portfolio analytics</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Phase 3 - Expansion */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 3: Ecosystem Expansion</h2>
              <p className="text-gray-400">Q2-Q3 2025 • 12-24 Weeks</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/50 p-6 ml-20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Staking & Yield</strong>
                  <p className="text-gray-400 text-sm">TYT staking pools with APY rewards</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Liquidity Mining</strong>
                  <p className="text-gray-400 text-sm">LP rewards for TYT/SOL and TYT/USDT pairs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Cross-Chain Bridge</strong>
                  <p className="text-gray-400 text-sm">Move TYT between Solana, Ethereum, and BSC</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Fiat On/Off Ramps</strong>
                  <p className="text-gray-400 text-sm">Buy crypto with credit card, bank transfer</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Referral Program V2</strong>
                  <p className="text-gray-400 text-sm">Enhanced rewards and multi-level structure</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>API for Partners</strong>
                  <p className="text-gray-400 text-sm">Public API for third-party integrations</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Phase 4 - Decentralization */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center">
              <Circle className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Phase 4: Full Decentralization</h2>
              <p className="text-gray-400">Q4 2025 & Beyond</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-cyan-500/50 p-6 ml-20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Non-Custodial Option</strong>
                  <p className="text-gray-400 text-sm">User-controlled private keys for advanced users</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>On-Chain Governance</strong>
                  <p className="text-gray-400 text-sm">Smart contract-based proposal execution</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>DAO Treasury</strong>
                  <p className="text-gray-400 text-sm">Community-controlled platform funds</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>NFT Fractionalization</strong>
                  <p className="text-gray-400 text-sm">Split high-value miners into fractional shares</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Insurance Protocol</strong>
                  <p className="text-gray-400 text-sm">Decentralized insurance for miner downtime</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Global Expansion</strong>
                  <p className="text-gray-400 text-sm">Multi-language support, regional compliance</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Foundation Roadmap */}
        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl border border-pink-500/50 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-pink-400">❤️</span> Foundation Roadmap
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <strong>Q4 2024:</strong> Foundation legal entity registration (501c3 or equivalent)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Circle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <strong>Q1 2025:</strong> First research grants awarded to 3-5 institutions
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Circle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <strong>Q2 2025:</strong> Family support program launch (100 families targeted)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Circle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <strong>Q3 2025:</strong> First annual impact report published
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Circle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <strong>Q4 2025:</strong> $1M+ in total research funding milestone
              </div>
            </div>
          </div>
        </div>

        {/* Community Involvement */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-amber-500/50 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Shape the Roadmap</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            As a TYT token holder, you have a voice in our roadmap priorities through governance.
            Stake your TYT to earn voting power and help decide which features we build next.
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
          >
            Join TYT Platform
            <Rocket size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
