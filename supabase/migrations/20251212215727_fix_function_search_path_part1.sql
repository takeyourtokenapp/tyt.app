/*
  # Fix Function Search Path Issues (Part 1)

  ## Problem
  Functions with role-mutable search_path can be exploited via search_path injection attacks.
  
  ## Solution
  Add `SET search_path = public` to all functions to make them secure.

  ## Functions Fixed (Part 1)
  - Community functions
  - Wallet ledger functions
  - Burn and TYT functions
  - Discount and fee calculation functions
*/

-- Community functions
CREATE OR REPLACE FUNCTION public.cleanup_old_community_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.community_messages
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_online_status(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.community_online_users (user_id, last_seen)
  VALUES (p_user_id, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET last_seen = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_online_users_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM public.community_online_users
  WHERE last_seen > NOW() - INTERVAL '5 minutes';
  
  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_leaderboard_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  TRUNCATE public.community_leaderboard_cache;
  
  INSERT INTO public.community_leaderboard_cache (
    user_id,
    username,
    total_hashrate,
    total_rewards_btc,
    total_xp,
    rank_hashrate,
    rank_rewards,
    rank_xp
  )
  SELECT 
    p.id,
    p.username,
    p.total_hashrate,
    COALESCE(SUM(dr.amount), 0) as total_rewards,
    COALESCE(uas.total_xp, 0) as total_xp,
    ROW_NUMBER() OVER (ORDER BY p.total_hashrate DESC) as rank_hashrate,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(dr.amount), 0) DESC) as rank_rewards,
    ROW_NUMBER() OVER (ORDER BY COALESCE(uas.total_xp, 0) DESC) as rank_xp
  FROM public.profiles p
  LEFT JOIN public.daily_rewards dr ON dr.user_id = p.id
  LEFT JOIN public.user_academy_stats uas ON uas.user_id = p.id
  GROUP BY p.id, p.username, p.total_hashrate, uas.total_xp;
END;
$$;

-- Wallet ledger functions
CREATE OR REPLACE FUNCTION public.get_or_create_wallet_account(
  p_user_id uuid,
  p_account_type text,
  p_currency text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id uuid;
BEGIN
  SELECT id INTO v_account_id
  FROM public.wallet_accounts
  WHERE user_id = p_user_id
    AND account_type = p_account_type
    AND currency = p_currency;
    
  IF v_account_id IS NULL THEN
    INSERT INTO public.wallet_accounts (user_id, account_type, currency)
    VALUES (p_user_id, p_account_type, p_currency)
    RETURNING id INTO v_account_id;
  END IF;
  
  RETURN v_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_ledger_entry(
  p_batch_id uuid,
  p_account_id uuid,
  p_debit numeric,
  p_credit numeric,
  p_reference_type text,
  p_reference_id uuid,
  p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry_id uuid;
BEGIN
  INSERT INTO public.ledger_entries (
    batch_id,
    account_id,
    debit,
    credit,
    reference_type,
    reference_id,
    description
  )
  VALUES (
    p_batch_id,
    p_account_id,
    p_debit,
    p_credit,
    p_reference_type,
    p_reference_id,
    p_description
  )
  RETURNING id INTO v_entry_id;
  
  RETURN v_entry_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.credit_account(
  p_user_id uuid,
  p_account_type text,
  p_currency text,
  p_amount numeric,
  p_reference_type text,
  p_reference_id uuid,
  p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id uuid;
  v_batch_id uuid;
  v_entry_id uuid;
BEGIN
  v_account_id := public.get_or_create_wallet_account(p_user_id, p_account_type, p_currency);
  v_batch_id := gen_random_uuid();
  
  v_entry_id := public.create_ledger_entry(
    v_batch_id,
    v_account_id,
    0,
    p_amount,
    p_reference_type,
    p_reference_id,
    p_description
  );
  
  RETURN v_entry_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_tyt_burn(
  p_user_id uuid,
  p_amount numeric,
  p_source text,
  p_reference_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_burn_id uuid;
BEGIN
  INSERT INTO public.token_burn_events (
    user_id,
    amount,
    source,
    reference_id,
    status
  )
  VALUES (
    p_user_id,
    p_amount,
    p_source,
    p_reference_id,
    'completed'
  )
  RETURNING id INTO v_burn_id;
  
  RETURN v_burn_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.credit_user_tyt(
  p_user_id uuid,
  p_amount numeric,
  p_reference_type text,
  p_reference_id uuid,
  p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.credit_account(
    p_user_id,
    'user',
    'TYT',
    p_amount,
    p_reference_type,
    p_reference_id,
    p_description
  );
END;
$$;