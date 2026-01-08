/*
  # Drop Unused Indexes - Part 4
  
  1. Changes
    - Drop unused indexes on foundation tables
    - Drop unused indexes on game tables
    - Drop unused indexes on marketplace tables
    - Drop unused indexes on miner tables
    - Drop unused indexes on academy tables
  
  2. Security
    - No security changes
    - Only performance optimization
*/

-- Drop unused indexes on foundation tables
DROP INDEX IF EXISTS idx_foundation_donations_campaign_id;
DROP INDEX IF EXISTS idx_foundation_donations_donor_user_id;
DROP INDEX IF EXISTS idx_foundation_grants_partner_id;

-- Drop unused indexes on game tables
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_user_id;
DROP INDEX IF EXISTS idx_game_clan_members_clan_id;

-- Drop unused indexes on goboxes table
DROP INDEX IF EXISTS idx_goboxes_avatar_id;
DROP INDEX IF EXISTS idx_goboxes_user_id;

-- Drop unused indexes on marketplace tables
DROP INDEX IF EXISTS idx_marketplace_sales_referrer_id;
DROP INDEX IF EXISTS idx_marketplace_sales_listing_id;
DROP INDEX IF EXISTS idx_marketplace_sales_miner_id;

-- Drop unused indexes on miner tables
DROP INDEX IF EXISTS idx_nft_miners_collection_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id;

-- Drop unused indexes on academy tables
DROP INDEX IF EXISTS idx_academy_certificates_cert_template_id;
DROP INDEX IF EXISTS idx_academy_certificates_quest_id;
DROP INDEX IF EXISTS idx_academy_quest_completions_quest_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_lesson_id;
