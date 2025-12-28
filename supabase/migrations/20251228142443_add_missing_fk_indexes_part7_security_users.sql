/*
  # Add Missing Foreign Key Indexes - Part 7: Security & User Tables

  1. Purpose
    - Add indexes for security monitoring
    - Add indexes for user-related tables

  2. Tables Covered
    - security_alerts
    - security_events
    - user_achievements
    - user_blockchain_addresses
    - user_donation_settings
    - user_feature_access
    - user_stakes
*/

-- Security
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged_by 
  ON security_alerts(acknowledged_by);

CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved_by 
  ON security_alerts(resolved_by);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id 
  ON security_events(user_id);

-- User tables
CREATE INDEX IF NOT EXISTS idx_user_achievements_badge_code 
  ON user_achievements(badge_code);

CREATE INDEX IF NOT EXISTS idx_user_blockchain_addresses_user_id 
  ON user_blockchain_addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id 
  ON user_donation_settings(preferred_campaign_id);

CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code 
  ON user_feature_access(feature_code);

CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id 
  ON user_stakes(pool_id);