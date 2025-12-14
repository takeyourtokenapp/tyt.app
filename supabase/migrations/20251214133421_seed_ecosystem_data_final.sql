/*
  # TYT Ecosystem Seed Data - Final

  Seeds essential data:
  - 6 NFT Collections (Bronze to Legendary)
  - 3 Data Centers (USA, Iceland, Singapore)
  - 4 Staking Pools (TYT staking)
  - 5 Maintenance Discount Tiers
  - 2 Foundation Campaigns
*/

-- ============================================================================
-- 1. NFT COLLECTIONS (6 TIERS)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'BRONZE') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Bronze Miner Collection', 'BRONZE', 'Entry-level mining power for beginners', 10.0, 0.80, 5.0, 100.0, 'USDT', '/images/miners/bronze.png', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'SILVER') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Silver Miner Collection', 'SILVER', 'Advanced mining with improved efficiency', 25.0, 0.85, 10.0, 250.0, 'USDT', '/images/miners/silver.png', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'GOLD') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Gold Miner Collection', 'GOLD', 'Professional mining hardware', 50.0, 0.90, 18.0, 500.0, 'USDT', '/images/miners/gold.png', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'PLATINUM') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Platinum Miner Collection', 'PLATINUM', 'Elite mining infrastructure', 100.0, 0.92, 32.0, 1000.0, 'USDT', '/images/miners/platinum.png', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'DIAMOND') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Diamond Miner Collection', 'DIAMOND', 'Ultimate mining power', 200.0, 0.95, 60.0, 2000.0, 'USDT', '/images/miners/diamond.png', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM nft_collections WHERE symbol = 'LEGENDARY') THEN
    INSERT INTO nft_collections (name, symbol, description, base_hashrate, base_efficiency, base_maintenance_rate, floor_price, floor_price_currency, image_url, is_active)
    VALUES ('Legendary Miner Collection', 'LEGENDARY', 'Mythical mining dominance', 500.0, 0.98, 140.0, 5000.0, 'USDT', '/images/miners/legendary.png', true);
  END IF;
END $$;

-- ============================================================================
-- 2. DATA CENTERS
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM data_centers WHERE country_code = 'US') THEN
    INSERT INTO data_centers (name, location, country_code, kwh_rate, total_capacity_th, used_capacity_th, is_active, metadata)
    VALUES ('TYT Mining - Texas', 'Austin, Texas', 'US', 0.08, 10000.0, 0.0, true, '{"renewable_energy": true, "cooling_type": "immersion"}'::jsonb);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM data_centers WHERE country_code = 'IS') THEN
    INSERT INTO data_centers (name, location, country_code, kwh_rate, total_capacity_th, used_capacity_th, is_active, metadata)
    VALUES ('TYT Mining - Iceland', 'Reykjavik, Iceland', 'IS', 0.05, 15000.0, 0.0, true, '{"renewable_energy": true, "cooling_type": "natural"}'::jsonb);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM data_centers WHERE country_code = 'SG') THEN
    INSERT INTO data_centers (name, location, country_code, kwh_rate, total_capacity_th, used_capacity_th, is_active, metadata)
    VALUES ('TYT Mining - Singapore', 'Singapore', 'SG', 0.12, 8000.0, 0.0, true, '{"renewable_energy": false, "cooling_type": "hvac"}'::jsonb);
  END IF;
END $$;

-- ============================================================================
-- 3. STAKING POOLS
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM staking_pools WHERE name = 'TYT Flexible Staking') THEN
    INSERT INTO staking_pools (name, blockchain, token_symbol, token_address, apy, min_stake, lock_period_days, total_staked, max_capacity, is_active, description)
    VALUES ('TYT Flexible Staking', 'solana', 'TYT', '11111111111111111111111111111111', 8.5, 100.0, 0, 0.0, 10000000.0, true, 'No lock period - 8.5% APY');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM staking_pools WHERE name = 'TYT 30-Day Lock') THEN
    INSERT INTO staking_pools (name, blockchain, token_symbol, token_address, apy, min_stake, lock_period_days, total_staked, max_capacity, is_active, description)
    VALUES ('TYT 30-Day Lock', 'solana', 'TYT', '11111111111111111111111111111111', 15.0, 1000.0, 30, 0.0, 5000000.0, true, '30 days locked - 15% APY');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM staking_pools WHERE name = 'TYT 90-Day Lock') THEN
    INSERT INTO staking_pools (name, blockchain, token_symbol, token_address, apy, min_stake, lock_period_days, total_staked, max_capacity, is_active, description)
    VALUES ('TYT 90-Day Lock', 'solana', 'TYT', '11111111111111111111111111111111', 25.0, 5000.0, 90, 0.0, 3000000.0, true, '90 days locked - 25% APY');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM staking_pools WHERE name = 'TYT 180-Day Lock') THEN
    INSERT INTO staking_pools (name, blockchain, token_symbol, token_address, apy, min_stake, lock_period_days, total_staked, max_capacity, is_active, description)
    VALUES ('TYT 180-Day Lock', 'solana', 'TYT', '11111111111111111111111111111111', 40.0, 10000.0, 180, 0.0, 2000000.0, true, '180 days locked - 40% APY');
  END IF;
END $$;

-- ============================================================================
-- 4. MAINTENANCE DISCOUNT TIERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS maintenance_discount_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  min_tyt_stake numeric NOT NULL CHECK (min_tyt_stake >= 0),
  discount_percentage numeric NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_discount_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view maintenance discount tiers"
  ON maintenance_discount_tiers FOR SELECT
  TO authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM maintenance_discount_tiers WHERE name = 'Standard') THEN
    INSERT INTO maintenance_discount_tiers (name, min_tyt_stake, discount_percentage, description)
    VALUES ('Standard', 0, 0, 'Default rate');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM maintenance_discount_tiers WHERE name = 'Holder') THEN
    INSERT INTO maintenance_discount_tiers (name, min_tyt_stake, discount_percentage, description)
    VALUES ('Holder', 1000, 2, '1K+ TYT = 2% discount');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM maintenance_discount_tiers WHERE name = 'Stakeholder') THEN
    INSERT INTO maintenance_discount_tiers (name, min_tyt_stake, discount_percentage, description)
    VALUES ('Stakeholder', 5000, 5, '5K+ TYT = 5% discount');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM maintenance_discount_tiers WHERE name = 'Whale') THEN
    INSERT INTO maintenance_discount_tiers (name, min_tyt_stake, discount_percentage, description)
    VALUES ('Whale', 50000, 10, '50K+ TYT = 10% discount');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM maintenance_discount_tiers WHERE name = 'Megalodon') THEN
    INSERT INTO maintenance_discount_tiers (name, min_tyt_stake, discount_percentage, description)
    VALUES ('Megalodon', 500000, 15, '500K+ TYT = 15% discount');
  END IF;
END $$;

-- ============================================================================
-- 5. FOUNDATION CAMPAIGNS
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM foundation_campaigns WHERE slug = 'brain-tumor-research-2025') THEN
    INSERT INTO foundation_campaigns (
      slug, title, description, funding_goal_usd, current_raised_usd,
      start_date, end_date, campaign_type, beneficiary_description,
      status, image_url
    ) VALUES (
      'brain-tumor-research-2025',
      'Pediatric Brain Tumor Research 2025',
      'Fund cutting-edge research into childhood brain tumors',
      500000.0, 0.0,
      CURRENT_DATE, CURRENT_DATE + 90,
      'specific_research',
      'Children Brain Cancer Research Institute - Multiple Locations',
      'active',
      '/images/campaigns/research-2025.jpg'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM foundation_campaigns WHERE slug = 'medical-equipment-2025') THEN
    INSERT INTO foundation_campaigns (
      slug, title, description, funding_goal_usd, current_raised_usd,
      start_date, end_date, campaign_type, beneficiary_description,
      status, image_url
    ) VALUES (
      'medical-equipment-2025',
      'Medical Equipment Donation 2025',
      'Purchase advanced MRI equipment for pediatric hospitals',
      250000.0, 0.0,
      CURRENT_DATE, CURRENT_DATE + 60,
      'equipment',
      'International Pediatric Oncology Network - 5 Hospitals',
      'active',
      '/images/campaigns/equipment-2025.jpg'
    );
  END IF;
END $$;

-- ============================================================================
-- HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_maintenance_discount(p_user_id uuid)
RETURNS TABLE(
  tier_name text,
  discount_percentage numeric
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_tyt numeric;
BEGIN
  SELECT COALESCE(
    (SELECT SUM(balance::numeric) FROM custodial_wallets WHERE user_id = p_user_id AND asset = 'TYT'),
    0
  ) + COALESCE(
    (SELECT SUM(amount) FROM user_stakes WHERE user_id = p_user_id AND status = 'active'),
    0
  ) INTO v_total_tyt;

  RETURN QUERY
  SELECT dt.name, dt.discount_percentage
  FROM maintenance_discount_tiers dt
  WHERE dt.min_tyt_stake <= v_total_tyt
  ORDER BY dt.min_tyt_stake DESC
  LIMIT 1;
END;
$$;
