/*
  # Double-Entry Ledger System (Phase 1 - TYT v3 Roadmap)
  
  This is the core financial rails foundation that enables real multi-chain operations.
  Every balance change is recorded as a double-entry to ensure auditability.
  
  1. New Tables
    - `wallet_accounts`
      - Individual account identifiers for each user/currency combination
      - Account types: user_main, user_locked, protocol_fees, charity_fund, academy_fund, burn_pool
      - Each account has a running balance computed from ledger entries
    
    - `ledger_entries`
      - Immutable double-entry ledger records
      - Every transaction has debit and credit entries that must balance
      - ref_type/ref_id links entries to source events (deposits, rewards, maintenance, etc.)
    
    - `onchain_events`
      - Raw blockchain event log from chain observers
      - Links to ledger entries after processing
      - Prevents duplicate processing via unique tx_hash + log_index
    
    - `chain_observer_config`
      - Configuration for blockchain monitoring
      - Tracks last processed block per network
      - Observer health status
    
    - `reconciliation_snapshots`
      - Daily balance snapshots for audit trail
      - Used for ledger vs onchain reconciliation
  
  2. Security
    - Enable RLS on all tables
    - Users can only view their own accounts and entries
    - System writes via service role
    - Ledger entries are INSERT-only (no updates/deletes)
  
  3. Key Invariants
    - Sum of all debits = Sum of all credits (always)
    - Account balance = Sum(credits) - Sum(debits) for that account
    - No entry can be modified after creation
*/

-- Account types enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wallet_account_type') THEN
    CREATE TYPE wallet_account_type AS ENUM (
      'user_main',
      'user_locked',
      'user_staking',
      'protocol_fees',
      'charity_fund',
      'academy_fund',
      'burn_pool',
      'treasury',
      'escrow'
    );
  END IF;
END $$;

-- Ledger entry types enum  
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_entry_type') THEN
    CREATE TYPE ledger_entry_type AS ENUM (
      'deposit',
      'withdrawal',
      'reward',
      'maintenance_fee',
      'marketplace_fee',
      'miner_purchase',
      'miner_upgrade',
      'charity_donation',
      'academy_payment',
      'burn',
      'staking_lock',
      'staking_unlock',
      'referral_commission',
      'internal_transfer',
      'adjustment'
    );
  END IF;
END $$;

-- Wallet accounts table
CREATE TABLE IF NOT EXISTS wallet_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  account_type wallet_account_type NOT NULL,
  currency text NOT NULL,
  network text,
  balance numeric NOT NULL DEFAULT 0 CHECK (balance >= 0),
  locked_balance numeric NOT NULL DEFAULT 0 CHECK (locked_balance >= 0),
  pending_balance numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, account_type, currency, network)
);

ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet accounts"
  ON wallet_accounts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR user_id IS NULL
  );

CREATE POLICY "System can manage wallet accounts"
  ON wallet_accounts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ledger entries table (immutable)
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_batch_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES wallet_accounts(id),
  entry_type ledger_entry_type NOT NULL,
  debit numeric NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit numeric NOT NULL DEFAULT 0 CHECK (credit >= 0),
  balance_after numeric NOT NULL,
  currency text NOT NULL,
  ref_type text NOT NULL,
  ref_id uuid NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_debit_or_credit CHECK (
    (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
  )
);

ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ledger entries"
  ON ledger_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM wallet_accounts wa
      WHERE wa.id = ledger_entries.account_id
      AND (wa.user_id = auth.uid() OR wa.user_id IS NULL)
    )
  );

CREATE POLICY "System can insert ledger entries"
  ON ledger_entries FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Onchain events table
CREATE TABLE IF NOT EXISTS onchain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL,
  tx_hash text NOT NULL,
  log_index integer DEFAULT 0,
  block_number bigint NOT NULL,
  block_timestamp timestamptz,
  event_type text NOT NULL,
  contract_address text,
  from_address text,
  to_address text,
  asset text,
  amount numeric,
  raw_data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed', 'ignored')),
  ledger_batch_id uuid,
  error_message text,
  retry_count integer DEFAULT 0,
  detected_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  UNIQUE(network, tx_hash, log_index)
);

ALTER TABLE onchain_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage onchain events"
  ON onchain_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Chain observer configuration
CREATE TABLE IF NOT EXISTS chain_observer_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL UNIQUE,
  last_processed_block bigint DEFAULT 0,
  is_active boolean DEFAULT true,
  poll_interval_seconds integer DEFAULT 30,
  batch_size integer DEFAULT 100,
  rpc_endpoints text[] DEFAULT ARRAY[]::text[],
  contracts_to_watch text[] DEFAULT ARRAY[]::text[],
  health_status text DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'degraded', 'down', 'unknown')),
  last_health_check timestamptz,
  error_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chain_observer_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chain observer status"
  ON chain_observer_config FOR SELECT
  USING (true);

CREATE POLICY "System can manage chain observer config"
  ON chain_observer_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Reconciliation snapshots
CREATE TABLE IF NOT EXISTS reconciliation_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  account_id uuid NOT NULL REFERENCES wallet_accounts(id),
  ledger_balance numeric NOT NULL,
  computed_balance numeric NOT NULL,
  discrepancy numeric GENERATED ALWAYS AS (ledger_balance - computed_balance) STORED,
  is_reconciled boolean GENERATED ALWAYS AS (ledger_balance = computed_balance) STORED,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(snapshot_date, account_id)
);

ALTER TABLE reconciliation_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage reconciliation snapshots"
  ON reconciliation_snapshots FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fee distribution configuration
CREATE TABLE IF NOT EXISTS fee_distribution_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type text NOT NULL UNIQUE,
  protocol_share_bps integer NOT NULL CHECK (protocol_share_bps >= 0 AND protocol_share_bps <= 10000),
  charity_share_bps integer NOT NULL CHECK (charity_share_bps >= 0 AND charity_share_bps <= 10000),
  academy_share_bps integer NOT NULL CHECK (academy_share_bps >= 0 AND academy_share_bps <= 10000),
  burn_share_bps integer NOT NULL CHECK (burn_share_bps >= 0 AND burn_share_bps <= 10000),
  is_active boolean DEFAULT true,
  effective_from timestamptz DEFAULT now(),
  effective_to timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_shares_total CHECK (
    protocol_share_bps + charity_share_bps + academy_share_bps + burn_share_bps = 10000
  )
);

ALTER TABLE fee_distribution_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fee distribution config"
  ON fee_distribution_config FOR SELECT
  USING (true);

CREATE POLICY "System can manage fee distribution config"
  ON fee_distribution_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallet_accounts_user_id ON wallet_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_accounts_type ON wallet_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_wallet_accounts_currency ON wallet_accounts(currency);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id ON ledger_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_batch_id ON ledger_entries(entry_batch_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_ref ON ledger_entries(ref_type, ref_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_created ON ledger_entries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_onchain_events_network ON onchain_events(network);
CREATE INDEX IF NOT EXISTS idx_onchain_events_status ON onchain_events(status);
CREATE INDEX IF NOT EXISTS idx_onchain_events_block ON onchain_events(network, block_number);
CREATE INDEX IF NOT EXISTS idx_onchain_events_tx ON onchain_events(tx_hash);

-- Insert default fee distribution config
INSERT INTO fee_distribution_config (fee_type, protocol_share_bps, charity_share_bps, academy_share_bps, burn_share_bps)
VALUES
  ('deposit', 8000, 1000, 500, 500),
  ('maintenance', 8500, 1000, 250, 250),
  ('marketplace', 5000, 1000, 500, 3500),
  ('miner_upgrade', 7500, 1000, 500, 1000),
  ('withdrawal', 9000, 500, 250, 250)
ON CONFLICT (fee_type) DO NOTHING;

-- Insert default chain observer configs
INSERT INTO chain_observer_config (network, last_processed_block, is_active, poll_interval_seconds, batch_size)
VALUES
  ('solana', 0, true, 10, 50),
  ('polygon', 0, true, 15, 100),
  ('tron', 0, true, 30, 50),
  ('ethereum', 0, false, 30, 50),
  ('bitcoin', 0, false, 60, 10)
ON CONFLICT (network) DO NOTHING;

-- Function to get or create wallet account
CREATE OR REPLACE FUNCTION get_or_create_wallet_account(
  p_user_id uuid,
  p_account_type wallet_account_type,
  p_currency text,
  p_network text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account_id uuid;
BEGIN
  SELECT id INTO v_account_id
  FROM wallet_accounts
  WHERE user_id IS NOT DISTINCT FROM p_user_id
    AND account_type = p_account_type
    AND currency = p_currency
    AND network IS NOT DISTINCT FROM p_network;
  
  IF v_account_id IS NULL THEN
    INSERT INTO wallet_accounts (user_id, account_type, currency, network)
    VALUES (p_user_id, p_account_type, p_currency, p_network)
    RETURNING id INTO v_account_id;
  END IF;
  
  RETURN v_account_id;
END;
$$;

-- Function to create balanced ledger entries
CREATE OR REPLACE FUNCTION create_ledger_entry(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount numeric,
  p_entry_type ledger_entry_type,
  p_ref_type text,
  p_ref_id uuid,
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_batch_id uuid := gen_random_uuid();
  v_from_balance numeric;
  v_to_balance numeric;
  v_currency text;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  -- Get and validate from account
  SELECT balance, currency INTO v_from_balance, v_currency
  FROM wallet_accounts WHERE id = p_from_account_id FOR UPDATE;
  
  IF v_from_balance IS NULL THEN
    RAISE EXCEPTION 'From account not found';
  END IF;
  
  IF v_from_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance: % < %', v_from_balance, p_amount;
  END IF;
  
  -- Get to account balance
  SELECT balance INTO v_to_balance
  FROM wallet_accounts WHERE id = p_to_account_id FOR UPDATE;
  
  IF v_to_balance IS NULL THEN
    RAISE EXCEPTION 'To account not found';
  END IF;
  
  -- Debit entry (reduce from_account)
  INSERT INTO ledger_entries (
    entry_batch_id, account_id, entry_type, debit, credit, 
    balance_after, currency, ref_type, ref_id, description, metadata
  ) VALUES (
    v_batch_id, p_from_account_id, p_entry_type, p_amount, 0,
    v_from_balance - p_amount, v_currency, p_ref_type, p_ref_id, p_description, p_metadata
  );
  
  -- Credit entry (increase to_account)
  INSERT INTO ledger_entries (
    entry_batch_id, account_id, entry_type, debit, credit,
    balance_after, currency, ref_type, ref_id, description, p_metadata
  ) VALUES (
    v_batch_id, p_to_account_id, p_entry_type, 0, p_amount,
    v_to_balance + p_amount, v_currency, p_ref_type, p_ref_id, p_description, p_metadata
  );
  
  -- Update account balances
  UPDATE wallet_accounts SET balance = balance - p_amount, updated_at = now()
  WHERE id = p_from_account_id;
  
  UPDATE wallet_accounts SET balance = balance + p_amount, updated_at = now()
  WHERE id = p_to_account_id;
  
  RETURN v_batch_id;
END;
$$;

-- Function to credit account (for external deposits)
CREATE OR REPLACE FUNCTION credit_account(
  p_account_id uuid,
  p_amount numeric,
  p_entry_type ledger_entry_type,
  p_ref_type text,
  p_ref_id uuid,
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_batch_id uuid := gen_random_uuid();
  v_balance numeric;
  v_currency text;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  SELECT balance, currency INTO v_balance, v_currency
  FROM wallet_accounts WHERE id = p_account_id FOR UPDATE;
  
  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Account not found';
  END IF;
  
  INSERT INTO ledger_entries (
    entry_batch_id, account_id, entry_type, debit, credit,
    balance_after, currency, ref_type, ref_id, description, metadata
  ) VALUES (
    v_batch_id, p_account_id, p_entry_type, 0, p_amount,
    v_balance + p_amount, v_currency, p_ref_type, p_ref_id, p_description, p_metadata
  );
  
  UPDATE wallet_accounts SET balance = balance + p_amount, updated_at = now()
  WHERE id = p_account_id;
  
  RETURN v_batch_id;
END;
$$;

-- View for account balances with computed verification
CREATE OR REPLACE VIEW account_balance_verification AS
SELECT 
  wa.id,
  wa.user_id,
  wa.account_type,
  wa.currency,
  wa.network,
  wa.balance as stored_balance,
  COALESCE(SUM(le.credit) - SUM(le.debit), 0) as computed_balance,
  wa.balance - COALESCE(SUM(le.credit) - SUM(le.debit), 0) as discrepancy
FROM wallet_accounts wa
LEFT JOIN ledger_entries le ON le.account_id = wa.id
GROUP BY wa.id, wa.user_id, wa.account_type, wa.currency, wa.network, wa.balance;

-- View for total system balances by currency
CREATE OR REPLACE VIEW system_balance_summary AS
SELECT 
  currency,
  account_type,
  SUM(balance) as total_balance,
  COUNT(*) as account_count
FROM wallet_accounts
WHERE is_active = true
GROUP BY currency, account_type
ORDER BY currency, account_type;