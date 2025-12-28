/*
  # Drop Unused Indexes - Part 6: Marketplace & Miners

  1. Purpose
    - Remove unused marketplace and miner indexes

  2. Indexes Dropped
    - Marketplace: sales (multiple)
    - Miners: upgrades, nft_miners
    - Protocol: revenue
*/

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_sales_listing_id;
DROP INDEX IF EXISTS idx_marketplace_sales_miner_id;

-- Miner indexes
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_nft_miners_collection_id;

-- Protocol indexes
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;