/*
  # Create Supported Tokens Table
  
  1. New Tables
    - `supported_tokens` - Tokens supported on each network
      - `id` (uuid, primary key)
      - `network_code` (text) - Network code (ETH, BSC, etc.)
      - `token_symbol` (text) - Token symbol (USDT, USDC, etc.)
      - `token_name` (text) - Full token name
      - `contract_address` (text, nullable) - Smart contract address
      - `decimals` (integer) - Token decimals
      - `min_deposit_amount` (decimal) - Minimum deposit amount
      - `min_withdrawal_amount` (decimal) - Minimum withdrawal amount
      - `is_active` (boolean) - Whether token is active
      - `is_featured` (boolean) - Whether token is featured
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `supported_tokens` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS supported_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_code text NOT NULL,
  token_symbol text NOT NULL,
  token_name text NOT NULL,
  contract_address text,
  decimals integer NOT NULL DEFAULT 18,
  min_deposit_amount decimal(20,8) DEFAULT 0,
  min_withdrawal_amount decimal(20,8) DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(network_code, token_symbol)
);

ALTER TABLE supported_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Supported tokens are publicly readable"
  ON supported_tokens
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert common tokens for each network
INSERT INTO supported_tokens (
  network_code,
  token_symbol,
  token_name,
  contract_address,
  decimals,
  min_deposit_amount,
  min_withdrawal_amount,
  is_active,
  is_featured,
  display_order
) VALUES
  -- Ethereum tokens
  ('ETH', 'USDT', 'Tether USD', '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 10, 10, true, true, 1),
  ('ETH', 'USDC', 'USD Coin', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 10, 10, true, true, 2),
  ('ETH', 'DAI', 'Dai Stablecoin', '0x6b175474e89094c44da98b954eedeac495271d0f', 18, 10, 10, true, false, 3),
  ('ETH', 'wBTC', 'Wrapped Bitcoin', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 0.0001, 0.0001, true, true, 4),
  
  -- BSC tokens
  ('BSC', 'USDT', 'Tether USD', '0x55d398326f99059ff775485246999027b3197955', 18, 10, 10, true, true, 1),
  ('BSC', 'USDC', 'USD Coin', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', 18, 10, 10, true, true, 2),
  ('BSC', 'BTCB', 'Bitcoin BEP20', '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', 18, 0.0001, 0.0001, true, true, 3),
  
  -- Polygon tokens
  ('POLYGON', 'USDT', 'Tether USD', '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 10, 10, true, true, 1),
  ('POLYGON', 'USDC', 'USD Coin', '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 10, 10, true, true, 2),
  ('POLYGON', 'DAI', 'Dai Stablecoin', '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', 18, 10, 10, true, false, 3),
  ('POLYGON', 'wBTC', 'Wrapped Bitcoin', '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', 8, 0.0001, 0.0001, true, true, 4),
  
  -- TRON tokens
  ('TRON', 'USDT', 'Tether USD', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 6, 10, 10, true, true, 1),
  ('TRON', 'USDC', 'USD Coin', 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', 6, 10, 10, true, true, 2),
  
  -- Solana tokens (no contracts needed)
  ('SOL', 'USDT', 'Tether USD', null, 6, 10, 10, true, true, 1),
  ('SOL', 'USDC', 'USD Coin', null, 6, 10, 10, true, true, 2)
ON CONFLICT (network_code, token_symbol) DO UPDATE SET
  token_name = EXCLUDED.token_name,
  contract_address = EXCLUDED.contract_address,
  decimals = EXCLUDED.decimals,
  min_deposit_amount = EXCLUDED.min_deposit_amount,
  min_withdrawal_amount = EXCLUDED.min_withdrawal_amount,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  updated_at = now();
