/*
  # Fix Security Definer Views
  
  1. Changes
    - Recreate all views with security_invoker = true
    - This makes views respect RLS policies on underlying tables
    - Improves security by not running with elevated privileges
  
  2. Security
    - Views will now respect RLS policies
    - Access control is handled at the table level
    - No privilege escalation through views
  
  3. Notes
    - security_invoker = true is recommended for views
    - Views inherit the permissions of the user calling them
*/

-- Recreate foundation_partners_view with security_invoker
CREATE OR REPLACE VIEW foundation_partners_view 
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  partner_type,
  country,
  city,
  website_url,
  description,
  research_focus,
  total_grants_received,
  active_grants_count,
  (
    SELECT count(*) 
    FROM foundation_grants g 
    WHERE g.partner_id = p.id AND g.status = 'completed'
  ) AS completed_grants_count,
  created_at
FROM foundation_research_partners p
WHERE is_verified = true
ORDER BY total_grants_received DESC;

-- Recreate system_balance_summary with security_invoker
CREATE OR REPLACE VIEW system_balance_summary
WITH (security_invoker = true)
AS
SELECT 
  currency,
  account_type,
  sum(balance) AS total_balance,
  count(*) AS account_count
FROM wallet_accounts
WHERE is_active = true
GROUP BY currency, account_type
ORDER BY currency, account_type;

-- Recreate account_balance_verification with security_invoker
CREATE OR REPLACE VIEW account_balance_verification
WITH (security_invoker = true)
AS
SELECT 
  wa.id,
  wa.user_id,
  wa.account_type,
  wa.currency,
  wa.network,
  wa.balance AS stored_balance,
  COALESCE(sum(le.credit) - sum(le.debit), 0) AS computed_balance,
  wa.balance - COALESCE(sum(le.credit) - sum(le.debit), 0) AS discrepancy
FROM wallet_accounts wa
LEFT JOIN ledger_entries le ON le.account_id = wa.id
GROUP BY wa.id, wa.user_id, wa.account_type, wa.currency, wa.network, wa.balance;

-- Recreate foundation_impact_summary with security_invoker
CREATE OR REPLACE VIEW foundation_impact_summary
WITH (security_invoker = true)
AS
SELECT 
  total_donations_usd,
  total_grants_amount_usd,
  family_support_amount_usd,
  research_grants_awarded,
  active_grants,
  clinical_trials,
  research_publications,
  families_supported,
  unique_donors,
  partner_clinics,
  hospital_partners,
  active_campaigns,
  active_campaigns_raised,
  transparency_score,
  CASE 
    WHEN total_donations_usd > 0 
    THEN round(((total_grants_amount_usd + family_support_amount_usd) / NULLIF(total_donations_usd, 0)) * 100, 1)
    ELSE 0 
  END AS program_efficiency_percent,
  CASE 
    WHEN research_grants_awarded > 0 
    THEN round(total_grants_amount_usd / research_grants_awarded, 2)
    ELSE 0 
  END AS avg_grant_size_usd,
  CASE 
    WHEN families_supported > 0 
    THEN round(family_support_amount_usd / families_supported, 2)
    ELSE 0 
  END AS avg_family_support_usd,
  last_updated
FROM foundation_statistics fs;

-- Recreate foundation_statistics with security_invoker
CREATE OR REPLACE VIEW foundation_statistics
WITH (security_invoker = true)
AS
SELECT 
  (SELECT COALESCE(sum(amount_usd), 0) FROM foundation_donations) AS total_donations_usd,
  (SELECT count(DISTINCT donor_user_id) FROM foundation_donations WHERE donor_user_id IS NOT NULL) AS unique_donors,
  (SELECT count(*) FROM foundation_donations) AS total_donations_count,
  (SELECT count(*) FROM foundation_grants WHERE status IN ('approved', 'active', 'completed')) AS research_grants_awarded,
  (SELECT COALESCE(sum(total_amount_usd), 0) FROM foundation_grants WHERE status IN ('approved', 'active', 'completed')) AS total_grants_amount_usd,
  (SELECT count(*) FROM foundation_grants WHERE status = 'active') AS active_grants,
  (SELECT count(*) FROM foundation_family_support WHERE status IN ('approved', 'disbursed')) AS families_supported,
  (SELECT COALESCE(sum(approved_amount_usd), 0) FROM foundation_family_support WHERE status IN ('approved', 'disbursed')) AS family_support_amount_usd,
  (SELECT count(*) FROM foundation_research_partners WHERE is_verified = true) AS partner_clinics,
  (SELECT count(*) FROM foundation_research_partners WHERE is_verified = true AND partner_type IN ('hospital', 'research_institute')) AS hospital_partners,
  (SELECT count(DISTINCT g.id) FROM foundation_grants g WHERE g.research_area ILIKE '%clinical trial%' OR g.research_area ILIKE '%phase%' OR g.title ILIKE '%trial%') AS clinical_trials,
  (SELECT COALESCE(sum(array_length(publications, 1)), 0) FROM foundation_grants WHERE publications IS NOT NULL) AS research_publications,
  (SELECT count(*) FROM foundation_campaigns WHERE status = 'active') AS active_campaigns,
  (SELECT COALESCE(sum(current_raised_usd), 0) FROM foundation_campaigns WHERE status = 'active') AS active_campaigns_raised,
  100 AS transparency_score,
  now() AS last_updated;

-- Recreate foundation_recent_donations with security_invoker
CREATE OR REPLACE VIEW foundation_recent_donations
WITH (security_invoker = true)
AS
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
  END AS donor_name,
  c.title AS campaign_title
FROM foundation_donations d
LEFT JOIN profiles p ON d.donor_user_id = p.id
LEFT JOIN foundation_campaigns c ON d.campaign_id = c.id
WHERE d.is_anonymous = false
ORDER BY d.donated_at DESC
LIMIT 100;

-- Recreate foundation_active_campaigns_view with security_invoker
CREATE OR REPLACE VIEW foundation_active_campaigns_view
WITH (security_invoker = true)
AS
SELECT 
  id,
  slug,
  title,
  description,
  funding_goal_usd,
  current_raised_usd,
  donor_count,
  campaign_type,
  image_url,
  start_date,
  end_date,
  has_matching,
  matching_ratio,
  matching_pool_usd,
  round((current_raised_usd / NULLIF(funding_goal_usd, 0)) * 100, 1) AS progress_percent,
  CASE 
    WHEN end_date IS NOT NULL 
    THEN GREATEST(0, end_date - CURRENT_DATE)
    ELSE NULL 
  END AS days_remaining,
  CASE 
    WHEN has_matching AND matching_pool_usd > 0 
    THEN matching_pool_usd
    ELSE 0 
  END AS matching_available_usd,
  created_at,
  updated_at
FROM foundation_campaigns c
WHERE status = 'active'
ORDER BY created_at DESC;

-- Recreate burn_statistics with security_invoker
CREATE OR REPLACE VIEW burn_statistics
WITH (security_invoker = true)
AS
SELECT 
  count(*) AS total_burn_events,
  COALESCE(sum(amount_tyt) FILTER (WHERE status = 'confirmed'), 0) AS total_burned,
  COALESCE(sum(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '24 hours'), 0) AS burned_24h,
  COALESCE(sum(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '7 days'), 0) AS burned_7d,
  COALESCE(sum(amount_tyt) FILTER (WHERE status = 'confirmed' AND burned_at > now() - interval '30 days'), 0) AS burned_30d,
  COALESCE(sum(amount_tyt) FILTER (WHERE burn_type = 'charity_mint' AND status = 'confirmed'), 0) AS charity_mint_total
FROM burn_events;
