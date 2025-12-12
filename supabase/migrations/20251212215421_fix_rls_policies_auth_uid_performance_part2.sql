/*
  # Fix RLS Policies - Auth UID Performance Optimization (Part 2)

  ## Tables Fixed (Part 2)
  - miner_upgrades
  - daily_rewards  
  - maintenance_invoices
  - user_discounts
  - ve_tyt_locks
  - governance_proposals
  - governance_votes
  - marketplace_listings
  - marketplace_offers
  - avatars
  - referral_earnings
  - ambassadors
*/

-- ==========================================
-- MINER_UPGRADES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own upgrades" ON public.miner_upgrades;
CREATE POLICY "Users can view own upgrades"
  ON public.miner_upgrades
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own upgrades" ON public.miner_upgrades;
CREATE POLICY "Users can create own upgrades"
  ON public.miner_upgrades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- DAILY_REWARDS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own rewards" ON public.daily_rewards;
CREATE POLICY "Users can view own rewards"
  ON public.daily_rewards
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- MAINTENANCE_INVOICES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own invoices" ON public.maintenance_invoices;
CREATE POLICY "Users can view own invoices"
  ON public.maintenance_invoices
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- USER_DISCOUNTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own discounts" ON public.user_discounts;
CREATE POLICY "Users can view own discounts"
  ON public.user_discounts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own discounts" ON public.user_discounts;
CREATE POLICY "Users can update own discounts"
  ON public.user_discounts
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- VE_TYT_LOCKS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view own locks" ON public.ve_tyt_locks;
CREATE POLICY "Users can view own locks"
  ON public.ve_tyt_locks
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own locks" ON public.ve_tyt_locks;
CREATE POLICY "Users can create own locks"
  ON public.ve_tyt_locks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own locks" ON public.ve_tyt_locks;
CREATE POLICY "Users can update own locks"
  ON public.ve_tyt_locks
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- GOVERNANCE_PROPOSALS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users with voting power can create proposals" ON public.governance_proposals;
CREATE POLICY "Users with voting power can create proposals"
  ON public.governance_proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (proposed_by = (select auth.uid()));

-- ==========================================
-- GOVERNANCE_VOTES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can vote on proposals" ON public.governance_votes;
CREATE POLICY "Users can vote on proposals"
  ON public.governance_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- MARKETPLACE_LISTINGS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can create listings for their own miners" ON public.marketplace_listings;
CREATE POLICY "Users can create listings for their own miners"
  ON public.marketplace_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    seller_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.nft_miners 
      WHERE id = marketplace_listings.miner_id 
        AND owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage their own listings" ON public.marketplace_listings;
CREATE POLICY "Users can manage their own listings"
  ON public.marketplace_listings
  FOR UPDATE
  TO authenticated
  USING (seller_id = (select auth.uid()))
  WITH CHECK (seller_id = (select auth.uid()));

-- ==========================================
-- MARKETPLACE_OFFERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Anyone can view offers on their listings" ON public.marketplace_offers;
CREATE POLICY "Anyone can view offers on their listings"
  ON public.marketplace_offers
  FOR SELECT
  TO authenticated
  USING (
    listing_id IN (
      SELECT id FROM public.marketplace_listings 
      WHERE seller_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create offers" ON public.marketplace_offers;
CREATE POLICY "Users can create offers"
  ON public.marketplace_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can manage their own offers" ON public.marketplace_offers;
CREATE POLICY "Users can manage their own offers"
  ON public.marketplace_offers
  FOR UPDATE
  TO authenticated
  USING (buyer_id = (select auth.uid()))
  WITH CHECK (buyer_id = (select auth.uid()));

-- ==========================================
-- AVATARS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own avatars" ON public.avatars;
CREATE POLICY "Users can view their own avatars"
  ON public.avatars
  FOR SELECT
  TO authenticated
  USING (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own avatars" ON public.avatars;
CREATE POLICY "Users can update their own avatars"
  ON public.avatars
  FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

-- ==========================================
-- REFERRAL_EARNINGS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own referral earnings" ON public.referral_earnings;
CREATE POLICY "Users can view their own referral earnings"
  ON public.referral_earnings
  FOR SELECT
  TO authenticated
  USING (referrer_id = (select auth.uid()) OR referred_user_id = (select auth.uid()));

-- ==========================================
-- AMBASSADORS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own ambassador status" ON public.ambassadors;
CREATE POLICY "Users can view their own ambassador status"
  ON public.ambassadors
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));