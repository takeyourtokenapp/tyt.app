/*
  # Fix Unindexed Foreign Keys - Part 3
  
  1. Changes - Maintenance Tables
    - daily_rewards: Add index on wallet_transaction_id
    - maintenance_invoices: Add index on wallet_transaction_id
    - maintenance_payments: Add indexes on invoice_id, transaction_id, and user_id
    
  2. Changes - Marketplace Tables
    - marketplace_sales: Add indexes on listing_id and miner_id
    
  3. Changes - Miner Tables
    - miner_upgrades: Add indexes on miner_id and transaction_id
    - nft_miners: Add index on collection_id
    
  4. Changes - Fee/Protocol Tables
    - fee_audit_log: Add index on changed_by
    - protocol_revenue: Add index on transaction_id
*/

-- Daily rewards and maintenance tables
CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id 
  ON daily_rewards(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id 
  ON maintenance_invoices(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_invoice_id 
  ON maintenance_payments(invoice_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_transaction_id 
  ON maintenance_payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_user_id 
  ON maintenance_payments(user_id);

-- Marketplace tables
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id 
  ON marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id 
  ON marketplace_sales(miner_id);

-- Miner tables
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id 
  ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id 
  ON miner_upgrades(transaction_id);

CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id 
  ON nft_miners(collection_id);

-- Fee/Protocol tables
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by 
  ON fee_audit_log(changed_by);

CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id 
  ON protocol_revenue(transaction_id);
