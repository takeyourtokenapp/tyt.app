/*
  # Core Users and Authentication Schema
  
  1. New Tables
    - `profiles` - Extended user profile data
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `email` (text)
      - `kyc_status` (enum: pending, approved, rejected)
      - `kyc_submitted_at` (timestamptz)
      - `two_fa_enabled` (boolean)
      - `referral_code` (text, unique)
      - `referred_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `custodial_wallets` - Internal wallets for users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `currency` (enum: BTC, TYT, USDT, TRX)
      - `balance` (numeric)
      - `address` (text) - Generated TRON address
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `wallet_transactions` - Transaction history
      - `id` (uuid, primary key)
      - `wallet_id` (uuid, references custodial_wallets)
      - `type` (enum: deposit, withdrawal, reward, maintenance, purchase, sale)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (enum: pending, completed, failed)
      - `tx_hash` (text) - Blockchain transaction hash
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Add policies for authenticated access
*/

-- Create custom types
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected', 'not_submitted');
CREATE TYPE wallet_currency AS ENUM ('BTC', 'TYT', 'USDT', 'TRX', 'ETH', 'SOL');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'reward', 'maintenance', 'purchase', 'sale', 'transfer', 'burn');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text NOT NULL,
  full_name text,
  kyc_status kyc_status DEFAULT 'not_submitted',
  kyc_submitted_at timestamptz,
  kyc_document_url text,
  two_fa_enabled boolean DEFAULT false,
  referral_code text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by uuid REFERENCES profiles(id),
  vip_level integer DEFAULT 0,
  total_hashrate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Custodial wallets table
CREATE TABLE IF NOT EXISTS custodial_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency wallet_currency NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  locked_balance numeric DEFAULT 0 CHECK (locked_balance >= 0),
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES custodial_wallets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount numeric NOT NULL,
  currency wallet_currency NOT NULL,
  status transaction_status DEFAULT 'pending',
  tx_hash text,
  from_address text,
  to_address text,
  fee numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_custodial_wallets_user_id ON custodial_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_custodial_wallets_currency ON custodial_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE custodial_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view referrer profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id IN (SELECT referred_by FROM profiles WHERE id = auth.uid()));

-- Custodial wallets policies
CREATE POLICY "Users can view own wallets"
  ON custodial_wallets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own wallets"
  ON custodial_wallets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Wallet transactions policies
CREATE POLICY "Users can view own transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to automatically create wallets for new users
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default wallets for BTC, TYT, USDT
  INSERT INTO custodial_wallets (user_id, currency, balance)
  VALUES 
    (NEW.id, 'BTC', 0),
    (NEW.id, 'TYT', 0),
    (NEW.id, 'USDT', 0),
    (NEW.id, 'TRX', 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallets on profile creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custodial_wallets_updated_at
  BEFORE UPDATE ON custodial_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();