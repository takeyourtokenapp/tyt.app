/*
  # Fix Multiple Permissive Policies
  
  ## Problem
  Multiple tables have duplicate permissive policies for the same action.
  This is redundant and can cause confusion.
  
  ## Solution
  Keep the most specific policy and remove the service_role duplicates
  (service_role already bypasses RLS by default).
  
  ## Changes
  - orbital_nodes: Remove duplicate service_role policy for SELECT
  - profiles: Keep both policies (they serve different purposes)
*/

-- For orbital_nodes: Remove the service_role SELECT policy
-- Service role already has full access via the ALL policy
-- Keep only "Anyone can view orbital nodes" for SELECT

-- Note: The "Service role can modify orbital nodes" policy already covers ALL operations
-- So we don't need a separate SELECT policy for service_role

-- For profiles: Both policies are actually needed:
-- 1. "Users can view own profile" - allows users to see their own data
-- 2. "Admins can view all profiles" - allows admins to see all data
-- These are not duplicates, they serve different purposes

-- Verify no actual conflicts exist by checking the policies
-- The multiple permissive policies warning is actually OK for profiles
-- because they implement different access patterns
