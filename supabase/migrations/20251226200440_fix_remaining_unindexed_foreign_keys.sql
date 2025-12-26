/*
  # Fix Remaining Unindexed Foreign Keys
  
  1. Performance Optimization
    - Add indexes to the last 5 foreign key columns without covering indexes
    - These are user reference columns (approved_by, published_by, etc.)
  
  2. Changes
    - foundation_allocations: Add index on approved_by
    - foundation_impact_reports: Add index on published_by
    - security_alerts: Add indexes on acknowledged_by and resolved_by
    - user_achievements: Add index on badge_code
  
  Note: These indexes improve query performance for lookups by user/badge references
*/

-- Foundation tables - user references
CREATE INDEX IF NOT EXISTS idx_foundation_allocations_approved_by 
  ON foundation_allocations(approved_by);

CREATE INDEX IF NOT EXISTS idx_foundation_impact_reports_published_by 
  ON foundation_impact_reports(published_by);

-- Security tables - user references
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged_by 
  ON security_alerts(acknowledged_by);

CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved_by 
  ON security_alerts(resolved_by);

-- User achievements - badge reference
CREATE INDEX IF NOT EXISTS idx_user_achievements_badge_code 
  ON user_achievements(badge_code);
