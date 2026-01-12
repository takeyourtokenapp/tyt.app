/*
  # Add Missing Price Alerts Foreign Key Index

  1. Purpose
    - Add index to price_alerts(user_id) foreign key column
    - This was accidentally dropped in previous cleanup migration
    - Foreign keys MUST have indexes for optimal performance

  2. Impact
    - Faster JOIN operations on price_alerts
    - Faster foreign key constraint validation
    - Essential for DELETE/UPDATE cascades on profiles table

  3. Technical Details
    - user_id references profiles(id)
    - Index improves queries filtering by user_id
    - Critical for user-specific alert queries
*/

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id 
ON price_alerts(user_id);

COMMENT ON INDEX idx_price_alerts_user_id IS 
'Foreign key index for price_alerts.user_id -> profiles.id
Required for optimal JOIN performance and FK constraint validation.';
