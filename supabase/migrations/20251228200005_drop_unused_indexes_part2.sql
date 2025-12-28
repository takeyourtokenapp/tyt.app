/*
  # Drop Unused Indexes - Part 2: Blockchain & Bitcoin

  1. Purpose
    - Remove unused blockchain-related indexes

  2. Indexes Dropped
    - Bitcoin: utxos
    - Blockchain: deposits (multiple)
    - Burn: distributions, pool, weekly_distributions
*/

-- Bitcoin indexes
DROP INDEX IF EXISTS idx_bitcoin_utxos_address_id;

-- Blockchain deposit indexes
DROP INDEX IF EXISTS idx_blockchain_deposits_deposit_address_id;
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;

-- Burn indexes
DROP INDEX IF EXISTS idx_burn_mint_distributions_burn_event_id;
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_weekly_distributions_burn_cycle_id;
