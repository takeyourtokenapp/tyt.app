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
  source?: string;
  lastUpdate?: string;
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

async function fetchFromEdgeFunction(): Promise<TYTTokenData | null> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured');
      return null;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/fetch-tyt-price`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Edge function returned non-OK status:', response.status);
      return null;
    }

    const result = await response.json();
    console.log('Edge function response:', result);

    if (result.success && result.data) {
      return {
        price: result.data.price || 0,
        marketCap: result.data.marketCap || 0,
        volume24h: result.data.volume24h || 0,
        priceChange24h: result.data.priceChange24h || 0,
        holders: result.data.holders || 0,
        totalSupply: result.data.totalSupply || 1000000000,
        liquidity: result.data.liquidity || 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Edge function fetch error:', error);
    return null;
  }
}

async function fetchFromPumpFunDirect(): Promise<TYTTokenData | null> {
  try {
    console.log('Attempting direct Pump.fun API call...');
    const response = await fetch(`${PUMP_FUN_API}/coins/${TYT_TOKEN_MINT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      console.warn('Pump.fun direct API returned:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Pump.fun direct response:', data);

    if (!data) return null;

    const price = data.usd_market_cap && data.total_supply
      ? data.usd_market_cap / data.total_supply
      : 0;

    return {
      price,
      marketCap: data.usd_market_cap || 0,
      volume24h: data.volume_24h || data.volume || 0,
      priceChange24h: data.price_change_percentage_24h || 0,
      holders: data.holder_count || 0,
      totalSupply: data.total_supply || 1000000000,
      liquidity: data.virtual_sol_reserves || data.liquidity || 0,
    };
  } catch (error) {
    console.error('Pump.fun direct fetch error:', error);
    return null;
  }
}

async function fetchFromDexScreener(): Promise<TYTTokenData | null> {
  try {
    console.log('Attempting DexScreener API call...');
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TYT_TOKEN_MINT}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn('DexScreener API returned:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('DexScreener response:', data);

    if (!data.pairs || data.pairs.length === 0) {
      console.warn('No trading pairs found on DexScreener');
      return null;
    }

    const pair = data.pairs[0];

    return {
      price: parseFloat(pair.priceUsd) || 0,
      marketCap: parseFloat(pair.fdv) || 0,
      volume24h: parseFloat(pair.volume?.h24) || 0,
      priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: parseFloat(pair.liquidity?.usd) || 0,
    };
  } catch (error) {
    console.error('DexScreener fetch error:', error);
    return null;
  }
}

async function fetchFromJupiter(): Promise<TYTTokenData | null> {
  try {
    console.log('Attempting Jupiter API call...');
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${TYT_TOKEN_MINT}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn('Jupiter API returned:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Jupiter response:', data);

    if (!data.data || !data.data[TYT_TOKEN_MINT]) {
      console.warn('No price data found on Jupiter');
      return null;
    }

    const priceData = data.data[TYT_TOKEN_MINT];

    return {
      price: priceData.price || 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: 0,
    };
  } catch (error) {
    console.error('Jupiter fetch error:', error);
    return null;
  }
}

function getCachedData(): TYTTokenData | null {
  try {
    const cached = localStorage.getItem('tyt_token_cache');
    if (!cached) return null;

    const data = JSON.parse(cached);
    const cacheAge = Date.now() - new Date(data.timestamp).getTime();

    if (cacheAge > 60000) {
      console.log('Cache expired (>1 minute)');
      return null;
    }

    console.log('Using cached data from', new Date(data.timestamp).toLocaleTimeString());
    return data.tokenData;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

function setCachedData(data: TYTTokenData): void {
  try {
    localStorage.setItem('tyt_token_cache', JSON.stringify({
      tokenData: data,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

function getDemoData(): TYTTokenData {
  const basePrice = 0.00000234;
  const variation = (Math.random() - 0.5) * 0.0000001;
  const price = basePrice + variation;

  return {
    price,
    marketCap: price * 1000000000,
    volume24h: 12000 + Math.random() * 5000,
    priceChange24h: (Math.random() - 0.5) * 30,
    holders: 842 + Math.floor(Math.random() * 50),
    totalSupply: 1000000000,
    liquidity: 45000 + Math.random() * 10000,
  };
}

export async function getTYTTokenData(): Promise<TYTTokenData> {
  try {
    console.log('🔍 Fetching TYT token data from multiple sources...');

    const cachedData = getCachedData();
    if (cachedData && cachedData.price > 0) {
      console.log('✅ Using fresh cached data');
      return {
        ...cachedData,
        source: `${cachedData.source} (cached)`,
        lastUpdate: cachedData.lastUpdate,
      };
    }

    const pumpFunDirectData = await fetchFromPumpFunDirect();
    if (pumpFunDirectData && pumpFunDirectData.price > 0) {
      console.log('✅ Using data from Pump.fun (direct)');
      const result = {
        ...pumpFunDirectData,
        source: 'Pump.fun',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      return result;
    }

    const edgeFunctionData = await fetchFromEdgeFunction();
    if (edgeFunctionData && edgeFunctionData.price > 0) {
      console.log('✅ Using data from Edge Function (pump.fun proxy)');
      const result = {
        ...edgeFunctionData,
        source: 'Pump.fun (proxy)',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      return result;
    }

    const dexScreenerData = await fetchFromDexScreener();
    if (dexScreenerData && dexScreenerData.price > 0) {
      console.log('✅ Using data from DexScreener');
      const result = {
        ...dexScreenerData,
        source: 'DexScreener',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      return result;
    }

    const jupiterData = await fetchFromJupiter();
    if (jupiterData && jupiterData.price > 0) {
      console.log('✅ Using data from Jupiter');
      const result = {
        ...jupiterData,
        source: 'Jupiter',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      return result;
    }

    console.warn('⚠️ All live data sources failed, checking older cache...');
    const oldCache = localStorage.getItem('tyt_token_cache');
    if (oldCache) {
      try {
        const data = JSON.parse(oldCache);
        console.log('📦 Using stale cached data');
        return {
          ...data.tokenData,
          source: `${data.tokenData.source} (stale cache)`,
          lastUpdate: data.timestamp,
        };
      } catch (e) {
        console.error('Error parsing old cache:', e);
      }
    }

    console.warn('⚠️ All sources failed, using demo data');
    const demoData = getDemoData();
    return {
      ...demoData,
      source: 'Demo Mode',
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Critical error fetching TYT token data:', error);

    const demoData = getDemoData();
    return {
      ...demoData,
      source: 'Demo Mode (error fallback)',
      lastUpdate: new Date().toISOString(),
    };
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
