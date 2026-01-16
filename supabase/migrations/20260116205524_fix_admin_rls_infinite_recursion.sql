/*
  # Fix Admin RLS Infinite Recursion

  ## Problem
  The "Admins can view all profiles" policy causes infinite recursion
  because it checks profiles.is_admin from within a profiles SELECT policy.

  ## Solution
  Create a function that uses SECURITY DEFINER to bypass RLS,
  then use it in the policy.

  ## Changes
  - Drop problematic policy
  - Create is_admin_user() function
  - Create new admin policy using the function
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create function to check if user is admin (bypasses RLS with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id LIMIT 1),
    false
  );
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid) TO authenticated;

-- Create new admin policy using the function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));
