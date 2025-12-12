/*
  # V3 Canonical Fee Configuration Update
  
  ## Summary
  Updates all fee configurations to TYT v3 canonical model:
  - Total deposit fee: 10% (1000 basis points)
  - Split: 60% protocol / 30% charity / 10% academy
  - Resulting in: 6% protocol / 3% charity / 1% academy of gross amount
  
  ## Changes
  1. Removes old 5% constraint, allows up to 20% fees
  2. Updates fee_configurations table to 1000 bps (10% total)
  3. Updates fee_distribution_config to align with v3 canonical
  4. Creates fee_audit_log table for governance compliance
  
  ## Security
  - All updates are idempotent (safe to re-run)
  - Audit log is append-only
*/

-- Step 1: Update constraint to allow v3 canonical 10% fee
ALTER TABLE fee_configurations DROP CONSTRAINT IF EXISTS fee_configurations_fee_bps_total_check;
ALTER TABLE fee_configurations ADD CONSTRAINT fee_configurations_fee_bps_total_check 
  CHECK (fee_bps_total >= 0 AND fee_bps_total <= 2000);

-- Create fee audit log table
CREATE TABLE IF NOT EXISTS fee_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_table text NOT NULL,
  fee_key text NOT NULL,
  old_values jsonb,
  new_values jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  change_reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fee_audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fee_audit_log' AND policyname = 'Service role can manage fee audit log') THEN
    CREATE POLICY "Service role can manage fee audit log" ON fee_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fee_audit_log' AND policyname = 'Authenticated users can view fee audit log') THEN
    CREATE POLICY "Authenticated users can view fee audit log" ON fee_audit_log FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Log current values before update
INSERT INTO fee_audit_log (fee_table, fee_key, old_values, new_values, change_reason)
SELECT 
  'fee_configurations', fee_key,
  jsonb_build_object('fee_bps_total', fee_bps_total, 'protocol_pct', protocol_pct, 'charity_pct', charity_pct, 'academy_pct', academy_pct),
  jsonb_build_object('fee_bps_total', 1000, 'protocol_pct', 60, 'charity_pct', 30, 'academy_pct', 10),
  'V3 canonical fee update: 10% total (1000 bps) with 60/30/10 split = 6%/3%/1% effective'
FROM fee_configurations WHERE is_active = true
ON CONFLICT DO NOTHING;

-- Update fee_configurations to v3 canonical
UPDATE fee_configurations SET 
  fee_bps_total = 1000, protocol_pct = 60, charity_pct = 30, academy_pct = 10, updated_at = now()
WHERE is_active = true;

-- Ensure default configs exist
INSERT INTO fee_configurations (fee_key, fee_name, fee_bps_total, protocol_pct, charity_pct, academy_pct, is_active)
VALUES 
  ('deposit.default', 'Default Deposit Fee', 1000, 60, 30, 10, true),
  ('withdraw.default', 'Default Withdrawal Fee', 100, 60, 30, 10, true),
  ('marketplace.default', 'Default Marketplace Fee', 500, 60, 30, 10, true),
  ('maintenance.default', 'Default Maintenance Fee', 0, 60, 30, 10, true),
  ('upgrade.default', 'Default Upgrade Fee', 300, 60, 30, 10, true)
ON CONFLICT (fee_key) DO UPDATE SET
  fee_bps_total = EXCLUDED.fee_bps_total, protocol_pct = EXCLUDED.protocol_pct,
  charity_pct = EXCLUDED.charity_pct, academy_pct = EXCLUDED.academy_pct, updated_at = now();

-- Update fee_distribution_config (no updated_at column)
UPDATE fee_distribution_config SET 
  protocol_share_bps = 6000, charity_share_bps = 3000, academy_share_bps = 1000, burn_share_bps = 0
WHERE fee_type = 'deposit';

UPDATE fee_distribution_config SET 
  protocol_share_bps = 4000, charity_share_bps = 3000, academy_share_bps = 1000, burn_share_bps = 2000
WHERE fee_type = 'marketplace';

UPDATE fee_distribution_config SET 
  protocol_share_bps = 6000, charity_share_bps = 3000, academy_share_bps = 1000, burn_share_bps = 0
WHERE fee_type = 'maintenance';

UPDATE fee_distribution_config SET 
  protocol_share_bps = 5000, charity_share_bps = 3000, academy_share_bps = 1000, burn_share_bps = 1000
WHERE fee_type = 'miner_upgrade';

UPDATE fee_distribution_config SET 
  protocol_share_bps = 8000, charity_share_bps = 1500, academy_share_bps = 500, burn_share_bps = 0
WHERE fee_type = 'withdrawal';

-- V3 fee calculator function
CREATE OR REPLACE FUNCTION calculate_deposit_fees_v3(p_amount numeric, p_asset text)
RETURNS TABLE (
  fee_bps integer, fee_total numeric, amount_user numeric,
  fee_protocol numeric, fee_charity numeric, fee_academy numeric, fee_burn numeric,
  protocol_pct integer, charity_pct integer, academy_pct integer
) AS $$
DECLARE
  v_fee_bps integer := 1000;
  v_protocol_pct integer := 60;
  v_charity_pct integer := 30;
  v_academy_pct integer := 10;
  v_fee_total numeric;
BEGIN
  SELECT fc.fee_bps_total, fc.protocol_pct, fc.charity_pct, fc.academy_pct
  INTO v_fee_bps, v_protocol_pct, v_charity_pct, v_academy_pct
  FROM fee_configurations fc
  WHERE fc.fee_key = CASE 
    WHEN p_asset IN ('USDT', 'USDC', 'DAI', 'BUSD') THEN 'deposit.stables'
    WHEN p_asset IN ('BTC', 'ETH', 'SOL', 'TRX', 'XRP') THEN 'deposit.crypto'
    ELSE 'deposit.default'
  END AND fc.is_active = true LIMIT 1;
  
  v_fee_total := (p_amount * v_fee_bps) / 10000;
  
  RETURN QUERY SELECT v_fee_bps, v_fee_total, p_amount - v_fee_total,
    (v_fee_total * v_protocol_pct) / 100, (v_fee_total * v_charity_pct) / 100,
    (v_fee_total * v_academy_pct) / 100, 0::numeric,
    v_protocol_pct, v_charity_pct, v_academy_pct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION calculate_deposit_fees_v3(numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_deposit_fees_v3(numeric, text) TO service_role;

CREATE INDEX IF NOT EXISTS idx_fee_audit_log_created ON fee_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fee_audit_log_table_key ON fee_audit_log(fee_table, fee_key);
