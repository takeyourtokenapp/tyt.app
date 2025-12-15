/*
  # Fix RLS Policies Performance - Part 3
  
  1. Performance Optimization
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies
    - Continues from part 2
  
  2. Tables Fixed (Part 3)
    - public.bitcoin_addresses (3 policies)
    - public.bitcoin_utxos
    - public.bitcoin_transactions (2 policies)
    - public.lightning_nodes
    - public.lightning_invoices (2 policies)
    - public.liquid_assets
    - public.community_messages (2 policies)
    - public.community_online_users
    - public.user_achievements
    - public.wallet_accounts
    - public.ledger_entries
    - public.service_button_claims (2 policies)
  
  3. Security
    - No changes to security logic, only performance optimization
*/

-- bitcoin_addresses table
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

-- bitcoin_utxos table
DROP POLICY IF EXISTS "Users can view own UTXOs" ON public.bitcoin_utxos;
CREATE POLICY "Users can view own UTXOs"
  ON public.bitcoin_utxos
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- bitcoin_transactions table
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

-- lightning_nodes table
DROP POLICY IF EXISTS "Users can view own Lightning nodes" ON public.lightning_nodes;
CREATE POLICY "Users can view own Lightning nodes"
  ON public.lightning_nodes
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- lightning_invoices table
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

-- liquid_assets table
DROP POLICY IF EXISTS "Users can view own Liquid assets" ON public.liquid_assets;
CREATE POLICY "Users can view own Liquid assets"
  ON public.liquid_assets
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- community_messages table
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

-- community_online_users table
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.community_online_users;
CREATE POLICY "Users can manage own sessions"
  ON public.community_online_users
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- user_achievements table
DROP POLICY IF EXISTS "Users can read own achievements" ON public.user_achievements;
CREATE POLICY "Users can read own achievements"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- wallet_accounts table
DROP POLICY IF EXISTS "Users can view own wallet accounts" ON public.wallet_accounts;
CREATE POLICY "Users can view own wallet accounts"
  ON public.wallet_accounts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ledger_entries table
DROP POLICY IF EXISTS "Users can view own ledger entries" ON public.ledger_entries;
CREATE POLICY "Users can view own ledger entries"
  ON public.ledger_entries
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM wallet_accounts
    WHERE wallet_accounts.id = ledger_entries.account_id
      AND wallet_accounts.user_id = (select auth.uid())
  ));

-- service_button_claims table
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
