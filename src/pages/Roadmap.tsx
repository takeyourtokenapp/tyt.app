import { CheckCircle, Circle, Clock, Sparkles, Rocket, Target, Award, Zap } from 'lucide-react';
import Footer from '../components/Footer';

interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  period: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number;
  items: RoadmapItem[];
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'planned';
}

const ROADMAP: RoadmapPhase[] = [
  {
    id: 'phase-0',
    phase: 'Phase 0',
    title: 'Foundation & MVP',
    period: 'Q3-Q4 2024',
    status: 'completed',
    progress: 100,
    items: [
      {
        id: 'mvp-1',
        title: 'Platform Architecture',
        description: 'Complete backend infrastructure with Supabase, edge functions, and database schema',
        status: 'done'
      },
      {
        id: 'mvp-2',
        title: 'Core UI/UX Design',
        description: 'Design system, component library, and responsive layouts for all major pages',
        status: 'done'
      },
      {
        id: 'mvp-3',
        title: 'NFT Miner System',
        description: 'Digital miner NFTs with TH/s, W/TH, and region specifications',
        status: 'done'
      },
      {
        id: 'mvp-4',
        title: 'Rewards Engine',
        description: 'Daily BTC reward calculation and distribution system',
        status: 'done'
      },
      {
        id: 'mvp-5',
        title: 'TYT Token Launch',
        description: 'TYT token created on Solana via pump.fun',
        status: 'done'
      },
      {
        id: 'mvp-6',
        title: 'Foundation Setup',
        description: 'Legal structure and initial partnerships for children\'s brain cancer foundation',
        status: 'done'
      }
    ]
  },
  {
    id: 'phase-1',
    phase: 'Phase 1',
    title: 'Launch & Core Features',
    period: 'Q1 2025',
    status: 'in-progress',
    progress: 75,
    items: [
      {
        id: 'p1-1',
        title: 'Fireblocks Integration',
        description: 'Enterprise-grade custody and withdrawal system with multi-signature security',
        status: 'in-progress'
      },
      {
        id: 'p1-2',
        title: 'KYC Provider Integration',
        description: 'Automated identity verification with Jumio or Onfido for 4-tier KYC system',
        status: 'in-progress'
      },
      {
        id: 'p1-3',
        title: 'Bitcoin Deposit Monitoring',
        description: 'Real-time blockchain monitoring for BTC deposits with webhook notifications',
        status: 'in-progress'
      },
      {
        id: 'p1-4',
        title: 'Marketplace Launch',
        description: 'P2P NFT miner trading with TYT currency and automatic royalties',
        status: 'planned'
      },
      {
        id: 'p1-5',
        title: 'Mobile App Beta',
        description: 'React Native apps for iOS and Android with push notifications',
        status: 'planned'
      },
      {
        id: 'p1-6',
        title: 'Security Audit',
        description: 'Third-party security audit of smart contracts and platform infrastructure',
        status: 'planned'
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Growth & Scaling',
    phase: 'Phase 2',
    period: 'Q2-Q3 2025',
    status: 'upcoming',
    progress: 0,
    items: [
      {
        id: 'p2-1',
        title: 'Lightning Network Integration',
        description: 'Instant withdrawals with near-zero fees via Lightning Network',
        status: 'planned'
      },
      {
        id: 'p2-2',
        title: 'Liquid Network Support',
        description: 'Fast, private Bitcoin transactions via Liquid sidechain',
        status: 'planned'
      },
      {
        id: 'p2-3',
        title: 'Academy Expansion',
        description: '20+ courses covering mining, trading, security, and Web3 fundamentals',
        status: 'planned'
      },
      {
        id: 'p2-4',
        title: 'Referral Program Launch',
        description: '4-tier referral system with 5-15% commissions and tracking dashboard',
        status: 'planned'
      },
      {
        id: 'p2-5',
        title: 'veTYT Governance',
        description: 'Token locking for voting power on platform parameters and proposals',
        status: 'planned'
      },
      {
        id: 'p2-6',
        title: 'Foundation Campaigns',
        description: 'Crowdfunding campaigns for specific research projects and equipment',
        status: 'planned'
      }
    ]
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    title: 'Ecosystem Expansion',
    period: 'Q4 2025',
    status: 'upcoming',
    progress: 0,
    items: [
      {
        id: 'p3-1',
        title: 'Multi-Chain Expansion',
        description: 'Support for Ethereum, Solana, Tron, XRP, and TON withdrawals',
        status: 'planned'
      },
      {
        id: 'p3-2',
        title: 'Miner Upgrades',
        description: 'Upgrade NFT miners: increase TH/s, improve efficiency, add auto-reinvest',
        status: 'planned'
      },
      {
        id: 'p3-3',
        title: 'Advanced Analytics',
        description: 'Real-time charts, ROI calculator, profitability forecasting, and portfolio insights',
        status: 'planned'
      },
      {
        id: 'p3-4',
        title: 'VIP Tier System',
        description: 'Diamond and VIP tiers with enhanced discounts (up to 20%) and exclusive benefits',
        status: 'planned'
      },
      {
        id: 'p3-5',
        title: 'Marketplace Auctions',
        description: 'Auction system for rare miners with bidding, countdown timers, and escrow',
        status: 'planned'
      },
      {
        id: 'p3-6',
        title: 'Charity Staking',
        description: 'Stake TYT to earn yield while supporting foundation (100% rewards donated)',
        status: 'planned'
      }
    ]
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    title: 'Global Impact',
    period: '2026+',
    status: 'upcoming',
    progress: 0,
    items: [
      {
        id: 'p4-1',
        title: 'Institutional Partnerships',
        description: 'Partnerships with major hospitals, research institutions, and crypto funds',
        status: 'planned'
      },
      {
        id: 'p4-2',
        title: 'Global Expansion',
        description: 'Localization for 20+ languages, regional data centers, and local partnerships',
        status: 'planned'
      },
      {
        id: 'p4-3',
        title: 'Foundation Grants Program',
        description: '$10M+ in research grants awarded to leading pediatric cancer researchers',
        status: 'planned'
      },
      {
        id: 'p4-4',
        title: 'Cross-Chain Bridge',
        description: 'Bridge TYT token to Ethereum, BSC, and other major chains for wider adoption',
        status: 'planned'
      },
      {
        id: 'p4-5',
        title: 'DAO Governance',
        description: 'Full decentralization with community-driven governance and treasury management',
        status: 'planned'
      },
      {
        id: 'p4-6',
        title: 'Impact Milestone',
        description: '1,000+ families supported, 20+ clinical trials funded, breakthrough treatments',
        status: 'planned'
      }
    ]
  }
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Product Roadmap
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our journey from MVP to the world's leading Web3 mining platform with charitable impact
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">1 Phase Complete</h3>
            <p className="text-gray-400">Foundation & MVP successfully launched with core features</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
            <Clock className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Phase 1 Active</h3>
            <p className="text-gray-400">Currently building integrations and launching core marketplace</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
            <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">3 Phases Ahead</h3>
            <p className="text-gray-400">Ambitious expansion plans through 2026 and beyond</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 opacity-30"></div>

          <div className="space-y-12">
            {ROADMAP.map((phase, index) => (
              <PhaseCard key={phase.id} phase={phase} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-12 text-center">
          <Target className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Join Us on This Journey</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Be part of building the future of Web3 mining. Every milestone brings us closer to our vision
            of combining financial innovation with meaningful social impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Start Mining Now
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-lg transition-all text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const statusConfig = {
    completed: {
      bg: 'from-green-900/20 to-emerald-900/20',
      border: 'border-green-500/50',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      badge: 'bg-green-500/20 text-green-400 border-green-500/50'
    },
    'in-progress': {
      bg: 'from-blue-900/20 to-cyan-900/20',
      border: 'border-blue-500/50',
      icon: Clock,
      iconColor: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    },
    upcoming: {
      bg: 'from-gray-800 to-gray-900',
      border: 'border-gray-700',
      icon: Circle,
      iconColor: 'text-gray-400',
      badge: 'bg-gray-700 text-gray-400 border-gray-600'
    }
  };

  const config = statusConfig[phase.status];
  const StatusIcon = config.icon;

  return (
    <div className={`relative bg-gradient-to-br ${config.bg} border ${config.border} rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-lg`}>
      <div className="absolute left-0 top-0 w-16 h-full flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center">
          <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>

      <div className="pl-20 pr-8 py-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 border rounded-full text-sm font-semibold ${config.badge}`}>
                {phase.phase}
              </span>
              <span className="text-gray-400">{phase.period}</span>
            </div>
            <h3 className="text-3xl font-bold mb-2">{phase.title}</h3>
          </div>
          {phase.progress > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{phase.progress}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          )}
        </div>

        {phase.progress > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  phase.status === 'completed'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
                style={{ width: `${phase.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {phase.items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: RoadmapItem }) {
  const statusConfig = {
    done: {
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    'in-progress': {
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    planned: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-700/30',
      border: 'border-gray-600/30'
    }
  };

  const config = statusConfig[item.status];
  const StatusIcon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3 mb-2">
        <StatusIcon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className="font-bold mb-1">{item.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
