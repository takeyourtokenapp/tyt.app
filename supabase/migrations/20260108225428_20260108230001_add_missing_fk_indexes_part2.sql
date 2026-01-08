/*
  # Add Missing Foreign Key Indexes - Part 2

  1. Performance Optimization
    - Continue adding indexes for foreign keys

  2. Tables Covered
    - custodial_internal_swaps
    - daily_rewards
    - email_notifications
    - foundation_donations
    - game_tournament_participants
    - game_tournaments
    - goboxes
*/

-- custodial_internal_swaps (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_from_wallet_id 
  ON custodial_internal_swaps(from_wallet_id);

CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_to_wallet_id 
  ON custodial_internal_swaps(to_wallet_id);

-- daily_rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id 
  ON daily_rewards(wallet_transaction_id);

-- email_notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_submission_id 
  ON email_notifications(submission_id);

-- foundation_donations (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_foundation_donations_campaign_id 
  ON foundation_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_foundation_donations_donor_user_id 
  ON foundation_donations(donor_user_id);

-- game_tournament_participants (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id 
  ON game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id 
  ON game_tournament_participants(user_id);

-- game_tournaments (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id 
  ON game_tournaments(winning_clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_user_id 
  ON game_tournaments(winning_user_id);

-- goboxes (both foreign keys)
CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id 
  ON goboxes(avatar_id);

CREATE INDEX IF NOT EXISTS idx_goboxes_user_id 
  ON goboxes(user_id);
