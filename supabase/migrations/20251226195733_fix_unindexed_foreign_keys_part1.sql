/*
  # Fix Unindexed Foreign Keys - Part 1
  
  1. Performance Optimization
    - Add indexes to all foreign key columns that don't have covering indexes
    - This improves JOIN performance and foreign key constraint checking
    - Critical for query performance at scale
  
  2. Changes - Academy Tables
    - academy_certificates: Add index on quest_id
    - academy_quest_completions: Add index on quest_id
    
  3. Changes - Bitcoin/Blockchain Tables
    - bitcoin_utxos: Add index on address_id
    - blockchain_deposits: Add indexes on deposit_address_id and wallet_transaction_id
    
  4. Changes - Burn/Treasury Tables
    - burn_mint_distributions: Add index on burn_event_id
    - burn_pool: Add index on burn_event_id
    - weekly_distributions: Add index on burn_cycle_id
    
  5. Changes - Charity/Foundation Tables
    - charity_flows: Add index on transaction_id
    - foundation_allocations: Add index on grant_id
    - foundation_donations: Add index on campaign_id
    - foundation_grants: Add index on partner_id
    - foundation_transactions: Add index on user_id
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id 
  ON academy_certificates(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quest_completions_quest_id 
  ON academy_quest_completions(quest_id);

-- Bitcoin/Blockchain tables
CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id 
  ON bitcoin_utxos(address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_deposit_address_id 
  ON blockchain_deposits(deposit_address_id);

CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id 
  ON blockchain_deposits(wallet_transaction_id);

-- Burn/Treasury tables
CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id 
  ON burn_mint_distributions(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id 
  ON burn_pool(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id 
  ON weekly_distributions(burn_cycle_id);

-- Charity/Foundation tables
CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id 
  ON charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_foundation_allocations_grant_id 
  ON foundation_allocations(grant_id);

CREATE INDEX IF NOT EXISTS idx_foundation_donations_campaign_id 
  ON foundation_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_foundation_grants_partner_id 
  ON foundation_grants(partner_id);

CREATE INDEX IF NOT EXISTS idx_foundation_transactions_user_id 
  ON foundation_transactions(user_id);
