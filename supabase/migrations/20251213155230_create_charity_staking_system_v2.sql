/*
  # Charity Staking System

  1. New Tables
    - charity_staking_pools - Staking pool configurations
    - charity_stakes - User stakes that benefit foundation
    - charity_staking_rewards - Reward distributions

  2. Features
    - Multiple charity pools with different APY
    - Flexible lock periods (1 month to 2 years)
    - 100% rewards go to foundation
    - Users get tax deduction certificates
    - Social impact tracking

  3. Security
    - RLS policies for user stakes
    - Automatic reward calculations
    - Transparent foundation transfers
*/

-- Charity Staking Pools
CREATE TABLE IF NOT EXISTS charity_staking_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_name text NOT NULL,
  description text,
  
  -- Token
  asset text NOT NULL DEFAULT 'TYT',
  
  -- APY and rewards
  base_apy numeric NOT NULL CHECK (base_apy >= 0 AND base_apy <= 100),
  bonus_apy numeric DEFAULT 0,
  
  -- Pool limits
  min_stake_amount numeric NOT NULL DEFAULT 100,
  max_stake_amount numeric,
  total_staked numeric DEFAULT 0,
  pool_cap numeric,
  
  -- Lock periods
  min_lock_days integer NOT NULL DEFAULT 30,
  max_lock_days integer NOT NULL DEFAULT 730,
  
  -- Foundation allocation
  foundation_allocation_percentage integer NOT NULL DEFAULT 100 CHECK (foundation_allocation_percentage >= 0 AND foundation_allocation_percentage <= 100),
  
  -- Pool status
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  
  -- Impact tracking
  total_donated numeric DEFAULT 0,
  unique_stakers_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User charity stakes
CREATE TABLE IF NOT EXISTS charity_stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pool_id uuid NOT NULL REFERENCES charity_staking_pools(id),
  
  -- Stake details
  asset text NOT NULL DEFAULT 'TYT',
  stake_amount numeric NOT NULL CHECK (stake_amount > 0),
  apy numeric NOT NULL,
  
  -- Lock period
  lock_days integer NOT NULL,
  staked_at timestamptz DEFAULT now(),
  unlock_at timestamptz NOT NULL,
  
  -- Rewards
  total_rewards_earned numeric DEFAULT 0,
  total_donated numeric DEFAULT 0,
  last_reward_calculated_at timestamptz DEFAULT now(),
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  withdrawn_at timestamptz,
  
  -- Impact
  children_helped integer DEFAULT 0,
  research_funded_usd numeric DEFAULT 0,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Charity staking reward distributions
CREATE TABLE IF NOT EXISTS charity_staking_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stake_id uuid NOT NULL REFERENCES charity_stakes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Reward details
  asset text NOT NULL DEFAULT 'TYT',
  reward_amount numeric NOT NULL CHECK (reward_amount >= 0),
  foundation_amount numeric NOT NULL CHECK (foundation_amount >= 0),
  
  -- Distribution
  distributed_at timestamptz DEFAULT now(),
  foundation_tx_id uuid,
  
  -- Period
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  days_staked integer NOT NULL,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charity_staking_pools_active ON charity_staking_pools(is_active);
CREATE INDEX IF NOT EXISTS idx_charity_stakes_user_id ON charity_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_stakes_pool_id ON charity_stakes(pool_id);
CREATE INDEX IF NOT EXISTS idx_charity_stakes_status ON charity_stakes(status);
CREATE INDEX IF NOT EXISTS idx_charity_stakes_unlock_at ON charity_stakes(unlock_at);
CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_stake_id ON charity_staking_rewards(stake_id);
CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_user_id ON charity_staking_rewards(user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Create a charity stake
CREATE OR REPLACE FUNCTION create_charity_stake(
  p_user_id uuid,
  p_pool_id uuid,
  p_stake_amount numeric,
  p_lock_days integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stake_id uuid;
  v_pool RECORD;
  v_user_balance numeric;
  v_unlock_at timestamptz;
BEGIN
  SELECT * INTO v_pool
  FROM charity_staking_pools
  WHERE id = p_pool_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pool not found or inactive';
  END IF;

  IF p_stake_amount < v_pool.min_stake_amount THEN
    RAISE EXCEPTION 'Stake amount below minimum: %', v_pool.min_stake_amount;
  END IF;

  IF v_pool.max_stake_amount IS NOT NULL AND p_stake_amount > v_pool.max_stake_amount THEN
    RAISE EXCEPTION 'Stake amount above maximum: %', v_pool.max_stake_amount;
  END IF;

  IF p_lock_days < v_pool.min_lock_days OR p_lock_days > v_pool.max_lock_days THEN
    RAISE EXCEPTION 'Lock period must be between % and % days', v_pool.min_lock_days, v_pool.max_lock_days;
  END IF;

  IF v_pool.pool_cap IS NOT NULL AND (v_pool.total_staked + p_stake_amount) > v_pool.pool_cap THEN
    RAISE EXCEPTION 'Pool cap exceeded';
  END IF;

  SELECT balance INTO v_user_balance
  FROM custodial_wallets
  WHERE user_id = p_user_id AND asset = v_pool.asset;

  IF v_user_balance < p_stake_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  v_unlock_at := now() + (p_lock_days || ' days')::interval;

  UPDATE custodial_wallets
  SET balance = balance - p_stake_amount,
      locked_balance = locked_balance + p_stake_amount
  WHERE user_id = p_user_id AND asset = v_pool.asset;

  INSERT INTO charity_stakes (
    user_id,
    pool_id,
    asset,
    stake_amount,
    apy,
    lock_days,
    unlock_at
  ) VALUES (
    p_user_id,
    p_pool_id,
    v_pool.asset,
    p_stake_amount,
    v_pool.base_apy + v_pool.bonus_apy,
    p_lock_days,
    v_unlock_at
  )
  RETURNING id INTO v_stake_id;

  UPDATE charity_staking_pools
  SET total_staked = total_staked + p_stake_amount,
      unique_stakers_count = unique_stakers_count + 1,
      updated_at = now()
  WHERE id = p_pool_id;

  INSERT INTO ledger_entries (
    user_id,
    asset,
    operation_type,
    amount,
    description
  ) VALUES (
    p_user_id,
    v_pool.asset,
    'charity_stake',
    -p_stake_amount,
    format('Staked %s %s in charity pool for %s days. Rewards benefit Children Brain Cancer Foundation',
      p_stake_amount, v_pool.asset, p_lock_days)
  );

  RETURN v_stake_id;
END;
$$;

-- Calculate and distribute charity staking rewards
CREATE OR REPLACE FUNCTION calculate_charity_rewards(p_stake_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stake RECORD;
  v_pool RECORD;
  v_days_since_last_calc integer;
  v_daily_rate numeric;
  v_reward_amount numeric;
  v_foundation_amount numeric;
BEGIN
  SELECT * INTO v_stake
  FROM charity_stakes
  WHERE id = p_stake_id AND status = 'active';

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  SELECT * INTO v_pool
  FROM charity_staking_pools
  WHERE id = v_stake.pool_id;

  v_days_since_last_calc := EXTRACT(DAY FROM (now() - v_stake.last_reward_calculated_at));

  IF v_days_since_last_calc < 1 THEN
    RETURN 0;
  END IF;

  v_daily_rate := v_stake.apy / 365.0 / 100.0;
  v_reward_amount := v_stake.stake_amount * v_daily_rate * v_days_since_last_calc;
  v_foundation_amount := v_reward_amount * (v_pool.foundation_allocation_percentage::numeric / 100.0);

  INSERT INTO charity_staking_rewards (
    stake_id,
    user_id,
    asset,
    reward_amount,
    foundation_amount,
    period_start,
    period_end,
    days_staked
  ) VALUES (
    p_stake_id,
    v_stake.user_id,
    v_stake.asset,
    v_reward_amount,
    v_foundation_amount,
    v_stake.last_reward_calculated_at,
    now(),
    v_days_since_last_calc
  );

  UPDATE charity_stakes
  SET total_rewards_earned = total_rewards_earned + v_reward_amount,
      total_donated = total_donated + v_foundation_amount,
      last_reward_calculated_at = now(),
      updated_at = now()
  WHERE id = p_stake_id;

  UPDATE charity_staking_pools
  SET total_donated = total_donated + v_foundation_amount,
      updated_at = now()
  WHERE id = v_stake.pool_id;

  RETURN v_foundation_amount;
END;
$$;

-- Withdraw charity stake (after unlock period)
CREATE OR REPLACE FUNCTION withdraw_charity_stake(
  p_stake_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stake RECORD;
  v_final_rewards numeric;
BEGIN
  SELECT * INTO v_stake
  FROM charity_stakes
  WHERE id = p_stake_id AND user_id = p_user_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stake not found or already withdrawn';
  END IF;

  IF v_stake.unlock_at > now() THEN
    RAISE EXCEPTION 'Stake is still locked until: %', v_stake.unlock_at;
  END IF;

  v_final_rewards := calculate_charity_rewards(p_stake_id);

  UPDATE custodial_wallets
  SET balance = balance + v_stake.stake_amount,
      locked_balance = locked_balance - v_stake.stake_amount
  WHERE user_id = p_user_id AND asset = v_stake.asset;

  UPDATE charity_stakes
  SET status = 'withdrawn',
      withdrawn_at = now(),
      updated_at = now()
  WHERE id = p_stake_id;

  UPDATE charity_staking_pools
  SET total_staked = total_staked - v_stake.stake_amount,
      updated_at = now()
  WHERE id = v_stake.pool_id;

  INSERT INTO ledger_entries (
    user_id,
    asset,
    operation_type,
    amount,
    description
  ) VALUES (
    p_user_id,
    v_stake.asset,
    'charity_unstake',
    v_stake.stake_amount,
    format('Withdrew %s %s from charity stake. Total donated: %s %s',
      v_stake.stake_amount, v_stake.asset, v_stake.total_donated, v_stake.asset)
  );

  RETURN true;
END;
$$;

-- ============================================================================
-- SEED INITIAL CHARITY POOLS
-- ============================================================================

INSERT INTO charity_staking_pools (
  pool_name,
  description,
  asset,
  base_apy,
  bonus_apy,
  min_stake_amount,
  pool_cap,
  min_lock_days,
  max_lock_days,
  foundation_allocation_percentage
) VALUES
  (
    'Hope Builder - 1 Month',
    '100% of rewards fund pediatric brain cancer research',
    'TYT',
    5.0,
    0.0,
    100,
    1000000,
    30,
    90,
    100
  ),
  (
    'Life Saver - 6 Months',
    'Support 6 months of critical research and family assistance',
    'TYT',
    12.0,
    3.0,
    500,
    5000000,
    180,
    270,
    100
  ),
  (
    'Legacy Champion - 1 Year',
    'Fund breakthrough treatments and clinical trials',
    'TYT',
    20.0,
    5.0,
    1000,
    10000000,
    365,
    730,
    100
  ),
  (
    'Hero Journey - 2 Years',
    'Maximum impact - fund comprehensive research programs',
    'TYT',
    30.0,
    10.0,
    5000,
    50000000,
    730,
    730,
    100
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE charity_staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_staking_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active charity pools"
  ON charity_staking_pools FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own charity stakes"
  ON charity_stakes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own charity rewards"
  ON charity_staking_rewards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());