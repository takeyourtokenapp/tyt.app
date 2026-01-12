/*
  # Add Missing Foreign Key Indexes - Part 4: Foundation & Gaming Tables

  1. Purpose
    - Add indexes to foreign key columns for Foundation and gaming features
    - Critical for donation tracking and clan management

  2. Tables Updated (11 indexes)
    - foundation_donations (2 indexes)
    - foundation_grants (1 index)
    - game_clan_members (1 index)
    - game_tournament_participants (2 indexes)
    - game_tournaments (2 indexes)
    - goboxes (2 indexes)
    - kyc_documents (1 index)

  3. Impact
    - Faster donation queries for transparency
    - Improved gaming leaderboard performance
    - Better KYC document tracking
*/

-- Foundation Donations
CREATE INDEX IF NOT EXISTS idx_foundation_donations_campaign_id 
ON foundation_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_foundation_donations_donor_user_id 
ON foundation_donations(donor_user_id);

-- Foundation Grants
CREATE INDEX IF NOT EXISTS idx_foundation_grants_partner_id 
ON foundation_grants(partner_id);

-- Game Clan Members
CREATE INDEX IF NOT EXISTS idx_game_clan_members_clan_id 
ON game_clan_members(clan_id);

-- Game Tournament Participants
CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id 
ON game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id 
ON game_tournament_participants(user_id);

-- Game Tournaments
CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id 
ON game_tournaments(winning_clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_user_id 
ON game_tournaments(winning_user_id);

-- GoBoxes (NFT Avatars)
CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id 
ON goboxes(avatar_id);

CREATE INDEX IF NOT EXISTS idx_goboxes_user_id 
ON goboxes(user_id);

-- KYC Documents
CREATE INDEX IF NOT EXISTS idx_kyc_documents_reviewed_by 
ON kyc_documents(reviewed_by);
