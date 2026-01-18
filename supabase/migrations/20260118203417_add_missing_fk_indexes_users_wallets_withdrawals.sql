/*
  # Add Missing Foreign Key Indexes - Users, Wallets & Withdrawals
  
  ## Changes
  - tyt_trades: connected_wallet_id
  - user_donation_settings: preferred_campaign_id
  - user_feature_access: feature_code
  - wallet_sync_logs: connected_wallet_id
  - wallet_transactions: wallet_id
  - weekly_distributions: burn_cycle_id
  - withdrawal_requests: reviewed_by
*/

CREATE INDEX IF NOT EXISTS idx_tyt_trades_connected_wallet_id 
  ON tyt_trades(connected_wallet_id);

CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id 
  ON user_donation_settings(preferred_campaign_id);

CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code 
  ON user_feature_access(feature_code);

CREATE INDEX IF NOT EXISTS idx_wallet_sync_logs_connected_wallet_id 
  ON wallet_sync_logs(connected_wallet_id);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id 
  ON wallet_transactions(wallet_id);

CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id 
  ON weekly_distributions(burn_cycle_id);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reviewed_by 
  ON withdrawal_requests(reviewed_by);
