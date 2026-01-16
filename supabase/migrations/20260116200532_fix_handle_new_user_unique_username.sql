/*
  # Fix handle_new_user to Handle Username Conflicts

  ## Problem
  The handle_new_user() function fails when username already exists
  because of UNIQUE constraint on profiles.username column.

  ## Solution
  Update function to generate unique username by appending random suffix
  if username already exists.

  ## Changes
  - Update handle_new_user() to handle username conflicts
  - Generate unique username with random suffix if needed
  - Add better error handling
*/

-- Drop and recreate the function with proper conflict handling
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
BEGIN
  -- Get base username from metadata or email
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  -- Start with base username
  final_username := base_username;
  
  -- Keep trying until we find a unique username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
    
    -- Safety: prevent infinite loop
    IF counter > 100 THEN
      final_username := base_username || substring(md5(random()::text) from 1 for 6);
      EXIT;
    END IF;
  END LOOP;
  
  -- Insert profile with unique username
  INSERT INTO public.profiles (id, email, username, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth.users insert
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify RLS policies are correct
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
CREATE POLICY "Service role has full access"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
