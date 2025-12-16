/*
  # Fix Fee Configuration to 1% Canonical (Block 0 Spec)

  ## Problem
  Current fee_configurations have fee_bps_total = 1000 (10% total)
  Block 0 spec requires fee_bps_total = 100 (1% total)

  ## Solution
  Update all fee configurations to use 1% total fee (100 bps)
  Split remains: 60% protocol / 30% charity / 10% academy

  ## Effective Rates
  With 1% total fee (100 bps) and 60/30/10 split:
  - Protocol: 0.6% of gross (60 bps)
  - Charity: 0.3% of gross (30 bps)
  - Academy: 0.1% of gross (10 bps)

  ## Changes
  1. Update fee_configurations to 100 bps
  2. Maintain 60/30/10 split percentages
  3. Log changes for audit trail
*/

-- Log the change
INSERT INTO fee_audit_log (fee_table, fee_key, old_values, new_values, change_reason)
SELECT
  'fee_configurations',
  fee_key,
  jsonb_build_object(
    'fee_bps_total', fee_bps_total,
    'protocol_pct', protocol_pct,
    'charity_pct', charity_pct,
    'academy_pct', academy_pct
  ),
  jsonb_build_object(
    'fee_bps_total', 100,
    'protocol_pct', 60,
    'charity_pct', 30,
    'academy_pct', 10
  ),
  'Block 0 canonical fee correction: 1% total (100 bps) with 60/30/10 split'
FROM fee_configurations
WHERE is_active = true
  AND fee_bps_total != 100
ON CONFLICT DO NOTHING;

-- Update all active fees to 1% (100 bps) with 60/30/10 split
UPDATE fee_configurations
SET
  fee_bps_total = 100,
  protocol_pct = 60,
  charity_pct = 30,
  academy_pct = 10,
  updated_at = now()
WHERE is_active = true;

-- Ensure specific fee types exist with correct values
INSERT INTO fee_configurations (fee_key, fee_name, fee_bps_total, protocol_pct, charity_pct, academy_pct, is_active)
VALUES
  ('deposit.stables', 'Stablecoin Deposit Fee', 100, 60, 30, 10, true),
  ('deposit.crypto', 'Crypto Deposit Fee', 100, 60, 30, 10, true),
  ('deposit.default', 'Default Deposit Fee', 100, 60, 30, 10, true),
  ('withdraw.default', 'Default Withdrawal Fee', 100, 60, 30, 10, true),
  ('marketplace.sale', 'Marketplace Sale Fee', 100, 60, 30, 10, true),
  ('marketplace.default', 'Default Marketplace Fee', 100, 60, 30, 10, true),
  ('maintenance.default', 'Maintenance Fee', 0, 60, 30, 10, true),
  ('upgrade.miner', 'Miner Upgrade Fee', 100, 60, 30, 10, true),
  ('upgrade.default', 'Default Upgrade Fee', 100, 60, 30, 10, true),
  ('mint.miner', 'Miner Mint Fee', 100, 60, 30, 10, true)
ON CONFLICT (fee_key) DO UPDATE SET
  fee_bps_total = EXCLUDED.fee_bps_total,
  protocol_pct = EXCLUDED.protocol_pct,
  charity_pct = EXCLUDED.charity_pct,
  academy_pct = EXCLUDED.academy_pct,
  updated_at = now()
WHERE fee_configurations.is_active = true;

-- Update calculate_deposit_fees_v3 function to use correct defaults
CREATE OR REPLACE FUNCTION calculate_deposit_fees_v3(p_amount numeric, p_asset text)
RETURNS TABLE (
  fee_bps integer,
  fee_total numeric,
  amount_user numeric,
  fee_protocol numeric,
  fee_charity numeric,
  fee_academy numeric,
  fee_burn numeric,
  protocol_pct integer,
  charity_pct integer,
  academy_pct integer
) AS $$
DECLARE
  v_fee_bps integer := 100;
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
  END
  AND fc.is_active = true
  LIMIT 1;

  IF v_fee_bps IS NULL THEN
    v_fee_bps := 100;
    v_protocol_pct := 60;
    v_charity_pct := 30;
    v_academy_pct := 10;
  END IF;

  v_fee_total := (p_amount * v_fee_bps) / 10000.0;

  RETURN QUERY SELECT
    v_fee_bps,
    v_fee_total,
    p_amount - v_fee_total,
    (v_fee_total * v_protocol_pct) / 100.0,
    (v_fee_total * v_charity_pct) / 100.0,
    (v_fee_total * v_academy_pct) / 100.0,
    0::numeric,
    v_protocol_pct,
    v_charity_pct,
    v_academy_pct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION calculate_deposit_fees_v3(numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_deposit_fees_v3(numeric, text) TO service_role;

-- Update fee_distribution_config to match (60/30/10/0)
UPDATE fee_distribution_config
SET
  protocol_share_bps = 6000,
  charity_share_bps = 3000,
  academy_share_bps = 1000,
  burn_share_bps = 0
WHERE fee_type IN ('deposit', 'maintenance', 'withdrawal', 'marketplace', 'miner_upgrade');

INSERT INTO fee_distribution_config (fee_type, protocol_share_bps, charity_share_bps, academy_share_bps, burn_share_bps)
VALUES
  ('deposit', 6000, 3000, 1000, 0),
  ('withdrawal', 6000, 3000, 1000, 0),
  ('marketplace', 6000, 3000, 1000, 0),
  ('maintenance', 6000, 3000, 1000, 0),
  ('miner_upgrade', 6000, 3000, 1000, 0),
  ('mint', 6000, 3000, 1000, 0)
ON CONFLICT (fee_type) DO UPDATE SET
  protocol_share_bps = EXCLUDED.protocol_share_bps,
  charity_share_bps = EXCLUDED.charity_share_bps,
  academy_share_bps = EXCLUDED.academy_share_bps,
  burn_share_bps = EXCLUDED.burn_share_bps;
