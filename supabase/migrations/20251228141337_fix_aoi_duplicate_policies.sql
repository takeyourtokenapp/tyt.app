/*
  # Fix Duplicate Permissive Policies

  1. Issue
    - Table `aoi_achievements` has multiple permissive policies for SELECT
    - "Public can view achievement counts" and "Users can view own achievements"
    - This causes ambiguity and potential security issues

  2. Solution
    - Keep only "Users can view own achievements" as restrictive
    - Remove "Public can view achievement counts" policy
    - If public counts are needed, create a separate view or function
*/

-- Remove duplicate permissive policy
DROP POLICY IF EXISTS "Public can view achievement counts" ON aoi_achievements;