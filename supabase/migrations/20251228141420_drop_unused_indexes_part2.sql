/*
  # Drop Unused Indexes - Part 2

  1. Foundation & Charity Indexes
    - charity_flows: transaction_id
    - foundation tables: grant_id, campaign_id, partner_id, user_id

  2. Game System Indexes
    - game_clan_members: clan_id
    - game_tournament_participants: clan_id, user_id
    - game_tournaments: winning_clan_id
*/

-- Charity indexes
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;

-- Foundation indexes
DROP INDEX IF EXISTS idx_foundation_allocations_grant_id;
DROP INDEX IF EXISTS idx_foundation_donations_campaign_id;
DROP INDEX IF EXISTS idx_foundation_grants_partner_id;
DROP INDEX IF EXISTS idx_foundation_transactions_user_id;

-- Game system indexes
DROP INDEX IF EXISTS idx_game_clan_members_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_clan_id;
DROP INDEX IF EXISTS idx_game_tournament_participants_user_id;
DROP INDEX IF EXISTS idx_game_tournaments_winning_clan_id;