/*
  # Add Missing Foreign Key Indexes - Part 5: Payments & Rewards Tables

  1. Purpose
    - Add indexes for payment processing
    - Add indexes for rewards and maintenance systems

  2. Tables Covered
    - daily_rewards
    - maintenance_invoices
    - maintenance_payments
    - lightning_invoices
    - reward_claims
    - staking_rewards
*/

-- Lightning Network
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id 
  ON lightning_invoices(node_id);

-- Daily rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id 
  ON daily_rewards(wallet_transaction_id);

-- Maintenance system
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id 
  ON maintenance_invoices(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_invoice_id 
  ON maintenance_payments(invoice_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_transaction_id 
  ON maintenance_payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_user_id 
  ON maintenance_payments(user_id);

-- Rewards & Claims
CREATE INDEX IF NOT EXISTS idx_reward_claims_reward_id 
  ON reward_claims(reward_id);

CREATE INDEX IF NOT EXISTS idx_reward_claims_user_id 
  ON reward_claims(user_id);

CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id 
  ON staking_rewards(stake_id);