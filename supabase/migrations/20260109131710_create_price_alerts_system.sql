/*
  # Create Price Alerts System for TYT Trading

  1. New Tables
    - `price_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `token_symbol` (text) - e.g., 'TYT', 'BTC'
      - `target_price` (numeric) - price threshold
      - `condition` (text) - 'above' or 'below'
      - `is_active` (boolean) - whether alert is enabled
      - `triggered_at` (timestamptz, nullable) - when alert was triggered
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `price_alerts` table
    - Add policies for authenticated users to manage their own alerts

  3. Indexes
    - Add index on user_id for fast lookups
    - Add index on is_active for filtering active alerts
*/

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_symbol text NOT NULL DEFAULT 'TYT',
  target_price numeric NOT NULL CHECK (target_price > 0),
  condition text NOT NULL CHECK (condition IN ('above', 'below')),
  is_active boolean NOT NULL DEFAULT true,
  triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own price alerts"
  ON price_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own price alerts"
  ON price_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts"
  ON price_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
  ON price_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_price_alerts_token ON price_alerts(token_symbol);
