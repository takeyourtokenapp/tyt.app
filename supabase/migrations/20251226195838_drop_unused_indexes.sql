/*
  # Drop Unused Indexes
  
  1. Performance Optimization
    - Remove indexes that are not being used by any queries
    - Reduces storage overhead and write performance impact
    - Indexes can be recreated if needed in the future
  
  2. Indexes to Drop
    - idx_foundation_allocations_approved_by
    - idx_foundation_impact_reports_published_by
    - idx_security_alerts_acknowledged_by
    - idx_security_alerts_resolved_by
    - idx_user_achievements_badge_code_fkey
  
  Note: These indexes have not been used according to Supabase statistics.
  If they become necessary in the future, they can be recreated.
*/

-- Drop unused indexes from foundation tables
DROP INDEX IF EXISTS idx_foundation_allocations_approved_by;
DROP INDEX IF EXISTS idx_foundation_impact_reports_published_by;

-- Drop unused indexes from security tables
DROP INDEX IF EXISTS idx_security_alerts_acknowledged_by;
DROP INDEX IF EXISTS idx_security_alerts_resolved_by;

-- Drop unused index from user achievements
DROP INDEX IF EXISTS idx_user_achievements_badge_code_fkey;
