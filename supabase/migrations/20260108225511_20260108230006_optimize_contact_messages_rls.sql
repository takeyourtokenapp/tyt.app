/*
  # Optimize Contact Messages RLS Policies

  1. Changes
    - Merge multiple permissive SELECT policies into single policy
    - This improves query planning and performance

  2. Tables Optimized
    - contact_messages
*/

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON contact_messages;

-- Create single optimized SELECT policy
CREATE POLICY "View messages policy"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    -- Admins can see all
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
    -- Or users can see their own
    OR (SELECT auth.uid()) = user_id
  );
