/**
 * Environment Variables Validator
 *
 * Validates that all required environment variables are present
 * and properly formatted before the app starts.
 *
 * This prevents runtime errors from missing configuration.
 */

interface EnvConfig {
  name: string;
  required: boolean;
  validator?: (value: string) => boolean;
  description?: string;
}

const ENV_CONFIG: EnvConfig[] = [
  // Supabase (REQUIRED)
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    validator: (v) => v.startsWith('https://'),
    description: 'Supabase project URL'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    validator: (v) => v.length > 100,
    description: 'Supabase anonymous key'
  },

  // Blockchain (REQUIRED for production)
  {
    name: 'VITE_POLYGON_RPC_URL',
    required: false,
    validator: (v) => v.startsWith('https://'),
    description: 'Polygon RPC endpoint'
  },
  {
    name: 'VITE_ALCHEMY_API_KEY',
    required: false,
    validator: (v) => v.length > 20,
    description: 'Alchemy API key'
  },

  // Smart Contracts (REQUIRED after deployment)
  {
    name: 'VITE_CONTRACT_MINER_NFT',
    required: false,
    validator: (v) => /^0x[a-fA-F0-9]{40}$/.test(v),
    description: 'MinerNFT contract address'
  },
  {
    name: 'VITE_CONTRACT_MARKETPLACE',
    required: false,
    validator: (v) => /^0x[a-fA-F0-9]{40}$/.test(v),
    description: 'Marketplace contract address'
  },

  // Feature flags
  {
    name: 'VITE_ENABLE_WEB3_WALLETS',
    required: false,
    validator: (v) => ['true', 'false'].includes(v),
    description: 'Enable Web3 wallet connections'
  },
  {
    name: 'VITE_ENABLE_TESTNET_MODE',
    required: false,
    validator: (v) => ['true', 'false'].includes(v),
    description: 'Enable testnet mode'
  }
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, string>;
}

/**
 * Validate all environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, string> = {};

  for (const envVar of ENV_CONFIG) {
    const value = import.meta.env[envVar.name];

    // Check if required variable exists
    if (envVar.required && !value) {
      errors.push(
        `Missing required environment variable: ${envVar.name}${
          envVar.description ? ` (${envVar.description})` : ''
        }`
      );
      continue;
    }

    // If variable exists, validate format
    if (value) {
      if (envVar.validator && !envVar.validator(value)) {
        errors.push(
          `Invalid format for ${envVar.name}${
            envVar.description ? ` (${envVar.description})` : ''
          }`
        );
      }
      config[envVar.name] = value;
    } else if (!envVar.required) {
      warnings.push(
        `Optional environment variable not set: ${envVar.name}${
          envVar.description ? ` (${envVar.description})` : ''
        }`
      );
    }
  }

  // Additional validation rules
  validateAdditionalRules(config, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config
  };
}

/**
 * Additional validation rules
 */
function validateAdditionalRules(
  config: Record<string, string>,
  errors: string[],
  warnings: string[]
): void {
  // Check if production mode has necessary configs
  if (import.meta.env.PROD) {
    if (!config.VITE_POLYGON_RPC_URL) {
      errors.push('Production mode requires VITE_POLYGON_RPC_URL');
    }
    if (!config.VITE_CONTRACT_MINER_NFT) {
      warnings.push('Production mode should have VITE_CONTRACT_MINER_NFT');
    }
  }

  // Check if Web3 is enabled but no RPC
  if (config.VITE_ENABLE_WEB3_WALLETS === 'true' && !config.VITE_POLYGON_RPC_URL) {
    warnings.push('Web3 wallets enabled but no RPC URL configured');
  }

  // Check if testnet mode in production
  if (import.meta.env.PROD && config.VITE_ENABLE_TESTNET_MODE === 'true') {
    warnings.push('WARNING: Testnet mode enabled in production build');
  }
}

/**
 * Log validation results
 */
export function logValidationResults(result: ValidationResult): void {
  console.group('🔒 Environment Validation');

  if (result.valid) {
    console.log('✅ All required environment variables are configured');
  } else {
    console.error('❌ Environment validation failed');
  }

  if (result.errors.length > 0) {
    console.group('❌ Errors');
    result.errors.forEach(error => console.error(`  - ${error}`));
    console.groupEnd();
  }

  if (result.warnings.length > 0) {
    console.group('⚠️  Warnings');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Initialize environment validation
 * Call this at app startup
 */
export function initEnvValidation(): void {
  const result = validateEnv();
  logValidationResults(result);

  // In production, throw error if validation fails
  if (!result.valid && import.meta.env.PROD) {
    throw new Error(
      'Environment validation failed. Check console for details.\n' +
      result.errors.join('\n')
    );
  }
}

/**
 * Get environment info (safe for logging)
 */
export function getEnvInfo(): Record<string, any> {
  return {
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    dev: import.meta.env.DEV,
    ssr: import.meta.env.SSR,
    // Add more safe info
    hasSupabase: !!import.meta.env.VITE_SUPABASE_URL,
    hasRPC: !!import.meta.env.VITE_POLYGON_RPC_URL,
    hasContracts: !!import.meta.env.VITE_CONTRACT_MINER_NFT,
    web3Enabled: import.meta.env.VITE_ENABLE_WEB3_WALLETS === 'true',
    testnetMode: import.meta.env.VITE_ENABLE_TESTNET_MODE === 'true'
  };
}

/**
 * Check if in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Get safe Supabase URL (without credentials)
 */
export function getSafeSupabaseURL(): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return 'not-configured';

  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return 'invalid-url';
  }
}
