import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserContext {
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
  profile: {
    display_name: string | null;
    avatar_url: string | null;
    joined_at: string;
    ui_theme: string;
    ui_language: string;
  };
  access_level: {
    kyc_status: string;
    vip_tier: number;
    access_tier: string;
  };
  active_modules: {
    academy: boolean;
    mining: boolean;
    wallet: boolean;
    marketplace: boolean;
    governance: boolean;
    foundation: boolean;
  };
  stats: {
    total_miners: number;
    active_miners: number;
    total_hashrate: number;
    total_btc_earned: number;
    wallet_balance_usd: number;
    academy_progress: number;
    governance_votes: number;
  };
  aoi_progress: {
    level: number;
    experience_points: number;
    current_track: string | null;
    rank: string;
    achievements_count: number;
  };
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

    // Get user profile with UI preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, created_at, ui_theme, ui_language, role")
      .eq("id", user.id)
      .maybeSingle();

    // Get KYC and access level
    const { data: kycData } = await supabase
      .from("kyc_verifications")
      .select("verification_level, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: vipData } = await supabase
      .from("vip_levels")
      .select("level")
      .eq("user_id", user.id)
      .maybeSingle();

    // Get mining stats
    const { data: miners } = await supabase
      .from("user_miners")
      .select("status, power_th, total_btc_earned")
      .eq("user_id", user.id);

    const activeMiners = miners?.filter((m) => m.status === "active") || [];
    const totalHashrate = activeMiners.reduce((sum, m) => sum + (parseFloat(m.power_th) || 0), 0);
    const totalBtcEarned = miners?.reduce(
      (sum, m) => sum + (parseFloat(m.total_btc_earned) || 0),
      0
    ) || 0;

    // Get wallet balance
    const { data: walletBalance } = await supabase
      .from("custodial_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .eq("chain", "bitcoin")
      .maybeSingle();

    // Get academy progress
    const { count: lessonsCompleted } = await supabase
      .from("user_academy_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed");

    // Get governance participation
    const { count: governanceVotes } = await supabase
      .from("governance_votes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get aOi progress
    const { data: aoiProgress } = await supabase
      .from("aoi_user_progress")
      .select("level, experience_points, current_track")
      .eq("user_id", user.id)
      .maybeSingle();

    const { count: achievementsCount } = await supabase
      .from("aoi_achievements")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Determine rank based on XP
    const xp = aoiProgress?.experience_points || 0;
    let rank = "Worker";
    if (xp >= 10000) rank = "Warrior";
    else if (xp >= 5000) rank = "Peacekeeper";
    else if (xp >= 2000) rank = "Diplomat";
    else if (xp >= 500) rank = "Academic";

    // Determine permissions based on role and KYC
    const role = profile?.role || "user";
    const permissions: string[] = ["read:profile", "write:profile"];

    if (kycData?.status === "verified") {
      permissions.push("withdraw:funds", "trade:marketplace");
    }

    if (role === "admin") {
      permissions.push("admin:all");
    }

    if (activeMiners.length > 0) {
      permissions.push("manage:miners");
    }

    // Build context
    const context: UserContext = {
      user_id: user.id,
      email: user.email || "",
      role,
      permissions,
      profile: {
        display_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        joined_at: profile?.created_at || new Date().toISOString(),
        ui_theme: profile?.ui_theme || "auto",
        ui_language: profile?.ui_language || "EN",
      },
      access_level: {
        kyc_status: kycData?.status || "none",
        vip_tier: vipData?.level || 0,
        access_tier: kycData?.verification_level || "basic",
      },
      active_modules: {
        academy: (lessonsCompleted || 0) > 0,
        mining: activeMiners.length > 0,
        wallet: walletBalance !== null,
        marketplace: kycData?.status === "verified",
        governance: (governanceVotes || 0) > 0,
        foundation: true,
      },
      stats: {
        total_miners: miners?.length || 0,
        active_miners: activeMiners.length,
        total_hashrate: Math.round(totalHashrate * 100) / 100,
        total_btc_earned: Math.round(totalBtcEarned * 100000000) / 100000000,
        wallet_balance_usd: parseFloat(walletBalance?.balance || "0"),
        academy_progress: lessonsCompleted || 0,
        governance_votes: governanceVotes || 0,
      },
      aoi_progress: {
        level: aoiProgress?.level || 1,
        experience_points: aoiProgress?.experience_points || 0,
        current_track: aoiProgress?.current_track || null,
        rank,
        achievements_count: achievementsCount || 0,
      },
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
