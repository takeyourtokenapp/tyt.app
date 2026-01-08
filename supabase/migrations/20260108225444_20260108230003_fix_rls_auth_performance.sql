/*
  # Fix RLS Auth Performance Issues

  1. Changes
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - This prevents re-evaluation for each row and improves performance at scale

  2. Tables Fixed
    - contact_submissions
    - incoming_messages
    - contact_messages
*/

-- Drop and recreate policies for contact_submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON contact_submissions;

CREATE POLICY "Users can view own submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Drop and recreate policies for incoming_messages
DROP POLICY IF EXISTS "Admin users can view all incoming messages" ON incoming_messages;

CREATE POLICY "Admin users can view all incoming messages"
  ON incoming_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

-- Drop and recreate policies for contact_messages
DROP POLICY IF EXISTS "Admins can view all messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON contact_messages;

CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can view own messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
