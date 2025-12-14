/*
  # Fix Auth Configuration and Enable Public Signups

  ## Problem
  Users cannot sign up - no records are created in auth.users.
  This is likely due to auth settings requiring email confirmation or other restrictions.

  ## Solution
  1. Ensure the trigger function has proper permissions
  2. Add a function to test auth functionality
  3. Ensure RLS policies allow profile creation during signup
  4. Add anon role permissions where needed

  ## Changes
  - Grant permissions to anon role for signup
  - Ensure trigger has SECURITY DEFINER
  - Add debugging capabilities
*/

-- Ensure handle_new_user function has correct permissions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;

-- Grant necessary permissions to anon role (needed for signup)
GRANT USAGE ON SCHEMA public TO anon;

-- Ensure service role can always create profiles (used by trigger)
GRANT INSERT ON public.profiles TO service_role;
GRANT INSERT ON public.custodial_wallets TO service_role;

-- Add a policy to allow service role to bypass RLS during signup
DROP POLICY IF EXISTS "Allow service role all access" ON profiles;
CREATE POLICY "Allow service role all access"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure anon users can't directly insert into profiles
-- (profiles should only be created via the trigger)
DROP POLICY IF EXISTS "Block direct anon inserts" ON profiles;
CREATE POLICY "Block direct anon inserts"
  ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (false);

-- Create a test function to verify auth works
CREATE OR REPLACE FUNCTION public.test_profile_creation(test_user_id uuid, test_email text)
RETURNS boolean AS $$
DECLARE
  result boolean;
BEGIN
  -- Try to insert a test profile
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    test_user_id,
    test_email,
    split_part(test_email, '@', 1)
  );
  
  -- Check if it was created
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = test_user_id) INTO result;
  
  -- Clean up test data
  DELETE FROM public.profiles WHERE id = test_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on test function
GRANT EXECUTE ON FUNCTION public.test_profile_creation(uuid, text) TO authenticated;
