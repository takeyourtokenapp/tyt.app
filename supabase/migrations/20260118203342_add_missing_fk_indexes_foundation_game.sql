/*
  # Add Missing Foreign Key Indexes - Foundation & Game Tables
  
  ## Changes
  - foundation_donations: campaign_id, donor_user_id
  - foundation_grants: partner_id
  - game_clan_members: clan_id
  - game_tournament_participants: clan_id, user_id
  - game_tournaments: winning_clan_id, winning_user_id
  - goboxes: avatar_id, user_id
*/

CREATE INDEX IF NOT EXISTS idx_foundation_donations_campaign_id 
  ON foundation_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_foundation_donations_donor_user_id 
  ON foundation_donations(donor_user_id);

CREATE INDEX IF NOT EXISTS idx_foundation_grants_partner_id 
  ON foundation_grants(partner_id);

CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan_id 
  ON game_clan_members(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id 
  ON game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id 
  ON game_tournament_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id 
  ON game_tournaments(winning_clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_user_id 
  ON game_tournaments(winning_user_id);

CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id 
  ON goboxes(avatar_id);

CREATE INDEX IF NOT EXISTS idx_goboxes_user_id 
  ON goboxes(user_id);
