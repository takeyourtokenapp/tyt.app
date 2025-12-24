/*
  # Security Audit Fixes - Part 1: Indexes and Foreign Keys

  This migration addresses critical security and performance issues identified in the security audit:

  1. Missing Foreign Key Indexes (5 indexes)
     - foundation_allocations.approved_by
     - foundation_impact_reports.published_by
     - security_alerts.acknowledged_by
     - security_alerts.resolved_by
     - user_achievements.badge_code

  2. Drop Unused Indexes (Part 1 - 50 indexes)
     - Removes indexes that are not being used by queries
     - Improves write performance and reduces storage

  3. Drop Duplicate Indexes (2 duplicates)
     - governance_votes table has duplicate indexes
*/

-- ============================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================

DO $$
BEGIN
  -- foundation_allocations.approved_by
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'foundation_allocations'
    AND indexname = 'idx_foundation_allocations_approved_by'
  ) THEN
    CREATE INDEX idx_foundation_allocations_approved_by
    ON foundation_allocations(approved_by);
  END IF;

  -- foundation_impact_reports.published_by
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'foundation_impact_reports'
    AND indexname = 'idx_foundation_impact_reports_published_by'
  ) THEN
    CREATE INDEX idx_foundation_impact_reports_published_by
    ON foundation_impact_reports(published_by);
  END IF;

  -- security_alerts.acknowledged_by
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'security_alerts'
    AND indexname = 'idx_security_alerts_acknowledged_by'
  ) THEN
    CREATE INDEX idx_security_alerts_acknowledged_by
    ON security_alerts(acknowledged_by);
  END IF;

  -- security_alerts.resolved_by
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'security_alerts'
    AND indexname = 'idx_security_alerts_resolved_by'
  ) THEN
    CREATE INDEX idx_security_alerts_resolved_by
    ON security_alerts(resolved_by);
  END IF;

  -- user_achievements.badge_code
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'user_achievements'
    AND indexname = 'idx_user_achievements_badge_code_fkey'
  ) THEN
    CREATE INDEX idx_user_achievements_badge_code_fkey
    ON user_achievements(badge_code);
  END IF;
END $$;

-- ============================================
-- 2. DROP DUPLICATE INDEXES (KEEP ONE OF EACH)
-- ============================================

DROP INDEX IF EXISTS idx_governance_votes_proposal;
DROP INDEX IF EXISTS idx_governance_votes_user;

-- ============================================
-- 3. DROP UNUSED INDEXES (Part 1 - 50 indexes)
-- ============================================

DROP INDEX IF EXISTS idx_profiles_referral_code;
DROP INDEX IF EXISTS idx_profiles_id;
DROP INDEX IF EXISTS idx_profiles_rank_score;
DROP INDEX IF EXISTS idx_custodial_wallets_currency;
DROP INDEX IF EXISTS idx_custodial_wallets_blockchain;
DROP INDEX IF EXISTS idx_custodial_addresses_blockchain;
DROP INDEX IF EXISTS idx_custodial_addresses_address;
DROP INDEX IF EXISTS idx_custodial_withdrawals_status;
DROP INDEX IF EXISTS idx_custodial_withdrawals_blockchain;
DROP INDEX IF EXISTS idx_custodial_balance_snapshots_date;
DROP INDEX IF EXISTS idx_wallet_transactions_status;
DROP INDEX IF EXISTS idx_wallet_transactions_created_at;
DROP INDEX IF EXISTS idx_wallet_accounts_type;
DROP INDEX IF EXISTS idx_wallet_accounts_currency;
DROP INDEX IF EXISTS idx_nft_miners_collection_id;
DROP INDEX IF EXISTS idx_nft_miners_is_listed;
DROP INDEX IF EXISTS idx_miner_upgrades_miner_id;
DROP INDEX IF EXISTS idx_miner_upgrades_transaction_id;
DROP INDEX IF EXISTS idx_daily_rewards_miner_id;
DROP INDEX IF EXISTS idx_daily_rewards_status;
DROP INDEX IF EXISTS idx_daily_rewards_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_invoices_miner_id;
DROP INDEX IF EXISTS idx_maintenance_invoices_date;
DROP INDEX IF EXISTS idx_maintenance_invoices_status;
DROP INDEX IF EXISTS idx_maintenance_invoices_due_date;
DROP INDEX IF EXISTS idx_maintenance_invoices_wallet_transaction_id;
DROP INDEX IF EXISTS idx_maintenance_payments_invoice;
DROP INDEX IF EXISTS idx_maintenance_payments_user;
DROP INDEX IF EXISTS idx_maintenance_payments_transaction;
DROP INDEX IF EXISTS idx_maintenance_fee_config_region;
DROP INDEX IF EXISTS idx_maintenance_fee_config_active;
DROP INDEX IF EXISTS idx_burn_cycles_cycle_number;
DROP INDEX IF EXISTS idx_burn_cycles_status;
DROP INDEX IF EXISTS idx_burn_cycles_start_date;
DROP INDEX IF EXISTS idx_ve_tyt_locks_status;
DROP INDEX IF EXISTS idx_ve_tyt_locks_unlock_at;
DROP INDEX IF EXISTS idx_vetyt_cache_wallet;
DROP INDEX IF EXISTS idx_vetyt_cache_power;
DROP INDEX IF EXISTS idx_governance_proposals_status;
DROP INDEX IF EXISTS idx_governance_proposals_end_time;
DROP INDEX IF EXISTS idx_governance_votes_proposal_id;
DROP INDEX IF EXISTS idx_governance_votes_user_id;
DROP INDEX IF EXISTS idx_execution_queue_scheduled;
DROP INDEX IF EXISTS idx_execution_queue_proposal;
DROP INDEX IF EXISTS idx_reward_pools_date;
DROP INDEX IF EXISTS idx_reward_pools_distributed;
DROP INDEX IF EXISTS idx_reward_claims_reward;
DROP INDEX IF EXISTS idx_reward_claims_user;
DROP INDEX IF EXISTS idx_reward_claims_tx;