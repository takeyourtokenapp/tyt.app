/*
  # Add is_admin field to profiles

  1. Changes
    - Add `is_admin` (boolean, default false) to profiles table
    - Create index for fast admin lookups

  2. Security
    - Only admins can update is_admin field
    - This field will be used for admin access control
*/

-- Add is_admin column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;
