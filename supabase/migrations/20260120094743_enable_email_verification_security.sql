/*
  # Enable Email Verification for Security

  1. Purpose
    - Require email verification before users can log in
    - Prevent spam registrations and fake accounts
    - Protect platform from abuse

  2. Configuration
    - Enable email confirmation requirement
    - Configure email templates
    - Set verification token expiry

  3. Security Benefits
    - Validates real email addresses
    - Prevents automated bot registrations
    - Ensures user authenticity
    - Reduces manual cleanup work

  Note: This requires Supabase Dashboard configuration for:
  - Authentication > Settings > Enable email confirmations
  - Authentication > Email Templates > Confirm signup template
*/

-- Add email_verified tracking to profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified boolean DEFAULT false;
  END IF;
END $$;

-- Add verification timestamp
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email_verified_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified_at timestamptz;
  END IF;
END $$;

-- Function to sync email verification status from auth.users
CREATE OR REPLACE FUNCTION sync_email_verification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update profile when auth.users email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at != NEW.email_confirmed_at) THEN
    UPDATE profiles
    SET 
      email_verified = true,
      email_verified_at = NEW.email_confirmed_at
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;

-- Create trigger on auth.users to sync verification
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_email_verification();

-- Create table for tracking verification email sends
CREATE TABLE IF NOT EXISTS email_verification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Index for rate limiting checks
CREATE INDEX IF NOT EXISTS idx_email_verification_log_user_sent 
  ON email_verification_log(user_id, sent_at DESC);

-- Enable RLS
ALTER TABLE email_verification_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification log
CREATE POLICY "Users can view own verification log"
  ON email_verification_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert verification log entries
CREATE POLICY "Service role can insert verification log"
  ON email_verification_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can view all logs
CREATE POLICY "Admins can view all verification logs"
  ON email_verification_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to check if user can resend verification email (rate limiting)
CREATE OR REPLACE FUNCTION can_resend_verification_email(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_sent timestamptz;
  v_count_last_hour integer;
BEGIN
  -- Get last sent time
  SELECT sent_at INTO v_last_sent
  FROM email_verification_log
  WHERE user_id = p_user_id
  ORDER BY sent_at DESC
  LIMIT 1;
  
  -- Must wait at least 2 minutes between sends
  IF v_last_sent IS NOT NULL AND v_last_sent > now() - interval '2 minutes' THEN
    RETURN false;
  END IF;
  
  -- Check how many emails sent in last hour
  SELECT COUNT(*) INTO v_count_last_hour
  FROM email_verification_log
  WHERE user_id = p_user_id
    AND sent_at > now() - interval '1 hour';
  
  -- Max 5 verification emails per hour
  IF v_count_last_hour >= 5 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Add index for email verification status on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified 
  ON profiles(email_verified) 
  WHERE email_verified = false;

-- Comment on important columns
COMMENT ON COLUMN profiles.email_verified IS 'Whether user has verified their email address';
COMMENT ON COLUMN profiles.email_verified_at IS 'Timestamp when email was verified';
COMMENT ON TABLE email_verification_log IS 'Tracks verification email sends for rate limiting and audit';
