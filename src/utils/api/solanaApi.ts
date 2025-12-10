/**
 * Solana API Integration
 * Использует JSON-RPC для работы с Solana mainnet/devnet
 * Поддерживает SPL токены
 */

import { getRpcUrl, formatAmount } from '../../config/blockchainProviders';

export interface SolanaTransaction {
  slot: number;
  transaction: {
    message: {
      accountKeys: string[];
      header: {
        numReadonlySignedAccounts: number;
        numReadonlyUnsignedAccounts: number;
        numRequiredSignatures: number;
      };
      instructions: Array<{
        accounts: number[];
        data: string;
        programIdIndex: number;
      }>;
      recentBlockhash: string;
    };
    signatures: string[];
  };
  meta: {
    err: any | null;
    fee: number;
    innerInstructions: any[];
    logMessages: string[];
    postBalances: number[];
    postTokenBalances: any[];
    preBalances: number[];
    preTokenBalances: any[];
    rewards: any[];
    status: { Ok: null } | { Err: any };
  };
  blockTime?: number;
}

export interface SolanaAccountInfo {
  lamports: number;
  owner: string;
  executable: boolean;
  rentEpoch: number;
  data: [string, string]; // [data, encoding]
}

export interface SPLTokenAccount {
  pubkey: string;
  account: {
    data: {
      parsed: {
        info: {
          isNative: boolean;
          mint: string;
          owner: string;
          state: string;
          tokenAmount: {
            amount: string;
            decimals: number;
            uiAmount: number;
            uiAmountString: string;
          };
        };
        type: string;
      };
      program: string;
      space: number;
    };
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
  };
}

class SolanaAPI {
  private rpcUrl: string;
  private testnet: boolean;

  constructor(testnet = false) {
    this.testnet = testnet;
    this.rpcUrl = getRpcUrl('SOL', testnet);
  }

  /**
   * JSON-RPC вызов
   */
  private async rpcCall(method: string, params: any[] = []): Promise<any> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      return data.result;
    } catch (error) {
      console.error(`Solana RPC ${method} error:`, error);
      throw error;
    }
  }

  /**
   * Получить баланс SOL адреса
   */
  async getBalance(address: string): Promise<number> {
    const result = await this.rpcCall('getBalance', [address]);
    return result.value; // возвращаем в lamports
  }

  /**
   * Получить баланс SOL адреса (в SOL)
   */
  async getBalanceFormatted(address: string): Promise<string> {
    const balanceLamports = await this.getBalance(address);
    return formatAmount(balanceLamports, 'SOL');
  }

  /**
   * Получить информацию об аккаунте
   */
  async getAccountInfo(address: string): Promise<SolanaAccountInfo | null> {
    const result = await this.rpcCall('getAccountInfo', [address, { encoding: 'base64' }]);
    return result.value;
  }

  /**
   * Получить информацию о транзакции
   */
  async getTransaction(signature: string): Promise<SolanaTransaction | null> {
    const result = await this.rpcCall('getTransaction', [signature, { encoding: 'json', maxSupportedTransactionVersion: 0 }]);
    return result;
  }

  /**
   * Проверить статус транзакции
   */
  async getSignatureStatus(signature: string): Promise<{
    slot: number;
    confirmations: number | null;
    err: any | null;
    confirmationStatus?: 'processed' | 'confirmed' | 'finalized';
  } | null> {
    const result = await this.rpcCall('getSignatureStatuses', [[signature]]);
    return result.value[0];
  }

  /**
   * Проверить, подтверждена ли транзакция
   */
  async isTransactionConfirmed(signature: string): Promise<boolean> {
    try {
      const status = await this.getSignatureStatus(signature);
      return status !== null && status.err === null && status.confirmationStatus === 'finalized';
    } catch (error) {
      console.error('Solana isTransactionConfirmed error:', error);
      return false;
    }
  }

  /**
   * Получить номер текущего слота
   */
  async getSlot(): Promise<number> {
    return await this.rpcCall('getSlot', []);
  }

  /**
   * Получить последний блокхеш
   */
  async getLatestBlockhash(): Promise<{
    blockhash: string;
    lastValidBlockHeight: number;
  }> {
    const result = await this.rpcCall('getLatestBlockhash', []);
    return result.value;
  }

  /**
   * Отправить подписанную транзакцию
   */
  async sendTransaction(signedTransaction: string): Promise<string> {
    return await this.rpcCall('sendTransaction', [signedTransaction, { encoding: 'base64' }]);
  }

  /**
   * Получить минимальный баланс для rent exemption
   */
  async getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    return await this.rpcCall('getMinimumBalanceForRentExemption', [dataLength]);
  }

  /**
   * SPL Token: Получить все токен-аккаунты владельца
   */
  async getTokenAccountsByOwner(ownerAddress: string, mint?: string): Promise<SPLTokenAccount[]> {
    const filter = mint
      ? { mint }
      : { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }; // SPL Token Program

    const result = await this.rpcCall('getTokenAccountsByOwner', [
      ownerAddress,
      filter,
      { encoding: 'jsonParsed' },
    ]);

    return result.value;
  }

  /**
   * SPL Token: Получить баланс конкретного токена
   */
  async getSPLTokenBalance(ownerAddress: string, mintAddress: string): Promise<{
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  } | null> {
    try {
      const accounts = await this.getTokenAccountsByOwner(ownerAddress, mintAddress);
      if (accounts.length === 0) return null;

      // Возвращаем баланс первого аккаунта (обычно у пользователя один аккаунт на токен)
      return accounts[0].account.data.parsed.info.tokenAmount;
    } catch (error) {
      console.error('Solana getSPLTokenBalance error:', error);
      return null;
    }
  }

  /**
   * SPL Token: Получить информацию о mint
   */
  async getTokenSupply(mintAddress: string): Promise<{
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  }> {
    const result = await this.rpcCall('getTokenSupply', [mintAddress]);
    return result.value;
  }

  /**
   * Получить историю подписей для адреса
   */
  async getSignaturesForAddress(
    address: string,
    options?: {
      limit?: number;
      before?: string;
      until?: string;
    }
  ): Promise<Array<{
    signature: string;
    slot: number;
    err: any | null;
    memo: string | null;
    blockTime?: number | null;
  }>> {
    const params: any[] = [address];
    if (options) {
      params.push(options);
    }

    return await this.rpcCall('getSignaturesForAddress', params);
  }

  /**
   * Получить историю транзакций адреса
   */
  async getAddressHistory(address: string, limit = 10): Promise<SolanaTransaction[]> {
    try {
      // Получаем подписи
      const signatures = await this.getSignaturesForAddress(address, { limit });

      // Получаем полные транзакции
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            return await this.getTransaction(sig.signature);
          } catch (error) {
            console.error(`Error fetching transaction ${sig.signature}:`, error);
            return null;
          }
        })
      );

      return transactions.filter((tx) => tx !== null) as SolanaTransaction[];
    } catch (error) {
      console.error('Solana getAddressHistory error:', error);
      return [];
    }
  }

  /**
   * Получить version для транзакции
   */
  async getVersion(): Promise<{ 'solana-core': string; 'feature-set': number }> {
    return await this.rpcCall('getVersion', []);
  }

  /**
   * Получить информацию о производительности
   */
  async getRecentPerformanceSamples(limit = 1): Promise<Array<{
    slot: number;
    numTransactions: number;
    numSlots: number;
    samplePeriodSecs: number;
  }>> {
    return await this.rpcCall('getRecentPerformanceSamples', [limit]);
  }

  /**
   * Симулировать транзакцию
   */
  async simulateTransaction(transaction: string): Promise<{
    err: any | null;
    logs: string[];
    accounts: any[] | null;
    unitsConsumed: number;
  }> {
    const result = await this.rpcCall('simulateTransaction', [
      transaction,
      { encoding: 'base64', commitment: 'processed' },
    ]);
    return result.value;
  }

  /**
   * Получить приоритетную комиссию
   */
  async getRecentPrioritizationFees(addresses: string[] = []): Promise<Array<{
    slot: number;
    prioritizationFee: number;
  }>> {
    return await this.rpcCall('getRecentPrioritizationFees', addresses.length > 0 ? [addresses] : []);
  }
}

// Экспортируем singleton инстансы
export const solanaMainnet = new SolanaAPI(false);
export const solanaDevnet = new SolanaAPI(true);

// Экспортируем класс
export { SolanaAPI };
