import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { handleCorsPreflightRequest, createCorsHeaders } from '../_shared/auth.ts';
import { rateLimiters } from '../_shared/rateLimiter.ts';

const ASSET_PRICES: Record<string, number> = {
  'BTC': 95000,
  'ETH': 3500,
  'SOL': 140,
  'BNB': 600,
  'MATIC': 1.15,
  'TRX': 0.15,
  'TYT': 0.05,
  'USDT': 1,
  'USDC': 1,
  'XRP': 2.5
};

Deno.serve(async (req: Request) => {
  const corsPreflightResponse = handleCorsPreflightRequest(req);
  if (corsPreflightResponse) return corsPreflightResponse;

  const rateLimitResponse = await rateLimiters.standard(req);
  if (rateLimitResponse) return rateLimitResponse;

  const origin = req.headers.get('origin');
  const corsHeaders = createCorsHeaders(origin);

  try {
    const { from_asset, to_asset } = await req.json();

    if (!from_asset || !to_asset) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fromPrice = ASSET_PRICES[from_asset] || 1;
    const toPrice = ASSET_PRICES[to_asset] || 1;
    const rate = fromPrice / toPrice;

    const volatility = (Math.random() - 0.5) * 0.02;
    const adjustedRate = rate * (1 + volatility);

    return new Response(
      JSON.stringify({
        success: true,
        rate: adjustedRate,
        from_asset,
        to_asset,
        from_price: fromPrice,
        to_price: toPrice,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});