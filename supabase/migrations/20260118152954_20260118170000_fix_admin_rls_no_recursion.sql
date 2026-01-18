/*
  # Fix Admin RLS - Remove Recursion
  
  ## Problem
  The "Admins can view all profiles" policy creates infinite recursion:
  - To check if user is admin, it queries profiles table
  - Which triggers RLS check again
  - Which queries profiles table again...
  
  ## Solution
  Remove the recursive admin policy and keep only the basic one.
  Admins will still be able to read their own profile (which contains is_admin field).
  Frontend can check is_admin from user's own profile.
  
  ## Changes
  1. Drop recursive admin policy
  2. Keep simple "view own profile" policy
  3. Admins check their own profile's is_admin field
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- The existing "Users can view own profile" policy is sufficient
-- Admins will read their own profile to check is_admin flag
-- No recursion, no issues

-- Verify we still have the basic policy
DO $$
BEGIN
  -- This policy should already exist, but let's make sure
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;
