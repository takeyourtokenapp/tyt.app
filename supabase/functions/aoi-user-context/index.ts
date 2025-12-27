import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Domain",
};

interface UserContext {
  user_id: string;
  profile: {
    display_name: string | null;
    avatar_url: string | null;
    joined_at: string;
  };
  levels: {
    web3_mastery: number;
    cns_knowledge: number;
    overall_rank: string;
  };
  active_paths: any[];
  stats: {
    total_lessons_completed: number;
    total_xp: number;
    achievements_unlocked: number;
    days_active: number;
  };
  recommendations: any[];
  last_activity: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, created_at")
      .eq("id", user.id)
      .maybeSingle();

    // Get aOi profile (or create if doesn't exist)
    let { data: aoiProfile } = await supabase
      .from("aoi_user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!aoiProfile) {
      const { data: newProfile } = await supabase
        .from("aoi_user_profiles")
        .insert({ user_id: user.id })
        .select()
        .single();
      aoiProfile = newProfile;
    }

    // Get active learning paths
    const { data: activePaths } = await supabase
      .from("aoi_user_path_progress")
      .select(`
        path_id,
        current_step,
        completed_steps,
        aoi_learning_paths (
          name,
          steps
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "in_progress");

    // Get activity stats
    const { data: activities, count: activityCount } = await supabase
      .from("aoi_activity_log")
      .select("*", { count: "exact", head: false })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const totalXP = await supabase
      .from("aoi_activity_log")
      .select("xp_earned")
      .eq("user_id", user.id)
      .then(({ data }) => data?.reduce((sum, a) => sum + a.xp_earned, 0) || 0);

    // Get days active
    const { count: daysActive } = await supabase
      .from("aoi_activity_log")
      .select("created_at", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get recommendations
    const { data: recommendations } = await supabase
      .from("aoi_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("relevance_score", { ascending: false })
      .limit(3);

    // Build response
    const context: UserContext = {
      user_id: user.id,
      profile: {
        display_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        joined_at: profile?.created_at || new Date().toISOString(),
      },
      levels: {
        web3_mastery: aoiProfile?.web3_mastery_level || 0,
        cns_knowledge: aoiProfile?.cns_knowledge_level || 0,
        overall_rank: aoiProfile?.overall_rank || "Student",
      },
      active_paths: activePaths?.map(p => ({
        path_id: p.path_id,
        name: p.aoi_learning_paths?.name,
        progress: Math.round((p.completed_steps.length / (p.aoi_learning_paths?.steps?.length || 1)) * 100),
        current_step: p.aoi_learning_paths?.steps?.[p.current_step] || null,
      })) || [],
      stats: {
        total_lessons_completed: activityCount || 0,
        total_xp: totalXP,
        achievements_unlocked: 0, // TODO: implement achievements
        days_active: daysActive || 0,
      },
      recommendations: recommendations?.map(r => ({
        type: "next_topic",
        title: r.content_title,
        domain: r.domain,
        url: r.url,
        reason: r.reason,
      })) || [],
      last_activity: activities && activities.length > 0 ? {
        domain: activities[0].domain,
        type: activities[0].activity_type,
        title: activities[0].item_title,
        timestamp: activities[0].created_at,
      } : null,
    };

    return new Response(JSON.stringify(context), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in aoi-user-context:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
