/*
  # Fix Admin Functions to Bypass RLS Properly
  
  ## Problem
  Admin functions use SECURITY DEFINER but RLS still applies to internal queries.
  The check `SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true`
  is blocked by RLS policy "Users can view own profile".
  
  ## Solution
  Grant postgres role the ability to bypass RLS for these specific functions
  by using direct table access with proper security checks.
  
  ## Changes
  - Recreate admin functions with proper RLS bypass
  - Use direct COUNT queries without SELECT filtering
*/

-- Drop and recreate get_admin_users_count with RLS bypass
DROP FUNCTION IF EXISTS get_admin_users_count();

CREATE OR REPLACE FUNCTION get_admin_users_count()
RETURNS TABLE (
  total_users bigint,
  new_users_7d bigint,
  new_users_30d bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Check if caller is admin by querying with security definer privileges
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Return user counts using security definer privileges
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as new_users_7d,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as new_users_30d
  FROM profiles;
END;
$$;

-- Drop and recreate get_admin_miners_stats
DROP FUNCTION IF EXISTS get_admin_miners_stats();

CREATE OR REPLACE FUNCTION get_admin_miners_stats()
RETURNS TABLE (
  total_miners bigint,
  total_hashrate numeric,
  active_miners bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_miners,
    COALESCE(SUM(hashrate), 0)::numeric as total_hashrate,
    COUNT(*) FILTER (WHERE status = 'active')::bigint as active_miners
  FROM nft_miners;
END;
$$;

-- Drop and recreate get_admin_foundation_stats
DROP FUNCTION IF EXISTS get_admin_foundation_stats();

CREATE OR REPLACE FUNCTION get_admin_foundation_stats()
RETURNS TABLE (
  total_donations numeric,
  donations_count bigint,
  recent_donations_7d numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(amount_usd), 0)::numeric as total_donations,
    COUNT(*)::bigint as donations_count,
    COALESCE(SUM(amount_usd) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), 0)::numeric as recent_donations_7d
  FROM foundation_donations;
END;
$$;

-- Drop and recreate get_admin_messages_stats
DROP FUNCTION IF EXISTS get_admin_messages_stats();

CREATE OR REPLACE FUNCTION get_admin_messages_stats()
RETURNS TABLE (
  total_messages bigint,
  unread_messages bigint,
  urgent_messages bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_messages,
    COUNT(*) FILTER (WHERE is_read = false)::bigint as unread_messages,
    COUNT(*) FILTER (WHERE priority = 'urgent' AND is_read = false)::bigint as urgent_messages
  FROM contact_messages;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_admin_users_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_miners_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_foundation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_messages_stats() TO authenticated;
