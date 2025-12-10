/*
  # Rewards and Maintenance System
  
  1. New Tables
    - `daily_rewards` - Daily BTC reward records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `miner_id` (uuid, references nft_miners)
      - `date` (date)
      - `btc_amount` (numeric) - Gross BTC earned
      - `hashrate_snapshot` (numeric)
      - `efficiency_snapshot` (numeric)
      - `network_difficulty` (numeric)
      - `btc_price_usd` (numeric)
      - `status` (enum: pending, processed, paid)
      - `processed_at` (timestamptz)
    
    - `maintenance_invoices` - Daily maintenance bills
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `miner_id` (uuid, references nft_miners)
      - `date` (date)
      - `base_cost_usd` (numeric)
      - `discount_percent` (numeric) - Total discount applied
      - `final_cost_usd` (numeric)
      - `payment_currency` (text) - TYT or USDT
      - `payment_amount` (numeric)
      - `status` (enum: pending, paid, overdue, waived)
      - `paid_at` (timestamptz)
      - `due_date` (date)
    
    - `discount_tiers` - Discount configuration for TYT payments
      - `id` (uuid, primary key)
      - `days_coverage` (integer) - Days of coverage needed
      - `discount_percent` (numeric)
      - `is_active` (boolean)
    
    - `user_discounts` - Active discount status per user
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tyt_balance_locked` (numeric)
      - `days_covered` (integer)
      - `current_discount_percent` (numeric)
      - `service_button_active` (boolean) - Daily -3% button
      - `vip_discount_percent` (numeric)
      - `effective_discount_percent` (numeric) - Max of all discounts
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can only access their own records
    - Discount tiers are publicly readable
*/

-- Create custom types
CREATE TYPE reward_status AS ENUM ('pending', 'processing', 'processed', 'paid', 'failed');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'waived', 'cancelled');

-- Daily Rewards table
CREATE TABLE IF NOT EXISTS daily_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  miner_id uuid NOT NULL REFERENCES nft_miners(id) ON DELETE CASCADE,
  reward_date date NOT NULL,
  btc_amount numeric NOT NULL CHECK (btc_amount >= 0),
  hashrate_snapshot numeric NOT NULL,
  efficiency_snapshot numeric NOT NULL,
  uptime_percent numeric DEFAULT 100 CHECK (uptime_percent >= 0 AND uptime_percent <= 100),
  network_difficulty numeric,
  btc_price_usd numeric,
  status reward_status DEFAULT 'pending',
  wallet_transaction_id uuid REFERENCES wallet_transactions(id),
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(miner_id, reward_date)
);

-- Maintenance Invoices table
CREATE TABLE IF NOT EXISTS maintenance_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  miner_id uuid NOT NULL REFERENCES nft_miners(id) ON DELETE CASCADE,
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  base_cost_usd numeric NOT NULL CHECK (base_cost_usd >= 0),
  kwh_consumed numeric,
  kwh_rate numeric,
  tyt_discount_percent numeric DEFAULT 0 CHECK (tyt_discount_percent >= 0 AND tyt_discount_percent <= 100),
  service_discount_percent numeric DEFAULT 0 CHECK (service_discount_percent >= 0 AND service_discount_percent <= 3),
  vip_discount_percent numeric DEFAULT 0 CHECK (vip_discount_percent >= 0 AND vip_discount_percent <= 20),
  total_discount_percent numeric DEFAULT 0 CHECK (total_discount_percent >= 0 AND total_discount_percent <= 100),
  final_cost_usd numeric NOT NULL CHECK (final_cost_usd >= 0),
  payment_currency wallet_currency,
  payment_amount numeric,
  status invoice_status DEFAULT 'pending',
  wallet_transaction_id uuid REFERENCES wallet_transactions(id),
  paid_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(miner_id, invoice_date)
);

-- Discount Tiers configuration
CREATE TABLE IF NOT EXISTS discount_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  days_coverage integer NOT NULL CHECK (days_coverage > 0),
  discount_percent numeric NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 20),
  min_tyt_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User Discounts tracking
CREATE TABLE IF NOT EXISTS user_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tyt_balance_available numeric DEFAULT 0,
  tyt_balance_locked numeric DEFAULT 0,
  days_covered integer DEFAULT 0,
  tyt_discount_percent numeric DEFAULT 0 CHECK (tyt_discount_percent >= 0 AND tyt_discount_percent <= 20),
  service_button_active boolean DEFAULT false,
  service_button_last_used_at timestamptz,
  service_discount_percent numeric DEFAULT 0,
  vip_discount_percent numeric DEFAULT 0,
  ve_tyt_discount_percent numeric DEFAULT 0,
  effective_discount_percent numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Reward Distribution Snapshots (for daily processing)
CREATE TABLE IF NOT EXISTS reward_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date UNIQUE NOT NULL,
  total_active_miners integer DEFAULT 0,
  total_hashrate numeric DEFAULT 0,
  btc_network_hashrate numeric,
  btc_block_reward numeric,
  btc_price_usd numeric,
  total_btc_distributed numeric DEFAULT 0,
  status text DEFAULT 'pending',
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_id ON daily_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_miner_id ON daily_rewards(miner_id);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_date ON daily_rewards(reward_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_status ON daily_rewards(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_user_id ON maintenance_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_miner_id ON maintenance_invoices(miner_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_date ON maintenance_invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_status ON maintenance_invoices(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_invoices_due_date ON maintenance_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_user_discounts_user_id ON user_discounts(user_id);

-- Enable RLS
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_snapshots ENABLE ROW LEVEL SECURITY;

-- Daily Rewards policies
CREATE POLICY "Users can view own rewards"
  ON daily_rewards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Maintenance Invoices policies
CREATE POLICY "Users can view own invoices"
  ON maintenance_invoices FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Discount Tiers policies (public read)
CREATE POLICY "Anyone can view active discount tiers"
  ON discount_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User Discounts policies
CREATE POLICY "Users can view own discounts"
  ON user_discounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own discounts"
  ON user_discounts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Reward Snapshots policies (public read)
CREATE POLICY "Anyone can view reward snapshots"
  ON reward_snapshots FOR SELECT
  TO authenticated
  USING (true);

-- Function to calculate effective discount
CREATE OR REPLACE FUNCTION calculate_effective_discount(
  p_user_id uuid
)
RETURNS numeric AS $$
DECLARE
  v_tyt_discount numeric := 0;
  v_service_discount numeric := 0;
  v_vip_discount numeric := 0;
  v_ve_discount numeric := 0;
  v_effective_discount numeric;
BEGIN
  -- Get all discount sources
  SELECT 
    COALESCE(tyt_discount_percent, 0),
    COALESCE(service_discount_percent, 0),
    COALESCE(vip_discount_percent, 0),
    COALESCE(ve_tyt_discount_percent, 0)
  INTO v_tyt_discount, v_service_discount, v_vip_discount, v_ve_discount
  FROM user_discounts
  WHERE user_id = p_user_id;
  
  -- TYT payment discount is additive
  v_effective_discount := v_tyt_discount;
  
  -- Service button is additive
  v_effective_discount := v_effective_discount + v_service_discount;
  
  -- VIP and veTYT: take the maximum
  v_effective_discount := v_effective_discount + GREATEST(v_vip_discount, v_ve_discount);
  
  -- Cap at 23% total (20% TYT + 3% service)
  v_effective_discount := LEAST(v_effective_discount, 23);
  
  RETURN v_effective_discount;
END;
$$ LANGUAGE plpgsql;

-- Insert default discount tiers (matching GoMining's 1-20% scale)
INSERT INTO discount_tiers (name, days_coverage, discount_percent, display_order) VALUES
  ('7 Days', 7, 5, 1),
  ('30 Days', 30, 10, 2),
  ('90 Days', 90, 15, 3),
  ('365 Days', 365, 20, 4)
ON CONFLICT DO NOTHING;

-- Function to auto-create user_discounts record
CREATE OR REPLACE FUNCTION create_user_discounts_record()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_discounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_discounts
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_discounts_record();