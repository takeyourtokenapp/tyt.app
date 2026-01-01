/*
  # Fix AOI RLS Performance Issues

  Updates RLS policies to use (select auth.uid()) instead of auth.uid()
  to prevent re-evaluation for each row.

  ## Tables Fixed
  - aoi_user_progress
  - aoi_guardian_consents
  - aoi_achievements
  - aoi_interactions
  - aoi_conversations
  - aoi_messages

  ## Performance Impact
  - Prevents auth.uid() from being called for each row
  - Significantly improves query performance at scale
  - Single auth check per query instead of per-row
*/

-- ============================================================================
-- AOI USER PROGRESS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own progress" ON aoi_user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON aoi_user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON aoi_user_progress;

CREATE POLICY "Users can view own progress"
  ON aoi_user_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own progress"
  ON aoi_user_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own progress"
  ON aoi_user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- AOI GUARDIAN CONSENTS
-- ============================================================================

DROP POLICY IF EXISTS "Students can view own guardian consent" ON aoi_guardian_consents;

CREATE POLICY "Students can view own guardian consent"
  ON aoi_guardian_consents FOR SELECT
  TO authenticated
  USING (student_user_id = (select auth.uid()));

-- ============================================================================
-- AOI ACHIEVEMENTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own achievements" ON aoi_achievements;

CREATE POLICY "Users can view own achievements"
  ON aoi_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- AOI INTERACTIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own interactions" ON aoi_interactions;

CREATE POLICY "Users can view own interactions"
  ON aoi_interactions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================================================
-- AOI CONVERSATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own conversations" ON aoi_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON aoi_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON aoi_conversations;

CREATE POLICY "Users can view own conversations"
  ON aoi_conversations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own conversations"
  ON aoi_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own conversations"
  ON aoi_conversations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- AOI MESSAGES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON aoi_messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON aoi_messages;

CREATE POLICY "Users can view messages in own conversations"
  ON aoi_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM aoi_conversations
      WHERE aoi_conversations.id = aoi_messages.conversation_id
      AND aoi_conversations.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON aoi_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM aoi_conversations
      WHERE aoi_conversations.id = aoi_messages.conversation_id
      AND aoi_conversations.user_id = (select auth.uid())
    )
  );
