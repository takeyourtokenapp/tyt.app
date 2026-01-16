/*
  # Add Missing Dashboard Fields

  ## Problem
  Dashboard tries to access fields that don't exist:
  - profiles: service_button_last_pressed, service_button_presses, total_spent
  - vip_tiers: service_button_reward, min_spent, max_spent

  ## Solution
  Add these fields to both tables with proper defaults

  ## Changes
  - Add service_button_last_pressed to profiles
  - Add service_button_presses to profiles
  - Add total_spent to profiles
  - Add service_button_reward to vip_tiers
  - Add min_spent to vip_tiers
  - Add max_spent to vip_tiers
*/

-- Add fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS service_button_last_pressed timestamptz,
  ADD COLUMN IF NOT EXISTS service_button_presses integer DEFAULT 0 CHECK (service_button_presses >= 0),
  ADD COLUMN IF NOT EXISTS total_spent numeric DEFAULT 0 CHECK (total_spent >= 0);

-- Add fields to vip_tiers
ALTER TABLE public.vip_tiers 
  ADD COLUMN IF NOT EXISTS service_button_reward numeric DEFAULT 10 CHECK (service_button_reward >= 0),
  ADD COLUMN IF NOT EXISTS min_spent numeric DEFAULT 0 CHECK (min_spent >= 0),
  ADD COLUMN IF NOT EXISTS max_spent numeric DEFAULT 999999999 CHECK (max_spent >= min_spent);

-- Set default service button rewards for existing VIP tiers
UPDATE public.vip_tiers
SET 
  service_button_reward = CASE level
    WHEN 0 THEN 10
    WHEN 1 THEN 15
    WHEN 2 THEN 20
    WHEN 3 THEN 30
    WHEN 4 THEN 40
    WHEN 5 THEN 50
    WHEN 6 THEN 75
    WHEN 7 THEN 100
    WHEN 8 THEN 150
    WHEN 9 THEN 200
    WHEN 10 THEN 250
    ELSE 10
  END,
  min_spent = CASE level
    WHEN 0 THEN 0
    WHEN 1 THEN 100
    WHEN 2 THEN 500
    WHEN 3 THEN 1000
    WHEN 4 THEN 2500
    WHEN 5 THEN 5000
    WHEN 6 THEN 10000
    WHEN 7 THEN 25000
    WHEN 8 THEN 50000
    WHEN 9 THEN 100000
    WHEN 10 THEN 250000
    ELSE 0
  END,
  max_spent = CASE level
    WHEN 0 THEN 99
    WHEN 1 THEN 499
    WHEN 2 THEN 999
    WHEN 3 THEN 2499
    WHEN 4 THEN 4999
    WHEN 5 THEN 9999
    WHEN 6 THEN 24999
    WHEN 7 THEN 49999
    WHEN 8 THEN 99999
    WHEN 9 THEN 249999
    WHEN 10 THEN 999999999
    ELSE 99
  END
WHERE service_button_reward IS NULL OR service_button_reward = 10;
