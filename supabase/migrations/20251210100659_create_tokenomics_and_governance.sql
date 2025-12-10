/*
  # TYT Tokenomics and Governance
  
  1. New Tables
    - `burn_cycles` - Weekly token burn records
      - `id` (uuid, primary key)
      - `cycle_number` (integer)
      - `start_date` (date)
      - `end_date` (date)
      - `tyt_collected` (numeric) - TYT collected from maintenance
      - `tyt_burned` (numeric) - TYT actually burned
      - `burn_tx_hash` (text) - On-chain transaction
      - `status` (enum)
      - `burned_at` (timestamptz)
    
    - `ve_tyt_locks` - Vote-escrowed TYT locks (1 week - 4 years)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tyt_amount` (numeric)
      - `lock_duration_weeks` (integer)
      - `locked_at` (timestamptz)
      - `unlock_at` (timestamptz)
      - `voting_power` (numeric)
      - `weekly_rewards_claimed` (numeric)
      - `status` (enum: active, unlocked, withdrawn)
    
    - `governance_proposals` - Governance votes
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `proposal_type` (enum: kwh_rate, discount_curve, burn_schedule, treasury)
      - `proposed_by` (uuid, references profiles)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `votes_for` (numeric)
      - `votes_against` (numeric)
      - `status` (enum: active, passed, rejected, executed)
      - `metadata` (jsonb)
    
    - `governance_votes` - Individual votes
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, references governance_proposals)
      - `user_id` (uuid, references profiles)
      - `voting_power` (numeric)
      - `vote` (boolean) - true = for, false = against
      - `voted_at` (timestamptz)
    
    - `treasury_reserves` - BTC and TYT treasury tracking
      - `id` (uuid, primary key)
      - `currency` (text)
      - `balance` (numeric)
      - `locked_balance` (numeric)
      - `last_updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Public read for burn cycles and proposals
    - Users manage own locks and votes
*/

-- Create custom types
CREATE TYPE burn_status AS ENUM ('scheduled', 'collecting', 'ready', 'burning', 'completed', 'failed');
CREATE TYPE lock_status AS ENUM ('active', 'unlocking', 'unlocked', 'withdrawn');
CREATE TYPE proposal_type AS ENUM ('kwh_rate', 'discount_curve', 'burn_schedule', 'treasury_allocation', 'protocol_parameter', 'emergency');
CREATE TYPE proposal_status AS ENUM ('draft', 'active', 'passed', 'rejected', 'executed', 'cancelled');

-- Burn Cycles table
CREATE TABLE IF NOT EXISTS burn_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_number integer UNIQUE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  tyt_collected numeric DEFAULT 0 CHECK (tyt_collected >= 0),
  tyt_burned numeric DEFAULT 0 CHECK (tyt_burned >= 0),
  maintenance_payments_count integer DEFAULT 0,
  unique_payers_count integer DEFAULT 0,
  burn_tx_hash text,
  burn_block_number bigint,
  status burn_status DEFAULT 'scheduled',
  scheduled_burn_time timestamptz,
  burned_at timestamptz,
  report_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- veTYT Locks table
CREATE TABLE IF NOT EXISTS ve_tyt_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tyt_amount numeric NOT NULL CHECK (tyt_amount > 0),
  lock_duration_weeks integer NOT NULL CHECK (lock_duration_weeks >= 1 AND lock_duration_weeks <= 208), -- 1 week to 4 years
  locked_at timestamptz DEFAULT now(),
  unlock_at timestamptz NOT NULL,
  voting_power numeric NOT NULL CHECK (voting_power >= 0),
  weekly_rewards_claimed numeric DEFAULT 0,
  total_rewards_earned numeric DEFAULT 0,
  status lock_status DEFAULT 'active',
  lock_tx_hash text,
  unlock_tx_hash text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Governance Proposals table
CREATE TABLE IF NOT EXISTS governance_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  proposal_type proposal_type NOT NULL,
  proposed_by uuid NOT NULL REFERENCES profiles(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  quorum_required numeric DEFAULT 1000000, -- Minimum voting power needed
  votes_for numeric DEFAULT 0,
  votes_against numeric DEFAULT 0,
  unique_voters_count integer DEFAULT 0,
  status proposal_status DEFAULT 'draft',
  execution_tx_hash text,
  executed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Governance Votes table
CREATE TABLE IF NOT EXISTS governance_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voting_power numeric NOT NULL CHECK (voting_power > 0),
  vote boolean NOT NULL, -- true = for, false = against
  vote_tx_hash text,
  voted_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(proposal_id, user_id)
);

-- Treasury Reserves table
CREATE TABLE IF NOT EXISTS treasury_reserves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency wallet_currency UNIQUE NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  locked_balance numeric DEFAULT 0 CHECK (locked_balance >= 0),
  total_deposits numeric DEFAULT 0,
  total_withdrawals numeric DEFAULT 0,
  last_updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Weekly Reward Distributions (from Burn & Mint cycle)
CREATE TABLE IF NOT EXISTS weekly_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  burn_cycle_id uuid REFERENCES burn_cycles(id),
  distribution_date date NOT NULL,
  total_tyt_minted numeric DEFAULT 0,
  hashrate_providers_share numeric DEFAULT 0,
  ve_lockers_share numeric DEFAULT 0,
  treasury_share numeric DEFAULT 0,
  community_share numeric DEFAULT 0,
  status text DEFAULT 'pending',
  distributed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_burn_cycles_cycle_number ON burn_cycles(cycle_number DESC);
CREATE INDEX IF NOT EXISTS idx_burn_cycles_status ON burn_cycles(status);
CREATE INDEX IF NOT EXISTS idx_burn_cycles_start_date ON burn_cycles(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_ve_tyt_locks_user_id ON ve_tyt_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_ve_tyt_locks_status ON ve_tyt_locks(status);
CREATE INDEX IF NOT EXISTS idx_ve_tyt_locks_unlock_at ON ve_tyt_locks(unlock_at);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_status ON governance_proposals(status);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_end_time ON governance_proposals(end_time);
CREATE INDEX IF NOT EXISTS idx_governance_votes_proposal_id ON governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_user_id ON governance_votes(user_id);

-- Enable RLS
ALTER TABLE burn_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ve_tyt_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_distributions ENABLE ROW LEVEL SECURITY;

-- Burn Cycles policies (public read)
CREATE POLICY "Anyone can view burn cycles"
  ON burn_cycles FOR SELECT
  TO authenticated
  USING (true);

-- veTYT Locks policies
CREATE POLICY "Users can view own locks"
  ON ve_tyt_locks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own locks"
  ON ve_tyt_locks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own locks"
  ON ve_tyt_locks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Governance Proposals policies (public read, restricted write)
CREATE POLICY "Anyone can view active proposals"
  ON governance_proposals FOR SELECT
  TO authenticated
  USING (status IN ('active', 'passed', 'rejected', 'executed'));

CREATE POLICY "Users with voting power can create proposals"
  ON governance_proposals FOR INSERT
  TO authenticated
  WITH CHECK (proposed_by = auth.uid());

-- Governance Votes policies
CREATE POLICY "Users can view all votes"
  ON governance_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can vote on proposals"
  ON governance_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Treasury Reserves policies (public read)
CREATE POLICY "Anyone can view treasury reserves"
  ON treasury_reserves FOR SELECT
  TO authenticated
  USING (true);

-- Weekly Distributions policies (public read)
CREATE POLICY "Anyone can view weekly distributions"
  ON weekly_distributions FOR SELECT
  TO authenticated
  USING (true);

-- Function to calculate voting power based on lock duration
CREATE OR REPLACE FUNCTION calculate_voting_power(
  p_tyt_amount numeric,
  p_lock_duration_weeks integer
)
RETURNS numeric AS $$
BEGIN
  -- Voting power = amount * (lock_duration / max_duration)
  -- Max duration is 208 weeks (4 years)
  -- Linear scaling: 1 week = ~0.48% of max, 4 years = 100% of max
  RETURN p_tyt_amount * (p_lock_duration_weeks::numeric / 208.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Initialize treasury reserves for all currencies
INSERT INTO treasury_reserves (currency, balance) VALUES
  ('BTC', 0),
  ('TYT', 0),
  ('USDT', 0),
  ('TRX', 0),
  ('ETH', 0),
  ('SOL', 0)
ON CONFLICT (currency) DO NOTHING;

-- Function to get current burn cycle
CREATE OR REPLACE FUNCTION get_current_burn_cycle()
RETURNS uuid AS $$
DECLARE
  v_cycle_id uuid;
BEGIN
  SELECT id INTO v_cycle_id
  FROM burn_cycles
  WHERE status IN ('scheduled', 'collecting', 'ready')
  AND CURRENT_DATE BETWEEN start_date AND end_date
  ORDER BY cycle_number DESC
  LIMIT 1;
  
  RETURN v_cycle_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update user VIP discount based on veTYT
CREATE OR REPLACE FUNCTION update_user_ve_discount()
RETURNS TRIGGER AS $$
DECLARE
  v_total_voting_power numeric;
  v_discount_percent numeric;
BEGIN
  -- Calculate total voting power for user
  SELECT COALESCE(SUM(voting_power), 0)
  INTO v_total_voting_power
  FROM ve_tyt_locks
  WHERE user_id = NEW.user_id
  AND status = 'active';
  
  -- Map voting power to discount (example: 10000 voting power = 20% discount)
  v_discount_percent := LEAST((v_total_voting_power / 10000.0) * 20, 20);
  
  -- Update user_discounts
  UPDATE user_discounts
  SET 
    ve_tyt_discount_percent = v_discount_percent,
    effective_discount_percent = calculate_effective_discount(NEW.user_id),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_ve_discount_on_lock
  AFTER INSERT OR UPDATE ON ve_tyt_locks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_ve_discount();