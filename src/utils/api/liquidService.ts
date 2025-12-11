import { supabase } from '../../lib/supabase';

export interface LiquidAsset {
  id: string;
  assetId: string;
  assetType: 'lbtc' | 'usdt' | 'custom';
  liquidAddress: string;
  balance: number;
  unconfirmedBalance: number;
  assetName?: string;
  ticker?: string;
  precision: number;
  isConfidential: boolean;
}

export interface LiquidTransaction {
  txid: string;
  assetId: string;
  amount: number;
  fee: number;
  confirmations: number;
  isConfidential: boolean;
  createdAt: string;
}

class LiquidService {
  async generateLiquidAddress(
    userId: string,
    assetType: 'lbtc' | 'usdt' | 'custom' = 'lbtc',
    assetId?: string
  ): Promise<LiquidAsset> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-liquid-address', {
        body: {
          userId,
          assetType,
          assetId,
        },
      });

      if (error) throw error;

      return {
        id: data.id,
        assetId: data.asset_id,
        assetType: data.asset_type,
        liquidAddress: data.liquid_address,
        balance: data.balance || 0,
        unconfirmedBalance: data.unconfirmed_balance || 0,
        assetName: data.asset_name,
        ticker: data.ticker,
        precision: data.precision || 8,
        isConfidential: data.is_confidential !== false,
      };
    } catch (error: any) {
      console.error('Generate Liquid address error:', error);
      throw new Error(error.message || 'Failed to generate Liquid address');
    }
  }

  async getUserAssets(userId: string): Promise<LiquidAsset[]> {
    try {
      const { data, error } = await supabase
        .from('liquid_assets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map((asset) => ({
        id: asset.id,
        assetId: asset.asset_id,
        assetType: asset.asset_type,
        liquidAddress: asset.liquid_address,
        balance: asset.balance || 0,
        unconfirmedBalance: asset.unconfirmed_balance || 0,
        assetName: asset.asset_name,
        ticker: asset.ticker,
        precision: asset.precision || 8,
        isConfidential: asset.is_confidential !== false,
      }));
    } catch (error) {
      console.error('Get user Liquid assets error:', error);
      return [];
    }
  }

  async getLBTCBalance(userId: string): Promise<{
    balance: number;
    unconfirmedBalance: number;
    totalBalance: number;
  }> {
    try {
      const assets = await this.getUserAssets(userId);
      const lbtcAsset = assets.find((a) => a.assetType === 'lbtc');

      if (!lbtcAsset) {
        return {
          balance: 0,
          unconfirmedBalance: 0,
          totalBalance: 0,
        };
      }

      return {
        balance: lbtcAsset.balance,
        unconfirmedBalance: lbtcAsset.unconfirmedBalance,
        totalBalance: lbtcAsset.balance + lbtcAsset.unconfirmedBalance,
      };
    } catch (error) {
      console.error('Get L-BTC balance error:', error);
      return {
        balance: 0,
        unconfirmedBalance: 0,
        totalBalance: 0,
      };
    }
  }

  async sendLiquidAsset(params: {
    userId: string;
    assetId: string;
    toAddress: string;
    amount: number;
    isConfidential?: boolean;
  }): Promise<{
    success: boolean;
    txid?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-liquid-asset', {
        body: {
          userId: params.userId,
          assetId: params.assetId,
          toAddress: params.toAddress,
          amount: params.amount,
          isConfidential: params.isConfidential !== false,
        },
      });

      if (error) throw error;

      return {
        success: true,
        txid: data.txid,
      };
    } catch (error: any) {
      console.error('Send Liquid asset error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send Liquid asset',
      };
    }
  }

  async pegIn(params: {
    userId: string;
    btcAmount: number;
    liquidAddress: string;
  }): Promise<{
    success: boolean;
    btcAddress?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('liquid-peg-in', {
        body: {
          userId: params.userId,
          btcAmount: params.btcAmount,
          liquidAddress: params.liquidAddress,
        },
      });

      if (error) throw error;

      return {
        success: true,
        btcAddress: data.btc_address,
      };
    } catch (error: any) {
      console.error('Liquid peg-in error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate peg-in',
      };
    }
  }

  async pegOut(params: {
    userId: string;
    lbtcAmount: number;
    btcAddress: string;
  }): Promise<{
    success: boolean;
    txid?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('liquid-peg-out', {
        body: {
          userId: params.userId,
          lbtcAmount: params.lbtcAmount,
          btcAddress: params.btcAddress,
        },
      });

      if (error) throw error;

      return {
        success: true,
        txid: data.txid,
      };
    } catch (error: any) {
      console.error('Liquid peg-out error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate peg-out',
      };
    }
  }

  async syncAssetBalance(assetId: string): Promise<void> {
    try {
      await supabase.functions.invoke('sync-liquid-balance', {
        body: { assetId },
      });
    } catch (error) {
      console.error('Sync Liquid balance error:', error);
    }
  }

  formatLiquidAddress(address: string): string {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  }

  satsToLBTC(sats: number): string {
    return (sats / 100000000).toFixed(8);
  }

  lbtcToSats(lbtc: number): number {
    return Math.round(lbtc * 100000000);
  }
}

export const liquidService = new LiquidService();
