import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { withdrawal_id } = await req.json();

    if (!withdrawal_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing withdrawal_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: withdrawal, error: fetchError } = await supabase
      .from('custodial_withdrawals')
      .select('*')
      .eq('id', withdrawal_id)
      .single();

    if (fetchError || !withdrawal) {
      return new Response(
        JSON.stringify({ success: false, error: 'Withdrawal not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    return new Response(
      JSON.stringify({
        success: true,
        tx_hash: mockTxHash,
        blockchain: withdrawal.blockchain,
        amount: withdrawal.amount_after_fee,
        processed_at: new Date().toISOString()
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