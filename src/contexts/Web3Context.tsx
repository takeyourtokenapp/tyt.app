import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

interface Web3Wallet {
  id: string;
  wallet_address: string;
  wallet_type: string;
  blockchain: string;
  is_primary: boolean;
  last_connected_at: string;
  created_at: string;
}

interface Web3ContextType {
  wallets: Web3Wallet[];
  connectedWallet: Web3Wallet | null;
  isConnecting: boolean;
  connectPhantom: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshWallets: () => Promise<void>;
  getProvider: () => PhantomProvider | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Web3Wallet[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<Web3Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const getProvider = (): PhantomProvider | null => {
    if ('phantom' in window) {
      const provider = (window as any).phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    if ('solana' in window) {
      const provider = (window as any).solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  };

  const refreshWallets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_web3_wallets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWallets(data);
      const primary = data.find(w => w.is_primary);
      if (primary) {
        setConnectedWallet(primary);
      }
    }
  };

  const connectPhantom = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    const provider = getProvider();
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      alert('Phantom wallet not detected. Please install Phantom extension.');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await provider.connect();
      const walletAddress = response.publicKey.toString();

      const { data: existing } = await supabase
        .from('user_web3_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('wallet_address', walletAddress)
        .single();

      if (existing) {
        await supabase
          .from('user_web3_wallets')
          .update({
            last_connected_at: new Date().toISOString(),
            is_primary: true
          })
          .eq('id', existing.id);

        await supabase
          .from('user_web3_wallets')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .neq('id', existing.id);

        setConnectedWallet(existing);
      } else {
        await supabase
          .from('user_web3_wallets')
          .update({ is_primary: false })
          .eq('user_id', user.id);

        const { data: newWallet, error } = await supabase
          .from('user_web3_wallets')
          .insert({
            user_id: user.id,
            wallet_address: walletAddress,
            wallet_type: 'phantom',
            blockchain: 'solana',
            is_primary: true
          })
          .select()
          .single();

        if (error) throw error;
        setConnectedWallet(newWallet);
      }

      await refreshWallets();
      alert(`Phantom wallet connected!\n${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`);
    } catch (error) {
      console.error('Error connecting Phantom:', error);
      alert('Failed to connect Phantom wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }

    if (connectedWallet && user) {
      await supabase
        .from('user_web3_wallets')
        .update({ is_primary: false })
        .eq('id', connectedWallet.id);
    }

    setConnectedWallet(null);
    await refreshWallets();
  };

  useEffect(() => {
    if (user) {
      refreshWallets();
    } else {
      setWallets([]);
      setConnectedWallet(null);
    }
  }, [user]);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const handleAccountChanged = (publicKey: any) => {
      if (publicKey) {
        refreshWallets();
      } else {
        setConnectedWallet(null);
      }
    };

    provider.on('accountChanged', handleAccountChanged);

    return () => {
      provider.off('accountChanged', handleAccountChanged);
    };
  }, []);

  const value: Web3ContextType = {
    wallets,
    connectedWallet,
    isConnecting,
    connectPhantom,
    disconnectWallet,
    refreshWallets,
    getProvider
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}
