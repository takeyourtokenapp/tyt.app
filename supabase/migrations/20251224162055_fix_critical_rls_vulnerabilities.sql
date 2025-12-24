/*
  # Fix Critical RLS Vulnerabilities

  This migration addresses critical security issues identified in the security audit:

  ## Changes

  1. **Remove Duplicate Policies on governance_votes**
     - Removes conflicting duplicate INSERT policy

  2. **Restrict Access to Financial Data**
     - Blocks access to protocol_revenue, treasury_reserves, and fee_audit_log for regular users
     - Data can only be accessed via service_role or admin functions

  3. **Add Explicit DENY Policies on Read-Only Tables**
     - Prevents INSERT/UPDATE/DELETE on academy_lessons, academy_tracks, vip_tiers, etc.

  ## Security Improvements
  - Prevents unauthorized access to sensitive financial information
  - Eliminates policy conflicts
  - Implements principle of least privilege
*/

-- =====================================================
-- 1. Remove duplicate policy on governance_votes
-- =====================================================

DROP POLICY IF EXISTS "Users can vote on proposals" ON governance_votes;
-- Keep only "Users can cast votes" policy

-- =====================================================
-- 2. Restrict financial data access
-- =====================================================

-- protocol_revenue: Block access for regular users
DROP POLICY IF EXISTS "Authenticated users can view protocol revenue" ON protocol_revenue;

-- No new policy = only service_role can access
-- If admin dashboard needed, use RPC functions with service_role

-- treasury_reserves: Block access for regular users
DROP POLICY IF EXISTS "Anyone can view treasury reserves" ON treasury_reserves;

-- fee_audit_log: Block access for regular users
DROP POLICY IF EXISTS "Public can view fee audit log" ON fee_audit_log;

-- =====================================================
-- 3. Add explicit DENY policies on read-only tables
-- =====================================================

-- academy_lessons: Block all modifications
CREATE POLICY "Block inserts on academy_lessons"
  ON academy_lessons FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Block updates on academy_lessons"
  ON academy_lessons FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Block deletes on academy_lessons"
  ON academy_lessons FOR DELETE
  TO authenticated
  USING (false);

-- academy_tracks: Block all modifications
CREATE POLICY "Block inserts on academy_tracks"
  ON academy_tracks FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Block updates on academy_tracks"
  ON academy_tracks FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Block deletes on academy_tracks"
  ON academy_tracks FOR DELETE
  TO authenticated
  USING (false);

-- vip_tiers: Block all modifications
CREATE POLICY "Block inserts on vip_tiers"
  ON vip_tiers FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Block updates on vip_tiers"
  ON vip_tiers FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Block deletes on vip_tiers"
  ON vip_tiers FOR DELETE
  TO authenticated
  USING (false);

-- bitcoin_fee_estimates: Block all modifications
CREATE POLICY "Block inserts on bitcoin_fee_estimates"
  ON bitcoin_fee_estimates FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Block updates on bitcoin_fee_estimates"
  ON bitcoin_fee_estimates FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Block deletes on bitcoin_fee_estimates"
  ON bitcoin_fee_estimates FOR DELETE
  TO authenticated
  USING (false);

-- =====================================================
-- 4. Add indexes for improved RLS performance
-- =====================================================

-- Index for auth.uid() lookups (profiles.id IS the user_id from auth.users)
CREATE INDEX IF NOT EXISTS idx_profiles_id
  ON profiles(id);
