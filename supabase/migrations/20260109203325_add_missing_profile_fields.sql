/*
  # Add missing profile fields

  1. Changes
    - Add kyc_level field (integer, 0-3)
    - Add vip_tier field (text, Bronze/Silver/Gold/Platinum/Diamond)
    - Add avatar_url field
    - Update existing profiles with defaults
*/

-- Add missing fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS kyc_level integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS vip_tier text DEFAULT 'Bronze',
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Update existing profiles
UPDATE profiles
SET 
  kyc_level = COALESCE(kyc_level, 0),
  vip_tier = COALESCE(vip_tier, 'Bronze')
WHERE kyc_level IS NULL OR vip_tier IS NULL;
