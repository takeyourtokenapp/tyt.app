/*
  # Security Audit Fixes - Part 2: Drop More Unused Indexes

  Continues dropping unused indexes to improve write performance and reduce storage.
*/

-- Marketplace indexes
DROP INDEX IF EXISTS idx_marketplace_listings_price;
DROP INDEX IF EXISTS idx_marketplace_offers_listing;
DROP INDEX IF EXISTS idx_marketplace_sales_date;
DROP INDEX IF EXISTS idx_marketplace_sales_listing_id;
DROP INDEX IF EXISTS idx_marketplace_sales_miner_id;

-- Avatars & GOBoxes
DROP INDEX IF EXISTS idx_avatars_rarity;
DROP INDEX IF EXISTS idx_goboxes_avatar_id;

-- Referrals
DROP INDEX IF EXISTS idx_referral_earnings_status;
DROP INDEX IF EXISTS idx_ambassadors_tier;

-- Academy indexes
DROP INDEX IF EXISTS idx_academy_quest_completions_quest;
DROP INDEX IF EXISTS idx_academy_certificates_quest_id;
DROP INDEX IF EXISTS idx_academy_quests_type;
DROP INDEX IF EXISTS idx_academy_quests_difficulty;

-- Foundation indexes
DROP INDEX IF EXISTS idx_foundation_campaigns_status;
DROP INDEX IF EXISTS idx_foundation_campaigns_dates;
DROP INDEX IF EXISTS idx_foundation_donations_campaign;
DROP INDEX IF EXISTS idx_foundation_donations_chain;
DROP INDEX IF EXISTS idx_foundation_donations_date;
DROP INDEX IF EXISTS idx_foundation_donation_receipts_tax_year;
DROP INDEX IF EXISTS idx_foundation_research_partners_type;
DROP INDEX IF EXISTS idx_foundation_research_partners_verified;
DROP INDEX IF EXISTS idx_foundation_grants_partner;
DROP INDEX IF EXISTS idx_foundation_grants_status;
DROP INDEX IF EXISTS idx_foundation_grants_dates;
DROP INDEX IF EXISTS idx_foundation_grant_milestones_grant;
DROP INDEX IF EXISTS idx_foundation_grant_milestones_status;
DROP INDEX IF EXISTS idx_foundation_family_support_status;
DROP INDEX IF EXISTS idx_foundation_family_support_type;
DROP INDEX IF EXISTS idx_foundation_impact_metrics_period;
DROP INDEX IF EXISTS idx_foundation_transparency_reports_year;
DROP INDEX IF EXISTS idx_foundation_tx_source;
DROP INDEX IF EXISTS idx_foundation_tx_user;
DROP INDEX IF EXISTS idx_foundation_tx_destination;
DROP INDEX IF EXISTS idx_foundation_tx_asset;
DROP INDEX IF EXISTS idx_foundation_tx_fiscal;
DROP INDEX IF EXISTS idx_foundation_tx_created;
DROP INDEX IF EXISTS idx_foundation_alloc_grant;
DROP INDEX IF EXISTS idx_foundation_alloc_asset;
DROP INDEX IF EXISTS idx_foundation_alloc_date;
DROP INDEX IF EXISTS idx_foundation_reports_period;
DROP INDEX IF EXISTS idx_foundation_reports_published;

-- Security indexes
DROP INDEX IF EXISTS idx_security_events_type;
DROP INDEX IF EXISTS idx_security_events_severity;
DROP INDEX IF EXISTS idx_security_events_user_id;
DROP INDEX IF EXISTS idx_security_events_created_at;
DROP INDEX IF EXISTS idx_security_events_ip_address;
DROP INDEX IF EXISTS idx_security_alerts_type;
DROP INDEX IF EXISTS idx_security_alerts_severity;
DROP INDEX IF EXISTS idx_security_alerts_status;
DROP INDEX IF EXISTS idx_security_alerts_created_at;

-- Game indexes
DROP INDEX IF EXISTS idx_game_clan_members_clan;
DROP INDEX IF EXISTS idx_game_tournaments_status;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;