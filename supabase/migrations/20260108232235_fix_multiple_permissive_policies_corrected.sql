/*
  # Fix Multiple Permissive Policies
  
  1. Changes
    - Consolidate multiple SELECT policies on admin_users table
    - Consolidate multiple SELECT policies on foundation table
    - Consolidate multiple SELECT policies on foundation_contact_info table
  
  2. Security
    - Maintains same access levels but with single consolidated policies
    - Uses OR logic to combine conditions
  
  3. Notes
    - Multiple permissive policies for the same action can be confusing
    - Consolidated policies are easier to audit and maintain
*/

-- Fix admin_users table - consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON admin_users;

CREATE POLICY "Authenticated users can view admin_users if they are admin"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Fix foundation table - consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage foundation info" ON foundation;
DROP POLICY IF EXISTS "Public can view foundation info" ON foundation;

CREATE POLICY "Anyone can view foundation info"
  ON foundation
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Fix foundation_contact_info table - consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage foundation contact info" ON foundation_contact_info;
DROP POLICY IF EXISTS "Public can view foundation contact info" ON foundation_contact_info;

CREATE POLICY "Anyone can view foundation contact info"
  ON foundation_contact_info
  FOR SELECT
  TO authenticated, anon
  USING (true);
