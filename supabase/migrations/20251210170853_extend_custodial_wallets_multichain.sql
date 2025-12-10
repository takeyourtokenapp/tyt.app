/*
  # Extend Custodial Wallets for Multi-Chain Support

  ## Overview
  Extends custodial wallet system for real blockchain interactions across 5 networks.

  ## New Tables
  1. custodial_addresses - User addresses per blockchain
  2. custodial_withdrawals - Withdrawal tracking with 1% fee
  3. custodial_internal_swaps - Internal swap history
  4. custodial_balance_snapshots - Balance history

  ## Security
  All tables have RLS enabled for user isolation.

  ## Fee Distribution (1%)
  60% operations, 30% foundation, 10% academy
*/

-- Add blockchain field to custodial_wallets if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custodial_wallets' AND column_name = 'blockchain'
  ) THEN
    ALTER TABLE custodial_wallets ADD COLUMN blockchain text DEFAULT 'internal';
    
    CREATE INDEX IF NOT EXISTS idx_custodial_wallets_blockchain 
      ON custodial_wallets(blockchain);
  END IF;
END $$;

-- Custodial Addresses Table
CREATE TABLE IF NOT EXISTS custodial_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  address text NOT NULL,
  derivation_path text,
  is_active boolean DEFAULT true,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blockchain)
);

CREATE INDEX IF NOT EXISTS idx_custodial_addresses_user_id ON custodial_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_custodial_addresses_blockchain ON custodial_addresses(blockchain);
CREATE INDEX IF NOT EXISTS idx_custodial_addresses_address ON custodial_addresses(address);

ALTER TABLE custodial_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custodial addresses"
  ON custodial_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custodial addresses"
  ON custodial_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Custodial Withdrawals Table
CREATE TABLE IF NOT EXISTS custodial_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id uuid REFERENCES custodial_wallets(id) ON DELETE CASCADE NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  destination_address text NOT NULL,
  
  fee_total numeric NOT NULL DEFAULT 0,
  fee_protocol numeric NOT NULL DEFAULT 0,
  fee_foundation numeric NOT NULL DEFAULT 0,
  fee_academy numeric NOT NULL DEFAULT 0,
  amount_after_fee numeric NOT NULL,
  
  tx_hash text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  failure_reason text,
  
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_user_id ON custodial_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_wallet_id ON custodial_withdrawals(wallet_id);
CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_status ON custodial_withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_blockchain ON custodial_withdrawals(blockchain);

ALTER TABLE custodial_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals"
  ON custodial_withdrawals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals"
  ON custodial_withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Custodial Internal Swaps Table
CREATE TABLE IF NOT EXISTS custodial_internal_swaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_wallet_id uuid REFERENCES custodial_wallets(id) NOT NULL,
  to_wallet_id uuid REFERENCES custodial_wallets(id) NOT NULL,
  
  from_asset text NOT NULL,
  to_asset text NOT NULL,
  from_amount numeric NOT NULL CHECK (from_amount > 0),
  to_amount numeric NOT NULL CHECK (to_amount > 0),
  
  exchange_rate numeric NOT NULL,
  swap_fee numeric DEFAULT 0,
  
  rate_provider text DEFAULT 'internal',
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_user_id ON custodial_internal_swaps(user_id);
CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_from_wallet ON custodial_internal_swaps(from_wallet_id);
CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_to_wallet ON custodial_internal_swaps(to_wallet_id);

ALTER TABLE custodial_internal_swaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own internal swaps"
  ON custodial_internal_swaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own internal swaps"
  ON custodial_internal_swaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Custodial Balance Snapshots Table
CREATE TABLE IF NOT EXISTS custodial_balance_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id uuid REFERENCES custodial_wallets(id) ON DELETE CASCADE NOT NULL,
  
  balance numeric NOT NULL,
  locked_balance numeric DEFAULT 0,
  
  blockchain text,
  on_chain_balance numeric,
  last_sync_at timestamptz,
  
  snapshot_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(wallet_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_custodial_balance_snapshots_user_id ON custodial_balance_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_custodial_balance_snapshots_wallet_id ON custodial_balance_snapshots(wallet_id);
CREATE INDEX IF NOT EXISTS idx_custodial_balance_snapshots_date ON custodial_balance_snapshots(snapshot_date);

ALTER TABLE custodial_balance_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own balance snapshots"
  ON custodial_balance_snapshots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to calculate withdrawal fees (1% total)
CREATE OR REPLACE FUNCTION calculate_withdrawal_fees(
  p_amount numeric
) RETURNS TABLE (
  total_fee numeric,
  protocol_fee numeric,
  foundation_fee numeric,
  academy_fee numeric,
  amount_after_fee numeric
) AS $$
BEGIN
  total_fee := p_amount * 0.01;
  protocol_fee := total_fee * 0.60;
  foundation_fee := total_fee * 0.30;
  academy_fee := total_fee * 0.10;
  amount_after_fee := p_amount - total_fee;
  
  RETURN QUERY SELECT 
    total_fee, 
    protocol_fee, 
    foundation_fee, 
    academy_fee, 
    amount_after_fee;
END;
$$ LANGUAGE plpgsql;
