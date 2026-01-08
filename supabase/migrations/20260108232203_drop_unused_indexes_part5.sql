/*
  # Drop Unused Indexes - Part 5
  
  1. Changes
    - Drop unused indexes on bitcoin_utxos table
    - Drop unused indexes on custodial tables
    - Drop unused indexes on email_notifications table
    - Drop unused indexes on KYC tables
    - Drop unused indexes on lightning tables
    - Drop unused indexes on ledger tables
    - Drop unused indexes on protocol_revenue table
    - Drop unused indexes on staking tables
    - Drop unused indexes on user tables
    - Drop unused indexes on wallet tables
    - Drop unused indexes on withdrawal tables
  
  2. Security
    - No security changes
    - Only performance optimization
*/

-- Drop unused indexes on bitcoin_utxos
DROP INDEX IF EXISTS idx_bitcoin_utxos_address_id;

-- Drop unused indexes on custodial tables
DROP INDEX IF EXISTS idx_custodial_internal_swaps_from_wallet_id;
DROP INDEX IF EXISTS idx_custodial_internal_swaps_to_wallet_id;

-- Drop unused indexes on email_notifications
DROP INDEX IF EXISTS idx_email_notifications_submission_id;

-- Drop unused indexes on KYC tables
DROP INDEX IF EXISTS idx_kyc_documents_reviewed_by;

-- Drop unused indexes on lightning tables
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;
DROP INDEX IF EXISTS idx_lightning_invoices_user_id;

-- Drop unused indexes on ledger tables
DROP INDEX IF EXISTS idx_ledger_entries_account_id;
DROP INDEX IF EXISTS idx_reconciliation_snapshots_account_id;

-- Drop unused indexes on protocol_revenue
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;

-- Drop unused indexes on fee_audit_log
DROP INDEX IF EXISTS idx_fee_audit_log_changed_by;

-- Drop unused indexes on staking tables
DROP INDEX IF EXISTS idx_staking_rewards_stake_id;
DROP INDEX IF EXISTS idx_user_stakes_pool_id;

-- Drop unused indexes on user tables
DROP INDEX IF EXISTS idx_user_donation_settings_preferred_campaign_id;
DROP INDEX IF EXISTS idx_user_feature_access_feature_code;

-- Drop unused indexes on wallet tables
DROP INDEX IF EXISTS idx_wallet_sync_logs_connected_wallet_id;

-- Drop unused indexes on withdrawal tables
DROP INDEX IF EXISTS idx_withdrawal_requests_reviewed_by;

-- Drop unused indexes on TYT trades
DROP INDEX IF EXISTS idx_tyt_trades_connected_wallet_id;

-- Drop unused indexes on weekly distributions
DROP INDEX IF EXISTS idx_weekly_distributions_burn_cycle_id;
