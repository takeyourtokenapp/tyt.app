/*
  # Add Missing Foreign Key Indexes - Part 5: Ledger & Marketplace Tables

  1. Purpose
    - Add indexes to foreign key columns for ledger and marketplace operations
    - Critical for accounting integrity and NFT trading

  2. Tables Updated (9 indexes)
    - ledger_entries (1 index)
    - lightning_invoices (2 indexes)
    - maintenance_invoices (1 index)
    - marketplace_sales (3 indexes)
    - miner_upgrades (2 indexes)

  3. Impact
    - Faster double-entry ledger reconciliation
    - Improved Lightning Network payment tracking
    - Better marketplace analytics
    - Optimized miner upgrade history
*/

-- Ledger Entries (Double-Entry Accounting)
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id 
ON ledger_entries(account_id);

-- Lightning Invoices
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id 
ON lightning_invoices(node_id);

CREATE INDEX IF NOT EXISTS idx_lightning_invoices_user_id 
ON lightning_invoices(user_id);

-- Maintenance Invoices
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id 
ON maintenance_invoices(wallet_transaction_id);

-- Marketplace Sales
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id 
ON marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id 
ON marketplace_sales(miner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_referrer_id 
ON marketplace_sales(referrer_id);

-- Miner Upgrades
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id 
ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id 
ON miner_upgrades(transaction_id);
