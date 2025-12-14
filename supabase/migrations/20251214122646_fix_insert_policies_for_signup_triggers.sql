/*
  # Fix INSERT Policies for Signup Triggers

  ## Problem
  When users sign up, multiple AFTER INSERT triggers on profiles table
  try to create records in related tables:
  - custodial_wallets (via create_user_wallets)
  - user_discounts (via create_user_discounts_record)
  - user_academy_stats (via create_academy_stats_for_new_user)
  - user_donation_settings (via create_donation_settings_for_new_user)
  
  These tables have RLS enabled but no INSERT policies for service_role,
  causing "Database error saving new user" during signup.

  ## Solution
  Add service_role INSERT policies for all tables used by signup triggers.

  ## Changes
  - Add INSERT policies for service_role on all trigger-used tables
  - Grant necessary INSERT permissions
*/

-- 1. Custodial Wallets
DROP POLICY IF EXISTS "Service role can insert wallets" ON custodial_wallets;
CREATE POLICY "Service role can insert wallets"
  ON custodial_wallets
  FOR INSERT
  TO service_role
  WITH CHECK (true);

GRANT INSERT ON custodial_wallets TO service_role;

-- 2. User Discounts
DROP POLICY IF EXISTS "Service role can insert user_discounts" ON user_discounts;
CREATE POLICY "Service role can insert user_discounts"
  ON user_discounts
  FOR INSERT
  TO service_role
  WITH CHECK (true);

GRANT INSERT ON user_discounts TO service_role;

-- 3. User Academy Stats
DROP POLICY IF EXISTS "Service role can insert academy_stats" ON user_academy_stats;
CREATE POLICY "Service role can insert academy_stats"
  ON user_academy_stats
  FOR INSERT
  TO service_role
  WITH CHECK (true);

GRANT INSERT ON user_academy_stats TO service_role;

-- 4. User Donation Settings
DROP POLICY IF EXISTS "Service role can insert donation_settings" ON user_donation_settings;
CREATE POLICY "Service role can insert donation_settings"
  ON user_donation_settings
  FOR INSERT
  TO service_role
  WITH CHECK (true);

GRANT INSERT ON user_donation_settings TO service_role;

-- 5. Also add all-access policy for service_role on these tables
DROP POLICY IF EXISTS "Service role full access" ON custodial_wallets;
CREATE POLICY "Service role full access"
  ON custodial_wallets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access" ON user_discounts;
CREATE POLICY "Service role full access"
  ON user_discounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access" ON user_academy_stats;
CREATE POLICY "Service role full access"
  ON user_academy_stats
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access" ON user_donation_settings;
CREATE POLICY "Service role full access"
  ON user_donation_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
