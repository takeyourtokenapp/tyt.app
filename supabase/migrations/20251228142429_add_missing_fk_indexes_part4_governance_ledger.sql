/*
  # Add Missing Foreign Key Indexes - Part 4: Governance & Ledger Tables

  1. Purpose
    - Add indexes for governance voting system
    - Add indexes for double-entry ledger system

  2. Tables Covered
    - governance_execution_queue
    - governance_votes
    - ledger_entries
    - reconciliation_snapshots
    - goboxes (avatars)
*/

-- Governance
CREATE INDEX IF NOT EXISTS idx_governance_execution_queue_proposal_id 
  ON governance_execution_queue(proposal_id);

CREATE INDEX IF NOT EXISTS idx_governance_votes_user_id 
  ON governance_votes(user_id);

-- Ledger system
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id 
  ON ledger_entries(account_id);

CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id 
  ON reconciliation_snapshots(account_id);

-- Avatars
CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id 
  ON goboxes(avatar_id);