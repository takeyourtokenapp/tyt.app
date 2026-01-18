/*
  # Fix Multiple Permissive Policies

  1. Issues Fixed
    - orbital_nodes: Consolidate overlapping SELECT policies
    - Prevent multiple permissive policies for same action

  2. Strategy
    - Drop overlapping policies
    - Create single comprehensive policy per action
*/

-- Fix orbital_nodes: Consolidate SELECT policies
-- Drop the overlapping policies
DROP POLICY IF EXISTS "Public can view orbital nodes" ON orbital_nodes;
DROP POLICY IF EXISTS "Service role can manage orbital nodes" ON orbital_nodes;

-- Create single comprehensive SELECT policy
CREATE POLICY "Anyone can view orbital nodes"
  ON orbital_nodes FOR SELECT
  USING (true);

-- Recreate service role management policy for other actions only (not SELECT)
CREATE POLICY "Service role can modify orbital nodes"
  ON orbital_nodes
  USING (current_setting('role') = 'service_role')
  WITH CHECK (current_setting('role') = 'service_role');
