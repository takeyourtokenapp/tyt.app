/*
  # Bitcoin Ecosystem - Complete Integration v2

  1. New Tables
    - `bitcoin_addresses` - Bitcoin address management (Legacy, SegWit, Taproot)
    - `bitcoin_utxos` - UTXO tracking and coin selection
    - `bitcoin_transactions` - Transaction history with PSBT support
    - `lightning_nodes` - Lightning Network node management
    - `lightning_invoices` - Invoice generation and tracking
    - `liquid_assets` - Liquid Network integration
    - `bitcoin_fee_estimates` - Real-time fee tracking

  2. Security
    - RLS enabled on all tables
    - User access control policies
    - Admin-only operations

  3. Performance
    - Optimized indexes
    - UTXO management
    - Transaction pagination
*/

-- =====================================================
-- BITCOIN ADDRESSES
-- =====================================================

CREATE TABLE IF NOT EXISTS bitcoin_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  address text NOT NULL UNIQUE,
  address_type text NOT NULL CHECK (address_type IN ('legacy', 'segwit', 'native_segwit', 'taproot')),
  script_pubkey text,

  derivation_path text,
  extended_pubkey text,

  is_multisig boolean DEFAULT false,
  multisig_m integer,
  multisig_n integer,
  multisig_pubkeys jsonb,

  balance_confirmed bigint DEFAULT 0,
  balance_unconfirmed bigint DEFAULT 0,
  balance_total bigint DEFAULT 0,

  utxo_count integer DEFAULT 0,

  is_used boolean DEFAULT false,
  first_used_at timestamptz,
  last_used_at timestamptz,
  tx_count integer DEFAULT 0,

  label text,
  privacy_level integer DEFAULT 1 CHECK (privacy_level BETWEEN 1 AND 5),
  is_change_address boolean DEFAULT false,

  is_active boolean DEFAULT true,
  is_watched boolean DEFAULT true,

  network text DEFAULT 'mainnet' CHECK (network IN ('mainnet', 'testnet', 'signet', 'regtest')),
  purpose text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_synced_at timestamptz,

  UNIQUE(user_id, address)
);

-- =====================================================
-- BITCOIN UTXOS
-- =====================================================

CREATE TABLE IF NOT EXISTS bitcoin_utxos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address_id uuid REFERENCES bitcoin_addresses(id) ON DELETE CASCADE NOT NULL,

  txid text NOT NULL,
  vout integer NOT NULL,

  value_satoshis bigint NOT NULL,

  script_pubkey text NOT NULL,
  script_type text,

  is_confirmed boolean DEFAULT false,
  confirmations integer DEFAULT 0,
  block_height integer,
  block_hash text,
  block_time timestamptz,

  is_spent boolean DEFAULT false,
  spent_in_txid text,
  spent_at timestamptz,

  is_coinbase boolean DEFAULT false,
  is_rbf boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  locked_until timestamptz,

  privacy_score integer DEFAULT 50 CHECK (privacy_score BETWEEN 0 AND 100),
  label text,
  is_dust boolean DEFAULT false,

  estimated_fee_to_spend bigint,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(txid, vout)
);

-- =====================================================
-- BITCOIN TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS bitcoin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  txid text NOT NULL UNIQUE,

  tx_type text NOT NULL CHECK (tx_type IN ('deposit', 'withdrawal', 'internal', 'consolidation', 'lightning_funding', 'lightning_closing')),
  direction text NOT NULL CHECK (direction IN ('incoming', 'outgoing', 'self')),

  amount_satoshis bigint NOT NULL,
  fee_satoshis bigint DEFAULT 0,
  total_satoshis bigint,

  from_addresses jsonb,
  to_addresses jsonb,
  user_address text,

  is_confirmed boolean DEFAULT false,
  confirmations integer DEFAULT 0,
  required_confirmations integer DEFAULT 3,
  block_height integer,
  block_hash text,
  block_time timestamptz,

  size_bytes integer,
  virtual_size integer,
  weight integer,
  version integer,
  locktime integer,

  fee_rate decimal(10, 2),
  fee_priority text CHECK (fee_priority IN ('economy', 'normal', 'high', 'custom')),

  is_rbf boolean DEFAULT false,
  replaced_by_txid text,
  replaces_txid text,
  rbf_attempts integer DEFAULT 0,

  is_psbt boolean DEFAULT false,
  psbt_base64 text,
  psbt_status text CHECK (psbt_status IN ('unsigned', 'partially_signed', 'fully_signed', 'finalized', 'broadcast')),

  raw_hex text,

  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed', 'replaced', 'cancelled')),

  created_at timestamptz DEFAULT now(),
  broadcast_at timestamptz,
  confirmed_at timestamptz,
  updated_at timestamptz DEFAULT now(),

  description text,
  internal_note text,
  external_reference text
);

-- =====================================================
-- LIGHTNING NODES
-- =====================================================

CREATE TABLE IF NOT EXISTS lightning_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  pubkey text NOT NULL,
  alias text,

  node_type text DEFAULT 'custodial' CHECK (node_type IN ('custodial', 'lnd', 'cln', 'eclair', 'ldk')),

  connection_string text,
  api_endpoint text,
  macaroon text,

  is_active boolean DEFAULT true,
  is_online boolean DEFAULT false,
  last_online_at timestamptz,

  total_capacity_sats bigint DEFAULT 0,
  local_balance_sats bigint DEFAULT 0,
  remote_balance_sats bigint DEFAULT 0,

  active_channels integer DEFAULT 0,
  pending_channels integer DEFAULT 0,
  closed_channels integer DEFAULT 0,

  uptime_percentage decimal(5, 2),
  avg_channel_size_sats bigint,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, pubkey)
);

-- =====================================================
-- LIGHTNING INVOICES
-- =====================================================

CREATE TABLE IF NOT EXISTS lightning_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  node_id uuid REFERENCES lightning_nodes(id) ON DELETE SET NULL,

  payment_hash text NOT NULL UNIQUE,
  payment_request text NOT NULL,

  invoice_type text NOT NULL CHECK (invoice_type IN ('deposit', 'withdrawal', 'payment', 'refund')),

  amount_sats bigint,
  amount_received_sats bigint DEFAULT 0,

  description text,
  description_hash text,

  is_lnurl boolean DEFAULT false,
  lnurl_metadata jsonb,
  lnurl_callback text,

  expires_at timestamptz NOT NULL,

  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'cancelled', 'failed')),

  paid_at timestamptz,
  preimage text,

  fee_sats bigint DEFAULT 0,
  routing_fee_sats bigint DEFAULT 0,

  route_hints jsonb,

  memo text,
  external_reference text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- LIQUID NETWORK ASSETS
-- =====================================================

CREATE TABLE IF NOT EXISTS liquid_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  asset_id text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('lbtc', 'usdt', 'custom')),

  liquid_address text NOT NULL,
  blinding_key text,

  balance bigint DEFAULT 0,
  unconfirmed_balance bigint DEFAULT 0,

  asset_name text,
  ticker text,
  precision integer DEFAULT 8,

  is_confidential boolean DEFAULT true,
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_synced_at timestamptz,

  UNIQUE(user_id, asset_id, liquid_address)
);

-- =====================================================
-- BITCOIN FEE ESTIMATES
-- =====================================================

CREATE TABLE IF NOT EXISTS bitcoin_fee_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  fastest_fee integer NOT NULL,
  half_hour_fee integer NOT NULL,
  hour_fee integer NOT NULL,
  economy_fee integer NOT NULL,
  minimum_fee integer NOT NULL,

  mempool_size_mb decimal(10, 2),
  mempool_tx_count integer,
  next_block_fee_min integer,
  next_block_fee_max integer,

  data_source text DEFAULT 'blockstream' CHECK (data_source IN ('blockstream', 'mempool.space', 'bitcoin-core', 'custom')),

  valid_until timestamptz DEFAULT (now() + interval '5 minutes'),

  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_user_id ON bitcoin_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_address ON bitcoin_addresses(address);
CREATE INDEX IF NOT EXISTS idx_bitcoin_addresses_active ON bitcoin_addresses(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_user_id ON bitcoin_utxos(user_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id ON bitcoin_utxos(address_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_txid ON bitcoin_utxos(txid);
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_unspent ON bitcoin_utxos(is_spent) WHERE is_spent = false;

CREATE INDEX IF NOT EXISTS idx_bitcoin_transactions_user_id ON bitcoin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_transactions_txid ON bitcoin_transactions(txid);
CREATE INDEX IF NOT EXISTS idx_bitcoin_transactions_status ON bitcoin_transactions(status);
CREATE INDEX IF NOT EXISTS idx_bitcoin_transactions_created ON bitcoin_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lightning_invoices_user_id ON lightning_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_payment_hash ON lightning_invoices(payment_hash);
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_status ON lightning_invoices(status);

CREATE INDEX IF NOT EXISTS idx_liquid_assets_user_id ON liquid_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_bitcoin_fee_estimates_created ON bitcoin_fee_estimates(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE bitcoin_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Bitcoin addresses"
  ON bitcoin_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Bitcoin addresses"
  ON bitcoin_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Bitcoin addresses"
  ON bitcoin_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE bitcoin_utxos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own UTXOs"
  ON bitcoin_utxos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE bitcoin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Bitcoin transactions"
  ON bitcoin_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create Bitcoin transactions"
  ON bitcoin_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE lightning_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Lightning nodes"
  ON lightning_nodes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE lightning_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Lightning invoices"
  ON lightning_invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create Lightning invoices"
  ON lightning_invoices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE liquid_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Liquid assets"
  ON liquid_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE bitcoin_fee_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fee estimates"
  ON bitcoin_fee_estimates FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_bitcoin_balance(p_user_id uuid)
RETURNS TABLE (
  confirmed_sats bigint,
  unconfirmed_sats bigint,
  total_sats bigint,
  confirmed_btc decimal(16, 8),
  unconfirmed_btc decimal(16, 8),
  total_btc decimal(16, 8)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(balance_confirmed), 0)::bigint as confirmed_sats,
    COALESCE(SUM(balance_unconfirmed), 0)::bigint as unconfirmed_sats,
    COALESCE(SUM(balance_total), 0)::bigint as total_sats,
    (COALESCE(SUM(balance_confirmed), 0)::decimal / 100000000) as confirmed_btc,
    (COALESCE(SUM(balance_unconfirmed), 0)::decimal / 100000000) as unconfirmed_btc,
    (COALESCE(SUM(balance_total), 0)::decimal / 100000000) as total_btc
  FROM bitcoin_addresses
  WHERE user_id = p_user_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_spendable_utxos(
  p_user_id uuid,
  p_min_confirmations integer DEFAULT 3
)
RETURNS TABLE (
  utxo_id uuid,
  txid text,
  vout integer,
  value_sats bigint,
  confirmations integer,
  privacy_score integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.txid,
    u.vout,
    u.value_satoshis,
    u.confirmations,
    u.privacy_score
  FROM bitcoin_utxos u
  WHERE u.user_id = p_user_id
    AND u.is_spent = false
    AND u.is_confirmed = true
    AND u.confirmations >= p_min_confirmations
    AND u.is_locked = false
    AND u.is_dust = false
  ORDER BY u.value_satoshis DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
