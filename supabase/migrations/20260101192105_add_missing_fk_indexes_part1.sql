/*
  # Add Missing Foreign Key Indexes - Part 1

  Adds indexes for foreign keys to improve query performance.
  
  ## Tables Fixed (Part 1)
  - academy_certificates
  - academy_quest_completions
  - academy_quiz_attempts
  - aoi_messages
  - avatars
  - bitcoin_transactions
  - bitcoin_utxos
  - blockchain_deposits
  - burn_mint_distributions
  - charity_stakes
  - charity_staking_rewards
  - community_announcements
  - community_messages
  - custodial_balance_snapshots
  - custodial_withdrawals

  ## Performance Impact
  - Improves JOIN performance
  - Reduces query execution time
  - Optimizes foreign key lookups
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_certificates_cert_template_id 
  ON academy_certificates(cert_template_id);

CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id 
  ON academy_certificates(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quest_completions_quest_id 
  ON academy_quest_completions(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_lesson_id 
  ON academy_quiz_attempts(lesson_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_user_id 
  ON academy_quiz_attempts(user_id);

-- AOI tables
CREATE INDEX IF NOT EXISTS idx_aoi_messages_user_id 
  ON aoi_messages(user_id);

-- Avatar tables
CREATE INDEX IF NOT EXISTS idx_avatars_owner_id 
  ON avatars(owner_id);

-- Bitcoin tables
CREATE INDEX IF NOT EXISTS idx_bitcoin_transactions_user_id 
  ON bitcoin_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_address_id 
  ON bitcoin_utxos(address_id);

CREATE INDEX IF NOT EXISTS idx_bitcoin_utxos_user_id 
  ON bitcoin_utxos(user_id);

-- Blockchain tables
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_deposit_address_id 
  ON blockchain_deposits(deposit_address_id);

-- Burn tables
CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id 
  ON burn_mint_distributions(burn_event_id);

-- Charity tables
CREATE INDEX IF NOT EXISTS idx_charity_stakes_pool_id 
  ON charity_stakes(pool_id);

CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_stake_id 
  ON charity_staking_rewards(stake_id);

CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_user_id 
  ON charity_staking_rewards(user_id);

-- Community tables
CREATE INDEX IF NOT EXISTS idx_community_announcements_created_by 
  ON community_announcements(created_by);

CREATE INDEX IF NOT EXISTS idx_community_messages_user_id 
  ON community_messages(user_id);

-- Custodial tables
CREATE INDEX IF NOT EXISTS idx_custodial_balance_snapshots_user_id 
  ON custodial_balance_snapshots(user_id);

CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_user_id 
  ON custodial_withdrawals(user_id);

CREATE INDEX IF NOT EXISTS idx_custodial_withdrawals_wallet_id 
  ON custodial_withdrawals(wallet_id);
