/*
  # Drop Unused Indexes - Mining & Marketplace

  1. Indexes Removed
    - Ledger and reconciliation indexes
    - Maintenance invoice indexes
    - Marketplace sales indexes
    - Miner upgrade indexes
    - Protocol revenue indexes
    - Staking and trading indexes
    - Withdrawal request indexes
*/

-- Ledger indexes
DROP INDEX IF EXISTS idx_ledger_entries_account_id;
DROP INDEX IF EXISTS idx_reconciliation_snapshots_account_id;

-- Maintenance indexes
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_sales_listing_id;
DROP INDEX IF EXISTS idx_marketplace_sales_miner_id;
DROP INDEX IF EXISTS idx_marketplace_sales_referrer_id;

-- Miner indexes
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_nft_miners_collection_id;

-- Protocol revenue indexes
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;

-- Staking indexes
DROP INDEX IF EXISTS idx_staking_rewards_stake_id;

-- Trading indexes
DROP INDEX IF EXISTS idx_tyt_trades_connected_wallet_id;

-- Withdrawal indexes
DROP INDEX IF EXISTS idx_withdrawal_requests_reviewed_by;
