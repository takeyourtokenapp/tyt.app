/*
  # Create Network Metadata Table
  
  1. New Tables
    - `network_metadata` - Extended metadata for blockchain networks
      - `network_code` (text, primary key) - Network code (e.g., ETH, BTC)
      - `description` (text) - Network description
      - `average_block_time_seconds` (integer) - Average block time
      - `base_fee_percentage` (decimal) - Base fee percentage
      - `min_deposit_amount` (decimal) - Minimum deposit amount
      - `min_withdrawal_amount` (decimal) - Minimum withdrawal amount
      - `supports_memos` (boolean) - Whether network supports memos
      - `supports_smart_contracts` (boolean) - Whether network supports smart contracts
      - `is_featured` (boolean) - Whether network is featured
      - `display_order` (integer) - Display order in UI
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp
  
  2. Security
    - Enable RLS on `network_metadata` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS network_metadata (
  network_code text PRIMARY KEY,
  description text,
  average_block_time_seconds integer,
  base_fee_percentage decimal(10,6) DEFAULT 0.01,
  min_deposit_amount decimal(20,8) DEFAULT 0,
  min_withdrawal_amount decimal(20,8) DEFAULT 0,
  supports_memos boolean DEFAULT false,
  supports_smart_contracts boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 999,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE network_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Network metadata is publicly readable"
  ON network_metadata
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert metadata for all active networks
INSERT INTO network_metadata (
  network_code, 
  description, 
  average_block_time_seconds, 
  base_fee_percentage,
  min_deposit_amount,
  min_withdrawal_amount,
  supports_memos,
  supports_smart_contracts,
  is_featured,
  display_order
) VALUES 
  (
    'ETH', 
    'Ethereum is the world''s programmable blockchain for dApps and smart contracts.',
    12,
    0.01,
    0.001,
    0.001,
    false,
    true,
    true,
    1
  ),
  (
    'BTC', 
    'Bitcoin is the first and most established cryptocurrency network.',
    600,
    0.01,
    0.0001,
    0.0001,
    false,
    false,
    true,
    2
  ),
  (
    'TRON', 
    'TRON is a high-throughput blockchain for decentralized applications.',
    3,
    0.01,
    1,
    1,
    true,
    true,
    true,
    3
  ),
  (
    'BSC', 
    'BNB Smart Chain offers fast and low-cost transactions.',
    3,
    0.01,
    0.001,
    0.001,
    false,
    true,
    true,
    4
  ),
  (
    'POLYGON', 
    'Polygon is a scaling solution for Ethereum with lower fees.',
    2,
    0.01,
    0.01,
    0.01,
    false,
    true,
    true,
    5
  ),
  (
    'SOL', 
    'Solana is a high-performance blockchain for Web3 applications.',
    1,
    0.01,
    0.001,
    0.001,
    true,
    true,
    true,
    6
  )
ON CONFLICT (network_code) DO UPDATE SET
  description = EXCLUDED.description,
  average_block_time_seconds = EXCLUDED.average_block_time_seconds,
  base_fee_percentage = EXCLUDED.base_fee_percentage,
  min_deposit_amount = EXCLUDED.min_deposit_amount,
  min_withdrawal_amount = EXCLUDED.min_withdrawal_amount,
  supports_memos = EXCLUDED.supports_memos,
  supports_smart_contracts = EXCLUDED.supports_smart_contracts,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  updated_at = now();
