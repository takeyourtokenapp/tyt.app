-- KYC System & User Access Levels v3
-- Creates comprehensive KYC verification and user access level management

-- Create ENUMs for Access Control (skip if exists)
DO $$ BEGIN
  CREATE TYPE access_level AS ENUM ('restricted', 'standard', 'premium', 'vip');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('passport', 'id_card', 'drivers_license', 'proof_of_address', 'selfie');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  kyc_status kyc_status DEFAULT 'not_submitted',
  kyc_tier int DEFAULT 0 CHECK (kyc_tier >= 0 AND kyc_tier <= 3),
  access_level access_level DEFAULT 'restricted',
  reward_points numeric DEFAULT 0 CHECK (reward_points >= 0),
  total_trading_volume numeric DEFAULT 0 CHECK (total_trading_volume >= 0),
  registration_date timestamptz DEFAULT now(),
  kyc_submitted_at timestamptz,
  kyc_approved_at timestamptz,
  last_active timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url text NOT NULL,
  status document_status DEFAULT 'pending',
  rejection_reason text,
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Access Features Table
CREATE TABLE IF NOT EXISTS access_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_code text UNIQUE NOT NULL,
  feature_name text NOT NULL,
  description text,
  required_kyc_tier int DEFAULT 0 CHECK (required_kyc_tier >= 0 AND required_kyc_tier <= 3),
  required_access_level access_level DEFAULT 'restricted',
  required_reward_points numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Feature Access Table
CREATE TABLE IF NOT EXISTS user_feature_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_code text NOT NULL REFERENCES access_features(feature_code) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  granted_reason text,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, feature_code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_kyc_status ON user_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_access_level ON user_profiles(access_level);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);
CREATE INDEX IF NOT EXISTS idx_user_feature_access_user_id ON user_feature_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature_code ON user_feature_access(feature_code);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feature_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
DO $$ BEGIN
  CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "System can insert user profiles"
    ON user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for kyc_documents
DO $$ BEGIN
  CREATE POLICY "Users can view own KYC documents"
    ON kyc_documents FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own KYC documents"
    ON kyc_documents FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for access_features
DO $$ BEGIN
  CREATE POLICY "Anyone can view active features"
    ON access_features FOR SELECT
    TO authenticated
    USING (is_active = true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for user_feature_access
DO $$ BEGIN
  CREATE POLICY "Users can view own feature access"
    ON user_feature_access FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION check_user_feature_access(
  p_user_id uuid,
  p_feature_code text
)
RETURNS boolean AS $$
DECLARE
  v_profile user_profiles%ROWTYPE;
  v_feature access_features%ROWTYPE;
  v_has_explicit_access boolean;
BEGIN
  SELECT * INTO v_profile FROM user_profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  SELECT * INTO v_feature FROM access_features WHERE feature_code = p_feature_code AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM user_feature_access
    WHERE user_id = p_user_id
    AND feature_code = p_feature_code
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO v_has_explicit_access;
  
  IF v_has_explicit_access THEN
    RETURN true;
  END IF;
  
  IF v_profile.kyc_tier >= v_feature.required_kyc_tier
    AND v_profile.reward_points >= v_feature.required_reward_points
    AND (
      (v_feature.required_access_level = 'restricted')
      OR (v_feature.required_access_level = 'standard' AND v_profile.access_level IN ('standard', 'premium', 'vip'))
      OR (v_feature.required_access_level = 'premium' AND v_profile.access_level IN ('premium', 'vip'))
      OR (v_feature.required_access_level = 'vip' AND v_profile.access_level = 'vip')
    )
  THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default features
INSERT INTO access_features (feature_code, feature_name, description, required_kyc_tier, required_access_level, required_reward_points) VALUES
  ('wallet_view', 'View Wallet', 'View wallet balances and assets', 0, 'restricted', 0),
  ('wallet_deposit', 'Deposit Funds', 'Deposit crypto to wallet', 0, 'restricted', 0),
  ('wallet_withdraw', 'Withdraw Funds', 'Withdraw crypto from wallet (requires KYC)', 1, 'standard', 0),
  ('wallet_swap', 'Swap Assets', 'Exchange between cryptocurrencies', 0, 'restricted', 0),
  ('wallet_stake', 'Stake Tokens', 'Stake TYT tokens for rewards', 1, 'standard', 0),
  ('marketplace_view', 'View Marketplace', 'Browse NFT miners marketplace', 0, 'restricted', 0),
  ('marketplace_buy', 'Buy NFT Miners', 'Purchase NFT miners', 1, 'standard', 0),
  ('marketplace_sell', 'Sell NFT Miners', 'List miners for sale', 1, 'standard', 0),
  ('rewards_claim', 'Claim Rewards', 'Claim mining rewards', 1, 'standard', 0),
  ('maintenance_pay', 'Pay Maintenance', 'Pay miner maintenance fees', 1, 'standard', 0),
  ('governance_vote', 'Vote on Proposals', 'Participate in governance', 2, 'premium', 1000),
  ('advanced_trading', 'Advanced Trading', 'Access advanced trading features', 2, 'premium', 5000),
  ('vip_features', 'VIP Features', 'Access exclusive VIP features', 3, 'vip', 10000),
  ('foundation_donate', 'Donate to Foundation', 'Make donations to foundation', 0, 'restricted', 0),
  ('academy_access', 'Access Academy', 'Access educational content', 0, 'restricted', 0)
ON CONFLICT (feature_code) DO NOTHING;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, registration_date)
  VALUES (NEW.id, now())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_on_signup();
