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

async function fetchFromSolanaRPC(): Promise<TYTTokenData | null> {
  try {
    console.log('Attempting Solana RPC call for token supply...');

    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenSupply',
        params: [TYT_TOKEN_MINT],
      }),
    });

    if (!response.ok) {
      console.warn('Solana RPC returned:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Solana RPC response:', data);

    if (data.result?.value?.uiAmount) {
      const supply = data.result.value.uiAmount;

      return {
        price: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        holders: 0,
        totalSupply: supply,
        liquidity: 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Solana RPC fetch error:', error);
    return null;
  }
}

async function fetchFromSupabaseCache(): Promise<TYTTokenData | null> {
  try {
    console.log('Checking Supabase cache for recent data...');
    const { data, error } = await supabase
      .from('token_price_cache')
      .select('*')
      .eq('token_mint', TYT_TOKEN_MINT)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase cache error:', error);
      return null;
    }

    if (!data) {
      console.log('No cached data found in Supabase');
      return null;
    }

    const cacheAge = Date.now() - new Date(data.created_at).getTime();

    if (cacheAge > 300000) {
      console.log('Supabase cache expired (>5 minutes)');
      return null;
    }

    console.log('Using Supabase cached data from', new Date(data.created_at).toLocaleTimeString());
    return {
      price: data.price || 0,
      marketCap: data.market_cap || 0,
      volume24h: data.volume_24h || 0,
      priceChange24h: data.price_change_24h || 0,
      holders: data.holders || 0,
      totalSupply: data.total_supply || 1000000000,
      liquidity: data.liquidity || 0,
    };
  } catch (error) {
    console.error('Supabase cache fetch error:', error);
    return null;
  }
}

async function saveToSupabaseCache(data: TYTTokenData, source: string): Promise<void> {
  try {
    if (data.price === 0 && data.marketCap === 0) {
      console.log('Skipping cache save - insufficient data');
      return;
    }

    await supabase
      .from('token_price_cache')
      .insert({
        token_mint: TYT_TOKEN_MINT,
        price: data.price,
        market_cap: data.marketCap,
        volume_24h: data.volume24h,
        price_change_24h: data.priceChange24h,
        holders: data.holders,
        total_supply: data.totalSupply,
        liquidity: data.liquidity,
        source: source,
      });

    console.log('✅ Saved to Supabase cache');
  } catch (error) {
    console.error('Failed to save to Supabase cache:', error);
  }
}

export async function getTYTTokenData(): Promise<TYTTokenData> {
  try {
    console.log('🔍 Fetching REAL TYT token data from multiple sources...');

    const supabaseCacheData = await fetchFromSupabaseCache();
    if (supabaseCacheData && supabaseCacheData.price > 0) {
      console.log('✅ Using recent Supabase cached data');
      return {
        ...supabaseCacheData,
        source: 'Recent Data (cached)',
        lastUpdate: new Date().toISOString(),
      };
    }

    const cachedData = getCachedData();
    if (cachedData && cachedData.price > 0) {
      console.log('✅ Using fresh localStorage data');
      return {
        ...cachedData,
        source: 'Recent Data (local)',
        lastUpdate: cachedData.lastUpdate,
      };
    }

    console.log('📡 No recent cache, fetching from live sources...');

    const pumpFunDirectData = await fetchFromPumpFunDirect();
    if (pumpFunDirectData && pumpFunDirectData.price > 0) {
      console.log('✅ Got REAL data from Pump.fun (direct)');
      const result = {
        ...pumpFunDirectData,
        source: 'Pump.fun API',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      await saveToSupabaseCache(result, 'pump.fun');
      return result;
    }

    const edgeFunctionData = await fetchFromEdgeFunction();
    if (edgeFunctionData && edgeFunctionData.price > 0) {
      console.log('✅ Got REAL data from Edge Function');
      const result = {
        ...edgeFunctionData,
        source: 'Pump.fun (proxy)',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      await saveToSupabaseCache(result, 'pump.fun-proxy');
      return result;
    }

    const dexScreenerData = await fetchFromDexScreener();
    if (dexScreenerData && dexScreenerData.price > 0) {
      console.log('✅ Got REAL data from DexScreener');
      const result = {
        ...dexScreenerData,
        source: 'DexScreener',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      await saveToSupabaseCache(result, 'dexscreener');
      return result;
    }

    const jupiterData = await fetchFromJupiter();
    if (jupiterData && jupiterData.price > 0) {
      console.log('✅ Got REAL data from Jupiter');
      const result = {
        ...jupiterData,
        source: 'Jupiter',
        lastUpdate: new Date().toISOString(),
      };
      setCachedData(result);
      await saveToSupabaseCache(result, 'jupiter');
      return result;
    }

    console.warn('⚠️ No price data available from exchanges');
    console.log('📊 Attempting to get token supply from Solana RPC...');

    const solanaData = await fetchFromSolanaRPC();
    if (solanaData) {
      console.log('✅ Got token supply from Solana blockchain');
      return {
        ...solanaData,
        source: 'Solana Blockchain',
        lastUpdate: new Date().toISOString(),
      };
    }

    console.warn('⚠️ All live sources failed, checking older cache...');
    const oldSupabaseCache = await supabase
      .from('token_price_cache')
      .select('*')
      .eq('token_mint', TYT_TOKEN_MINT)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (oldSupabaseCache.data) {
      console.log('📦 Using older Supabase cache');
      const age = Math.floor((Date.now() - new Date(oldSupabaseCache.data.created_at).getTime()) / 60000);
      return {
        price: oldSupabaseCache.data.price || 0,
        marketCap: oldSupabaseCache.data.market_cap || 0,
        volume24h: oldSupabaseCache.data.volume_24h || 0,
        priceChange24h: oldSupabaseCache.data.price_change_24h || 0,
        holders: oldSupabaseCache.data.holders || 0,
        totalSupply: oldSupabaseCache.data.total_supply || 1000000000,
        liquidity: oldSupabaseCache.data.liquidity || 0,
        source: `Cached Data (${age}m old)`,
        lastUpdate: oldSupabaseCache.data.created_at,
      };
    }

    const oldCache = localStorage.getItem('tyt_token_cache');
    if (oldCache) {
      try {
        const data = JSON.parse(oldCache);
        const age = Math.floor((Date.now() - new Date(data.timestamp).getTime()) / 60000);
        console.log(`📦 Using stale localStorage cache (${age}m old)`);
        return {
          ...data.tokenData,
          source: `Cached Data (${age}m old)`,
          lastUpdate: data.timestamp,
        };
      } catch (e) {
        console.error('Error parsing old cache:', e);
      }
    }

    console.error('❌ No data available from any source');
    return {
      price: 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: 0,
      source: 'Loading... (retry in 15s)',
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Critical error fetching TYT token data:', error);

    return {
      price: 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: 0,
      source: 'Error - Retrying...',
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
