import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="miners" element={<Miners />} />
                <Route path="miners/:id" element={<MinerDetail />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="academy" element={<Academy />} />
                <Route path="foundation" element={<Foundation />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
