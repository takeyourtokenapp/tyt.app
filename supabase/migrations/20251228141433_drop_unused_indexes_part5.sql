/*
  # Drop Unused Indexes - Part 5

  1. Security & User Indexes
    - security_events: user_id
    - user_stakes: pool_id
    - user_blockchain_addresses: user_id
    - user_donation_settings: preferred_campaign_id
    - user_feature_access: feature_code

  2. Foundation Admin Indexes
    - foundation_allocations: approved_by
    - foundation_impact_reports: published_by
    - security_alerts: acknowledged_by, resolved_by

  3. Achievements
    - user_achievements: badge_code
*/

-- Security indexes
DROP INDEX IF EXISTS idx_security_events_user_id;

-- User indexes
DROP INDEX IF EXISTS idx_user_stakes_pool_id;
DROP INDEX IF EXISTS idx_user_blockchain_addresses_user_id;
DROP INDEX IF EXISTS idx_user_donation_settings_preferred_campaign_id;
DROP INDEX IF EXISTS idx_user_feature_access_feature_code;

-- Foundation admin indexes
DROP INDEX IF EXISTS idx_foundation_allocations_approved_by;
DROP INDEX IF EXISTS idx_foundation_impact_reports_published_by;

-- Security alerts
DROP INDEX IF EXISTS idx_security_alerts_acknowledged_by;
DROP INDEX IF EXISTS idx_security_alerts_resolved_by;

-- Achievements
DROP INDEX IF EXISTS idx_user_achievements_badge_code;