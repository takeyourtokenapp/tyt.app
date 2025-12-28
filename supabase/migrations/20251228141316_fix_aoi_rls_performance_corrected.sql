/*
  # Fix aOi RLS Performance Issues (Corrected)

  1. Performance Optimizations
    - Replace `auth.uid()` with `(select auth.uid())` in all aOi table policies
    - Prevents re-evaluation of auth function for each row
    - Improves query performance at scale

  2. Tables Updated
    - aoi_user_progress (3 policies)
    - aoi_guardian_consents (1 policy)
    - aoi_achievements (1 policy)
    - aoi_interactions (1 policy)
    - aoi_user_profiles (3 policies)
    - aoi_activity_log (2 policies)
    - aoi_user_path_progress (3 policies)
    - aoi_training_feedback (2 policies)
    - aoi_recommendations (2 policies)
    - aoi_conversations (4 policies)
*/

-- aoi_user_progress
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

-- aoi_guardian_consents
DROP POLICY IF EXISTS "Students can view own guardian consent" ON aoi_guardian_consents;

CREATE POLICY "Students can view own guardian consent"
  ON aoi_guardian_consents FOR SELECT
  TO authenticated
  USING (student_user_id = (select auth.uid()));

-- aoi_achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON aoi_achievements;

CREATE POLICY "Users can view own achievements"
  ON aoi_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- aoi_interactions
DROP POLICY IF EXISTS "Users can view own interactions" ON aoi_interactions;

CREATE POLICY "Users can view own interactions"
  ON aoi_interactions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- aoi_user_profiles
DROP POLICY IF EXISTS "Users can view own aOi profile" ON aoi_user_profiles;
DROP POLICY IF EXISTS "Users can update own aOi profile" ON aoi_user_profiles;
DROP POLICY IF EXISTS "Users can insert own aOi profile" ON aoi_user_profiles;

CREATE POLICY "Users can view own aOi profile"
  ON aoi_user_profiles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own aOi profile"
  ON aoi_user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own aOi profile"
  ON aoi_user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- aoi_activity_log
DROP POLICY IF EXISTS "Users can view own activity log" ON aoi_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON aoi_activity_log;

CREATE POLICY "Users can view own activity log"
  ON aoi_activity_log FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own activity"
  ON aoi_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- aoi_user_path_progress
DROP POLICY IF EXISTS "Users can view own path progress" ON aoi_user_path_progress;
DROP POLICY IF EXISTS "Users can update own path progress" ON aoi_user_path_progress;
DROP POLICY IF EXISTS "Users can enroll in paths" ON aoi_user_path_progress;

CREATE POLICY "Users can view own path progress"
  ON aoi_user_path_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own path progress"
  ON aoi_user_path_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can enroll in paths"
  ON aoi_user_path_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- aoi_training_feedback
DROP POLICY IF EXISTS "Users can submit feedback" ON aoi_training_feedback;
DROP POLICY IF EXISTS "Users can view own feedback" ON aoi_training_feedback;

CREATE POLICY "Users can submit feedback"
  ON aoi_training_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can view own feedback"
  ON aoi_training_feedback FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- aoi_recommendations
DROP POLICY IF EXISTS "Users can view own recommendations" ON aoi_recommendations;
DROP POLICY IF EXISTS "Users can update own recommendations" ON aoi_recommendations;

CREATE POLICY "Users can view own recommendations"
  ON aoi_recommendations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own recommendations"
  ON aoi_recommendations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- aoi_conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON aoi_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON aoi_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON aoi_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON aoi_conversations;

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

CREATE POLICY "Users can delete own conversations"
  ON aoi_conversations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));