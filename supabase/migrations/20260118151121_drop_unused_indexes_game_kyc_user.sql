/*
  # Drop Unused Indexes - Game, KYC & User

  1. Indexes Removed
    - Game system indexes (clans, tournaments, goboxes)
    - KYC document indexes
    - User profile and feature access indexes
    - Fee audit log indexes
*/

-- Game indexes
DROP INDEX IF EXISTS idx_game_clan_members_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_user_id;
DROP INDEX IF EXISTS idx_goboxes_avatar_id;
DROP INDEX IF EXISTS idx_goboxes_user_id;

-- KYC indexes
DROP INDEX IF EXISTS idx_kyc_documents_reviewed_by;

-- User & Profile indexes
DROP INDEX IF EXISTS idx_profiles_referred_by;
DROP INDEX IF EXISTS idx_user_donation_settings_preferred_campaign_id;
DROP INDEX IF EXISTS idx_user_feature_access_feature_code;
DROP INDEX IF EXISTS idx_user_stakes_pool_id;

-- Fee audit indexes
DROP INDEX IF EXISTS idx_fee_audit_log_changed_by;
