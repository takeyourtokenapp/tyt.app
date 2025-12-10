/*
  # Deposit Fee Configuration System (60/30/10 Split)

  1. New Tables
    - `fee_configurations` - Configurable fee percentages
      - Default: deposit at 1.00% (100 bps)
      - Split: 60% protocol, 30% charity, 10% academy
      - Max fee: 500 bps (5%)

    - `charity_flows` - Track all charity and academy flows
    - `protocol_revenue` - Track protocol earnings (60%)

  2. Security
    - Enable RLS on all tables
    - Public transparency for charity flows
*/

-- Fee configuration table
CREATE TABLE IF NOT EXISTS fee_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_key text UNIQUE NOT NULL,
  fee_name text NOT NULL,
  fee_bps_total integer NOT NULL CHECK (fee_bps_total >= 0 AND fee_bps_total <= 500),
  protocol_pct integer NOT NULL DEFAULT 60 CHECK (protocol_pct >= 0 AND protocol_pct <= 100),
  charity_pct integer NOT NULL DEFAULT 30 CHECK (charity_pct >= 0 AND charity_pct <= 100),
  academy_pct integer NOT NULL DEFAULT 10 CHECK (academy_pct >= 0 AND academy_pct <= 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_split CHECK (protocol_pct + charity_pct + academy_pct = 100)
);

-- Charity flows tracking
CREATE TABLE IF NOT EXISTS charity_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  source_type text NOT NULL,
  source_id uuid,
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  amount_usd numeric NOT NULL CHECK (amount_usd > 0),
  flow_type text NOT NULL CHECK (flow_type IN ('charity', 'academy')),
  transaction_id uuid REFERENCES wallet_transactions(id),
  created_at timestamptz DEFAULT now()
);

-- Protocol revenue tracking
CREATE TABLE IF NOT EXISTS protocol_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_id uuid,
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  amount_usd numeric NOT NULL CHECK (amount_usd > 0),
  transaction_id uuid REFERENCES wallet_transactions(id),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fee_configurations_key ON fee_configurations(fee_key);
CREATE INDEX IF NOT EXISTS idx_charity_flows_user_id ON charity_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_flows_source ON charity_flows(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_charity_flows_flow_type ON charity_flows(flow_type);
CREATE INDEX IF NOT EXISTS idx_charity_flows_created_at ON charity_flows(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_source ON protocol_revenue(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_created_at ON protocol_revenue(created_at DESC);

-- RLS
ALTER TABLE fee_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_revenue ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view fee configurations"
  ON fee_configurations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view charity flows"
  ON charity_flows FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can view protocol revenue"
  ON protocol_revenue FOR SELECT
  TO authenticated
  USING (true);

-- Default configurations
INSERT INTO fee_configurations (fee_key, fee_name, fee_bps_total, protocol_pct, charity_pct, academy_pct) VALUES
  ('deposit.stables', 'Stablecoin Deposits', 100, 60, 30, 10),
  ('deposit.crypto', 'Crypto Deposits', 100, 60, 30, 10),
  ('marketplace.primary', 'Primary Sales', 300, 60, 30, 10),
  ('marketplace.secondary', 'Secondary Sales', 300, 60, 30, 10)
ON CONFLICT (fee_key) DO NOTHING;

-- Fee calculation function
CREATE OR REPLACE FUNCTION calculate_deposit_fees(
  p_amount numeric,
  p_asset text
)
RETURNS TABLE (
  fee_total numeric,
  amount_user numeric,
  fee_protocol numeric,
  fee_charity numeric,
  fee_academy numeric
) AS $$
DECLARE
  v_config RECORD;
BEGIN
  SELECT * INTO v_config
  FROM fee_configurations
  WHERE fee_key = CASE
    WHEN p_asset IN ('USDT', 'USDC', 'DAI') THEN 'deposit.stables'
    ELSE 'deposit.crypto'
  END
  AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    v_config.fee_bps_total := 100;
    v_config.protocol_pct := 60;
    v_config.charity_pct := 30;
    v_config.academy_pct := 10;
  END IF;

  fee_total := (p_amount * v_config.fee_bps_total / 10000.0);
  amount_user := p_amount - fee_total;
  fee_protocol := fee_total * v_config.protocol_pct / 100.0;
  fee_charity := fee_total * v_config.charity_pct / 100.0;
  fee_academy := fee_total * v_config.academy_pct / 100.0;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;