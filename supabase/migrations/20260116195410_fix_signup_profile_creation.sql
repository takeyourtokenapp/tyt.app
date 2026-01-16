/*
  # Fix Signup Profile Creation

  ## Problem
  Users cannot sign up because:
  1. handle_new_user() function doesn't create username field
  2. Missing RLS policies for profile INSERT
  3. Service role doesn't have bypass permissions

  ## Solution
  1. Update handle_new_user() to include username
  2. Add RLS policies for profile creation
  3. Grant service_role full access to bypass RLS

  ## Changes
  - Update handle_new_user() function with username support
  - Add INSERT policy for authenticated users
  - Add full access policy for service_role
  - Ensure trigger can create profiles during signup
*/

-- Update handle_new_user function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow service role all access" ON profiles;
DROP POLICY IF EXISTS "Block direct anon inserts" ON profiles;

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow service_role to bypass all RLS (for triggers)
CREATE POLICY "Service role has full access"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Block anonymous users from direct inserts
CREATE POLICY "Anonymous users cannot insert profiles"
  ON profiles FOR INSERT
  TO anon
  WITH CHECK (false);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT INSERT, SELECT, UPDATE ON public.profiles TO authenticated;
