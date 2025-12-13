/*
  # Implement veTYT Locking and Voting Functions

  1. New Functions
    - create_vetyt_lock() - Lock TYT tokens for voting power
    - calculate_voting_power() - Calculate veTYT based on amount and duration
    - unlock_vetyt() - Unlock expired locks
    - create_proposal() - Create governance proposal
    - cast_vote() - Vote on proposals
    - get_user_voting_power() - Get current voting power
    - finalize_proposal() - Close proposal and determine result

  2. Features
    - Linear voting power calculation (max 4x at 4 years)
    - Automatic proposal finalization
    - Quorum and majority requirements

  3. Security
    - Proposal creation requires minimum veTYT
    - Double voting prevention
    - Lock amount validation
*/

-- Calculate voting power based on lock amount and duration
CREATE OR REPLACE FUNCTION calculate_voting_power(
  p_tyt_amount numeric,
  p_lock_duration_weeks integer
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_max_weeks constant integer := 208;
  v_min_weeks constant integer := 1;
  v_multiplier numeric;
BEGIN
  IF p_lock_duration_weeks < v_min_weeks THEN
    RETURN 0;
  END IF;

  IF p_lock_duration_weeks >= v_max_weeks THEN
    v_multiplier := 4.0;
  ELSE
    v_multiplier := 1.0 + (3.0 * p_lock_duration_weeks::numeric / v_max_weeks::numeric);
  END IF;

  RETURN p_tyt_amount * v_multiplier;
END;
$$;

-- Get user's current total voting power
CREATE OR REPLACE FUNCTION get_user_voting_power(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_power numeric := 0;
BEGIN
  SELECT COALESCE(SUM(voting_power), 0)
  INTO v_total_power
  FROM ve_tyt_locks
  WHERE user_id = p_user_id
    AND status = 'active'
    AND unlock_at > now();

  RETURN v_total_power;
END;
$$;

-- Create a new veTYT lock
CREATE OR REPLACE FUNCTION create_vetyt_lock(
  p_user_id uuid,
  p_tyt_amount numeric,
  p_lock_duration_weeks integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lock_id uuid;
  v_unlock_at timestamptz;
  v_voting_power numeric;
  v_user_balance numeric;
BEGIN
  IF p_tyt_amount <= 0 THEN
    RAISE EXCEPTION 'Lock amount must be positive';
  END IF;

  IF p_lock_duration_weeks < 1 OR p_lock_duration_weeks > 208 THEN
    RAISE EXCEPTION 'Lock duration must be between 1 week and 4 years (208 weeks)';
  END IF;

  SELECT balance INTO v_user_balance
  FROM custodial_wallets
  WHERE user_id = p_user_id AND asset = 'TYT';

  IF v_user_balance < p_tyt_amount THEN
    RAISE EXCEPTION 'Insufficient TYT balance';
  END IF;

  v_unlock_at := now() + (p_lock_duration_weeks || ' weeks')::interval;
  v_voting_power := calculate_voting_power(p_tyt_amount, p_lock_duration_weeks);

  UPDATE custodial_wallets
  SET balance = balance - p_tyt_amount,
      locked_balance = locked_balance + p_tyt_amount
  WHERE user_id = p_user_id AND asset = 'TYT';

  INSERT INTO ve_tyt_locks (
    user_id,
    tyt_amount,
    lock_duration_weeks,
    unlock_at,
    voting_power,
    status
  ) VALUES (
    p_user_id,
    p_tyt_amount,
    p_lock_duration_weeks,
    v_unlock_at,
    v_voting_power,
    'active'
  )
  RETURNING id INTO v_lock_id;

  INSERT INTO ledger_entries (
    user_id,
    asset,
    operation_type,
    amount,
    description
  ) VALUES (
    p_user_id,
    'TYT',
    'lock',
    -p_tyt_amount,
    format('Locked %s TYT for %s weeks to gain %s veTYT voting power',
      p_tyt_amount, p_lock_duration_weeks, v_voting_power)
  );

  RETURN v_lock_id;
END;
$$;

-- Unlock veTYT
CREATE OR REPLACE FUNCTION unlock_vetyt(p_lock_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lock RECORD;
BEGIN
  SELECT * INTO v_lock
  FROM ve_tyt_locks
  WHERE id = p_lock_id AND user_id = p_user_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lock not found or already unlocked';
  END IF;

  IF v_lock.unlock_at > now() THEN
    RAISE EXCEPTION 'Lock period has not expired yet. Unlocks at: %', v_lock.unlock_at;
  END IF;

  UPDATE custodial_wallets
  SET balance = balance + v_lock.tyt_amount,
      locked_balance = locked_balance - v_lock.tyt_amount
  WHERE user_id = p_user_id AND asset = 'TYT';

  UPDATE ve_tyt_locks
  SET status = 'withdrawn',
      updated_at = now()
  WHERE id = p_lock_id;

  INSERT INTO ledger_entries (
    user_id,
    asset,
    operation_type,
    amount,
    description
  ) VALUES (
    p_user_id,
    'TYT',
    'unlock',
    v_lock.tyt_amount,
    format('Unlocked %s TYT from veTYT lock', v_lock.tyt_amount)
  );

  RETURN true;
END;
$$;

-- Create a new governance proposal
CREATE OR REPLACE FUNCTION create_proposal(
  p_user_id uuid,
  p_title text,
  p_description text,
  p_proposal_type proposal_type,
  p_voting_duration_days integer DEFAULT 7,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_proposal_id uuid;
  v_proposal_number integer;
  v_user_voting_power numeric;
  v_min_power_required constant numeric := 10000;
BEGIN
  v_user_voting_power := get_user_voting_power(p_user_id);

  IF v_user_voting_power < v_min_power_required THEN
    RAISE EXCEPTION 'Insufficient voting power. Required: %, You have: %',
      v_min_power_required, v_user_voting_power;
  END IF;

  SELECT COALESCE(MAX(proposal_number), 0) + 1
  INTO v_proposal_number
  FROM governance_proposals;

  INSERT INTO governance_proposals (
    proposal_number,
    title,
    description,
    proposal_type,
    proposed_by,
    start_time,
    end_time,
    status,
    metadata
  ) VALUES (
    v_proposal_number,
    p_title,
    p_description,
    p_proposal_type,
    p_user_id,
    now(),
    now() + (p_voting_duration_days || ' days')::interval,
    'active',
    p_metadata
  )
  RETURNING id INTO v_proposal_id;

  RETURN v_proposal_id;
END;
$$;

-- Cast a vote on a proposal
CREATE OR REPLACE FUNCTION cast_vote(
  p_user_id uuid,
  p_proposal_id uuid,
  p_vote_for boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_proposal RECORD;
  v_voting_power numeric;
  v_already_voted boolean;
BEGIN
  SELECT * INTO v_proposal
  FROM governance_proposals
  WHERE id = p_proposal_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposal not found or voting has ended';
  END IF;

  IF now() > v_proposal.end_time THEN
    RAISE EXCEPTION 'Voting period has ended';
  END IF;

  IF now() < v_proposal.start_time THEN
    RAISE EXCEPTION 'Voting has not started yet';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM governance_votes
    WHERE proposal_id = p_proposal_id AND user_id = p_user_id
  ) INTO v_already_voted;

  IF v_already_voted THEN
    RAISE EXCEPTION 'You have already voted on this proposal';
  END IF;

  v_voting_power := get_user_voting_power(p_user_id);

  IF v_voting_power <= 0 THEN
    RAISE EXCEPTION 'No voting power. Lock TYT to gain voting power';
  END IF;

  INSERT INTO governance_votes (
    proposal_id,
    user_id,
    voting_power,
    vote
  ) VALUES (
    p_proposal_id,
    p_user_id,
    v_voting_power,
    p_vote_for
  );

  IF p_vote_for THEN
    UPDATE governance_proposals
    SET votes_for = votes_for + v_voting_power,
        unique_voters_count = unique_voters_count + 1
    WHERE id = p_proposal_id;
  ELSE
    UPDATE governance_proposals
    SET votes_against = votes_against + v_voting_power,
        unique_voters_count = unique_voters_count + 1
    WHERE id = p_proposal_id;
  END IF;

  RETURN true;
END;
$$;

-- Finalize a proposal after voting period ends
CREATE OR REPLACE FUNCTION finalize_proposal(p_proposal_id uuid)
RETURNS proposal_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_proposal RECORD;
  v_new_status proposal_status;
  v_total_votes numeric;
BEGIN
  SELECT * INTO v_proposal
  FROM governance_proposals
  WHERE id = p_proposal_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proposal not found or already finalized';
  END IF;

  IF now() < v_proposal.end_time THEN
    RAISE EXCEPTION 'Voting period has not ended yet';
  END IF;

  v_total_votes := v_proposal.votes_for + v_proposal.votes_against;

  IF v_total_votes < v_proposal.quorum_required THEN
    v_new_status := 'rejected';
  ELSIF v_proposal.votes_for > v_proposal.votes_against THEN
    v_new_status := 'passed';
  ELSE
    v_new_status := 'rejected';
  END IF;

  UPDATE governance_proposals
  SET status = v_new_status
  WHERE id = p_proposal_id;

  RETURN v_new_status;
END;
$$;