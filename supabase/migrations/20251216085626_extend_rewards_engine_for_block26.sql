/*
  # Extend Rewards Engine for Block 2.6

  ## Summary
  Extends existing daily_rewards table with maintenance deductions, charity, reinvest,
  and Merkle proof fields. Adds reward_pools table and supporting functions.

  ## Changes
    - Creates `reward_pools` table
    - Extends `daily_rewards` with new columns
    - Creates `reward_claims` table
    - Adds calculation functions and views

  ## Security
    - RLS enabled on new tables
*/

-- Reward pools table
CREATE TABLE IF NOT EXISTS reward_pools (
  date date PRIMARY KEY,
  gross_btc numeric(16, 8) NOT NULL CHECK (gross_btc >= 0),
  btc_price_usd numeric(12, 2) CHECK (btc_price_usd > 0),
  total_hashrate_th numeric(12, 2),
  merkle_root text,
  distributed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reward_pools_date ON reward_pools(date DESC);
CREATE INDEX IF NOT EXISTS idx_reward_pools_distributed ON reward_pools(distributed_at) WHERE distributed_at IS NOT NULL;

ALTER TABLE reward_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reward pools"
  ON reward_pools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage reward pools"
  ON reward_pools FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Extend daily_rewards table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_rewards' AND column_name = 'gross_btc'
  ) THEN
    ALTER TABLE daily_rewards
      ADD COLUMN gross_btc numeric(16, 8) DEFAULT 0 CHECK (gross_btc >= 0),
      ADD COLUMN maintenance_btc numeric(16, 8) DEFAULT 0 CHECK (maintenance_btc >= 0),
      ADD COLUMN elec_usd numeric(12, 2) DEFAULT 0,
      ADD COLUMN service_usd numeric(12, 2) DEFAULT 0,
      ADD COLUMN discount_pct integer DEFAULT 0 CHECK (discount_pct >= 0 AND discount_pct <= 100),
      ADD COLUMN net_btc numeric(16, 8) DEFAULT 0 CHECK (net_btc >= 0),
      ADD COLUMN reinvest_btc numeric(16, 8) DEFAULT 0 CHECK (reinvest_btc >= 0),
      ADD COLUMN charity_btc numeric(16, 8) DEFAULT 0 CHECK (charity_btc >= 0),
      ADD COLUMN user_btc numeric(16, 8) DEFAULT 0 CHECK (user_btc >= 0),
      ADD COLUMN proof_leaf text,
      ADD COLUMN merkle_index integer;
  END IF;
END $$;

-- Reward claims table
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid NOT NULL REFERENCES daily_rewards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_btc numeric(16, 8) NOT NULL CHECK (amount_btc > 0),
  transaction_hash text,
  blockchain text DEFAULT 'polygon',
  claimed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_reward_claims_reward ON reward_claims(reward_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_user ON reward_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_tx ON reward_claims(transaction_hash);

ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON reward_claims FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own claims"
  ON reward_claims FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage claims"
  ON reward_claims FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to get total rewards for a miner
CREATE OR REPLACE FUNCTION get_miner_total_rewards(
  p_miner_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_gross_btc', COALESCE(SUM(gross_btc), 0),
    'total_maintenance_btc', COALESCE(SUM(maintenance_btc), 0),
    'total_net_btc', COALESCE(SUM(net_btc), 0),
    'total_reinvest_btc', COALESCE(SUM(reinvest_btc), 0),
    'total_charity_btc', COALESCE(SUM(charity_btc), 0),
    'total_user_btc', COALESCE(SUM(user_btc), 0),
    'reward_count', COUNT(*),
    'start_date', MIN(reward_date),
    'end_date', MAX(reward_date)
  ) INTO v_result
  FROM daily_rewards
  WHERE miner_id = p_miner_id
    AND (p_start_date IS NULL OR reward_date >= p_start_date)
    AND (p_end_date IS NULL OR reward_date <= p_end_date);

  RETURN v_result;
END;
$$;

-- Function to get user's daily rewards summary
CREATE OR REPLACE FUNCTION get_user_daily_rewards(
  p_user_id uuid,
  p_date date
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'date', p_date,
    'total_gross_btc', COALESCE(SUM(gross_btc), 0),
    'total_maintenance_btc', COALESCE(SUM(maintenance_btc), 0),
    'total_net_btc', COALESCE(SUM(net_btc), 0),
    'total_reinvest_btc', COALESCE(SUM(reinvest_btc), 0),
    'total_charity_btc', COALESCE(SUM(charity_btc), 0),
    'total_user_btc', COALESCE(SUM(user_btc), 0),
    'miner_count', COUNT(*),
    'rewards', jsonb_agg(
      jsonb_build_object(
        'miner_id', miner_id,
        'gross_btc', gross_btc,
        'net_btc', net_btc,
        'user_btc', user_btc
      )
    )
  ) INTO v_result
  FROM daily_rewards
  WHERE user_id = p_user_id
    AND reward_date = p_date;

  RETURN v_result;
END;
$$;

-- Function to calculate reward share
CREATE OR REPLACE FUNCTION calculate_reward_share(
  p_miner_hashrate numeric,
  p_total_hashrate numeric,
  p_pool_btc numeric
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF p_total_hashrate <= 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (p_miner_hashrate / p_total_hashrate) * p_pool_btc;
END;
$$;

GRANT EXECUTE ON FUNCTION get_miner_total_rewards TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_daily_rewards TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION calculate_reward_share TO authenticated, service_role;

-- View for user rewards summary (v2 with new fields)
CREATE OR REPLACE VIEW v_user_rewards_summary_v2 AS
SELECT
  user_id,
  COUNT(DISTINCT reward_date) as reward_days,
  COUNT(*) as total_rewards,
  SUM(gross_btc) as total_gross_btc,
  SUM(maintenance_btc) as total_maintenance_btc,
  SUM(net_btc) as total_net_btc,
  SUM(reinvest_btc) as total_reinvest_btc,
  SUM(charity_btc) as total_charity_btc,
  SUM(user_btc) as total_user_btc,
  SUM(btc_amount) as total_legacy_btc,
  AVG(discount_pct) as avg_discount_pct,
  MAX(reward_date) as last_reward_date,
  MIN(reward_date) as first_reward_date
FROM daily_rewards
GROUP BY user_id;

-- View for miner rewards summary (v2 with new fields)
CREATE OR REPLACE VIEW v_miner_rewards_summary_v2 AS
SELECT
  miner_id,
  COUNT(*) as reward_days,
  SUM(gross_btc) as total_gross_btc,
  SUM(maintenance_btc) as total_maintenance_btc,
  SUM(net_btc) as total_net_btc,
  SUM(reinvest_btc) as total_reinvest_btc,
  SUM(charity_btc) as total_charity_btc,
  SUM(user_btc) as total_user_btc,
  SUM(btc_amount) as total_legacy_btc,
  AVG(gross_btc) as avg_daily_gross_btc,
  AVG(net_btc) as avg_daily_net_btc,
  AVG(user_btc) as avg_daily_user_btc,
  MAX(reward_date) as last_reward_date,
  MIN(reward_date) as first_reward_date
FROM daily_rewards
GROUP BY miner_id;

-- Trigger to update miner stats on reward (v2)
CREATE OR REPLACE FUNCTION update_miner_reward_stats_v2()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE nft_miners
  SET last_reward_at = NEW.created_at,
      total_rewards_btc = COALESCE(total_rewards_btc, 0) + COALESCE(NEW.user_btc, NEW.btc_amount, 0),
      updated_at = now()
  WHERE id = NEW.miner_id;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_reward_created_v2 ON daily_rewards;

CREATE TRIGGER on_reward_created_v2
  AFTER INSERT ON daily_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_miner_reward_stats_v2();
