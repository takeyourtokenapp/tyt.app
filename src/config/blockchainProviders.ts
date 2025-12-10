/**
 * Blockchain API Providers Configuration
 * Поддерживаемые сети и их API endpoints
 */

export type ChainId = 'BTC' | 'ETH' | 'SOL' | 'TRX' | 'XRP' | 'MATIC' | 'TON';

export interface ChainConfig {
  id: ChainId;
  name: string;
  symbol: string;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
  testnet?: {
    rpcUrl: string;
    explorerUrl: string;
  };
}

export const BLOCKCHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    rpcUrl: 'https://blockstream.info/api',
    explorerUrl: 'https://blockstream.info',
    testnet: {
      rpcUrl: 'https://blockstream.info/testnet/api',
      explorerUrl: 'https://blockstream.info/testnet',
    },
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    explorerUrl: 'https://etherscan.io',
    testnet: {
      rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2',
      explorerUrl: 'https://sepolia.etherscan.io',
    },
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    testnet: {
      rpcUrl: 'https://api.devnet.solana.com',
      explorerUrl: 'https://explorer.solana.com?cluster=devnet',
    },
  },
  TRX: {
    id: 'TRX',
    name: 'TRON',
    symbol: 'TRX',
    decimals: 6,
    rpcUrl: 'https://api.trongrid.io',
    explorerUrl: 'https://tronscan.org',
    testnet: {
      rpcUrl: 'https://api.shasta.trongrid.io',
      explorerUrl: 'https://shasta.tronscan.org',
    },
  },
  XRP: {
    id: 'XRP',
    name: 'XRP Ledger',
    symbol: 'XRP',
    decimals: 6,
    rpcUrl: 'https://s1.ripple.com:51234',
    explorerUrl: 'https://livenet.xrpl.org',
    testnet: {
      rpcUrl: 'https://s.altnet.rippletest.net:51234',
      explorerUrl: 'https://testnet.xrpl.org',
    },
  },
  MATIC: {
    id: 'MATIC',
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2',
    explorerUrl: 'https://polygonscan.com',
    testnet: {
      rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2',
      explorerUrl: 'https://mumbai.polygonscan.com',
    },
  },
  TON: {
    id: 'TON',
    name: 'TON',
    symbol: 'TON',
    decimals: 9,
    rpcUrl: 'https://toncenter.com/api/v2',
    explorerUrl: 'https://tonscan.org',
    testnet: {
      rpcUrl: 'https://testnet.toncenter.com/api/v2',
      explorerUrl: 'https://testnet.tonscan.org',
    },
  },
};

/**
 * API Provider Keys (должны быть в .env)
 */
export const API_KEYS = {
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || '',
  INFURA_API_KEY: import.meta.env.VITE_INFURA_API_KEY || '',
  TRONGRID_API_KEY: import.meta.env.VITE_TRONGRID_API_KEY || '',
  BLOCKSTREAM_API_KEY: import.meta.env.VITE_BLOCKSTREAM_API_KEY || '',
  TONCENTER_API_KEY: import.meta.env.VITE_TONCENTER_API_KEY || '',
};

/**
 * Получить RPC URL с API ключом
 */
export function getRpcUrl(chainId: ChainId, useTestnet = false): string {
  const config = BLOCKCHAIN_CONFIGS[chainId];
  const baseUrl = useTestnet && config.testnet ? config.testnet.rpcUrl : config.rpcUrl;

  switch (chainId) {
    case 'ETH':
    case 'MATIC':
      return `${baseUrl}/${API_KEYS.ALCHEMY_API_KEY}`;
    case 'TRX':
      return baseUrl; // API key передается в headers
    case 'TON':
      return baseUrl; // API key передается в query params
    default:
      return baseUrl;
  }
}

/**
 * Получить explorer URL для транзакции
 */
export function getExplorerTxUrl(chainId: ChainId, txHash: string, useTestnet = false): string {
  const config = BLOCKCHAIN_CONFIGS[chainId];
  const explorerUrl = useTestnet && config.testnet ? config.testnet.explorerUrl : config.explorerUrl;

  switch (chainId) {
    case 'BTC':
      return `${explorerUrl}/tx/${txHash}`;
    case 'ETH':
    case 'MATIC':
      return `${explorerUrl}/tx/${txHash}`;
    case 'SOL':
      return `${explorerUrl}/tx/${txHash}`;
    case 'TRX':
      return `${explorerUrl}/#/transaction/${txHash}`;
    case 'XRP':
      return `${explorerUrl}/transactions/${txHash}`;
    case 'TON':
      return `${explorerUrl}/tx/${txHash}`;
    default:
      return `${explorerUrl}/${txHash}`;
  }
}

/**
 * Получить explorer URL для адреса
 */
export function getExplorerAddressUrl(chainId: ChainId, address: string, useTestnet = false): string {
  const config = BLOCKCHAIN_CONFIGS[chainId];
  const explorerUrl = useTestnet && config.testnet ? config.testnet.explorerUrl : config.explorerUrl;

  switch (chainId) {
    case 'BTC':
      return `${explorerUrl}/address/${address}`;
    case 'ETH':
    case 'MATIC':
      return `${explorerUrl}/address/${address}`;
    case 'SOL':
      return `${explorerUrl}/address/${address}`;
    case 'TRX':
      return `${explorerUrl}/#/address/${address}`;
    case 'XRP':
      return `${explorerUrl}/accounts/${address}`;
    case 'TON':
      return `${explorerUrl}/address/${address}`;
    default:
      return `${explorerUrl}/${address}`;
  }
}

/**
 * Форматирование суммы с учетом decimals
 */
export function formatAmount(amount: string | number, chainId: ChainId): string {
  const config = BLOCKCHAIN_CONFIGS[chainId];
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (value / Math.pow(10, config.decimals)).toFixed(config.decimals);
}

/**
 * Конвертация суммы в базовые единицы
 */
export function toBaseUnits(amount: string | number, chainId: ChainId): string {
  const config = BLOCKCHAIN_CONFIGS[chainId];
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.floor(value * Math.pow(10, config.decimals)).toString();
}

/**
 * Валидация адреса для конкретного блокчейна
 */
export function validateAddress(address: string, chainId: ChainId): boolean {
  switch (chainId) {
    case 'BTC':
      // Bitcoin: начинается с 1, 3, или bc1
      return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
    case 'ETH':
    case 'MATIC':
      // Ethereum: 0x + 40 hex символов
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'SOL':
      // Solana: base58, 32-44 символа
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    case 'TRX':
      // TRON: начинается с T + 33 символа
      return /^T[a-zA-Z0-9]{33}$/.test(address);
    case 'XRP':
      // XRP: r + 25-34 символа
      return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
    case 'TON':
      // TON: EQ или UQ + base64
      return /^(EQ|UQ)[a-zA-Z0-9_-]{46,48}$/.test(address);
    default:
      return false;
  }
}
