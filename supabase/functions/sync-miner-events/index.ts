import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface MinerMintedEvent {
  tokenId: number;
  owner: string;
  collectionId: string;
  powerTH: number;
  efficiencyWTH: number;
  region: string;
  timestamp: number;
  transactionHash: string;
}

interface MinerUpgradedEvent {
  tokenId: number;
  upgradeType: 'hashrate' | 'efficiency' | 'power_level';
  oldValue: number;
  newValue: number;
  cost: number;
  costCurrency: string;
  timestamp: number;
  transactionHash: string;
}

interface MinerTransferEvent {
  tokenId: number;
  from: string;
  to: string;
  timestamp: number;
  transactionHash: string;
}

interface MinerStatusChangedEvent {
  tokenId: number;
  oldStatus: string;
  newStatus: string;
  timestamp: number;
  transactionHash: string;
}

interface SyncEventRequest {
  event_type: 'MinerMinted' | 'MinerUpgraded' | 'MinerTransferred' | 'MinerStatusChanged';
  event_data: MinerMintedEvent | MinerUpgradedEvent | MinerTransferEvent | MinerStatusChangedEvent;
  blockchain?: string;
}

interface SyncEventResponse {
  success: boolean;
  message?: string;
  miner_id?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET') || 'change-in-production';
    const providedSecret = req.headers.get('X-Webhook-Secret');

    if (!providedSecret || providedSecret !== webhookSecret) {
      console.warn('Unauthorized: Invalid or missing WEBHOOK_SECRET');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { event_type, event_data, blockchain = 'polygon' }: SyncEventRequest = await req.json();

    console.log(`Processing ${event_type} event:`, event_data);

    let result: SyncEventResponse = { success: true };

    switch (event_type) {
      case 'MinerMinted': {
        const mintData = event_data as MinerMintedEvent;

        const { data: userId } = await supabase.rpc('get_user_id_from_address', {
          p_address: mintData.owner,
          p_blockchain: blockchain,
        });

        if (!userId) {
          throw new Error(`User not found for address ${mintData.owner}. User must register blockchain address first.`);
        }

        const { data: collection } = await supabase
          .from('nft_collections')
          .select('id')
          .eq('contract_address', mintData.collectionId)
          .maybeSingle();

        if (!collection) {
          throw new Error(`Collection not found: ${mintData.collectionId}`);
        }

        const { data: miner, error: insertError } = await supabase
          .from('nft_miners')
          .insert({
            token_id: mintData.tokenId.toString(),
            owner_id: userId,
            collection_id: collection.id,
            name: `Miner #${mintData.tokenId}`,
            hashrate: mintData.powerTH / 1000000,
            efficiency: mintData.efficiencyWTH / 1000000,
            power_level: 1,
            farm_id: mintData.region,
            purchase_price: 0,
            purchase_currency: 'TYT',
            purchased_at: new Date(mintData.timestamp * 1000).toISOString(),
            status: 'active',
            metadata: {
              mint_tx: mintData.transactionHash,
              blockchain,
            },
          })
          .select('id')
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            result.message = 'Miner already synced';
          } else {
            throw insertError;
          }
        } else {
          result.miner_id = miner.id;
          result.message = 'Miner minted successfully';
        }

        await supabase
          .from('nft_collections')
          .update({
            minted_supply: supabase.rpc('increment', { x: 1 }),
          })
          .eq('id', collection.id);

        break;
      }

      case 'MinerUpgraded': {
        const upgradeData = event_data as MinerUpgradedEvent;

        const { data: miner } = await supabase
          .from('nft_miners')
          .select('id, owner_id')
          .eq('token_id', upgradeData.tokenId.toString())
          .single();

        if (!miner) {
          throw new Error(`Miner not found: ${upgradeData.tokenId}`);
        }

        const updateData: any = {
          updated_at: new Date().toISOString(),
        };

        if (upgradeData.upgradeType === 'hashrate') {
          updateData.hashrate = upgradeData.newValue / 1000000;
        } else if (upgradeData.upgradeType === 'efficiency') {
          updateData.efficiency = upgradeData.newValue / 1000000;
        } else if (upgradeData.upgradeType === 'power_level') {
          updateData.power_level = upgradeData.newValue;
        }

        const { error: updateError } = await supabase
          .from('nft_miners')
          .update(updateData)
          .eq('id', miner.id);

        if (updateError) throw updateError;

        const { error: upgradeLogError } = await supabase
          .from('miner_upgrades')
          .insert({
            miner_id: miner.id,
            user_id: miner.owner_id,
            upgrade_type: upgradeData.upgradeType,
            from_value: upgradeData.oldValue / 1000000,
            to_value: upgradeData.newValue / 1000000,
            cost: upgradeData.cost,
            cost_currency: upgradeData.costCurrency,
          });

        if (upgradeLogError) throw upgradeLogError;

        result.miner_id = miner.id;
        result.message = `Miner upgraded: ${upgradeData.upgradeType}`;
        break;
      }

      case 'MinerTransferred': {
        const transferData = event_data as MinerTransferEvent;

        const { data: newUserId } = await supabase.rpc('get_user_id_from_address', {
          p_address: transferData.to,
          p_blockchain: blockchain,
        });

        if (!newUserId) {
          throw new Error(`New owner not found for address ${transferData.to}. User must register blockchain address first.`);
        }

        const { data: miner, error: updateError } = await supabase
          .from('nft_miners')
          .update({
            owner_id: newUserId,
            updated_at: new Date().toISOString(),
            is_listed: false,
            listed_price: null,
          })
          .eq('token_id', transferData.tokenId.toString())
          .select('id')
          .single();

        if (updateError) throw updateError;

        result.miner_id = miner.id;
        result.message = 'Miner transferred successfully';
        break;
      }

      case 'MinerStatusChanged': {
        const statusData = event_data as MinerStatusChangedEvent;

        const validStatuses = ['active', 'inactive', 'maintenance', 'listed_for_sale'];
        if (!validStatuses.includes(statusData.newStatus)) {
          throw new Error(`Invalid status: ${statusData.newStatus}`);
        }

        const { data: miner, error: updateError } = await supabase
          .from('nft_miners')
          .update({
            status: statusData.newStatus as any,
            updated_at: new Date().toISOString(),
          })
          .eq('token_id', statusData.tokenId.toString())
          .select('id')
          .single();

        if (updateError) throw updateError;

        result.miner_id = miner.id;
        result.message = `Miner status changed to ${statusData.newStatus}`;
        break;
      }

      default:
        throw new Error(`Unknown event type: ${event_type}`);
    }

    await supabase.from('cron_job_logs').insert({
      job_name: 'sync-miner-events',
      status: 'completed',
      result: {
        event_type,
        token_id: (event_data as any).tokenId,
        message: result.message,
      },
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync miner events error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
