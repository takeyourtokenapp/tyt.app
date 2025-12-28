/*
  # Drop Unused Indexes - Part 1

  1. Purpose
    - Remove indexes that are not being used
    - Improves INSERT/UPDATE performance
    - Reduces storage space

  2. Indexes Removed (Academy & Bitcoin)
    - academy_certificates: quest_id
    - academy_quest_completions: quest_id
    - bitcoin_utxos: address_id
    - blockchain_deposits: deposit_address_id, wallet_transaction_id
    - burn tables: burn_event_id, burn_cycle_id

  Note: These indexes were created but query patterns don't use them
*/

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_certificates_quest_id;
DROP INDEX IF EXISTS idx_academy_quest_completions_quest_id;

-- Bitcoin indexes
DROP INDEX IF EXISTS idx_bitcoin_utxos_address_id;

-- Blockchain deposits
DROP INDEX IF EXISTS idx_blockchain_deposits_deposit_address_id;
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;

-- Burn system
DROP INDEX IF EXISTS idx_burn_mint_distributions_burn_event_id;
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_weekly_distributions_burn_cycle_id;