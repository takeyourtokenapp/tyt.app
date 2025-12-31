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
        className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

            <motion.div
              className="relative"
              variants={fadeInUp}
            >
              {/* Background gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>

              {/* Hero Visual with Aoi */}
              <div className="relative">
                <div className="relative z-10 flex items-center justify-center">
                  {/* Aoi Character */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.img
                      src="/generated-image_(3).png"
                      alt="Aoi AI Guide"
                      className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                      animate={{
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>

                  {/* Floating Bitcoin */}
                  <motion.div
                    className="absolute top-12 right-8"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-xl"></div>
                      <BitcoinIcon size={80} />
                    </div>
                  </motion.div>

                  {/* Floating Stats Cards */}
                  <motion.div
                    className="absolute top-16 left-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs tyt-text-tertiary">Daily Rewards</span>
                        </div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">0.00045 BTC</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute top-40 -left-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs tyt-text-tertiary">Total Power</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">250 TH/s</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-32 left-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs tyt-text-tertiary">Active Miners</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">5,247</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-12 -right-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          <span className="text-xs tyt-text-tertiary">Donated</span>
                        </div>
                        <p className="text-lg font-bold text-pink-600 dark:text-pink-400">$256K</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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

      <section id="how-it-works" className="tyt-section bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="tyt-container">
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-400 font-medium text-sm">Simple Process</span>
            </motion.div>

            <h2 className="tyt-heading-2 mb-4">
              How It Works
            </h2>
            <p className="text-xl tyt-text-secondary max-w-3xl mx-auto">
              Start earning Bitcoin in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {/* Connection lines between steps (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800" style={{ top: '4rem' }}></div>

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
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-2 border-pink-200 dark:border-pink-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background particles effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
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

      <section className="tyt-section relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

        <div className="tyt-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual Elements */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative flex items-center justify-center">
                {/* Central icon cluster */}
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="tyt-card p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex flex-col items-center gap-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-2xl"></div>
                        <BitcoinIcon size={120} />
                      </div>
                      <div className="flex gap-6">
                        <MiningIcon size={60} />
                        <HeartIcon size={60} />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold tyt-text-primary mb-2">Start Mining Today</p>
                        <p className="tyt-text-secondary">Join the movement</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Bitcoin */}
                <motion.div
                  className="absolute top-8 -right-8"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BitcoinIcon size={60} />
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - CTA */}
            <motion.div
              className="text-center lg:text-left order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="tyt-heading-2 mb-6">
                Ready to Start Mining?
              </h2>
              <p className="text-xl tyt-text-secondary mb-8 leading-relaxed">
                Join thousands of miners earning Bitcoin daily while making a real difference
                in children's lives.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/signup"
                  className="tyt-btn-primary text-lg px-8 py-4"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="tyt-btn-secondary text-lg px-8 py-4"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm tyt-text-secondary font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm tyt-text-secondary font-medium">Instant Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm tyt-text-secondary font-medium">Impact Driven</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
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
      whileHover={{ y: -5 }}
    >
      <div className="tyt-card p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl relative overflow-hidden">
        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>

        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
          {number}
        </div>
        <div className="relative z-10">
          <div className="text-blue-600 dark:text-blue-400 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit">{icon}</div>
          <h3 className="tyt-heading-4 mb-3">{title}</h3>
          <p className="tyt-text-secondary">{description}</p>
        </div>
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
