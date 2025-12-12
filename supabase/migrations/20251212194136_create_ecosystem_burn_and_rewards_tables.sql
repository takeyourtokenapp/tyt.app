/*
  # Burn Events, Reports, Service Button, and Daily Rewards Tables
  
  Supporting tables for the TYT tokenomics engine:
  - Weekly burn mechanics
  - Service button daily claims
  - Daily mining rewards aggregation
*/

-- Burn Events
CREATE TABLE IF NOT EXISTS burn_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_type text NOT NULL CHECK (burn_type IN ('maintenance', 'marketplace', 'miner_upgrade', 'scheduled_weekly', 'governance_burn', 'charity_mint')),
  amount_tyt numeric NOT NULL CHECK (amount_tyt > 0),
  tx_hash text,
  burn_address text NOT NULL DEFAULT 'TYTBurnAddressXXXXXXXXXXXXXXXXXX',
  source_ref_type text,
  source_ref_id uuid,
  report_uri text,
  burned_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE burn_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'burn_events' AND policyname = 'Anyone can view burn events') THEN
    CREATE POLICY "Anyone can view burn events" ON burn_events FOR SELECT USING (true);
  END IF;
END $$;

-- Burn Pool (pending burns)
CREATE TABLE IF NOT EXISTS burn_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_tyt numeric NOT NULL CHECK (amount_tyt > 0),
  burn_type text NOT NULL CHECK (burn_type IN ('maintenance', 'marketplace', 'miner_upgrade', 'scheduled_weekly', 'governance_burn', 'charity_mint')),
  source_ref_type text,
  source_ref_id uuid,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'burned', 'cancelled')),
  burn_event_id uuid REFERENCES burn_events(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE burn_pool ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'burn_pool' AND policyname = 'Anyone can view burn pool') THEN
    CREATE POLICY "Anyone can view burn pool" ON burn_pool FOR SELECT USING (true);
  END IF;
END $$;

-- Burn Reports (weekly summaries)
CREATE TABLE IF NOT EXISTS burn_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_burned numeric NOT NULL DEFAULT 0,
  burn_by_type jsonb NOT NULL DEFAULT '{}'::jsonb,
  charity_mint_amount numeric NOT NULL DEFAULT 0,
  cumulative_total_burned numeric NOT NULL DEFAULT 0,
  tx_hashes text[] DEFAULT ARRAY[]::text[],
  report_uri text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE burn_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'burn_reports' AND policyname = 'Anyone can view burn reports') THEN
    CREATE POLICY "Anyone can view burn reports" ON burn_reports FOR SELECT USING (true);
  END IF;
END $$;

-- Service Button Claims
CREATE TABLE IF NOT EXISTS service_button_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tyt_amount numeric NOT NULL,
  vip_level integer NOT NULL DEFAULT 1,
  claim_date date NOT NULL DEFAULT CURRENT_DATE,
  claimed_at timestamptz DEFAULT now()
);

ALTER TABLE service_button_claims ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_button_claims' AND policyname = 'Users can view own service claims') THEN
    CREATE POLICY "Users can view own service claims" ON service_button_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_button_claims' AND policyname = 'Users can insert own service claims') THEN
    CREATE POLICY "Users can insert own service claims" ON service_button_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create unique index for one claim per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_claims_user_date ON service_button_claims(user_id, claim_date);

-- Daily Rewards Summary
CREATE TABLE IF NOT EXISTS daily_rewards_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  total_miners_processed integer NOT NULL DEFAULT 0,
  total_gross_btc numeric NOT NULL DEFAULT 0,
  total_net_btc numeric NOT NULL DEFAULT 0,
  total_maintenance_collected numeric NOT NULL DEFAULT 0,
  total_reinvested numeric NOT NULL DEFAULT 0,
  network_hashrate numeric,
  btc_price numeric,
  merkle_root text,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_rewards_summary ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_rewards_summary' AND policyname = 'Anyone can view daily summaries') THEN
    CREATE POLICY "Anyone can view daily summaries" ON daily_rewards_summary FOR SELECT USING (true);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_rewards_date ON daily_rewards_summary(date);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_burn_events_type ON burn_events(burn_type);
CREATE INDEX IF NOT EXISTS idx_burn_events_status ON burn_events(status);
CREATE INDEX IF NOT EXISTS idx_burn_events_burned_at ON burn_events(burned_at DESC);
CREATE INDEX IF NOT EXISTS idx_burn_pool_status ON burn_pool(status);

-- Function to record TYT burn
CREATE OR REPLACE FUNCTION record_tyt_burn(
  p_amount numeric,
  p_burn_type text,
  p_ref_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pool_id uuid;
BEGIN
  INSERT INTO burn_pool (amount_tyt, burn_type, source_ref_id)
  VALUES (p_amount, p_burn_type, p_ref_id)
  RETURNING id INTO v_pool_id;
  
  RETURN v_pool_id;
END;
$$;

-- Function to credit user TYT
CREATE OR REPLACE FUNCTION credit_user_tyt(
  p_user_id uuid,
  p_amount numeric,
  p_ref_type text,
  p_ref_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE custodial_wallets
  SET balance = balance + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id AND currency = 'TYT';
  
  IF NOT FOUND THEN
    INSERT INTO custodial_wallets (user_id, currency, balance)
    VALUES (p_user_id, 'TYT', p_amount)
    ON CONFLICT (user_id, currency) DO UPDATE SET balance = custodial_wallets.balance + p_amount;
  END IF;
END;
$$;

-- View for burn statistics
CREATE OR REPLACE VIEW burn_statistics AS
SELECT
  COUNT(*) as total_burn_events,
  COALESCE(SUM(amount_tyt) FILTER (WHERE status = 'confirmed'), 0) as total_burned,
  COALESCE(SUM(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '24 hours'), 0) as burned_24h,
  COALESCE(SUM(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '7 days'), 0) as burned_7d,
  COALESCE(SUM(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '30 days'), 0) as burned_30d,
  COALESCE(SUM(amount_tyt) FILTER (WHERE burn_type = 'charity_mint' AND status = 'confirmed'), 0) as charity_mint_total
FROM burn_events;

-- Seed some sample burn events for demonstration
INSERT INTO burn_events (burn_type, amount_tyt, burn_address, status, burned_at, tx_hash)
VALUES
  ('maintenance', 15000, 'TYTBurnAddressXXXXXXXXXXXXXXXXXX', 'confirmed', now() - interval '6 days', '0xburn001'),
  ('marketplace', 8500, 'TYTBurnAddressXXXXXXXXXXXXXXXXXX', 'confirmed', now() - interval '5 days', '0xburn002'),
  ('miner_upgrade', 5200, 'TYTBurnAddressXXXXXXXXXXXXXXXXXX', 'confirmed', now() - interval '4 days', '0xburn003'),
  ('scheduled_weekly', 45000, 'TYTBurnAddressXXXXXXXXXXXXXXXXXX', 'confirmed', now() - interval '2 days', '0xburn004'),
  ('charity_mint', 11250, 'CHARITY_FOUNDATION_WALLET', 'confirmed', now() - interval '2 days', '0xcharity001'),
  ('maintenance', 12300, 'TYTBurnAddressXXXXXXXXXXXXXXXXXX', 'confirmed', now() - interval '1 day', '0xburn005')
ON CONFLICT DO NOTHING;