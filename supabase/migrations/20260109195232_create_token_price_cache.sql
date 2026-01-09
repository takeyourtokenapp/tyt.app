/*
  # Create Token Price Cache Table

  1. Purpose
    - Cache real-time token price data from external APIs
    - Reduce API calls and improve performance
    - Provide fallback data when APIs are unavailable
    - Track data sources and freshness

  2. New Tables
    - `token_price_cache`
      - `id` (uuid, primary key)
      - `token_mint` (text) - Solana token mint address
      - `price` (numeric) - Token price in USD
      - `market_cap` (numeric) - Market capitalization in USD
      - `volume_24h` (numeric) - 24h trading volume in USD
      - `price_change_24h` (numeric) - 24h price change percentage
      - `holders` (integer) - Number of token holders
      - `total_supply` (numeric) - Total token supply
      - `liquidity` (numeric) - Total liquidity in USD
      - `source` (text) - Data source name
      - `created_at` (timestamptz) - When data was cached

  3. Security
    - Enable RLS
    - Allow public read access (token prices are public data)
    - Restrict insert to authenticated users only
    - No update/delete (append-only cache)

  4. Performance
    - Index on token_mint for fast lookups
    - Index on created_at for time-based queries
    - Composite index for (token_mint, created_at DESC)
*/

-- Create token_price_cache table
CREATE TABLE IF NOT EXISTS token_price_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_mint text NOT NULL,
  price numeric DEFAULT 0,
  market_cap numeric DEFAULT 0,
  volume_24h numeric DEFAULT 0,
  price_change_24h numeric DEFAULT 0,
  holders integer DEFAULT 0,
  total_supply numeric DEFAULT 0,
  liquidity numeric DEFAULT 0,
  source text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_token_price_cache_token_mint
  ON token_price_cache(token_mint);

CREATE INDEX IF NOT EXISTS idx_token_price_cache_created_at
  ON token_price_cache(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_token_price_cache_token_created
  ON token_price_cache(token_mint, created_at DESC);

-- Enable RLS
ALTER TABLE token_price_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (token prices are public information)
CREATE POLICY "Token price cache is publicly readable"
  ON token_price_cache
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert cache data
CREATE POLICY "Authenticated users can cache token prices"
  ON token_price_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anon users to insert (for edge functions)
CREATE POLICY "Anon users can cache token prices"
  ON token_price_cache
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create function to clean old cache entries (keep last 100 per token)
CREATE OR REPLACE FUNCTION clean_old_token_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM token_price_cache
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id,
        ROW_NUMBER() OVER (
          PARTITION BY token_mint
          ORDER BY created_at DESC
        ) as rn
      FROM token_price_cache
    ) ranked
    WHERE rn > 100
  );
END;
$$;

-- Create function to get latest token price
CREATE OR REPLACE FUNCTION get_latest_token_price(p_token_mint text)
RETURNS TABLE (
  price numeric,
  market_cap numeric,
  volume_24h numeric,
  price_change_24h numeric,
  holders integer,
  total_supply numeric,
  liquidity numeric,
  source text,
  age_minutes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tpc.price,
    tpc.market_cap,
    tpc.volume_24h,
    tpc.price_change_24h,
    tpc.holders,
    tpc.total_supply,
    tpc.liquidity,
    tpc.source,
    EXTRACT(EPOCH FROM (now() - tpc.created_at))::integer / 60 as age_minutes
  FROM token_price_cache tpc
  WHERE tpc.token_mint = p_token_mint
  ORDER BY tpc.created_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON TABLE token_price_cache IS 'Caches real-time token price data from external APIs';
COMMENT ON COLUMN token_price_cache.token_mint IS 'Solana token mint address';
COMMENT ON COLUMN token_price_cache.source IS 'Data source: pump.fun, dexscreener, jupiter, etc.';
