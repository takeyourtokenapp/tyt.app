/*
  # Drop Unused Indexes - Foundation & Charity

  1. Indexes Removed
    - Burn mechanism indexes
    - Charity staking and flow indexes
    - Foundation donation and grant indexes
    - Email notification indexes
*/

-- Burn indexes
DROP INDEX IF EXISTS idx_burn_mint_distributions_burn_event_id;
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_weekly_distributions_burn_cycle_id;

-- Charity indexes
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;
DROP INDEX IF EXISTS idx_charity_flows_user_id;
DROP INDEX IF EXISTS idx_charity_stakes_pool_id;
DROP INDEX IF EXISTS idx_charity_staking_rewards_stake_id;

-- Foundation indexes
DROP INDEX IF EXISTS idx_foundation_donations_campaign_id;
DROP INDEX IF EXISTS idx_foundation_donations_donor_user_id;
DROP INDEX IF EXISTS idx_foundation_grants_partner_id;

-- Email notification indexes
DROP INDEX IF EXISTS idx_email_notifications_submission_id;
