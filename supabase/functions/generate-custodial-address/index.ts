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
    const { blockchain } = await req.json();

    if (!blockchain || !['solana', 'ethereum', 'bsc', 'polygon', 'tron'].includes(blockchain)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid blockchain' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mockAddresses = {
      solana: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      ethereum: `0x${Math.random().toString(16).substring(2, 42)}`,
      bsc: `0x${Math.random().toString(16).substring(2, 42)}`,
      polygon: `0x${Math.random().toString(16).substring(2, 42)}`,
      tron: `T${Math.random().toString(36).substring(2, 15).toUpperCase()}${Math.random().toString(36).substring(2, 20).toUpperCase()}`
    };

    const address = mockAddresses[blockchain as keyof typeof mockAddresses];
    const derivationPath = `m/44'/${blockchain === 'solana' ? '501' : blockchain === 'tron' ? '195' : '60'}'/${Math.floor(Math.random() * 1000)}'/0/0`;

    return new Response(
      JSON.stringify({
        success: true,
        address,
        derivation_path: derivationPath,
        blockchain
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