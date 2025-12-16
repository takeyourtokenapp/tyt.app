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

  getProof(leafIndex: number): string[] {
    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error('Invalid leaf index');
    }

    const proof: string[] = [];
    let index = leafIndex;

    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const layer = this.layers[layerIndex];
      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  getLeaves(): string[] {
    return this.leaves;
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { miner_id, date } = await req.json();

    if (!miner_id || !date) {
      return new Response(
        JSON.stringify({ error: 'Missing miner_id or date' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: targetReward, error: rewardError } = await supabase
      .from('daily_rewards')
      .select('*')
      .eq('miner_id', miner_id)
      .eq('date', date)
      .eq('user_id', user.id)
      .maybeSingle();

    if (rewardError || !targetReward) {
      return new Response(
        JSON.stringify({ error: 'Reward not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: allRewards, error: allRewardsError } = await supabase
      .from('daily_rewards')
      .select('miner_id, user_id, date, user_btc, net_btc, merkle_index, proof_leaf')
      .eq('date', date)
      .order('merkle_index');

    if (allRewardsError || !allRewards || allRewards.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch rewards for merkle tree' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: pool } = await supabase
      .from('reward_pools')
      .select('merkle_root')
      .eq('date', date)
      .maybeSingle();

    if (!pool || !pool.merkle_root) {
      return new Response(
        JSON.stringify({ error: 'Merkle root not found for this date' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const leaves: MerkleLeaf[] = allRewards.map(r => ({
      miner_id: r.miner_id,
      user_id: r.user_id,
      reward_date: r.date,
      user_btc: Number(r.user_btc),
      net_btc: Number(r.net_btc),
    }));

    const tree = new MerkleTree(leaves);
    const root = tree.getRoot();

    if (root !== pool.merkle_root) {
      console.warn('Merkle root mismatch! Stored:', pool.merkle_root, 'Computed:', root);
    }

    const targetIndex = targetReward.merkle_index ?? allRewards.findIndex(
      r => r.miner_id === miner_id && r.date === date
    );

    if (targetIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Reward not found in tree' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const proof = tree.getProof(targetIndex);
    const leafHash = tree.getLeaves()[targetIndex];

    return new Response(
      JSON.stringify({
        proof,
        leaf: leafHash,
        root: pool.merkle_root,
        index: targetIndex,
        reward: {
          miner_id: targetReward.miner_id,
          date: targetReward.date,
          user_btc: targetReward.user_btc,
          net_btc: targetReward.net_btc,
          gross_btc: targetReward.gross_btc,
          maintenance_btc: targetReward.maintenance_btc,
        },
        metadata: {
          total_rewards: allRewards.length,
          generated_at: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating merkle proof:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
