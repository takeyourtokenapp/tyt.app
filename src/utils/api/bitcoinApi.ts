/**
 * Bitcoin API Integration
 * Использует Blockstream API для работы с Bitcoin mainnet/testnet
 */

import { getRpcUrl, formatAmount, toBaseUnits } from '../../config/blockchainProviders';

export interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface BitcoinTransaction {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      value: number;
      scriptpubkey_address: string;
    };
    scriptsig: string;
    witness: string[];
    sequence: number;
  }>;
  vout: Array<{
    value: number;
    scriptpubkey: string;
    scriptpubkey_address?: string;
    scriptpubkey_type: string;
  }>;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface BitcoinAddressInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

class BitcoinAPI {
  private baseUrl: string;
  private testnet: boolean;

  constructor(testnet = false) {
    this.testnet = testnet;
    this.baseUrl = getRpcUrl('BTC', testnet);
  }

  /**
   * Получить баланс адреса
   */
  async getBalance(address: string): Promise<{ confirmed: number; unconfirmed: number; total: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/address/${address}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: BitcoinAddressInfo = await response.json();

      const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;

      return {
        confirmed,
        unconfirmed,
        total: confirmed + unconfirmed,
      };
    } catch (error) {
      console.error('Bitcoin getBalance error:', error);
      throw error;
    }
  }

  /**
   * Получить UTXO для адреса
   */
  async getUTXOs(address: string): Promise<BitcoinUTXO[]> {
    try {
      const response = await fetch(`${this.baseUrl}/address/${address}/utxo`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const utxos: BitcoinUTXO[] = await response.json();
      return utxos;
    } catch (error) {
      console.error('Bitcoin getUTXOs error:', error);
      throw error;
    }
  }

  /**
   * Получить информацию о транзакции
   */
  async getTransaction(txid: string): Promise<BitcoinTransaction> {
    try {
      const response = await fetch(`${this.baseUrl}/tx/${txid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const tx: BitcoinTransaction = await response.json();
      return tx;
    } catch (error) {
      console.error('Bitcoin getTransaction error:', error);
      throw error;
    }
  }

  /**
   * Получить статус транзакции
   */
  async getTransactionStatus(txid: string): Promise<{
    confirmed: boolean;
    blockHeight?: number;
    blockTime?: number;
    confirmations?: number;
  }> {
    try {
      const tx = await this.getTransaction(txid);

      let confirmations = 0;
      if (tx.status.confirmed && tx.status.block_height) {
        const tipHeight = await this.getTipHeight();
        confirmations = tipHeight - tx.status.block_height + 1;
      }

      return {
        confirmed: tx.status.confirmed,
        blockHeight: tx.status.block_height,
        blockTime: tx.status.block_time,
        confirmations,
      };
    } catch (error) {
      console.error('Bitcoin getTransactionStatus error:', error);
      throw error;
    }
  }

  /**
   * Получить текущую высоту блокчейна
   */
  async getTipHeight(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/blocks/tip/height`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const height = await response.text();
      return parseInt(height, 10);
    } catch (error) {
      console.error('Bitcoin getTipHeight error:', error);
      throw error;
    }
  }

  /**
   * Получить историю транзакций адреса
   */
  async getAddressTransactions(address: string, afterTxid?: string): Promise<BitcoinTransaction[]> {
    try {
      let url = `${this.baseUrl}/address/${address}/txs`;
      if (afterTxid) {
        url += `/chain/${afterTxid}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const txs: BitcoinTransaction[] = await response.json();
      return txs;
    } catch (error) {
      console.error('Bitcoin getAddressTransactions error:', error);
      throw error;
    }
  }

  /**
   * Отправить raw транзакцию
   */
  async broadcastTransaction(txHex: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/tx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: txHex,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Broadcast failed: ${error}`);
      }

      const txid = await response.text();
      return txid;
    } catch (error) {
      console.error('Bitcoin broadcastTransaction error:', error);
      throw error;
    }
  }

  /**
   * Получить рекомендуемую комиссию (sat/vB)
   */
  async getFeeEstimate(): Promise<{
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/fee-estimates`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const estimates = await response.json();

      return {
        fastestFee: estimates['1'] || 20,
        halfHourFee: estimates['3'] || 15,
        hourFee: estimates['6'] || 10,
        economyFee: estimates['12'] || 5,
        minimumFee: estimates['144'] || 1,
      };
    } catch (error) {
      console.error('Bitcoin getFeeEstimate error:', error);
      // Возвращаем разумные дефолтные значения
      return {
        fastestFee: 20,
        halfHourFee: 15,
        hourFee: 10,
        economyFee: 5,
        minimumFee: 1,
      };
    }
  }

  /**
   * Проверить, подтверждена ли транзакция
   */
  async isTransactionConfirmed(txid: string, requiredConfirmations = 1): Promise<boolean> {
    try {
      const status = await this.getTransactionStatus(txid);
      return status.confirmed && (status.confirmations || 0) >= requiredConfirmations;
    } catch (error) {
      console.error('Bitcoin isTransactionConfirmed error:', error);
      return false;
    }
  }

  /**
   * Получить баланс адреса в BTC (не satoshi)
   */
  async getBalanceFormatted(address: string): Promise<{
    confirmed: string;
    unconfirmed: string;
    total: string;
  }> {
    const balance = await this.getBalance(address);
    return {
      confirmed: formatAmount(balance.confirmed, 'BTC'),
      unconfirmed: formatAmount(balance.unconfirmed, 'BTC'),
      total: formatAmount(balance.total, 'BTC'),
    };
  }
}

// Экспортируем singleton инстансы
export const bitcoinMainnet = new BitcoinAPI(false);
export const bitcoinTestnet = new BitcoinAPI(true);

// Экспортируем класс для создания кастомных инстансов
export { BitcoinAPI };
