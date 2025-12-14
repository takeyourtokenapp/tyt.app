/*
  # Fix Auto Profile Creation on Signup

  ## Problem
  When users sign up via supabase.auth.signUp(), a record is created in auth.users
  but NO corresponding record is created in profiles table. This causes RLS policies
  to fail and results in "Database error" messages.

  ## Solution
  Create a trigger function that automatically creates a profile record in the profiles
  table whenever a new user is created in auth.users.

  ## Changes
  1. Create handle_new_user() function
  2. Add trigger on auth.users INSERT
  3. Ensure profile is created with email from auth.users
  4. Automatically create custodial wallets via existing trigger

  ## Security
  - Function runs with SECURITY DEFINER to bypass RLS
  - Only creates profile, doesn't expose sensitive data
  - Existing RLS policies remain active
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.custodial_wallets TO authenticated;

-- Add policy to allow profile creation (needed for the trigger)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure service_role can insert profiles (for the trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);
