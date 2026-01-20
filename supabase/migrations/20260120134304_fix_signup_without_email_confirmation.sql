/*
  # Fix Signup Without Email Confirmation

  1. Purpose
    - Allow users to sign up and create profiles without email confirmation
    - Remove dependency on email verification for profile creation
    - Fix "Database error saving new user" issue

  2. Changes
    - Update handle_new_user() to work without email confirmation
    - Add better error logging
    - Ensure profiles are created immediately on signup

  3. Configuration Note
    To fully disable email confirmation:
    1. Go to Supabase Dashboard > Authentication > Settings
    2. Under "User Signups", disable "Enable email confirmations"
    3. This allows immediate login after signup
*/

-- Recreate handle_new_user with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
DECLARE
  base_username text;
  final_username text;
  counter int := 0;
  max_attempts int := 100;
BEGIN
  -- Log the attempt
  RAISE LOG 'Creating profile for new user: % (email: %)', NEW.id, NEW.email;

  -- Get base username from metadata or email
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  -- Sanitize username: remove special chars, lowercase
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g'));

  -- Ensure username is not empty
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'user';
  END IF;

  -- Start with base username
  final_username := base_username;

  -- Keep trying until we find a unique username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;

    IF counter <= max_attempts THEN
      final_username := base_username || counter::text;
    ELSE
      -- Use random suffix after max attempts
      final_username := base_username || '_' || substring(md5(random()::text) from 1 for 8);
      EXIT;
    END IF;
  END LOOP;

  -- Insert profile with unique username
  INSERT INTO public.profiles (
    id,
    email,
    username,
    email_verified,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    CASE
      WHEN NEW.email_confirmed_at IS NOT NULL THEN true
      ELSE false
    END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    updated_at = NOW();

  RAISE LOG 'Successfully created profile for user: % with username: %', NEW.id, final_username;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle unique constraint violations specifically
    RAISE WARNING 'Unique constraint violation creating profile for user %: %', NEW.id, SQLERRM;
    -- Try one more time with a random username
    final_username := base_username || '_' || substring(md5(random()::text) from 1 for 8);
    INSERT INTO public.profiles (id, email, username, created_at)
    VALUES (NEW.id, NEW.email, final_username, NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth.users insert
    RAISE WARNING 'Failed to create profile for user % (email: %): % (SQLSTATE: %)',
      NEW.id, NEW.email, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists and is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify RLS policies allow profile creation
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
CREATE POLICY "Service role has full access"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure anon users cannot directly insert profiles
DROP POLICY IF EXISTS "Anonymous users cannot insert profiles" ON profiles;
CREATE POLICY "Anonymous users cannot insert profiles"
  ON profiles FOR INSERT
  TO anon
  WITH CHECK (false);

-- Allow authenticated users to insert their own profile (edge case)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions to service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Add comment with instructions
COMMENT ON FUNCTION public.handle_new_user() IS
'Creates user profile automatically on signup. Works with or without email confirmation enabled.';