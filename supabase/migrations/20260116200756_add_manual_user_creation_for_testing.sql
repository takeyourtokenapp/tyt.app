/*
  # Manual User Creation for Testing

  ## Purpose
  Create a function to manually create users for testing
  when Supabase Auth email confirmation is blocking signups

  ## Security
  This is a TEMPORARY solution for development only
  Should be removed in production
*/

-- Function to manually create a user with profile
CREATE OR REPLACE FUNCTION public.create_test_user(
  p_email text,
  p_password text,
  p_username text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
  final_username text;
  result jsonb;
BEGIN
  -- Generate new user ID
  new_user_id := gen_random_uuid();
  
  -- Hash password
  encrypted_pw := crypt(p_password, gen_salt('bf'));
  
  -- Generate username
  final_username := COALESCE(p_username, split_part(p_email, '@', 1));
  
  -- Ensure username is unique
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := final_username || floor(random() * 10000)::text;
  END IF;
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    p_email,
    encrypted_pw,
    NOW(), -- Auto-confirm email
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object('username', final_username),
    NOW(),
    NOW(),
    '', -- Empty confirmation token (already confirmed)
    ''  -- Empty recovery token
  );
  
  -- Create profile (trigger should handle this, but we'll do it manually to be sure)
  INSERT INTO public.profiles (id, email, username, created_at)
  VALUES (new_user_id, p_email, final_username, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- Build result
  result := jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', p_email,
    'username', final_username,
    'message', 'User created successfully. You can now login with email and password.'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User with this email already exists'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service_role only (not to public for security)
GRANT EXECUTE ON FUNCTION public.create_test_user(text, text, text) TO service_role;

-- Function to list recent users for debugging
CREATE OR REPLACE FUNCTION public.list_recent_users()
RETURNS TABLE (
  id uuid,
  email text,
  username text,
  email_confirmed boolean,
  has_profile boolean,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    p.username,
    (u.email_confirmed_at IS NOT NULL) as email_confirmed,
    (p.id IS NOT NULL) as has_profile,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.list_recent_users() TO authenticated, service_role;
