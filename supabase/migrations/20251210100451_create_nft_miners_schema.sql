/*
  # NFT Digital Miners Schema
  
  1. New Tables
    - `nft_collections` - NFT collections/series
      - `id` (uuid, primary key)
      - `name` (text)
      - `symbol` (text)
      - `description` (text)
      - `contract_address` (text) - TRON TRC-721 address
      - `total_supply` (integer)
      - `base_hashrate` (numeric) - Base TH/s
      - `base_efficiency` (numeric) - Base W/TH
      - `is_active` (boolean)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `nft_miners` - Individual NFT miners owned by users
      - `id` (uuid, primary key)
      - `token_id` (text, unique) - On-chain token ID
      - `owner_id` (uuid, references profiles)
      - `collection_id` (uuid, references nft_collections)
      - `name` (text)
      - `hashrate` (numeric) - Current TH/s
      - `efficiency` (numeric) - Current W/TH  
      - `power_level` (integer) - 1-20 upgrade levels
      - `maintenance_rate` (numeric) - Daily maintenance cost in USD
      - `farm_id` (text) - Data center identifier
      - `purchase_price` (numeric)
      - `purchase_currency` (text)
      - `last_reward_at` (timestamptz)
      - `total_rewards_btc` (numeric)
      - `is_listed` (boolean) - Listed on marketplace
      - `metadata_uri` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `miner_upgrades` - Upgrade history
      - `id` (uuid, primary key)
      - `miner_id` (uuid, references nft_miners)
      - `upgrade_type` (enum: hashrate, efficiency)
      - `from_value` (numeric)
      - `to_value` (numeric)
      - `cost` (numeric)
      - `cost_currency` (text)
      - `created_at` (timestamptz)
    
    - `data_centers` - Mining facility information
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `country_code` (text)
      - `kwh_rate` (numeric) - Cost per kWh
      - `total_capacity_th` (numeric)
      - `used_capacity_th` (numeric)
      - `live_stream_url` (text)
      - `is_active` (boolean)
      - `metadata` (jsonb)
  
  2. Security
    - Enable RLS on all tables
    - Users can only manage their own miners
    - Public read access to collections and data centers
*/

-- Create custom types
CREATE TYPE upgrade_type AS ENUM ('hashrate', 'efficiency', 'power_level');
CREATE TYPE miner_status AS ENUM ('active', 'inactive', 'maintenance', 'listed_for_sale');

-- NFT Collections table
CREATE TABLE IF NOT EXISTS nft_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text NOT NULL,
  description text,
  contract_address text UNIQUE,
  total_supply integer DEFAULT 0,
  minted_supply integer DEFAULT 0,
  base_hashrate numeric NOT NULL CHECK (base_hashrate > 0),
  base_efficiency numeric NOT NULL CHECK (base_efficiency > 0),
  base_maintenance_rate numeric DEFAULT 0,
  floor_price numeric,
  floor_price_currency text DEFAULT 'TYT',
  is_active boolean DEFAULT true,
  image_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- NFT Miners table
CREATE TABLE IF NOT EXISTS nft_miners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES nft_collections(id) ON DELETE CASCADE,
  name text NOT NULL,
  hashrate numeric NOT NULL CHECK (hashrate > 0),
  efficiency numeric NOT NULL CHECK (efficiency > 0),
  power_level integer DEFAULT 1 CHECK (power_level >= 1 AND power_level <= 20),
  maintenance_rate numeric DEFAULT 0 CHECK (maintenance_rate >= 0),
  farm_id text,
  purchase_price numeric,
  purchase_currency text DEFAULT 'TYT',
  purchased_at timestamptz DEFAULT now(),
  last_reward_at timestamptz,
  last_maintenance_paid_at timestamptz,
  total_rewards_btc numeric DEFAULT 0,
  total_maintenance_paid numeric DEFAULT 0,
  status miner_status DEFAULT 'active',
  is_listed boolean DEFAULT false,
  listed_price numeric,
  metadata_uri text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Miner Upgrades table
CREATE TABLE IF NOT EXISTS miner_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  miner_id uuid NOT NULL REFERENCES nft_miners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  upgrade_type upgrade_type NOT NULL,
  from_value numeric NOT NULL,
  to_value numeric NOT NULL,
  cost numeric NOT NULL,
  cost_currency text DEFAULT 'TYT',
  transaction_id uuid REFERENCES wallet_transactions(id),
  created_at timestamptz DEFAULT now()
);

-- Data Centers table
CREATE TABLE IF NOT EXISTS data_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  country_code text,
  latitude numeric,
  longitude numeric,
  kwh_rate numeric NOT NULL CHECK (kwh_rate > 0),
  total_capacity_th numeric DEFAULT 0,
  used_capacity_th numeric DEFAULT 0,
  live_stream_url text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_nft_miners_owner_id ON nft_miners(owner_id);
CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id ON nft_miners(collection_id);
CREATE INDEX IF NOT EXISTS idx_nft_miners_status ON nft_miners(status);
CREATE INDEX IF NOT EXISTS idx_nft_miners_is_listed ON nft_miners(is_listed) WHERE is_listed = true;
CREATE INDEX IF NOT EXISTS idx_nft_miners_token_id ON nft_miners(token_id);
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_miner_id ON miner_upgrades(miner_id);
CREATE INDEX IF NOT EXISTS idx_miner_upgrades_user_id ON miner_upgrades(user_id);

-- Enable RLS
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_miners ENABLE ROW LEVEL SECURITY;
ALTER TABLE miner_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_centers ENABLE ROW LEVEL SECURITY;

-- NFT Collections policies (public read)
CREATE POLICY "Anyone can view active collections"
  ON nft_collections FOR SELECT
  TO authenticated
  USING (is_active = true);

-- NFT Miners policies
CREATE POLICY "Users can view own miners"
  ON nft_miners FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can view listed miners"
  ON nft_miners FOR SELECT
  TO authenticated
  USING (is_listed = true);

CREATE POLICY "Users can update own miners"
  ON nft_miners FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can insert own miners"
  ON nft_miners FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Miner Upgrades policies
CREATE POLICY "Users can view own upgrades"
  ON miner_upgrades FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own upgrades"
  ON miner_upgrades FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Data Centers policies (public read)
CREATE POLICY "Anyone can view active data centers"
  ON data_centers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Function to calculate daily BTC rewards
CREATE OR REPLACE FUNCTION calculate_daily_btc_reward(
  p_hashrate numeric,
  p_efficiency numeric,
  p_btc_network_hashrate numeric DEFAULT 400000000, -- 400 EH/s in TH/s
  p_btc_block_reward numeric DEFAULT 3.125,
  p_blocks_per_day numeric DEFAULT 144
)
RETURNS numeric AS $$
DECLARE
  v_daily_btc numeric;
BEGIN
  -- Simplified formula: (miner_hashrate / network_hashrate) * daily_block_rewards
  -- Adjusted for efficiency (better efficiency = slightly higher rewards)
  v_daily_btc := (p_hashrate / p_btc_network_hashrate) * (p_btc_block_reward * p_blocks_per_day);
  
  -- Apply efficiency multiplier (lower W/TH is better, so invert)
  -- Base efficiency around 25 W/TH
  v_daily_btc := v_daily_btc * (25.0 / GREATEST(p_efficiency, 1));
  
  RETURN v_daily_btc;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate daily maintenance cost
CREATE OR REPLACE FUNCTION calculate_daily_maintenance(
  p_hashrate numeric,
  p_efficiency numeric,
  p_kwh_rate numeric DEFAULT 0.05,
  p_btc_price_usd numeric DEFAULT 40000
)
RETURNS numeric AS $$
DECLARE
  v_daily_kwh numeric;
  v_daily_cost_usd numeric;
BEGIN
  -- Calculate daily power consumption: (W/TH * TH/s * 24 hours) / 1000 = kWh
  v_daily_kwh := (p_efficiency * p_hashrate * 24) / 1000.0;
  
  -- Calculate cost in USD
  v_daily_cost_usd := v_daily_kwh * p_kwh_rate;
  
  RETURN v_daily_cost_usd;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to update total hashrate in profile when miners change
CREATE OR REPLACE FUNCTION update_user_total_hashrate()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_hashrate = (
    SELECT COALESCE(SUM(hashrate), 0)
    FROM nft_miners
    WHERE owner_id = COALESCE(NEW.owner_id, OLD.owner_id)
    AND status = 'active'
  )
  WHERE id = COALESCE(NEW.owner_id, OLD.owner_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_hashrate_on_miner_change
  AFTER INSERT OR UPDATE OR DELETE ON nft_miners
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_hashrate();