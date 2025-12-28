/*
  # Add Missing Foreign Key Indexes - Part 3: Foundation & Game Tables

  1. Purpose
    - Add indexes for foundation charity system
    - Add indexes for game/clan features

  2. Tables Covered
    - charity_flows
    - foundation_allocations
    - foundation_donations
    - foundation_grants
    - foundation_impact_reports
    - foundation_transactions
    - game_clan_members
    - game_tournament_participants
    - game_tournaments
*/

-- Charity & Foundation
CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id 
  ON charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_foundation_allocations_approved_by 
  ON foundation_allocations(approved_by);

CREATE INDEX IF NOT EXISTS idx_foundation_allocations_grant_id 
  ON foundation_allocations(grant_id);

CREATE INDEX IF NOT EXISTS idx_foundation_donations_campaign_id 
  ON foundation_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_foundation_grants_partner_id 
  ON foundation_grants(partner_id);

CREATE INDEX IF NOT EXISTS idx_foundation_impact_reports_published_by 
  ON foundation_impact_reports(published_by);

CREATE INDEX IF NOT EXISTS idx_foundation_transactions_user_id 
  ON foundation_transactions(user_id);

-- Game & Clans
CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan_id 
  ON game_clan_members(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id 
  ON game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id 
  ON game_tournament_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id 
  ON game_tournaments(winning_clan_id);