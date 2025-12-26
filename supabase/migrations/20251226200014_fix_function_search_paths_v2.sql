/*
  # Fix Function Search Paths (Fixed)
  
  1. Security Issue
    - Functions with role mutable search_path can be vulnerable to search path attacks
    - An attacker could create malicious objects in a different schema
    - Functions should have a fixed search_path to prevent this
  
  2. Functions to Fix
    - log_cron_execution (2 overloads)
    - calculate_deposit_fees_v3 (2 overloads)
    - cleanup_old_cron_logs (2 overloads)
    - determine_rank (2 overloads)
  
  Note: Setting search_path to 'public, pg_temp' is secure for most use cases
*/

-- Fix log_cron_execution overloads
ALTER FUNCTION log_cron_execution(text, text, integer, text)
  SET search_path = public, pg_temp;

ALTER FUNCTION log_cron_execution(text, text, jsonb, text)
  SET search_path = public, pg_temp;

-- Fix calculate_deposit_fees_v3 overloads
ALTER FUNCTION calculate_deposit_fees_v3(numeric, text)
  SET search_path = public, pg_temp;

ALTER FUNCTION calculate_deposit_fees_v3(uuid, numeric, text)
  SET search_path = public, pg_temp;

-- Fix cleanup_old_cron_logs overloads
ALTER FUNCTION cleanup_old_cron_logs()
  SET search_path = public, pg_temp;

ALTER FUNCTION cleanup_old_cron_logs(integer)
  SET search_path = public, pg_temp;

-- Fix determine_rank overloads
ALTER FUNCTION determine_rank(integer)
  SET search_path = public, pg_temp;

ALTER FUNCTION determine_rank(numeric)
  SET search_path = public, pg_temp;
