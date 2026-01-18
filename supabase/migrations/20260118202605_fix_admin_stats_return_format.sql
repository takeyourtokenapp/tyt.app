/*
  # Fix Admin Stats Functions Return Format
  
  ## Problem
  Admin dashboard shows 0 users even though database has 4 users.
  RPC functions return TABLE type, but frontend expects array format.
  
  ## Solution
  1. Keep existing functions as-is (they work correctly)
  2. Add debug function to test admin check
  3. Ensure frontend handles response correctly
  
  ## Changes
  - Add test function to verify admin access works
*/

-- Test function to verify admin check works
CREATE OR REPLACE FUNCTION test_admin_access()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_is_admin boolean;
  v_total_users bigint;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Check if admin
  SELECT is_admin INTO v_is_admin
  FROM profiles 
  WHERE id = v_user_id;
  
  -- Count users
  SELECT COUNT(*) INTO v_total_users FROM profiles;
  
  -- Return debug info
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'is_admin', COALESCE(v_is_admin, false),
    'total_users', v_total_users,
    'can_access', (v_is_admin = true)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION test_admin_access() TO authenticated;
