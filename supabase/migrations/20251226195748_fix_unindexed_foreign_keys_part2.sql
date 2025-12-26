/*
  # Fix Unindexed Foreign Keys - Part 2
  
  1. Changes - Game Tables
    - game_clan_members: Add index on clan_id
    - game_tournament_participants: Add indexes on clan_id and user_id
    - game_tournaments: Add index on winning_clan_id
    
  2. Changes - Governance Tables
    - governance_execution_queue: Add index on proposal_id
    - governance_votes: Add index on user_id
    
  3. Changes - Goboxes/Avatars
    - goboxes: Add index on avatar_id
    
  4. Changes - Ledger/Accounts
    - ledger_entries: Add index on account_id
    - reconciliation_snapshots: Add index on account_id
    
  5. Changes - Lightning
    - lightning_invoices: Add index on node_id
*/

-- Game tables
CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan_id 
  ON game_clan_members(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id 
  ON game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id 
  ON game_tournament_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id 
  ON game_tournaments(winning_clan_id);

-- Governance tables
CREATE INDEX IF NOT EXISTS idx_governance_execution_queue_proposal_id 
  ON governance_execution_queue(proposal_id);

CREATE INDEX IF NOT EXISTS idx_governance_votes_user_id 
  ON governance_votes(user_id);

-- Goboxes/Avatars
CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id 
  ON goboxes(avatar_id);

-- Ledger/Accounts
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id 
  ON ledger_entries(account_id);

CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id 
  ON reconciliation_snapshots(account_id);

-- Lightning
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id 
  ON lightning_invoices(node_id);
