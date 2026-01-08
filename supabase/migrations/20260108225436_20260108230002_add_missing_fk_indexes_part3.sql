/*
  # Add Missing Foreign Key Indexes - Part 3

  1. Performance Optimization
    - Continue adding indexes for foreign keys

  2. Tables Covered
    - kyc_documents
    - lightning_invoices
    - maintenance_invoices
    - marketplace_sales
    - miner_upgrades
    - nft_miners
    - profiles
    - protocol_revenue
    - wallet_transactions
    - withdrawal_requests
*/

-- kyc_documents
CREATE INDEX IF NOT EXISTS idx_kyc_documents_reviewed_by 
  ON kyc_documents(reviewed_by);

-- lightning_invoices (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id 
  ON lightning_invoices(node_id);

CREATE INDEX IF NOT EXISTS idx_lightning_invoices_user_id 
  ON lightning_invoices(user_id);

-- maintenance_invoices
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id 
  ON maintenance_invoices(wallet_transaction_id);

-- marketplace_sales
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_referrer_id 
  ON marketplace_sales(referrer_id);

-- miner_upgrades
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id 
  ON miner_upgrades(transaction_id);

-- nft_miners
CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id 
  ON nft_miners(collection_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by 
  ON profiles(referred_by);

-- protocol_revenue
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id 
  ON protocol_revenue(transaction_id);

-- wallet_transactions (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id 
  ON wallet_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id 
  ON wallet_transactions(wallet_id);

-- withdrawal_requests
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reviewed_by 
  ON withdrawal_requests(reviewed_by);
