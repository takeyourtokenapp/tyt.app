/*
  # Admin Statistics Functions
  
  ## Problem
  Admin dashboard can only see their own profile due to RLS.
  Need functions that bypass RLS for admin statistics.
  
  ## Solution
  Create SECURITY DEFINER functions that:
  1. Check if caller is admin
  2. Return aggregated stats without exposing individual user data
  
  ## Security
  - Functions check is_admin before returning data
  - Only aggregated/anonymous data returned
  - No PII exposed
*/

-- Function to get total users count (admin only)
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
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Return user counts
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM profiles 
     WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as new_users_7d,
    (SELECT COUNT(*) FROM profiles 
     WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as new_users_30d;
END;
$$;

-- Function to get miners statistics (admin only)
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
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Return miners stats
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM nft_miners)::bigint as total_miners,
    (SELECT COALESCE(SUM(hashrate), 0) FROM nft_miners)::numeric as total_hashrate,
    (SELECT COUNT(*) FROM nft_miners 
     WHERE status = 'active')::bigint as active_miners;
END;
$$;

-- Function to get foundation statistics (admin only)
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
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Return foundation stats
  RETURN QUERY
  SELECT 
    (SELECT COALESCE(SUM(amount_usd), 0) FROM foundation_donations)::numeric as total_donations,
    (SELECT COUNT(*) FROM foundation_donations)::bigint as donations_count,
    (SELECT COALESCE(SUM(amount_usd), 0) FROM foundation_donations 
     WHERE created_at >= NOW() - INTERVAL '7 days')::numeric as recent_donations_7d;
END;
$$;

-- Function to get messages statistics (admin only)
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
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Return messages stats
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM contact_messages)::bigint as total_messages,
    (SELECT COUNT(*) FROM contact_messages WHERE is_read = false)::bigint as unread_messages,
    (SELECT COUNT(*) FROM contact_messages 
     WHERE priority = 'urgent' AND is_read = false)::bigint as urgent_messages;
END;
$$;

-- Grant execute permissions to authenticated users (functions do their own auth check)
GRANT EXECUTE ON FUNCTION get_admin_users_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_miners_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_foundation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_messages_stats() TO authenticated;
