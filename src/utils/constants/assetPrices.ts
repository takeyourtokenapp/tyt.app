export const ASSET_PRICES: Record<string, number> = {
  BTC: 95000,
  ETH: 3500,
  SOL: 140,
  TRX: 0.15,
  XRP: 2.5,
  TYT: 0.05,
  USDT: 1
};

export function getAssetPrice(asset: string): number {
  return ASSET_PRICES[asset] || 0;
}

export function calculateUSDValue(amount: number, asset: string): number {
  return amount * getAssetPrice(asset);
}
