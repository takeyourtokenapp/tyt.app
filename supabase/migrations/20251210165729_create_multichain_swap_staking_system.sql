/*
  # Multi-Chain Swap and Staking System

  ## Overview
  This migration creates comprehensive infrastructure for:
  - Token swaps across multiple blockchains (Solana, Ethereum, BSC, Polygon, TRON)
  - Staking pools with flexible APY and lock periods
  - Cross-chain bridge transactions
  - Fiat on/off ramp integration

  ## New Tables

  ### 1. `token_swaps`
  Records of all token swap transactions across supported networks
  - Tracks input/output tokens and amounts
  - Links to blockchain and wallet
  - Stores transaction hash and swap provider
  - Status tracking (pending, completed, failed)

  ### 2. `staking_pools`
  Available staking pools for TYT and other tokens
  - Multi-chain support
  - Configurable APY and lock periods
  - Capacity management
  - Active/inactive status

  ### 3. `user_stakes`
  Individual user staking positions
  - Links to staking pools
  - Tracks staked amount and rewards
  - Unlock date management
  - Withdrawal tracking

  ### 4. `staking_rewards`
  Historical record of claimed staking rewards
  - Links to stakes
  - Tracks reward amounts and claim dates
  - Full audit trail

  ### 5. `cross_chain_transfers`
  Bridge transactions between different blockchains
  - Source and destination chain tracking
  - Amount and fee calculation
  - Status monitoring (initiated, confirmed, completed, failed)
  - Bridge provider tracking

  ### 6. `fiat_transactions`
  Buy/sell crypto with fiat currency
  - Payment method tracking
  - Fiat and crypto amounts
  - Status and transaction IDs
  - Payment provider integration

  ## Security
  - All tables have RLS enabled
  - Users can only access their own data
  - Authenticated users only
  - Proper foreign key constraints

  ## Indexes
  - Optimized for common queries
  - Fast lookups by user_id and blockchain
  - Transaction hash indexing for quick verification
*/

-- Token Swaps Table
CREATE TABLE IF NOT EXISTS token_swaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  from_token text NOT NULL,
  to_token text NOT NULL,
  from_amount numeric NOT NULL CHECK (from_amount > 0),
  to_amount numeric NOT NULL CHECK (to_amount > 0),
  wallet_address text NOT NULL,
  tx_hash text UNIQUE,
  swap_provider text NOT NULL DEFAULT 'jupiter',
  price_impact numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_token_swaps_user_id ON token_swaps(user_id);
CREATE INDEX IF NOT EXISTS idx_token_swaps_blockchain ON token_swaps(blockchain);
CREATE INDEX IF NOT EXISTS idx_token_swaps_tx_hash ON token_swaps(tx_hash);
CREATE INDEX IF NOT EXISTS idx_token_swaps_status ON token_swaps(status);

ALTER TABLE token_swaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swaps"
  ON token_swaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own swaps"
  ON token_swaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Staking Pools Table
CREATE TABLE IF NOT EXISTS staking_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  token_symbol text NOT NULL,
  token_address text NOT NULL,
  apy numeric NOT NULL CHECK (apy >= 0),
  min_stake numeric NOT NULL CHECK (min_stake > 0),
  lock_period_days integer NOT NULL CHECK (lock_period_days >= 0),
  total_staked numeric DEFAULT 0 CHECK (total_staked >= 0),
  max_capacity numeric NOT NULL CHECK (max_capacity > 0),
  is_active boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staking_pools_blockchain ON staking_pools(blockchain);
CREATE INDEX IF NOT EXISTS idx_staking_pools_is_active ON staking_pools(is_active);

ALTER TABLE staking_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active staking pools"
  ON staking_pools FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User Stakes Table
CREATE TABLE IF NOT EXISTS user_stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pool_id uuid REFERENCES staking_pools(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  wallet_address text NOT NULL,
  start_date timestamptz DEFAULT now(),
  unlock_date timestamptz NOT NULL,
  rewards_earned numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  tx_hash text,
  withdrawn_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id ON user_stakes(pool_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_status ON user_stakes(status);

ALTER TABLE user_stakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stakes"
  ON user_stakes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes"
  ON user_stakes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stakes"
  ON user_stakes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Staking Rewards Table
CREATE TABLE IF NOT EXISTS staking_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stake_id uuid REFERENCES user_stakes(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  claimed_at timestamptz DEFAULT now(),
  tx_hash text
);

CREATE INDEX IF NOT EXISTS idx_staking_rewards_user_id ON staking_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id ON staking_rewards(stake_id);

ALTER TABLE staking_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON staking_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON staking_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cross-Chain Transfers Table
CREATE TABLE IF NOT EXISTS cross_chain_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_blockchain text NOT NULL CHECK (from_blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  to_blockchain text NOT NULL CHECK (to_blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  token_symbol text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  bridge_fee numeric DEFAULT 0,
  from_address text NOT NULL,
  to_address text NOT NULL,
  source_tx_hash text,
  destination_tx_hash text,
  bridge_provider text NOT NULL DEFAULT 'wormhole',
  status text DEFAULT 'initiated' CHECK (status IN ('initiated', 'confirmed', 'bridging', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_cross_chain_transfers_user_id ON cross_chain_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_cross_chain_transfers_status ON cross_chain_transfers(status);
CREATE INDEX IF NOT EXISTS idx_cross_chain_transfers_source_tx ON cross_chain_transfers(source_tx_hash);

ALTER TABLE cross_chain_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transfers"
  ON cross_chain_transfers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transfers"
  ON cross_chain_transfers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fiat Transactions Table
CREATE TABLE IF NOT EXISTS fiat_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
  fiat_currency text NOT NULL DEFAULT 'USD',
  fiat_amount numeric NOT NULL CHECK (fiat_amount > 0),
  crypto_currency text NOT NULL,
  crypto_amount numeric NOT NULL CHECK (crypto_amount > 0),
  blockchain text NOT NULL CHECK (blockchain IN ('solana', 'ethereum', 'bsc', 'polygon', 'tron')),
  wallet_address text NOT NULL,
  payment_method text NOT NULL,
  payment_provider text NOT NULL,
  provider_transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_fiat_transactions_user_id ON fiat_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_fiat_transactions_status ON fiat_transactions(status);
CREATE INDEX IF NOT EXISTS idx_fiat_transactions_provider_id ON fiat_transactions(provider_transaction_id);

ALTER TABLE fiat_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fiat transactions"
  ON fiat_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fiat transactions"
  ON fiat_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert Default Staking Pools
INSERT INTO staking_pools (name, blockchain, token_symbol, token_address, apy, min_stake, lock_period_days, max_capacity, description)
VALUES
  ('TYT Flex Staking', 'solana', 'TYT', 'TYT_TOKEN_MINT', 12.5, 100, 0, 10000000, 'Flexible staking with no lock period'),
  ('TYT 30-Day Lock', 'solana', 'TYT', 'TYT_TOKEN_MINT', 25.0, 500, 30, 5000000, '30-day lock period with higher APY'),
  ('TYT 90-Day Lock', 'solana', 'TYT', 'TYT_TOKEN_MINT', 45.0, 1000, 90, 3000000, '90-day lock period with premium APY'),
  ('TYT 180-Day Lock', 'solana', 'TYT', 'TYT_TOKEN_MINT', 75.0, 5000, 180, 2000000, '180-day lock period with maximum APY'),
  ('SOL Staking', 'solana', 'SOL', 'So11111111111111111111111111111111111111112', 7.5, 1, 0, 1000000, 'Stake SOL tokens for rewards'),
  ('ETH Staking', 'ethereum', 'ETH', '0x0000000000000000000000000000000000000000', 5.5, 0.1, 0, 100000, 'Stake ETH tokens for rewards'),
  ('BNB Staking', 'bsc', 'BNB', '0x0000000000000000000000000000000000000000', 8.0, 0.5, 0, 50000, 'Stake BNB tokens for rewards'),
  ('MATIC Staking', 'polygon', 'MATIC', '0x0000000000000000000000000000000000001010', 10.0, 10, 0, 1000000, 'Stake MATIC tokens for rewards')
ON CONFLICT DO NOTHING;
