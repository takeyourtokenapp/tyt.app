/*
  # Drop Unused Indexes - Part 5: Rewards & Maintenance

  1. Purpose
    - Remove unused rewards and maintenance indexes

  2. Indexes Dropped
    - Daily rewards: wallet_transaction_id
    - Maintenance: invoices, payments (multiple)
    - Reward claims: reward_id, user_id
    - Staking: rewards
*/

-- Daily rewards indexes
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;

-- Maintenance indexes
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_payments_invoice_id;
DROP INDEX IF EXISTS idx_maintenance_payments_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_payments_user_id;

-- Reward claims indexes
DROP INDEX IF EXISTS idx_reward_claims_reward_id;
DROP INDEX IF EXISTS idx_reward_claims_user_id;

-- Staking indexes
DROP INDEX IF EXISTS idx_staking_rewards_stake_id;
