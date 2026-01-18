/*
  # Fix Function Search Paths - Corrected

  1. Security Enhancement
    - Set immutable search_path for diagnostic functions
    - Preserves original parameter names

  2. Functions Fixed
    - diagnose_signup_issue
    - is_admin_user
    - list_recent_users
    - create_test_user (drop and recreate with correct signature)
*/

-- Drop existing create_test_user to avoid parameter name conflict
DROP FUNCTION IF EXISTS create_test_user(text, text, text);

-- Recreate with corrected search_path
CREATE FUNCTION create_test_user(
  p_email text,
  p_password text,
  p_username text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  new_user_id uuid;
  final_username text;
BEGIN
  IF p_username IS NULL THEN
    final_username := split_part(p_email, '@', 1);
  ELSE
    final_username := p_username;
  END IF;

  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    gen_random_uuid(),
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false,
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  INSERT INTO public.profiles (
    id,
    username,
    email,
    created_at
  ) VALUES (
    new_user_id,
    final_username,
    p_email,
    now()
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', p_email,
    'username', final_username
  );
END;
$$;

-- Fix diagnose_signup_issue (no parameters currently)
DROP FUNCTION IF EXISTS diagnose_signup_issue();
CREATE FUNCTION diagnose_signup_issue()
RETURNS TABLE(
  email text,
  auth_exists boolean,
  profile_exists boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.email,
    true as auth_exists,
    EXISTS(SELECT 1 FROM profiles WHERE id = u.id) as profile_exists
  FROM auth.users u
  ORDER BY u.created_at DESC
  LIMIT 20;
END;
$$;

-- Fix is_admin_user
CREATE OR REPLACE FUNCTION is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT COALESCE(p.is_admin, false)
  INTO is_admin
  FROM public.profiles p
  WHERE p.id = user_id;

  RETURN COALESCE(is_admin, false);
END;
$$;

-- Fix list_recent_users (no parameters currently)
DROP FUNCTION IF EXISTS list_recent_users();
CREATE FUNCTION list_recent_users()
RETURNS TABLE (
  id uuid,
  email text,
  username text,
  created_at timestamptz,
  is_admin boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.username,
    p.created_at,
    COALESCE(p.is_admin, false) as is_admin
  FROM public.profiles p
  ORDER BY p.created_at DESC
  LIMIT 10;
END;
$$;
