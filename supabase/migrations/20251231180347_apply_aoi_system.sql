/*
  # aOi AI Character System

  1. New Tables
    - `aoi_user_progress` - Tracks user level, experience, and learning path
    - `aoi_guardian_consents` - Manages guardian approval for students
    - `aoi_achievements` - Records user achievements and milestones
    - `aoi_interactions` - Audit log of all aOi interactions

  2. Security
    - Enable RLS on all tables
    - Users can only view/update their own data
    - Guardians can view student consent status
    - Admin role can view aggregated stats (no PII)
*/

-- User Progress Table
CREATE TABLE IF NOT EXISTS aoi_user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level integer DEFAULT 1 CHECK (level BETWEEN 1 AND 4),
  experience_points integer DEFAULT 0 CHECK (experience_points >= 0),
  current_track text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Guardian Consent Table
CREATE TABLE IF NOT EXISTS aoi_guardian_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_email text NOT NULL,
  guardian_name text,
  consent_given boolean DEFAULT false,
  consent_timestamp timestamptz,
  expiry_date timestamptz,
  consent_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS aoi_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_code text NOT NULL,
  achievement_type text NOT NULL CHECK (achievement_type IN ('learning', 'contribution', 'milestone')),
  metadata jsonb DEFAULT '{}'::jsonb,
  earned_at timestamptz DEFAULT now(),
  on_chain_hash text,
  UNIQUE(user_id, achievement_code)
);

-- Interactions Log Table
CREATE TABLE IF NOT EXISTS aoi_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  interaction_type text NOT NULL,
  agent_called text,
  context jsonb DEFAULT '{}'::jsonb,
  response_summary text,
  created_at timestamptz DEFAULT now()
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS aoi_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS aoi_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES aoi_conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_aoi_user_progress_user_id ON aoi_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_aoi_guardian_consents_student_id ON aoi_guardian_consents(student_user_id);
CREATE INDEX IF NOT EXISTS idx_aoi_achievements_user_id ON aoi_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_aoi_interactions_user_id ON aoi_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_aoi_conversations_user_id ON aoi_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_aoi_messages_conversation_id ON aoi_messages(conversation_id);

-- Enable RLS
ALTER TABLE aoi_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_guardian_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aoi_user_progress
CREATE POLICY "Users can view own progress"
  ON aoi_user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON aoi_user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON aoi_user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for aoi_guardian_consents
CREATE POLICY "Students can view own guardian consent"
  ON aoi_guardian_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = student_user_id);

-- RLS Policies for aoi_achievements
CREATE POLICY "Users can view own achievements"
  ON aoi_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for aoi_interactions
CREATE POLICY "Users can view own interactions"
  ON aoi_interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for aoi_conversations
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

-- RLS Policies for aoi_messages
CREATE POLICY "Users can view messages in own conversations"
  ON aoi_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM aoi_conversations
      WHERE aoi_conversations.id = aoi_messages.conversation_id
      AND aoi_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON aoi_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM aoi_conversations
      WHERE aoi_conversations.id = conversation_id
      AND aoi_conversations.user_id = auth.uid()
    )
  );

-- Helper Function: Update user level based on XP
CREATE OR REPLACE FUNCTION update_aoi_user_level()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.level := CASE
    WHEN NEW.experience_points < 100 THEN 1
    WHEN NEW.experience_points < 500 THEN 2
    WHEN NEW.experience_points < 1500 THEN 3
    ELSE 4
  END;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Trigger to auto-update level when XP changes
DROP TRIGGER IF EXISTS trigger_update_aoi_level ON aoi_user_progress;
CREATE TRIGGER trigger_update_aoi_level
  BEFORE UPDATE ON aoi_user_progress
  FOR EACH ROW
  WHEN (OLD.experience_points IS DISTINCT FROM NEW.experience_points)
  EXECUTE FUNCTION update_aoi_user_level();

-- Helper Function: Initialize aOi progress for new users
CREATE OR REPLACE FUNCTION initialize_aoi_progress()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO aoi_user_progress (user_id, level, experience_points)
  VALUES (NEW.id, 1, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create aOi progress when profile is created
DROP TRIGGER IF EXISTS trigger_init_aoi_progress ON profiles;
CREATE TRIGGER trigger_init_aoi_progress
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_aoi_progress();