/*
  # Blockchain Deposit Address System
  
  1. New Tables
    - `user_deposit_addresses`
      - Stores unique blockchain addresses for each user per network
      - Links to user profiles
      - Tracks address generation and verification status
    
    - `blockchain_deposits`
      - Records all incoming blockchain transactions
      - Links to user addresses and wallet transactions
      - Tracks transaction hashes and confirmations
    
    - `blockchain_networks`
      - Configuration for supported blockchain networks
      - API endpoints, confirmation requirements
      - Network-specific parameters
  
  2. Security
    - Enable RLS on all tables
    - Users can only view their own deposit addresses
    - Blockchain deposits are read-only for users
    - System can write via service role
  
  3. Features
    - Automatic unique address generation per user per network
    - Transaction monitoring and confirmation tracking
    - Duplicate transaction prevention
    - Multi-network support (TRON, ETH, BTC, SOL)
*/

-- Blockchain networks configuration
CREATE TABLE IF NOT EXISTS blockchain_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_code text UNIQUE NOT NULL,
  network_name text NOT NULL,
  chain_id text,
  rpc_endpoint text,
  explorer_url text NOT NULL,
  min_confirmations integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  supports_tokens boolean DEFAULT false,
  native_symbol text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blockchain_networks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active networks"
  ON blockchain_networks FOR SELECT
  USING (is_active = true);

-- User deposit addresses
CREATE TABLE IF NOT EXISTS user_deposit_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  network_code text NOT NULL REFERENCES blockchain_networks(network_code),
  address text NOT NULL,
  private_key_encrypted text,
  derivation_path text,
  is_verified boolean DEFAULT false,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, network_code),
  UNIQUE(network_code, address)
);

ALTER TABLE user_deposit_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposit addresses"
  ON user_deposit_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage deposit addresses"
  ON user_deposit_addresses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Blockchain deposits tracking
CREATE TABLE IF NOT EXISTS blockchain_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deposit_address_id uuid NOT NULL REFERENCES user_deposit_addresses(id),
  network_code text NOT NULL REFERENCES blockchain_networks(network_code),
  tx_hash text NOT NULL,
  from_address text NOT NULL,
  to_address text NOT NULL,
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  amount_usd numeric,
  confirmations integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'credited', 'failed')),
  block_number bigint,
  block_timestamp timestamptz,
  wallet_transaction_id uuid REFERENCES wallet_transactions(id),
  fee_charged numeric DEFAULT 0,
  amount_credited numeric,
  error_message text,
  detected_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  credited_at timestamptz,
  UNIQUE(network_code, tx_hash)
);

ALTER TABLE blockchain_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposits"
  ON blockchain_deposits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage deposits"
  ON blockchain_deposits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_deposit_addresses_user_id ON user_deposit_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_deposit_addresses_network ON user_deposit_addresses(network_code);
CREATE INDEX IF NOT EXISTS idx_user_deposit_addresses_address ON user_deposit_addresses(address);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_user_id ON blockchain_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_status ON blockchain_deposits(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_tx_hash ON blockchain_deposits(tx_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_address ON blockchain_deposits(deposit_address_id);

-- Insert supported networks
INSERT INTO blockchain_networks (network_code, network_name, chain_id, explorer_url, min_confirmations, supports_tokens, native_symbol, rpc_endpoint) VALUES
  ('TRON', 'TRON Mainnet', NULL, 'https://tronscan.org', 19, true, 'TRX', 'https://api.trongrid.io'),
  ('ETH', 'Ethereum Mainnet', '1', 'https://etherscan.io', 12, true, 'ETH', 'https://eth-mainnet.g.alchemy.com/v2'),
  ('BSC', 'BNB Smart Chain', '56', 'https://bscscan.com', 15, true, 'BNB', 'https://bsc-dataseed.binance.org'),
  ('POLYGON', 'Polygon Mainnet', '137', 'https://polygonscan.com', 128, true, 'MATIC', 'https://polygon-rpc.com'),
  ('SOL', 'Solana Mainnet', NULL, 'https://explorer.solana.com', 31, true, 'SOL', 'https://api.mainnet-beta.solana.com')
ON CONFLICT (network_code) DO NOTHING;

-- Function to get or create deposit address
CREATE OR REPLACE FUNCTION get_user_deposit_address(
  p_user_id uuid,
  p_network_code text
) RETURNS TABLE (
  address text,
  network_name text,
  explorer_url text,
  is_new boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_address text;
  v_network_name text;
  v_explorer_url text;
  v_exists boolean;
BEGIN
  -- Check if address already exists
  SELECT 
    uda.address,
    bn.network_name,
    bn.explorer_url,
    true
  INTO v_address, v_network_name, v_explorer_url, v_exists
  FROM user_deposit_addresses uda
  JOIN blockchain_networks bn ON bn.network_code = uda.network_code
  WHERE uda.user_id = p_user_id 
    AND uda.network_code = p_network_code;
  
  IF v_address IS NOT NULL THEN
    RETURN QUERY SELECT v_address, v_network_name, v_explorer_url, false;
  ELSE
    -- Return network info for new address generation
    SELECT network_name, explorer_url
    INTO v_network_name, v_explorer_url
    FROM blockchain_networks
    WHERE network_code = p_network_code AND is_active = true;
    
    RETURN QUERY SELECT NULL::text, v_network_name, v_explorer_url, true;
  END IF;
END;
$$;