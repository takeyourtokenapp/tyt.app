/*
  # Add Missing Foreign Key Indexes - Part 2: Blockchain Tables

  1. Purpose
    - Add indexes for blockchain-related foreign keys
    - Improves deposit monitoring and UTXO management

  2. Tables Covered
    - bitcoin_utxos
    - blockchain_deposits
    - burn_mint_distributions
    - burn_pool
    - weekly_distributions
*/

-- Bitcoin tables
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id 
  ON bitcoin_utxos(address_id);

-- Blockchain deposits
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_deposit_address_id 
  ON blockchain_deposits(deposit_address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id 
  ON blockchain_deposits(wallet_transaction_id);

-- Burn system
CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id 
  ON burn_mint_distributions(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id 
  ON burn_pool(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id 
  ON weekly_distributions(burn_cycle_id);