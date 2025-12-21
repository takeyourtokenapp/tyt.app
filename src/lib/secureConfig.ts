/**
 * Secure Configuration Manager
 *
 * This module handles all sensitive configuration in a secure way.
 * NEVER expose sensitive data in client-side code!
 */

/**
 * Configuration that's safe to expose client-side
 */
export const publicConfig = {
  app: {
    name: 'TYT Platform',
    version: '3.0.0',
    environment: import.meta.env.MODE
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  },

  blockchain: {
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '137'),
    network: import.meta.env.VITE_NETWORK || 'polygon',
    explorer: import.meta.env.VITE_POLYGON_EXPLORER || 'https://polygonscan.com'
  },

  contracts: {
    feeConfig: import.meta.env.VITE_CONTRACT_FEE_CONFIG || '',
    charityVault: import.meta.env.VITE_CONTRACT_CHARITY_VAULT || '',
    academyVault: import.meta.env.VITE_CONTRACT_ACADEMY_VAULT || '',
    minerNFT: import.meta.env.VITE_CONTRACT_MINER_NFT || '',
    marketplace: import.meta.env.VITE_CONTRACT_MARKETPLACE || '',
    rewardsMerkle: import.meta.env.VITE_CONTRACT_REWARDS_MERKLE || '',
    veTYT: import.meta.env.VITE_CONTRACT_VETYT || ''
  },

  features: {
    web3Wallets: import.meta.env.VITE_ENABLE_WEB3_WALLETS === 'true',
    custodialWallet: import.meta.env.VITE_ENABLE_CUSTODIAL_WALLET === 'true',
    kyc: import.meta.env.VITE_ENABLE_KYC === 'true',
    fiatOnramp: import.meta.env.VITE_ENABLE_FIAT_ONRAMP === 'true',
    testnetMode: import.meta.env.VITE_ENABLE_TESTNET_MODE === 'true'
  }
} as const;

/**
 * Validate that required configuration is present
 */
export function validateConfig(): void {
  const required = {
    'VITE_SUPABASE_URL': publicConfig.supabase.url,
    'VITE_SUPABASE_ANON_KEY': publicConfig.supabase.anonKey
  };

  const missing: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration:\n${missing.join('\n')}\n\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Check if configuration is production-ready
 */
export function isProductionReady(): boolean {
  return !!(
    publicConfig.contracts.minerNFT &&
    publicConfig.contracts.marketplace &&
    publicConfig.blockchain.rpcUrl &&
    !publicConfig.features.testnetMode
  );
}

/**
 * Get sanitized config for logging
 * NEVER log sensitive data!
 */
export function getSanitizedConfig() {
  return {
    app: publicConfig.app,
    network: publicConfig.blockchain.network,
    chainId: publicConfig.blockchain.chainId,
    hasSupabase: !!publicConfig.supabase.url,
    hasRPC: !!publicConfig.blockchain.rpcUrl,
    hasContracts: !!publicConfig.contracts.minerNFT,
    features: publicConfig.features,
    productionReady: isProductionReady()
  };
}

/**
 * Secure endpoints configuration
 * These should only be used server-side
 */
export const secureEndpoints = {
  // These are public Supabase URLs, safe to use client-side
  supabase: {
    functions: `${publicConfig.supabase.url}/functions/v1`,
    rest: `${publicConfig.supabase.url}/rest/v1`,
    realtime: `${publicConfig.supabase.url}/realtime/v1`
  }
} as const;

/**
 * Rate limiting configuration
 */
export const rateLimits = {
  api: {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  },
  auth: {
    maxRequests: 5,
    windowMs: 300000 // 5 minutes
  },
  transactions: {
    maxRequests: 10,
    windowMs: 60000 // 1 minute
  }
} as const;

/**
 * Security settings
 */
export const securitySettings = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // Session settings
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    renewalThreshold: 24 * 60 * 60 * 1000 // 1 day
  },

  // Transaction limits
  transactions: {
    maxWithdrawalAmount: 100000, // USD
    maxPurchaseAmount: 50000, // USD
    dailyLimit: 100000 // USD
  }
} as const;

// Initialize validation on import
if (typeof window !== 'undefined') {
  try {
    validateConfig();
  } catch (error) {
    console.error('Configuration validation failed:', error);
    // In production, we might want to show an error page
    if (import.meta.env.PROD) {
      // Optionally redirect to error page
      console.error('Critical configuration error. Please contact support.');
    }
  }
}

export default publicConfig;
