/*
  # Add Complete Network Support for TYT Ecosystem

  1. New Networks
    - Bitcoin (BTC) native blockchain
    - Bitcoin Lightning Network
    - Bitcoin Liquid Network
    - TON (Telegram Open Network)
    - XRP Ledger
    - Arbitrum
    - Optimism
    - Avalanche

  2. Updates
    - Add network icons and descriptions
    - Add fee structures per network
    - Add deposit/withdrawal limits

  3. Security
    - Existing RLS policies apply
    - Network configuration read-only for users
*/

-- Add missing networks
INSERT INTO blockchain_networks (
  network_code,
  network_name,
  chain_id,
  explorer_url,
  min_confirmations,
  supports_tokens,
  native_symbol,
  rpc_endpoint,
  is_active
) VALUES
  ('BTC', 'Bitcoin Mainnet', NULL, 'https://blockchair.com/bitcoin', 3, false, 'BTC', NULL, true),
  ('BTC_LIGHTNING', 'Lightning Network', NULL, 'https://1ml.com', 0, false, 'BTC', NULL, true),
  ('BTC_LIQUID', 'Liquid Network', NULL, 'https://blockstream.info/liquid', 2, true, 'L-BTC', NULL, true),
  ('TON', 'TON Blockchain', NULL, 'https://tonscan.org', 10, true, 'TON', 'https://toncenter.com/api/v2', true),
  ('XRP', 'XRP Ledger', NULL, 'https://xrpscan.com', 1, true, 'XRP', 'https://xrpl.ws', true),
  ('ARBITRUM', 'Arbitrum One', '42161', 'https://arbiscan.io', 10, true, 'ETH', 'https://arb1.arbitrum.io/rpc', true),
  ('OPTIMISM', 'Optimism', '10', 'https://optimistic.etherscan.io', 10, true, 'ETH', 'https://mainnet.optimism.io', true),
  ('AVALANCHE', 'Avalanche C-Chain', '43114', 'https://snowtrace.io', 10, true, 'AVAX', 'https://api.avax.network/ext/bc/C/rpc', true)
ON CONFLICT (network_code) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  explorer_url = EXCLUDED.explorer_url;

-- Add network metadata table for additional information
CREATE TABLE IF NOT EXISTS network_metadata (
  network_code text PRIMARY KEY REFERENCES blockchain_networks(network_code),
  icon_url text,
  description text,
  average_block_time_seconds integer,

  -- Fee structure
  base_fee_percentage numeric(5,4) DEFAULT 0.01,
  min_fee_amount numeric(20,8) DEFAULT 0.00001,
  max_fee_amount numeric(20,8),

  -- Limits
  min_deposit_amount numeric(20,8) DEFAULT 0.0001,
  max_deposit_amount numeric(20,8),
  min_withdrawal_amount numeric(20,8) DEFAULT 0.001,
  max_withdrawal_amount numeric(20,8),
  daily_withdrawal_limit numeric(20,8),

  -- Features
  supports_memos boolean DEFAULT false,
  supports_smart_contracts boolean DEFAULT false,
  supports_nft boolean DEFAULT false,

  -- Display
  display_order integer DEFAULT 999,
  is_featured boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_network_metadata_display ON network_metadata(display_order);

-- Seed network metadata
INSERT INTO network_metadata (
  network_code,
  description,
  average_block_time_seconds,
  base_fee_percentage,
  min_deposit_amount,
  min_withdrawal_amount,
  supports_memos,
  supports_smart_contracts,
  display_order,
  is_featured
) VALUES
  ('BTC', 'Bitcoin native blockchain - the most secure and decentralized network', 600, 0.02, 0.0001, 0.001, false, false, 1, true),
  ('BTC_LIGHTNING', 'Instant Bitcoin payments with near-zero fees', 0, 0.001, 0.00001, 0.00001, false, false, 2, true),
  ('BTC_LIQUID', 'Fast and confidential Bitcoin transactions', 60, 0.01, 0.0001, 0.001, false, true, 3, false),
  ('ETH', 'Ethereum smart contract platform', 12, 0.015, 0.001, 0.01, false, true, 4, true),
  ('TRON', 'High-throughput blockchain for DApps', 3, 0.01, 1.0, 10.0, true, true, 5, true),
  ('SOL', 'Ultra-fast blockchain with low fees', 0.4, 0.01, 0.001, 0.01, true, true, 6, true),
  ('POLYGON', 'Ethereum scaling solution', 2, 0.01, 0.1, 1.0, false, true, 7, false),
  ('BSC', 'BNB Smart Chain for DeFi', 3, 0.01, 0.001, 0.01, false, true, 8, false),
  ('TON', 'Telegram blockchain for mass adoption', 5, 0.01, 1.0, 10.0, true, true, 9, true),
  ('XRP', 'Fast and cheap international payments', 4, 0.005, 1.0, 10.0, true, false, 10, true),
  ('ARBITRUM', 'Ethereum Layer 2 for lower fees', 1, 0.01, 0.01, 0.1, false, true, 11, false),
  ('OPTIMISM', 'Ethereum Layer 2 optimistic rollup', 1, 0.01, 0.01, 0.1, false, true, 12, false),
  ('AVALANCHE', 'High-speed blockchain platform', 2, 0.01, 0.1, 1.0, false, true, 13, false)
ON CONFLICT (network_code) DO UPDATE SET
  description = EXCLUDED.description,
  average_block_time_seconds = EXCLUDED.average_block_time_seconds,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured;

-- Add supported tokens table (for USDT, wBTC, etc)
CREATE TABLE IF NOT EXISTS supported_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_code text NOT NULL REFERENCES blockchain_networks(network_code),
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  contract_address text,
  decimals integer NOT NULL DEFAULT 18,

  -- Display
  icon_url text,
  is_active boolean DEFAULT true,

  -- Limits
  min_deposit_amount numeric(20,8) DEFAULT 1.0,
  min_withdrawal_amount numeric(20,8) DEFAULT 10.0,

  created_at timestamptz DEFAULT now(),

  UNIQUE(network_code, token_symbol)
);

CREATE INDEX IF NOT EXISTS idx_supported_tokens_network ON supported_tokens(network_code);
CREATE INDEX IF NOT EXISTS idx_supported_tokens_active ON supported_tokens(is_active);

-- Seed popular tokens
INSERT INTO supported_tokens (
  network_code,
  token_symbol,
  token_name,
  contract_address,
  decimals,
  min_deposit_amount,
  min_withdrawal_amount
) VALUES
  -- Ethereum tokens
  ('ETH', 'USDT', 'Tether USD', '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 10.0, 20.0),
  ('ETH', 'USDC', 'USD Coin', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 10.0, 20.0),
  ('ETH', 'WBTC', 'Wrapped Bitcoin', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 0.0001, 0.001),
  ('ETH', 'TYT', 'TYT Token', '0x0000000000000000000000000000000000000000', 18, 100.0, 500.0),

  -- TRON tokens
  ('TRON', 'USDT', 'Tether USD', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 6, 10.0, 20.0),
  ('TRON', 'USDC', 'USD Coin', 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', 6, 10.0, 20.0),

  -- BSC tokens
  ('BSC', 'USDT', 'Tether USD', '0x55d398326f99059ff775485246999027b3197955', 18, 10.0, 20.0),
  ('BSC', 'USDC', 'USD Coin', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', 18, 10.0, 20.0),
  ('BSC', 'BTCB', 'Bitcoin BEP20', '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', 18, 0.0001, 0.001),

  -- Polygon tokens
  ('POLYGON', 'USDT', 'Tether USD', '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 10.0, 20.0),
  ('POLYGON', 'USDC', 'USD Coin', '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 10.0, 20.0),
  ('POLYGON', 'WBTC', 'Wrapped Bitcoin', '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', 8, 0.0001, 0.001),

  -- Solana tokens
  ('SOL', 'USDT', 'Tether USD', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 6, 10.0, 20.0),
  ('SOL', 'USDC', 'USD Coin', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 6, 10.0, 20.0),
  ('SOL', 'TYT', 'TYT Token', 'TYT1111111111111111111111111111111111111111', 9, 100.0, 500.0),

  -- Liquid tokens
  ('BTC_LIQUID', 'USDT', 'Tether USD', NULL, 8, 10.0, 20.0),

  -- TON tokens
  ('TON', 'USDT', 'Tether USD', 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', 6, 10.0, 20.0),

  -- Arbitrum tokens
  ('ARBITRUM', 'USDT', 'Tether USD', '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', 6, 10.0, 20.0),
  ('ARBITRUM', 'USDC', 'USD Coin', '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', 6, 10.0, 20.0),

  -- Optimism tokens
  ('OPTIMISM', 'USDT', 'Tether USD', '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', 6, 10.0, 20.0),
  ('OPTIMISM', 'USDC', 'USD Coin', '0x7f5c764cbc14f9669b88837ca1490cca17c31607', 6, 10.0, 20.0)
ON CONFLICT (network_code, token_symbol) DO NOTHING;

-- RLS for new tables
ALTER TABLE network_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE supported_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view network metadata"
  ON network_metadata FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view supported tokens"
  ON supported_tokens FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Helper function to get featured networks
CREATE OR REPLACE FUNCTION get_featured_networks()
RETURNS TABLE (
  network_code text,
  network_name text,
  native_symbol text,
  description text,
  explorer_url text,
  supports_tokens boolean,
  is_featured boolean,
  display_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bn.network_code,
    bn.network_name,
    bn.native_symbol,
    nm.description,
    bn.explorer_url,
    bn.supports_tokens,
    nm.is_featured,
    nm.display_order
  FROM blockchain_networks bn
  LEFT JOIN network_metadata nm ON nm.network_code = bn.network_code
  WHERE bn.is_active = true
  ORDER BY nm.display_order, bn.network_name;
END;
$$;

-- Helper function to get network with tokens
CREATE OR REPLACE FUNCTION get_network_with_tokens(p_network_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'network', row_to_json(bn.*),
    'metadata', row_to_json(nm.*),
    'tokens', COALESCE(
      (
        SELECT jsonb_agg(row_to_json(st.*))
        FROM supported_tokens st
        WHERE st.network_code = p_network_code
          AND st.is_active = true
      ),
      '[]'::jsonb
    )
  ) INTO v_result
  FROM blockchain_networks bn
  LEFT JOIN network_metadata nm ON nm.network_code = bn.network_code
  WHERE bn.network_code = p_network_code;

  RETURN v_result;
END;
$$;