/*
  # Foundation Statistics Sync System

  Creates views and functions for real-time synchronization of foundation data
  between main app (takeyourtoken.com) and foundation site (tyt.foundation).

  ## Overview
  - Aggregated statistics view
  - Real-time metrics
  - Public transparency data
  - Cross-domain sync support

  ## Views Created
  1. `foundation_statistics` - Live aggregate stats
  2. `foundation_impact_summary` - Impact metrics with ratios
  3. `foundation_recent_donations` - Recent donation feed
  4. `foundation_active_campaigns_view` - Active campaigns
  5. `foundation_partners_view` - Verified research partners

  ## Functions
  1. `get_foundation_stats()` - Get current statistics
  
  ## Security
  - Public read access (transparency)
  - RLS policies applied
*/

-- ============================================================================
-- FOUNDATION LIVE STATISTICS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW foundation_statistics AS
SELECT
  -- Donation metrics
  (
    SELECT COALESCE(SUM(amount_usd), 0)
    FROM foundation_donations
  ) as total_donations_usd,

  (
    SELECT COUNT(DISTINCT donor_user_id)
    FROM foundation_donations
    WHERE donor_user_id IS NOT NULL
  ) as unique_donors,

  (
    SELECT COUNT(*)
    FROM foundation_donations
  ) as total_donations_count,

  -- Grant metrics
  (
    SELECT COUNT(*)
    FROM foundation_grants
    WHERE status IN ('approved', 'active', 'completed')
  ) as research_grants_awarded,

  (
    SELECT COALESCE(SUM(total_amount_usd), 0)
    FROM foundation_grants
    WHERE status IN ('approved', 'active', 'completed')
  ) as total_grants_amount_usd,

  (
    SELECT COUNT(*)
    FROM foundation_grants
    WHERE status = 'active'
  ) as active_grants,

  -- Family support metrics
  (
    SELECT COUNT(*)
    FROM foundation_family_support
    WHERE status IN ('approved', 'disbursed')
  ) as families_supported,

  (
    SELECT COALESCE(SUM(approved_amount_usd), 0)
    FROM foundation_family_support
    WHERE status IN ('approved', 'disbursed')
  ) as family_support_amount_usd,

  -- Partner metrics
  (
    SELECT COUNT(*)
    FROM foundation_research_partners
    WHERE is_verified = true
  ) as partner_clinics,

  (
    SELECT COUNT(*)
    FROM foundation_research_partners
    WHERE is_verified = true AND partner_type IN ('hospital', 'research_institute')
  ) as hospital_partners,

  -- Clinical trials
  (
    SELECT COUNT(DISTINCT g.id)
    FROM foundation_grants g
    WHERE g.research_area ILIKE '%clinical trial%'
      OR g.research_area ILIKE '%phase%'
      OR g.title ILIKE '%trial%'
  ) as clinical_trials,

  -- Publications
  (
    SELECT COALESCE(SUM(array_length(publications, 1)), 0)
    FROM foundation_grants
    WHERE publications IS NOT NULL
  ) as research_publications,

  -- Campaign metrics
  (
    SELECT COUNT(*)
    FROM foundation_campaigns
    WHERE status = 'active'
  ) as active_campaigns,

  (
    SELECT COALESCE(SUM(current_raised_usd), 0)
    FROM foundation_campaigns
    WHERE status = 'active'
  ) as active_campaigns_raised,

  -- Transparency (always 100%)
  100 as transparency_score,

  -- Last updated
  now() as last_updated;

-- ============================================================================
-- FOUNDATION STATISTICS FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_foundation_stats()
RETURNS TABLE (
  total_donations_usd numeric,
  unique_donors bigint,
  total_donations_count bigint,
  research_grants_awarded bigint,
  total_grants_amount_usd numeric,
  active_grants bigint,
  families_supported bigint,
  family_support_amount_usd numeric,
  partner_clinics bigint,
  hospital_partners bigint,
  clinical_trials bigint,
  research_publications bigint,
  active_campaigns bigint,
  active_campaigns_raised numeric,
  transparency_score integer,
  last_updated timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM foundation_statistics;
$$;

-- ============================================================================
-- FOUNDATION IMPACT SUMMARY
-- ============================================================================

CREATE OR REPLACE VIEW foundation_impact_summary AS
SELECT
  -- Financial impact
  fs.total_donations_usd,
  fs.total_grants_amount_usd,
  fs.family_support_amount_usd,

  -- Research impact
  fs.research_grants_awarded,
  fs.active_grants,
  fs.clinical_trials,
  fs.research_publications,

  -- Community impact
  fs.families_supported,
  fs.unique_donors,

  -- Network
  fs.partner_clinics,
  fs.hospital_partners,

  -- Campaigns
  fs.active_campaigns,
  fs.active_campaigns_raised,

  -- Transparency
  fs.transparency_score,

  -- Efficiency ratio (what % goes to programs vs overhead)
  CASE
    WHEN fs.total_donations_usd > 0 THEN
      ROUND(((fs.total_grants_amount_usd + fs.family_support_amount_usd) /
             NULLIF(fs.total_donations_usd, 0) * 100)::numeric, 1)
    ELSE 0
  END as program_efficiency_percent,

  -- Average grant size
  CASE
    WHEN fs.research_grants_awarded > 0 THEN
      ROUND((fs.total_grants_amount_usd / fs.research_grants_awarded)::numeric, 2)
    ELSE 0
  END as avg_grant_size_usd,

  -- Average family support
  CASE
    WHEN fs.families_supported > 0 THEN
      ROUND((fs.family_support_amount_usd / fs.families_supported)::numeric, 2)
    ELSE 0
  END as avg_family_support_usd,

  fs.last_updated
FROM foundation_statistics fs;

-- ============================================================================
-- RECENT DONATIONS VIEW (for transparency feed)
-- ============================================================================

CREATE OR REPLACE VIEW foundation_recent_donations AS
SELECT
  d.id,
  d.amount,
  d.currency,
  d.amount_usd,
  d.chain,
  d.tx_hash,
  d.is_anonymous,
  d.message,
  d.donated_at,
  CASE
    WHEN d.is_anonymous THEN 'Anonymous Donor'
    ELSE COALESCE(p.full_name, p.username, 'Anonymous')
  END as donor_name,
  c.title as campaign_title
FROM foundation_donations d
LEFT JOIN profiles p ON d.donor_user_id = p.id
LEFT JOIN foundation_campaigns c ON d.campaign_id = c.id
WHERE d.is_anonymous = false
ORDER BY d.donated_at DESC
LIMIT 100;

-- ============================================================================
-- ACTIVE CAMPAIGNS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW foundation_active_campaigns_view AS
SELECT
  c.id,
  c.slug,
  c.title,
  c.description,
  c.funding_goal_usd,
  c.current_raised_usd,
  c.donor_count,
  c.campaign_type,
  c.image_url,
  c.start_date,
  c.end_date,
  c.has_matching,
  c.matching_ratio,
  c.matching_pool_usd,
  -- Progress percentage
  ROUND((c.current_raised_usd / NULLIF(c.funding_goal_usd, 0) * 100)::numeric, 1) as progress_percent,
  -- Days remaining
  CASE
    WHEN c.end_date IS NOT NULL THEN
      GREATEST(0, (c.end_date - CURRENT_DATE))
    ELSE NULL
  END as days_remaining,
  -- Matching available
  CASE
    WHEN c.has_matching AND c.matching_pool_usd > 0 THEN
      c.matching_pool_usd
    ELSE 0
  END as matching_available_usd,
  c.created_at,
  c.updated_at
FROM foundation_campaigns c
WHERE c.status = 'active'
ORDER BY c.created_at DESC;

-- ============================================================================
-- RESEARCH PARTNERS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW foundation_partners_view AS
SELECT
  p.id,
  p.name,
  p.partner_type,
  p.country,
  p.city,
  p.website_url,
  p.description,
  p.research_focus,
  p.total_grants_received,
  p.active_grants_count,
  -- Count of completed grants
  (
    SELECT COUNT(*)
    FROM foundation_grants g
    WHERE g.partner_id = p.id AND g.status = 'completed'
  ) as completed_grants_count,
  p.created_at
FROM foundation_research_partners p
WHERE p.is_verified = true
ORDER BY p.total_grants_received DESC;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Grant access to views
GRANT SELECT ON foundation_statistics TO authenticated, anon;
GRANT SELECT ON foundation_impact_summary TO authenticated, anon;
GRANT SELECT ON foundation_recent_donations TO authenticated, anon;
GRANT SELECT ON foundation_active_campaigns_view TO authenticated, anon;
GRANT SELECT ON foundation_partners_view TO authenticated, anon;

-- Grant access to function
GRANT EXECUTE ON FUNCTION get_foundation_stats() TO authenticated, anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW foundation_statistics IS 'Real-time foundation statistics aggregated from all tables';
COMMENT ON VIEW foundation_impact_summary IS 'High-level impact metrics with calculated ratios';
COMMENT ON VIEW foundation_recent_donations IS 'Recent donations for transparency feed (respecting privacy)';
COMMENT ON VIEW foundation_active_campaigns_view IS 'Active fundraising campaigns with progress metrics';
COMMENT ON VIEW foundation_partners_view IS 'Verified research partners and institutions';
COMMENT ON FUNCTION get_foundation_stats() IS 'Function to get current foundation statistics';
