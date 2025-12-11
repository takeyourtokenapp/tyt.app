import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BLOCKSTREAM_API = 'https://blockstream.info/api';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: addresses, error: addressError } = await supabase
      .from('bitcoin_addresses')
      .select('id, address, user_id, balance_confirmed')
      .eq('is_watched', true)
      .eq('is_active', true);

    if (addressError) throw addressError;

    let totalDepositsFound = 0;
    let totalNewUTXOs = 0;

    for (const addr of addresses || []) {
      try {
        const response = await fetch(`${BLOCKSTREAM_API}/address/${addr.address}/utxo`);
        if (!response.ok) continue;

        const utxos: BitcoinUTXO[] = await response.json();

        for (const utxo of utxos) {
          const { data: existing } = await supabase
            .from('bitcoin_utxos')
            .select('id')
            .eq('txid', utxo.txid)
            .eq('vout', utxo.vout)
            .single();

          if (existing) {
            await supabase
              .from('bitcoin_utxos')
              .update({
                is_confirmed: utxo.status.confirmed,
                confirmations: utxo.status.block_height ? 0 : 0,
                block_height: utxo.status.block_height,
                block_hash: utxo.status.block_hash,
                block_time: utxo.status.block_time ? new Date(utxo.status.block_time * 1000).toISOString() : null,
              })
              .eq('txid', utxo.txid)
              .eq('vout', utxo.vout);
          } else {
            const { error: insertError } = await supabase
              .from('bitcoin_utxos')
              .insert({
                user_id: addr.user_id,
                address_id: addr.id,
                txid: utxo.txid,
                vout: utxo.vout,
                value_satoshis: utxo.value,
                script_pubkey: '',
                is_confirmed: utxo.status.confirmed,
                confirmations: 0,
                block_height: utxo.status.block_height,
                block_hash: utxo.status.block_hash,
                block_time: utxo.status.block_time ? new Date(utxo.status.block_time * 1000).toISOString() : null,
              });

            if (!insertError) {
              totalNewUTXOs++;

              const { data: tx } = await supabase
                .from('bitcoin_transactions')
                .select('id')
                .eq('txid', utxo.txid)
                .single();

              if (!tx && utxo.status.confirmed) {
                await supabase
                  .from('bitcoin_transactions')
                  .insert({
                    user_id: addr.user_id,
                    txid: utxo.txid,
                    tx_type: 'deposit',
                    direction: 'incoming',
                    amount_satoshis: utxo.value,
                    user_address: addr.address,
                    is_confirmed: true,
                    confirmations: 1,
                    block_height: utxo.status.block_height,
                    block_hash: utxo.status.block_hash,
                    block_time: utxo.status.block_time ? new Date(utxo.status.block_time * 1000).toISOString() : null,
                    status: 'confirmed',
                    confirmed_at: new Date().toISOString(),
                  });

                totalDepositsFound++;

                await supabase
                  .from('user_wallets')
                  .upsert({
                    user_id: addr.user_id,
                    asset: 'BTC',
                    balance: (addr.balance_confirmed || 0) + utxo.value,
                  });
              }
            }
          }
        }

        const totalBalance = utxos.reduce((sum, u) => sum + u.value, 0);
        await supabase
          .from('bitcoin_addresses')
          .update({
            balance_total: totalBalance,
            balance_confirmed: utxos.filter(u => u.status.confirmed).reduce((sum, u) => sum + u.value, 0),
            balance_unconfirmed: utxos.filter(u => !u.status.confirmed).reduce((sum, u) => sum + u.value, 0),
            utxo_count: utxos.length,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', addr.id);

      } catch (error) {
        console.error(`Error monitoring address ${addr.address}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        addressesMonitored: addresses?.length || 0,
        newDeposits: totalDepositsFound,
        newUTXOs: totalNewUTXOs,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Monitor Bitcoin deposits error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to monitor deposits' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});