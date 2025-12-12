import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import CookieConsent from './components/CookieConsent';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Roadmap from './pages/Roadmap';
import Help from './pages/Help';
import FoundationPublic from './pages/Foundation';
import Tokenomics from './pages/Tokenomics';
import VIP from './pages/VIP';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/app/Dashboard';
import Miners from './pages/app/Miners';
import MinerDetail from './pages/app/MinerDetail';
import Rewards from './pages/app/Rewards';
import Wallet from './pages/app/Wallet';
import Marketplace from './pages/app/Marketplace';
import Academy from './pages/app/Academy';
import Foundation from './pages/app/Foundation';
import Settings from './pages/app/Settings';
import Profile from './pages/app/Profile';
import Transactions from './pages/app/Transactions';
import Referrals from './pages/app/Referrals';
import TYTTrading from './pages/app/TYTTrading';
import AdminWithdrawals from './pages/app/AdminWithdrawals';
import AdminUsers from './pages/app/AdminUsers';
import Notifications from './pages/app/Notifications';

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
    <>
      <CookieConsent />
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/help" element={<Help />} />
      <Route path="/foundation" element={<FoundationPublic />} />
      <Route path="/tokenomics" element={<Tokenomics />} />
      <Route path="/vip" element={<VIP />} />

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
                <Route path="rewards" element={<Rewards />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="tyt-trading" element={<TYTTrading />} />
                <Route path="academy" element={<Academy />} />
                <Route path="foundation" element={<Foundation />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="admin/withdrawals" element={<AdminWithdrawals />} />
                <Route path="admin/users" element={<AdminUsers />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
