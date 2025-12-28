/*
  # Drop Unused Indexes - Part 4

  1. Marketplace & Miner Indexes
    - marketplace_sales: listing_id, miner_id
    - miner_upgrades: miner_id, transaction_id
    - nft_miners: collection_id

  2. Protocol & Rewards Indexes
    - fee_audit_log: changed_by
    - protocol_revenue: transaction_id
    - reward_claims: reward_id, user_id
    - staking_rewards: stake_id
*/

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_sales_listing_id;
DROP INDEX IF EXISTS idx_marketplace_sales_miner_id;

-- Miner indexes
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_nft_miners_collection_id;

-- Protocol indexes
DROP INDEX IF EXISTS idx_fee_audit_log_changed_by;
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;

-- Rewards indexes
DROP INDEX IF EXISTS idx_reward_claims_reward_id;
DROP INDEX IF EXISTS idx_reward_claims_user_id;
DROP INDEX IF EXISTS idx_staking_rewards_stake_id;