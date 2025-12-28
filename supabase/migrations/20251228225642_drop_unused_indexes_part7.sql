/*
  # Drop Unused Indexes - Part 7: Security & Users

  1. Purpose
    - Remove unused security and user indexes

  2. Indexes Dropped
    - Fee audit: changed_by
    - Security: alerts, events
    - User: achievements, blockchain_addresses, donation_settings, feature_access, stakes
    - Profiles: ui_preferences
*/

-- Fee audit indexes
DROP INDEX IF EXISTS idx_fee_audit_log_changed_by;

-- Security indexes
DROP INDEX IF EXISTS idx_security_alerts_acknowledged_by;
DROP INDEX IF EXISTS idx_security_alerts_resolved_by;
DROP INDEX IF EXISTS idx_security_events_user_id;

-- User indexes
DROP INDEX IF EXISTS idx_user_achievements_badge_code;
DROP INDEX IF EXISTS idx_user_blockchain_addresses_user_id;
DROP INDEX IF EXISTS idx_user_donation_settings_preferred_campaign_id;
DROP INDEX IF EXISTS idx_user_feature_access_feature_code;
DROP INDEX IF EXISTS idx_user_stakes_pool_id;

-- Profile indexes
DROP INDEX IF EXISTS idx_profiles_ui_preferences;