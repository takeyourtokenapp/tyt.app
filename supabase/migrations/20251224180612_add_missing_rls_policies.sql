/*
  # Add Missing RLS Policies

  Tables have RLS enabled but no policies, making them inaccessible.
  This adds appropriate policies.

  Affected tables:
  - protocol_revenue
  - treasury_reserves
*/

-- ============================================
-- TABLE: protocol_revenue
-- ============================================

-- Admins and authenticated users can view protocol revenue
CREATE POLICY "Authenticated users can view protocol revenue"
  ON protocol_revenue
  FOR SELECT
  TO authenticated
  USING (true);

-- Only system/functions can insert revenue records
CREATE POLICY "System can insert protocol revenue"
  ON protocol_revenue
  FOR INSERT
  TO authenticated
  WITH CHECK (false); -- Explicitly block manual inserts, use functions only

-- ============================================
-- TABLE: treasury_reserves
-- ============================================

-- Authenticated users can view treasury reserves
CREATE POLICY "Authenticated users can view treasury reserves"
  ON treasury_reserves
  FOR SELECT
  TO authenticated
  USING (true);

-- Only system/functions can modify treasury
CREATE POLICY "System can manage treasury reserves"
  ON treasury_reserves
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false); -- Explicitly block manual modifications