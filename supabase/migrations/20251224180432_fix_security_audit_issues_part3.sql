/*
  # Security Audit Fixes - Part 3: Drop More Unused Indexes

  Continues dropping unused indexes - blockchain and system indexes.
*/

-- Token & System indexes
DROP INDEX IF EXISTS idx_token_burn_events_status;
DROP INDEX IF EXISTS idx_system_health_metrics_type;
DROP INDEX IF EXISTS idx_system_health_metrics_recorded_at;

-- Charity & Protocol indexes
DROP INDEX IF EXISTS idx_charity_flows_source;
DROP INDEX IF EXISTS idx_charity_flows_flow_type;
DROP INDEX IF EXISTS idx_charity_flows_created_at;
DROP INDEX IF EXISTS idx_charity_flows_transaction_id;
DROP INDEX IF EXISTS idx_protocol_revenue_source;
DROP INDEX IF EXISTS idx_protocol_revenue_created_at;
DROP INDEX IF EXISTS idx_protocol_revenue_transaction_id;
DROP INDEX IF EXISTS idx_user_donation_settings_preferred_campaign_id;

-- Deposit & Blockchain indexes
DROP INDEX IF EXISTS idx_user_deposit_addresses_network;
DROP INDEX IF EXISTS idx_user_deposit_addresses_address;
DROP INDEX IF EXISTS idx_blockchain_deposits_status;
DROP INDEX IF EXISTS idx_blockchain_deposits_tx_hash;
DROP INDEX IF EXISTS idx_blockchain_deposits_address;
DROP INDEX IF EXISTS idx_blockchain_deposits_wallet_transaction_id;

-- Web3 Wallet indexes
DROP INDEX IF EXISTS idx_user_web3_wallets_address;
DROP INDEX IF EXISTS idx_user_blockchain_addresses_user_id;
DROP INDEX IF EXISTS idx_user_blockchain_addresses_address;
DROP INDEX IF EXISTS idx_user_blockchain_addresses_blockchain;

-- Token trading indexes
DROP INDEX IF EXISTS idx_tyt_token_trades_status;
DROP INDEX IF EXISTS idx_sol_transfers_status;
DROP INDEX IF EXISTS idx_token_swaps_blockchain;
DROP INDEX IF EXISTS idx_token_swaps_tx_hash;
DROP INDEX IF EXISTS idx_token_swaps_status;

-- Staking indexes
DROP INDEX IF EXISTS idx_staking_pools_blockchain;
DROP INDEX IF EXISTS idx_staking_pools_is_active;
DROP INDEX IF EXISTS idx_user_stakes_pool_id;
DROP INDEX IF EXISTS idx_user_stakes_status;
DROP INDEX IF EXISTS idx_staking_rewards_stake_id;

-- Cross-chain indexes
DROP INDEX IF EXISTS idx_cross_chain_transfers_status;
DROP INDEX IF EXISTS idx_cross_chain_transfers_source_tx;

-- Fiat indexes
DROP INDEX IF EXISTS idx_fiat_transactions_status;
DROP INDEX IF EXISTS idx_fiat_transactions_provider_id;

-- KYC & Access indexes
DROP INDEX IF EXISTS idx_user_profiles_kyc_status;
DROP INDEX IF EXISTS idx_user_profiles_access_level;
DROP INDEX IF EXISTS idx_kyc_documents_status;
DROP INDEX IF EXISTS idx_user_feature_access_feature_code;

-- Withdrawal indexes
DROP INDEX IF EXISTS idx_withdrawal_requests_status;
DROP INDEX IF EXISTS idx_withdrawal_requests_pending;