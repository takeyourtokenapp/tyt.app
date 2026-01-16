/*
  # Fix User Discounts Trigger

  ## Problem
  The create_user_discounts_record() function tries to insert into
  non-existent table 'user_discount_tiers'. It should use 'user_discounts'.

  ## Solution
  Update the function to insert into correct table

  ## Changes
  - Fix create_user_discounts_record() to use user_discounts table
*/

-- Fix the function to use correct table name
CREATE OR REPLACE FUNCTION public.create_user_discounts_record()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert into user_discounts (not user_discount_tiers)
  INSERT INTO public.user_discounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
