/*
  # Add Missing Foreign Key Indexes

  This migration adds indexes to all foreign key columns that are missing them.
  Unindexed foreign keys cause suboptimal query performance, especially for JOINs
  and CASCADE operations.

  ## Changes
  - Adds 27 missing foreign key indexes across various tables
  - Improves JOIN performance
  - Improves CASCADE DELETE/UPDATE performance
  - Reduces query planning time

  ## Performance Impact
  - Positive: Significantly faster queries involving these foreign keys
  - Index creation time: ~30-60 seconds depending on table sizes
*/

-- Academy foreign keys
CREATE INDEX IF NOT EXISTS idx_academy_certificates_quest_id
  ON public.academy_certificates(quest_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_lesson_id
  ON public.academy_quiz_attempts(lesson_id);

-- Blockchain and wallet foreign keys
CREATE INDEX IF NOT EXISTS idx_blockchain_deposits_wallet_transaction_id
  ON public.blockchain_deposits(wallet_transaction_id);

-- Burn system foreign keys
CREATE INDEX IF NOT EXISTS idx_burn_mint_distributions_burn_event_id
  ON public.burn_mint_distributions(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_burn_pool_burn_event_id
  ON public.burn_pool(burn_event_id);

CREATE INDEX IF NOT EXISTS idx_weekly_distributions_burn_cycle_id
  ON public.weekly_distributions(burn_cycle_id);

-- Charity and foundation foreign keys
CREATE INDEX IF NOT EXISTS idx_charity_flows_transaction_id
  ON public.charity_flows(transaction_id);

CREATE INDEX IF NOT EXISTS idx_user_donation_settings_preferred_campaign_id
  ON public.user_donation_settings(preferred_campaign_id);

-- Community foreign keys
CREATE INDEX IF NOT EXISTS idx_community_announcements_created_by
  ON public.community_announcements(created_by);

-- Rewards and maintenance foreign keys
CREATE INDEX IF NOT EXISTS idx_daily_rewards_wallet_transaction_id
  ON public.daily_rewards(wallet_transaction_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_wallet_transaction_id
  ON public.maintenance_invoices(wallet_transaction_id);

-- Fee audit foreign key
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_changed_by
  ON public.fee_audit_log(changed_by);

-- Game system foreign keys
CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_clan_id
  ON public.game_tournament_participants(clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournament_participants_user_id
  ON public.game_tournament_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_clan_id
  ON public.game_tournaments(winning_clan_id);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_winning_user_id
  ON public.game_tournaments(winning_user_id);

CREATE INDEX IF NOT EXISTS idx_goboxes_avatar_id
  ON public.goboxes(avatar_id);

-- Governance foreign key
CREATE INDEX IF NOT EXISTS idx_governance_proposals_proposed_by
  ON public.governance_proposals(proposed_by);

-- KYC foreign key
CREATE INDEX IF NOT EXISTS idx_kyc_documents_reviewed_by
  ON public.kyc_documents(reviewed_by);

-- Lightning foreign key
CREATE INDEX IF NOT EXISTS idx_lightning_invoices_node_id
  ON public.lightning_invoices(node_id);

-- Marketplace foreign keys
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_listing_id
  ON public.marketplace_sales(listing_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_miner_id
  ON public.marketplace_sales(miner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_sales_referrer_id
  ON public.marketplace_sales(referrer_id);

-- Miner upgrade foreign key
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_transaction_id
  ON public.miner_upgrades(transaction_id);

-- Protocol revenue foreign key
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id
  ON public.protocol_revenue(transaction_id);

-- Reconciliation foreign key
CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id
  ON public.reconciliation_snapshots(account_id);

-- Withdrawal foreign key
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reviewed_by
  ON public.withdrawal_requests(reviewed_by);