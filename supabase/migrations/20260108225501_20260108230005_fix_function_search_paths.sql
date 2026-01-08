/*
  # Fix Function Search Paths

  1. Security Enhancement
    - Set explicit search_path for functions
    - Prevents search_path hijacking attacks

  2. Functions Fixed
    - update_foundation_contact_submissions_updated_at
    - update_contact_messages_updated_at
*/

-- Fix update_foundation_contact_submissions_updated_at
CREATE OR REPLACE FUNCTION update_foundation_contact_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_contact_messages_updated_at
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
