/*
  # Fix Function Search Path - Part 1
  
  1. Security Enhancement
    - Set SEARCH_PATH to empty string for security-critical functions
    - Prevents privilege escalation attacks via search_path manipulation
    - All object references will need schema qualification
  
  2. Functions Fixed (Part 1 - First 20 functions)
    - record_tyt_burn
    - credit_user_tyt
    - update_user_total_hashrate
    - update_withdrawal_timestamp
    - update_withdrawal_tracking
    - calculate_daily_maintenance
    - update_updated_at_column
    - calculate_daily_btc_reward
    - calculate_effective_discount
    - calculate_voting_power
    - get_current_burn_cycle
    - update_user_ve_discount
    - calculate_vip_level
    - update_user_vip_level
    - record_marketplace_referral_commission
    - calculate_owl_rank
    - update_academy_stats_on_lesson_completion
    - update_academy_stats_on_quest_completion
    - issue_track_certificate
    - update_campaign_raised_amount
  
  3. Note
    - SECURITY DEFINER functions must have immutable search_path
    - Schema-qualified references (public.table_name) now required
*/

-- Fix search_path for record_tyt_burn
ALTER FUNCTION public.record_tyt_burn SET search_path = '';

-- Fix search_path for credit_user_tyt
ALTER FUNCTION public.credit_user_tyt SET search_path = '';

-- Fix search_path for update_user_total_hashrate
ALTER FUNCTION public.update_user_total_hashrate SET search_path = '';

-- Fix search_path for update_withdrawal_timestamp
ALTER FUNCTION public.update_withdrawal_timestamp SET search_path = '';

-- Fix search_path for update_withdrawal_tracking
ALTER FUNCTION public.update_withdrawal_tracking SET search_path = '';

-- Fix search_path for calculate_daily_maintenance
ALTER FUNCTION public.calculate_daily_maintenance SET search_path = '';

-- Fix search_path for update_updated_at_column
ALTER FUNCTION public.update_updated_at_column SET search_path = '';

-- Fix search_path for calculate_daily_btc_reward
ALTER FUNCTION public.calculate_daily_btc_reward SET search_path = '';

-- Fix search_path for calculate_effective_discount
ALTER FUNCTION public.calculate_effective_discount SET search_path = '';

-- Fix search_path for calculate_voting_power
ALTER FUNCTION public.calculate_voting_power SET search_path = '';

-- Fix search_path for get_current_burn_cycle
ALTER FUNCTION public.get_current_burn_cycle SET search_path = '';

-- Fix search_path for update_user_ve_discount
ALTER FUNCTION public.update_user_ve_discount SET search_path = '';

-- Fix search_path for calculate_vip_level
ALTER FUNCTION public.calculate_vip_level SET search_path = '';

-- Fix search_path for update_user_vip_level
ALTER FUNCTION public.update_user_vip_level SET search_path = '';

-- Fix search_path for record_marketplace_referral_commission
ALTER FUNCTION public.record_marketplace_referral_commission SET search_path = '';

-- Fix search_path for calculate_owl_rank
ALTER FUNCTION public.calculate_owl_rank SET search_path = '';

-- Fix search_path for update_academy_stats_on_lesson_completion
ALTER FUNCTION public.update_academy_stats_on_lesson_completion SET search_path = '';

-- Fix search_path for update_academy_stats_on_quest_completion
ALTER FUNCTION public.update_academy_stats_on_quest_completion SET search_path = '';

-- Fix search_path for issue_track_certificate
ALTER FUNCTION public.issue_track_certificate SET search_path = '';

-- Fix search_path for update_campaign_raised_amount
ALTER FUNCTION public.update_campaign_raised_amount SET search_path = '';
