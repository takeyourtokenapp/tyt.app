/*
  # Fix RLS Auth Performance Issues

  Optimizes RLS policies by replacing `auth.uid()` with `(select auth.uid())`
  This prevents re-evaluation of auth functions for each row, significantly improving performance.

  Affected tables:
  - user_blockchain_addresses (3 policies)
  - maintenance_payments (2 policies)
  - reward_claims (2 policies)
  - governance_votes (1 policy)
*/

-- ============================================
-- TABLE: user_blockchain_addresses
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own blockchain addresses" ON user_blockchain_addresses;
DROP POLICY IF EXISTS "Users can register own blockchain addresses" ON user_blockchain_addresses;
DROP POLICY IF EXISTS "Users can update own blockchain addresses" ON user_blockchain_addresses;

-- Recreate with optimized auth call
CREATE POLICY "Users can view own blockchain addresses"
  ON user_blockchain_addresses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can register own blockchain addresses"
  ON user_blockchain_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own blockchain addresses"
  ON user_blockchain_addresses
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- TABLE: maintenance_payments
-- ============================================

DROP POLICY IF EXISTS "Users can view own payments" ON maintenance_payments;
DROP POLICY IF EXISTS "Users can create own payments" ON maintenance_payments;

CREATE POLICY "Users can view own payments"
  ON maintenance_payments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own payments"
  ON maintenance_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- TABLE: reward_claims
-- ============================================

DROP POLICY IF EXISTS "Users can view own claims" ON reward_claims;
DROP POLICY IF EXISTS "Users can create own claims" ON reward_claims;

CREATE POLICY "Users can view own claims"
  ON reward_claims
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own claims"
  ON reward_claims
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- TABLE: governance_votes
-- ============================================

DROP POLICY IF EXISTS "Users can cast votes" ON governance_votes;

CREATE POLICY "Users can cast votes"
  ON governance_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));