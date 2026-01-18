/*
  # Update Admin Functions to Use Helper
  
  ## Problem
  Admin stats functions still do manual admin check.
  Should use the new is_current_user_admin() helper.
  
  ## Solution
  Update all admin functions to use is_current_user_admin().
  
  ## Changes
  - Simplify admin check in all 4 functions
*/

-- Update get_admin_users_count
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
BEGIN
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as new_users_7d,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as new_users_30d
  FROM profiles;
END;
$$;

-- Update get_admin_miners_stats
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
BEGIN
  IF NOT is_current_user_admin() THEN
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

-- Update get_admin_foundation_stats
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
BEGIN
  IF NOT is_current_user_admin() THEN
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

-- Update get_admin_messages_stats
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
BEGIN
  IF NOT is_current_user_admin() THEN
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

GRANT EXECUTE ON FUNCTION get_admin_users_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_miners_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_foundation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_messages_stats() TO authenticated;
