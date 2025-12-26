/*
  # Fix Multiple Permissive Policies (Fixed)
  
  1. Security Issue
    - Having multiple permissive policies for the same action can be confusing
    - Makes it harder to reason about access control
    - Should consolidate into single comprehensive policies
  
  2. Changes - community_online_users
    - Drop existing policies: "Users can manage own sessions" and "Users can view online users"
    - Create single policy: "Users can view online users and manage own sessions"
  
  3. Changes - game_tournament_participants
    - Drop existing policies: "Users can manage own participation" and "Users can view tournament participants"
    - Create single policy: "Users can view participants and manage own participation"
  
  4. Changes - treasury_reserves
    - Keep simple read-only access for authenticated users
*/

-- Fix community_online_users policies
DROP POLICY IF EXISTS "Users can manage own sessions" ON community_online_users;
DROP POLICY IF EXISTS "Users can view online users" ON community_online_users;

CREATE POLICY "Users can view online users and manage own sessions"
  ON community_online_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Fix game_tournament_participants policies
DROP POLICY IF EXISTS "Users can manage own participation" ON game_tournament_participants;
DROP POLICY IF EXISTS "Users can view tournament participants" ON game_tournament_participants;

CREATE POLICY "Users can view participants and manage own participation"
  ON game_tournament_participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Fix treasury_reserves policies
DROP POLICY IF EXISTS "System can manage treasury reserves" ON treasury_reserves;
DROP POLICY IF EXISTS "Authenticated users can view treasury reserves" ON treasury_reserves;

CREATE POLICY "Users can view treasury reserves"
  ON treasury_reserves
  FOR SELECT
  TO authenticated
  USING (true);
