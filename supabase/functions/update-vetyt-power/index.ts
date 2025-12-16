import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

/**
 * Update veTYT Power Edge Function
 *
 * Updates user's cached veTYT voting power from on-chain data.
 * Called periodically or on-demand when user needs fresh voting power.
 */

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { user_id, wallet_address } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let targetWallet = wallet_address;

    if (!targetWallet) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user_id)
        .maybeSingle();

      if (!profile) {
        return new Response(
          JSON.stringify({ error: 'Profile not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: web3Wallet } = await supabase
        .from('web3_wallets')
        .select('address')
        .eq('user_id', user_id)
        .eq('is_primary', true)
        .maybeSingle();

      targetWallet = web3Wallet?.address;
    }

    if (!targetWallet) {
      await supabase.from('user_vetyt_cache').upsert({
        user_id,
        wallet_address: '',
        voting_power: 0,
        locked_amount: 0,
        lock_end: null,
        last_updated: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          user_id,
          wallet_address: null,
          voting_power: 0,
          locked_amount: 0,
          message: 'No wallet connected',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: vetytLocks } = await supabase
      .from('vetyt_locks')
      .select('locked_amount, lock_duration, created_at, is_active')
      .eq('user_id', user_id)
      .eq('is_active', true);

    let totalVotingPower = 0;
    let totalLockedAmount = 0;
    let maxLockEnd: Date | null = null;

    if (vetytLocks && vetytLocks.length > 0) {
      for (const lock of vetytLocks) {
        const lockedAmount = parseFloat(lock.locked_amount);
        const durationWeeks = lock.lock_duration / (7 * 24 * 60 * 60);
        const maxDurationWeeks = 208;

        const multiplier = Math.min(durationWeeks / maxDurationWeeks, 1);
        const votingPower = lockedAmount * (1 + multiplier * 3);

        totalVotingPower += votingPower;
        totalLockedAmount += lockedAmount;

        const lockEnd = new Date(lock.created_at);
        lockEnd.setSeconds(lockEnd.getSeconds() + lock.lock_duration);

        if (!maxLockEnd || lockEnd > maxLockEnd) {
          maxLockEnd = lockEnd;
        }
      }
    }

    await supabase.from('user_vetyt_cache').upsert({
      user_id,
      wallet_address: targetWallet,
      voting_power: totalVotingPower,
      locked_amount: totalLockedAmount,
      lock_end: maxLockEnd?.toISOString() || null,
      last_updated: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        user_id,
        wallet_address: targetWallet,
        voting_power: totalVotingPower,
        locked_amount: totalLockedAmount,
        lock_end: maxLockEnd?.toISOString() || null,
        last_updated: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating veTYT power:', error);

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
