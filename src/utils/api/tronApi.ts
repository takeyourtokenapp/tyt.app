/**
 * TRON API Integration
 * Использует TronGrid API для работы с TRON mainnet/shasta testnet
 * Поддерживает TRC-20 токены (например, USDT-TRC20)
 */

import { getRpcUrl, formatAmount, API_KEYS } from '../../config/blockchainProviders';

export interface TronAccount {
  address: string;
  balance: number;
  create_time: number;
  latest_opration_time: number;
  account_resource?: {
    energy_usage: number;
    frozen_balance_for_energy: {
      frozen_balance: number;
      expire_time: number;
    };
    latest_consume_time_for_energy: number;
  };
  assetV2?: Array<{
    key: string;
    value: number;
  }>;
  free_asset_net_usageV2?: Array<{
    key: string;
    value: number;
  }>;
}

export interface TronTransaction {
  ret: Array<{
    contractRet: string;
    fee?: number;
  }>;
  signature: string[];
  txID: string;
  raw_data: {
    contract: Array<{
      parameter: {
        value: any;
        type_url: string;
      };
      type: string;
    }>;
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    timestamp: number;
    fee_limit?: number;
  };
  raw_data_hex: string;
}

export interface TronTransactionInfo {
  id: string;
  blockNumber: number;
  blockTimeStamp: number;
  contractResult?: string[];
  contract_address?: string;
  receipt: {
    energy_fee?: number;
    energy_usage_total?: number;
    net_usage?: number;
    result?: string;
  };
  log?: Array<{
    address: string;
    topics: string[];
    data: string;
  }>;
  result?: string;
  resMessage?: string;
}

class TronAPI {
  private baseUrl: string;
  private apiKey: string;
  private testnet: boolean;

  constructor(testnet = false) {
    this.testnet = testnet;
    this.baseUrl = getRpcUrl('TRX', testnet);
    this.apiKey = API_KEYS.TRONGRID_API_KEY;
  }

  /**
   * API вызов
   */
  private async apiCall(endpoint: string, method = 'GET', body?: any): Promise<any> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'TRON-PRO-API-KEY': this.apiKey }),
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`TRON API ${endpoint} error:`, error);
      throw error;
    }
  }

  /**
   * Получить информацию об аккаунте
   */
  async getAccount(address: string): Promise<TronAccount | null> {
    const data = await this.apiCall(`/v1/accounts/${address}`);
    return data.data?.[0] || null;
  }

  /**
   * Получить баланс TRX адреса
   */
  async getBalance(address: string): Promise<number> {
    const account = await this.getAccount(address);
    return account?.balance || 0; // в SUN (1 TRX = 1,000,000 SUN)
  }

  /**
   * Получить баланс TRX адреса (в TRX)
   */
  async getBalanceFormatted(address: string): Promise<string> {
    const balanceSun = await this.getBalance(address);
    return formatAmount(balanceSun, 'TRX');
  }

  /**
   * Получить информацию о транзакции
   */
  async getTransaction(txID: string): Promise<TronTransaction> {
    return await this.apiCall(`/wallet/gettransactionbyid`, 'POST', { value: txID });
  }

  /**
   * Получить информацию о транзакции (детальная)
   */
  async getTransactionInfo(txID: string): Promise<TronTransactionInfo> {
    return await this.apiCall(`/wallet/gettransactioninfobyid`, 'POST', { value: txID });
  }

  /**
   * Проверить, подтверждена ли транзакция
   */
  async isTransactionConfirmed(txID: string): Promise<boolean> {
    try {
      const info = await this.getTransactionInfo(txID);
      return info.result === 'SUCCESS' || info.receipt.result === 'SUCCESS';
    } catch (error) {
      console.error('TRON isTransactionConfirmed error:', error);
      return false;
    }
  }

  /**
   * Получить текущий блок
   */
  async getNowBlock(): Promise<any> {
    return await this.apiCall(`/wallet/getnowblock`, 'POST');
  }

  /**
   * Получить блок по номеру
   */
  async getBlockByNum(blockNum: number): Promise<any> {
    return await this.apiCall(`/wallet/getblockbynum`, 'POST', { num: blockNum });
  }

  /**
   * Отправить подписанную транзакцию
   */
  async broadcastTransaction(signedTransaction: any): Promise<{ result: boolean; txid?: string; message?: string }> {
    return await this.apiCall(`/wallet/broadcasttransaction`, 'POST', signedTransaction);
  }

  /**
   * TRC-20: Получить баланс токена
   */
  async getTRC20Balance(contractAddress: string, ownerAddress: string): Promise<string> {
    try {
      // Вызываем balanceOf(address)
      const functionSelector = 'balanceOf(address)';
      const parameter = ownerAddress.replace(/^(41)/, ''); // Убираем префикс 41 если есть

      const data = await this.apiCall(`/wallet/triggerconstantcontract`, 'POST', {
        owner_address: ownerAddress,
        contract_address: contractAddress,
        function_selector: functionSelector,
        parameter: parameter.padStart(64, '0'),
      });

      if (data.result?.result) {
        // Результат в hex
        const balanceHex = data.constant_result?.[0] || '0';
        return BigInt('0x' + balanceHex).toString();
      }

      return '0';
    } catch (error) {
      console.error('TRON getTRC20Balance error:', error);
      return '0';
    }
  }

  /**
   * TRC-20: Получить информацию о токене
   */
  async getTRC20TokenInfo(contractAddress: string): Promise<{
    name: string;
    symbol: string;
    decimals: number;
  }> {
    try {
      // name()
      const nameData = await this.apiCall(`/wallet/triggerconstantcontract`, 'POST', {
        contract_address: contractAddress,
        function_selector: 'name()',
      });

      // symbol()
      const symbolData = await this.apiCall(`/wallet/triggerconstantcontract`, 'POST', {
        contract_address: contractAddress,
        function_selector: 'symbol()',
      });

      // decimals()
      const decimalsData = await this.apiCall(`/wallet/triggerconstantcontract`, 'POST', {
        contract_address: contractAddress,
        function_selector: 'decimals()',
      });

      return {
        name: this.decodeString(nameData.constant_result?.[0] || ''),
        symbol: this.decodeString(symbolData.constant_result?.[0] || ''),
        decimals: parseInt(decimalsData.constant_result?.[0] || '0', 16),
      };
    } catch (error) {
      console.error('TRON getTRC20TokenInfo error:', error);
      return { name: '', symbol: '', decimals: 0 };
    }
  }

  /**
   * Получить историю транзакций адреса
   */
  async getAddressTransactions(
    address: string,
    options?: {
      limit?: number;
      fingerprint?: string;
      only_confirmed?: boolean;
    }
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        limit: (options?.limit || 20).toString(),
        ...(options?.fingerprint && { fingerprint: options.fingerprint }),
        ...(options?.only_confirmed !== undefined && { only_confirmed: options.only_confirmed.toString() }),
      });

      const data = await this.apiCall(`/v1/accounts/${address}/transactions?${params}`);
      return data.data || [];
    } catch (error) {
      console.error('TRON getAddressTransactions error:', error);
      return [];
    }
  }

  /**
   * TRC-20: Получить историю транзакций токена
   */
  async getTRC20Transactions(
    address: string,
    contractAddress?: string,
    options?: {
      limit?: number;
      fingerprint?: string;
      only_confirmed?: boolean;
    }
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        limit: (options?.limit || 20).toString(),
        ...(contractAddress && { contract_address: contractAddress }),
        ...(options?.fingerprint && { fingerprint: options.fingerprint }),
        ...(options?.only_confirmed !== undefined && { only_confirmed: options.only_confirmed.toString() }),
      });

      const data = await this.apiCall(`/v1/accounts/${address}/transactions/trc20?${params}`);
      return data.data || [];
    } catch (error) {
      console.error('TRON getTRC20Transactions error:', error);
      return [];
    }
  }

  /**
   * Получить account resources (energy, bandwidth)
   */
  async getAccountResources(address: string): Promise<{
    freeNetLimit: number;
    freeNetUsed: number;
    energyLimit: number;
    energyUsed: number;
  }> {
    try {
      const data = await this.apiCall(`/wallet/getaccountresource`, 'POST', { address });

      return {
        freeNetLimit: data.freeNetLimit || 0,
        freeNetUsed: data.freeNetUsed || 0,
        energyLimit: data.EnergyLimit || 0,
        energyUsed: data.EnergyUsed || 0,
      };
    } catch (error) {
      console.error('TRON getAccountResources error:', error);
      return {
        freeNetLimit: 0,
        freeNetUsed: 0,
        energyLimit: 0,
        energyUsed: 0,
      };
    }
  }

  /**
   * Декодировать строку из HEX
   */
  private decodeString(hex: string): string {
    if (!hex) return '';

    try {
      // Убираем первые 64 символа (offset) и следующие 64 (length)
      const data = hex.slice(128);
      let str = '';
      for (let i = 0; i < data.length; i += 2) {
        const code = parseInt(data.substr(i, 2), 16);
        if (code !== 0) str += String.fromCharCode(code);
      }
      return str.trim();
    } catch (error) {
      console.error('Error decoding string:', error);
      return '';
    }
  }

  /**
   * Конвертировать hex адрес в base58
   */
  hexToBase58(hexAddress: string): string {
    // Простая реализация - в продакшене использовать TronWeb
    // Здесь возвращаем как есть
    return hexAddress;
  }

  /**
   * Конвертировать base58 адрес в hex
   */
  base58ToHex(base58Address: string): string {
    // Простая реализация - в продакшене использовать TronWeb
    // Здесь возвращаем как есть
    return base58Address;
  }
}

// Экспортируем singleton инстансы
export const tronMainnet = new TronAPI(false);
export const tronTestnet = new TronAPI(true);

// Экспортируем класс
export { TronAPI };

// Популярные TRC-20 токены
export const TRON_TOKENS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT-TRC20
  USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', // USDC-TRC20
};
