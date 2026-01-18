/*
  # Add Missing Foreign Key Indexes - Academy & AOI Tables
  
  ## Problem
  Foreign keys without indexes cause slow query performance.
  
  ## Solution
  Add indexes for all foreign keys in academy and aoi tables.
  
  ## Changes
  - academy_certificates: cert_template_id, quest_id
  - academy_quest_completions: quest_id
  - academy_quiz_attempts: lesson_id
  - aoi_conversations: user_id
  - aoi_guardian_consents: student_user_id
  - aoi_interactions: user_id
  - aoi_messages: conversation_id
*/

-- Academy indexes
CREATE INDEX IF NOT EXISTS idx_academy_certificates_cert_template_id 
  ON academy_certificates(cert_template_id);

CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id 
  ON academy_certificates(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quest_completions_quest_id 
  ON academy_quest_completions(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_lesson_id 
  ON academy_quiz_attempts(lesson_id);

-- AOI indexes
CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id 
  ON aoi_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_guardian_consents_student_user_id 
  ON aoi_guardian_consents(student_user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_interactions_user_id 
  ON aoi_interactions(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_messages_conversation_id 
  ON aoi_messages(conversation_id);
