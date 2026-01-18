/*
  # Fix RLS Auth Performance - Corrected Version
  
  ## Problem
  RLS policies using auth.uid() directly re-evaluate for each row.
  aoi_events doesn't have user_id column.
  
  ## Solution
  Replace auth.uid() with (select auth.uid()) where applicable.
  Skip tables that don't have the referenced columns.
  
  ## Changes
  - Fix orbital_nodes policies
  - Fix aoi_explanations policies (if user_id exists)
  - Fix aoi_verification policies
  - Fix orbital_events policies
*/

-- orbital_nodes: Fix service role policy
DROP POLICY IF EXISTS "Service role can modify orbital nodes" ON orbital_nodes;
CREATE POLICY "Service role can modify orbital nodes"
  ON orbital_nodes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- aoi_explanations: Fix user view policy (check if user_id exists first)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'aoi_explanations' 
    AND column_name = 'user_id'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own aOi explanations" ON aoi_explanations;
    EXECUTE 'CREATE POLICY "Users can view their own aOi explanations"
      ON aoi_explanations
      FOR SELECT
      TO authenticated
      USING (user_id = (SELECT auth.uid()))';
  END IF;
END $$;

-- aoi_explanations: Fix service role insert policy
DROP POLICY IF EXISTS "Service role can insert aOi explanations" ON aoi_explanations;
CREATE POLICY "Service role can insert aOi explanations"
  ON aoi_explanations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- aoi_verification: Fix service role insert policy
DROP POLICY IF EXISTS "Service role can insert aOi verification" ON aoi_verification;
CREATE POLICY "Service role can insert aOi verification"
  ON aoi_verification
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- orbital_events: Fix service role insert policy
DROP POLICY IF EXISTS "Service role can insert orbital events" ON orbital_events;
CREATE POLICY "Service role can insert orbital events"
  ON orbital_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);
