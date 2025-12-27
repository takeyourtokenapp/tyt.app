import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Domain",
};

interface ActivityLogRequest {
  domain: "foundation" | "app";
  activity_type: string;
  item_id: string;
  item_title: string;
  result?: any;
  xp_earned?: number;
  timestamp?: string;
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

    if (req.method === "POST") {
      const body: ActivityLogRequest = await req.json();

      // Validate required fields
      if (!body.domain || !body.activity_type || !body.item_id || !body.item_title) {
        return new Response(
          JSON.stringify({ error: "bad_request", message: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use the database function to log activity (handles profile creation + level updates)
      const { data: activityId, error } = await supabase.rpc("log_aoi_activity", {
        p_user_id: user.id,
        p_domain: body.domain,
        p_activity_type: body.activity_type,
        p_item_id: body.item_id,
        p_item_title: body.item_title,
        p_result: body.result || {},
        p_xp_earned: body.xp_earned || 0,
      });

      if (error) {
        console.error("Error logging activity:", error);
        return new Response(
          JSON.stringify({ error: "internal_error", message: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get updated profile
      const { data: aoiProfile } = await supabase
        .from("aoi_user_profiles")
        .select("web3_mastery_level, cns_knowledge_level, overall_rank")
        .eq("user_id", user.id)
        .single();

      // Calculate total XP
      const { data: xpData } = await supabase
        .from("aoi_activity_log")
        .select("xp_earned")
        .eq("user_id", user.id);

      const newTotalXP = xpData?.reduce((sum, a) => sum + a.xp_earned, 0) || 0;
      const oldTotalXP = newTotalXP - (body.xp_earned || 0);

      // Check for level up (every 1000 XP)
      const levelUp = Math.floor(newTotalXP / 1000) > Math.floor(oldTotalXP / 1000);

      // Generate aOi response
      const aoiResponse = {
        congratulations: `Great work on ${body.item_title}!`,
        next_suggestion: "Keep up the momentum - try another lesson!",
      };

      return new Response(
        JSON.stringify({
          activity_id: activityId,
          success: true,
          new_total_xp: newTotalXP,
          level_up: levelUp,
          current_levels: {
            web3_mastery: aoiProfile?.web3_mastery_level || 0,
            cns_knowledge: aoiProfile?.cns_knowledge_level || 0,
            overall_rank: aoiProfile?.overall_rank || "Student",
          },
          achievements_unlocked: [],
          aoi_response: aoiResponse,
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (req.method === "GET") {
      // Get activity history
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const domain = url.searchParams.get("domain") || "both";

      let query = supabase
        .from("aoi_activity_log")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (domain !== "both") {
        query = query.eq("domain", domain);
      }

      const { data: activities, error, count } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: "internal_error", message: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          activities: activities || [],
          total_count: count || 0,
          pagination: {
            limit,
            offset,
            has_more: (count || 0) > offset + limit,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "method_not_allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in aoi-activity-log:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
