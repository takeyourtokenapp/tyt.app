/*
  # Extend Governance System - Block 2.8

  ## Summary
  Extends existing governance tables and adds veTYT integration,
  voting functions, and execution queue.

  ## Changes
    - Extends governance_proposals with missing columns
    - Creates governance_votes table
    - Creates user_vetyt_cache table
    - Creates governance_execution_queue table
    - Adds RPC functions for voting and tallying

  ## Security
    - RLS enabled on all new tables
*/

-- Extend governance_proposals if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'governance_proposals' AND column_name = 'param_key'
  ) THEN
    ALTER TABLE governance_proposals
      ADD COLUMN param_key text,
      ADD COLUMN current_value text,
      ADD COLUMN proposed_value text,
      ADD COLUMN voting_starts_at timestamptz DEFAULT now(),
      ADD COLUMN voting_ends_at timestamptz,
      ADD COLUMN execution_data jsonb DEFAULT '{}'::jsonb,
      ADD COLUMN execution_tx text,
      ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create governance_votes table
CREATE TABLE IF NOT EXISTS governance_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  voting_power numeric(24, 8) NOT NULL CHECK (voting_power >= 0),
  choice text NOT NULL CHECK (choice IN ('yes', 'no', 'abstain')),
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_governance_votes_proposal ON governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_user ON governance_votes(user_id);

ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view votes"
  ON governance_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can cast votes"
  ON governance_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role manages votes"
  ON governance_votes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create user_vetyt_cache table
CREATE TABLE IF NOT EXISTS user_vetyt_cache (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  voting_power numeric(24, 8) DEFAULT 0 CHECK (voting_power >= 0),
  locked_amount numeric(24, 8) DEFAULT 0,
  lock_end timestamptz,
  last_updated timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vetyt_cache_wallet ON user_vetyt_cache(wallet_address);
CREATE INDEX IF NOT EXISTS idx_vetyt_cache_power ON user_vetyt_cache(voting_power DESC);

ALTER TABLE user_vetyt_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view veTYT"
  ON user_vetyt_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages veTYT"
  ON user_vetyt_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create governance_execution_queue table
CREATE TABLE IF NOT EXISTS governance_execution_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  attempts integer DEFAULT 0,
  last_error text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_execution_queue_scheduled ON governance_execution_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_execution_queue_proposal ON governance_execution_queue(proposal_id);

ALTER TABLE governance_execution_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view queue"
  ON governance_execution_queue FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages queue"
  ON governance_execution_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to get user's voting power
CREATE OR REPLACE FUNCTION get_user_voting_power(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_power numeric;
BEGIN
  SELECT voting_power INTO v_power
  FROM user_vetyt_cache
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(v_power, 0);
END;
$$;

-- Function to cast vote
CREATE OR REPLACE FUNCTION cast_vote_v2(
  p_user_id uuid,
  p_proposal_id uuid,
  p_choice text,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_voting_power numeric;
  v_proposal RECORD;
  v_wallet text;
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO v_proposal
  FROM governance_proposals
  WHERE id = p_proposal_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposal not found';
  END IF;

  SELECT voting_power, wallet_address 
  INTO v_voting_power, v_wallet
  FROM user_vetyt_cache
  WHERE user_id = p_user_id;

  IF COALESCE(v_voting_power, 0) = 0 THEN
    RAISE EXCEPTION 'No voting power';
  END IF;

  INSERT INTO governance_votes (
    proposal_id, user_id, wallet_address,
    voting_power, choice, reason
  ) VALUES (
    p_proposal_id, p_user_id, COALESCE(v_wallet, ''),
    v_voting_power, p_choice, p_reason
  )
  ON CONFLICT (proposal_id, user_id)
  DO UPDATE SET
    voting_power = EXCLUDED.voting_power,
    choice = EXCLUDED.choice,
    reason = EXCLUDED.reason;
END;
$$;

-- Function to tally proposal
CREATE OR REPLACE FUNCTION tally_proposal_v2(p_proposal_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_yes numeric;
  v_no numeric;
  v_abstain numeric;
  v_total numeric;
  v_quorum numeric;
BEGIN
  SELECT quorum_required INTO v_quorum
  FROM governance_proposals
  WHERE id = p_proposal_id;

  SELECT
    COALESCE(SUM(CASE WHEN choice = 'yes' THEN voting_power ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN choice = 'no' THEN voting_power ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN choice = 'abstain' THEN voting_power ELSE 0 END), 0),
    COALESCE(SUM(voting_power), 0)
  INTO v_yes, v_no, v_abstain, v_total
  FROM governance_votes
  WHERE proposal_id = p_proposal_id;

  RETURN jsonb_build_object(
    'yes', v_yes,
    'no', v_no,
    'abstain', v_abstain,
    'total', v_total,
    'quorum', COALESCE(v_quorum, 10000),
    'passed', v_yes > v_no AND v_total >= COALESCE(v_quorum, 10000),
    'yes_pct', CASE WHEN v_total > 0 THEN v_yes / v_total * 100 ELSE 0 END,
    'no_pct', CASE WHEN v_total > 0 THEN v_no / v_total * 100 ELSE 0 END
  );
END;
$$;

-- Function to get proposal status
CREATE OR REPLACE FUNCTION get_proposal_status_v2(p_proposal_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_proposal RECORD;
  v_tally jsonb;
  v_vote_count integer;
BEGIN
  SELECT * INTO v_proposal
  FROM governance_proposals
  WHERE id = p_proposal_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_tally := tally_proposal_v2(p_proposal_id);

  SELECT COUNT(*) INTO v_vote_count
  FROM governance_votes
  WHERE proposal_id = p_proposal_id;

  RETURN jsonb_build_object(
    'proposal_id', v_proposal.id,
    'title', v_proposal.title,
    'status', v_proposal.status,
    'votes', v_tally,
    'vote_count', v_vote_count
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_voting_power TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION cast_vote_v2 TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION tally_proposal_v2 TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_proposal_status_v2 TO authenticated, service_role;
