/*
  # Drop Unused Indexes - Part 2
  
  1. Changes
    - Drop unused indexes on aoi_* tables
    - Drop unused indexes on contact_submissions table
    - Drop unused indexes on foundation_contact_submissions table
  
  2. Security
    - No security changes
    - Only performance optimization
  
  3. Notes
    - These indexes have not been used according to database analysis
*/

-- Drop unused indexes on aoi tables
DROP INDEX IF EXISTS idx_aoi_conversations_user_id;
DROP INDEX IF EXISTS idx_aoi_guardian_consents_student_user_id;
DROP INDEX IF EXISTS idx_aoi_interactions_user_id;
DROP INDEX IF EXISTS idx_aoi_messages_conversation_id;

-- Drop unused indexes on contact_submissions
DROP INDEX IF EXISTS idx_contact_submissions_assigned_to;
DROP INDEX IF EXISTS idx_contact_submissions_user_id;

-- Drop unused indexes on foundation_contact_submissions
DROP INDEX IF EXISTS idx_submissions_email;
DROP INDEX IF EXISTS idx_submissions_status;
