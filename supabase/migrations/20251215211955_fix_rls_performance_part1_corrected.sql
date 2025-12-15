/*
  # Fix RLS Policies Performance - Part 1 (Corrected)
  
  1. Performance Optimization
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies
    - This prevents re-evaluation of auth.uid() for each row
    - Significantly improves query performance at scale
  
  2. Tables Fixed (Part 1 - First 15 tables)
    - public.profiles
    - public.user_deposit_addresses
    - public.blockchain_deposits
    - public.user_web3_wallets (4 policies)
    - public.tyt_token_trades (2 policies)
    - public.sol_transfers (2 policies)
    - public.token_swaps (2 policies)
    - public.user_stakes (3 policies)
    - public.staking_rewards (2 policies)
    - public.cross_chain_transfers (2 policies)
  
  3. Security
    - No changes to security logic, only performance optimization
    - All policies maintain same access control rules
*/

-- profiles table
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- user_deposit_addresses table
DROP POLICY IF EXISTS "Users can view own deposit addresses" ON public.user_deposit_addresses;
CREATE POLICY "Users can view own deposit addresses"
  ON public.user_deposit_addresses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- blockchain_deposits table
DROP POLICY IF EXISTS "Users can view own deposits" ON public.blockchain_deposits;
CREATE POLICY "Users can view own deposits"
  ON public.blockchain_deposits
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_web3_wallets table (4 policies)
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

-- tyt_token_trades table
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

-- sol_transfers table
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

-- token_swaps table
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

-- user_stakes table
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

-- staking_rewards table
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

-- cross_chain_transfers table
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
