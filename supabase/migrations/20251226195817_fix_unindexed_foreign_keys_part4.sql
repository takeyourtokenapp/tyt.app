/*
  # Fix Unindexed Foreign Keys - Part 4 (Final)
  
  1. Changes - Rewards Tables
    - reward_claims: Add indexes on reward_id and user_id
    - staking_rewards: Add index on stake_id
    
  2. Changes - Security Tables
    - security_events: Add index on user_id
    
  3. Changes - Staking Tables
    - user_stakes: Add index on pool_id
    
  4. Changes - User Tables
    - user_blockchain_addresses: Add index on user_id
    - user_donation_settings: Add index on preferred_campaign_id
    - user_feature_access: Add index on feature_code
*/

-- Rewards tables
CREATE INDEX IF NOT EXISTS idx_reward_claims_reward_id 
  ON reward_claims(reward_id);

CREATE INDEX IF NOT EXISTS idx_reward_claims_user_id 
  ON reward_claims(user_id);

CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id 
  ON staking_rewards(stake_id);

-- Security tables
CREATE INDEX IF NOT EXISTS idx_security_events_user_id 
  ON security_events(user_id);

-- Staking tables
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id 
  ON user_stakes(pool_id);

-- User tables
CREATE INDEX IF NOT EXISTS idx_user_blockchain_addresses_user_id 
  ON user_blockchain_addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id 
  ON user_donation_settings(preferred_campaign_id);

CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code 
  ON user_feature_access(feature_code);
