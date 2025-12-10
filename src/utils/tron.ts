/**
 * TRON Blockchain Utilities
 *
 * Based on PDF specification:
 * - Primary blockchain: TRON (TRC-20/721)
 * - Optional bridges to EVM (Polygon) and Solana
 * - Multi-chain wallet support
 */

export type TronNetwork = 'mainnet' | 'shasta' | 'nile';
export type ChainType = 'TRON' | 'ETHEREUM' | 'POLYGON' | 'SOLANA' | 'BSC' | 'TON';

export interface TronWalletConfig {
  network: TronNetwork;
  privateKey?: string;
  fullNode: string;
  solidityNode: string;
  eventServer: string;
}

export interface MultiChainAddress {
  chain: ChainType;
  address: string;
  isActive: boolean;
}

export interface TRC20Token {
  contractAddress: string;
  symbol: string;
  decimals: number;
  name: string;
}

export interface TRC721NFT {
  contractAddress: string;
  tokenId: string;
  owner: string;
  metadata?: {
    hashrate: number;
    efficiency: number;
    power_level: number;
    farm_id?: string;
  };
}

/**
 * TRON Network Configuration
 */
export const TRON_NETWORKS: Record<TronNetwork, TronWalletConfig> = {
  mainnet: {
    network: 'mainnet',
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
  },
  shasta: {
    network: 'shasta',
    fullNode: 'https://api.shasta.trongrid.io',
    solidityNode: 'https://api.shasta.trongrid.io',
    eventServer: 'https://api.shasta.trongrid.io',
  },
  nile: {
    network: 'nile',
    fullNode: 'https://nile.trongrid.io',
    solidityNode: 'https://nile.trongrid.io',
    eventServer: 'https://nile.trongrid.io',
  },
};

/**
 * TYT Token Contract (TRC-20)
 * From PDF: Token created on pump.fun (Solana), bridged to TRON
 */
export const TYT_TOKEN_CONTRACTS: Record<ChainType, string> = {
  TRON: 'T...', // Deploy TRC-20 version
  SOLANA: 'pump.fun/...',
  ETHEREUM: '0x...',
  POLYGON: '0x...',
  BSC: '0x...',
  TON: 'EQ...',
};

/**
 * NFT Miner Contract (TRC-721)
 */
export const MINER_NFT_CONTRACT = {
  TRON: 'T...', // Deploy TRC-721 miners
  POLYGON: '0x...', // Optional bridge
};

/**
 * Convert TRX to Sun (1 TRX = 1,000,000 Sun)
 */
export function trxToSun(trx: number): number {
  return Math.floor(trx * 1_000_000);
}

/**
 * Convert Sun to TRX
 */
export function sunToTrx(sun: number): number {
  return sun / 1_000_000;
}

/**
 * Validate TRON address
 */
export function isValidTronAddress(address: string): boolean {
  // TRON addresses start with 'T' and are 34 characters
  return /^T[A-Za-z1-9]{33}$/.test(address);
}

/**
 * Convert hex address to base58 (TRON format)
 */
export function hexToBase58(hexAddress: string): string {
  // Implementation would use TronWeb library
  // Placeholder for now
  return hexAddress;
}

/**
 * Get explorer URL for transaction
 */
export function getTronScanUrl(txHash: string, network: TronNetwork = 'mainnet'): string {
  const baseUrls: Record<TronNetwork, string> = {
    mainnet: 'https://tronscan.org',
    shasta: 'https://shasta.tronscan.org',
    nile: 'https://nile.tronscan.org',
  };
  return `${baseUrls[network]}/#/transaction/${txHash}`;
}

/**
 * Estimate transaction fee in TRX
 */
export function estimateTronFee(operation: 'transfer' | 'contract' | 'nft_mint'): number {
  const fees: Record<string, number> = {
    transfer: 0.1, // ~0.1 TRX for basic transfer
    contract: 5, // ~5 TRX for contract interaction
    nft_mint: 10, // ~10 TRX for NFT minting
  };
  return fees[operation] || 1;
}

/**
 * Multi-chain withdrawal support
 * From PDF: BTC, Lightning, Liquid, wBTC, TRON, Solana, TON, XRP
 */
export interface WithdrawalOption {
  chain: ChainType | 'BITCOIN' | 'LIGHTNING' | 'LIQUID' | 'XRP';
  asset: string;
  minAmount: number;
  fee: number;
  estimatedTime: string;
  isActive: boolean;
}

export const WITHDRAWAL_OPTIONS: WithdrawalOption[] = [
  {
    chain: 'BITCOIN',
    asset: 'BTC',
    minAmount: 0.0001,
    fee: 0.00015,
    estimatedTime: '~30 min',
    isActive: true,
  },
  {
    chain: 'LIGHTNING',
    asset: 'BTC',
    minAmount: 0.000001,
    fee: 0.000001,
    estimatedTime: '< 1 min',
    isActive: true,
  },
  {
    chain: 'LIQUID',
    asset: 'L-BTC',
    minAmount: 0.0001,
    fee: 0.00001,
    estimatedTime: '~2 min',
    isActive: true,
  },
  {
    chain: 'ETHEREUM',
    asset: 'wBTC',
    minAmount: 0.001,
    fee: 0.0001,
    estimatedTime: '~15 min',
    isActive: true,
  },
  {
    chain: 'TRON',
    asset: 'TRX',
    minAmount: 10,
    fee: 0.1,
    estimatedTime: '~3 min',
    isActive: true,
  },
  {
    chain: 'TRON',
    asset: 'USDT-TRC20',
    minAmount: 10,
    fee: 1,
    estimatedTime: '~3 min',
    isActive: true,
  },
  {
    chain: 'SOLANA',
    asset: 'SOL',
    minAmount: 0.1,
    fee: 0.000005,
    estimatedTime: '~1 min',
    isActive: true,
  },
  {
    chain: 'SOLANA',
    asset: 'TYT',
    minAmount: 100,
    fee: 10,
    estimatedTime: '~1 min',
    isActive: true,
  },
  {
    chain: 'TON',
    asset: 'TON',
    minAmount: 1,
    fee: 0.01,
    estimatedTime: '~5 sec',
    isActive: true,
  },
  {
    chain: 'XRP',
    asset: 'XRP',
    minAmount: 10,
    fee: 0.1,
    estimatedTime: '~5 sec',
    isActive: true,
  },
];

/**
 * Get payment methods for fiat on-ramp
 * From PDF: Apple Pay, Google Pay, Binance Pay, Coinbase Pay, cards
 */
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'mobile_wallet' | 'crypto_wallet';
  icon: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  isAvailable: boolean;
  supportedRegions: string[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'mobile_wallet',
    icon: 'apple',
    minAmount: 10,
    maxAmount: 10000,
    fee: 3.5,
    isAvailable: true,
    supportedRegions: ['US', 'EU', 'UK'],
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    type: 'mobile_wallet',
    icon: 'google',
    minAmount: 10,
    maxAmount: 10000,
    fee: 3.5,
    isAvailable: true,
    supportedRegions: ['US', 'EU', 'UK', 'GLOBAL'],
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay',
    type: 'crypto_wallet',
    icon: 'binance',
    minAmount: 5,
    maxAmount: 50000,
    fee: 0,
    isAvailable: true,
    supportedRegions: ['GLOBAL'],
  },
  {
    id: 'coinbase_pay',
    name: 'Coinbase Pay',
    type: 'crypto_wallet',
    icon: 'coinbase',
    minAmount: 10,
    maxAmount: 25000,
    fee: 1,
    isAvailable: true,
    supportedRegions: ['US', 'EU', 'UK'],
  },
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: 'credit-card',
    minAmount: 20,
    maxAmount: 5000,
    fee: 3.9,
    isAvailable: true,
    supportedRegions: ['GLOBAL'],
  },
];

/**
 * Cross-chain bridge utilities
 */
export interface BridgeRoute {
  fromChain: ChainType;
  toChain: ChainType;
  asset: string;
  minAmount: number;
  estimatedFee: number;
  estimatedTime: string;
}

export const BRIDGE_ROUTES: BridgeRoute[] = [
  {
    fromChain: 'SOLANA',
    toChain: 'TRON',
    asset: 'TYT',
    minAmount: 100,
    estimatedFee: 5,
    estimatedTime: '~10 min',
  },
  {
    fromChain: 'ETHEREUM',
    toChain: 'POLYGON',
    asset: 'wBTC',
    minAmount: 0.01,
    estimatedFee: 0.001,
    estimatedTime: '~20 min',
  },
  {
    fromChain: 'TRON',
    toChain: 'BSC',
    asset: 'USDT',
    minAmount: 10,
    estimatedFee: 1,
    estimatedTime: '~15 min',
  },
];
