import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n/config';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider as WagmiWeb3Provider } from './lib/web3/Web3Provider';
import { MultiChainWeb3Provider } from './contexts/MultiChainWeb3Context';
import { Web3Provider } from './contexts/Web3Context';

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A1122] via-[#0f1729] to-[#0A1122] flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider>
        <LanguageProvider>
          <WagmiWeb3Provider>
            <BrowserRouter>
              <AuthProvider>
                <Web3Provider>
                  <MultiChainWeb3Provider>
                    <ToastProvider>
                      <App />
                    </ToastProvider>
                  </MultiChainWeb3Provider>
                </Web3Provider>
              </AuthProvider>
            </BrowserRouter>
          </WagmiWeb3Provider>
        </LanguageProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>
);
