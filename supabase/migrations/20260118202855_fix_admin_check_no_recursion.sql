/*
  # Fix Admin Check Without RLS Recursion
  
  ## Problem
  Policy "Admins can view all profiles" creates infinite recursion:
  - Admin tries to SELECT from profiles
  - RLS checks if user is admin by querying profiles
  - This SELECT triggers RLS again
  - Infinite loop
  
  ## Solution
  Create a SECURITY DEFINER function that bypasses RLS to check admin status.
  Use this function in RLS policies to avoid recursion.
  
  ## Changes
  - Create is_current_user_admin() helper function
  - Drop recursive admin policies
  - Create new admin policies using the helper function
*/

-- Create helper function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Create new non-recursive admin policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_current_user_admin());

CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_current_user_admin())
  WITH CHECK (is_current_user_admin());
