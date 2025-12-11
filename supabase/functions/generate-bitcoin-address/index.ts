import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function generateBitcoinAddress(type: string): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  
  if (type === 'native_segwit') {
    const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
    let addr = 'bc1q';
    for (let i = 0; i < 38; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  }
  
  if (type === 'segwit') {
    let addr = '3';
    for (let i = 0; i < 33; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  }
  
  if (type === 'taproot') {
    const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
    let addr = 'bc1p';
    for (let i = 0; i < 58; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  }
  
  let addr = '1';
  for (let i = 0; i < 33; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { userId, addressType = 'native_segwit', label } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const address = generateBitcoinAddress(addressType);

    const { data, error } = await supabase
      .from('bitcoin_addresses')
      .insert({
        user_id: userId,
        address: address,
        address_type: addressType,
        label: label || null,
        is_active: true,
        is_watched: true,
        network: 'mainnet',
        purpose: 'deposit',
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        id: data.id,
        address: data.address,
        address_type: data.address_type,
        label: data.label,
        balance_confirmed: 0,
        balance_unconfirmed: 0,
        balance_total: 0,
        utxo_count: 0,
        tx_count: 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Generate Bitcoin address error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate address' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});