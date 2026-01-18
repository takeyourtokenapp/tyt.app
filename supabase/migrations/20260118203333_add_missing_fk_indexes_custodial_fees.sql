/*
  # Add Missing Foreign Key Indexes - Custodial, Fees & Rewards
  
  ## Changes
  - custodial_internal_swaps: from_wallet_id, to_wallet_id
  - daily_rewards: wallet_transaction_id
  - email_notifications: submission_id
  - fee_audit_log: changed_by
*/

CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_from_wallet_id 
  ON custodial_internal_swaps(from_wallet_id);

CREATE INDEX IF NOT EXISTS idx_custodial_internal_swaps_to_wallet_id 
  ON custodial_internal_swaps(to_wallet_id);

CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id 
  ON daily_rewards(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_email_notifications_submission_id 
  ON email_notifications(submission_id);

CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by 
  ON fee_audit_log(changed_by);
