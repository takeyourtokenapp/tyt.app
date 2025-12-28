import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Heart,
  Cpu,
  Coins,
  Award,
  CheckCircle,
  BarChart3,
  Sparkles,
  Flame,
  Lock,
  PieChart
} from 'lucide-react';
import { CompactFAQ } from '../components/FAQWidget';
import StatisticsCard, { StatisticsGrid } from '../components/StatisticsCard';
import PriceTicker from '../components/PriceTicker';
import IncomeCalculator from '../components/IncomeCalculator';
import { FeeModelTooltip } from '../components/Tooltip';
import {
  BitcoinIcon,
  MiningIcon,
  HeartIcon,
  RocketIcon,
  ShieldCheckIcon,
  ChartIcon
} from '../components/illustrations/IconLibrary';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 scroll-smooth">

      <motion.section
        className="relative py-16 md:py-24 overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-6" variants={fadeInUp}>
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full"
                variants={fadeInUp}
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-400 font-medium text-sm">{t('common:landing.hero.badge')}</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white"
                variants={fadeInUp}
              >
                {t('common:landing.hero.title')}
                <br />
                <span className="text-amber-600 dark:text-amber-400">
                  {t('common:landing.hero.titleHighlight')}
                </span>
              </motion.h1>

              <motion.div variants={fadeInUp}>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('common:landing.hero.description')}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Platform Fee Structure:</span>
                  <FeeModelTooltip />
                </div>
              </motion.div>

              <motion.div className="flex flex-col sm:flex-row gap-3" variants={fadeInUp}>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {t('common:landing.hero.cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="tyt-btn-secondary"
                >
                  {t('common:landing.hero.ctaSecondary')}
                </a>
              </motion.div>

              <motion.div className="flex items-center gap-8 pt-4" variants={fadeInUp}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm tyt-text-secondary">100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm tyt-text-secondary">5,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm tyt-text-secondary">$250K+ Donated</span>
                </div>
              </motion.div>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl"></div>
              <div className="relative tyt-card p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex items-center justify-center py-8">
                    <BitcoinIcon size={120} />
                  </div>
                  <StatCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Daily Rewards"
                    value="0.00045 BTC"
                    color="green"
                  />
                  <StatCard
                    icon={<Cpu className="w-6 h-6" />}
                    label="Total Power"
                    value="250 TH/s"
                    color="blue"
                  />
                  <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Active Miners"
                    value="5,247"
                    color="purple"
                  />
                  <StatCard
                    icon={<Heart className="w-6 h-6" />}
                    label="Donated"
                    value="$256K"
                    color="pink"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section id="features" className="tyt-section-alt">
        <div className="tyt-container">
          <div className="text-center mb-16">
            <h2 className="tyt-heading-2 mb-4">
              Why Choose TakeYourToken
            </h2>
            <p className="text-xl tyt-text-secondary max-w-3xl mx-auto">
              The world's first mining platform where profits meet purpose
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MiningIcon size={60} />}
              title="Real Bitcoin Mining"
              description="Own NFT miners backed by real hardware in professional data centers. Earn daily BTC rewards automatically."
            />
            <FeatureCard
              icon={<HeartIcon size={60} />}
              title="Built-in Charity"
              description="1% platform fee on all transactions: 30% goes to children's brain cancer research, 10% to academy education. Fully transparent on-chain tracking."
            />
            <FeatureCard
              icon={<ShieldCheckIcon size={60} />}
              title="Fully Secure"
              description="Enterprise-grade custody with Fireblocks. Your funds are protected by multi-signature cold storage."
            />
            <FeatureCard
              icon={<ChartIcon size={60} />}
              title="Real-Time Analytics"
              description="Monitor your mining performance, revenue, and ROI with professional charts and detailed statistics."
            />
            <FeatureCard
              icon={<RocketIcon size={60} />}
              title="TYT Token Benefits"
              description="Pay maintenance with TYT token for up to 20% discount. Tokens are automatically burned, creating scarcity."
            />
            <FeatureCard
              icon={<Award className="w-12 h-12 text-amber-400" />}
              title="4-Tier Referral Program"
              description="Earn 5-15% commission on referrals. Build your network and create passive income streams."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="tyt-section">
        <div className="tyt-container">
          <div className="text-center mb-16">
            <h2 className="tyt-heading-2 mb-4">
              How It Works
            </h2>
            <p className="text-xl tyt-text-secondary max-w-3xl mx-auto">
              Start earning Bitcoin in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Create Account"
              description="Sign up in 60 seconds. No credit card required to get started."
              icon={<Users className="w-8 h-8" />}
            />
            <StepCard
              number="2"
              title="Choose Miner"
              description="Browse NFT miners with different power levels and ROI projections."
              icon={<Cpu className="w-8 h-8" />}
            />
            <StepCard
              number="3"
              title="Start Mining"
              description="Your miner starts working immediately. Watch rewards accumulate daily."
              icon={<Zap className="w-8 h-8" />}
            />
            <StepCard
              number="4"
              title="Withdraw Anytime"
              description="Withdraw your BTC rewards to any wallet. Fast and secure transfers."
              icon={<Coins className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      <section id="calculator" className="tyt-section-alt">
        <div className="tyt-container">
          <div className="text-center mb-12">
            <h2 className="tyt-heading-2 mb-4">
              Calculate Your Earnings
            </h2>
            <p className="text-xl tyt-text-secondary max-w-3xl mx-auto">
              Estimate your potential daily, weekly, and monthly Bitcoin income based on hashrate
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <IncomeCalculator />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatisticsGrid columns={4}>
            <StatisticsCard
              icon={<Users className="w-6 h-6" />}
              label="Active Users"
              value="5,247"
              change={12.5}
              changeLabel="this month"
              color="blue"
            />
            <StatisticsCard
              icon={<Cpu className="w-6 h-6" />}
              label="Total Hashrate"
              value="250 TH/s"
              change={8.3}
              changeLabel="this week"
              color="green"
            />
            <StatisticsCard
              icon={<BarChart3 className="w-6 h-6" />}
              label="Daily BTC Mined"
              value="2.45 BTC"
              change={5.7}
              changeLabel="vs yesterday"
              color="amber"
            />
            <StatisticsCard
              icon={<Heart className="w-6 h-6" />}
              label="Foundation Donations"
              value="$256,890"
              change={15.2}
              changeLabel="all time"
              color="purple"
            />
          </StatisticsGrid>
        </div>
      </section>

      <section id="tokenomics" className="tyt-section-alt">
        <div className="tyt-container">
          <div className="text-center mb-12">
            <div className="tyt-badge-primary mb-6">
              <Flame className="w-4 h-4" />
              <span className="font-medium">Deflationary Token</span>
            </div>
            <h2 className="tyt-heading-2 mb-4">TYT Token Economy</h2>
            <p className="text-xl tyt-text-secondary max-w-3xl mx-auto">
              A utility token built on Solana with real use cases and continuous burn mechanics
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="tyt-card p-6 text-center">
              <Coins className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">1B TYT</div>
              <div className="text-sm tyt-text-tertiary">Total Supply</div>
            </div>
            <div className="tyt-card p-6 text-center">
              <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">100%</div>
              <div className="text-sm tyt-text-tertiary">Burn on Maintenance</div>
            </div>
            <div className="tyt-card p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Up to 38%</div>
              <div className="text-sm tyt-text-tertiary">Discount Savings</div>
            </div>
            <div className="tyt-card p-6 text-center">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">veTYT</div>
              <div className="text-sm tyt-text-tertiary">Governance Power</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <TokenUtilityCard
              icon={<PieChart className="w-6 h-6 text-amber-400" />}
              title="Maintenance Discounts"
              description="Pay maintenance with TYT for 20% base discount plus VIP bonuses up to 18%"
            />
            <TokenUtilityCard
              icon={<Coins className="w-6 h-6 text-amber-400" />}
              title="Marketplace Currency"
              description="Buy and sell NFT miners exclusively with TYT on our secondary market"
            />
            <TokenUtilityCard
              icon={<Lock className="w-6 h-6 text-amber-400" />}
              title="Governance Voting"
              description="Lock TYT for veTYT and participate in platform decisions and proposals"
            />
          </div>

          <div className="text-center">
            <Link
              to="/tokenomics"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              View Full Tokenomics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="foundation" className="tyt-section">
        <div className="tyt-container">
          <div className="bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800 rounded-2xl p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <HeartIcon size={60} />
                  <h2 className="tyt-heading-2">Foundation Impact</h2>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-pink-600 dark:text-pink-300">
                  TYT Children's Brain Cancer Research & Support Foundation
                </h3>
                <p className="text-lg tyt-text-secondary mb-4 leading-relaxed">
                  Every transaction on our platform automatically contributes to support children
                  battling brain cancer. Funds go directly to medical research, family assistance,
                  and clinical trials.
                </p>
                <div className="bg-white dark:bg-gray-800 border border-pink-300 dark:border-pink-700 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2 mb-2">
                    <p className="text-sm font-semibold text-pink-600 dark:text-pink-400">Automatic Fee Split (1% Total):</p>
                    <FeeModelTooltip />
                  </div>
                  <ul className="text-sm tyt-text-secondary space-y-1">
                    <li>• 60% → Protocol Operations</li>
                    <li className="text-pink-600 dark:text-pink-400 font-medium">• 30% → Children's Brain Cancer Foundation (0.3% of transaction)</li>
                    <li className="text-blue-600 dark:text-blue-400 font-medium">• 10% → Digital-Interactive-Technology-Blockchain Academia (0.1% of transaction)</li>
                  </ul>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <span className="tyt-text-secondary">Transparent blockchain-tracked donations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <span className="tyt-text-secondary">Direct partnerships with leading hospitals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <span className="tyt-text-secondary">Annual public impact reports</span>
                  </li>
                </ul>
                <Link
                  to="/foundation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Learn More About Our Mission
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-6">
                <div className="tyt-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tyt-text-tertiary">Total Donated</span>
                    <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">$256,890</p>
                  <p className="text-sm tyt-text-muted mt-1">Lifetime contributions</p>
                </div>
                <div className="tyt-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tyt-text-tertiary">Families Helped</span>
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">127</p>
                  <p className="text-sm tyt-text-muted mt-1">Direct assistance provided</p>
                </div>
                <div className="tyt-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tyt-text-tertiary">Research Grants</span>
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">$180,000</p>
                  <p className="text-sm tyt-text-muted mt-1">Funding for 3 clinical trials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tyt-section-alt">
        <div className="tyt-container-narrow">
          <CompactFAQ maxItems={6} />
        </div>
      </section>

      <section className="tyt-section">
        <div className="tyt-container-narrow text-center">
          <h2 className="tyt-heading-2 mb-6">
            Ready to Start Mining?
          </h2>
          <p className="text-xl tyt-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of miners earning Bitcoin daily while making a real difference
            in children's lives.
          </p>
          <Link
            to="/signup"
            className="tyt-btn-primary text-lg px-8 py-4"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: any = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400'
  };

  return (
    <div className={`${colors[color]} border-2 rounded-xl p-4 transition-all hover:scale-105`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs tyt-text-tertiary">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="tyt-card-feature"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="tyt-heading-4 mb-3">{title}</h3>
      <p className="tyt-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: parseInt(number) * 0.1 }}
    >
      <div className="tyt-card p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
        <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
        <h3 className="tyt-heading-4 mb-3">{title}</h3>
        <p className="tyt-text-secondary">{description}</p>
      </div>
    </motion.div>
  );
}

function TokenUtilityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="tyt-card p-6 hover:border-amber-500 dark:hover:border-amber-500 transition-all">
      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold tyt-text-primary mb-2">{title}</h3>
      <p className="tyt-text-secondary text-sm">{description}</p>
    </div>
  );
}
