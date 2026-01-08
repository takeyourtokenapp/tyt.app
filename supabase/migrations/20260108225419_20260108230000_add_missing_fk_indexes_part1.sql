/*
  # Add Missing Foreign Key Indexes - Part 1

  1. Performance Optimization
    - Add indexes for foreign keys that are missing them
    - This significantly improves JOIN performance and query optimization

  2. Tables Covered
    - aoi_conversations
    - aoi_guardian_consents
    - aoi_interactions
    - aoi_messages
    - blockchain_deposits
    - burn_pool
    - charity_flows
    - contact_submissions
*/

-- aoi_conversations
CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id 
  ON aoi_conversations(user_id);

-- aoi_guardian_consents
CREATE INDEX IF NOT EXISTS idx_aoi_guardian_consents_student_user_id 
  ON aoi_guardian_consents(student_user_id);

-- aoi_interactions
CREATE INDEX IF NOT EXISTS idx_aoi_interactions_user_id 
  ON aoi_interactions(user_id);

-- aoi_messages
CREATE INDEX IF NOT EXISTS idx_aoi_messages_conversation_id 
  ON aoi_messages(conversation_id);

-- blockchain_deposits
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id 
  ON blockchain_deposits(wallet_transaction_id);

-- burn_pool
CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id 
  ON burn_pool(burn_event_id);

-- charity_flows (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id 
  ON charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_charity_flows_user_id 
  ON charity_flows(user_id);

-- contact_submissions (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to 
  ON contact_submissions(assigned_to);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id 
  ON contact_submissions(user_id);
