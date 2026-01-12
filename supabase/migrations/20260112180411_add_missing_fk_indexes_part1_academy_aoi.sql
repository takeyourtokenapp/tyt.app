/*
  # Add Missing Foreign Key Indexes - Part 1: Academy & aOi Tables

  1. Purpose
    - Add indexes to foreign key columns for optimal query performance
    - Foreign keys without indexes cause full table scans during JOIN operations
    - These indexes are critical for application performance at scale

  2. Tables Updated (10 indexes)
    - academy_certificates (2 indexes)
    - academy_quest_completions (1 index)
    - academy_quiz_attempts (1 index)
    - aoi_conversations (1 index)
    - aoi_guardian_consents (1 index)
    - aoi_interactions (1 index)
    - aoi_messages (1 index)
    - contact_messages (1 index)
    - contact_submissions (2 indexes)

  3. Impact
    - Dramatically improves JOIN performance
    - Reduces database CPU usage
    - Essential for foreign key constraint checks
*/

-- Academy Certificates
CREATE INDEX IF NOT EXISTS idx_academy_certificates_cert_template_id 
ON academy_certificates(cert_template_id);

CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id 
ON academy_certificates(quest_id);

-- Academy Quest Completions
CREATE INDEX IF NOT EXISTS idx_academy_quest_completions_quest_id 
ON academy_quest_completions(quest_id);

-- Academy Quiz Attempts
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_lesson_id 
ON academy_quiz_attempts(lesson_id);

-- aOi Conversations
CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id 
ON aoi_conversations(user_id);

-- aOi Guardian Consents
CREATE INDEX IF NOT EXISTS idx_aoi_guardian_consents_student_user_id 
ON aoi_guardian_consents(student_user_id);

-- aOi Interactions
CREATE INDEX IF NOT EXISTS idx_aoi_interactions_user_id 
ON aoi_interactions(user_id);

-- aOi Messages
CREATE INDEX IF NOT EXISTS idx_aoi_messages_conversation_id 
ON aoi_messages(conversation_id);

-- Contact Messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id 
ON contact_messages(user_id);

-- Contact Submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to 
ON contact_submissions(assigned_to);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id 
ON contact_submissions(user_id);
