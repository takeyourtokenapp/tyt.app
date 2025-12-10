import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { blockchain, address, asset = 'native' } = await req.json();

    if (!blockchain || !address) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let balance = 0;

    switch (blockchain) {
      case 'solana':
        balance = Math.random() * 10;
        break;
      case 'ethereum':
        balance = Math.random() * 5;
        break;
      case 'bsc':
        balance = Math.random() * 20;
        break;
      case 'polygon':
        balance = Math.random() * 100;
        break;
      case 'tron':
        balance = Math.random() * 1000;
        break;
      default:
        balance = 0;
    }

    return new Response(
      JSON.stringify({
        success: true,
        balance,
        blockchain,
        address,
        asset,
        checked_at: new Date().toISOString()
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