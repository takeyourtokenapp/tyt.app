/*
  # Drop Unused Indexes - Part 3

  1. Governance & Ledger Indexes
    - governance_execution_queue: proposal_id
    - governance_votes: user_id
    - goboxes: avatar_id
    - ledger_entries: account_id
    - reconciliation_snapshots: account_id

  2. Lightning & Maintenance Indexes
    - lightning_invoices: node_id
    - daily_rewards: wallet_transaction_id
    - maintenance_invoices: wallet_transaction_id
    - maintenance_payments: invoice_id, transaction_id, user_id
*/

-- Governance indexes
DROP INDEX IF EXISTS idx_governance_execution_queue_proposal_id;
DROP INDEX IF EXISTS idx_governance_votes_user_id;

-- Goboxes
DROP INDEX IF EXISTS idx_goboxes_avatar_id;

-- Ledger indexes
DROP INDEX IF EXISTS idx_ledger_entries_account_id;
DROP INDEX IF EXISTS idx_reconciliation_snapshots_account_id;

-- Lightning
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;

-- Maintenance & Rewards
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_payments_invoice_id;
DROP INDEX IF EXISTS idx_maintenance_payments_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_payments_user_id;