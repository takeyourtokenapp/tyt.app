/*
  # Drop Unused Indexes - Final Cleanup

  Removes indexes that are not being used to reduce storage and maintenance overhead.

  ## Indexes Dropped
  - Unused transaction reference indexes
  - Unused user/wallet reference indexes
  - Unused AOI indexes
  - Unused profile preference indexes

  ## Performance Impact
  - Reduces database size
  - Reduces index maintenance overhead
  - Faster INSERT/UPDATE operations
  - No impact on query performance (indexes weren't being used)
*/

-- Drop blockchain/transaction related unused indexes
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;
DROP INDEX IF EXISTS idx_wallet_transactions_user_id;
DROP INDEX IF EXISTS idx_wallet_transactions_wallet_id;

-- Drop burn/charity flow unused indexes
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;
DROP INDEX IF EXISTS idx_charity_flows_user_id;

-- Drop custodial swap unused indexes
DROP INDEX IF EXISTS idx_custodial_internal_swaps_from_wallet_id;
DROP INDEX IF EXISTS idx_custodial_internal_swaps_to_wallet_id;

-- Drop foundation unused indexes
DROP INDEX IF EXISTS idx_foundation_donations_campaign_id;
DROP INDEX IF EXISTS idx_foundation_donations_donor_user_id;

-- Drop game tournament unused indexes
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_user_id;

-- Drop gobox unused indexes
DROP INDEX IF EXISTS idx_goboxes_avatar_id;
DROP INDEX IF EXISTS idx_goboxes_user_id;

-- Drop KYC unused indexes
DROP INDEX IF EXISTS idx_kyc_documents_reviewed_by;
DROP INDEX IF EXISTS idx_withdrawal_requests_reviewed_by;

-- Drop lightning unused indexes
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;
DROP INDEX IF EXISTS idx_lightning_invoices_user_id;

-- Drop marketplace unused indexes
DROP INDEX IF EXISTS idx_marketplace_sales_referrer_id;

-- Drop NFT unused indexes
DROP INDEX IF EXISTS idx_nft_miners_collection_id;

-- Drop profile unused indexes
DROP INDEX IF EXISTS idx_profiles_referred_by;
DROP INDEX IF EXISTS idx_profiles_preferred_language;
DROP INDEX IF EXISTS idx_profiles_preferred_theme;

-- Drop AOI unused indexes
DROP INDEX IF EXISTS idx_aoi_user_progress_user_id;
DROP INDEX IF EXISTS idx_aoi_guardian_consents_student_id;
DROP INDEX IF EXISTS idx_aoi_achievements_user_id;
DROP INDEX IF EXISTS idx_aoi_interactions_user_id;
DROP INDEX IF EXISTS idx_aoi_conversations_user_id;
DROP INDEX IF EXISTS idx_aoi_messages_conversation_id;
