/*
  # Marketplace, VIP System, and Referral Program

  ## Overview
  This migration creates the marketplace for buying/selling NFT miners, the VIP loyalty program
  with 11 levels (0-10), and the referral/ambassador system with 5-5-5 commission structure.

  ## New Tables

  ### Marketplace
  1. `marketplace_listings`
     - NFT miner sale listings (fixed price or auction)
     - Price in TYT, BTC, or USDT
     - Active/sold/cancelled status
     - Platform fee tracking
  
  2. `marketplace_offers`
     - Buyer offers on listings
     - Counter-offer support
     - Pending/accepted/rejected status
     - One pending offer per buyer per listing
  
  3. `marketplace_sales`
     - Completed sale records
     - Commission and fee tracking
     - Full transaction history

  ### VIP System
  4. `vip_tiers`
     - 11 levels (0-10) with requirements
     - Based on total hashrate OR voting power
     - Perks: discounts, priority support, exclusive features
  
  5. `avatars`
     - Bonus avatar NFTs with gameplay boosts
     - Rarity tiers (common to legendary)
     - Active boost tracking

  ### Referral Program
  6. `referral_earnings`
     - Commission tracking for referrers
     - 5% on miner purchases, upgrades, game boosts
     - Paid out in TYT
  
  7. `ambassadors`
     - High-tier referral partners
     - Custom commission rates
     - Performance tracking

  ## Security
  - RLS enabled on all tables
  - Users can only manage their own listings/offers
  - Public read access for marketplace browsing
  - Referral earnings restricted to owner
*/

-- ============================================================================
-- MARKETPLACE TABLES
-- ============================================================================

CREATE TYPE listing_status AS ENUM ('active', 'sold', 'cancelled', 'expired');
CREATE TYPE listing_type AS ENUM ('fixed_price', 'auction');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE sale_currency AS ENUM ('TYT', 'BTC', 'USDT', 'TRX');

-- Marketplace listings for NFT miners
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id),
  listing_type listing_type NOT NULL DEFAULT 'fixed_price',
  price_amount numeric NOT NULL CHECK (price_amount > 0),
  price_currency sale_currency NOT NULL DEFAULT 'TYT',
  
  -- Auction fields
  min_bid_amount numeric,
  current_bid_amount numeric,
  auction_end_at timestamptz,
  
  -- Platform fee (3% default)
  platform_fee_percent numeric DEFAULT 3.0 CHECK (platform_fee_percent >= 0 AND platform_fee_percent <= 100),
  
  status listing_status DEFAULT 'active',
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  sold_at timestamptz,
  
  -- Ensure miner can only have one active listing
  UNIQUE(miner_id)
);

CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price_amount, price_currency);

-- Offers on marketplace listings
CREATE TABLE IF NOT EXISTS marketplace_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  offer_amount numeric NOT NULL CHECK (offer_amount > 0),
  offer_currency sale_currency NOT NULL DEFAULT 'TYT',
  message text,
  status offer_status DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Create partial unique constraint as separate index (PostgreSQL-specific)
CREATE UNIQUE INDEX idx_marketplace_offers_unique_pending 
  ON marketplace_offers(listing_id, buyer_id, status) 
  WHERE status = 'pending';

CREATE INDEX idx_marketplace_offers_listing ON marketplace_offers(listing_id);
CREATE INDEX idx_marketplace_offers_buyer ON marketplace_offers(buyer_id);

-- Completed sales history
CREATE TABLE IF NOT EXISTS marketplace_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace_listings(id),
  miner_id uuid NOT NULL REFERENCES nft_miners(id),
  seller_id uuid NOT NULL REFERENCES profiles(id),
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  
  sale_amount numeric NOT NULL CHECK (sale_amount > 0),
  sale_currency sale_currency NOT NULL,
  
  platform_fee_amount numeric NOT NULL DEFAULT 0,
  seller_net_amount numeric NOT NULL,
  
  -- Referral commission (if buyer was referred)
  referrer_id uuid REFERENCES profiles(id),
  referrer_commission_amount numeric DEFAULT 0,
  
  completed_at timestamptz DEFAULT now(),
  
  -- Transaction IDs for on-chain verification
  blockchain_tx_hash text,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_marketplace_sales_seller ON marketplace_sales(seller_id);
CREATE INDEX idx_marketplace_sales_buyer ON marketplace_sales(buyer_id);
CREATE INDEX idx_marketplace_sales_date ON marketplace_sales(completed_at DESC);

-- ============================================================================
-- VIP SYSTEM
-- ============================================================================

CREATE TYPE vip_requirement_type AS ENUM ('hashrate', 'voting_power', 'either');

-- VIP tier definitions (0-10)
CREATE TABLE IF NOT EXISTS vip_tiers (
  level integer PRIMARY KEY CHECK (level >= 0 AND level <= 10),
  name text NOT NULL,
  min_hashrate numeric,
  min_voting_power numeric,
  requirement_type vip_requirement_type NOT NULL DEFAULT 'either',
  
  -- Perks
  maintenance_discount_percent numeric DEFAULT 0 CHECK (maintenance_discount_percent >= 0 AND maintenance_discount_percent <= 20),
  marketplace_fee_discount_percent numeric DEFAULT 0,
  priority_support boolean DEFAULT false,
  early_access boolean DEFAULT false,
  exclusive_avatars boolean DEFAULT false,
  custom_badge text,
  
  description text,
  created_at timestamptz DEFAULT now()
);

-- Seed VIP tiers (0-10)
INSERT INTO vip_tiers (level, name, min_hashrate, min_voting_power, requirement_type, maintenance_discount_percent, marketplace_fee_discount_percent, priority_support, early_access, exclusive_avatars, description) VALUES
(0, 'Worker', 0, 0, 'either', 0, 0, false, false, false, 'Starting tier for all users'),
(1, 'Bronze Owl', 10, 1000, 'either', 1, 5, false, false, false, '10 TH/s or 1,000 voting power'),
(2, 'Silver Owl', 50, 5000, 'either', 2, 10, false, false, false, '50 TH/s or 5,000 voting power'),
(3, 'Gold Owl', 100, 10000, 'either', 3, 15, true, false, false, '100 TH/s or 10,000 voting power + priority support'),
(4, 'Platinum Owl', 250, 25000, 'either', 4, 20, true, false, true, '250 TH/s or 25,000 voting power + exclusive avatars'),
(5, 'Diamond Owl', 500, 50000, 'either', 5, 25, true, true, true, '500 TH/s or 50,000 voting power + early access'),
(6, 'Master Owl', 1000, 100000, 'either', 7, 30, true, true, true, '1,000 TH/s or 100,000 voting power'),
(7, 'Grandmaster Owl', 2500, 250000, 'either', 9, 35, true, true, true, '2,500 TH/s or 250,000 voting power'),
(8, 'Legend Owl', 5000, 500000, 'either', 11, 40, true, true, true, '5,000 TH/s or 500,000 voting power'),
(9, 'Mythic Owl', 10000, 1000000, 'either', 13, 45, true, true, true, '10,000 TH/s or 1,000,000 voting power'),
(10, 'Eternal Owl', 25000, 2500000, 'either', 15, 50, true, true, true, '25,000 TH/s or 2,500,000 voting power - Ultimate tier')
ON CONFLICT (level) DO NOTHING;

-- Avatar NFTs (bonus collectibles with boosts)
CREATE TYPE avatar_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE avatar_boost_type AS ENUM ('hashrate', 'efficiency', 'maintenance_discount', 'reward_multiplier');

CREATE TABLE IF NOT EXISTS avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  rarity avatar_rarity NOT NULL DEFAULT 'common',
  image_url text,
  
  -- Boost attributes
  boost_type avatar_boost_type,
  boost_value numeric DEFAULT 0 CHECK (boost_value >= 0),
  
  -- Active status
  is_equipped boolean DEFAULT false,
  
  -- Marketplace
  is_tradeable boolean DEFAULT true,
  
  acquired_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_avatars_owner ON avatars(owner_id);
CREATE INDEX idx_avatars_rarity ON avatars(rarity);

-- ============================================================================
-- REFERRAL PROGRAM
-- ============================================================================

CREATE TYPE referral_event_type AS ENUM ('miner_purchase', 'miner_upgrade', 'game_boost_purchase', 'marketplace_sale');
CREATE TYPE commission_status AS ENUM ('pending', 'paid', 'cancelled');

-- Referral earnings tracking (5-5-5 model)
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id),
  referred_user_id uuid NOT NULL REFERENCES profiles(id),
  
  event_type referral_event_type NOT NULL,
  event_id uuid, -- Reference to sale/purchase/upgrade
  
  base_amount numeric NOT NULL CHECK (base_amount >= 0),
  commission_percent numeric NOT NULL DEFAULT 5 CHECK (commission_percent >= 0 AND commission_percent <= 100),
  commission_amount numeric NOT NULL CHECK (commission_amount >= 0),
  
  status commission_status DEFAULT 'pending',
  paid_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_referral_earnings_referrer ON referral_earnings(referrer_id);
CREATE INDEX idx_referral_earnings_referred ON referral_earnings(referred_user_id);
CREATE INDEX idx_referral_earnings_status ON referral_earnings(status);

-- Ambassador program (high-tier referrers)
CREATE TYPE ambassador_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE ambassador_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TABLE IF NOT EXISTS ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id),
  tier ambassador_tier NOT NULL DEFAULT 'bronze',
  status ambassador_status DEFAULT 'active',
  
  -- Custom commission rates (overrides default 5%)
  purchase_commission_percent numeric DEFAULT 5 CHECK (purchase_commission_percent >= 0 AND purchase_commission_percent <= 15),
  upgrade_commission_percent numeric DEFAULT 5 CHECK (upgrade_commission_percent >= 0 AND upgrade_commission_percent <= 15),
  marketplace_commission_percent numeric DEFAULT 5 CHECK (marketplace_commission_percent >= 0 AND marketplace_commission_percent <= 15),
  
  -- Performance metrics
  total_referrals integer DEFAULT 0,
  active_referrals integer DEFAULT 0,
  total_earnings_tyt numeric DEFAULT 0,
  
  -- Custom ambassador code
  custom_code text UNIQUE,
  
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ambassadors_user ON ambassadors(user_id);
CREATE INDEX idx_ambassadors_tier ON ambassadors(tier);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Calculate VIP level based on hashrate or voting power
CREATE OR REPLACE FUNCTION calculate_vip_level(
  p_hashrate numeric,
  p_voting_power numeric
) RETURNS integer AS $$
DECLARE
  v_level integer := 0;
BEGIN
  -- Find highest qualifying VIP level
  SELECT MAX(level) INTO v_level
  FROM vip_tiers
  WHERE (
    (requirement_type = 'hashrate' AND p_hashrate >= min_hashrate)
    OR (requirement_type = 'voting_power' AND p_voting_power >= min_voting_power)
    OR (requirement_type = 'either' AND (p_hashrate >= min_hashrate OR p_voting_power >= min_voting_power))
  );
  
  RETURN COALESCE(v_level, 0);
END;
$$ LANGUAGE plpgsql;

-- Update VIP level when hashrate or voting power changes
CREATE OR REPLACE FUNCTION update_user_vip_level()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_hashrate numeric;
  v_voting_power numeric;
  v_new_level integer;
BEGIN
  -- Determine user_id based on trigger table
  IF TG_TABLE_NAME = 'profiles' THEN
    v_user_id := NEW.id;
    v_hashrate := NEW.total_hashrate;
  ELSIF TG_TABLE_NAME = 've_tyt_locks' THEN
    v_user_id := NEW.user_id;
    v_hashrate := (SELECT total_hashrate FROM profiles WHERE id = v_user_id);
  END IF;
  
  -- Calculate total voting power
  SELECT COALESCE(SUM(voting_power), 0) INTO v_voting_power
  FROM ve_tyt_locks
  WHERE user_id = v_user_id AND unlocks_at > now();
  
  -- Calculate new VIP level
  v_new_level := calculate_vip_level(v_hashrate, v_voting_power);
  
  -- Update profile
  UPDATE profiles SET vip_level = v_new_level WHERE id = v_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update VIP level when hashrate changes
DROP TRIGGER IF EXISTS trigger_update_vip_on_hashrate ON profiles;
CREATE TRIGGER trigger_update_vip_on_hashrate
  AFTER UPDATE OF total_hashrate ON profiles
  FOR EACH ROW
  WHEN (OLD.total_hashrate IS DISTINCT FROM NEW.total_hashrate)
  EXECUTE FUNCTION update_user_vip_level();

-- Trigger: Update VIP level when voting power changes
DROP TRIGGER IF EXISTS trigger_update_vip_on_voting_power ON ve_tyt_locks;
CREATE TRIGGER trigger_update_vip_on_voting_power
  AFTER INSERT OR UPDATE ON ve_tyt_locks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_vip_level();

-- Record referral commission on marketplace sale
CREATE OR REPLACE FUNCTION record_marketplace_referral_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_referrer_id uuid;
  v_commission_percent numeric := 5;
  v_commission_amount numeric;
BEGIN
  -- Get buyer's referrer
  SELECT referred_by INTO v_referrer_id
  FROM profiles
  WHERE id = NEW.buyer_id;
  
  -- If buyer was referred, record commission
  IF v_referrer_id IS NOT NULL THEN
    -- Check if referrer is ambassador with custom rate
    SELECT marketplace_commission_percent INTO v_commission_percent
    FROM ambassadors
    WHERE user_id = v_referrer_id AND status = 'active';
    
    -- Default to 5% if not ambassador
    v_commission_percent := COALESCE(v_commission_percent, 5);
    
    -- Calculate commission
    v_commission_amount := NEW.sale_amount * (v_commission_percent / 100);
    
    -- Record earning
    INSERT INTO referral_earnings (
      referrer_id,
      referred_user_id,
      event_type,
      event_id,
      base_amount,
      commission_percent,
      commission_amount,
      status
    ) VALUES (
      v_referrer_id,
      NEW.buyer_id,
      'marketplace_sale',
      NEW.id,
      NEW.sale_amount,
      v_commission_percent,
      v_commission_amount,
      'pending'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Record referral commission on marketplace sale
DROP TRIGGER IF EXISTS trigger_marketplace_referral_commission ON marketplace_sales;
CREATE TRIGGER trigger_marketplace_referral_commission
  AFTER INSERT ON marketplace_sales
  FOR EACH ROW
  EXECUTE FUNCTION record_marketplace_referral_commission();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;

-- Marketplace listings: public read, owner manage
CREATE POLICY "Anyone can view active marketplace listings"
  ON marketplace_listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can create listings for their own miners"
  ON marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can manage their own listings"
  ON marketplace_listings FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

-- Marketplace offers: public read, buyer create, seller respond
CREATE POLICY "Anyone can view offers on their listings"
  ON marketplace_offers FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid() 
    OR listing_id IN (SELECT id FROM marketplace_listings WHERE seller_id = auth.uid())
  );

CREATE POLICY "Users can create offers"
  ON marketplace_offers FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Users can manage their own offers"
  ON marketplace_offers FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid());

-- Marketplace sales: public read
CREATE POLICY "Anyone can view marketplace sales history"
  ON marketplace_sales FOR SELECT
  TO authenticated
  USING (true);

-- VIP tiers: public read
CREATE POLICY "Anyone can view VIP tiers"
  ON vip_tiers FOR SELECT
  TO authenticated
  USING (true);

-- Avatars: owner manage, public read
CREATE POLICY "Users can view their own avatars"
  ON avatars FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can update their own avatars"
  ON avatars FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

-- Referral earnings: owner view only
CREATE POLICY "Users can view their own referral earnings"
  ON referral_earnings FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid());

-- Ambassadors: owner view only
CREATE POLICY "Users can view their own ambassador status"
  ON ambassadors FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());