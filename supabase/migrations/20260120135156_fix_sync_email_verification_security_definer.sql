/*
  # Fix sync_email_verification Function Security

  1. Problem
    - sync_email_verification() function is missing SECURITY DEFINER
    - Function runs as current user (authenticated) during login
    - Cannot update profiles table due to RLS restrictions
    - This causes "Database error granting user" on login

  2. Solution
    - Add SECURITY DEFINER to function
    - Add proper search_path for security
    - Remove duplicate trigger
    - Fix function to update email_verified and email_verified_at correctly

  3. Impact
    - Users can now log in without database errors
    - Email verification status syncs properly from auth.users to profiles
*/

-- Drop duplicate trigger
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;

-- Recreate the sync_email_verification function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
  -- Update profile when auth.users email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at != NEW.email_confirmed_at) THEN
    UPDATE public.profiles
    SET 
      email_verified = true,
      email_verified_at = NEW.email_confirmed_at,
      email_confirmed_at = NEW.email_confirmed_at
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth.users update
    RAISE WARNING 'Failed to sync email verification for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure only one trigger exists with the correct condition
DROP TRIGGER IF EXISTS trg_sync_email_verification ON auth.users;
CREATE TRIGGER trg_sync_email_verification
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS DISTINCT FROM OLD.email_confirmed_at)
  EXECUTE FUNCTION public.sync_email_verification();

-- Add comment
COMMENT ON FUNCTION public.sync_email_verification() IS
'Syncs email verification status from auth.users to profiles. Uses SECURITY DEFINER to bypass RLS.';