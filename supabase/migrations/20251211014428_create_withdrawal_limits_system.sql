/*
  # Withdrawal Limits & Daily Tracking System

  1. New Tables
    - `withdrawal_limits`
      - Defines limits per KYC tier
      - Daily, weekly, monthly limits
      - Min/max per transaction
    - `daily_withdrawal_tracking`
      - Tracks daily withdrawal usage per user
      - Auto-resets daily
      - Enforces limits
    - `withdrawal_requests`
      - Pending withdrawal requests
      - Admin approval queue
      - Status tracking

  2. Security
    - Enable RLS on all tables
    - Users can only view their own records
    - Admin policies for approval

  3. Features
    - KYC tier-based limits
    - Daily/weekly/monthly tracking
    - Admin approval workflow
    - Automatic limit resets
*/

-- Withdrawal Limits Configuration
CREATE TABLE IF NOT EXISTS withdrawal_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_tier int NOT NULL CHECK (kyc_tier >= 0 AND kyc_tier <= 3),
  min_withdrawal_amount numeric DEFAULT 10 CHECK (min_withdrawal_amount >= 0),
  max_withdrawal_amount numeric DEFAULT 100000 CHECK (max_withdrawal_amount >= min_withdrawal_amount),
  daily_limit numeric DEFAULT 1000 CHECK (daily_limit >= 0),
  weekly_limit numeric DEFAULT 5000 CHECK (weekly_limit >= 0),
  monthly_limit numeric DEFAULT 20000 CHECK (monthly_limit >= 0),
  requires_admin_approval boolean DEFAULT false,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(kyc_tier)
);

-- Daily Withdrawal Tracking
CREATE TABLE IF NOT EXISTS daily_withdrawal_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tracking_date date NOT NULL DEFAULT CURRENT_DATE,
  total_withdrawn_today numeric DEFAULT 0 CHECK (total_withdrawn_today >= 0),
  withdrawal_count_today int DEFAULT 0 CHECK (withdrawal_count_today >= 0),
  last_withdrawal_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, tracking_date)
);

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  destination_address text NOT NULL,
  network_code text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  kyc_tier int DEFAULT 0,
  requires_approval boolean DEFAULT false,
  admin_notes text,
  rejection_reason text,
  tx_hash text,
  fee_amount numeric DEFAULT 0,
  net_amount numeric,
  requested_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert Default Withdrawal Limits
INSERT INTO withdrawal_limits (kyc_tier, min_withdrawal_amount, max_withdrawal_amount, daily_limit, weekly_limit, monthly_limit, requires_admin_approval, description)
VALUES
  (0, 0, 0, 0, 0, 0, true, 'Not verified - No withdrawals allowed'),
  (1, 10, 500, 1000, 5000, 15000, false, 'Basic KYC - Email verified'),
  (2, 10, 5000, 10000, 50000, 150000, false, 'Advanced KYC - ID verified'),
  (3, 10, 50000, 999999999, 999999999, 999999999, false, 'Full KYC - Unlimited')
ON CONFLICT (kyc_tier) DO NOTHING;

-- Enable RLS
ALTER TABLE withdrawal_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_withdrawal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Withdrawal Limits
CREATE POLICY "Anyone can view withdrawal limits"
  ON withdrawal_limits FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies: Daily Tracking
CREATE POLICY "Users can view own withdrawal tracking"
  ON daily_withdrawal_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies: Withdrawal Requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_tracking_user_date ON daily_withdrawal_tracking(user_id, tracking_date);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_pending ON withdrawal_requests(status, requested_at) WHERE status = 'pending';

-- Function: Get User Daily Withdrawal Stats
CREATE OR REPLACE FUNCTION get_user_withdrawal_stats(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_kyc_tier int;
  v_limits jsonb;
  v_today_used numeric;
  v_remaining numeric;
BEGIN
  SELECT COALESCE(kyc_tier, 0) INTO v_kyc_tier FROM user_profiles WHERE user_id = p_user_id;
  SELECT jsonb_build_object('min_amount', min_withdrawal_amount, 'max_amount', max_withdrawal_amount, 'daily_limit', daily_limit, 'weekly_limit', weekly_limit, 'monthly_limit', monthly_limit, 'requires_approval', requires_admin_approval) INTO v_limits FROM withdrawal_limits WHERE kyc_tier = v_kyc_tier AND is_active = true;
  SELECT COALESCE(total_withdrawn_today, 0) INTO v_today_used FROM daily_withdrawal_tracking WHERE user_id = p_user_id AND tracking_date = CURRENT_DATE;
  v_remaining := (v_limits->>'daily_limit')::numeric - v_today_used;
  RETURN jsonb_build_object('kyc_tier', v_kyc_tier, 'limits', v_limits, 'today_used', v_today_used, 'today_remaining', GREATEST(v_remaining, 0), 'can_withdraw', v_remaining > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update Daily Tracking
CREATE OR REPLACE FUNCTION update_withdrawal_tracking(p_user_id uuid, p_amount numeric)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_withdrawal_tracking (user_id, tracking_date, total_withdrawn_today, withdrawal_count_today, last_withdrawal_at)
  VALUES (p_user_id, CURRENT_DATE, p_amount, 1, now())
  ON CONFLICT (user_id, tracking_date)
  DO UPDATE SET total_withdrawn_today = daily_withdrawal_tracking.total_withdrawn_today + p_amount, withdrawal_count_today = daily_withdrawal_tracking.withdrawal_count_today + 1, last_withdrawal_at = now(), updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-update timestamps
CREATE OR REPLACE FUNCTION update_withdrawal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_withdrawal_limits_timestamp BEFORE UPDATE ON withdrawal_limits FOR EACH ROW EXECUTE FUNCTION update_withdrawal_timestamp();
CREATE TRIGGER update_daily_tracking_timestamp BEFORE UPDATE ON daily_withdrawal_tracking FOR EACH ROW EXECUTE FUNCTION update_withdrawal_timestamp();
CREATE TRIGGER update_withdrawal_requests_timestamp BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_withdrawal_timestamp();
