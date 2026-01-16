/*
  # Add Signup Diagnostics

  ## Purpose
  Add detailed logging to diagnose signup issues

  ## Changes
  - Create diagnostic function to test signup flow
  - Add logging table for debugging
  - Enhance handle_new_user with detailed logging
*/

-- Create a simple log table for diagnostics
CREATE TABLE IF NOT EXISTS public.signup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  step text,
  message text,
  error text,
  created_at timestamptz DEFAULT NOW()
);

-- Enable RLS on logs
ALTER TABLE public.signup_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to logs
CREATE POLICY "Service role can manage logs"
  ON public.signup_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update handle_new_user with detailed logging
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
  log_id uuid;
BEGIN
  -- Log: Function triggered
  INSERT INTO public.signup_logs (user_id, email, step, message)
  VALUES (NEW.id, NEW.email, 'trigger_start', 'handle_new_user triggered')
  RETURNING id INTO log_id;
  
  -- Get base username from metadata or email
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  INSERT INTO public.signup_logs (user_id, email, step, message)
  VALUES (NEW.id, NEW.email, 'username_generated', 'Base username: ' || base_username);
  
  -- Start with base username
  final_username := base_username;
  
  -- Keep trying until we find a unique username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
    
    IF counter > 100 THEN
      final_username := base_username || substring(md5(random()::text) from 1 for 6);
      EXIT;
    END IF;
  END LOOP;
  
  INSERT INTO public.signup_logs (user_id, email, step, message)
  VALUES (NEW.id, NEW.email, 'username_finalized', 'Final username: ' || final_username);
  
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
  
  INSERT INTO public.signup_logs (user_id, email, step, message)
  VALUES (NEW.id, NEW.email, 'profile_created', 'Profile created successfully');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    INSERT INTO public.signup_logs (user_id, email, step, error)
    VALUES (NEW.id, NEW.email, 'error', SQLERRM);
    
    -- Return NEW anyway to not block auth.users insert
    RETURN NEW;
END;
$$;

-- Create diagnostic function
CREATE OR REPLACE FUNCTION public.diagnose_signup_issue()
RETURNS TABLE (
  check_name text,
  status text,
  details text
) AS $$
BEGIN
  -- Check 1: Trigger exists
  RETURN QUERY
  SELECT 
    'Trigger exists'::text,
    CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'MISSING' END::text,
    COUNT(*)::text || ' triggers found'::text
  FROM pg_trigger
  WHERE tgname = 'on_auth_user_created';
  
  -- Check 2: Function exists
  RETURN QUERY
  SELECT 
    'Function exists'::text,
    CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'MISSING' END::text,
    'handle_new_user function'::text
  FROM pg_proc
  WHERE proname = 'handle_new_user';
  
  -- Check 3: RLS policies
  RETURN QUERY
  SELECT 
    'RLS policies'::text,
    'OK'::text,
    COUNT(*)::text || ' policies on profiles'::text
  FROM pg_policies
  WHERE tablename = 'profiles';
  
  -- Check 4: Recent signup attempts
  RETURN QUERY
  SELECT 
    'Recent signups'::text,
    'INFO'::text,
    COUNT(*)::text || ' users in last 24h'::text
  FROM auth.users
  WHERE created_at > NOW() - INTERVAL '24 hours';
  
  -- Check 5: Orphan users
  RETURN QUERY
  SELECT 
    'Orphan users'::text,
    CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'WARNING' END::text,
    COUNT(*)::text || ' users without profiles'::text
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.diagnose_signup_issue() TO authenticated, anon;
