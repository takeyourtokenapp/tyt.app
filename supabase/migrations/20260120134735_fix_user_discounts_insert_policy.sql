/*
  # Fix user_discounts INSERT policy for signup

  1. Problem
    - user_discounts table has RLS enabled but no INSERT policy
    - The create_user_discounts_record() trigger fails during signup
    - This causes "Database error granting user" message

  2. Solution
    - Add service_role INSERT policy to user_discounts
    - Add similar policies to other tables that triggers create during signup

  3. Tables affected
    - user_discounts
    - custodial_wallets
    - user_academy_stats
    - user_donation_settings
    - aoi_user_progress
*/

-- Fix user_discounts table
DROP POLICY IF EXISTS "Service role can insert user discounts" ON user_discounts;
CREATE POLICY "Service role can insert user discounts"
  ON user_discounts FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix custodial_wallets table (created by on_profile_created trigger)
DROP POLICY IF EXISTS "Service role can insert wallets" ON custodial_wallets;
CREATE POLICY "Service role can insert wallets"
  ON custodial_wallets FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix user_academy_stats table
DROP POLICY IF EXISTS "Service role can insert academy stats" ON user_academy_stats;
CREATE POLICY "Service role can insert academy stats"
  ON user_academy_stats FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix user_donation_settings table
DROP POLICY IF EXISTS "Service role can insert donation settings" ON user_donation_settings;
CREATE POLICY "Service role can insert donation settings"
  ON user_donation_settings FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix aoi_user_progress table
DROP POLICY IF EXISTS "Service role can insert aoi progress" ON aoi_user_progress;
CREATE POLICY "Service role can insert aoi progress"
  ON aoi_user_progress FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix email_queue table (for welcome email trigger)
DROP POLICY IF EXISTS "Service role can insert email queue" ON email_queue;
CREATE POLICY "Service role can insert email queue"
  ON email_queue FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON user_discounts TO service_role;
GRANT INSERT ON custodial_wallets TO service_role;
GRANT INSERT ON user_academy_stats TO service_role;
GRANT INSERT ON user_donation_settings TO service_role;
GRANT INSERT ON aoi_user_progress TO service_role;
GRANT INSERT ON email_queue TO service_role;

-- Add comment
COMMENT ON POLICY "Service role can insert user discounts" ON user_discounts IS
'Allows service_role to insert user_discounts records during signup via trigger';