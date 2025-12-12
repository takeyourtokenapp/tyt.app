/*
  # Fix RLS Policies - Auth UID Performance Optimization (Part 5)

  ## Tables Fixed (Part 5)
  - custodial_addresses
  - custodial_withdrawals
  - custodial_internal_swaps
  - custodial_balance_snapshots
  - user_profiles
  - kyc_documents
  - user_feature_access
  - daily_withdrawal_tracking
  - withdrawal_requests
  - bitcoin_addresses
  - bitcoin_utxos
  - bitcoin_transactions
  - lightning_nodes
  - lightning_invoices
  - liquid_assets
  - community_messages
  - community_online_users
  - user_achievements
  - wallet_accounts
  - ledger_entries
  - service_button_claims
*/

-- ==========================================
-- CUSTODIAL_ADDRESSES TABLE
-- ==========================================

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

-- ==========================================
-- CUSTODIAL_WITHDRAWALS TABLE
-- ==========================================

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

-- ==========================================
-- CUSTODIAL_INTERNAL_SWAPS TABLE
-- ==========================================

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

-- ==========================================
-- CUSTODIAL_BALANCE_SNAPSHOTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own balance snapshots" ON public.custodial_balance_snapshots;
CREATE POLICY "Users can view own balance snapshots"
  ON public.custodial_balance_snapshots
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- USER_PROFILES TABLE
-- ==========================================

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

-- ==========================================
-- KYC_DOCUMENTS TABLE
-- ==========================================

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

-- ==========================================
-- USER_FEATURE_ACCESS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own feature access" ON public.user_feature_access;
CREATE POLICY "Users can view own feature access"
  ON public.user_feature_access
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- DAILY_WITHDRAWAL_TRACKING TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own withdrawal tracking" ON public.daily_withdrawal_tracking;
CREATE POLICY "Users can view own withdrawal tracking"
  ON public.daily_withdrawal_tracking
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- WITHDRAWAL_REQUESTS TABLE
-- ==========================================

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

-- ==========================================
-- BITCOIN_ADDRESSES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own Bitcoin addresses" ON public.bitcoin_addresses;
CREATE POLICY "Users can view own Bitcoin addresses"
  ON public.bitcoin_addresses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own Bitcoin addresses" ON public.bitcoin_addresses;
CREATE POLICY "Users can insert own Bitcoin addresses"
  ON public.bitcoin_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own Bitcoin addresses" ON public.bitcoin_addresses;
CREATE POLICY "Users can update own Bitcoin addresses"
  ON public.bitcoin_addresses
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- BITCOIN_UTXOS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own UTXOs" ON public.bitcoin_utxos;
CREATE POLICY "Users can view own UTXOs"
  ON public.bitcoin_utxos
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- BITCOIN_TRANSACTIONS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own Bitcoin transactions" ON public.bitcoin_transactions;
CREATE POLICY "Users can view own Bitcoin transactions"
  ON public.bitcoin_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create Bitcoin transactions" ON public.bitcoin_transactions;
CREATE POLICY "Users can create Bitcoin transactions"
  ON public.bitcoin_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- LIGHTNING_NODES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own Lightning nodes" ON public.lightning_nodes;
CREATE POLICY "Users can view own Lightning nodes"
  ON public.lightning_nodes
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- LIGHTNING_INVOICES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own Lightning invoices" ON public.lightning_invoices;
CREATE POLICY "Users can view own Lightning invoices"
  ON public.lightning_invoices
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create Lightning invoices" ON public.lightning_invoices;
CREATE POLICY "Users can create Lightning invoices"
  ON public.lightning_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- LIQUID_ASSETS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own Liquid assets" ON public.liquid_assets;
CREATE POLICY "Users can view own Liquid assets"
  ON public.liquid_assets
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- COMMUNITY_MESSAGES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can insert own messages" ON public.community_messages;
CREATE POLICY "Users can insert own messages"
  ON public.community_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own messages" ON public.community_messages;
CREATE POLICY "Users can update own messages"
  ON public.community_messages
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- COMMUNITY_ONLINE_USERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can manage own sessions" ON public.community_online_users;
CREATE POLICY "Users can manage own sessions"
  ON public.community_online_users
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- USER_ACHIEVEMENTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can read own achievements" ON public.user_achievements;
CREATE POLICY "Users can read own achievements"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- WALLET_ACCOUNTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own wallet accounts" ON public.wallet_accounts;
CREATE POLICY "Users can view own wallet accounts"
  ON public.wallet_accounts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- LEDGER_ENTRIES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own ledger entries" ON public.ledger_entries;
CREATE POLICY "Users can view own ledger entries"
  ON public.ledger_entries
  FOR SELECT
  TO authenticated
  USING (
    account_id IN (
      SELECT id FROM public.wallet_accounts WHERE user_id = (select auth.uid())
    )
  );

-- ==========================================
-- SERVICE_BUTTON_CLAIMS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own service claims" ON public.service_button_claims;
CREATE POLICY "Users can view own service claims"
  ON public.service_button_claims
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own service claims" ON public.service_button_claims;
CREATE POLICY "Users can insert own service claims"
  ON public.service_button_claims
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));