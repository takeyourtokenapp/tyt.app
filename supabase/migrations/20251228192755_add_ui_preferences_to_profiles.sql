/*
  # Add UI Preferences to Profiles

  1. Changes
    - Add `ui_theme` column (auto | light | dark)
    - Add `ui_language` column (EN | RU | HE)
    - Add default values for existing users
  
  2. Purpose
    - Store user interface preferences
    - Enable aOi to read and respect user settings
    - Support personalized experience across platform
*/

DO $$ 
BEGIN
  -- Add ui_theme if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ui_theme'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ui_theme text DEFAULT 'auto' CHECK (ui_theme IN ('auto', 'light', 'dark'));
  END IF;

  -- Add ui_language if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ui_language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ui_language text DEFAULT 'EN' CHECK (ui_language IN ('EN', 'RU', 'HE'));
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_ui_preferences 
ON profiles(ui_theme, ui_language);

-- Update existing profiles to have default values
UPDATE profiles 
SET ui_theme = 'auto', ui_language = 'EN'
WHERE ui_theme IS NULL OR ui_language IS NULL;