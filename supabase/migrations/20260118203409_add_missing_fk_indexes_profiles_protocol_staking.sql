/*
  # Add Missing Foreign Key Indexes - Profiles, Protocol & Staking
  
  ## Changes
  - profiles: referred_by
  - protocol_revenue: transaction_id
  - reconciliation_snapshots: account_id
  - staking_rewards: stake_id
  - user_stakes: pool_id
*/

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by 
  ON profiles(referred_by);

CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id 
  ON protocol_revenue(transaction_id);

CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id 
  ON reconciliation_snapshots(account_id);

CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id 
  ON staking_rewards(stake_id);

CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id 
  ON user_stakes(pool_id);
