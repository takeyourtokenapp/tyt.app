/*
  # Fix RLS Policies - Auth UID Performance Optimization (Part 4)

  ## Tables Fixed (Part 4)
  - user_deposit_addresses
  - blockchain_deposits
  - connected_wallets
  - tyt_trades
  - wallet_sync_logs
  - user_web3_wallets
  - tyt_token_trades
  - sol_transfers
  - token_swaps
  - user_stakes
  - staking_rewards
  - cross_chain_transfers
  - fiat_transactions
*/

-- ==========================================
-- USER_DEPOSIT_ADDRESSES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own deposit addresses" ON public.user_deposit_addresses;
CREATE POLICY "Users can view own deposit addresses"
  ON public.user_deposit_addresses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- BLOCKCHAIN_DEPOSITS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own deposits" ON public.blockchain_deposits;
CREATE POLICY "Users can view own deposits"
  ON public.blockchain_deposits
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- CONNECTED_WALLETS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own connected wallets" ON public.connected_wallets;
CREATE POLICY "Users can view own connected wallets"
  ON public.connected_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own connected wallets" ON public.connected_wallets;
CREATE POLICY "Users can insert own connected wallets"
  ON public.connected_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own connected wallets" ON public.connected_wallets;
CREATE POLICY "Users can update own connected wallets"
  ON public.connected_wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- TYT_TRADES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own TYT trades" ON public.tyt_trades;
CREATE POLICY "Users can view own TYT trades"
  ON public.tyt_trades
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own TYT trades" ON public.tyt_trades;
CREATE POLICY "Users can insert own TYT trades"
  ON public.tyt_trades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- WALLET_SYNC_LOGS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own sync logs" ON public.wallet_sync_logs;
CREATE POLICY "Users can view own sync logs"
  ON public.wallet_sync_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- USER_WEB3_WALLETS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own web3 wallets" ON public.user_web3_wallets;
CREATE POLICY "Users can view own web3 wallets"
  ON public.user_web3_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own web3 wallets" ON public.user_web3_wallets;
CREATE POLICY "Users can insert own web3 wallets"
  ON public.user_web3_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own web3 wallets" ON public.user_web3_wallets;
CREATE POLICY "Users can update own web3 wallets"
  ON public.user_web3_wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own web3 wallets" ON public.user_web3_wallets;
CREATE POLICY "Users can delete own web3 wallets"
  ON public.user_web3_wallets
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- TYT_TOKEN_TRADES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own trades" ON public.tyt_token_trades;
CREATE POLICY "Users can view own trades"
  ON public.tyt_token_trades
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own trades" ON public.tyt_token_trades;
CREATE POLICY "Users can insert own trades"
  ON public.tyt_token_trades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- SOL_TRANSFERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own transfers" ON public.sol_transfers;
CREATE POLICY "Users can view own transfers"
  ON public.sol_transfers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own transfers" ON public.sol_transfers;
CREATE POLICY "Users can insert own transfers"
  ON public.sol_transfers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- TOKEN_SWAPS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own swaps" ON public.token_swaps;
CREATE POLICY "Users can view own swaps"
  ON public.token_swaps
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own swaps" ON public.token_swaps;
CREATE POLICY "Users can insert own swaps"
  ON public.token_swaps
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- USER_STAKES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own stakes" ON public.user_stakes;
CREATE POLICY "Users can view own stakes"
  ON public.user_stakes
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own stakes" ON public.user_stakes;
CREATE POLICY "Users can insert own stakes"
  ON public.user_stakes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own stakes" ON public.user_stakes;
CREATE POLICY "Users can update own stakes"
  ON public.user_stakes
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- STAKING_REWARDS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own rewards" ON public.staking_rewards;
CREATE POLICY "Users can view own rewards"
  ON public.staking_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own rewards" ON public.staking_rewards;
CREATE POLICY "Users can insert own rewards"
  ON public.staking_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- CROSS_CHAIN_TRANSFERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own transfers" ON public.cross_chain_transfers;
CREATE POLICY "Users can view own transfers"
  ON public.cross_chain_transfers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own transfers" ON public.cross_chain_transfers;
CREATE POLICY "Users can insert own transfers"
  ON public.cross_chain_transfers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- FIAT_TRANSACTIONS TABLE
-- ==========================================

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