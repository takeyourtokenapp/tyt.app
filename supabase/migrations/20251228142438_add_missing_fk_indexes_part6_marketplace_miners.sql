/*
  # Add Missing Foreign Key Indexes - Part 6: Marketplace & Miners Tables

  1. Purpose
    - Add indexes for marketplace operations
    - Add indexes for NFT miner management

  2. Tables Covered
    - marketplace_sales
    - miner_upgrades
    - nft_miners
    - protocol_revenue
    - fee_audit_log
*/

-- Marketplace
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id 
  ON marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id 
  ON marketplace_sales(miner_id);

-- Miners
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id 
  ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id 
  ON miner_upgrades(transaction_id);

CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id 
  ON nft_miners(collection_id);

-- Protocol revenue
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id 
  ON protocol_revenue(transaction_id);

-- Fee audit
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by 
  ON fee_audit_log(changed_by);