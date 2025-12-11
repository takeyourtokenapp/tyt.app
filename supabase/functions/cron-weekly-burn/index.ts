import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const cronSecret = Deno.env.get("CRON_SECRET");
    const authHeader = req.headers.get("Authorization");

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid cron secret" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting weekly TYT burn process...");

    const burnDate = new Date().toISOString().split("T")[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    const { data: existingBurn } = await supabase
      .from("token_burn_events")
      .select("id")
      .eq("burn_date", burnDate)
      .maybeSingle();

    if (existingBurn) {
      console.log(`Burn event already exists for ${burnDate}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Burn already processed today",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let totalTYTToBurn = 0;

    const { data: maintenanceInvoices } = await supabase
      .from("maintenance_invoices")
      .select("final_cost")
      .eq("payment_method", "TYT")
      .gte("invoice_date", weekStartStr)
      .lt("invoice_date", burnDate);

    if (maintenanceInvoices) {
      for (const invoice of maintenanceInvoices) {
        totalTYTToBurn += parseFloat(invoice.final_cost);
      }
    }

    const { data: marketplaceSales } = await supabase
      .from("marketplace_sales")
      .select("platform_fee_amount")
      .gte("sale_date", weekStartStr)
      .lt("sale_date", burnDate);

    if (marketplaceSales) {
      for (const sale of marketplaceSales) {
        const fee = parseFloat(sale.platform_fee_amount);
        totalTYTToBurn += fee * 0.5;
      }
    }

    const { data: minerUpgrades } = await supabase
      .from("miner_upgrades")
      .select("cost")
      .gte("upgraded_at", weekStartStr)
      .lt("upgraded_at", burnDate);

    if (minerUpgrades) {
      for (const upgrade of minerUpgrades) {
        totalTYTToBurn += parseFloat(upgrade.cost);
      }
    }

    const charityMintPercent = 0.25;
    const charityMintAmount = totalTYTToBurn * charityMintPercent;

    const distributionHashrate = totalTYTToBurn * 0.40;
    const distributionVeTYT = totalTYTToBurn * 0.30;
    const distributionTreasury = totalTYTToBurn * 0.20;
    const distributionFoundation = totalTYTToBurn * 0.10;

    const { data: burnEvent, error: burnError } = await supabase
      .from("token_burn_events")
      .insert({
        burn_date: burnDate,
        amount_burned: totalTYTToBurn.toFixed(0),
        source_maintenance: maintenanceInvoices?.length || 0,
        source_marketplace: marketplaceSales?.length || 0,
        source_upgrades: minerUpgrades?.length || 0,
        charity_mint_amount: charityMintAmount.toFixed(0),
      })
      .select()
      .single();

    if (burnError) throw burnError;

    const { error: distributionError } = await supabase
      .from("burn_mint_distributions")
      .insert({
        burn_event_id: burnEvent.id,
        distribution_date: burnDate,
        hashrate_providers: distributionHashrate.toFixed(0),
        ve_tyt_holders: distributionVeTYT.toFixed(0),
        treasury: distributionTreasury.toFixed(0),
        foundation: distributionFoundation.toFixed(0),
      });

    if (distributionError) throw distributionError;

    const { data: allMiners } = await supabase
      .from("nft_miners")
      .select("owner_id, hashrate_th")
      .eq("status", "active");

    if (allMiners && allMiners.length > 0) {
      const totalHashrate = allMiners.reduce((sum, m) => sum + m.hashrate_th, 0);

      const userShares = new Map<string, number>();
      for (const miner of allMiners) {
        const share = (miner.hashrate_th / totalHashrate) * distributionHashrate;
        const currentShare = userShares.get(miner.owner_id) || 0;
        userShares.set(miner.owner_id, currentShare + share);
      }

      for (const [userId, shareAmount] of userShares.entries()) {
        const { data: tytWallet } = await supabase
          .from("custodial_wallets")
          .select("balance")
          .eq("user_id", userId)
          .eq("asset", "TYT")
          .maybeSingle();

        const currentBalance = tytWallet ? parseFloat(tytWallet.balance) : 0;
        const newBalance = currentBalance + shareAmount;

        await supabase
          .from("custodial_wallets")
          .upsert(
            {
              user_id: userId,
              asset: "TYT",
              balance: newBalance.toFixed(0),
              blockchain: "solana",
            },
            {
              onConflict: "user_id,asset",
            }
          );

        await supabase.from("wallet_transactions").insert({
          user_id: userId,
          transaction_type: "reward",
          asset: "TYT",
          amount: shareAmount.toFixed(0),
          status: "completed",
          description: `Weekly burn distribution (${burnDate})`,
        });
      }

      console.log(`✓ Distributed ${distributionHashrate.toFixed(0)} TYT to ${userShares.size} users`);
    }

    const { data: foundationWallet } = await supabase
      .from("custodial_wallets")
      .select("balance")
      .eq("asset", "TYT")
      .eq("user_id", "00000000-0000-0000-0000-000000000000")
      .maybeSingle();

    const foundationBalance = foundationWallet ? parseFloat(foundationWallet.balance) : 0;
    const newFoundationBalance = foundationBalance + charityMintAmount + distributionFoundation;

    await supabase
      .from("custodial_wallets")
      .upsert(
        {
          user_id: "00000000-0000-0000-0000-000000000000",
          asset: "TYT",
          balance: newFoundationBalance.toFixed(0),
          blockchain: "solana",
        },
        {
          onConflict: "user_id,asset",
        }
      );

    console.log(`✓ Foundation received ${(charityMintAmount + distributionFoundation).toFixed(0)} TYT`);

    console.log(
      `Burn complete: ${totalTYTToBurn.toFixed(0)} TYT burned, ${charityMintAmount.toFixed(0)} charity mint`
    );

    return new Response(
      JSON.stringify({
        success: true,
        burn_date: burnDate,
        amount_burned: totalTYTToBurn.toFixed(0),
        charity_mint: charityMintAmount.toFixed(0),
        distributions: {
          hashrate: distributionHashrate.toFixed(0),
          ve_tyt: distributionVeTYT.toFixed(0),
          treasury: distributionTreasury.toFixed(0),
          foundation: distributionFoundation.toFixed(0),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Burn cron error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
