/**
 * Blockchain Transaction Monitor
 * Мониторинг входящих транзакций в реальном времени для всех блокчейнов
 */

import { ChainId } from '../../config/blockchainProviders';
import { bitcoinMainnet } from './bitcoinApi';
import { ethereumMainnet } from './ethereumApi';
import { solanaMainnet } from './solanaApi';
import { tronMainnet } from './tronApi';
import { xrpMainnet } from './xrpApi';

export interface MonitoredAddress {
  address: string;
  chainId: ChainId;
  userId: string;
  lastCheckedTxId?: string;
  createdAt: Date;
}

export interface DetectedTransaction {
  txHash: string;
  chainId: ChainId;
  from: string;
  to: string;
  amount: string;
  confirmations: number;
  confirmed: boolean;
  timestamp: Date;
  blockNumber?: number;
}

export type TransactionCallback = (tx: DetectedTransaction, address: MonitoredAddress) => void | Promise<void>;

class BlockchainMonitor {
  private monitoredAddresses: Map<string, MonitoredAddress> = new Map();
  private callbacks: TransactionCallback[] = [];
  private intervalId?: number;
  private checkInterval: number = 30000; // 30 секунд
  private isRunning: boolean = false;

  constructor() {
    // Загрузить из localStorage при инициализации
    this.loadFromStorage();
  }

  /**
   * Добавить адрес для мониторинга
   */
  addAddress(address: string, chainId: ChainId, userId: string): void {
    const key = `${chainId}:${address}`;

    if (this.monitoredAddresses.has(key)) {
      console.log(`Address ${address} on ${chainId} is already being monitored`);
      return;
    }

    const monitoredAddress: MonitoredAddress = {
      address,
      chainId,
      userId,
      createdAt: new Date(),
    };

    this.monitoredAddresses.set(key, monitoredAddress);
    this.saveToStorage();

    console.log(`Started monitoring ${address} on ${chainId} for user ${userId}`);
  }

  /**
   * Удалить адрес из мониторинга
   */
  removeAddress(address: string, chainId: ChainId): void {
    const key = `${chainId}:${address}`;
    this.monitoredAddresses.delete(key);
    this.saveToStorage();

    console.log(`Stopped monitoring ${address} on ${chainId}`);
  }

  /**
   * Добавить callback для обработки обнаруженных транзакций
   */
  onTransaction(callback: TransactionCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Запустить мониторинг
   */
  start(intervalMs?: number): void {
    if (this.isRunning) {
      console.log('Monitor is already running');
      return;
    }

    if (intervalMs) {
      this.checkInterval = intervalMs;
    }

    this.isRunning = true;
    console.log(`Starting blockchain monitor (interval: ${this.checkInterval}ms)`);

    // Первая проверка сразу
    this.checkAllAddresses();

    // Запускаем периодическую проверку
    this.intervalId = window.setInterval(() => {
      this.checkAllAddresses();
    }, this.checkInterval);
  }

  /**
   * Остановить мониторинг
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Monitor is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.isRunning = false;
    console.log('Blockchain monitor stopped');
  }

  /**
   * Проверить все отслеживаемые адреса
   */
  private async checkAllAddresses(): Promise<void> {
    const addresses = Array.from(this.monitoredAddresses.values());

    console.log(`Checking ${addresses.length} monitored addresses...`);

    for (const monitoredAddress of addresses) {
      try {
        await this.checkAddress(monitoredAddress);
      } catch (error) {
        console.error(`Error checking ${monitoredAddress.address} on ${monitoredAddress.chainId}:`, error);
      }
    }
  }

  /**
   * Проверить конкретный адрес
   */
  private async checkAddress(monitoredAddress: MonitoredAddress): Promise<void> {
    const { address, chainId, lastCheckedTxId } = monitoredAddress;

    let newTransactions: DetectedTransaction[] = [];

    switch (chainId) {
      case 'BTC':
        newTransactions = await this.checkBitcoinAddress(address, lastCheckedTxId);
        break;
      case 'ETH':
        newTransactions = await this.checkEthereumAddress(address, lastCheckedTxId);
        break;
      case 'SOL':
        newTransactions = await this.checkSolanaAddress(address, lastCheckedTxId);
        break;
      case 'TRX':
        newTransactions = await this.checkTronAddress(address, lastCheckedTxId);
        break;
      case 'XRP':
        newTransactions = await this.checkXRPAddress(address, lastCheckedTxId);
        break;
      default:
        console.warn(`Monitoring not implemented for chain: ${chainId}`);
    }

    // Обработка новых транзакций
    if (newTransactions.length > 0) {
      console.log(`Found ${newTransactions.length} new transactions for ${address} on ${chainId}`);

      // Обновляем lastCheckedTxId
      monitoredAddress.lastCheckedTxId = newTransactions[0].txHash;
      this.saveToStorage();

      // Вызываем callbacks
      for (const tx of newTransactions) {
        for (const callback of this.callbacks) {
          try {
            await callback(tx, monitoredAddress);
          } catch (error) {
            console.error('Error in transaction callback:', error);
          }
        }
      }
    }
  }

  /**
   * Проверить Bitcoin адрес
   */
  private async checkBitcoinAddress(address: string, lastCheckedTxId?: string): Promise<DetectedTransaction[]> {
    const transactions = await bitcoinMainnet.getAddressTransactions(address);
    const newTxs: DetectedTransaction[] = [];

    for (const tx of transactions) {
      // Останавливаемся, когда достигаем последней проверенной транзакции
      if (lastCheckedTxId && tx.txid === lastCheckedTxId) break;

      // Проверяем, является ли это входящей транзакцией
      const isIncoming = tx.vout.some((output) => output.scriptpubkey_address === address);
      if (!isIncoming) continue;

      // Вычисляем сумму для этого адреса
      const amount = tx.vout
        .filter((output) => output.scriptpubkey_address === address)
        .reduce((sum, output) => sum + output.value, 0);

      const status = await bitcoinMainnet.getTransactionStatus(tx.txid);

      newTxs.push({
        txHash: tx.txid,
        chainId: 'BTC',
        from: tx.vin[0]?.prevout?.scriptpubkey_address || 'unknown',
        to: address,
        amount: amount.toString(),
        confirmations: status.confirmations || 0,
        confirmed: status.confirmed,
        timestamp: new Date((status.blockTime || Date.now() / 1000) * 1000),
        blockNumber: status.blockHeight,
      });
    }

    return newTxs;
  }

  /**
   * Проверить Ethereum адрес
   */
  private async checkEthereumAddress(address: string, lastCheckedTxId?: string): Promise<DetectedTransaction[]> {
    try {
      const history = await ethereumMainnet.getAddressHistory(address);
      const newTxs: DetectedTransaction[] = [];

      for (const transfer of history) {
        if (lastCheckedTxId && transfer.hash === lastCheckedTxId) break;

        // Только входящие транзакции
        if (transfer.to?.toLowerCase() !== address.toLowerCase()) continue;

        newTxs.push({
          txHash: transfer.hash,
          chainId: 'ETH',
          from: transfer.from,
          to: transfer.to,
          amount: transfer.value || '0',
          confirmations: 0, // Alchemy API не возвращает конфирмации
          confirmed: true,
          timestamp: new Date(transfer.metadata?.blockTimestamp || Date.now()),
          blockNumber: parseInt(transfer.blockNum, 16),
        });
      }

      return newTxs;
    } catch (error) {
      console.error('Error checking Ethereum address:', error);
      return [];
    }
  }

  /**
   * Проверить Solana адрес
   */
  private async checkSolanaAddress(address: string, lastCheckedTxId?: string): Promise<DetectedTransaction[]> {
    const signatures = await solanaMainnet.getSignaturesForAddress(address, { limit: 10 });
    const newTxs: DetectedTransaction[] = [];

    for (const sig of signatures) {
      if (lastCheckedTxId && sig.signature === lastCheckedTxId) break;

      const tx = await solanaMainnet.getTransaction(sig.signature);
      if (!tx || tx.meta?.err) continue;

      // Найти изменение баланса для нашего адреса
      const accountIndex = tx.transaction.message.accountKeys.indexOf(address);
      if (accountIndex === -1) continue;

      const preBalance = tx.meta.preBalances[accountIndex];
      const postBalance = tx.meta.postBalances[accountIndex];
      const balanceChange = postBalance - preBalance;

      // Только входящие транзакции
      if (balanceChange <= 0) continue;

      newTxs.push({
        txHash: sig.signature,
        chainId: 'SOL',
        from: tx.transaction.message.accountKeys[0], // Первый аккаунт - отправитель
        to: address,
        amount: balanceChange.toString(),
        confirmations: sig.confirmationStatus === 'finalized' ? 32 : 0,
        confirmed: sig.err === null,
        timestamp: new Date((sig.blockTime || Date.now() / 1000) * 1000),
        blockNumber: sig.slot,
      });
    }

    return newTxs;
  }

  /**
   * Проверить TRON адрес
   */
  private async checkTronAddress(address: string, lastCheckedTxId?: string): Promise<DetectedTransaction[]> {
    const transactions = await tronMainnet.getAddressTransactions(address, { limit: 10 });
    const newTxs: DetectedTransaction[] = [];

    for (const tx of transactions) {
      if (lastCheckedTxId && tx.txID === lastCheckedTxId) break;

      // Только входящие транзакции
      const contract = tx.raw_data.contract[0];
      if (contract.parameter.value.to_address !== address) continue;

      newTxs.push({
        txHash: tx.txID,
        chainId: 'TRX',
        from: contract.parameter.value.owner_address,
        to: contract.parameter.value.to_address,
        amount: contract.parameter.value.amount?.toString() || '0',
        confirmations: tx.ret[0].contractRet === 'SUCCESS' ? 19 : 0,
        confirmed: tx.ret[0].contractRet === 'SUCCESS',
        timestamp: new Date(tx.raw_data.timestamp),
      });
    }

    return newTxs;
  }

  /**
   * Проверить XRP адрес
   */
  private async checkXRPAddress(address: string, lastCheckedTxId?: string): Promise<DetectedTransaction[]> {
    const transactions = await xrpMainnet.getAccountTransactions(address, { limit: 10 });
    const newTxs: DetectedTransaction[] = [];

    for (const tx of transactions) {
      if (lastCheckedTxId && tx.hash === lastCheckedTxId) break;

      // Только входящие транзакции
      if (tx.Destination !== address) continue;

      // Только простые платежи
      if (tx.TransactionType !== 'Payment') continue;

      // Только XRP (не issued currencies)
      const amount = typeof tx.Amount === 'string' ? tx.Amount : '0';

      newTxs.push({
        txHash: tx.hash,
        chainId: 'XRP',
        from: tx.Account,
        to: tx.Destination,
        amount,
        confirmations: tx.validated ? 1 : 0,
        confirmed: tx.validated || false,
        timestamp: new Date((tx.date || 0) * 1000 + 946684800000), // Ripple epoch
        blockNumber: tx.ledger_index,
      });
    }

    return newTxs;
  }

  /**
   * Сохранить в localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.monitoredAddresses.entries());
      localStorage.setItem('tyt_monitored_addresses', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving monitored addresses:', error);
    }
  }

  /**
   * Загрузить из localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('tyt_monitored_addresses');
      if (stored) {
        const data = JSON.parse(stored);
        this.monitoredAddresses = new Map(data);
        console.log(`Loaded ${this.monitoredAddresses.size} monitored addresses from storage`);
      }
    } catch (error) {
      console.error('Error loading monitored addresses:', error);
    }
  }

  /**
   * Получить список отслеживаемых адресов
   */
  getMonitoredAddresses(): MonitoredAddress[] {
    return Array.from(this.monitoredAddresses.values());
  }

  /**
   * Проверить, отслеживается ли адрес
   */
  isMonitoring(address: string, chainId: ChainId): boolean {
    const key = `${chainId}:${address}`;
    return this.monitoredAddresses.has(key);
  }

  /**
   * Очистить все отслеживаемые адреса
   */
  clearAll(): void {
    this.monitoredAddresses.clear();
    this.saveToStorage();
    console.log('Cleared all monitored addresses');
  }
}

// Singleton instance
export const blockchainMonitor = new BlockchainMonitor();

// Экспортируем класс для тестирования
export { BlockchainMonitor };
