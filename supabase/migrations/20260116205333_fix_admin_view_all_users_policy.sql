/*
  # Fix Admin Access to View All Users

  ## Problem
  Admin dashboard shows only 1 user because RLS policy restricts
  users to see only their own profile, even for admins.

  ## Solution
  Add policy for admins to view all profiles

  ## Changes
  - Add "Admins can view all profiles" policy for SELECT
*/

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.is_admin = true
    )
  );
