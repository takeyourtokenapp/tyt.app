/*
  # Fix Token Price Cache RLS Policies - Remove Unrestricted Access

  1. Problem
    - INSERT policies have WITH CHECK (true) - allows unrestricted inserts
    - Anonymous and authenticated users can insert any price data
    - This is a cache poisoning vulnerability
    - Malicious users could insert fake prices

  2. Solution
    - Remove unrestricted INSERT policies for anon and authenticated
    - Add service_role only INSERT policy (backend-only updates)
    - Keep SELECT policies for reading cached prices
    - Add validation constraints at table level

  3. Impact
    - Users can READ cached prices (performance benefit)
    - Only backend services can UPDATE prices (security)
    - Prevents cache poisoning attacks
    - Maintains cache functionality

  4. Architecture
    - Frontend: READ ONLY via Edge Functions
    - Backend: WRITE via service_role key
    - Edge Functions update cache using service_role
*/

-- Drop the vulnerable policies
DROP POLICY IF EXISTS "Anon users can cache token prices" ON token_price_cache;
DROP POLICY IF EXISTS "Authenticated users can cache token prices" ON token_price_cache;

-- Keep SELECT policies (reading cache is safe)
-- These should already exist from original migration

-- Add service_role only INSERT policy
CREATE POLICY "Service role can manage token price cache"
ON token_price_cache
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add validation at table level (if not already exists)
-- This prevents invalid data even from service_role
DO $$ 
BEGIN
  -- Add check: price must be positive
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'token_price_cache_price_positive'
  ) THEN
    ALTER TABLE token_price_cache 
    ADD CONSTRAINT token_price_cache_price_positive 
    CHECK (price > 0);
  END IF;

  -- Add check: token_mint must not be empty
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'token_price_cache_token_mint_not_empty'
  ) THEN
    ALTER TABLE token_price_cache 
    ADD CONSTRAINT token_price_cache_token_mint_not_empty 
    CHECK (token_mint IS NOT NULL AND length(token_mint) > 0);
  END IF;

  -- Add check: source must be specified
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'token_price_cache_source_not_empty'
  ) THEN
    ALTER TABLE token_price_cache 
    ADD CONSTRAINT token_price_cache_source_not_empty 
    CHECK (source IS NOT NULL AND length(source) > 0);
  END IF;
END $$;

-- Add comment documenting security model
COMMENT ON TABLE token_price_cache IS 
'Token price cache - READ-ONLY for users, WRITE-ONLY for services
Security: Users can read cached prices. Only backend services via service_role can update prices.
This prevents cache poisoning while maintaining performance benefits.
Price updates should be done via Edge Functions with proper validation.';
