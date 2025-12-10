/*
  # TYT Foundation - Pediatric Brain Tumor Research

  ## Overview
  Standalone 501(c)(3) non-profit supporting pediatric brain tumor research.
  Multi-chain donations, grant management, family support, and on-chain transparency.

  ## Foundation Mission
  - Fund cutting-edge pediatric brain tumor research
  - Provide family support micro-grants
  - Maximize transparency with Proof-of-Use tracking
  - Maintain HIPAA compliance (no PHI on-chain)
  - Annual "Night of the Owls" transparency report

  ## New Tables
  1. `foundation_campaigns` - Fundraising campaigns and initiatives
  2. `foundation_donations` - Multi-chain donation tracking
  3. `foundation_donation_receipts` - Soulbound NFT receipts
  4. `foundation_grants` - Research grants with milestone tracking
  5. `foundation_grant_milestones` - Grant disbursement milestones
  6. `foundation_family_support` - Micro-grants for families
  7. `foundation_research_partners` - Institutions and researchers
  8. `foundation_impact_metrics` - Quarterly impact tracking
  9. `foundation_transparency_reports` - Annual "Night of the Owls" reports
  10. `user_donation_settings` - Auto-round-up preferences

  ## Donation Flow
  1. User enables auto-round-up (0.5-5%) on BTC rewards
  2. Donation collected during reward distribution
  3. Multi-sig treasury receives funds
  4. Soulbound receipt NFT issued to donor
  5. Quarterly impact reports published

  ## Grant Lifecycle
  1. RFP (Request for Proposals) published
  2. Applications submitted by research institutions
  3. Review and approval by Foundation board
  4. Grant awarded with milestone-based disbursement
  5. Progress reports and on-chain Proof-of-Use
  6. Final report and impact assessment

  ## Security & Privacy
  - RLS enabled on all tables
  - NO PHI (Protected Health Information) on-chain
  - De-identification pipelines (k-anonymity)
  - IRB-approved data use agreements
  - HIPAA-aligned data handling
*/

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE donation_chain AS ENUM ('BTC', 'ETH', 'SOL', 'TRON', 'TON', 'POLYGON', 'BSC');
CREATE TYPE donation_source AS ENUM ('direct', 'auto_roundup', 'marketplace_fee', 'burn_allocation');
CREATE TYPE grant_status AS ENUM ('rfp', 'application', 'review', 'approved', 'active', 'completed', 'rejected');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'review', 'approved', 'completed', 'rejected');
CREATE TYPE family_support_status AS ENUM ('application', 'review', 'approved', 'disbursed', 'rejected');
CREATE TYPE partner_type AS ENUM ('university', 'hospital', 'research_institute', 'ngo', 'individual');

-- ============================================================================
-- FOUNDATION CAMPAIGNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  
  -- Goals
  funding_goal_usd numeric NOT NULL CHECK (funding_goal_usd > 0),
  current_raised_usd numeric DEFAULT 0 CHECK (current_raised_usd >= 0),
  
  -- Timing
  start_date date NOT NULL,
  end_date date,
  
  -- Campaign details
  campaign_type text, -- 'general', 'specific_research', 'family_support', 'equipment'
  beneficiary_description text,
  
  -- Visual
  image_url text,
  video_url text,
  
  status campaign_status DEFAULT 'draft',
  
  -- Matching
  has_matching boolean DEFAULT false,
  matching_ratio numeric DEFAULT 1.0, -- 1:1, 2:1, etc.
  matching_pool_usd numeric DEFAULT 0,
  
  -- Metrics
  donor_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_campaigns_status ON foundation_campaigns(status);
CREATE INDEX idx_foundation_campaigns_dates ON foundation_campaigns(start_date, end_date);

-- ============================================================================
-- DONATIONS (Multi-Chain)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Donor (optional for anonymous donations)
  donor_user_id uuid REFERENCES profiles(id),
  donor_wallet_address text,
  is_anonymous boolean DEFAULT false,
  
  -- Amount
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  amount_usd numeric NOT NULL, -- Converted to USD at time of donation
  
  -- Chain and transaction
  chain donation_chain NOT NULL,
  tx_hash text UNIQUE NOT NULL,
  block_number bigint,
  
  -- Source
  source donation_source DEFAULT 'direct',
  campaign_id uuid REFERENCES foundation_campaigns(id),
  
  -- Tax receipt
  is_tax_deductible boolean DEFAULT true,
  receipt_issued boolean DEFAULT false,
  receipt_number text UNIQUE,
  
  -- Metadata
  message text, -- Optional donor message
  in_memory_of text, -- Optional memorial dedication
  
  donated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_donations_donor ON foundation_donations(donor_user_id);
CREATE INDEX idx_foundation_donations_campaign ON foundation_donations(campaign_id);
CREATE INDEX idx_foundation_donations_chain ON foundation_donations(chain);
CREATE INDEX idx_foundation_donations_date ON foundation_donations(donated_at DESC);

-- ============================================================================
-- DONATION RECEIPTS (Soulbound NFTs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_donation_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid UNIQUE NOT NULL REFERENCES foundation_donations(id),
  
  -- NFT details
  token_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Receipt info
  receipt_number text UNIQUE NOT NULL,
  donation_amount_usd numeric NOT NULL,
  tax_year integer NOT NULL,
  
  -- Metadata
  metadata_uri text, -- IPFS link
  image_url text,
  
  -- Soulbound
  is_soulbound boolean DEFAULT true,
  
  -- On-chain
  blockchain_tx_hash text,
  minted_at timestamptz,
  
  issued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_donation_receipts_user ON foundation_donation_receipts(user_id);
CREATE INDEX idx_foundation_donation_receipts_tax_year ON foundation_donation_receipts(tax_year);

-- ============================================================================
-- USER DONATION SETTINGS (Auto-Round-Up)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_donation_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Auto-round-up preferences
  auto_roundup_enabled boolean DEFAULT false,
  roundup_percentage numeric DEFAULT 0.5 CHECK (roundup_percentage >= 0 AND roundup_percentage <= 5),
  
  -- Preferences
  preferred_campaign_id uuid REFERENCES foundation_campaigns(id),
  is_anonymous boolean DEFAULT false,
  
  -- Totals
  lifetime_donated_usd numeric DEFAULT 0,
  total_donations_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- RESEARCH PARTNERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_research_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name text NOT NULL,
  partner_type partner_type NOT NULL,
  
  -- Contact
  primary_contact_name text,
  primary_contact_email text,
  
  -- Location
  country text,
  city text,
  
  -- Credentials
  ein_tax_id text UNIQUE, -- For US 501(c)(3) verification
  registration_number text,
  
  -- Verification
  is_verified boolean DEFAULT false,
  kyc_completed boolean DEFAULT false,
  irb_approval boolean DEFAULT false, -- Institutional Review Board
  
  -- Details
  website_url text,
  description text,
  research_focus text[],
  
  -- Metrics
  total_grants_received numeric DEFAULT 0,
  active_grants_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_research_partners_type ON foundation_research_partners(partner_type);
CREATE INDEX idx_foundation_research_partners_verified ON foundation_research_partners(is_verified);

-- ============================================================================
-- GRANTS (Research Funding)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Grant details
  grant_number text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  
  -- Research partner
  partner_id uuid NOT NULL REFERENCES foundation_research_partners(id),
  principal_investigator text NOT NULL,
  
  -- Funding
  total_amount_usd numeric NOT NULL CHECK (total_amount_usd > 0),
  disbursed_amount_usd numeric DEFAULT 0 CHECK (disbursed_amount_usd >= 0),
  remaining_amount_usd numeric,
  
  -- Timeline
  start_date date NOT NULL,
  end_date date NOT NULL,
  
  status grant_status DEFAULT 'application',
  
  -- Research focus
  research_area text NOT NULL,
  target_age_group text, -- 'infant', 'child', 'adolescent', 'all'
  tumor_types text[],
  
  -- Milestones
  milestone_count integer DEFAULT 0,
  completed_milestones integer DEFAULT 0,
  
  -- Documentation (no PHI)
  proposal_url text, -- Secure storage link
  irb_approval_number text,
  
  -- Impact
  expected_outcomes text,
  publications text[], -- DOIs of resulting publications
  
  -- Review
  approved_by text, -- Foundation board member
  approved_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_grants_partner ON foundation_grants(partner_id);
CREATE INDEX idx_foundation_grants_status ON foundation_grants(status);
CREATE INDEX idx_foundation_grants_dates ON foundation_grants(start_date, end_date);

-- ============================================================================
-- GRANT MILESTONES (Milestone-Based Disbursement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_grant_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id uuid NOT NULL REFERENCES foundation_grants(id) ON DELETE CASCADE,
  
  -- Milestone details
  milestone_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  
  -- Funding
  disbursement_amount_usd numeric NOT NULL CHECK (disbursement_amount_usd > 0),
  
  -- Timeline
  target_date date,
  completed_date date,
  
  status milestone_status DEFAULT 'pending',
  
  -- Verification
  deliverable_description text,
  proof_of_completion_url text, -- Report or documentation
  proof_of_use_tx_hash text, -- On-chain verification
  
  -- Review
  reviewed_by text,
  reviewed_at timestamptz,
  review_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(grant_id, milestone_number)
);

CREATE INDEX idx_foundation_grant_milestones_grant ON foundation_grant_milestones(grant_id);
CREATE INDEX idx_foundation_grant_milestones_status ON foundation_grant_milestones(status);

-- ============================================================================
-- FAMILY SUPPORT (Micro-Grants)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_family_support (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Application (anonymized)
  application_number text UNIQUE NOT NULL,
  
  -- Support type
  support_type text NOT NULL, -- 'travel', 'lodging', 'medical_expenses', 'therapy', 'education'
  
  -- Amount
  requested_amount_usd numeric NOT NULL CHECK (requested_amount_usd > 0),
  approved_amount_usd numeric,
  
  -- Status
  status family_support_status DEFAULT 'application',
  
  -- Verification (NO PHI)
  hospital_verification boolean DEFAULT false,
  social_worker_contact text,
  
  -- Disbursement
  disbursed_at timestamptz,
  disbursement_tx_hash text,
  
  -- Privacy-preserving metadata
  patient_age_group text, -- 'infant', 'child', 'adolescent' (NOT exact age)
  diagnosis_category text, -- General category (NOT specific diagnosis)
  geographic_region text, -- State/country only (NOT city/address)
  
  -- Review
  reviewed_by text,
  reviewed_at timestamptz,
  review_notes text, -- Internal only, not public
  
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_family_support_status ON foundation_family_support(status);
CREATE INDEX idx_foundation_family_support_type ON foundation_family_support(support_type);

-- ============================================================================
-- IMPACT METRICS (Quarterly Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reporting period
  year integer NOT NULL,
  quarter integer NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  
  -- Donation metrics
  total_donations_usd numeric DEFAULT 0,
  unique_donors_count integer DEFAULT 0,
  
  -- Grant metrics
  grants_awarded integer DEFAULT 0,
  grants_awarded_amount_usd numeric DEFAULT 0,
  active_research_projects integer DEFAULT 0,
  
  -- Family support metrics
  families_supported integer DEFAULT 0,
  family_support_amount_usd numeric DEFAULT 0,
  
  -- Research outcomes
  publications_count integer DEFAULT 0,
  clinical_trials_initiated integer DEFAULT 0,
  
  -- Operating metrics
  operating_expenses_usd numeric DEFAULT 0,
  operating_expense_ratio numeric DEFAULT 0, -- % of donations
  
  -- Blockchain metrics
  total_tx_count integer DEFAULT 0,
  gas_fees_usd numeric DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(year, quarter)
);

CREATE INDEX idx_foundation_impact_metrics_period ON foundation_impact_metrics(year DESC, quarter DESC);

-- ============================================================================
-- TRANSPARENCY REPORTS (Annual "Night of the Owls")
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_transparency_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Report details
  fiscal_year integer UNIQUE NOT NULL,
  title text NOT NULL,
  
  -- Financial summary
  total_revenue_usd numeric NOT NULL DEFAULT 0,
  total_grants_awarded_usd numeric NOT NULL DEFAULT 0,
  total_family_support_usd numeric NOT NULL DEFAULT 0,
  total_operating_expenses_usd numeric NOT NULL DEFAULT 0,
  net_assets_usd numeric NOT NULL DEFAULT 0,
  
  -- Impact summary
  grants_awarded_count integer DEFAULT 0,
  families_supported_count integer DEFAULT 0,
  research_publications_count integer DEFAULT 0,
  unique_donors_count integer DEFAULT 0,
  
  -- Report files
  pdf_url text,
  blockchain_proof_hash text, -- Hash of report stored on-chain
  
  -- IRS Form 990 (required for US 501(c)(3))
  form_990_url text,
  
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_foundation_transparency_reports_year ON foundation_transparency_reports(fiscal_year DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Auto-create donation settings for new users
CREATE OR REPLACE FUNCTION create_donation_settings_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_donation_settings (user_id, auto_roundup_enabled, roundup_percentage)
  VALUES (NEW.id, false, 0.5)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_donation_settings
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_donation_settings_for_new_user();

-- Update campaign raised amount when donation received
CREATE OR REPLACE FUNCTION update_campaign_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.campaign_id IS NOT NULL THEN
    UPDATE foundation_campaigns
    SET 
      current_raised_usd = current_raised_usd + NEW.amount_usd,
      donor_count = donor_count + 1,
      updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  -- Update user donation settings
  IF NEW.donor_user_id IS NOT NULL THEN
    UPDATE user_donation_settings
    SET
      lifetime_donated_usd = lifetime_donated_usd + NEW.amount_usd,
      total_donations_count = total_donations_count + 1,
      updated_at = now()
    WHERE user_id = NEW.donor_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_on_donation
  AFTER INSERT ON foundation_donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_raised_amount();

-- Update grant disbursed amount when milestone completed
CREATE OR REPLACE FUNCTION update_grant_disbursement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.status IS NULL) THEN
    UPDATE foundation_grants
    SET
      disbursed_amount_usd = disbursed_amount_usd + NEW.disbursement_amount_usd,
      remaining_amount_usd = total_amount_usd - (disbursed_amount_usd + NEW.disbursement_amount_usd),
      completed_milestones = completed_milestones + 1,
      updated_at = now()
    WHERE id = NEW.grant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_grant_on_milestone
  AFTER UPDATE ON foundation_grant_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_grant_disbursement();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE foundation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_donation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_donation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_research_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_grant_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_family_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_transparency_reports ENABLE ROW LEVEL SECURITY;

-- Public read for transparency
CREATE POLICY "Anyone can view active campaigns"
  ON foundation_campaigns FOR SELECT
  TO authenticated
  USING (status = 'active' OR status = 'completed');

CREATE POLICY "Anyone can view non-anonymous donations"
  ON foundation_donations FOR SELECT
  TO authenticated
  USING (is_anonymous = false);

CREATE POLICY "Users can view their own donations"
  ON foundation_donations FOR SELECT
  TO authenticated
  USING (donor_user_id = auth.uid());

CREATE POLICY "Users can view their own donation receipts"
  ON foundation_donation_receipts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view and update their donation settings"
  ON user_donation_settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view verified research partners"
  ON foundation_research_partners FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Anyone can view active grants (no PHI)"
  ON foundation_grants FOR SELECT
  TO authenticated
  USING (status IN ('approved', 'active', 'completed'));

CREATE POLICY "Anyone can view grant milestones"
  ON foundation_grant_milestones FOR SELECT
  TO authenticated
  USING (true);

-- Family support: NO public access (privacy)
CREATE POLICY "Only admins can view family support applications"
  ON foundation_family_support FOR SELECT
  TO authenticated
  USING (false); -- Requires service role

CREATE POLICY "Anyone can view impact metrics"
  ON foundation_impact_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view transparency reports"
  ON foundation_transparency_reports FOR SELECT
  TO authenticated
  USING (published_at IS NOT NULL);