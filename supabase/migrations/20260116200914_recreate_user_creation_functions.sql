/*
  # Recreate User Creation Functions

  ## Changes
  - Drop and recreate functions with correct signatures
  - Fix return types
  - Simplify user creation process
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS public.list_recent_users();
DROP FUNCTION IF EXISTS public.create_test_user(text, text, text);

-- Create function to manually create a user
CREATE FUNCTION public.create_test_user(
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
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User with this email already exists'
    );
  END IF;
  
  -- Generate new user ID
  new_user_id := gen_random_uuid();
  
  -- Hash password using bcrypt
  encrypted_pw := crypt(p_password, gen_salt('bf'));
  
  -- Generate username
  final_username := COALESCE(p_username, split_part(p_email, '@', 1));
  
  -- Ensure username is unique
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := split_part(p_email, '@', 1) || floor(random() * 10000)::text;
  END LOOP;
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    p_email,
    encrypted_pw,
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object('username', final_username),
    NOW(),
    NOW()
  );
  
  -- Wait a moment for trigger to fire
  PERFORM pg_sleep(0.1);
  
  -- Verify profile was created
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id) THEN
    -- Create profile manually if trigger failed
    INSERT INTO public.profiles (id, email, username, created_at)
    VALUES (new_user_id, p_email, final_username, NOW());
  END IF;
  
  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', p_email,
    'username', final_username,
    'message', 'User created successfully. Login at /login'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to list users
CREATE FUNCTION public.list_recent_users()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'username', p.username,
      'email_confirmed', (u.email_confirmed_at IS NOT NULL),
      'has_profile', (p.id IS NOT NULL),
      'created_at', u.created_at
    )
  ) INTO result
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC
  LIMIT 10;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_test_user(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_recent_users() TO authenticated, service_role, anon;
