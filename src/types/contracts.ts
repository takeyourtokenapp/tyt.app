export interface MinerNFTMetadata {
  tokenId: string;
  powerTh: number;
  efficiencyWth: number;
  maintenanceRate: number;
  farmId: number;
  status: 'active' | 'delinquent' | 'locked';
  reinvestPct: number;
}

export interface TYTTokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  burnedTotal: string;
}

export interface MarketplaceOrder {
  orderId: string;
  minerId: string;
  sellerId: string;
  priceAsset: 'TYT' | 'USDT' | 'BTC';
  priceAmount: string;
  orderType: 'listing' | 'bid';
  status: 'open' | 'filled' | 'cancelled';
  createdAt: Date;
}

export interface BurnEvent {
  id: string;
  amountTyt: string;
  windowId: number;
  txHash?: string;
  reportUri?: string;
  createdAt: Date;
}

export interface RewardProof {
  minerId: string;
  date: string;
  grossBtc: string;
  maintenanceBtc: string;
  netBtc: string;
  merkleLeaf: string;
  merkleProof: string[];
  merkleRoot: string;
}
