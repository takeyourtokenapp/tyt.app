/*
  # Fix Academy Quests Schema

  ## Schema Fixes
  1. Extend quest_type enum with missing values:
     - daily
     - weekly
     - monthly
     - achievement
  
  2. Add missing columns to academy_quests:
     - difficulty (easy/medium/hard)
     - xp_reward (integer, default 0)
     - tyt_reward (numeric)
     - requirements (jsonb)
     - icon (text)
  
  ## Security
  - Maintain existing RLS policies
  - Ensure proper indexing
*/

-- Extend quest_type enum with missing values
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'quest_type' AND e.enumlabel = 'daily') THEN
    ALTER TYPE quest_type ADD VALUE 'daily';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'quest_type' AND e.enumlabel = 'weekly') THEN
    ALTER TYPE quest_type ADD VALUE 'weekly';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'quest_type' AND e.enumlabel = 'monthly') THEN
    ALTER TYPE quest_type ADD VALUE 'monthly';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'quest_type' AND e.enumlabel = 'achievement') THEN
    ALTER TYPE quest_type ADD VALUE 'achievement';
  END IF;
END $$;

-- Add missing columns to academy_quests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'academy_quests' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE academy_quests 
    ADD COLUMN difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'academy_quests' AND column_name = 'xp_reward'
  ) THEN
    ALTER TABLE academy_quests 
    ADD COLUMN xp_reward integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'academy_quests' AND column_name = 'tyt_reward'
  ) THEN
    ALTER TABLE academy_quests 
    ADD COLUMN tyt_reward numeric(20,8) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'academy_quests' AND column_name = 'requirements'
  ) THEN
    ALTER TABLE academy_quests 
    ADD COLUMN requirements jsonb NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'academy_quests' AND column_name = 'icon'
  ) THEN
    ALTER TABLE academy_quests 
    ADD COLUMN icon text;
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_academy_quests_type ON academy_quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_academy_quests_difficulty ON academy_quests(difficulty);
