/*
  # Drop Unused aOi Indexes

  1. Purpose
    - Remove unused indexes from aOi system tables
    - Improves INSERT/UPDATE performance
    - Reduces storage overhead

  2. aOi Indexes Removed
    - aoi_user_progress: level
    - aoi_guardian_consents: student_id, consent_code
    - aoi_achievements: code, type
    - aoi_interactions: user_id, type, created_at
    - aoi_user_profiles: user, rank
    - aoi_activity_log: user_time, type, domain
    - aoi_knowledge_graph: topic, domain, difficulty, embedding
    - aoi_learning_paths: audience, active
    - aoi_user_path_progress: user, path
    - aoi_training_feedback: user, type
    - aoi_recommendations: user, active
    - aoi_conversations: user_id, is_active, last_message, user_active

  Note: Foreign key indexes are automatically created and maintained
*/

-- aoi_user_progress
DROP INDEX IF EXISTS idx_aoi_user_progress_level;

-- aoi_guardian_consents
DROP INDEX IF EXISTS idx_aoi_guardian_consents_student_id;
DROP INDEX IF EXISTS idx_aoi_guardian_consents_consent_code;

-- aoi_achievements
DROP INDEX IF EXISTS idx_aoi_achievements_code;
DROP INDEX IF EXISTS idx_aoi_achievements_type;

-- aoi_interactions
DROP INDEX IF EXISTS idx_aoi_interactions_user_id;
DROP INDEX IF EXISTS idx_aoi_interactions_type;
DROP INDEX IF EXISTS idx_aoi_interactions_created_at;

-- aoi_user_profiles
DROP INDEX IF EXISTS idx_aoi_profiles_user;
DROP INDEX IF EXISTS idx_aoi_profiles_rank;

-- aoi_activity_log
DROP INDEX IF EXISTS idx_activity_user_time;
DROP INDEX IF EXISTS idx_activity_type;
DROP INDEX IF EXISTS idx_activity_domain;

-- aoi_knowledge_graph
DROP INDEX IF EXISTS idx_knowledge_topic;
DROP INDEX IF EXISTS idx_knowledge_domain;
DROP INDEX IF EXISTS idx_knowledge_difficulty;
DROP INDEX IF EXISTS idx_knowledge_embedding;

-- aoi_learning_paths
DROP INDEX IF EXISTS idx_paths_audience;
DROP INDEX IF EXISTS idx_paths_active;

-- aoi_user_path_progress
DROP INDEX IF EXISTS idx_path_progress_user;
DROP INDEX IF EXISTS idx_path_progress_path;

-- aoi_training_feedback
DROP INDEX IF EXISTS idx_feedback_user;
DROP INDEX IF EXISTS idx_feedback_type;

-- aoi_recommendations
DROP INDEX IF EXISTS idx_recommendations_user;
DROP INDEX IF EXISTS idx_recommendations_active;

-- aoi_conversations
DROP INDEX IF EXISTS idx_aoi_conversations_user_id;
DROP INDEX IF EXISTS idx_aoi_conversations_is_active;
DROP INDEX IF EXISTS idx_aoi_conversations_last_message;
DROP INDEX IF EXISTS idx_aoi_conversations_user_active;