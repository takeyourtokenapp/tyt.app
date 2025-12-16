/*
  # Fix infinite recursion in profiles RLS policies

  This migration fixes the "infinite recursion detected in policy for relation profiles" error.

  ## Problem:
  The policy "Users can view referrer profile" creates infinite recursion because it queries 
  the profiles table from within a profiles table policy.

  ## Solution:
  Drop the recursive policy and simplify profile access.
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view referrer profile" ON profiles;

-- Users should only see their own profile for now
-- Referrer info can be accessed through a separate query or function if needed
