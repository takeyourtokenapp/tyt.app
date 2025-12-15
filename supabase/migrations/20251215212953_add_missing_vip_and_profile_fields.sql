/*
  # Add Missing VIP and Profile Fields
  
  1. Updates to vip_tiers table
    - Add service_button_reward field for daily button rewards
    - Add min_spent and max_spent fields for spending-based VIP tiers
  
  2. Updates to profiles table
    - Add service_button_last_pressed timestamp
    - Add service_button_presses counter
    - Add total_spent for VIP tier calculation
  
  3. Security
    - Maintain existing RLS policies
    - All fields have sensible defaults
*/

-- Add fields to vip_tiers if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'vip_tiers' 
      AND column_name = 'service_button_reward'
  ) THEN
    ALTER TABLE public.vip_tiers ADD COLUMN service_button_reward numeric DEFAULT 10 CHECK (service_button_reward >= 0);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'vip_tiers' 
      AND column_name = 'min_spent'
  ) THEN
    ALTER TABLE public.vip_tiers ADD COLUMN min_spent numeric DEFAULT 0 CHECK (min_spent >= 0);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'vip_tiers' 
      AND column_name = 'max_spent'
  ) THEN
    ALTER TABLE public.vip_tiers ADD COLUMN max_spent numeric DEFAULT 999999999 CHECK (max_spent >= min_spent);
  END IF;
END $$;

-- Add fields to profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' 
      AND column_name = 'service_button_last_pressed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN service_button_last_pressed timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' 
      AND column_name = 'service_button_presses'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN service_button_presses integer DEFAULT 0 CHECK (service_button_presses >= 0);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' 
      AND column_name = 'total_spent'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN total_spent numeric DEFAULT 0 CHECK (total_spent >= 0);
  END IF;
END $$;

-- Update vip_tiers with default service button rewards if empty
UPDATE public.vip_tiers
SET service_button_reward = 
  CASE level
    WHEN 1 THEN 10
    WHEN 2 THEN 15
    WHEN 3 THEN 20
    WHEN 4 THEN 30
    WHEN 5 THEN 40
    WHEN 6 THEN 50
    WHEN 7 THEN 75
    WHEN 8 THEN 100
    WHEN 9 THEN 150
    WHEN 10 THEN 250
    ELSE 10
  END
WHERE service_button_reward IS NULL OR service_button_reward = 0;
