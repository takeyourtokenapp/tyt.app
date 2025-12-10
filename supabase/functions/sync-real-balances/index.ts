import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BlockchainBalance {
  blockchain: string;
  asset: string;
  balance: string;
  usdValue: number;
  address: string;
}

const BLOCKCHAIN_RPCS = {
  bitcoin: "https://blockstream.info/api",
  ethereum: "https://eth.llamarpc.com",
  solana: "https://api.mainnet-beta.solana.com",
  tron: "https://api.trongrid.io",
  xrp: "https://s1.ripple.com:51234"
};

const PRICE_API = "https://api.coingecko.com/api/v3";

const COIN_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  TRX: "tron",
  XRP: "ripple"
};

async function getAssetPrice(symbol: string): Promise<number> {
  try {
    const coinId = COIN_IDS[symbol];
    if (!coinId) return 0;

    const response = await fetch(
      `${PRICE_API}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const data = await response.json();
    return data[coinId]?.usd || 0;
  } catch (error) {
    console.error(`Price fetch error for ${symbol}:`, error);
    return 0;
  }
}

async function getBitcoinBalance(address: string): Promise<BlockchainBalance | null> {
  try {
    const response = await fetch(`${BLOCKCHAIN_RPCS.bitcoin}/address/${address}`);
    if (!response.ok) return null;

    const data = await response.json();
    const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
    const price = await getAssetPrice("BTC");

    return {
      blockchain: "Bitcoin",
      asset: "BTC",
      balance: balance.toFixed(8),
      usdValue: balance * price,
      address
    };
  } catch (error) {
    console.error("Bitcoin balance error:", error);
    return null;
  }
}

async function getEthereumBalance(address: string): Promise<BlockchainBalance | null> {
  try {
    const response = await fetch(BLOCKCHAIN_RPCS.ethereum, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
      })
    });

    const data = await response.json();
    if (data.error) return null;

    const balanceWei = BigInt(data.result);
    const balance = Number(balanceWei) / 1e18;
    const price = await getAssetPrice("ETH");

    return {
      blockchain: "Ethereum",
      asset: "ETH",
      balance: balance.toFixed(8),
      usdValue: balance * price,
      address
    };
  } catch (error) {
    console.error("Ethereum balance error:", error);
    return null;
  }
}

async function getSolanaBalance(address: string): Promise<BlockchainBalance | null> {
  try {
    const response = await fetch(BLOCKCHAIN_RPCS.solana, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [address]
      })
    });

    const data = await response.json();
    if (data.error) return null;

    const balance = data.result.value / 1e9;
    const price = await getAssetPrice("SOL");

    return {
      blockchain: "Solana",
      asset: "SOL",
      balance: balance.toFixed(8),
      usdValue: balance * price,
      address
    };
  } catch (error) {
    console.error("Solana balance error:", error);
    return null;
  }
}

async function getTronBalance(address: string): Promise<BlockchainBalance | null> {
  try {
    const response = await fetch(`${BLOCKCHAIN_RPCS.tron}/v1/accounts/${address}`);
    if (!response.ok) return null;

    const data = await response.json();
    const balance = (data.data?.[0]?.balance || 0) / 1e6;
    const price = await getAssetPrice("TRX");

    return {
      blockchain: "Tron",
      asset: "TRX",
      balance: balance.toFixed(6),
      usdValue: balance * price,
      address
    };
  } catch (error) {
    console.error("Tron balance error:", error);
    return null;
  }
}

async function getXRPBalance(address: string): Promise<BlockchainBalance | null> {
  try {
    const response = await fetch(BLOCKCHAIN_RPCS.xrp, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_info",
        params: [{
          account: address,
          ledger_index: "validated"
        }]
      })
    });

    const data = await response.json();
    if (data.error) return null;

    const balance = Number(data.result.account_data.Balance) / 1e6;
    const price = await getAssetPrice("XRP");

    return {
      blockchain: "XRP Ledger",
      asset: "XRP",
      balance: balance.toFixed(6),
      usdValue: balance * price,
      address
    };
  } catch (error) {
    console.error("XRP balance error:", error);
    return null;
  }
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: addresses, error: addressError } = await supabase
      .from("blockchain_deposit_addresses")
      .select("network_code, address")
      .eq("user_id", user.id);

    if (addressError || !addresses || addresses.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No addresses to sync",
          balances: []
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const balances: BlockchainBalance[] = [];

    for (const addr of addresses) {
      let balance: BlockchainBalance | null = null;

      switch (addr.network_code.toLowerCase()) {
        case "btc":
          balance = await getBitcoinBalance(addr.address);
          break;
        case "eth":
          balance = await getEthereumBalance(addr.address);
          break;
        case "sol":
          balance = await getSolanaBalance(addr.address);
          break;
        case "trx":
          balance = await getTronBalance(addr.address);
          break;
        case "xrp":
          balance = await getXRPBalance(addr.address);
          break;
      }

      if (balance) {
        balances.push(balance);

        await supabase
          .from("custodial_wallets")
          .upsert({
            user_id: user.id,
            asset: balance.asset,
            balance: balance.balance,
            blockchain: balance.blockchain.toLowerCase()
          }, {
            onConflict: "user_id,asset"
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        balances: balances,
        synced_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});