/*
  # Add Missing Foreign Key Indexes - Part 3

  Continues adding indexes for foreign keys.
  
  ## Tables Fixed (Part 3)
  - reconciliation_snapshots
  - referral_earnings
  - sol_transfers
  - staking_rewards
  - tyt_trades
  - user_donation_settings
  - user_feature_access
  - user_stakes
  - ve_tyt_locks
  - wallet_sync_logs
  - weekly_distributions
  - withdrawal_requests

  ## Performance Impact
  - Improves JOIN performance
  - Reduces query execution time
  - Optimizes foreign key lookups
*/

-- Reconciliation tables
CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id 
  ON reconciliation_snapshots(account_id);

-- Referral tables
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referred_user_id 
  ON referral_earnings(referred_user_id);

CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer_id 
  ON referral_earnings(referrer_id);

-- Solana tables
CREATE INDEX IF NOT EXISTS idx_sol_transfers_user_id 
  ON sol_transfers(user_id);

-- Staking tables
CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id 
  ON staking_rewards(stake_id);

CREATE INDEX IF NOT EXISTS idx_staking_rewards_user_id 
  ON staking_rewards(user_id);

-- TYT trade tables
CREATE INDEX IF NOT EXISTS idx_tyt_trades_connected_wallet_id 
  ON tyt_trades(connected_wallet_id);

CREATE INDEX IF NOT EXISTS idx_tyt_trades_user_id 
  ON tyt_trades(user_id);

-- User tables
CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id 
  ON user_donation_settings(preferred_campaign_id);

CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code 
  ON user_feature_access(feature_code);

CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id 
  ON user_stakes(pool_id);

-- veTYT tables
CREATE INDEX IF NOT EXISTS idx_ve_tyt_locks_user_id 
  ON ve_tyt_locks(user_id);

-- Wallet tables
CREATE INDEX IF NOT EXISTS idx_wallet_sync_logs_connected_wallet_id 
  ON wallet_sync_logs(connected_wallet_id);

CREATE INDEX IF NOT EXISTS idx_wallet_sync_logs_user_id 
  ON wallet_sync_logs(user_id);

-- Distribution tables
CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id 
  ON weekly_distributions(burn_cycle_id);

-- Withdrawal tables
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id 
  ON withdrawal_requests(user_id);
