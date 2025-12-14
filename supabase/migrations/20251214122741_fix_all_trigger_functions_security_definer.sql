/*
  # Fix All Trigger Functions - Add SECURITY DEFINER

  ## Problem
  Trigger functions don't have SECURITY DEFINER, so they run with the
  privileges of the current user (anon during signup), not with elevated
  privileges needed to bypass RLS.

  ## Solution
  Add SECURITY DEFINER to all trigger functions used during signup.

  ## Changes
  - Update all trigger functions to use SECURITY DEFINER
  - This allows them to bypass RLS policies during execution
*/

-- 1. Fix handle_new_user (already has it but recreating to be sure)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
$$;

-- 2. Fix create_user_wallets
CREATE OR REPLACE FUNCTION public.create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO custodial_wallets (user_id, currency, balance)
  VALUES 
    (NEW.id, 'BTC', 0),
    (NEW.id, 'TYT', 0),
    (NEW.id, 'USDT', 0),
    (NEW.id, 'TRX', 0)
  ON CONFLICT (user_id, currency) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 3. Fix create_user_discounts_record
CREATE OR REPLACE FUNCTION public.create_user_discounts_record()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_discounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 4. Fix create_academy_stats_for_new_user
CREATE OR REPLACE FUNCTION public.create_academy_stats_for_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_academy_stats (user_id, total_xp, current_rank_level, last_activity_at)
  VALUES (NEW.id, 0, 1, now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 5. Fix create_donation_settings_for_new_user
CREATE OR REPLACE FUNCTION public.create_donation_settings_for_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_donation_settings (user_id, auto_roundup_enabled, roundup_percentage)
  VALUES (NEW.id, false, 0.5)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_user_wallets() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_user_discounts_record() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_academy_stats_for_new_user() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_donation_settings_for_new_user() TO postgres, anon, authenticated, service_role;
