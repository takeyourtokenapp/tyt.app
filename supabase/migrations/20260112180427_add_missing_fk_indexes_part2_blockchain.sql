/*
  # Add Missing Foreign Key Indexes - Part 2: Blockchain Tables

  1. Purpose
    - Add indexes to foreign key columns for blockchain-related tables
    - Critical for deposit tracking and UTXO management

  2. Tables Updated (6 indexes)
    - bitcoin_utxos (1 index)
    - blockchain_deposits (2 indexes)
    - custodial_internal_swaps (2 indexes)
    - daily_rewards (1 index)

  3. Impact
    - Faster deposit confirmation lookups
    - Improved UTXO query performance
    - Better internal swap tracking
*/

-- Bitcoin UTXOs
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id 
ON bitcoin_utxos(address_id);

-- Blockchain Deposits
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_deposit_address_id 
ON blockchain_deposits(deposit_address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id 
ON blockchain_deposits(wallet_transaction_id);

-- Custodial Internal Swaps
CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_from_wallet_id 
ON custodial_internal_swaps(from_wallet_id);

CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_to_wallet_id 
ON custodial_internal_swaps(to_wallet_id);

-- Daily Rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id 
ON daily_rewards(wallet_transaction_id);
