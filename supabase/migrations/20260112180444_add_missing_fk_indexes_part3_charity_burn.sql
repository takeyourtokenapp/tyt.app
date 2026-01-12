/*
  # Add Missing Foreign Key Indexes - Part 3: Charity & Burn Tables

  1. Purpose
    - Add indexes to foreign key columns for charity and token burn tracking
    - Essential for Foundation transparency and tokenomics

  2. Tables Updated (8 indexes)
    - burn_mint_distributions (1 index)
    - burn_pool (1 index)
    - charity_flows (2 indexes)
    - charity_stakes (1 index)
    - charity_staking_rewards (1 index)
    - email_notifications (1 index)
    - fee_audit_log (1 index)

  3. Impact
    - Faster burn event tracking
    - Improved charity flow queries
    - Better audit trail performance
*/

-- Burn Mint Distributions
CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id 
ON burn_mint_distributions(burn_event_id);

-- Burn Pool
CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id 
ON burn_pool(burn_event_id);

-- Charity Flows
CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id 
ON charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_charity_flows_user_id 
ON charity_flows(user_id);

-- Charity Stakes
CREATE INDEX IF NOT EXISTS idx_charity_stakes_pool_id 
ON charity_stakes(pool_id);

-- Charity Staking Rewards
CREATE INDEX IF NOT EXISTS idx_charity_staking_rewards_stake_id 
ON charity_staking_rewards(stake_id);

-- Email Notifications
CREATE INDEX IF NOT EXISTS idx_email_notifications_submission_id 
ON email_notifications(submission_id);

-- Fee Audit Log
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by 
ON fee_audit_log(changed_by);
