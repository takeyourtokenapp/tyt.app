/*
  # Drop Unused Indexes - Part 3: Foundation & Game

  1. Purpose
    - Remove unused foundation and game indexes

  2. Indexes Dropped
    - Charity: flows
    - Foundation: allocations, donations, grants, impact_reports, transactions
    - Game: clan_members, tournament_participants, tournaments
*/

-- Charity indexes
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;

-- Foundation indexes
DROP INDEX IF EXISTS idx_foundation_allocations_approved_by;
DROP INDEX IF EXISTS idx_foundation_allocations_grant_id;
DROP INDEX IF EXISTS idx_foundation_donations_campaign_id;
DROP INDEX IF EXISTS idx_foundation_grants_partner_id;
DROP INDEX IF EXISTS idx_foundation_impact_reports_published_by;
DROP INDEX IF EXISTS idx_foundation_transactions_user_id;

-- Game indexes
DROP INDEX IF EXISTS idx_game_clan_members_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;