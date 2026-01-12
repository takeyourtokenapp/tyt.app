import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { handleCorsPreflightRequest, createCorsHeaders } from '../_shared/auth.ts';
import { rateLimiters } from '../_shared/rateLimiter.ts';

const TYT_TOKEN_MINT = '8YuADotEATc86nEgPUZVs8fBRxdMMgEP4JL4xv7rpump';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

interface TokenData {
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  holders: number;
  totalSupply: number;
  liquidity: number;
  source: string;
}

async function fetchFromPumpFun(): Promise<TokenData | null> {
  try {
    const response = await fetch(`https://frontend-api.pump.fun/coins/${TYT_TOKEN_MINT}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TYT-Platform/1.0',
      },
    });

    if (!response.ok) {
      console.warn('Pump.fun API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Pump.fun data:', data);

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
      source: 'pump.fun',
    };
  } catch (error) {
    console.error('Pump.fun fetch error:', error);
    return null;
  }
}

async function fetchFromBirdeye(): Promise<TokenData | null> {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/public/price?address=${TYT_TOKEN_MINT}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.data) return null;

    return {
      price: data.data.value || 0,
      marketCap: data.data.liquidity || 0,
      volume24h: 0,
      priceChange24h: data.data.priceChange24h || 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: data.data.liquidity || 0,
      source: 'birdeye',
    };
  } catch (error) {
    console.error('Birdeye fetch error:', error);
    return null;
  }
}

async function fetchFromDexScreener(): Promise<TokenData | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TYT_TOKEN_MINT}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) return null;

    const pair = data.pairs[0];

    return {
      price: parseFloat(pair.priceUsd) || 0,
      marketCap: parseFloat(pair.fdv) || 0,
      volume24h: parseFloat(pair.volume?.h24) || 0,
      priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
      holders: 0,
      totalSupply: 1000000000,
      liquidity: parseFloat(pair.liquidity?.usd) || 0,
      source: 'dexscreener',
    };
  } catch (error) {
    console.error('DexScreener fetch error:', error);
    return null;
  }
}

async function fetchTokenSupply(): Promise<number> {
  try {
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

    const data = await response.json();
    return data.result?.value?.uiAmount || 1000000000;
  } catch (error) {
    console.error('Token supply fetch error:', error);
    return 1000000000;
  }
}

Deno.serve(async (req: Request) => {
  const corsPreflightResponse = handleCorsPreflightRequest(req);
  if (corsPreflightResponse) return corsPreflightResponse;

  const rateLimitResponse = await rateLimiters.standard(req);
  if (rateLimitResponse) return rateLimitResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = createCorsHeaders(origin);

  try {
    console.log('Fetching TYT token data from multiple sources...');

    const [pumpFunData, birdeyeData, dexScreenerData] = await Promise.allSettled([
      fetchFromPumpFun(),
      fetchFromBirdeye(),
      fetchFromDexScreener(),
    ]);

    let tokenData: TokenData | null = null;

    if (pumpFunData.status === 'fulfilled' && pumpFunData.value) {
      tokenData = pumpFunData.value;
      console.log('Using Pump.fun data');
    } else if (dexScreenerData.status === 'fulfilled' && dexScreenerData.value) {
      tokenData = dexScreenerData.value;
      console.log('Using DexScreener data');
    } else if (birdeyeData.status === 'fulfilled' && birdeyeData.value) {
      tokenData = birdeyeData.value;
      console.log('Using Birdeye data');
    }

    if (!tokenData) {
      console.warn('All data sources failed, fetching token supply only');
      const supply = await fetchTokenSupply();
      tokenData = {
        price: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        holders: 0,
        totalSupply: supply,
        liquidity: 0,
        source: 'fallback',
      };
    }

    const response = {
      success: true,
      data: tokenData,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10',
      },
    });
  } catch (error) {
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
