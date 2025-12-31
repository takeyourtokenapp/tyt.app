/*
  # Add User Language Preference Support

  ## Summary
  Adds multilingual support to user profiles by storing language preferences in the database.

  ## Changes
  1. **Profiles Table Updates**
    - Add `preferred_language` column (en, ru, he)
    - Add `preferred_theme` column (light, dark, auto) - if not exists
    - Set default language to 'en'
    - Set default theme to 'auto'

  2. **Security**
    - No RLS changes needed (profiles table already has proper RLS)
    - Users can only update their own language preference

  ## Purpose
  This migration enables the platform to:
  - Remember user's language preference across sessions
  - Automatically set interface language based on user preference
  - Support English, Russian, and Hebrew
  - Sync language preference with frontend i18n system
*/

-- Add preferred_language column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN preferred_language text DEFAULT 'en' CHECK (preferred_language IN ('en', 'ru', 'he'));
    
    COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred interface language: en (English), ru (Russian), he (Hebrew)';
  END IF;
END $$;

-- Add preferred_theme column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'preferred_theme'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN preferred_theme text DEFAULT 'auto' CHECK (preferred_theme IN ('light', 'dark', 'auto'));
    
    COMMENT ON COLUMN public.profiles.preferred_theme IS 'User preferred theme: light, dark, or auto (based on time/system)';
  END IF;
END $$;

-- Create index for faster language-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_language
  ON public.profiles(preferred_language);

CREATE INDEX IF NOT EXISTS idx_profiles_preferred_theme
  ON public.profiles(preferred_theme);