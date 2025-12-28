import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VERSION = "3.0.0";
const BUILD_DATE = "2025-12-28";

interface SystemStatus {
  version: string;
  build_date: string;
  status: "operational" | "degraded" | "maintenance";
  timestamp: string;
  modules: {
    auth: ModuleStatus;
    database: ModuleStatus;
    academy: ModuleStatus;
    mining: ModuleStatus;
    wallet: ModuleStatus;
    marketplace: ModuleStatus;
    governance: ModuleStatus;
    foundation: ModuleStatus;
    aoi: ModuleStatus;
  };
  metrics: {
    total_users: number;
    active_miners: number;
    total_rewards_distributed: number;
    foundation_contributions: number;
    academy_completions: number;
  };
}

interface ModuleStatus {
  status: "operational" | "degraded" | "offline";
  last_check: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date().toISOString();

    // Check database connectivity
    const dbCheck = await checkDatabase(supabase);

    // Check auth module
    const authCheck = await checkAuth(supabase);

    // Check academy
    const academyCheck = await checkAcademy(supabase);

    // Check mining
    const miningCheck = await checkMining(supabase);

    // Check wallet
    const walletCheck = await checkWallet(supabase);

    // Check marketplace
    const marketplaceCheck = await checkMarketplace(supabase);

    // Check governance
    const governanceCheck = await checkGovernance(supabase);

    // Check foundation
    const foundationCheck = await checkFoundation(supabase);

    // Check aOi
    const aoiCheck = await checkAoi(supabase);

    // Get metrics
    const metrics = await getMetrics(supabase);

    // Determine overall status
    const allModules = [
      dbCheck,
      authCheck,
      academyCheck,
      miningCheck,
      walletCheck,
      marketplaceCheck,
      governanceCheck,
      foundationCheck,
      aoiCheck,
    ];

    const offlineCount = allModules.filter((m) => m.status === "offline").length;
    const degradedCount = allModules.filter((m) => m.status === "degraded").length;

    let overallStatus: "operational" | "degraded" | "maintenance" = "operational";
    if (offlineCount > 0) {
      overallStatus = "maintenance";
    } else if (degradedCount > 0) {
      overallStatus = "degraded";
    }

    const status: SystemStatus = {
      version: VERSION,
      build_date: BUILD_DATE,
      status: overallStatus,
      timestamp: now,
      modules: {
        auth: authCheck,
        database: dbCheck,
        academy: academyCheck,
        mining: miningCheck,
        wallet: walletCheck,
        marketplace: marketplaceCheck,
        governance: governanceCheck,
        foundation: foundationCheck,
        aoi: aoiCheck,
      },
      metrics,
    };

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in aoi-status:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function checkDatabase(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "offline",
      last_check: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkAuth(supabase: any): Promise<ModuleStatus> {
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkAcademy(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("academy_lessons")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Academy module experiencing issues",
    };
  }
}

async function checkMining(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("user_miners")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Mining module experiencing issues",
    };
  }
}

async function checkWallet(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("custodial_wallets")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Wallet module experiencing issues",
    };
  }
}

async function checkMarketplace(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("marketplace_listings")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Marketplace module experiencing issues",
    };
  }
}

async function checkGovernance(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("governance_proposals")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Governance module experiencing issues",
    };
  }
}

async function checkFoundation(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("foundation_wallet_transactions")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "Foundation module experiencing issues",
    };
  }
}

async function checkAoi(supabase: any): Promise<ModuleStatus> {
  try {
    const { error } = await supabase
      .from("aoi_user_progress")
      .select("id")
      .limit(1);
    if (error) throw error;
    return { status: "operational", last_check: new Date().toISOString() };
  } catch (error) {
    return {
      status: "degraded",
      last_check: new Date().toISOString(),
      message: "aOi module experiencing issues",
    };
  }
}

async function getMetrics(supabase: any) {
  try {
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const { count: activeMiners } = await supabase
      .from("user_miners")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");

    const { data: rewardsData } = await supabase
      .from("user_miners")
      .select("total_btc_earned");

    const totalRewards = rewardsData?.reduce(
      (sum: number, m: any) => sum + (parseFloat(m.total_btc_earned) || 0),
      0
    ) || 0;

    const { data: foundationData } = await supabase
      .from("foundation_wallet_transactions")
      .select("amount_usd");

    const foundationContributions = foundationData?.reduce(
      (sum: number, t: any) => sum + (parseFloat(t.amount_usd) || 0),
      0
    ) || 0;

    const { count: academyCompletions } = await supabase
      .from("user_academy_progress")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed");

    return {
      total_users: totalUsers || 0,
      active_miners: activeMiners || 0,
      total_rewards_distributed: Math.round(totalRewards * 100000000) / 100000000,
      foundation_contributions: Math.round(foundationContributions * 100) / 100,
      academy_completions: academyCompletions || 0,
    };
  } catch (error) {
    console.error("Error getting metrics:", error);
    return {
      total_users: 0,
      active_miners: 0,
      total_rewards_distributed: 0,
      foundation_contributions: 0,
      academy_completions: 0,
    };
  }
}
