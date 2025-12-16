/*
  # Maintenance Engine Service - Block 2.5

  ## Summary
  Extends existing maintenance system with:
  - Regional fee configuration
  - Dynamic discount calculations
  - Maintenance calculation functions
  - Payment tracking

  ## Changes
  - Creates `maintenance_fee_config` table
  - Adds missing columns to `maintenance_invoices`
  - Creates calculation functions
  - Creates payment tracking
*/

-- Maintenance fee configuration by region
CREATE TABLE IF NOT EXISTS maintenance_fee_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL UNIQUE,
  kwh_usd numeric(8, 4) NOT NULL CHECK (kwh_usd > 0),
  service_bps integer NOT NULL CHECK (service_bps >= 0 AND service_bps <= 2000),
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_fee_config_region ON maintenance_fee_config(region);

-- Seed default regions
INSERT INTO maintenance_fee_config (region, kwh_usd, service_bps) VALUES
  ('USA', 0.12, 200),
  ('Canada', 0.08, 200),
  ('Europe', 0.15, 250),
  ('Asia', 0.10, 200),
  ('Default', 0.10, 200)
ON CONFLICT (region) DO NOTHING;

ALTER TABLE maintenance_fee_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fee config"
  ON maintenance_fee_config FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Extend maintenance_invoices if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_invoices' AND column_name = 'period_start'
  ) THEN
    ALTER TABLE maintenance_invoices
      ADD COLUMN period_start date,
      ADD COLUMN period_end date;
    
    UPDATE maintenance_invoices
    SET period_start = invoice_date,
        period_end = invoice_date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_invoices' AND column_name = 'elec_usd'
  ) THEN
    ALTER TABLE maintenance_invoices
      ADD COLUMN elec_usd numeric(12, 2) DEFAULT 0,
      ADD COLUMN service_usd numeric(12, 2) DEFAULT 0,
      ADD COLUMN discount_pct integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_invoices' AND column_name = 'asset'
  ) THEN
    ALTER TABLE maintenance_invoices
      ADD COLUMN asset text;
  END IF;
END $$;

-- Maintenance payments table
CREATE TABLE IF NOT EXISTS maintenance_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES maintenance_invoices(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(18, 8) NOT NULL CHECK (amount > 0),
  amount_usd numeric(12, 2) NOT NULL,
  asset text NOT NULL,
  tyt_burned numeric(18, 8) DEFAULT 0,
  discount_pct integer DEFAULT 0,
  transaction_id uuid REFERENCES wallet_transactions(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_payments_invoice ON maintenance_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_payments_user ON maintenance_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_payments_transaction ON maintenance_payments(transaction_id);

ALTER TABLE maintenance_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON maintenance_payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments"
  ON maintenance_payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage payments"
  ON maintenance_payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to calculate discount based on VIP, veTYT, prepay, service button
CREATE OR REPLACE FUNCTION calculate_discount_bps(
  p_vip_level integer DEFAULT 0,
  p_prepay_days integer DEFAULT 0,
  p_vetyt_power numeric DEFAULT 0,
  p_total_vetyt numeric DEFAULT 1,
  p_service_button boolean DEFAULT false
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_discount_bps integer := 0;
  v_vip_discount_bps integer;
  v_prepay_discount_bps integer;
  v_vetyt_discount_bps integer;
  v_service_button_discount_bps integer := 0;
BEGIN
  -- VIP Level Discount (Bronze/Silver/Gold/Platinum/Diamond)
  CASE
    WHEN p_vip_level >= 9 THEN v_vip_discount_bps := 1800;  -- Diamond 18%
    WHEN p_vip_level >= 7 THEN v_vip_discount_bps := 1300;  -- Platinum 13%
    WHEN p_vip_level >= 5 THEN v_vip_discount_bps := 900;   -- Gold 9%
    WHEN p_vip_level >= 3 THEN v_vip_discount_bps := 500;   -- Silver 5%
    WHEN p_vip_level >= 1 THEN v_vip_discount_bps := 200;   -- Bronze 2%
    ELSE v_vip_discount_bps := 0;
  END CASE;

  -- Prepay Discount (1% per 30 days, max 10%)
  v_prepay_discount_bps := LEAST((p_prepay_days / 30) * 100, 1000);

  -- veTYT Discount (proportional to voting power, max 5%)
  IF p_total_vetyt > 0 THEN
    v_vetyt_discount_bps := LEAST(FLOOR((p_vetyt_power / p_total_vetyt) * 500), 500);
  ELSE
    v_vetyt_discount_bps := 0;
  END IF;

  -- Service Button Discount (3% daily boost)
  IF p_service_button THEN
    v_service_button_discount_bps := 300;
  END IF;

  -- Total discount (capped at 20%)
  v_discount_bps := v_vip_discount_bps + v_prepay_discount_bps + v_vetyt_discount_bps + v_service_button_discount_bps;
  v_discount_bps := LEAST(v_discount_bps, 2000);

  RETURN v_discount_bps;
END;
$$;

-- Function to calculate maintenance cost
CREATE OR REPLACE FUNCTION calculate_maintenance(
  p_power_th numeric,
  p_efficiency_w_th numeric,
  p_region text,
  p_days integer DEFAULT 1,
  p_vip_level integer DEFAULT 0,
  p_prepay_days integer DEFAULT 0,
  p_vetyt_power numeric DEFAULT 0,
  p_total_vetyt numeric DEFAULT 1,
  p_service_button boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_config RECORD;
  v_power_kw numeric;
  v_daily_kwh numeric;
  v_elec_usd numeric;
  v_service_usd numeric;
  v_discount_bps integer;
  v_discount_pct integer;
  v_subtotal_usd numeric;
  v_discount_amount_usd numeric;
  v_total_usd numeric;
BEGIN
  IF p_power_th <= 0 OR p_efficiency_w_th <= 0 OR p_days <= 0 THEN
    RAISE EXCEPTION 'Invalid parameters: power_th, efficiency_w_th, and days must be > 0';
  END IF;

  SELECT * INTO v_config
  FROM maintenance_fee_config
  WHERE region = p_region AND is_active = true;

  IF NOT FOUND THEN
    SELECT * INTO v_config
    FROM maintenance_fee_config
    WHERE region = 'Default' AND is_active = true;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No maintenance fee configuration found';
  END IF;

  v_power_kw := (p_power_th * p_efficiency_w_th) / 1000.0;
  v_daily_kwh := v_power_kw * 24;
  v_elec_usd := v_daily_kwh * v_config.kwh_usd * p_days;
  v_service_usd := p_power_th * (v_config.service_bps / 10000.0) * p_days;
  v_subtotal_usd := v_elec_usd + v_service_usd;

  v_discount_bps := calculate_discount_bps(
    p_vip_level,
    p_prepay_days,
    p_vetyt_power,
    p_total_vetyt,
    p_service_button
  );

  v_discount_pct := v_discount_bps / 100;
  v_discount_amount_usd := v_subtotal_usd * (v_discount_bps / 10000.0);
  v_total_usd := v_subtotal_usd - v_discount_amount_usd;

  RETURN jsonb_build_object(
    'power_kw', ROUND(v_power_kw::numeric, 4),
    'daily_kwh', ROUND(v_daily_kwh::numeric, 4),
    'kwh_rate', v_config.kwh_usd,
    'elec_usd', ROUND(v_elec_usd::numeric, 2),
    'service_usd', ROUND(v_service_usd::numeric, 2),
    'subtotal_usd', ROUND(v_subtotal_usd::numeric, 2),
    'discount_bps', v_discount_bps,
    'discount_pct', v_discount_pct,
    'discount_amount_usd', ROUND(v_discount_amount_usd::numeric, 2),
    'total_usd', ROUND(v_total_usd::numeric, 2),
    'region', p_region,
    'days', p_days
  );
END;
$$;

GRANT EXECUTE ON FUNCTION calculate_discount_bps TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION calculate_maintenance TO authenticated, service_role;

-- Function to mark overdue invoices
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE maintenance_invoices
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION mark_overdue_invoices() TO service_role;

-- Trigger to update miner maintenance tracking
CREATE OR REPLACE FUNCTION update_miner_maintenance_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    UPDATE nft_miners
    SET last_maintenance_paid_at = NEW.paid_at,
        total_maintenance_paid = COALESCE(total_maintenance_paid, 0) + COALESCE(NEW.final_cost_usd, NEW.amount_usd, 0)
    WHERE id = NEW.miner_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_invoice_paid ON maintenance_invoices;

CREATE TRIGGER on_invoice_paid
  AFTER UPDATE ON maintenance_invoices
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid'))
  EXECUTE FUNCTION update_miner_maintenance_tracking();
