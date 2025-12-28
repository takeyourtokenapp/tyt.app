/*
  # Add Missing Foreign Key Indexes - Part 1: Academy & aOi Tables

  1. Purpose
    - Add indexes for foreign keys without covering indexes
    - Improves JOIN performance and referential integrity checks
    - Covers Academy and aOi system tables

  2. Tables Covered
    - academy_certificates
    - academy_quest_completions
    - aoi_activity_log
    - aoi_conversations
    - aoi_guardian_consents
    - aoi_interactions
    - aoi_recommendations
    - aoi_training_feedback
    - aoi_user_path_progress
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id 
  ON academy_certificates(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quest_completions_quest_id 
  ON academy_quest_completions(quest_id);

-- aOi tables
CREATE INDEX IF NOT EXISTS idx_aoi_activity_log_user_id 
  ON aoi_activity_log(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id 
  ON aoi_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_guardian_consents_student_user_id 
  ON aoi_guardian_consents(student_user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_interactions_user_id 
  ON aoi_interactions(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_recommendations_user_id 
  ON aoi_recommendations(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_training_feedback_user_id 
  ON aoi_training_feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_user_path_progress_path_id 
  ON aoi_user_path_progress(path_id);