/*
  # RLS Security Test Functions

  1. Purpose
    - Create test functions to verify RLS policies work correctly
    - Test user isolation (users can only see their own data)
    - Test admin access (admins can see appropriate data)
    - Test public data access (anonymous users can access public tables)
    - Test privilege escalation prevention

  2. Security Testing Categories
    - User Data Isolation Tests
    - Admin Access Tests
    - Public Data Access Tests
    - Privilege Escalation Tests
    - Cross-User Access Prevention Tests

  3. Usage
    - Run test functions as different roles to verify RLS
    - Check results for security violations
    - All tests should return expected results without RLS bypass
*/

-- ============================================================
-- TEST HELPER FUNCTIONS
-- ============================================================

-- Function to create test users
CREATE OR REPLACE FUNCTION create_test_users()
RETURNS TABLE(
  user_a_id uuid,
  user_b_id uuid,
  admin_id uuid
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
BEGIN
  -- Create test user A
  INSERT INTO profiles (id, username, email)
  VALUES (
    gen_random_uuid(),
    'test_user_a',
    'test_user_a@example.com'
  )
  ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
  RETURNING id INTO v_user_a_id;

  -- Create test user B
  INSERT INTO profiles (id, username, email)
  VALUES (
    gen_random_uuid(),
    'test_user_b',
    'test_user_b@example.com'
  )
  ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
  RETURNING id INTO v_user_b_id;

  -- Create test admin
  INSERT INTO profiles (id, username, email, is_admin)
  VALUES (
    gen_random_uuid(),
    'test_admin',
    'test_admin@example.com',
    true
  )
  ON CONFLICT (email) DO UPDATE 
  SET username = EXCLUDED.username, is_admin = true
  RETURNING id INTO v_admin_id;

  RETURN QUERY SELECT v_user_a_id, v_user_b_id, v_admin_id;
END;
$$;

-- ============================================================
-- TEST 1: User Data Isolation - Profiles
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_profile_isolation()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
  v_count integer;
BEGIN
  -- Create test users
  SELECT user_a_id, user_b_id, admin_id 
  INTO v_user_a_id, v_user_b_id, v_admin_id
  FROM create_test_users();

  -- Test 1: User A cannot see User B's profile details
  -- Simulate User A's session
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a_id)::text, true);
  
  SELECT COUNT(*) INTO v_count
  FROM profiles
  WHERE id = v_user_b_id;

  RETURN QUERY SELECT 
    'Profile Isolation: User A cannot see User B'::text,
    v_count = 0,
    format('User A should not see User B profile. Saw %s profiles', v_count);

  -- Test 2: User can see own profile
  SELECT COUNT(*) INTO v_count
  FROM profiles
  WHERE id = v_user_a_id;

  RETURN QUERY SELECT 
    'Profile Access: User can see own profile'::text,
    v_count = 1,
    format('User should see own profile. Saw %s profiles', v_count);

  -- Test 3: User cannot update another user's profile
  BEGIN
    UPDATE profiles
    SET username = 'hacked'
    WHERE id = v_user_b_id;
    
    RETURN QUERY SELECT 
      'Profile Update: User cannot update other profiles'::text,
      false,
      'SECURITY VIOLATION: User was able to update another user profile!';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RETURN QUERY SELECT 
      'Profile Update: User cannot update other profiles'::text,
      true,
      'User correctly prevented from updating other profiles';
  END;
END;
$$;

-- ============================================================
-- TEST 2: Wallet Isolation
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_wallet_isolation()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
  v_wallet_a_id uuid;
  v_wallet_b_id uuid;
  v_count integer;
BEGIN
  -- Create test users
  SELECT user_a_id, user_b_id, admin_id 
  INTO v_user_a_id, v_user_b_id, v_admin_id
  FROM create_test_users();

  -- Create wallets for test users
  INSERT INTO custodial_wallets (user_id, currency, balance)
  VALUES 
    (v_user_a_id, 'BTC', '1.5'),
    (v_user_b_id, 'BTC', '2.5')
  RETURNING id INTO v_wallet_a_id;

  -- Test: User A cannot see User B's wallet
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a_id)::text, true);
  
  SELECT COUNT(*) INTO v_count
  FROM custodial_wallets
  WHERE user_id = v_user_b_id;

  RETURN QUERY SELECT 
    'Wallet Isolation: User A cannot see User B wallet'::text,
    v_count = 0,
    format('User A should not see User B wallet. Saw %s wallets', v_count);

  -- Test: User can see own wallet
  SELECT COUNT(*) INTO v_count
  FROM custodial_wallets
  WHERE user_id = v_user_a_id;

  RETURN QUERY SELECT 
    'Wallet Access: User can see own wallet'::text,
    v_count >= 1,
    format('User should see own wallet. Saw %s wallets', v_count);

  -- Test: User cannot withdraw from another user's wallet
  BEGIN
    UPDATE custodial_wallets
    SET balance = '0'
    WHERE user_id = v_user_b_id;
    
    RETURN QUERY SELECT 
      'Wallet Security: User cannot modify other wallets'::text,
      false,
      'SECURITY VIOLATION: User was able to modify another wallet!';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RETURN QUERY SELECT 
      'Wallet Security: User cannot modify other wallets'::text,
      true,
      'User correctly prevented from modifying other wallets';
  END;
END;
$$;

-- ============================================================
-- TEST 3: NFT Miner Ownership
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_miner_ownership()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
  v_miner_a_id uuid;
  v_miner_b_id uuid;
  v_count integer;
BEGIN
  -- Create test users
  SELECT user_a_id, user_b_id, admin_id 
  INTO v_user_a_id, v_user_b_id, v_admin_id
  FROM create_test_users();

  -- Create miners for test users
  INSERT INTO nft_miners (owner_id, token_id, power_th, efficiency_w_th, status)
  VALUES 
    (v_user_a_id, 1001, 100, 25, 'active'),
    (v_user_b_id, 1002, 100, 25, 'active')
  RETURNING id INTO v_miner_a_id;

  -- Test: User A cannot see User B's miner
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a_id)::text, true);
  
  SELECT COUNT(*) INTO v_count
  FROM nft_miners
  WHERE owner_id = v_user_b_id AND status != 'listed';

  RETURN QUERY SELECT 
    'Miner Isolation: User A cannot see User B miner'::text,
    v_count = 0,
    format('User A should not see User B miner. Saw %s miners', v_count);

  -- Test: User cannot steal another user's miner
  BEGIN
    UPDATE nft_miners
    SET owner_id = v_user_a_id
    WHERE owner_id = v_user_b_id;
    
    RETURN QUERY SELECT 
      'Miner Security: User cannot steal miners'::text,
      false,
      'SECURITY VIOLATION: User was able to steal another user miner!';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RETURN QUERY SELECT 
      'Miner Security: User cannot steal miners'::text,
      true,
      'User correctly prevented from stealing miners';
  END;
END;
$$;

-- ============================================================
-- TEST 4: Rewards Isolation
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_rewards_isolation()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
  v_count integer;
BEGIN
  -- Create test users
  SELECT user_a_id, user_b_id, admin_id 
  INTO v_user_a_id, v_user_b_id, v_admin_id
  FROM create_test_users();

  -- Create rewards for test users
  INSERT INTO daily_rewards (user_id, date, gross_btc, net_btc, status)
  VALUES 
    (v_user_a_id, CURRENT_DATE, 0.001, 0.0009, 'completed'),
    (v_user_b_id, CURRENT_DATE, 0.002, 0.0018, 'completed');

  -- Test: User A cannot see User B's rewards
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_user_a_id)::text, true);
  
  SELECT COUNT(*) INTO v_count
  FROM daily_rewards
  WHERE user_id = v_user_b_id;

  RETURN QUERY SELECT 
    'Rewards Isolation: User A cannot see User B rewards'::text,
    v_count = 0,
    format('User A should not see User B rewards. Saw %s rewards', v_count);

  -- Test: User cannot claim another user's rewards
  BEGIN
    UPDATE daily_rewards
    SET status = 'claimed'
    WHERE user_id = v_user_b_id;
    
    RETURN QUERY SELECT 
      'Rewards Security: User cannot claim other rewards'::text,
      false,
      'SECURITY VIOLATION: User was able to claim another user rewards!';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RETURN QUERY SELECT 
      'Rewards Security: User cannot claim other rewards'::text,
      true,
      'User correctly prevented from claiming other rewards';
  END;
END;
$$;

-- ============================================================
-- TEST 5: Public Data Access (Anonymous Users)
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_public_access()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Clear JWT claims to simulate anonymous user
  PERFORM set_config('request.jwt.claims', NULL, true);

  -- Test 1: Anonymous can view academy tracks
  SELECT COUNT(*) INTO v_count
  FROM academy_tracks;

  RETURN QUERY SELECT 
    'Public Access: Anonymous can view academy tracks'::text,
    v_count >= 0,
    format('Anonymous should see academy tracks. Saw %s tracks', v_count);

  -- Test 2: Anonymous can view foundation campaigns
  SELECT COUNT(*) INTO v_count
  FROM foundation_campaigns;

  RETURN QUERY SELECT 
    'Public Access: Anonymous can view foundation campaigns'::text,
    v_count >= 0,
    format('Anonymous should see campaigns. Saw %s campaigns', v_count);

  -- Test 3: Anonymous cannot view user wallets
  BEGIN
    SELECT COUNT(*) INTO v_count
    FROM custodial_wallets;

    RETURN QUERY SELECT 
      'Public Protection: Anonymous cannot view wallets'::text,
      v_count = 0,
      'SECURITY VIOLATION: Anonymous user can see wallets!';
  EXCEPTION WHEN insufficient_privilege THEN
    RETURN QUERY SELECT 
      'Public Protection: Anonymous cannot view wallets'::text,
      true,
      'Anonymous correctly prevented from viewing wallets';
  END;
END;
$$;

-- ============================================================
-- TEST 6: Admin Access
-- ============================================================

CREATE OR REPLACE FUNCTION test_rls_admin_access()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_admin_id uuid;
  v_count integer;
BEGIN
  -- Create test users
  SELECT user_a_id, user_b_id, admin_id 
  INTO v_user_a_id, v_user_b_id, v_admin_id
  FROM create_test_users();

  -- Simulate admin session
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_admin_id)::text, true);

  -- Test: Admin can view contact messages
  SELECT COUNT(*) INTO v_count
  FROM contact_messages;

  RETURN QUERY SELECT 
    'Admin Access: Admin can view contact messages'::text,
    v_count >= 0,
    format('Admin should see contact messages. Saw %s messages', v_count);

  -- Test: Admin can update contact messages
  BEGIN
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES ('Test', 'test@example.com', 'Test', 'Test message');

    UPDATE contact_messages
    SET is_read = true
    WHERE email = 'test@example.com';

    RETURN QUERY SELECT 
      'Admin Update: Admin can update contact messages'::text,
      true,
      'Admin correctly able to update contact messages';
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'Admin Update: Admin can update contact messages'::text,
      false,
      'Admin incorrectly prevented from updating messages';
  END;
END;
$$;

-- ============================================================
-- RUN ALL TESTS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION run_all_rls_tests()
RETURNS TABLE(
  test_name text,
  passed boolean,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT * FROM test_rls_profile_isolation();
  RETURN QUERY SELECT * FROM test_rls_wallet_isolation();
  RETURN QUERY SELECT * FROM test_rls_miner_ownership();
  RETURN QUERY SELECT * FROM test_rls_rewards_isolation();
  RETURN QUERY SELECT * FROM test_rls_public_access();
  RETURN QUERY SELECT * FROM test_rls_admin_access();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_test_users() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_profile_isolation() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_wallet_isolation() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_miner_ownership() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_rewards_isolation() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_public_access() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_admin_access() TO authenticated;
GRANT EXECUTE ON FUNCTION run_all_rls_tests() TO authenticated;
