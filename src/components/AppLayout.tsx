import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Cpu,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Zap,
  GraduationCap,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Vote,
  Users,
  Gift,
  Bell,
  User,
  Receipt
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const navItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/miners', icon: Cpu, label: 'My Miners' },
    { path: '/app/mining-stats', icon: BarChart3, label: 'Mining Stats' },
    { path: '/app/rewards', icon: TrendingUp, label: 'Rewards' },
    { path: '/app/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { path: '/app/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/app/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/app/tyt-trading', icon: Zap, label: 'TYT Trading' },
    { path: '/app/governance', icon: Vote, label: 'Governance' },
    { path: '/app/referrals', icon: Gift, label: 'Referrals' },
    { path: '/app/academy', icon: GraduationCap, label: 'Academy' },
    { path: '/app/foundation', icon: Heart, label: 'Foundation' },
  ];

  const bottomNavItems = [
    { path: '/app/profile', icon: User, label: 'Profile' },
    { path: '/app/notifications', icon: Bell, label: 'Notifications' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-dark via-owl-navy to-black text-white">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-glass border-r border-gold-800 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gold-800">
              <Link to="/app" className="flex items-center gap-2 group">
                <img src="/6d629383-acba-4396-8f01-4715f914aada.png" alt="TYT" className="w-10 h-10 group-hover:drop-shadow-[0_0_10px_rgba(210,164,76,0.6)] transition-all" />
                <div>
                  <span className="text-lg font-bold bg-owl-gradient bg-clip-text text-transparent">TYT</span>
                  <div className="text-xs text-gray-400">Owl Warrior</div>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50 shadow-gold-glow'
                          : 'hover:bg-owl-slate text-gray-300 hover:text-gold-200 hover:border-gold-700 border border-transparent'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gold-800 my-4 pt-4 space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </div>
                {bottomNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50 shadow-gold-glow'
                          : 'hover:bg-owl-slate text-gray-300 hover:text-gold-200 hover:border-gold-700 border border-transparent'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-t border-gold-800">
              <div className="mb-4 p-4 bg-owl-slate/50 rounded-lg border border-gold-800">
                <div className="text-sm text-gray-400 mb-1">Signed in as</div>
                <div className="text-sm font-semibold truncate text-gold-300">{user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 border border-transparent hover:border-red-500/50 transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 backdrop-blur-glass border-b border-gold-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gold-400 hover:text-gold-300"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <a
                  href="/community"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-owl-slate/50 transition-all text-sm text-gray-300 hover:text-gold-400"
                >
                  <Users size={18} />
                  <span>Community</span>
                </a>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-owl-slate/50 rounded-lg border border-gold-700 hover:border-gold-500 hover:shadow-gold-glow transition-all">
                  <div className="text-xl">🦉</div>
                  <span className="text-sm">
                    <span className="text-gray-400">Rank:</span>{' '}
                    <span className="font-semibold bg-owl-gradient bg-clip-text text-transparent">Worker Owl</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
