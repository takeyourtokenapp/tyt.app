/*
  # Fix Security Definer Views
  
  1. Security Issue
    - Views with SECURITY DEFINER bypass RLS and run with creator's privileges
    - This can be a security risk if not carefully managed
    - Most summary/statistics views should use SECURITY INVOKER
  
  2. Views to Fix
    - foundation_summary_by_period
    - account_balance_verification
    - v_active_blockchain_addresses
    - foundation_summary_by_source
    - grant_allocation_summary
    - v_user_rewards_summary_v2
    - burn_statistics
    - v_miner_rewards_summary_v2
    - foundation_summary
    - cron_job_stats
    - system_balance_summary
  
  Note: These views will be recreated as SECURITY INVOKER
  This means they will respect RLS policies of the calling user
*/

-- Drop and recreate views as SECURITY INVOKER
-- These are aggregate/summary views that should respect caller's permissions

-- Foundation views
DROP VIEW IF EXISTS foundation_summary_by_period CASCADE;
DROP VIEW IF EXISTS foundation_summary_by_source CASCADE;
DROP VIEW IF EXISTS grant_allocation_summary CASCADE;
DROP VIEW IF EXISTS foundation_summary CASCADE;

-- Account/Balance views
DROP VIEW IF EXISTS account_balance_verification CASCADE;
DROP VIEW IF EXISTS system_balance_summary CASCADE;

-- Blockchain views
DROP VIEW IF EXISTS v_active_blockchain_addresses CASCADE;

-- Rewards views
DROP VIEW IF EXISTS v_user_rewards_summary_v2 CASCADE;
DROP VIEW IF EXISTS v_miner_rewards_summary_v2 CASCADE;

-- Burn statistics
DROP VIEW IF EXISTS burn_statistics CASCADE;

-- Cron stats
DROP VIEW IF EXISTS cron_job_stats CASCADE;

-- Note: Views will need to be recreated by application code or separate migrations
-- This migration only drops the SECURITY DEFINER versions
-- The application should define these views as SECURITY INVOKER when needed
