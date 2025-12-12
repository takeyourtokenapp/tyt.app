import { Link } from 'react-router-dom';
import {
  Users,
  MessageCircle,
  Twitter,
  Send,
  Github,
  FileText,
  Radio,
  Calendar,
  Award,
  TrendingUp,
  Globe,
  ExternalLink,
  ArrowRight,
  Star,
  Heart,
  Zap
} from 'lucide-react';
import CommunityLeaderboard from '../components/CommunityLeaderboard';
import CommunityChat from '../components/CommunityChat';
export default function Community() {
  const stats = [
    { label: 'Community Members', value: '12,450+', icon: Users, color: 'blue' },
    { label: 'Active Daily Users', value: '3,200+', icon: TrendingUp, color: 'green' },
    { label: 'Countries', value: '87', icon: Globe, color: 'purple' },
    { label: 'Discord Members', value: '8,900+', icon: MessageCircle, color: 'pink' }
  ];

  const channels = [
    {
      icon: Send,
      name: 'Telegram',
      description: 'Main community hub for announcements, discussions, and support',
      members: '8,200+',
      link: 'https://t.me/takeyourtoken',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      name: 'Discord',
      description: 'Technical discussions, trading alpha, and community events',
      members: '8,900+',
      link: 'https://discord.gg/takeyourtoken',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Twitter,
      name: 'Twitter/X',
      description: 'Latest news, updates, and announcements from the TYT team',
      members: '15,300+',
      link: 'https://twitter.com/takeyourtoken',
      color: 'from-sky-400 to-blue-500'
    },
    {
      icon: Github,
      name: 'GitHub',
      description: 'Open-source code, documentation, and technical contributions',
      members: '420+',
      link: 'https://github.com/takeyourtoken',
      color: 'from-gray-600 to-gray-800'
    }
  ];

  const events = [
    {
      title: 'TYT Community AMA',
      date: 'Dec 20, 2024',
      time: '18:00 UTC',
      description: 'Monthly AMA with the core team. Ask anything about roadmap, tech, or tokenomics.',
      platform: 'Discord Voice',
      status: 'upcoming'
    },
    {
      title: 'Mining Optimization Workshop',
      date: 'Dec 15, 2024',
      time: '16:00 UTC',
      description: 'Learn advanced strategies to maximize your mining rewards and reduce costs.',
      platform: 'YouTube Live',
      status: 'upcoming'
    },
    {
      title: 'Foundation Impact Report Q4',
      date: 'Dec 31, 2024',
      time: '15:00 UTC',
      description: 'Quarterly report on foundation activities, grants awarded, and patient stories.',
      platform: 'Website & Twitter',
      status: 'upcoming'
    }
  ];

  const ambassadors = [
    {
      name: 'CryptoOliver',
      role: 'Community Lead',
      avatar: '👨‍💼',
      contributions: 'Founded 3 regional communities, 500+ support tickets resolved',
      rank: 'Owl Warrior'
    },
    {
      name: 'BlockchainSarah',
      role: 'Content Creator',
      avatar: '✍️',
      contributions: '12 educational videos, 50K+ views, multilingual content',
      rank: 'Owl Diplomat'
    },
    {
      name: 'MiningMike',
      role: 'Technical Expert',
      avatar: '⛏️',
      contributions: 'Created mining calculator, optimization guides, 200+ tech questions answered',
      rank: 'Owl Peacekeeper'
    },
    {
      name: 'TokenTina',
      role: 'Marketing Lead',
      avatar: '📢',
      contributions: 'Organized 5 Twitter spaces, 2000+ followers brought to TYT',
      rank: 'Owl Warrior'
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Complete guides, FAQs, and technical documentation',
      link: '/help'
    },
    {
      icon: Radio,
      title: 'Blog',
      description: 'Latest updates, research insights, and community highlights',
      link: '#'
    },
    {
      icon: Award,
      title: 'Ambassador Program',
      description: 'Join our ambassador program and earn exclusive rewards',
      link: '#'
    },
    {
      icon: Heart,
      title: 'Foundation',
      description: 'Learn about our mission to fight pediatric brain cancer',
      link: '/foundation'
    }
  ];

  const highlights = [
    {
      metric: '$1.2M+',
      label: 'Total Trading Volume',
      color: 'text-green-400'
    },
    {
      metric: '2,500+',
      label: 'Active Miners',
      color: 'text-amber-400'
    },
    {
      metric: '35 TH/s',
      label: 'Total Hashrate',
      color: 'text-blue-400'
    },
    {
      metric: '$256K',
      label: 'Donated to Foundation',
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Join 12,450+ Members</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                TYT Community
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect with thousands of miners, traders, and blockchain enthusiasts building
              the future of Web3 mining while supporting children's health research.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
                green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
                purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
                pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400'
              };

              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl p-6 border`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[3]}`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Connect With Us</h2>
            <p className="text-gray-400 text-lg">
              Join the conversation on your favorite platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <a
                  key={index}
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-gradient-to-br ${channel.color} p-6 rounded-xl border border-white/10 hover:scale-105 transition-all group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{channel.name}</h3>
                        <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-white/80 mb-3">{channel.description}</p>
                      <div className="text-sm text-white/60">{channel.members} members</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-gray-400 text-lg">
              Join us for AMAs, workshops, and community gatherings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-gray-400">{event.date} at {event.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400">{event.platform}</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Ambassadors */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Ambassadors</h2>
            <p className="text-gray-400 text-lg">
              Meet the dedicated members leading our global community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ambassadors.map((ambassador, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all text-center"
              >
                <div className="text-6xl mb-4">{ambassador.avatar}</div>
                <h3 className="text-xl font-bold mb-1">{ambassador.name}</h3>
                <div className="text-amber-400 font-semibold text-sm mb-3">{ambassador.role}</div>
                <p className="text-gray-400 text-sm mb-4">{ambassador.contributions}</p>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold inline-block">
                  {ambassador.rank}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-8 inline-block">
              <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Become an Ambassador</h3>
              <p className="text-gray-400 mb-6 max-w-lg">
                Lead your local community, create content, and earn exclusive rewards
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Achievements</h2>
            <p className="text-gray-400 text-lg">
              What we've built together
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                <div className={`text-4xl font-bold mb-2 ${highlight.color}`}>
                  {highlight.metric}
                </div>
                <div className="text-gray-400">{highlight.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Resources</h2>
            <p className="text-gray-400 text-lg">
              Everything you need to get started and stay informed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Link
                  key={index}
                  to={resource.link}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all group"
                >
                  <Icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{resource.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Components */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Live Community Features</h2>
            <p className="text-gray-400 text-lg">
              Connect, compete, and collaborate in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <CommunityChat />
            <CommunityLeaderboard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Become part of the fastest-growing Web3 mining community while making
            a real difference in children's lives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://t.me/takeyourtoken"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Join Telegram
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
