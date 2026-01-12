/*
  # Add Missing Foreign Key Indexes - Part 6: Miners & Profiles Tables

  1. Purpose
    - Add indexes to foreign key columns for NFT miners and user profiles
    - Critical for core platform functionality

  2. Tables Updated (6 indexes)
    - nft_miners (1 index)
    - profiles (1 index)
    - protocol_revenue (1 index)
    - reconciliation_snapshots (1 index)
    - staking_rewards (1 index)
    - tyt_trades (1 index)

  3. Impact
    - Faster miner collection queries
    - Improved referral tracking
    - Better revenue reporting
    - Optimized ledger reconciliation
*/

-- NFT Miners
CREATE INDEX IF NOT EXISTS idx_nft_miners_collection_id 
ON nft_miners(collection_id);

-- Profiles (Referral System)
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by 
ON profiles(referred_by);

-- Protocol Revenue
CREATE INDEX IF NOT EXISTS idx_protocol_revenue_transaction_id 
ON protocol_revenue(transaction_id);

-- Reconciliation Snapshots
CREATE INDEX IF NOT EXISTS idx_reconciliation_snapshots_account_id 
ON reconciliation_snapshots(account_id);

-- Staking Rewards
CREATE INDEX IF NOT EXISTS idx_staking_rewards_stake_id 
ON staking_rewards(stake_id);

-- TYT Trades
CREATE INDEX IF NOT EXISTS idx_tyt_trades_connected_wallet_id 
ON tyt_trades(connected_wallet_id);
