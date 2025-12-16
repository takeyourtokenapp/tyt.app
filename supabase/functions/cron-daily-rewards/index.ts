import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface MerkleLeaf {
  miner_id: string;
  user_id: string;
  reward_date: string;
  user_btc: number;
  net_btc: number;
}

class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(leaves: MerkleLeaf[]) {
    this.leaves = leaves.map(leaf => this.hashLeaf(leaf));
    this.layers = this.buildTree(this.leaves);
  }

  private hashLeaf(leaf: MerkleLeaf): string {
    const data = JSON.stringify({
      miner_id: leaf.miner_id,
      user_id: leaf.user_id,
      reward_date: leaf.reward_date,
      user_btc: leaf.user_btc.toFixed(8),
      net_btc: leaf.net_btc.toFixed(8),
    });

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return Array.from(dataBuffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private pairHash(left: string, right: string): string {
    const combined = left < right ? left + right : right + left;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(combined);
    return Array.from(dataBuffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private buildTree(leaves: string[]): string[][] {
    if (leaves.length === 0) return [[]];

    const layers: string[][] = [leaves];
    let currentLayer = leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        if (i + 1 < currentLayer.length) {
          nextLayer.push(this.pairHash(currentLayer[i], currentLayer[i + 1]));
        } else {
          nextLayer.push(currentLayer[i]);
        }
      }
      layers.push(nextLayer);
      currentLayer = nextLayer;
    }

    return layers;
  }

  getRoot(): string {
    if (this.layers.length === 0 || this.layers[this.layers.length - 1].length === 0) {
      return '';
    }
    return this.layers[this.layers.length - 1][0];
  }

  getLeaves(): string[] {
    return this.leaves;
  }
}

async function getBTCPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const data = await response.json();
    return data.bitcoin?.usd || 95000;
  } catch (error) {
    console.error('BTC price fetch error:', error);
    return 95000;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const cronSecret = Deno.env.get('CRON_SECRET');
    const authHeader = req.headers.get('Authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

    console.log('Starting daily rewards distribution...');

    const today = new Date().toISOString().split('T')[0];

    const { data: existingPool } = await supabase
      .from('reward_pools')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (existingPool && existingPool.distributed_at) {
      console.log('Rewards already distributed for today');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Rewards already distributed',
          date: today
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const btcPrice = await getBTCPrice();

    const { data: activeMiners, error: minersError } = await supabase
      .from('nft_miners')
      .select('id, token_id, owner_id, hashrate, efficiency, farm_id, status, metadata')
      .eq('status', 'active');

    if (minersError) throw minersError;

    if (!activeMiners || activeMiners.length === 0) {
      console.log('No active miners found');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No active miners',
          miners_processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const totalHashrate = activeMiners.reduce((sum, m) => sum + Number(m.hashrate), 0);

    const { data: totalVetyTData } = await supabase
      .from('vetyt_locks')
      .select('locked_amount')
      .eq('is_active', true);

    const totalVetyt = totalVetyTData?.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0) || 1;

    const poolBTC = 0.5;

    if (!existingPool) {
      await supabase.from('reward_pools').insert({
        date: today,
        gross_btc: poolBTC,
        btc_price_usd: btcPrice,
        total_hashrate_th: totalHashrate,
      });
    }

    const rewards: any[] = [];
    const merkleLeaves: MerkleLeaf[] = [];
    let totalDistributed = 0;

    for (const miner of activeMiners) {
      try {
        const share = Number(miner.hashrate) / totalHashrate;
        const grossBtc = poolBTC * share;

        const { data: vipData } = await supabase
          .from('profiles')
          .select('vip_level')
          .eq('id', miner.owner_id)
          .maybeSingle();

        const { data: vetyTData } = await supabase
          .from('vetyt_locks')
          .select('locked_amount')
          .eq('user_id', miner.owner_id)
          .eq('is_active', true);

        const userVetyt = vetyTData?.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0) || 0;

        const { data: serviceButton } = await supabase
          .from('user_activities')
          .select('id')
          .eq('user_id', miner.owner_id)
          .eq('activity_type', 'service_button')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle();

        const calcResult = await supabase.rpc('calculate_maintenance', {
          p_power_th: miner.hashrate,
          p_efficiency_w_th: miner.efficiency,
          p_region: miner.farm_id || 'Default',
          p_days: 1,
          p_vip_level: vipData?.vip_level || 0,
          p_prepay_days: 0,
          p_vetyt_power: userVetyt,
          p_total_vetyt: totalVetyt,
          p_service_button: !!serviceButton,
        });

        if (calcResult.error) {
          console.error(`Maintenance calc error for miner ${miner.token_id}:`, calcResult.error);
          continue;
        }

        const maintenance = calcResult.data;
        const maintenanceBtc = maintenance.total_usd / btcPrice;
        let netBtc = Math.max(0, grossBtc - maintenanceBtc);

        const reinvestPct = (miner.metadata?.reinvest_pct || 0) / 100;
        const charityPct = (miner.metadata?.charity_pct || 0) / 100;

        const reinvestBtc = netBtc * reinvestPct;
        const charityBtc = netBtc * charityPct;
        const userBtc = netBtc - reinvestBtc - charityBtc;

        rewards.push({
          date: today,
          miner_id: miner.id,
          user_id: miner.owner_id,
          gross_btc: grossBtc,
          maintenance_btc: maintenanceBtc,
          elec_usd: maintenance.elec_usd,
          service_usd: maintenance.service_usd,
          discount_pct: maintenance.discount_pct,
          net_btc: netBtc,
          reinvest_btc: reinvestBtc,
          charity_btc: charityBtc,
          user_btc: userBtc,
          metadata: {
            btc_price: btcPrice,
            share: share,
            maintenance: maintenance,
          },
        });

        merkleLeaves.push({
          miner_id: miner.id,
          user_id: miner.owner_id,
          reward_date: today,
          user_btc: userBtc,
          net_btc: netBtc,
        });

        if (userBtc > 0) {
          const { data: wallet } = await supabase
            .from('custodial_wallets')
            .select('id')
            .eq('user_id', miner.owner_id)
            .eq('asset', 'BTC')
            .maybeSingle();

          if (wallet) {
            await supabase.from('ledger_entries').insert({
              account_id: wallet.id,
              credit: userBtc,
              ref_type: 'reward',
              ref_id: miner.id,
              memo: `Daily reward ${today}`,
            });
          }

          totalDistributed += userBtc;
        }

        if (charityBtc > 0) {
          await supabase.from('charity_donations').insert({
            user_id: miner.owner_id,
            amount: charityBtc,
            asset: 'BTC',
            source: 'REWARDS_PERCENT',
            donation_date: today,
          });
        }
      } catch (error) {
        console.error(`Error processing miner ${miner.token_id}:`, error);
      }
    }

    if (rewards.length > 0) {
      const { data: insertedRewards, error: insertError } = await supabase
        .from('daily_rewards')
        .insert(rewards)
        .select();

      if (insertError) {
        console.error('Error inserting rewards:', insertError);
        throw insertError;
      }

      const merkleTree = new MerkleTree(merkleLeaves);
      const merkleRoot = merkleTree.getRoot();
      const leaves = merkleTree.getLeaves();

      for (let i = 0; i < insertedRewards.length; i++) {
        await supabase
          .from('daily_rewards')
          .update({
            proof_leaf: leaves[i],
            merkle_index: i,
          })
          .eq('id', insertedRewards[i].id);
      }

      await supabase
        .from('reward_pools')
        .update({
          merkle_root: merkleRoot,
          distributed_at: new Date().toISOString(),
        })
        .eq('date', today);

      console.log(`Rewards distributed: ${rewards.length} miners, ${totalDistributed.toFixed(8)} BTC`);
    }

    await supabase.from('cron_job_logs').insert({
      job_name: 'cron-daily-rewards',
      status: 'completed',
      result: {
        date: today,
        miners_processed: rewards.length,
        total_distributed_btc: totalDistributed,
        btc_price: btcPrice,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        date: today,
        miners_processed: rewards.length,
        total_distributed_btc: totalDistributed.toFixed(8),
        btc_price: btcPrice,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cron daily rewards error:', error);

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
