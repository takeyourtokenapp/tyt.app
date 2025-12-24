/*
  # Security Audit Fixes - Part 4: Drop Remaining Unused Indexes

  Final batch of unused index removal - Bitcoin, Community, Ledger, and other system indexes.
*/

-- Bitcoin indexes
DROP INDEX IF EXISTS idx_bitcoin_addresses_address;
DROP INDEX IF EXISTS idx_bitcoin_addresses_active;
DROP INDEX IF EXISTS idx_bitcoin_utxos_address_id;
DROP INDEX IF EXISTS idx_bitcoin_utxos_txid;
DROP INDEX IF EXISTS idx_bitcoin_utxos_unspent;
DROP INDEX IF EXISTS idx_bitcoin_transactions_txid;
DROP INDEX IF EXISTS idx_bitcoin_transactions_status;
DROP INDEX IF EXISTS idx_bitcoin_transactions_created;
DROP INDEX IF EXISTS idx_lightning_invoices_payment_hash;
DROP INDEX IF EXISTS idx_lightning_invoices_status;
DROP INDEX IF EXISTS idx_lightning_invoices_node_id;
DROP INDEX IF EXISTS idx_bitcoin_fee_estimates_created;

-- Community indexes
DROP INDEX IF EXISTS idx_community_messages_created_at;
DROP INDEX IF EXISTS idx_online_users_last_seen;
DROP INDEX IF EXISTS idx_leaderboard_hashrate;
DROP INDEX IF EXISTS idx_leaderboard_rewards;
DROP INDEX IF EXISTS idx_leaderboard_xp;
DROP INDEX IF EXISTS idx_announcements_dates;

-- Ledger indexes
DROP INDEX IF EXISTS idx_ledger_entries_account_id;
DROP INDEX IF EXISTS idx_ledger_entries_batch_id;
DROP INDEX IF EXISTS idx_ledger_entries_ref;
DROP INDEX IF EXISTS idx_ledger_entries_created;
DROP INDEX IF EXISTS idx_reconciliation_snapshots_account_id;

-- Onchain events indexes
DROP INDEX IF EXISTS idx_onchain_events_network;
DROP INDEX IF EXISTS idx_onchain_events_status;
DROP INDEX IF EXISTS idx_onchain_events_block;
DROP INDEX IF EXISTS idx_onchain_events_tx;

-- Burn event indexes
DROP INDEX IF EXISTS idx_burn_events_type;
DROP INDEX IF EXISTS idx_burn_events_burned_at;
DROP INDEX IF EXISTS idx_burn_pool_status;
DROP INDEX IF EXISTS idx_burn_pool_burn_event_id;
DROP INDEX IF EXISTS idx_burn_mint_distributions_burn_event_id;
DROP INDEX IF EXISTS idx_weekly_distributions_burn_cycle_id;

-- Fee audit indexes
DROP INDEX IF EXISTS idx_fee_audit_log_created;
DROP INDEX IF EXISTS idx_fee_audit_log_table_key;
DROP INDEX IF EXISTS idx_fee_audit_log_changed_by;

-- Cron job indexes
DROP INDEX IF EXISTS idx_cron_job_logs_started;
DROP INDEX IF EXISTS idx_cron_job_logs_job_name;
DROP INDEX IF EXISTS idx_cron_job_logs_status;

-- User achievements
DROP INDEX IF EXISTS idx_user_achievements_user;
DROP INDEX IF EXISTS idx_user_achievements_earned;