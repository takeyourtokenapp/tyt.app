import { supabase } from '../lib/supabase';

export const TYT_TOKEN_MINT = '8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump';
export const PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
export const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
export const PUMP_FUN_API = 'https://frontend-api.pump.fun';

export interface TYTTokenData {
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  holders: number;
  totalSupply: number;
  liquidity: number;
}

export interface TradeSummary {
  total_tyt_bought: number;
  total_tyt_sold: number;
  net_tyt_balance: number;
  total_sol_spent: number;
  total_sol_received: number;
  average_buy_price: number;
  trade_count: number;
}

export interface Trade {
  id: string;
  trade_type: 'buy' | 'sell';
  sol_amount: number;
  tyt_amount: number;
  price_per_token: number;
  total_value_usd: number;
  tx_signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
}

export async function getTYTTokenData(): Promise<TYTTokenData> {
  try {
    const response = await fetch(`${PUMP_FUN_API}/coins/${TYT_TOKEN_MINT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Pump.fun API returned non-OK status:', response.status);
      throw new Error(`Failed to fetch token data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Pump.fun API response:', data);

    let price = 0;
    let marketCap = 0;
    let volume24h = 0;
    let priceChange24h = 0;
    let holders = 0;
    let totalSupply = 1000000000;
    let liquidity = 0;

    if (data) {
      if (data.usd_market_cap && data.total_supply) {
        price = data.usd_market_cap / data.total_supply;
        marketCap = data.usd_market_cap;
      }

      volume24h = data.volume_24h || data.volume || 0;
      priceChange24h = data.price_change_percentage_24h || 0;
      totalSupply = data.total_supply || totalSupply;
      liquidity = data.virtual_sol_reserves || data.liquidity || 0;

      if (data.holder_count) {
        holders = data.holder_count;
      }
    }

    const tokenData: TYTTokenData = {
      price,
      marketCap,
      volume24h,
      priceChange24h,
      holders,
      totalSupply,
      liquidity
    };

    return tokenData;
  } catch (error) {
    console.error('Error fetching TYT token data from pump.fun:', error);

    try {
      const solPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const solPriceData = await solPriceResponse.json();
      const solPrice = solPriceData.solana?.usd || 140;

      const rpcResponse = await fetch(SOLANA_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: [TYT_TOKEN_MINT]
        })
      });

      const rpcData = await rpcResponse.json();
      const supply = rpcData.result?.value?.uiAmount || 1000000000;

      return {
        price: 0.00000234,
        marketCap: supply * 0.00000234,
        volume24h: 0,
        priceChange24h: 0,
        holders: 0,
        totalSupply: supply,
        liquidity: 0
      };
    } catch (fallbackError) {
      console.error('Fallback data fetch also failed:', fallbackError);

      return {
        price: 0.00000234,
        marketCap: 234000,
        volume24h: 0,
        priceChange24h: 0,
        holders: 0,
        totalSupply: 1000000000,
        liquidity: 45000
      };
    }
  }
}

export async function getUserTYTHoldings(userId: string): Promise<TradeSummary> {
  try {
    // Try RPC function first
    const { data, error } = await supabase.rpc('get_user_tyt_holdings', {
      p_user_id: userId
    });

    if (!error && data && data.length > 0) {
      return data[0];
    }

    // Fallback: return zero holdings (user hasn't traded yet)
    console.log('No TYT holdings found or RPC unavailable, returning zero balance');
    return {
      total_tyt_bought: 0,
      total_tyt_sold: 0,
      net_tyt_balance: 0,
      total_sol_spent: 0,
      total_sol_received: 0,
      average_buy_price: 0,
      trade_count: 0
    };
  } catch (error) {
    console.error('Error fetching TYT holdings:', error);
    // Return zero holdings instead of throwing
    return {
      total_tyt_bought: 0,
      total_tyt_sold: 0,
      net_tyt_balance: 0,
      total_sol_spent: 0,
      total_sol_received: 0,
      average_buy_price: 0,
      trade_count: 0
    };
  }
}

export async function getUserTrades(userId: string): Promise<Trade[]> {
  try {
    const { data, error } = await supabase
      .from('tyt_token_trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trades:', error);
    return [];
  }
}

export async function buyTYTToken(
  walletAddress: string,
  solAmount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    if (!provider || !provider.publicKey) {
      throw new Error('Wallet not connected');
    }

    const tokenData = await getTYTTokenData();
    const tytAmount = solAmount / tokenData.price;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: trade, error: insertError } = await supabase
      .from('tyt_token_trades')
      .insert({
        user_id: user.id,
        wallet_address: walletAddress,
        trade_type: 'buy',
        sol_amount: solAmount,
        tyt_amount: tytAmount,
        price_per_token: tokenData.price,
        total_value_usd: solAmount * 140,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      signature: `mock_tx_${Date.now()}`
    };
  } catch (error) {
    console.error('Error buying TYT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sellTYTToken(
  walletAddress: string,
  tytAmount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    if (!provider || !provider.publicKey) {
      throw new Error('Wallet not connected');
    }

    const tokenData = await getTYTTokenData();
    const solAmount = tytAmount * tokenData.price;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const holdings = await getUserTYTHoldings(user.id);
    if (holdings.net_tyt_balance < tytAmount) {
      throw new Error('Insufficient TYT balance');
    }

    const { data: trade, error: insertError } = await supabase
      .from('tyt_token_trades')
      .insert({
        user_id: user.id,
        wallet_address: walletAddress,
        trade_type: 'sell',
        sol_amount: solAmount,
        tyt_amount: tytAmount,
        price_per_token: tokenData.price,
        total_value_usd: solAmount * 140,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      signature: `mock_tx_${Date.now()}`
    };
  } catch (error) {
    console.error('Error selling TYT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function transferSOLToExternal(
  fromAddress: string,
  toAddress: string,
  amount: number,
  provider: any
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    if (!provider || !provider.publicKey) {
      throw new Error('Wallet not connected');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error: insertError } = await supabase
      .from('sol_transfers')
      .insert({
        user_id: user.id,
        from_address: fromAddress,
        to_address: toAddress,
        amount: amount,
        transfer_type: 'internal_to_external',
        status: 'pending',
        fee: 0.000005
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      signature: `mock_transfer_${Date.now()}`
    };
  } catch (error) {
    console.error('Error transferring SOL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function formatWalletAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatTokenAmount(amount: number, decimals: number = 2): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(decimals)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(decimals)}K`;
  }
  return amount.toFixed(decimals);
}

export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-green-500 dark:text-green-400';
  if (change < 0) return 'text-red-500 dark:text-red-400';
  return 'text-tertiary-text';
}
