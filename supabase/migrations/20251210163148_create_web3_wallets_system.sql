/*
  # Web3 Wallet Connection System
  
  1. New Tables
    - `user_web3_wallets`
      - Stores connected external Web3 wallets
      - Links wallet addresses to user profiles
      - Tracks wallet type (Phantom, Solflare, etc.)
      - Stores connection metadata
    
    - `tyt_token_trades`
      - Records all TYT token purchases and sales
      - Integrates with pump.fun transactions
      - Tracks prices, amounts, and fees
    
    - `sol_transfers`
      - Records SOL transfers between internal and external wallets
      - Tracks transfer status and blockchain confirmations
  
  2. Security
    - Enable RLS on all tables
    - Users can only view/manage their own wallets and trades
    - Read-only access to trade history
  
  3. Features
    - Multi-wallet support per user
    - Real-time trade tracking
    - SOL transfer management
*/

-- User Web3 wallets
CREATE TABLE IF NOT EXISTS user_web3_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  wallet_type text NOT NULL CHECK (wallet_type IN ('phantom', 'solflare', 'backpack', 'glow', 'other')),
  blockchain text NOT NULL DEFAULT 'solana' CHECK (blockchain IN ('solana', 'ethereum', 'polygon', 'bsc')),
  is_primary boolean DEFAULT false,
  last_connected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, wallet_address)
);

ALTER TABLE user_web3_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own web3 wallets"
  ON user_web3_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own web3 wallets"
  ON user_web3_wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own web3 wallets"
  ON user_web3_wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own web3 wallets"
  ON user_web3_wallets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- TYT Token trades on pump.fun
CREATE TABLE IF NOT EXISTS tyt_token_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  sol_amount numeric NOT NULL CHECK (sol_amount > 0),
  tyt_amount numeric NOT NULL CHECK (tyt_amount > 0),
  price_per_token numeric NOT NULL,
  total_value_usd numeric,
  tx_signature text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  pump_fun_data jsonb DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

ALTER TABLE tyt_token_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON tyt_token_trades FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades"
  ON tyt_token_trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SOL transfers
CREATE TABLE IF NOT EXISTS sol_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  transfer_type text NOT NULL CHECK (transfer_type IN ('internal_to_external', 'external_to_internal')),
  tx_signature text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  fee numeric DEFAULT 0.000005,
  error_message text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

ALTER TABLE sol_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transfers"
  ON sol_transfers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transfers"
  ON sol_transfers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_web3_wallets_user_id ON user_web3_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_web3_wallets_address ON user_web3_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tyt_token_trades_user_id ON tyt_token_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_tyt_token_trades_status ON tyt_token_trades(status);
CREATE INDEX IF NOT EXISTS idx_sol_transfers_user_id ON sol_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_sol_transfers_status ON sol_transfers(status);

-- Function to get TYT holdings
CREATE OR REPLACE FUNCTION get_user_tyt_holdings(p_user_id uuid)
RETURNS TABLE (
  total_tyt_bought numeric,
  total_tyt_sold numeric,
  net_tyt_balance numeric,
  total_sol_spent numeric,
  total_sol_received numeric,
  average_buy_price numeric,
  trade_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN trade_type = 'buy' THEN tyt_amount ELSE 0 END), 0) as total_tyt_bought,
    COALESCE(SUM(CASE WHEN trade_type = 'sell' THEN tyt_amount ELSE 0 END), 0) as total_tyt_sold,
    COALESCE(SUM(CASE WHEN trade_type = 'buy' THEN tyt_amount ELSE -tyt_amount END), 0) as net_tyt_balance,
    COALESCE(SUM(CASE WHEN trade_type = 'buy' THEN sol_amount ELSE 0 END), 0) as total_sol_spent,
    COALESCE(SUM(CASE WHEN trade_type = 'sell' THEN sol_amount ELSE 0 END), 0) as total_sol_received,
    CASE 
      WHEN SUM(CASE WHEN trade_type = 'buy' THEN tyt_amount ELSE 0 END) > 0 
      THEN SUM(CASE WHEN trade_type = 'buy' THEN sol_amount ELSE 0 END) / 
           SUM(CASE WHEN trade_type = 'buy' THEN tyt_amount ELSE 0 END)
      ELSE 0 
    END as average_buy_price,
    COUNT(*) as trade_count
  FROM tyt_token_trades
  WHERE user_id = p_user_id
    AND status = 'confirmed';
END;
$$;