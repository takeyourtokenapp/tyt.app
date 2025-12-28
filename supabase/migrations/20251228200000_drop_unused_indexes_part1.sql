/*
  # Drop Unused Indexes - Part 1: Academy & AOI

  1. Purpose
    - Remove unused indexes to improve write performance
    - Reduce storage overhead
    - Clean up database optimization

  2. Indexes Dropped
    - Academy: certificates, quest_completions
    - AOI: activity_log, conversations, guardian_consents, interactions, recommendations, training_feedback, user_path_progress
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_certificates_quest_id;
DROP INDEX IF EXISTS idx_academy_quest_completions_quest_id;

-- AOI indexes
DROP INDEX IF EXISTS idx_aoi_activity_log_user_id;
DROP INDEX IF EXISTS idx_aoi_conversations_user_id;
DROP INDEX IF EXISTS idx_aoi_guardian_consents_student_user_id;
DROP INDEX IF EXISTS idx_aoi_interactions_user_id;
DROP INDEX IF EXISTS idx_aoi_recommendations_user_id;
DROP INDEX IF EXISTS idx_aoi_training_feedback_user_id;
DROP INDEX IF EXISTS idx_aoi_user_path_progress_path_id;
