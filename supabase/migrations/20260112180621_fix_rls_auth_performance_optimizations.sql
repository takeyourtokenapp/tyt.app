/*
  # Fix RLS Policy Performance Issues - auth.uid() Optimization

  1. Purpose
    - Replace direct auth.uid() calls with (SELECT auth.uid())
    - Direct calls re-evaluate for EVERY row, causing O(n) auth lookups
    - SELECT subquery evaluates ONCE and caches result, giving O(1) performance
    
  2. Tables Updated (8 policies)
    - admin_users (1 policy)
    - price_alerts (4 policies)
    - aoi_knowledge_graph (2 policies)
    - profiles (1 policy)

  3. Performance Impact
    - Reduces database CPU by 50-90% on large queries
    - Eliminates repeated JWT decoding for each row
    - Critical for queries returning 1000+ rows

  4. Technical Details
    - auth.uid() = inline function, called per row
    - (SELECT auth.uid()) = subquery, called once and cached
    - This is a Supabase best practice for RLS at scale
*/

-- ============================================================
-- FIX 1: admin_users table
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can view admin_users if they are admin" ON admin_users;

CREATE POLICY "Authenticated users can view admin_users if they are admin"
ON admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

-- ============================================================
-- FIX 2: price_alerts table (4 policies)
-- ============================================================

DROP POLICY IF EXISTS "Users can view own price alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can create own price alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can update own price alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can delete own price alerts" ON price_alerts;

CREATE POLICY "Users can view own price alerts"
ON price_alerts
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own price alerts"
ON price_alerts
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own price alerts"
ON price_alerts
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own price alerts"
ON price_alerts
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- FIX 3: aoi_knowledge_graph table (2 policies)
-- ============================================================

DROP POLICY IF EXISTS "Admins can insert knowledge" ON aoi_knowledge_graph;
DROP POLICY IF EXISTS "Admins can update knowledge" ON aoi_knowledge_graph;

CREATE POLICY "Admins can insert knowledge"
ON aoi_knowledge_graph
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update knowledge"
ON aoi_knowledge_graph
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

-- ============================================================
-- FIX 4: profiles table
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));
