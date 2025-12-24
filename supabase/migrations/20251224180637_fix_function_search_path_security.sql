/*
  # Fix Function Search Path Security

  Sets explicit search_path on functions to prevent search_path injection attacks.
  Functions with role mutable search_path are vulnerable.

  Affected functions:
  - log_cron_execution
  - calculate_deposit_fees_v3
  - cleanup_old_cron_logs
  - get_app_setting
  - determine_rank
*/

-- ============================================
-- FUNCTION: log_cron_execution
-- ============================================

CREATE OR REPLACE FUNCTION log_cron_execution(
  p_job_name text,
  p_status text,
  p_rows_affected integer DEFAULT NULL,
  p_error_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO cron_job_logs (job_name, status, rows_affected, error_message)
  VALUES (p_job_name, p_status, p_rows_affected, p_error_message)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- ============================================
-- FUNCTION: calculate_deposit_fees_v3
-- ============================================

CREATE OR REPLACE FUNCTION calculate_deposit_fees_v3(
  p_user_id uuid,
  p_amount numeric,
  p_currency text
)
RETURNS TABLE (
  base_fee_percent numeric,
  dynamic_fee_percent numeric,
  total_fee_percent numeric,
  fee_amount numeric,
  net_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_base_fee numeric := 0.01; -- 1% base fee
  v_dynamic_fee numeric := 0;
  v_total_fee numeric;
  v_fee_amount numeric;
  v_net_amount numeric;
BEGIN
  -- Calculate dynamic fee based on VIP level, etc.
  v_total_fee := v_base_fee + v_dynamic_fee;
  v_fee_amount := p_amount * v_total_fee;
  v_net_amount := p_amount - v_fee_amount;
  
  RETURN QUERY SELECT 
    v_base_fee,
    v_dynamic_fee,
    v_total_fee,
    v_fee_amount,
    v_net_amount;
END;
$$;

-- ============================================
-- FUNCTION: cleanup_old_cron_logs
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_cron_logs(p_days_to_keep integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM cron_job_logs
  WHERE started_at < NOW() - (p_days_to_keep || ' days')::interval;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- ============================================
-- FUNCTION: get_app_setting
-- ============================================

CREATE OR REPLACE FUNCTION get_app_setting(p_key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_value text;
BEGIN
  SELECT value INTO v_value
  FROM app_settings
  WHERE key = p_key;
  
  RETURN v_value;
END;
$$;

-- ============================================
-- FUNCTION: determine_rank
-- ============================================

CREATE OR REPLACE FUNCTION determine_rank(p_xp numeric)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_xp >= 100000 THEN
    RETURN 'Warrior';
  ELSIF p_xp >= 50000 THEN
    RETURN 'Peacekeeper';
  ELSIF p_xp >= 20000 THEN
    RETURN 'Diplomat';
  ELSIF p_xp >= 5000 THEN
    RETURN 'Academic';
  ELSE
    RETURN 'Worker';
  END IF;
END;
$$;