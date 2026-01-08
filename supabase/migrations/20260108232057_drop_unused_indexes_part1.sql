/*
  # Drop Unused Indexes - Part 1
  
  1. Changes
    - Drop unused indexes on profiles table
    - Drop unused indexes on contact_messages table
    - Drop unused indexes on contact_submission_rate_limits table
    - Drop unused indexes on incoming_messages table
  
  2. Security
    - No security changes
    - Only performance optimization
  
  3. Notes
    - These indexes have not been used according to database analysis
    - Removing them will improve write performance and reduce storage
*/

-- Drop unused indexes on profiles
DROP INDEX IF EXISTS idx_profiles_is_admin;
DROP INDEX IF EXISTS idx_profiles_referred_by;

-- Drop unused indexes on contact_messages
DROP INDEX IF EXISTS idx_contact_messages_user_id;
DROP INDEX IF EXISTS idx_contact_messages_email;
DROP INDEX IF EXISTS idx_contact_messages_is_read;
DROP INDEX IF EXISTS idx_contact_messages_created_at;

-- Drop unused indexes on contact_submission_rate_limits
DROP INDEX IF EXISTS idx_rate_limits_ip;
DROP INDEX IF EXISTS idx_rate_limits_email;
DROP INDEX IF EXISTS idx_rate_limits_blocked;

-- Drop unused indexes on incoming_messages
DROP INDEX IF EXISTS idx_incoming_messages_to_email;
DROP INDEX IF EXISTS idx_incoming_messages_status;
DROP INDEX IF EXISTS idx_incoming_messages_received_at;
