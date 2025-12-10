import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export type BlockchainNetwork = 'solana' | 'ethereum' | 'bsc' | 'polygon' | 'tron';
export type WalletType = 'phantom' | 'metamask' | 'tronlink' | 'walletconnect';

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

export interface MetaMaskProvider {
  isMetaMask?: boolean;
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(event: string, callback: (...args: any[]) => void): void;
  removeListener(event: string, callback: (...args: any[]) => void): void;
}

export interface TronLinkProvider {
  ready?: boolean;
  tronWeb?: any;
  request(args: { method: string; params?: any }): Promise<any>;
}

export interface Web3Wallet {
  id: string;
  wallet_address: string;
  wallet_type: WalletType;
  blockchain: BlockchainNetwork;
  is_primary: boolean;
  last_connected_at: string;
  created_at: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number | string;
  rpcUrl: string;
  symbol: string;
  blockExplorer: string;
  supportedWallets: WalletType[];
}

export const NETWORK_CONFIGS: Record<BlockchainNetwork, NetworkConfig> = {
  solana: {
    name: 'Solana Mainnet',
    chainId: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    symbol: 'SOL',
    blockExplorer: 'https://explorer.solana.com',
    supportedWallets: ['phantom', 'walletconnect']
  },
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
    supportedWallets: ['metamask', 'walletconnect']
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    blockExplorer: 'https://bscscan.com',
    supportedWallets: ['metamask', 'walletconnect']
  },
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com',
    supportedWallets: ['metamask', 'walletconnect']
  },
  tron: {
    name: 'TRON Mainnet',
    chainId: '0x2b6653dc',
    rpcUrl: 'https://api.trongrid.io',
    symbol: 'TRX',
    blockExplorer: 'https://tronscan.org',
    supportedWallets: ['tronlink', 'walletconnect']
  }
};

interface MultiChainWeb3ContextType {
  wallets: Web3Wallet[];
  connectedWallets: Record<BlockchainNetwork, Web3Wallet | null>;
  currentNetwork: BlockchainNetwork;
  isConnecting: boolean;

  setCurrentNetwork: (network: BlockchainNetwork) => void;
  connectWallet: (network: BlockchainNetwork, walletType: WalletType) => Promise<void>;
  disconnectWallet: (network: BlockchainNetwork) => Promise<void>;
  switchNetwork: (network: BlockchainNetwork) => Promise<void>;
  refreshWallets: () => Promise<void>;

  getProvider: (network: BlockchainNetwork) => any;
  getPhantomProvider: () => PhantomProvider | null;
  getMetaMaskProvider: () => MetaMaskProvider | null;
  getTronLinkProvider: () => TronLinkProvider | null;
}

const MultiChainWeb3Context = createContext<MultiChainWeb3ContextType | undefined>(undefined);

export function MultiChainWeb3Provider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Web3Wallet[]>([]);
  const [connectedWallets, setConnectedWallets] = useState<Record<BlockchainNetwork, Web3Wallet | null>>({
    solana: null,
    ethereum: null,
    bsc: null,
    polygon: null,
    tron: null
  });
  const [currentNetwork, setCurrentNetwork] = useState<BlockchainNetwork>('solana');
  const [isConnecting, setIsConnecting] = useState(false);

  const getPhantomProvider = (): PhantomProvider | null => {
    if ('phantom' in window) {
      const provider = (window as any).phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    if ('solana' in window) {
      const provider = (window as any).solana;
      if (provider?.isPhantom) return provider;
    }
    return null;
  };

  const getMetaMaskProvider = (): MetaMaskProvider | null => {
    if ('ethereum' in window) {
      const provider = (window as any).ethereum;
      if (provider?.isMetaMask) return provider;
    }
    return null;
  };

  const getTronLinkProvider = (): TronLinkProvider | null => {
    if ('tronLink' in window) {
      const tronLink = (window as any).tronLink;
      if (tronLink?.ready) return tronLink;
    }
    return null;
  };

  const getProvider = (network: BlockchainNetwork): any => {
    switch (network) {
      case 'solana':
        return getPhantomProvider();
      case 'ethereum':
      case 'bsc':
      case 'polygon':
        return getMetaMaskProvider();
      case 'tron':
        return getTronLinkProvider();
      default:
        return null;
    }
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

      const connected: Record<BlockchainNetwork, Web3Wallet | null> = {
        solana: null,
        ethereum: null,
        bsc: null,
        polygon: null,
        tron: null
      };

      data.forEach(wallet => {
        if (wallet.is_primary && wallet.blockchain in connected) {
          connected[wallet.blockchain as BlockchainNetwork] = wallet;
        }
      });

      setConnectedWallets(connected);
    }
  };

  const connectPhantom = async (): Promise<string> => {
    const provider = getPhantomProvider();
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      throw new Error('Phantom wallet not detected');
    }

    const response = await provider.connect();
    return response.publicKey.toString();
  };

  const connectMetaMask = async (chainId: number): Promise<string> => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      window.open('https://metamask.io/', '_blank');
      throw new Error('MetaMask not detected');
    }

    const chainIdHex = `0x${chainId.toString(16)}`;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        throw new Error('Network not added to MetaMask');
      }
      throw switchError;
    }

    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  };

  const connectTronLink = async (): Promise<string> => {
    const provider = getTronLinkProvider();
    if (!provider) {
      window.open('https://www.tronlink.org/', '_blank');
      throw new Error('TronLink not detected');
    }

    const result = await provider.request({ method: 'tron_requestAccounts' });
    if (!result?.code || result.code !== 200) {
      throw new Error('TronLink connection rejected');
    }

    return provider.tronWeb?.defaultAddress?.base58 || '';
  };

  const connectWallet = async (network: BlockchainNetwork, walletType: WalletType) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    setIsConnecting(true);
    try {
      let walletAddress: string;

      if (walletType === 'phantom' && network === 'solana') {
        walletAddress = await connectPhantom();
      } else if (walletType === 'metamask' && ['ethereum', 'bsc', 'polygon'].includes(network)) {
        const chainId = NETWORK_CONFIGS[network].chainId as number;
        walletAddress = await connectMetaMask(chainId);
      } else if (walletType === 'tronlink' && network === 'tron') {
        walletAddress = await connectTronLink();
      } else {
        throw new Error(`Unsupported wallet type ${walletType} for network ${network}`);
      }

      const { data: existing } = await supabase
        .from('user_web3_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('wallet_address', walletAddress)
        .eq('blockchain', network)
        .maybeSingle();

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
          .eq('blockchain', network)
          .neq('id', existing.id);
      } else {
        await supabase
          .from('user_web3_wallets')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .eq('blockchain', network);

        await supabase
          .from('user_web3_wallets')
          .insert({
            user_id: user.id,
            wallet_address: walletAddress,
            wallet_type: walletType,
            blockchain: network,
            is_primary: true
          });
      }

      await refreshWallets();
      alert(`${walletType} connected!\n${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`);
    } catch (error: any) {
      console.error(`Error connecting ${walletType}:`, error);
      alert(error.message || `Failed to connect ${walletType}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (network: BlockchainNetwork) => {
    const wallet = connectedWallets[network];
    if (!wallet || !user) return;

    try {
      if (network === 'solana') {
        const provider = getPhantomProvider();
        if (provider) await provider.disconnect();
      }

      await supabase
        .from('user_web3_wallets')
        .update({ is_primary: false })
        .eq('id', wallet.id);

      await refreshWallets();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const switchNetwork = async (network: BlockchainNetwork) => {
    if (network === 'solana') {
      setCurrentNetwork(network);
      return;
    }

    const provider = getMetaMaskProvider();
    if (!provider) return;

    const config = NETWORK_CONFIGS[network];
    if (typeof config.chainId !== 'number') return;

    const chainIdHex = `0x${config.chainId.toString(16)}`;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      setCurrentNetwork(network);
    } catch (error: any) {
      if (error.code === 4902) {
        alert(`Please add ${config.name} to your wallet`);
      }
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      refreshWallets();
    } else {
      setWallets([]);
      setConnectedWallets({
        solana: null,
        ethereum: null,
        bsc: null,
        polygon: null,
        tron: null
      });
    }
  }, [user]);

  useEffect(() => {
    const phantomProvider = getPhantomProvider();
    if (phantomProvider) {
      const handleAccountChanged = () => refreshWallets();
      phantomProvider.on('accountChanged', handleAccountChanged);
      return () => phantomProvider.off('accountChanged', handleAccountChanged);
    }
  }, []);

  useEffect(() => {
    const metaMaskProvider = getMetaMaskProvider();
    if (metaMaskProvider) {
      const handleAccountsChanged = () => refreshWallets();
      const handleChainChanged = () => window.location.reload();

      metaMaskProvider.on('accountsChanged', handleAccountsChanged);
      metaMaskProvider.on('chainChanged', handleChainChanged);

      return () => {
        metaMaskProvider.removeListener('accountsChanged', handleAccountsChanged);
        metaMaskProvider.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value: MultiChainWeb3ContextType = {
    wallets,
    connectedWallets,
    currentNetwork,
    isConnecting,
    setCurrentNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshWallets,
    getProvider,
    getPhantomProvider,
    getMetaMaskProvider,
    getTronLinkProvider
  };

  return (
    <MultiChainWeb3Context.Provider value={value}>
      {children}
    </MultiChainWeb3Context.Provider>
  );
}

export function useMultiChainWeb3() {
  const context = useContext(MultiChainWeb3Context);
  if (!context) {
    throw new Error('useMultiChainWeb3 must be used within MultiChainWeb3Provider');
  }
  return context;
}
