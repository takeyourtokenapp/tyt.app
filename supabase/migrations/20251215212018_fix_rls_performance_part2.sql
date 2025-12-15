/*
  # Fix RLS Policies Performance - Part 2
  
  1. Performance Optimization
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies
    - Continues from part 1
  
  2. Tables Fixed (Part 2)
    - public.fiat_transactions (2 policies)
    - public.custodial_addresses (2 policies)
    - public.custodial_withdrawals (2 policies)
    - public.custodial_internal_swaps (2 policies)
    - public.custodial_balance_snapshots
    - public.user_profiles (3 policies)
    - public.kyc_documents (2 policies)
    - public.user_feature_access
    - public.daily_withdrawal_tracking
    - public.withdrawal_requests (2 policies)
  
  3. Security
    - No changes to security logic, only performance optimization
*/

-- fiat_transactions table
DROP POLICY IF EXISTS "Users can view own fiat transactions" ON public.fiat_transactions;
CREATE POLICY "Users can view own fiat transactions"
  ON public.fiat_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own fiat transactions" ON public.fiat_transactions;
CREATE POLICY "Users can insert own fiat transactions"
  ON public.fiat_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- custodial_addresses table
DROP POLICY IF EXISTS "Users can view own custodial addresses" ON public.custodial_addresses;
CREATE POLICY "Users can view own custodial addresses"
  ON public.custodial_addresses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own custodial addresses" ON public.custodial_addresses;
CREATE POLICY "Users can insert own custodial addresses"
  ON public.custodial_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- custodial_withdrawals table
DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.custodial_withdrawals;
CREATE POLICY "Users can view own withdrawals"
  ON public.custodial_withdrawals
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own withdrawals" ON public.custodial_withdrawals;
CREATE POLICY "Users can insert own withdrawals"
  ON public.custodial_withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- custodial_internal_swaps table
DROP POLICY IF EXISTS "Users can view own internal swaps" ON public.custodial_internal_swaps;
CREATE POLICY "Users can view own internal swaps"
  ON public.custodial_internal_swaps
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own internal swaps" ON public.custodial_internal_swaps;
CREATE POLICY "Users can insert own internal swaps"
  ON public.custodial_internal_swaps
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- custodial_balance_snapshots table
DROP POLICY IF EXISTS "Users can view own balance snapshots" ON public.custodial_balance_snapshots;
CREATE POLICY "Users can view own balance snapshots"
  ON public.custodial_balance_snapshots
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "System can insert user profiles" ON public.user_profiles;
CREATE POLICY "System can insert user profiles"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- kyc_documents table
DROP POLICY IF EXISTS "Users can view own KYC documents" ON public.kyc_documents;
CREATE POLICY "Users can view own KYC documents"
  ON public.kyc_documents
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own KYC documents" ON public.kyc_documents;
CREATE POLICY "Users can insert own KYC documents"
  ON public.kyc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- user_feature_access table
DROP POLICY IF EXISTS "Users can view own feature access" ON public.user_feature_access;
CREATE POLICY "Users can view own feature access"
  ON public.user_feature_access
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- daily_withdrawal_tracking table
DROP POLICY IF EXISTS "Users can view own withdrawal tracking" ON public.daily_withdrawal_tracking;
CREATE POLICY "Users can view own withdrawal tracking"
  ON public.daily_withdrawal_tracking
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- withdrawal_requests table
DROP POLICY IF EXISTS "Users can view own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Users can view own withdrawal requests"
  ON public.withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Users can create withdrawal requests"
  ON public.withdrawal_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
