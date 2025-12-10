import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Cpu,
  TrendingUp,
  ShoppingCart,
  Wallet,
  GraduationCap,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Shield
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
    { path: '/app/rewards', icon: TrendingUp, label: 'Rewards' },
    { path: '/app/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { path: '/app/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/app/academy', icon: GraduationCap, label: 'Academy' },
    { path: '/app/foundation', icon: Heart, label: 'Foundation' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <Link to="/app" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-xl">
                  TYT
                </div>
                <span className="text-xl font-semibold">TYT</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                        : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-800">
              <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Signed in as</div>
                <div className="text-sm font-semibold truncate">{user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">
                    <span className="text-gray-400">Rank:</span>{' '}
                    <span className="font-semibold text-amber-400">Worker</span>
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
