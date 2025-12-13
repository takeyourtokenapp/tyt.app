import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PurchaseRequest {
  listingId: string;
  buyerId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { listingId, buyerId }: PurchaseRequest = await req.json();

    // 1. Get listing details
    const { data: listing, error: listingError } = await supabase
      .from("marketplace_listings")
      .select(`
        *,
        digital_miners (*)
      `)
      .eq("id", listingId)
      .eq("status", "active")
      .single();

    if (listingError || !listing) {
      return new Response(
        JSON.stringify({ error: "Listing not found or no longer available" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prevent self-purchase
    if (listing.seller_id === buyerId) {
      return new Response(
        JSON.stringify({ error: "Cannot purchase your own listing" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Check buyer's TYT balance
    const { data: buyerWallet, error: walletError } = await supabase
      .from("custodial_wallets")
      .select("id, balance")
      .eq("user_id", buyerId)
      .eq("asset", "TYT")
      .single();

    if (walletError || !buyerWallet) {
      return new Response(
        JSON.stringify({ error: "Buyer TYT wallet not found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const buyerBalance = parseFloat(buyerWallet.balance);
    const listingPrice = parseFloat(listing.price);

    if (buyerBalance < listingPrice) {
      return new Response(
        JSON.stringify({
          error: "Insufficient TYT balance",
          required: listingPrice,
          available: buyerBalance,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Lock listing (prevent double purchase)
    const { error: lockError } = await supabase
      .from("marketplace_listings")
      .update({ status: "processing" })
      .eq("id", listingId)
      .eq("status", "active");

    if (lockError) {
      return new Response(
        JSON.stringify({ error: "Listing already being purchased" }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // 4. Calculate fees
      const platformFeePercent = 0.03; // 3%
      const foundationFeePercent = 0.01; // 1%
      const creatorRoyaltyPercent = parseFloat(listing.digital_miners?.creator_royalty || '0.02'); // 2%

      const platformFee = listingPrice * platformFeePercent;
      const foundationFee = listingPrice * foundationFeePercent;
      const creatorRoyalty = listingPrice * creatorRoyaltyPercent;
      const sellerAmount = listingPrice - platformFee - foundationFee - creatorRoyalty;

      // 5. Deduct TYT from buyer
      const newBuyerBalance = buyerBalance - listingPrice;
      await supabase
        .from("custodial_wallets")
        .update({ balance: newBuyerBalance.toFixed(6) })
        .eq("id", buyerWallet.id);

      // 6. Credit seller
      const { data: sellerWallet } = await supabase
        .from("custodial_wallets")
        .select("id, balance")
        .eq("user_id", listing.seller_id)
        .eq("asset", "TYT")
        .single();

      if (sellerWallet) {
        const newSellerBalance = parseFloat(sellerWallet.balance) + sellerAmount;
        await supabase
          .from("custodial_wallets")
          .update({ balance: newSellerBalance.toFixed(6) })
          .eq("id", sellerWallet.id);
      }

      // 7. Transfer NFT miner ownership
      await supabase
        .from("digital_miners")
        .update({
          user_id: buyerId,
          last_transfer_at: new Date().toISOString(),
        })
        .eq("id", listing.miner_id);

      // 8. Update listing status
      await supabase
        .from("marketplace_listings")
        .update({
          status: "sold",
          buyer_id: buyerId,
          sold_at: new Date().toISOString(),
          sold_price: listingPrice,
        })
        .eq("id", listingId);

      // 9. Record marketplace transaction
      await supabase.from("marketplace_transactions").insert({
        listing_id: listingId,
        seller_id: listing.seller_id,
        buyer_id: buyerId,
        miner_id: listing.miner_id,
        sale_price: listingPrice,
        platform_fee: platformFee,
        foundation_fee: foundationFee,
        creator_royalty: creatorRoyalty,
        seller_received: sellerAmount,
      });

      // 10. Record wallet transactions
      await supabase.from("wallet_transactions").insert([
        {
          wallet_id: buyerWallet.id,
          user_id: buyerId,
          transaction_type: "marketplace_purchase",
          asset: "TYT",
          amount: -listingPrice,
          status: "completed",
          description: `Purchased miner #${listing.miner_id} from marketplace`,
        },
        {
          wallet_id: sellerWallet?.id,
          user_id: listing.seller_id,
          transaction_type: "marketplace_sale",
          asset: "TYT",
          amount: sellerAmount,
          status: "completed",
          description: `Sold miner #${listing.miner_id} on marketplace`,
        },
      ]);

      // 11. Credit foundation wallet
      const { data: foundationWallet } = await supabase
        .from("foundation_wallet")
        .select("balance")
        .eq("asset", "TYT")
        .single();

      if (foundationWallet) {
        const newFoundationBalance = parseFloat(foundationWallet.balance) + foundationFee;
        await supabase
          .from("foundation_wallet")
          .update({ balance: newFoundationBalance.toFixed(6) })
          .eq("asset", "TYT");

        await supabase.from("foundation_transactions").insert({
          transaction_type: "marketplace_fee",
          amount_usd: foundationFee * 0.05, // assuming TYT price $0.05
          tyt_amount: foundationFee,
          source: `Marketplace sale #${listingId}`,
        });
      }

      // 12. Burn platform fee (optional - or send to treasury)
      await supabase.from("token_burns").insert({
        burn_type: "marketplace_fee",
        tyt_amount: platformFee,
        user_id: buyerId,
        description: `Platform fee from marketplace purchase`,
      });

      console.log(`✓ Marketplace purchase complete: Listing ${listingId}`);
      console.log(`  Buyer: ${buyerId}`);
      console.log(`  Seller: ${listing.seller_id}`);
      console.log(`  Price: ${listingPrice} TYT`);
      console.log(`  Seller received: ${sellerAmount.toFixed(6)} TYT`);
      console.log(`  Platform fee: ${platformFee.toFixed(6)} TYT`);
      console.log(`  Foundation fee: ${foundationFee.toFixed(6)} TYT`);

      return new Response(
        JSON.stringify({
          success: true,
          transaction: {
            listingId,
            minerId: listing.miner_id,
            price: listingPrice,
            platformFee,
            foundationFee,
            sellerReceived: sellerAmount,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (txError) {
      // Rollback: unlock listing
      await supabase
        .from("marketplace_listings")
        .update({ status: "active" })
        .eq("id", listingId);

      throw txError;
    }
  } catch (error: any) {
    console.error("Marketplace purchase error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process purchase" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
