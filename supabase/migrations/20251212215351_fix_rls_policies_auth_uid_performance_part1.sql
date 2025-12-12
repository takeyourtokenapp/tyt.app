/*
  # Fix RLS Policies - Auth UID Performance Optimization (Part 1)

  ## Problem
  RLS policies that directly call auth.uid() re-evaluate for EVERY row,
  causing severe performance degradation at scale.

  ## Solution  
  Wrap auth functions in subqueries: (select auth.uid())
  This evaluates the function ONCE per query instead of once per row.

  ## Tables Fixed (Part 1)
  - profiles (3 policies)
  - custodial_wallets (2 policies)
  - wallet_transactions (2 policies)
  - nft_miners (3 policies)

  ## Performance Impact
  - 10-1000x faster on large tables
  - Critical for tables with 10k+ rows
*/

-- ==========================================
-- PROFILES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view referrer profile" ON public.profiles;
CREATE POLICY "Users can view referrer profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT referred_by FROM public.profiles WHERE id = (select auth.uid())
    )
  );

-- ==========================================
-- CUSTODIAL_WALLETS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own wallets" ON public.custodial_wallets;
CREATE POLICY "Users can view own wallets"
  ON public.custodial_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own wallets" ON public.custodial_wallets;
CREATE POLICY "Users can update own wallets"
  ON public.custodial_wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- WALLET_TRANSACTIONS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own transactions"
  ON public.wallet_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own transactions" ON public.wallet_transactions;
CREATE POLICY "Users can create own transactions"
  ON public.wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- NFT_MINERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own miners" ON public.nft_miners;
CREATE POLICY "Users can view own miners"
  ON public.nft_miners
  FOR SELECT
  TO authenticated
  USING (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own miners" ON public.nft_miners;
CREATE POLICY "Users can update own miners"
  ON public.nft_miners
  FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own miners" ON public.nft_miners;
CREATE POLICY "Users can insert own miners"
  ON public.nft_miners
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));