/*
  # Drop Unused Indexes - Part 4: Governance & Ledger

  1. Purpose
    - Remove unused governance and ledger indexes

  2. Indexes Dropped
    - Governance: execution_queue, votes
    - Ledger: entries, reconciliation_snapshots
    - Goboxes: avatar_id
    - Lightning: invoices
*/

-- Governance indexes
DROP INDEX IF EXISTS idx_governance_execution_queue_proposal_id;
DROP INDEX IF EXISTS idx_governance_votes_user_id;

-- Ledger indexes
DROP INDEX IF EXISTS idx_ledger_entries_account_id;
DROP INDEX IF EXISTS idx_reconciliation_snapshots_account_id;

-- Goboxes indexes
DROP INDEX IF EXISTS idx_goboxes_avatar_id;

-- Lightning indexes
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;
