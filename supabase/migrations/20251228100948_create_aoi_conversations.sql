/*
  # aOi Conversations Table

  1. New Table
    - `aoi_conversations` - Stores complete chat history for aOi interactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `messages` (jsonb, array of message objects)
      - `context` (jsonb, conversation context)
      - `started_at` (timestamptz, conversation start time)
      - `last_message_at` (timestamptz, last message timestamp)
      - `is_active` (boolean, whether conversation is ongoing)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on table
    - Users can only view/update their own conversations
    - Service role can access for analytics

  3. Indexes
    - Index on user_id for fast lookups
    - Index on is_active for filtering active conversations
    - Index on last_message_at for sorting recent conversations

  4. Notes
    - This table enables persistent chat history across sessions
    - Integrates with tyt.foundation cross-domain sync
    - Supports conversation resume and context preservation
*/

-- Conversations Table
CREATE TABLE IF NOT EXISTS aoi_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages jsonb DEFAULT '[]'::jsonb NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id
  ON aoi_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_aoi_conversations_is_active
  ON aoi_conversations(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_aoi_conversations_last_message
  ON aoi_conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_active
  ON aoi_conversations(user_id, is_active)
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE aoi_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own conversations"
  ON aoi_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON aoi_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON aoi_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON aoi_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all conversations"
  ON aoi_conversations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Helper Function: Update last_message_at timestamp
CREATE OR REPLACE FUNCTION update_aoi_conversation_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_message_at := now();
  RETURN NEW;
END;
$$;

-- Trigger: Auto-update timestamp when messages change
DROP TRIGGER IF EXISTS trigger_update_aoi_conversation_timestamp ON aoi_conversations;
CREATE TRIGGER trigger_update_aoi_conversation_timestamp
  BEFORE UPDATE ON aoi_conversations
  FOR EACH ROW
  WHEN (OLD.messages IS DISTINCT FROM NEW.messages)
  EXECUTE FUNCTION update_aoi_conversation_timestamp();

-- Helper Function: Initialize conversation for new user
CREATE OR REPLACE FUNCTION initialize_aoi_conversation()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO aoi_conversations (
    user_id,
    messages,
    context,
    is_active
  )
  VALUES (
    NEW.id,
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'role', 'assistant',
        'content', 'Hi! I''m aOi, your learning companion. I''m here to help you understand blockchain, mining, and the TYT ecosystem. What would you like to know?',
        'timestamp', now()
      )
    ),
    jsonb_build_object(
      'welcome_message_sent', true,
      'created_source', 'auto_init'
    ),
    true
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger: Auto-create conversation when profile is created
DROP TRIGGER IF EXISTS trigger_init_aoi_conversation ON profiles;
CREATE TRIGGER trigger_init_aoi_conversation
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_aoi_conversation();

-- Helper Function: Archive old inactive conversations
CREATE OR REPLACE FUNCTION archive_old_aoi_conversations()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE aoi_conversations
  SET is_active = false
  WHERE is_active = true
    AND last_message_at < now() - INTERVAL '30 days';

  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$;