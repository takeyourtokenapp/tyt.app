/*
  # Drop Unused Indexes - Blockchain & Wallet

  1. Indexes Removed
    - Bitcoin and blockchain deposit indexes
    - Custodial swap indexes
    - Daily rewards indexes
    - Lightning network indexes
    - Wallet transaction indexes
*/

-- Bitcoin indexes
DROP INDEX IF EXISTS idx_bitcoin_utxos_address_id;

-- Blockchain deposit indexes
DROP INDEX IF EXISTS idx_blockchain_deposits_deposit_address_id;
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;

-- Custodial swap indexes
DROP INDEX IF EXISTS idx_custodial_internal_swaps_from_wallet_id;
DROP INDEX IF EXISTS idx_custodial_internal_swaps_to_wallet_id;

-- Daily rewards indexes
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;

-- Lightning indexes
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;
DROP INDEX IF EXISTS idx_lightning_invoices_user_id;

-- Wallet transaction indexes
DROP INDEX IF EXISTS idx_wallet_transactions_wallet_id;
DROP INDEX IF EXISTS idx_wallet_sync_logs_connected_wallet_id;
