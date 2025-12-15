/*
  # Fix Function Search Path - Part 2
  
  1. Security Enhancement
    - Continues from part 1
    - Set SEARCH_PATH to empty string for remaining functions
  
  2. Functions Fixed (Part 2 - Remaining functions)
    - update_grant_disbursement
    - get_user_bitcoin_balance
    - calculate_deposit_fees
    - get_user_deposit_address
    - get_user_tyt_holdings
    - calculate_withdrawal_fees
    - check_user_feature_access
    - create_user_profile_on_signup
    - get_user_withdrawal_stats
    - get_spendable_utxos
    - cleanup_old_community_messages
    - update_online_status
    - get_online_users_count
    - update_leaderboard_cache
    - get_or_create_wallet_account
    - create_ledger_entry
    - credit_account
    - calculate_deposit_fees_v3
    - test_profile_creation
*/

-- Fix search_path for update_grant_disbursement
ALTER FUNCTION public.update_grant_disbursement SET search_path = '';

-- Fix search_path for get_user_bitcoin_balance
ALTER FUNCTION public.get_user_bitcoin_balance SET search_path = '';

-- Fix search_path for calculate_deposit_fees
ALTER FUNCTION public.calculate_deposit_fees SET search_path = '';

-- Fix search_path for get_user_deposit_address
ALTER FUNCTION public.get_user_deposit_address SET search_path = '';

-- Fix search_path for get_user_tyt_holdings
ALTER FUNCTION public.get_user_tyt_holdings SET search_path = '';

-- Fix search_path for calculate_withdrawal_fees
ALTER FUNCTION public.calculate_withdrawal_fees SET search_path = '';

-- Fix search_path for check_user_feature_access
ALTER FUNCTION public.check_user_feature_access SET search_path = '';

-- Fix search_path for create_user_profile_on_signup
ALTER FUNCTION public.create_user_profile_on_signup SET search_path = '';

-- Fix search_path for get_user_withdrawal_stats
ALTER FUNCTION public.get_user_withdrawal_stats SET search_path = '';

-- Fix search_path for get_spendable_utxos
ALTER FUNCTION public.get_spendable_utxos SET search_path = '';

-- Fix search_path for cleanup_old_community_messages
ALTER FUNCTION public.cleanup_old_community_messages SET search_path = '';

-- Fix search_path for update_online_status
ALTER FUNCTION public.update_online_status SET search_path = '';

-- Fix search_path for get_online_users_count
ALTER FUNCTION public.get_online_users_count SET search_path = '';

-- Fix search_path for update_leaderboard_cache
ALTER FUNCTION public.update_leaderboard_cache SET search_path = '';

-- Fix search_path for get_or_create_wallet_account
ALTER FUNCTION public.get_or_create_wallet_account SET search_path = '';

-- Fix search_path for create_ledger_entry
ALTER FUNCTION public.create_ledger_entry SET search_path = '';

-- Fix search_path for credit_account
ALTER FUNCTION public.credit_account SET search_path = '';

-- Fix search_path for calculate_deposit_fees_v3
ALTER FUNCTION public.calculate_deposit_fees_v3 SET search_path = '';

-- Fix search_path for test_profile_creation
ALTER FUNCTION public.test_profile_creation SET search_path = '';
