/*
  # Add Missing Foreign Key Indexes - Blockchain & Bitcoin Tables
  
  ## Changes
  - bitcoin_utxos: address_id
  - blockchain_deposits: deposit_address_id, wallet_transaction_id
  - burn_mint_distributions: burn_event_id
  - burn_pool: burn_event_id
*/

CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id 
  ON bitcoin_utxos(address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_deposit_address_id 
  ON blockchain_deposits(deposit_address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id 
  ON blockchain_deposits(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id 
  ON burn_mint_distributions(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id 
  ON burn_pool(burn_event_id);
