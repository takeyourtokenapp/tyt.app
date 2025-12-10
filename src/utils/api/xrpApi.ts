/**
 * XRP Ledger API Integration
 * Использует JSON-RPC для работы с XRP Ledger mainnet/testnet
 */

import { getRpcUrl, formatAmount } from '../../config/blockchainProviders';

export interface XRPAccountInfo {
  Account: string;
  Balance: string;
  Flags: number;
  LedgerEntryType: string;
  OwnerCount: number;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  Sequence: number;
  index: string;
}

export interface XRPTransaction {
  Account: string;
  Destination?: string;
  Amount: string | {
    currency: string;
    issuer: string;
    value: string;
  };
  Fee: string;
  Flags: number;
  LastLedgerSequence?: number;
  Sequence: number;
  SigningPubKey: string;
  TransactionType: string;
  TxnSignature: string;
  hash: string;
  date?: number;
  inLedger?: number;
  ledger_index?: number;
  meta?: any;
  validated?: boolean;
}

export interface XRPLedger {
  accepted: boolean;
  account_hash: string;
  close_flags: number;
  close_time: number;
  close_time_human: string;
  close_time_resolution: number;
  closed: boolean;
  hash: string;
  ledger_hash: string;
  ledger_index: string;
  parent_close_time: number;
  parent_hash: string;
  seqNum: string;
  totalCoins: string;
  total_coins: string;
  transaction_hash: string;
}

class XRPAPI {
  private rpcUrl: string;
  private testnet: boolean;

  constructor(testnet = false) {
    this.testnet = testnet;
    this.rpcUrl = getRpcUrl('XRP', testnet);
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
          method,
          params,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.result?.error) throw new Error(data.result.error_message || data.result.error);

      return data.result;
    } catch (error) {
      console.error(`XRP RPC ${method} error:`, error);
      throw error;
    }
  }

  /**
   * Получить информацию об аккаунте
   */
  async getAccountInfo(address: string): Promise<XRPAccountInfo> {
    const result = await this.rpcCall('account_info', [
      {
        account: address,
        ledger_index: 'validated',
      },
    ]);

    return result.account_data;
  }

  /**
   * Получить баланс XRP адреса
   */
  async getBalance(address: string): Promise<string> {
    const accountInfo = await this.getAccountInfo(address);
    return accountInfo.Balance; // в drops (1 XRP = 1,000,000 drops)
  }

  /**
   * Получить баланс XRP адреса (в XRP)
   */
  async getBalanceFormatted(address: string): Promise<string> {
    const balanceDrops = await this.getBalance(address);
    return formatAmount(balanceDrops, 'XRP');
  }

  /**
   * Получить информацию о транзакции
   */
  async getTransaction(txHash: string): Promise<XRPTransaction> {
    const result = await this.rpcCall('tx', [
      {
        transaction: txHash,
        binary: false,
      },
    ]);

    return result;
  }

  /**
   * Проверить, подтверждена ли транзакция
   */
  async isTransactionConfirmed(txHash: string): Promise<boolean> {
    try {
      const tx = await this.getTransaction(txHash);
      return tx.validated === true && tx.meta?.TransactionResult === 'tesSUCCESS';
    } catch (error) {
      console.error('XRP isTransactionConfirmed error:', error);
      return false;
    }
  }

  /**
   * Получить историю транзакций адреса
   */
  async getAccountTransactions(
    address: string,
    options?: {
      limit?: number;
      ledger_index_min?: number;
      ledger_index_max?: number;
      forward?: boolean;
    }
  ): Promise<XRPTransaction[]> {
    try {
      const result = await this.rpcCall('account_tx', [
        {
          account: address,
          ledger_index_min: options?.ledger_index_min || -1,
          ledger_index_max: options?.ledger_index_max || -1,
          limit: options?.limit || 20,
          forward: options?.forward || false,
        },
      ]);

      return result.transactions.map((item: any) => item.tx);
    } catch (error) {
      console.error('XRP getAccountTransactions error:', error);
      return [];
    }
  }

  /**
   * Получить текущий индекс леджера
   */
  async getLedgerIndex(): Promise<number> {
    const result = await this.rpcCall('ledger', [
      {
        ledger_index: 'validated',
      },
    ]);

    return result.ledger_index;
  }

  /**
   * Получить информацию о леджере
   */
  async getLedger(ledgerIndex?: number | string): Promise<XRPLedger> {
    const result = await this.rpcCall('ledger', [
      {
        ledger_index: ledgerIndex || 'validated',
        transactions: false,
        expand: false,
      },
    ]);

    return result.ledger;
  }

  /**
   * Отправить подписанную транзакцию
   */
  async submitTransaction(signedTx: string): Promise<{
    engine_result: string;
    engine_result_code: number;
    engine_result_message: string;
    tx_blob: string;
    tx_json: any;
  }> {
    const result = await this.rpcCall('submit', [
      {
        tx_blob: signedTx,
      },
    ]);

    return result;
  }

  /**
   * Получить комиссию сети
   */
  async getFee(): Promise<{
    current_ledger_size: string;
    current_queue_size: string;
    drops: {
      base_fee: string;
      median_fee: string;
      minimum_fee: string;
      open_ledger_fee: string;
    };
    expected_ledger_size: string;
    ledger_current_index: number;
    levels: {
      median_level: string;
      minimum_level: string;
      open_ledger_level: string;
      reference_level: string;
    };
    max_queue_size: string;
  }> {
    return await this.rpcCall('fee', []);
  }

  /**
   * Проверить существование аккаунта
   */
  async accountExists(address: string): Promise<boolean> {
    try {
      await this.getAccountInfo(address);
      return true;
    } catch (error: any) {
      if (error.message?.includes('actNotFound')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Получить список currencies для аккаунта
   */
  async getAccountCurrencies(address: string): Promise<{
    receive_currencies: string[];
    send_currencies: string[];
  }> {
    const result = await this.rpcCall('account_currencies', [
      {
        account: address,
        ledger_index: 'validated',
      },
    ]);

    return {
      receive_currencies: result.receive_currencies || [],
      send_currencies: result.send_currencies || [],
    };
  }

  /**
   * Получить trust lines (для issued currencies)
   */
  async getAccountLines(address: string, peerAddress?: string): Promise<any[]> {
    const params: any = {
      account: address,
      ledger_index: 'validated',
    };

    if (peerAddress) {
      params.peer = peerAddress;
    }

    const result = await this.rpcCall('account_lines', [params]);
    return result.lines || [];
  }

  /**
   * Получить информацию о сервере
   */
  async getServerInfo(): Promise<any> {
    return await this.rpcCall('server_info', []);
  }

  /**
   * Проверить валидность адреса
   */
  isValidAddress(address: string): boolean {
    // XRP адреса начинаются с 'r' и имеют длину 25-35 символов
    return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
  }

  /**
   * Конвертировать drops в XRP
   */
  dropsToXrp(drops: string | number): string {
    const dropsNum = typeof drops === 'string' ? parseInt(drops, 10) : drops;
    return (dropsNum / 1_000_000).toFixed(6);
  }

  /**
   * Конвертировать XRP в drops
   */
  xrpToDrops(xrp: string | number): string {
    const xrpNum = typeof xrp === 'string' ? parseFloat(xrp) : xrp;
    return Math.floor(xrpNum * 1_000_000).toString();
  }
}

// Экспортируем singleton инстансы
export const xrpMainnet = new XRPAPI(false);
export const xrpTestnet = new XRPAPI(true);

// Экспортируем класс
export { XRPAPI };
