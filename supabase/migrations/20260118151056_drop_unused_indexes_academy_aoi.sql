/*
  # Drop Unused Indexes - Academy & AOI

  1. Indexes Removed
    - Academy table indexes (unused)
    - AOI conversation and system indexes (unused)
    - Orbital system indexes (unused)
    - Contact form indexes (unused)

  2. Safety
    - All indexes confirmed unused by Supabase advisor
    - Foreign keys maintain referential integrity
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_certificates_cert_template_id;
DROP INDEX IF EXISTS idx_academy_certificates_quest_id;
DROP INDEX IF EXISTS idx_academy_quest_completions_quest_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_lesson_id;

-- AOI conversation indexes
DROP INDEX IF EXISTS idx_aoi_conversations_user_id;
DROP INDEX IF EXISTS idx_aoi_guardian_consents_student_user_id;
DROP INDEX IF EXISTS idx_aoi_interactions_user_id;
DROP INDEX IF EXISTS idx_aoi_messages_conversation_id;

-- AOI system indexes
DROP INDEX IF EXISTS idx_aoi_events_created_at;
DROP INDEX IF EXISTS idx_aoi_events_type;
DROP INDEX IF EXISTS idx_aoi_explanations_entity;
DROP INDEX IF EXISTS idx_aoi_explanations_type;
DROP INDEX IF EXISTS idx_aoi_verification_entity;
DROP INDEX IF EXISTS idx_aoi_verification_status;

-- Orbital indexes
DROP INDEX IF EXISTS idx_orbital_events_entity;
DROP INDEX IF EXISTS idx_orbital_events_signed_at;
DROP INDEX IF EXISTS idx_orbital_events_type;
DROP INDEX IF EXISTS idx_orbital_events_node;
DROP INDEX IF EXISTS idx_orbital_nodes_status;

-- Contact indexes
DROP INDEX IF EXISTS idx_contact_messages_user_id;
DROP INDEX IF EXISTS idx_contact_submissions_assigned_to;
DROP INDEX IF EXISTS idx_contact_submissions_user_id;
