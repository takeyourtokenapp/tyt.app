/*
  # Add Missing Foreign Key Indexes - Marketplace & Miners
  
  ## Changes
  - maintenance_invoices: wallet_transaction_id
  - marketplace_sales: listing_id, miner_id, referrer_id
  - miner_upgrades: miner_id, transaction_id
  - nft_miners: collection_id
*/

CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id 
  ON maintenance_invoices(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id 
  ON marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id 
  ON marketplace_sales(miner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_referrer_id 
  ON marketplace_sales(referrer_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id 
  ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id 
  ON miner_upgrades(transaction_id);

CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id 
  ON nft_miners(collection_id);
