/*
  # Fix Trigger Functions Missing SECURITY DEFINER

  1. Problem
    - Several trigger functions are missing SECURITY DEFINER
    - Functions run with caller's privileges, not elevated privileges
    - This causes RLS violations during signup and login
    - Results in "Database error granting user" error

  2. Affected Functions
    - create_academy_stats_for_new_user
    - create_donation_settings_for_new_user
    - update_user_vip_level
    - update_updated_at_column

  3. Solution
    - Add SECURITY DEFINER to all trigger functions
    - Ensure proper search_path for security

  4. Impact
    - Users can now sign up and log in without database errors
    - Triggers execute with proper elevated permissions
*/

-- Fix create_academy_stats_for_new_user
CREATE OR REPLACE FUNCTION public.create_academy_stats_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_academy_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create academy stats for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Fix create_donation_settings_for_new_user
CREATE OR REPLACE FUNCTION public.create_donation_settings_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_donation_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create donation settings for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Fix update_user_vip_level
CREATE OR REPLACE FUNCTION public.update_user_vip_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_new_vip_level text;
BEGIN
  -- Determine VIP level based on hashrate
  IF NEW.total_hashrate >= 10000 THEN
    v_new_vip_level := 'diamond';
  ELSIF NEW.total_hashrate >= 5000 THEN
    v_new_vip_level := 'platinum';
  ELSIF NEW.total_hashrate >= 2000 THEN
    v_new_vip_level := 'gold';
  ELSIF NEW.total_hashrate >= 500 THEN
    v_new_vip_level := 'silver';
  ELSIF NEW.total_hashrate >= 100 THEN
    v_new_vip_level := 'bronze';
  ELSE
    v_new_vip_level := 'none';
  END IF;

  -- Update VIP level if changed
  IF NEW.vip_level IS DISTINCT FROM v_new_vip_level THEN
    NEW.vip_level := v_new_vip_level;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to update VIP level for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Add comments
COMMENT ON FUNCTION public.create_academy_stats_for_new_user() IS
'Creates academy stats for new users. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION public.create_donation_settings_for_new_user() IS
'Creates donation settings for new users. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION public.update_user_vip_level() IS
'Updates user VIP level based on total hashrate. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION public.update_updated_at_column() IS
'Updates updated_at timestamp on row changes. Uses SECURITY DEFINER to bypass RLS.';