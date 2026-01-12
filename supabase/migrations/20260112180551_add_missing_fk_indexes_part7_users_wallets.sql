/*
  # Add Missing Foreign Key Indexes - Part 7: Users & Wallets Tables

  1. Purpose
    - Add indexes to foreign key columns for user settings and wallet operations
    - Critical for user feature management and transaction tracking

  2. Tables Updated (8 indexes)
    - user_donation_settings (1 index)
    - user_feature_access (1 index)
    - user_stakes (1 index)
    - wallet_sync_logs (1 index)
    - wallet_transactions (2 indexes)
    - weekly_distributions (1 index)
    - withdrawal_requests (1 index)

  3. Impact
    - Faster user preference lookups
    - Improved wallet transaction queries
    - Better withdrawal request tracking
    - Optimized staking pool queries
*/

-- User Donation Settings
CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id 
ON user_donation_settings(preferred_campaign_id);

-- User Feature Access
CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code 
ON user_feature_access(feature_code);

-- User Stakes
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id 
ON user_stakes(pool_id);

-- Wallet Sync Logs
CREATE INDEX IF NOT EXISTS idx_wallet_sync_logs_connected_wallet_id 
ON wallet_sync_logs(connected_wallet_id);

-- Wallet Transactions (HIGH VOLUME - CRITICAL)
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id 
ON wallet_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id 
ON wallet_transactions(wallet_id);

-- Weekly Distributions
CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id 
ON weekly_distributions(burn_cycle_id);

-- Withdrawal Requests
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reviewed_by 
ON withdrawal_requests(reviewed_by);
