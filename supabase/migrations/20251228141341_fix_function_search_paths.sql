/*
  # Fix Function Search Paths

  1. Issue
    - Functions have role mutable search_path
    - This is a security risk as it can be exploited

  2. Functions Fixed
    - log_aoi_activity
    - calculate_aoi_rank
    - update_aoi_rank

  3. Solution
    - Add explicit search_path setting to functions
    - Use SECURITY DEFINER safely with fixed search_path
*/

-- Fix log_aoi_activity
CREATE OR REPLACE FUNCTION public.log_aoi_activity(
  p_user_id uuid,
  p_activity_type text,
  p_domain text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_activity_id uuid;
BEGIN
  INSERT INTO aoi_activity_log (
    user_id,
    activity_type,
    domain,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_domain,
    p_metadata
  ) RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
END;
$$;

-- Fix calculate_aoi_rank
CREATE OR REPLACE FUNCTION public.calculate_aoi_rank(p_total_xp integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_total_xp >= 50000 THEN
    RETURN 'warrior';
  ELSIF p_total_xp >= 25000 THEN
    RETURN 'peacekeeper';
  ELSIF p_total_xp >= 10000 THEN
    RETURN 'diplomat';
  ELSIF p_total_xp >= 5000 THEN
    RETURN 'academic';
  ELSE
    RETURN 'worker';
  END IF;
END;
$$;

-- Fix update_aoi_rank
CREATE OR REPLACE FUNCTION public.update_aoi_rank()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_new_rank text;
BEGIN
  v_new_rank := calculate_aoi_rank(NEW.total_xp);
  
  IF v_new_rank != NEW.current_rank THEN
    NEW.current_rank := v_new_rank;
    NEW.rank_updated_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;