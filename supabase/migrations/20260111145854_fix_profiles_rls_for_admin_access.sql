/*
  # Fix Profiles RLS for Admin Access

  Replace the complex email-based policy with a simpler auth.uid() based policy.
  This ensures users can always read their own profile data, including is_admin field.
*/

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new simpler SELECT policy using auth.uid()
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Ensure is_admin column exists and has correct value
-- (No action needed, just documenting that is_admin should be readable)