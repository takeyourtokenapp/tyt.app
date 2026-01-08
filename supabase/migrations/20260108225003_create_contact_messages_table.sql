/*
  # Create Contact Messages System

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `name` (text, required) - sender's name
      - `email` (text, required) - sender's email
      - `subject` (text, required) - message subject
      - `message` (text, required) - message content
      - `is_read` (boolean, default false) - read status
      - `is_answered` (boolean, default false) - answered status
      - `answered_at` (timestamptz, nullable) - when answered
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for admins to view all messages
    - Add policy for authenticated users to view their own messages
    - Add policy for anyone to create messages (for contact form)

  3. Indexes
    - Index on user_id for fast lookups
    - Index on email for searching
    - Index on is_read for filtering
    - Index on created_at for sorting
*/

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  is_answered boolean DEFAULT false,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- RLS Policies
-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can update messages (mark as read/answered)
CREATE POLICY "Admins can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Users can view their own messages
CREATE POLICY "Users can view own messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can create messages (for contact form)
CREATE POLICY "Anyone can create messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();
