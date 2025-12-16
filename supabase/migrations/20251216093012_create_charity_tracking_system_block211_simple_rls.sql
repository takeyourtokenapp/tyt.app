/*
  # Charity Tracking System - Block 2.11

  ## Summary
  Comprehensive foundation flow tracking with 30% charity + 10% academy split.
  Tracks all platform fees (deposits, marketplace, mints, upgrades) and their
  automatic distribution to foundation and academy wallets.

  ## Tables
    - foundation_transactions - All charity/academy income sources
    - foundation_allocations - Grant fund allocations
    - foundation_impact_reports - Periodic transparency reports

  ## Source Types
    Every platform fee is automatically split:
    - 60% protocol revenue
    - 30% charity (Children's Brain Cancer Foundation)
    - 10% academy (Digital-Interactive-Technology-Blockchain Academia)
*/

-- ============================================================================
-- FOUNDATION TRANSACTIONS (Income Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_id uuid,
  user_id uuid REFERENCES profiles(id),
  asset text NOT NULL,
  amount numeric(18, 8) NOT NULL CHECK (amount > 0),
  usd_value numeric(12, 2),
  tx_hash text,
  block_number bigint,
  destination text NOT NULL CHECK (destination IN ('charity', 'academy')),
  fiscal_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  fiscal_quarter integer DEFAULT EXTRACT(QUARTER FROM CURRENT_DATE),
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_foundation_tx_source ON foundation_transactions(source_type);
CREATE INDEX IF NOT EXISTS idx_foundation_tx_user ON foundation_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_foundation_tx_destination ON foundation_transactions(destination);
CREATE INDEX IF NOT EXISTS idx_foundation_tx_asset ON foundation_transactions(asset);
CREATE INDEX IF NOT EXISTS idx_foundation_tx_fiscal ON foundation_transactions(fiscal_year, fiscal_quarter);
CREATE INDEX IF NOT EXISTS idx_foundation_tx_created ON foundation_transactions(created_at DESC);

-- ============================================================================
-- FOUNDATION ALLOCATIONS (Spending Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id uuid REFERENCES foundation_grants(id) NOT NULL,
  asset text NOT NULL,
  amount numeric(18, 8) NOT NULL CHECK (amount > 0),
  usd_value numeric(12, 2),
  allocation_date date DEFAULT CURRENT_DATE,
  allocation_type text DEFAULT 'grant_disbursement',
  tx_hash text,
  note text,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_foundation_alloc_grant ON foundation_allocations(grant_id);
CREATE INDEX IF NOT EXISTS idx_foundation_alloc_asset ON foundation_allocations(asset);
CREATE INDEX IF NOT EXISTS idx_foundation_alloc_date ON foundation_allocations(allocation_date DESC);

-- ============================================================================
-- FOUNDATION IMPACT REPORTS (Transparency)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_impact_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  report_type text DEFAULT 'quarterly',
  total_in_by_asset jsonb DEFAULT '{}'::jsonb,
  total_out_by_asset jsonb DEFAULT '{}'::jsonb,
  total_in_usd numeric(12, 2),
  total_out_usd numeric(12, 2),
  grants_awarded integer DEFAULT 0,
  families_helped integer DEFAULT 0,
  research_projects integer DEFAULT 0,
  summary_markdown text,
  executive_summary text,
  key_achievements text[],
  external_links jsonb DEFAULT '[]'::jsonb,
  pdf_url text,
  video_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  published_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_foundation_reports_period ON foundation_impact_reports(period_end DESC);
CREATE INDEX IF NOT EXISTS idx_foundation_reports_published ON foundation_impact_reports(is_published, published_at DESC);

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW foundation_summary AS
SELECT
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_donors,
  COUNT(*) as total_transactions,
  SUM(usd_value) as total_usd_value,
  SUM(usd_value) FILTER (WHERE destination = 'charity') as charity_total_usd,
  SUM(usd_value) FILTER (WHERE destination = 'academy') as academy_total_usd
FROM foundation_transactions;

CREATE OR REPLACE VIEW foundation_summary_by_source AS
SELECT
  source_type, destination, asset,
  SUM(amount) as total_amount,
  SUM(usd_value) as total_usd,
  COUNT(*) as transaction_count,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM foundation_transactions
GROUP BY source_type, destination, asset
ORDER BY total_usd DESC NULLS LAST;

CREATE OR REPLACE VIEW foundation_summary_by_period AS
SELECT
  fiscal_year, fiscal_quarter, destination,
  SUM(usd_value) as total_usd,
  COUNT(*) as transaction_count,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_donors
FROM foundation_transactions
GROUP BY fiscal_year, fiscal_quarter, destination
ORDER BY fiscal_year DESC, fiscal_quarter DESC;

CREATE OR REPLACE VIEW grant_allocation_summary AS
SELECT
  g.id as grant_id,
  g.title as grant_title,
  g.total_amount_usd,
  COALESCE(SUM(fa.usd_value), 0) as allocated_usd,
  g.total_amount_usd - COALESCE(SUM(fa.usd_value), 0) as remaining_usd,
  ROUND((COALESCE(SUM(fa.usd_value), 0) / NULLIF(g.total_amount_usd, 0)) * 100, 2) as funding_percentage,
  COUNT(fa.id) as allocation_count,
  MAX(fa.allocation_date) as last_allocation_date
FROM foundation_grants g
LEFT JOIN foundation_allocations fa ON g.id = fa.grant_id
GROUP BY g.id, g.title, g.total_amount_usd;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION record_charity_transaction(
  p_source_type text, p_source_id uuid, p_user_id uuid, p_asset text,
  p_amount numeric, p_usd_value numeric, p_destination text, p_tx_hash text DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_tx_id uuid;
BEGIN
  IF p_destination NOT IN ('charity', 'academy') THEN RAISE EXCEPTION 'Invalid destination: %', p_destination; END IF;
  INSERT INTO foundation_transactions (source_type, source_id, user_id, asset, amount, usd_value, destination, tx_hash)
  VALUES (p_source_type, p_source_id, p_user_id, p_asset, p_amount, p_usd_value, p_destination, p_tx_hash)
  RETURNING id INTO v_tx_id;
  IF p_source_type = 'USER_DIRECT' THEN
    UPDATE foundation_campaigns SET current_raised_usd = current_raised_usd + p_usd_value, donor_count = donor_count + 1
    WHERE status = 'active' AND start_date <= CURRENT_DATE AND (end_date IS NULL OR end_date >= CURRENT_DATE);
  END IF;
  RETURN v_tx_id;
END; $$;

CREATE OR REPLACE FUNCTION allocate_to_grant(
  p_grant_id uuid, p_asset text, p_amount numeric, p_usd_value numeric,
  p_note text DEFAULT NULL, p_approved_by uuid DEFAULT NULL
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_alloc_id uuid; v_total_amount numeric; v_current_allocated numeric;
BEGIN
  SELECT total_amount_usd INTO v_total_amount FROM foundation_grants WHERE id = p_grant_id;
  IF v_total_amount IS NULL THEN RAISE EXCEPTION 'Grant not found: %', p_grant_id; END IF;
  INSERT INTO foundation_allocations (grant_id, asset, amount, usd_value, note, approved_by, approved_at)
  VALUES (p_grant_id, p_asset, p_amount, p_usd_value, p_note, p_approved_by, CASE WHEN p_approved_by IS NOT NULL THEN now() END)
  RETURNING id INTO v_alloc_id;
  SELECT COALESCE(SUM(usd_value), 0) INTO v_current_allocated FROM foundation_allocations WHERE grant_id = p_grant_id;
  IF v_current_allocated >= v_total_amount THEN
    UPDATE foundation_grants SET status = 'active'::grant_status WHERE id = p_grant_id AND status = 'approved'::grant_status;
  END IF;
  RETURN v_alloc_id;
END; $$;

CREATE OR REPLACE FUNCTION get_foundation_balance(p_asset text DEFAULT NULL)
RETURNS TABLE (asset text, total_in numeric, total_out numeric, balance numeric, balance_usd numeric)
LANGUAGE plpgsql STABLE SET search_path = public AS $$
BEGIN
  RETURN QUERY
  WITH inflows AS (
    SELECT ft.asset, SUM(ft.amount) as total_in, SUM(ft.usd_value) as total_in_usd
    FROM foundation_transactions ft WHERE p_asset IS NULL OR ft.asset = p_asset GROUP BY ft.asset
  ),
  outflows AS (
    SELECT fa.asset, SUM(fa.amount) as total_out, SUM(fa.usd_value) as total_out_usd
    FROM foundation_allocations fa WHERE p_asset IS NULL OR fa.asset = p_asset GROUP BY fa.asset
  )
  SELECT COALESCE(i.asset, o.asset), COALESCE(i.total_in, 0), COALESCE(o.total_out, 0),
         COALESCE(i.total_in, 0) - COALESCE(o.total_out, 0), COALESCE(i.total_in_usd, 0) - COALESCE(o.total_out_usd, 0)
  FROM inflows i FULL OUTER JOIN outflows o ON i.asset = o.asset ORDER BY balance_usd DESC NULLS LAST;
END; $$;

CREATE OR REPLACE FUNCTION make_charity_donation(p_user_id uuid, p_asset text, p_amount numeric, p_usd_value numeric DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_tx_id uuid; v_usd_value numeric;
BEGIN
  v_usd_value := COALESCE(p_usd_value, p_amount);
  v_tx_id := record_charity_transaction('USER_DIRECT', NULL, p_user_id, p_asset, p_amount, v_usd_value, 'charity', NULL);
  UPDATE wallets SET balance = balance - p_amount, updated_at = now()
  WHERE user_id = p_user_id AND asset = p_asset AND balance >= p_amount;
  IF NOT FOUND THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
  INSERT INTO wallet_ledger (wallet_id, entry_type, amount, balance_after, reference_type, reference_id, description)
  SELECT w.id, 'charity_donation', -p_amount, w.balance, 'foundation_transaction', v_tx_id, 'Donation to Foundation'
  FROM wallets w WHERE w.user_id = p_user_id AND w.asset = p_asset;
  RETURN v_tx_id;
END; $$;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE foundation_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_impact_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Foundation transactions viewable" ON foundation_transactions FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Service role inserts transactions" ON foundation_transactions FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Foundation allocations viewable" ON foundation_allocations FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Service role manages allocations" ON foundation_allocations FOR ALL TO service_role USING (true);
CREATE POLICY "Published reports viewable" ON foundation_impact_reports FOR SELECT TO authenticated, anon USING (is_published = true);
CREATE POLICY "Service role manages reports" ON foundation_impact_reports FOR ALL TO service_role USING (true);

GRANT SELECT ON foundation_summary TO authenticated, anon;
GRANT SELECT ON foundation_summary_by_source TO authenticated, anon;
GRANT SELECT ON foundation_summary_by_period TO authenticated, anon;
GRANT SELECT ON grant_allocation_summary TO authenticated, anon;
GRANT EXECUTE ON FUNCTION record_charity_transaction TO service_role;
GRANT EXECUTE ON FUNCTION allocate_to_grant TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_foundation_balance TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION make_charity_donation TO authenticated, service_role;
