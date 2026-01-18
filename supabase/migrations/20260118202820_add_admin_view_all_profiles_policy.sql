/*
  # Add Admin View All Profiles Policy
  
  ## Problem
  Admins can only see their own profile due to RLS.
  Admin functions need to verify is_admin flag but RLS blocks the query.
  
  ## Solution
  Add a new RLS policy that allows admins to view all profiles.
  This is safe because:
  1. Only users with is_admin=true can use it
  2. Follows principle of least privilege
  3. Required for admin dashboard functionality
  
  ## Changes
  - Add SELECT policy for admins to view all profiles
*/

-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles admin_check
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
      LIMIT 1
    )
  );

-- Add policy for admins to update any profile (for user management)
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM profiles admin_check
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM profiles admin_check
      WHERE admin_check.id = auth.uid() 
      AND admin_check.is_admin = true
      LIMIT 1
    )
  );
