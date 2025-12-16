import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Web3Provider as WagmiWeb3Provider } from './lib/web3/Web3Provider';
import { MultiChainWeb3Provider } from './contexts/MultiChainWeb3Context';
import { Web3Provider } from './contexts/Web3Context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
);
