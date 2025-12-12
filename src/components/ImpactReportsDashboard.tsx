import { useState } from 'react';
import { Heart, Users, DollarSign, TrendingUp, Download, ExternalLink, Building, Award } from 'lucide-react';

interface ImpactMetric {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export default function ImpactReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const metrics: ImpactMetric[] = [
    {
      label: 'Total Donated',
      value: '$248,500',
      change: '+15.3%',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Families Supported',
      value: '127',
      change: '+23',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Research Grants',
      value: '8',
      change: '+3',
      icon: Award,
      color: 'purple'
    },
    {
      label: 'Partner Hospitals',
      value: '15',
      change: '+5',
      icon: Building,
      color: 'amber'
    }
  ];

  const grants = [
    {
      id: 1,
      title: 'Pediatric Brain Tumor Immunotherapy Research',
      institution: 'Johns Hopkins Hospital',
      amount: '$50,000',
      status: 'Active',
      date: 'Dec 2024'
    },
    {
      id: 2,
      title: 'Novel Drug Delivery Systems for Glioblastoma',
      institution: 'Stanford Medicine',
      amount: '$75,000',
      status: 'Active',
      date: 'Nov 2024'
    },
    {
      id: 3,
      title: 'Genetic Markers in Pediatric Brain Cancer',
      institution: 'Mayo Clinic',
      amount: '$40,000',
      status: 'Completed',
      date: 'Oct 2024'
    }
  ];

  const stories = [
    {
      id: 1,
      name: 'Emma',
      age: 7,
      location: 'Boston, MA',
      story: 'Thanks to TYT Foundation funding, Emma received cutting-edge immunotherapy treatment...',
      image: '👧'
    },
    {
      id: 2,
      name: 'Lucas',
      age: 9,
      location: 'Los Angeles, CA',
      story: 'Lucas\'s family received financial support for travel and accommodation during treatment...',
      image: '👦'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-green-500 to-emerald-500 border-green-400',
      blue: 'from-blue-500 to-cyan-500 border-blue-400',
      purple: 'from-purple-500 to-pink-500 border-purple-400',
      amber: 'from-amber-500 to-orange-500 border-amber-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Foundation Impact Report</h2>
          <p className="text-gray-400">Transparent reporting of your collective impact</p>
        </div>

        <div className="flex items-center gap-2">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedPeriod === period
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period === 'month' ? 'This Month' : period === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-gray-800 border-2 border-gray-700 hover:border-gray-600 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${getColorClasses(metric.color)} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                  <TrendingUp size={14} />
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Active Research Grants</h3>
            <button className="text-gold-400 hover:text-gold-300 flex items-center gap-2 text-sm">
              View All
              <ExternalLink size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {grants.map((grant) => (
              <div
                key={grant.id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gold-500 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{grant.title}</h4>
                    <p className="text-sm text-gray-400">{grant.institution}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    grant.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {grant.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gold-400 font-bold">{grant.amount}</span>
                  <span className="text-gray-500">{grant.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Family Stories</h3>
            <button className="text-gold-400 hover:text-gold-300 flex items-center gap-2 text-sm">
              Read More
              <ExternalLink size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gold-500 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{story.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold">{story.name}</h4>
                      <span className="text-sm text-gray-500">• {story.age} years old</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{story.location}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{story.story}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-4">
          <Heart className="w-12 h-12 text-pink-400 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-3">How Your Mining Supports Research</h3>
            <p className="text-gray-300 mb-4">
              Every transaction on the TYT platform automatically contributes to the Children's Brain Cancer Research Foundation.
              Your mining rewards, marketplace sales, and maintenance payments all include a small percentage that goes directly
              to funding cutting-edge research and supporting families in need.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">1%</div>
                <div className="text-sm text-gray-400">of all miner purchases</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">1%</div>
                <div className="text-sm text-gray-400">of marketplace transactions</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">2%</div>
                <div className="text-sm text-gray-400">of maintenance fees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-semibold transition-all">
          <Download size={18} />
          Download Full Report (PDF)
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-black rounded-xl font-bold transition-all">
          <Heart size={18} />
          Make Additional Donation
        </button>
      </div>
    </div>
  );
}
