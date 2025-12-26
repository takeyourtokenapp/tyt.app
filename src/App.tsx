import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AoiProvider } from './contexts/AoiContext';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';
import AnnouncementBanner from './components/AnnouncementBanner';
import LiveSupportWidget from './components/LiveSupportWidget';
import EnhancedPriceTicker from './components/EnhancedPriceTicker';
import PublicLayout from './components/PublicLayout';
import AppLayout from './components/AppLayout';

// Public pages - loaded eagerly for fast initial load
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load all other pages
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const About = lazy(() => import('./pages/About'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Help = lazy(() => import('./pages/Help'));
const FoundationPublic = lazy(() => import('./pages/Foundation'));
const Tokenomics = lazy(() => import('./pages/Tokenomics'));
const VIP = lazy(() => import('./pages/VIP'));
const Community = lazy(() => import('./pages/Community'));
const SupabaseTest = lazy(() => import('./pages/SupabaseTest'));
const AuthTest = lazy(() => import('./pages/AuthTest'));

// App pages - lazy loaded for better code splitting
const Dashboard = lazy(() => import('./pages/app/Dashboard'));
const Miners = lazy(() => import('./pages/app/Miners'));
const MinerDetail = lazy(() => import('./pages/app/MinerDetail'));
const Rewards = lazy(() => import('./pages/app/Rewards'));
const WalletUnified = lazy(() => import('./pages/app/WalletUnified'));
const Marketplace = lazy(() => import('./pages/app/Marketplace'));
const Academy = lazy(() => import('./pages/app/Academy'));
const Foundation = lazy(() => import('./pages/app/Foundation'));
const Settings = lazy(() => import('./pages/app/Settings'));
const Profile = lazy(() => import('./pages/app/Profile'));
const Transactions = lazy(() => import('./pages/app/Transactions'));
const Referrals = lazy(() => import('./pages/app/Referrals'));
const TYTTrading = lazy(() => import('./pages/app/TYTTrading'));
const AdminWithdrawals = lazy(() => import('./pages/app/AdminWithdrawals'));
const AdminUsers = lazy(() => import('./pages/app/AdminUsers'));
const Notifications = lazy(() => import('./pages/app/Notifications'));
const Governance = lazy(() => import('./pages/app/Governance'));
const MiningStatsDashboard = lazy(() => import('./components/MiningStatsDashboard'));
const Certificates = lazy(() => import('./pages/app/Certificates'));
const BurnReports = lazy(() => import('./pages/app/BurnReports'));
const Avatars = lazy(() => import('./pages/app/Avatars'));
const DataCenter = lazy(() => import('./pages/app/DataCenter'));
const Calculators = lazy(() => import('./pages/app/Calculators'));
const CharityStaking = lazy(() => import('./pages/app/CharityStaking'));
const Leaderboard = lazy(() => import('./pages/app/Leaderboard'));
const KYC = lazy(() => import('./pages/app/KYC'));
const Quests = lazy(() => import('./pages/app/Quests'));
const Grants = lazy(() => import('./pages/app/Grants'));
const Clans = lazy(() => import('./pages/app/Clans'));
const Swap = lazy(() => import('./pages/app/Swap'));
const Bridge = lazy(() => import('./pages/app/Bridge'));
const AdminContracts = lazy(() => import('./pages/app/AdminContracts'));
const AoiProfile = lazy(() => import('./pages/app/AoiProfile'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AoiProvider>
        <AnnouncementBanner />
        <EnhancedPriceTicker />
        <CookieConsent />
        <LiveSupportWidget />
        <Suspense fallback={<PageLoader />}>
          <Routes>
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout showFooter={false}><Login /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout showFooter={false}><Signup /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/roadmap" element={<PublicLayout><Roadmap /></PublicLayout>} />
      <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
      <Route path="/foundation" element={<PublicLayout><FoundationPublic /></PublicLayout>} />
      <Route path="/tokenomics" element={<PublicLayout><Tokenomics /></PublicLayout>} />
      <Route path="/vip" element={<PublicLayout><VIP /></PublicLayout>} />
      <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />
      <Route path="/test-supabase" element={<SupabaseTest />} />
      <Route path="/test-auth" element={<AuthTest />} />

      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="miners" element={<Miners />} />
                <Route path="miners/:id" element={<MinerDetail />} />
                <Route path="mining-stats" element={<MiningStatsDashboard />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="wallet" element={<WalletUnified />} />
                <Route path="swap" element={<Swap />} />
                <Route path="bridge" element={<Bridge />} />
                <Route path="tyt-trading" element={<TYTTrading />} />
                <Route path="academy" element={<Academy />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="charity-staking" element={<CharityStaking />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="foundation" element={<Foundation />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="governance" element={<Governance />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="burn-reports" element={<BurnReports />} />
                <Route path="avatars" element={<Avatars />} />
                <Route path="data-center" element={<DataCenter />} />
                <Route path="kyc" element={<KYC />} />
                <Route path="quests" element={<Quests />} />
                <Route path="grants" element={<Grants />} />
                <Route path="clans" element={<Clans />} />
                <Route path="aoi" element={<AoiProfile />} />
                <Route path="admin/withdrawals" element={<AdminWithdrawals />} />
                <Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/contracts" element={<AdminContracts />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </AoiProvider>
    </ErrorBoundary>
  );
}

export default App;
