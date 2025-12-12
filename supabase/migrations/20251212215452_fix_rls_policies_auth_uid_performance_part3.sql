/*
  # Fix RLS Policies - Auth UID Performance Optimization (Part 3)

  ## Tables Fixed (Part 3)
  - academy_progress
  - academy_quiz_attempts
  - academy_quest_completions
  - academy_certificates
  - user_academy_stats
  - foundation_donations
  - foundation_donation_receipts
  - user_donation_settings
  - game_clans
  - game_clan_members
  - game_boosts
  - service_button_activations
  - goboxes
*/

-- ==========================================
-- ACADEMY_PROGRESS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own progress" ON public.academy_progress;
CREATE POLICY "Users can view their own progress"
  ON public.academy_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create their own progress" ON public.academy_progress;
CREATE POLICY "Users can create their own progress"
  ON public.academy_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own progress" ON public.academy_progress;
CREATE POLICY "Users can update their own progress"
  ON public.academy_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- ACADEMY_QUIZ_ATTEMPTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.academy_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON public.academy_quiz_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create quiz attempts" ON public.academy_quiz_attempts;
CREATE POLICY "Users can create quiz attempts"
  ON public.academy_quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- ACADEMY_QUEST_COMPLETIONS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own quest completions" ON public.academy_quest_completions;
CREATE POLICY "Users can view their own quest completions"
  ON public.academy_quest_completions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create quest completions" ON public.academy_quest_completions;
CREATE POLICY "Users can create quest completions"
  ON public.academy_quest_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own quest completions" ON public.academy_quest_completions;
CREATE POLICY "Users can update their own quest completions"
  ON public.academy_quest_completions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- ACADEMY_CERTIFICATES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own certificates" ON public.academy_certificates;
CREATE POLICY "Users can view their own certificates"
  ON public.academy_certificates
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- USER_ACADEMY_STATS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own academy stats" ON public.user_academy_stats;
CREATE POLICY "Users can view their own academy stats"
  ON public.user_academy_stats
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- FOUNDATION_DONATIONS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own donations" ON public.foundation_donations;
CREATE POLICY "Users can view their own donations"
  ON public.foundation_donations
  FOR SELECT
  TO authenticated
  USING (donor_user_id = (select auth.uid()));

-- ==========================================
-- FOUNDATION_DONATION_RECEIPTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view their own donation receipts" ON public.foundation_donation_receipts;
CREATE POLICY "Users can view their own donation receipts"
  ON public.foundation_donation_receipts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- USER_DONATION_SETTINGS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users can view and update their donation settings" ON public.user_donation_settings;
CREATE POLICY "Users can view and update their donation settings"
  ON public.user_donation_settings
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- GAME_CLANS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users create clans" ON public.game_clans;
CREATE POLICY "Users create clans"
  ON public.game_clans
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_id = (select auth.uid()));

DROP POLICY IF EXISTS "Leaders update clans" ON public.game_clans;
CREATE POLICY "Leaders update clans"
  ON public.game_clans
  FOR UPDATE
  TO authenticated
  USING (leader_id = (select auth.uid()))
  WITH CHECK (leader_id = (select auth.uid()));

-- ==========================================
-- GAME_CLAN_MEMBERS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users join clans" ON public.game_clan_members;
CREATE POLICY "Users join clans"
  ON public.game_clan_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users leave clans" ON public.game_clan_members;
CREATE POLICY "Users leave clans"
  ON public.game_clan_members
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==========================================
-- GAME_BOOSTS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users view own boosts" ON public.game_boosts;
CREATE POLICY "Users view own boosts"
  ON public.game_boosts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users buy boosts" ON public.game_boosts;
CREATE POLICY "Users buy boosts"
  ON public.game_boosts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- SERVICE_BUTTON_ACTIVATIONS TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users view own service button" ON public.service_button_activations;
CREATE POLICY "Users view own service button"
  ON public.service_button_activations
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users activate service button" ON public.service_button_activations;
CREATE POLICY "Users activate service button"
  ON public.service_button_activations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==========================================
-- GOBOXES TABLE
-- ==========================================

DROP POLICY IF EXISTS "Users view own goboxes" ON public.goboxes;
CREATE POLICY "Users view own goboxes"
  ON public.goboxes
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users open own goboxes" ON public.goboxes;
CREATE POLICY "Users open own goboxes"
  ON public.goboxes
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));