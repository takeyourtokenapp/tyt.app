import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuditResponse {
  user_id: string;
  ledger: {
    total_credits: number;
    total_debits: number;
    net_balance: number;
    recent_entries: LedgerEntry[];
  };
  fees: {
    total_fees_paid: number;
    fee_breakdown: FeeBreakdown;
    discount_summary: DiscountSummary;
  };
  foundation: {
    total_contributions: number;
    contribution_sources: ContributionSource[];
    recent_donations: Donation[];
  };
  burns: {
    total_burned: number;
    recent_burns: BurnEvent[];
  };
  rewards: {
    total_earned: number;
    total_claimed: number;
    pending: number;
    recent_rewards: RewardEntry[];
  };
}

interface LedgerEntry {
  entry_id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
  balance_after: number;
}

interface FeeBreakdown {
  platform_fees: number;
  maintenance_fees: number;
  marketplace_fees: number;
  withdrawal_fees: number;
}

interface DiscountSummary {
  total_discounts: number;
  vip_discounts: number;
  tyt_payment_discounts: number;
  service_button_discounts: number;
}

interface ContributionSource {
  source: string;
  amount: number;
  percentage: number;
}

interface Donation {
  donation_id: string;
  amount_usd: number;
  timestamp: string;
  source: string;
}

interface BurnEvent {
  burn_id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

interface RewardEntry {
  reward_id: string;
  amount: number;
  currency: string;
  type: string;
  timestamp: string;
  claimed: boolean;
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

    // Get ledger entries
    const { data: ledgerEntries } = await supabase
      .from("ledger_entries")
      .select("id, entry_type, amount, currency, description, created_at, balance_after")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const credits = ledgerEntries
      ?.filter((e) => e.entry_type === "credit")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

    const debits = ledgerEntries
      ?.filter((e) => e.entry_type === "debit")
      .reduce((sum, e) => sum + Math.abs(parseFloat(e.amount)), 0) || 0;

    const recentEntries: LedgerEntry[] = (ledgerEntries || []).slice(0, 10).map((e) => ({
      entry_id: e.id,
      type: e.entry_type,
      amount: parseFloat(e.amount),
      currency: e.currency,
      description: e.description,
      timestamp: e.created_at,
      balance_after: parseFloat(e.balance_after),
    }));

    // Get fee breakdown
    const { data: feeRecords } = await supabase
      .from("fee_records")
      .select("fee_type, amount_usd, discount_amount_usd")
      .eq("user_id", user.id);

    const platformFees = feeRecords
      ?.filter((f) => f.fee_type === "platform")
      .reduce((sum, f) => sum + parseFloat(f.amount_usd), 0) || 0;

    const maintenanceFees = feeRecords
      ?.filter((f) => f.fee_type === "maintenance")
      .reduce((sum, f) => sum + parseFloat(f.amount_usd), 0) || 0;

    const marketplaceFees = feeRecords
      ?.filter((f) => f.fee_type === "marketplace")
      .reduce((sum, f) => sum + parseFloat(f.amount_usd), 0) || 0;

    const withdrawalFees = feeRecords
      ?.filter((f) => f.fee_type === "withdrawal")
      .reduce((sum, f) => sum + parseFloat(f.amount_usd), 0) || 0;

    const totalFees = platformFees + maintenanceFees + marketplaceFees + withdrawalFees;

    const totalDiscounts = feeRecords
      ?.reduce((sum, f) => sum + parseFloat(f.discount_amount_usd || "0"), 0) || 0;

    // Get foundation contributions
    const { data: foundationTxs } = await supabase
      .from("foundation_wallet_transactions")
      .select("id, amount_usd, source, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const totalContributions = foundationTxs
      ?.reduce((sum, t) => sum + parseFloat(t.amount_usd), 0) || 0;

    const contributionsBySource: Record<string, number> = {};
    foundationTxs?.forEach((tx) => {
      const source = tx.source || "unknown";
      contributionsBySource[source] = (contributionsBySource[source] || 0) + parseFloat(tx.amount_usd);
    });

    const contributionSources: ContributionSource[] = Object.entries(contributionsBySource).map(
      ([source, amount]) => ({
        source,
        amount: Math.round(amount * 100) / 100,
        percentage: totalContributions > 0 ? Math.round((amount / totalContributions) * 100) : 0,
      })
    );

    const recentDonations: Donation[] = (foundationTxs || []).slice(0, 5).map((tx) => ({
      donation_id: tx.id,
      amount_usd: Math.round(parseFloat(tx.amount_usd) * 100) / 100,
      timestamp: tx.created_at,
      source: tx.source || "platform",
    }));

    // Get burn events
    const { data: burnEvents } = await supabase
      .from("burn_events")
      .select("id, amount, reason, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const totalBurned = burnEvents
      ?.reduce((sum, b) => sum + parseFloat(b.amount), 0) || 0;

    const recentBurns: BurnEvent[] = (burnEvents || []).slice(0, 5).map((b) => ({
      burn_id: b.id,
      amount: parseFloat(b.amount),
      reason: b.reason,
      timestamp: b.created_at,
    }));

    // Get rewards
    const { data: rewards } = await supabase
      .from("user_rewards")
      .select("id, reward_type, amount_btc, claimed, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const totalEarned = rewards
      ?.reduce((sum, r) => sum + parseFloat(r.amount_btc), 0) || 0;

    const totalClaimed = rewards
      ?.filter((r) => r.claimed)
      .reduce((sum, r) => sum + parseFloat(r.amount_btc), 0) || 0;

    const pending = totalEarned - totalClaimed;

    const recentRewards: RewardEntry[] = (rewards || []).slice(0, 10).map((r) => ({
      reward_id: r.id,
      amount: parseFloat(r.amount_btc),
      currency: "BTC",
      type: r.reward_type,
      timestamp: r.created_at,
      claimed: r.claimed,
    }));

    const response: AuditResponse = {
      user_id: user.id,
      ledger: {
        total_credits: Math.round(credits * 100) / 100,
        total_debits: Math.round(debits * 100) / 100,
        net_balance: Math.round((credits - debits) * 100) / 100,
        recent_entries: recentEntries,
      },
      fees: {
        total_fees_paid: Math.round(totalFees * 100) / 100,
        fee_breakdown: {
          platform_fees: Math.round(platformFees * 100) / 100,
          maintenance_fees: Math.round(maintenanceFees * 100) / 100,
          marketplace_fees: Math.round(marketplaceFees * 100) / 100,
          withdrawal_fees: Math.round(withdrawalFees * 100) / 100,
        },
        discount_summary: {
          total_discounts: Math.round(totalDiscounts * 100) / 100,
          vip_discounts: 0,
          tyt_payment_discounts: Math.round(totalDiscounts * 0.7 * 100) / 100,
          service_button_discounts: Math.round(totalDiscounts * 0.3 * 100) / 100,
        },
      },
      foundation: {
        total_contributions: Math.round(totalContributions * 100) / 100,
        contribution_sources: contributionSources,
        recent_donations: recentDonations,
      },
      burns: {
        total_burned: Math.round(totalBurned * 100) / 100,
        recent_burns: recentBurns,
      },
      rewards: {
        total_earned: Math.round(totalEarned * 100000000) / 100000000,
        total_claimed: Math.round(totalClaimed * 100000000) / 100000000,
        pending: Math.round(pending * 100000000) / 100000000,
        recent_rewards: recentRewards,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in aoi-audit:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
