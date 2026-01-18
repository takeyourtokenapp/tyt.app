/*
  # Add Missing Foreign Key Indexes - Charity & Contact Tables
  
  ## Changes
  - charity_flows: transaction_id, user_id
  - charity_stakes: pool_id
  - charity_staking_rewards: stake_id
  - contact_messages: user_id
  - contact_submissions: assigned_to, user_id
*/

CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id 
  ON charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_charity_flows_user_id 
  ON charity_flows(user_id);

CREATE INDEX IF NOT EXISTS idx_charity_stakes_pool_id 
  ON charity_stakes(pool_id);

CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_stake_id 
  ON charity_staking_rewards(stake_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id 
  ON contact_messages(user_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to 
  ON contact_submissions(assigned_to);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id 
  ON contact_submissions(user_id);
