import { useState } from 'react';
import { CheckCircle, Circle, Clock, Zap, Target, Rocket, Star } from 'lucide-react';

interface RoadmapPhase {
  id: string;
  quarter: string;
  title: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  items: RoadmapItem[];
  icon: any;
  color: string;
}

interface RoadmapItem {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export default function InteractiveRoadmap() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const phases: RoadmapPhase[] = [
    {
      id: 'phase1',
      quarter: 'Q4 2024',
      title: 'Foundation Launch',
      status: 'completed',
      progress: 100,
      icon: CheckCircle,
      color: 'green',
      items: [
        {
          title: 'Platform MVP',
          description: 'Core mining platform with NFT miners and rewards system',
          status: 'completed'
        },
        {
          title: 'TYT Token Launch',
          description: 'Token deployment on Solana via pump.fun',
          status: 'completed'
        },
        {
          title: 'Foundation Setup',
          description: 'Legal entity and initial partnerships with medical institutions',
          status: 'completed'
        },
        {
          title: 'Basic Marketplace',
          description: 'NFT miner trading and listing functionality',
          status: 'completed'
        }
      ]
    },
    {
      id: 'phase2',
      quarter: 'Q1 2025',
      title: 'Ecosystem Expansion',
      status: 'in-progress',
      progress: 65,
      icon: Zap,
      color: 'amber',
      items: [
        {
          title: 'Academy Launch',
          description: 'Interactive blockchain education platform with certification',
          status: 'completed'
        },
        {
          title: 'Multi-chain Support',
          description: 'Integration with Ethereum, TRON, XRP, TON networks',
          status: 'in-progress'
        },
        {
          title: 'Governance DAO',
          description: 'veTYT staking and community voting system',
          status: 'in-progress'
        },
        {
          title: 'Mobile Apps',
          description: 'iOS and Android native applications',
          status: 'planned'
        }
      ]
    },
    {
      id: 'phase3',
      quarter: 'Q2 2025',
      title: 'Advanced Features',
      status: 'planned',
      progress: 0,
      icon: Target,
      color: 'blue',
      items: [
        {
          title: 'Lightning Network',
          description: 'Instant Bitcoin withdrawals via Lightning',
          status: 'planned'
        },
        {
          title: 'Advanced Analytics',
          description: 'AI-powered mining optimization and predictions',
          status: 'planned'
        },
        {
          title: 'Automated Reinvest',
          description: 'Smart contracts for automated reward reinvestment',
          status: 'planned'
        },
        {
          title: 'VIP Tiers v2',
          description: 'Enhanced benefits and exclusive features for top miners',
          status: 'planned'
        }
      ]
    },
    {
      id: 'phase4',
      quarter: 'Q3 2025',
      title: 'Global Scale',
      status: 'planned',
      progress: 0,
      icon: Rocket,
      color: 'purple',
      items: [
        {
          title: 'Institutional Partnerships',
          description: 'Partnerships with major crypto exchanges and funds',
          status: 'planned'
        },
        {
          title: 'Foundation Grants',
          description: 'First round of research grants to medical institutions',
          status: 'planned'
        },
        {
          title: 'Cross-chain Bridge',
          description: 'Seamless asset transfers between all supported chains',
          status: 'planned'
        },
        {
          title: 'Global Expansion',
          description: 'Localization in 10+ languages, regional compliance',
          status: 'planned'
        }
      ]
    },
    {
      id: 'phase5',
      quarter: 'Q4 2025',
      title: 'Metaverse & Beyond',
      status: 'planned',
      progress: 0,
      icon: Star,
      color: 'pink',
      items: [
        {
          title: 'Virtual Mining Facility',
          description: '3D metaverse experience of mining operations',
          status: 'planned'
        },
        {
          title: 'NFT Marketplace v2',
          description: 'Advanced features, auctions, and rental system',
          status: 'planned'
        },
        {
          title: 'Community Events',
          description: 'Virtual conferences, workshops, and meetups',
          status: 'planned'
        },
        {
          title: 'Impact Report',
          description: 'Comprehensive annual report on foundation achievements',
          status: 'planned'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'in-progress':
        return <Clock size={20} className="text-amber-400 animate-pulse" />;
      default:
        return <Circle size={20} className="text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-green-500 to-emerald-500 border-green-400',
      amber: 'from-amber-500 to-orange-500 border-amber-400',
      blue: 'from-blue-500 to-cyan-500 border-blue-400',
      purple: 'from-purple-500 to-pink-500 border-purple-400',
      pink: 'from-pink-500 to-rose-500 border-pink-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative">
      <div className="space-y-8">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isSelected = selectedPhase === phase.id;
          const isLast = index === phases.length - 1;

          return (
            <div key={phase.id} className="relative">
              {!isLast && (
                <div className="absolute left-6 top-20 w-0.5 h-full bg-gradient-to-b from-gray-700 to-transparent -z-10" />
              )}

              <div
                onClick={() => setSelectedPhase(isSelected ? null : phase.id)}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <div className={`bg-gradient-to-r ${getColorClasses(phase.color)} rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl transition-all`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Icon size={28} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-white/80">{phase.quarter}</div>
                          <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                          phase.status === 'completed'
                            ? 'bg-green-500/30 text-green-100'
                            : phase.status === 'in-progress'
                            ? 'bg-amber-500/30 text-amber-100'
                            : 'bg-gray-500/30 text-gray-100'
                        }`}>
                          {phase.status === 'completed' ? '✓ Completed' : phase.status === 'in-progress' ? '◷ In Progress' : '○ Planned'}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                          <span>Progress</span>
                          <span className="font-bold">{phase.progress}%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/60 rounded-full transition-all duration-500"
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 space-y-3 animate-slide-down">
                          {phase.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                            >
                              <div className="flex items-start gap-3">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                  <p className="text-sm text-white/80">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isSelected && (
                        <div className="text-sm text-white/80">
                          Click to view {phase.items.length} milestones
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Rocket className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-xl font-bold mb-2">Join Our Journey</h4>
            <p className="text-gray-300 mb-4">
              We're building the future of Web3 mining with purpose. Every milestone brings us closer
              to making a real impact on children's lives while revolutionizing the mining industry.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all">
                Start Mining Now
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all border border-gray-700">
                View Foundation Impact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
