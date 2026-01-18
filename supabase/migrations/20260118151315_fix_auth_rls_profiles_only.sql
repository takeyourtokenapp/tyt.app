/*
  # Fix Auth RLS Performance - Profiles Only

  1. Performance Optimizations
    - Wrap auth.uid() with SELECT for profiles policies only
    - Other tables already fixed in previous migration

  2. Tables Updated
    - profiles (admin check and insert policies)
*/

-- profiles: Fix "Admins can view all profiles" policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.is_admin = true
    )
  );

-- profiles: Fix "Users can insert own profile" policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));
