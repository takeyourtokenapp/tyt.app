/*
  # Fix Multiple Permissive Policies (Corrected)

  Consolidates multiple permissive policies into single, comprehensive policies.
  Multiple permissive policies can cause performance issues and unexpected behavior.
*/

-- ============================================
-- TABLE: community_online_users
-- ============================================

DROP POLICY IF EXISTS "Everyone can count online users" ON community_online_users;
DROP POLICY IF EXISTS "Users can manage own sessions" ON community_online_users;

CREATE POLICY "Users can view online users"
  ON community_online_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own sessions"
  ON community_online_users
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- TABLE: foundation_donations
-- ============================================

DROP POLICY IF EXISTS "Anyone can view non-anonymous donations" ON foundation_donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON foundation_donations;

CREATE POLICY "Users can view donations"
  ON foundation_donations
  FOR SELECT
  TO authenticated
  USING (
    is_anonymous = false
    OR donor_user_id = (select auth.uid())
  );

-- ============================================
-- TABLE: game_tournament_participants
-- ============================================

DROP POLICY IF EXISTS "Users can manage own participation" ON game_tournament_participants;
DROP POLICY IF EXISTS "Users can view tournament participants" ON game_tournament_participants;

CREATE POLICY "Users can view tournament participants"
  ON game_tournament_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own participation"
  ON game_tournament_participants
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- TABLE: governance_votes
-- ============================================

DROP POLICY IF EXISTS "Users can view all votes" ON governance_votes;
DROP POLICY IF EXISTS "Users can view votes" ON governance_votes;

CREATE POLICY "Users can view votes"
  ON governance_votes
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TABLE: maintenance_fee_config
-- ============================================

DROP POLICY IF EXISTS "Anyone can view active fee configs" ON maintenance_fee_config;
DROP POLICY IF EXISTS "Anyone can view fee config" ON maintenance_fee_config;

CREATE POLICY "Anyone can view fee config"
  ON maintenance_fee_config
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TABLE: nft_miners
-- ============================================

DROP POLICY IF EXISTS "Users can view listed miners" ON nft_miners;
DROP POLICY IF EXISTS "Users can view own miners" ON nft_miners;

CREATE POLICY "Users can view miners"
  ON nft_miners
  FOR SELECT
  TO authenticated
  USING (
    owner_id = (select auth.uid())
    OR is_listed = true
  );

-- ============================================
-- TABLE: user_academy_stats
-- ============================================

DROP POLICY IF EXISTS "Users can view others' public stats" ON user_academy_stats;
DROP POLICY IF EXISTS "Users can view their own academy stats" ON user_academy_stats;

CREATE POLICY "Users can view academy stats"
  ON user_academy_stats
  FOR SELECT
  TO authenticated
  USING (true);