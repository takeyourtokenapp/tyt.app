import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

/**
 * Cron Update Ranks Edge Function
 *
 * Updates all user ranks and checks for new achievements.
 * Runs daily via cron schedule.
 */

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

    const startTime = Date.now();

    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, username, rank, rank_score');

    if (usersError) {
      throw usersError;
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No users to update',
          processed: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let updatedCount = 0;
    let rankChanges = 0;
    let errors = 0;
    const rankChangeLog: Array<{
      user_id: string;
      username: string;
      old_rank: string;
      new_rank: string;
      score: number;
    }> = [];

    for (const user of users) {
      try {
        const { data: achievementResult } = await supabase.rpc('check_achievements', {
          p_user_id: user.id,
        });

        const { data: rankResult, error: rankError } = await supabase.rpc('update_user_rank', {
          p_user_id: user.id,
        });

        if (rankError) {
          console.error(`Error updating rank for user ${user.id}:`, rankError);
          errors++;
          continue;
        }

        if (rankResult) {
          updatedCount++;

          if (rankResult.changed) {
            rankChanges++;
            rankChangeLog.push({
              user_id: user.id,
              username: user.username || 'Unknown',
              old_rank: rankResult.old_rank,
              new_rank: rankResult.rank,
              score: rankResult.score,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errors++;
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const result = {
      success: true,
      processed: updatedCount,
      rank_changes: rankChanges,
      errors,
      duration_ms: duration,
      rank_changes_log: rankChangeLog.slice(0, 10),
      timestamp: new Date().toISOString(),
    };

    console.log('Rank update complete:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cron update ranks error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
