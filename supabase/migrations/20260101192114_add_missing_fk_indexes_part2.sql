/*
  # Add Missing Foreign Key Indexes - Part 2

  Continues adding indexes for foreign keys.
  
  ## Tables Fixed (Part 2)
  - fee_audit_log
  - foundation_donation_receipts
  - foundation_grants
  - game_boosts
  - game_clan_members
  - game_clans
  - governance_proposals
  - governance_votes
  - kyc_documents
  - ledger_entries
  - marketplace_listings
  - marketplace_offers
  - marketplace_sales
  - miner_upgrades

  ## Performance Impact
  - Improves JOIN performance
  - Reduces query execution time
  - Optimizes foreign key lookups
*/

-- Fee tables
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by 
  ON fee_audit_log(changed_by);

-- Foundation tables
CREATE INDEX IF NOT EXISTS idx_foundation_donation_receipts_user_id 
  ON foundation_donation_receipts(user_id);

CREATE INDEX IF NOT EXISTS idx_foundation_grants_partner_id 
  ON foundation_grants(partner_id);

-- Game tables
CREATE INDEX IF NOT EXISTS idx_game_boosts_user_id 
  ON game_boosts(user_id);

CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan_id 
  ON game_clan_members(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_clans_leader_id 
  ON game_clans(leader_id);

-- Governance tables
CREATE INDEX IF NOT EXISTS idx_governance_proposals_proposed_by 
  ON governance_proposals(proposed_by);

CREATE INDEX IF NOT EXISTS idx_governance_votes_user_id 
  ON governance_votes(user_id);

-- KYC tables
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id 
  ON kyc_documents(user_id);

-- Ledger tables
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id 
  ON ledger_entries(account_id);

-- Marketplace tables
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id 
  ON marketplace_listings(seller_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_offers_buyer_id 
  ON marketplace_offers(buyer_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_buyer_id 
  ON marketplace_sales(buyer_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id 
  ON marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id 
  ON marketplace_sales(miner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_seller_id 
  ON marketplace_sales(seller_id);

-- Miner tables
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id 
  ON miner_upgrades(miner_id);

CREATE INDEX IF NOT EXISTS idx_miner_upgrades_user_id 
  ON miner_upgrades(user_id);
