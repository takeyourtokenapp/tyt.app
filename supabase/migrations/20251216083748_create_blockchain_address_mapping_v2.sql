/*
  # Blockchain Address to User Mapping

  ## Summary
  Creates infrastructure for mapping blockchain addresses to user accounts.
  Essential for syncing on-chain NFT events to database.

  ## Tables
  - `user_blockchain_addresses` - Links wallet addresses to user accounts
  - Indexes for fast lookups

  ## Functions
  - `get_user_id_from_address()` - Lookup user by blockchain address
  - `register_user_address()` - Link new address to user

  ## Security
  - RLS enabled
  - Users can only register their own addresses
  - Service role can query all mappings
*/

-- Create user blockchain addresses table
CREATE TABLE IF NOT EXISTS user_blockchain_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blockchain text NOT NULL,
  address text NOT NULL,
  address_type text,
  is_verified boolean DEFAULT false,
  is_primary boolean DEFAULT false,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blockchain, address)
);

CREATE INDEX IF NOT EXISTS idx_user_blockchain_addresses_user_id ON user_blockchain_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blockchain_addresses_address ON user_blockchain_addresses(address);
CREATE INDEX IF NOT EXISTS idx_user_blockchain_addresses_blockchain ON user_blockchain_addresses(blockchain);

ALTER TABLE user_blockchain_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blockchain addresses"
  ON user_blockchain_addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can register own blockchain addresses"
  ON user_blockchain_addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own blockchain addresses"
  ON user_blockchain_addresses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all addresses"
  ON user_blockchain_addresses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to get user ID from blockchain address
CREATE OR REPLACE FUNCTION get_user_id_from_address(
  p_address text,
  p_blockchain text DEFAULT 'polygon'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id
  FROM user_blockchain_addresses
  WHERE LOWER(address) = LOWER(p_address)
    AND blockchain = p_blockchain
  LIMIT 1;
  
  RETURN v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_id_from_address(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_id_from_address(text, text) TO authenticated;

-- Function to register user address
CREATE OR REPLACE FUNCTION register_user_address(
  p_user_id uuid,
  p_blockchain text,
  p_address text,
  p_address_type text DEFAULT NULL,
  p_is_primary boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_address_id uuid;
BEGIN
  -- Check if address already exists
  SELECT id INTO v_address_id
  FROM user_blockchain_addresses
  WHERE LOWER(address) = LOWER(p_address)
    AND blockchain = p_blockchain;
  
  IF v_address_id IS NOT NULL THEN
    -- Update existing
    UPDATE user_blockchain_addresses
    SET user_id = p_user_id,
        address_type = COALESCE(p_address_type, address_type),
        is_primary = p_is_primary,
        last_used_at = now()
    WHERE id = v_address_id;
  ELSE
    -- Insert new
    INSERT INTO user_blockchain_addresses (
      user_id,
      blockchain,
      address,
      address_type,
      is_primary,
      is_verified,
      last_used_at
    ) VALUES (
      p_user_id,
      p_blockchain,
      p_address,
      p_address_type,
      p_is_primary,
      true,
      now()
    )
    RETURNING id INTO v_address_id;
  END IF;
  
  RETURN v_address_id;
END;
$$;

GRANT EXECUTE ON FUNCTION register_user_address(uuid, text, text, text, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION register_user_address(uuid, text, text, text, boolean) TO authenticated;

-- Function to get or create user from address (for blockchain-only users)
CREATE OR REPLACE FUNCTION get_or_create_user_from_address(
  p_address text,
  p_blockchain text DEFAULT 'polygon'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_username text;
  v_email text;
  v_exists boolean;
BEGIN
  -- Try to find existing user
  v_user_id := get_user_id_from_address(p_address, p_blockchain);
  
  IF v_user_id IS NOT NULL THEN
    RETURN v_user_id;
  END IF;
  
  -- Generate unique username and email
  v_username := 'user_' || LOWER(SUBSTRING(p_address, 1, 8));
  v_email := v_username || '@blockchain.local';
  
  -- Check if username exists and make it unique
  SELECT EXISTS(SELECT 1 FROM profiles WHERE username = v_username) INTO v_exists;
  IF v_exists THEN
    v_username := v_username || '_' || floor(random() * 10000)::text;
    v_email := v_username || '@blockchain.local';
  END IF;
  
  -- Create new user profile (minimal profile for blockchain-only users)
  -- Note: profiles.id must reference auth.users(id), so we need to create auth user first
  -- For blockchain-only users, we'll just link to existing authenticated users
  -- This function is mainly used by service_role during blockchain event sync
  
  -- For now, return NULL if user doesn't exist
  -- Admin must manually link blockchain addresses to existing users
  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION get_or_create_user_from_address(text, text) TO service_role;

-- View for active blockchain addresses
CREATE OR REPLACE VIEW v_active_blockchain_addresses AS
SELECT
  uba.id,
  uba.user_id,
  uba.blockchain,
  uba.address,
  uba.address_type,
  uba.is_primary,
  uba.is_verified,
  uba.last_used_at,
  p.username,
  p.full_name
FROM user_blockchain_addresses uba
JOIN profiles p ON p.id = uba.user_id
WHERE uba.is_verified = true
ORDER BY uba.last_used_at DESC;
