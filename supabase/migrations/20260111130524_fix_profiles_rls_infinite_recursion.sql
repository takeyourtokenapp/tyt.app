/*
  # Fix infinite recursion in profiles RLS policy

  1. Changes
    - Remove recursive subquery that causes infinite loop
    - Simplify policy to only check email match
    - This allows useAdminCheck to read is_admin field
*/

-- Drop problematic policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create simple, non-recursive policy
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Simply check if the profile's email matches the authenticated user's email
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
