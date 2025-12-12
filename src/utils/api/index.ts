/**
 * Blockchain API Integration - Central Export
 * Централизованный экспорт всех blockchain API
 */

// Wallet Ledger Service (Double-Entry)
export * from './walletLedgerService';

// Blockchain Gateway (Multi-Chain)
export * from './blockchainGateway';

// Bitcoin
export * from './bitcoinApi';
export { bitcoinMainnet, bitcoinTestnet, BitcoinAPI } from './bitcoinApi';

// Ethereum
export * from './ethereumApi';
export { ethereumMainnet, ethereumTestnet, EthereumAPI } from './ethereumApi';

// Solana
export * from './solanaApi';
export { solanaMainnet, solanaDevnet, SolanaAPI } from './solanaApi';

// TRON
export * from './tronApi';
export { tronMainnet, tronTestnet, TronAPI, TRON_TOKENS } from './tronApi';

// XRP
export * from './xrpApi';
export { xrpMainnet, xrpTestnet, XRPAPI } from './xrpApi';

// Monitor
export * from './blockchainMonitor';
export { blockchainMonitor, BlockchainMonitor } from './blockchainMonitor';

// Config
export * from '../../config/blockchainProviders';

/**
 * Получить API instance для конкретного блокчейна
 */
import { ChainId } from '../../config/blockchainProviders';
import { bitcoinMainnet } from './bitcoinApi';
import { ethereumMainnet } from './ethereumApi';
import { solanaMainnet } from './solanaApi';
import { tronMainnet } from './tronApi';
import { xrpMainnet } from './xrpApi';

export function getBlockchainAPI(chainId: ChainId, testnet = false) {
  switch (chainId) {
    case 'BTC':
      return testnet ? require('./bitcoinApi').bitcoinTestnet : bitcoinMainnet;
    case 'ETH':
    case 'MATIC':
      return testnet ? require('./ethereumApi').ethereumTestnet : ethereumMainnet;
    case 'SOL':
      return testnet ? require('./solanaApi').solanaDevnet : solanaMainnet;
    case 'TRX':
      return testnet ? require('./tronApi').tronTestnet : tronMainnet;
    case 'XRP':
      return testnet ? require('./xrpApi').xrpTestnet : xrpMainnet;
    default:
      throw new Error(`Unsupported chain: ${chainId}`);
  }
}

/**
 * Получить баланс для любого блокчейна
 */
export async function getBalance(chainId: ChainId, address: string, testnet = false): Promise<string> {
  const api = getBlockchainAPI(chainId, testnet);

  switch (chainId) {
    case 'BTC':
      return api.getBalanceFormatted(address);
    case 'ETH':
    case 'MATIC':
      return api.getBalanceFormatted(address);
    case 'SOL':
      return api.getBalanceFormatted(address);
    case 'TRX':
      return api.getBalanceFormatted(address);
    case 'XRP':
      return api.getBalanceFormatted(address);
    default:
      throw new Error(`Balance check not implemented for ${chainId}`);
  }
}

/**
 * Проверить, подтверждена ли транзакция
 */
export async function isTransactionConfirmed(
  chainId: ChainId,
  txHash: string,
  requiredConfirmations = 1,
  testnet = false
): Promise<boolean> {
  const api = getBlockchainAPI(chainId, testnet);

  switch (chainId) {
    case 'BTC':
      return api.isTransactionConfirmed(txHash, requiredConfirmations);
    case 'ETH':
    case 'MATIC':
      return api.isTransactionConfirmed(txHash, requiredConfirmations);
    case 'SOL':
      return api.isTransactionConfirmed(txHash);
    case 'TRX':
      return api.isTransactionConfirmed(txHash);
    case 'XRP':
      return api.isTransactionConfirmed(txHash);
    default:
      throw new Error(`Transaction check not implemented for ${chainId}`);
  }
}

/**
 * Получить историю транзакций для любого блокчейна
 */
export async function getTransactionHistory(
  chainId: ChainId,
  address: string,
  limit = 10,
  testnet = false
): Promise<any[]> {
  const api = getBlockchainAPI(chainId, testnet);

  switch (chainId) {
    case 'BTC':
      return api.getAddressTransactions(address);
    case 'ETH':
    case 'MATIC':
      return api.getAddressHistory(address);
    case 'SOL':
      return api.getAddressHistory(address, limit);
    case 'TRX':
      return api.getAddressTransactions(address, { limit });
    case 'XRP':
      return api.getAccountTransactions(address, { limit });
    default:
      throw new Error(`Transaction history not implemented for ${chainId}`);
  }
}
