/*
  # Drop Unused Indexes - Part 3
  
  1. Changes
    - Drop unused indexes on blockchain_deposits table
    - Drop unused indexes on wallet_transactions table
    - Drop unused indexes on daily_rewards table
    - Drop unused indexes on maintenance_invoices table
    - Drop unused indexes on burn and charity related tables
  
  2. Security
    - No security changes
    - Only performance optimization
*/

-- Drop unused indexes on blockchain_deposits
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;
DROP INDEX IF EXISTS idx_blockchain_deposits_deposit_address_id;

-- Drop unused indexes on wallet_transactions
DROP INDEX IF EXISTS idx_wallet_transactions_user_id;
DROP INDEX IF EXISTS idx_wallet_transactions_wallet_id;

-- Drop unused indexes on daily_rewards
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;

-- Drop unused indexes on maintenance_invoices
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;

-- Drop unused indexes on burn tables
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_burn_mint_distributions_burn_event_id;

-- Drop unused indexes on charity tables
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;
DROP INDEX IF EXISTS idx_charity_flows_user_id;
DROP INDEX IF EXISTS idx_charity_stakes_pool_id;
DROP INDEX IF EXISTS idx_charity_staking_rewards_stake_id;
