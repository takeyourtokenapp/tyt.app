import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award,
  Globe,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
            About TakeYourToken
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The world's first Web3 mining platform where earning Bitcoin
            automatically supports children battling brain cancer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              TakeYourToken revolutionizes crypto mining by combining cutting-edge blockchain technology
              with meaningful social impact. We believe that financial technology should serve humanity,
              not just generate profits.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our platform enables anyone to participate in Bitcoin mining through NFT-powered digital miners,
              while automatically contributing to life-saving pediatric brain cancer research. Every transaction
              on our platform directly supports medical breakthroughs and families in need.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We're building a sustainable ecosystem where Web3 technology creates real-world impact,
              proving that profit and purpose can coexist harmoniously.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              We envision a future where cryptocurrency mining becomes a force for global good.
              TakeYourToken aims to be the leading platform that demonstrates how blockchain technology
              can solve real-world problems while providing financial opportunities.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              By 2026, we aim to have contributed over $10 million to pediatric brain cancer research,
              supported 1,000+ families, funded 20+ clinical trials, and helped advance treatments that
              save children's lives worldwide.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our long-term vision includes expanding to support multiple charitable causes while maintaining
              our core focus on children's healthcare, education, and wellbeing.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Heart className="w-10 h-10" />}
              title="Compassion First"
              description="Every decision we make prioritizes human impact and helping those in need"
              color="from-pink-500 to-red-500"
            />
            <ValueCard
              icon={<Shield className="w-10 h-10" />}
              title="Trust & Transparency"
              description="Complete transparency in operations, donations, and platform security"
              color="from-blue-500 to-cyan-500"
            />
            <ValueCard
              icon={<Zap className="w-10 h-10" />}
              title="Innovation"
              description="Pushing boundaries in Web3 technology while maintaining user-friendly design"
              color="from-amber-500 to-orange-500"
            />
            <ValueCard
              icon={<Users className="w-10 h-10" />}
              title="Community"
              description="Building a global community united by shared values and purpose"
              color="from-purple-500 to-pink-500"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 to-red-900/20 border border-pink-500/30 rounded-xl p-12 mb-16">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">The Foundation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              TYT Children's Brain Cancer Research & Support Foundation is at the heart of everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-pink-400 mb-2">$256K+</div>
              <div className="text-gray-400">Total Donated</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">127</div>
              <div className="text-gray-400">Families Helped</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-400 mb-2">$645K</div>
              <div className="text-gray-400">Research Grants</div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Our foundation partners with leading hospitals worldwide including Tel Aviv Medical Center,
              Johns Hopkins Hospital, Boston Children's Hospital, and Great Ormond Street Hospital. We fund
              groundbreaking research, purchase life-saving medical equipment, and provide direct assistance
              to families facing the devastating impact of pediatric brain cancer.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Every transaction on TakeYourToken automatically contributes 1% to the foundation. All donations
              are tracked transparently on blockchain, with quarterly public reports and annual third-party
              audits ensuring complete accountability.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/foundation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold rounded-lg transition-all"
            >
              Learn More About Our Impact
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Why TakeYourToken?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-400" />}
              title="Real Bitcoin Mining"
              description="Own NFT miners backed by actual hardware in professional data centers. No fake promises - real equipment, real Bitcoin rewards, fully transparent operations."
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-pink-400" />}
              title="Automatic Charity"
              description="1% of every transaction supports children's brain cancer research. Mine Bitcoin, support medical breakthroughs - it happens automatically."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-400" />}
              title="Enterprise Security"
              description="Fireblocks custody, multi-signature cold storage, real-time monitoring. Your funds protected by institutional-grade security systems."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Sustainable Tokenomics"
              description="TYT token with built-in burn mechanics. Pay maintenance fees with up to 20% discount while reducing total supply."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-purple-400" />}
              title="4-Tier Referral Program"
              description="Earn 5-15% commission on referrals. Build your network, create passive income, grow together with the community."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-cyan-400" />}
              title="Multi-Chain Withdrawals"
              description="Withdraw to Bitcoin, Lightning, Liquid, Solana, Ethereum, Tron, XRP, or TON. Choose the network that fits your needs."
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Platform Statistics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              value="5,247"
              label="Active Users"
              change="+12.5%"
              positive
            />
            <StatCard
              value="250 TH/s"
              label="Total Hashrate"
              change="+8.3%"
              positive
            />
            <StatCard
              value="2.45 BTC"
              label="Daily BTC Mined"
              change="+5.7%"
              positive
            />
            <StatCard
              value="$45M"
              label="Platform Volume"
              change="+23.4%"
              positive
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-12">
          <div className="text-center mb-8">
            <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Be part of the movement that's redefining crypto mining. Earn Bitcoin, support life-saving
              research, and prove that Web3 can change the world.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all text-lg"
            >
              Start Mining Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-lg transition-all text-lg"
            >
              View Roadmap
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

function ValueCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-full mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-6 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ value, label, change, positive }: { value: string; label: string; change: string; positive: boolean }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-400 mb-2">{label}</div>
      <div className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change} this month
      </div>
    </div>
  );
}
