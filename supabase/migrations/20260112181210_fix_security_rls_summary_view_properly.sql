/*
  # Fix Security RLS Summary View - Remove SECURITY DEFINER

  1. Problem
    - View still being reported as SECURITY DEFINER
    - Need to explicitly set security_invoker = true
    - security_barrier is different from security_invoker

  2. Solution
    - Recreate view with explicit SECURITY INVOKER
    - Remove security_barrier (not needed for this use case)
    - View will run with caller's privileges, not owner's

  3. Technical Details
    - security_barrier = prevents info leakage (not our issue)
    - security_invoker = runs as caller (what we need)
    - Default in older PG is SECURITY DEFINER, we need INVOKER
*/

-- Drop existing view
DROP VIEW IF EXISTS security_rls_summary CASCADE;

-- Recreate with explicit SECURITY INVOKER (no special options)
CREATE VIEW security_rls_summary
WITH (security_invoker = true)
AS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check,
  CASE 
    WHEN qual::text LIKE '%true%' OR with_check::text LIKE '%true%' 
    THEN 'WARNING: May allow unrestricted access'
    ELSE 'OK'
  END as security_status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Add comment
COMMENT ON VIEW security_rls_summary IS 
'Security audit view for RLS policies - SECURITY INVOKER mode
Runs with caller privileges, not owner privileges.
Access controlled by pg_policies table permissions.
Only accessible to users with SELECT permission on pg_policies.';
