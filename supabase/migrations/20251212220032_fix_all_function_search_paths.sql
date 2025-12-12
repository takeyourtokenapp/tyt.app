/*
  # Fix All Function Search Path Issues - Final

  ## Complete list of all functions with exact signatures
  This fixes all 45+ functions identified by Supabase security scanner.
*/

-- Community functions
ALTER FUNCTION public.cleanup_old_community_messages() SET search_path = public;
ALTER FUNCTION public.update_online_status(text) SET search_path = public;
ALTER FUNCTION public.update_online_status(uuid) SET search_path = public;
ALTER FUNCTION public.get_online_users_count() SET search_path = public;
ALTER FUNCTION public.update_leaderboard_cache() SET search_path = public;

-- Wallet ledger functions (multiple overloads)
ALTER FUNCTION public.get_or_create_wallet_account(uuid, text, text) SET search_path = public;
ALTER FUNCTION public.get_or_create_wallet_account(uuid, wallet_account_type, text, text) SET search_path = public;
ALTER FUNCTION public.create_ledger_entry(uuid, uuid, numeric, numeric, text, uuid, text) SET search_path = public;
ALTER FUNCTION public.create_ledger_entry(uuid, uuid, numeric, ledger_entry_type, text, uuid, text, jsonb) SET search_path = public;
ALTER FUNCTION public.credit_account(uuid, text, text, numeric, text, uuid, text) SET search_path = public;
ALTER FUNCTION public.credit_account(uuid, numeric, ledger_entry_type, text, uuid, text, jsonb) SET search_path = public;

-- Burn and TYT functions (multiple overloads)
ALTER FUNCTION public.record_tyt_burn(numeric, text, uuid) SET search_path = public;
ALTER FUNCTION public.record_tyt_burn(uuid, numeric, text, uuid) SET search_path = public;
ALTER FUNCTION public.credit_user_tyt(uuid, numeric, text, uuid) SET search_path = public;
ALTER FUNCTION public.credit_user_tyt(uuid, numeric, text, uuid, text) SET search_path = public;

-- Fee and discount calculation
ALTER FUNCTION public.calculate_deposit_fees_v3(numeric, text) SET search_path = public;
ALTER FUNCTION public.calculate_effective_discount(uuid) SET search_path = public;
ALTER FUNCTION public.calculate_deposit_fees(numeric, text) SET search_path = public;

-- Utility functions
ALTER FUNCTION public.calculate_owl_rank(integer) SET search_path = public;
ALTER FUNCTION public.get_current_burn_cycle() SET search_path = public;
ALTER FUNCTION public.update_user_ve_discount() SET search_path = public;

-- Maintenance and VIP
ALTER FUNCTION public.calculate_daily_maintenance(numeric, numeric, numeric, numeric) SET search_path = public;
ALTER FUNCTION public.calculate_vip_level(numeric, numeric) SET search_path = public;
ALTER FUNCTION public.update_user_vip_level() SET search_path = public;
ALTER FUNCTION public.update_user_total_hashrate() SET search_path = public;

-- Marketplace
ALTER FUNCTION public.record_marketplace_referral_commission() SET search_path = public;

-- User management
ALTER FUNCTION public.create_user_wallets() SET search_path = public;
ALTER FUNCTION public.calculate_voting_power(numeric, integer) SET search_path = public;

-- Triggers
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Daily rewards
ALTER FUNCTION public.calculate_daily_btc_reward(numeric, numeric, numeric, numeric, numeric) SET search_path = public;

-- Academy
ALTER FUNCTION public.update_academy_stats_on_lesson_completion() SET search_path = public;
ALTER FUNCTION public.update_academy_stats_on_quest_completion() SET search_path = public;
ALTER FUNCTION public.create_academy_stats_for_new_user() SET search_path = public;
ALTER FUNCTION public.issue_track_certificate() SET search_path = public;

-- Foundation
ALTER FUNCTION public.create_donation_settings_for_new_user() SET search_path = public;
ALTER FUNCTION public.update_campaign_raised_amount() SET search_path = public;
ALTER FUNCTION public.update_grant_disbursement() SET search_path = public;

-- Deposit and wallet management
ALTER FUNCTION public.get_user_deposit_address(uuid, text) SET search_path = public;
ALTER FUNCTION public.get_user_primary_wallet(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_total_tyt(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_trading_stats(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_tyt_holdings(uuid) SET search_path = public;

-- Withdrawal
ALTER FUNCTION public.calculate_withdrawal_fees(numeric) SET search_path = public;
ALTER FUNCTION public.check_user_feature_access(uuid, text) SET search_path = public;
ALTER FUNCTION public.create_user_profile_on_signup() SET search_path = public;
ALTER FUNCTION public.get_user_withdrawal_stats(uuid) SET search_path = public;
ALTER FUNCTION public.update_withdrawal_tracking(uuid, numeric) SET search_path = public;
ALTER FUNCTION public.update_withdrawal_timestamp() SET search_path = public;

-- Bitcoin ecosystem
ALTER FUNCTION public.get_user_bitcoin_balance(uuid) SET search_path = public;
ALTER FUNCTION public.get_spendable_utxos(uuid, integer) SET search_path = public;