/*
  # Fix profiles RLS for admin check

  1. Changes
    - Update SELECT policy to allow reading own profile by email
    - This fixes admin panel access when profile.id != auth.user.id
*/

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- Create new policy that works with email
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Can view own profile by matching email
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- Can view profiles of users they referred
    id IN (
      SELECT referred_by 
      FROM profiles 
      WHERE id = (SELECT id FROM profiles WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
      AND referred_by IS NOT NULL
    )
  );
