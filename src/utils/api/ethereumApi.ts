/**
 * Ethereum API Integration
 * Использует JSON-RPC для работы с Ethereum mainnet/testnet
 * Поддерживает ERC-20 токены
 */

import { getRpcUrl, formatAmount, toBaseUnits, API_KEYS } from '../../config/blockchainProviders';

export interface EthereumTransaction {
  hash: string;
  nonce: string;
  blockHash: string | null;
  blockNumber: string | null;
  transactionIndex: string | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gas: string;
  input: string;
  v?: string;
  r?: string;
  s?: string;
}

export interface EthereumTransactionReceipt {
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  to: string | null;
  cumulativeGasUsed: string;
  gasUsed: string;
  contractAddress: string | null;
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    logIndex: string;
    removed: boolean;
  }>;
  status: string;
}

export interface ERC20TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

class EthereumAPI {
  private rpcUrl: string;
  private testnet: boolean;

  constructor(testnet = false) {
    this.testnet = testnet;
    this.rpcUrl = getRpcUrl('ETH', testnet);
  }

  /**
   * JSON-RPC вызов
   */
  private async rpcCall(method: string, params: any[]): Promise<any> {
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
      console.error(`Ethereum RPC ${method} error:`, error);
      throw error;
    }
  }

  /**
   * Получить баланс ETH адреса
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.rpcCall('eth_getBalance', [address, 'latest']);
    return balance; // возвращаем в wei (hex)
  }

  /**
   * Получить баланс ETH адреса (в ETH)
   */
  async getBalanceFormatted(address: string): Promise<string> {
    const balanceWei = await this.getBalance(address);
    const balanceDecimal = parseInt(balanceWei, 16);
    return formatAmount(balanceDecimal, 'ETH');
  }

  /**
   * Получить nonce адреса
   */
  async getTransactionCount(address: string): Promise<number> {
    const nonce = await this.rpcCall('eth_getTransactionCount', [address, 'latest']);
    return parseInt(nonce, 16);
  }

  /**
   * Получить информацию о транзакции
   */
  async getTransaction(txHash: string): Promise<EthereumTransaction | null> {
    return await this.rpcCall('eth_getTransactionByHash', [txHash]);
  }

  /**
   * Получить receipt транзакции
   */
  async getTransactionReceipt(txHash: string): Promise<EthereumTransactionReceipt | null> {
    return await this.rpcCall('eth_getTransactionReceipt', [txHash]);
  }

  /**
   * Проверить, подтверждена ли транзакция
   */
  async isTransactionConfirmed(txHash: string, requiredConfirmations = 1): Promise<boolean> {
    try {
      const receipt = await this.getTransactionReceipt(txHash);
      if (!receipt || !receipt.blockNumber) return false;

      const currentBlock = await this.getBlockNumber();
      const txBlock = parseInt(receipt.blockNumber, 16);
      const confirmations = currentBlock - txBlock + 1;

      return confirmations >= requiredConfirmations && receipt.status === '0x1';
    } catch (error) {
      console.error('Ethereum isTransactionConfirmed error:', error);
      return false;
    }
  }

  /**
   * Получить номер текущего блока
   */
  async getBlockNumber(): Promise<number> {
    const blockNumber = await this.rpcCall('eth_blockNumber', []);
    return parseInt(blockNumber, 16);
  }

  /**
   * Получить цену газа
   */
  async getGasPrice(): Promise<string> {
    return await this.rpcCall('eth_gasPrice', []);
  }

  /**
   * Получить цену газа (в Gwei)
   */
  async getGasPriceFormatted(): Promise<string> {
    const gasPriceWei = await this.getGasPrice();
    const gasPriceDecimal = parseInt(gasPriceWei, 16);
    return (gasPriceDecimal / 1e9).toFixed(2); // Convert to Gwei
  }

  /**
   * Оценить газ для транзакции
   */
  async estimateGas(transaction: {
    from: string;
    to: string;
    value?: string;
    data?: string;
  }): Promise<string> {
    return await this.rpcCall('eth_estimateGas', [transaction]);
  }

  /**
   * Отправить подписанную транзакцию
   */
  async sendRawTransaction(signedTx: string): Promise<string> {
    return await this.rpcCall('eth_sendRawTransaction', [signedTx]);
  }

  /**
   * Получить код контракта
   */
  async getCode(address: string): Promise<string> {
    return await this.rpcCall('eth_getCode', [address, 'latest']);
  }

  /**
   * Проверить, является ли адрес контрактом
   */
  async isContract(address: string): Promise<boolean> {
    const code = await this.getCode(address);
    return code !== '0x' && code !== '0x0';
  }

  /**
   * ERC-20: Получить баланс токена
   */
  async getERC20Balance(tokenAddress: string, walletAddress: string): Promise<string> {
    // balanceOf(address) = 0x70a08231
    const data = '0x70a08231' + walletAddress.slice(2).padStart(64, '0');

    const balance = await this.rpcCall('eth_call', [
      {
        to: tokenAddress,
        data,
      },
      'latest',
    ]);

    return balance;
  }

  /**
   * ERC-20: Получить информацию о токене
   */
  async getERC20TokenInfo(tokenAddress: string): Promise<ERC20TokenInfo> {
    // name() = 0x06fdde03
    const nameData = '0x06fdde03';
    const nameHex = await this.rpcCall('eth_call', [{ to: tokenAddress, data: nameData }, 'latest']);

    // symbol() = 0x95d89b41
    const symbolData = '0x95d89b41';
    const symbolHex = await this.rpcCall('eth_call', [{ to: tokenAddress, data: symbolData }, 'latest']);

    // decimals() = 0x313ce567
    const decimalsData = '0x313ce567';
    const decimalsHex = await this.rpcCall('eth_call', [{ to: tokenAddress, data: decimalsData }, 'latest']);

    // totalSupply() = 0x18160ddd
    const totalSupplyData = '0x18160ddd';
    const totalSupplyHex = await this.rpcCall('eth_call', [
      { to: tokenAddress, data: totalSupplyData },
      'latest',
    ]);

    return {
      name: this.decodeString(nameHex),
      symbol: this.decodeString(symbolHex),
      decimals: parseInt(decimalsHex, 16),
      totalSupply: totalSupplyHex,
    };
  }

  /**
   * ERC-20: Получить форматированный баланс токена
   */
  async getERC20BalanceFormatted(tokenAddress: string, walletAddress: string): Promise<string> {
    const balance = await this.getERC20Balance(tokenAddress, walletAddress);
    const tokenInfo = await this.getERC20TokenInfo(tokenAddress);

    const balanceDecimal = parseInt(balance, 16);
    return (balanceDecimal / Math.pow(10, tokenInfo.decimals)).toFixed(tokenInfo.decimals);
  }

  /**
   * Декодировать строку из HEX
   */
  private decodeString(hex: string): string {
    if (!hex || hex === '0x') return '';

    try {
      // Убираем 0x и первые 64 символа (offset)
      const data = hex.slice(2 + 128);
      // Конвертируем hex в строку
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
   * Получить последние блоки
   */
  async getLatestBlocks(count = 10): Promise<any[]> {
    const currentBlock = await this.getBlockNumber();
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const blockNumber = '0x' + (currentBlock - i).toString(16);
      const block = await this.rpcCall('eth_getBlockByNumber', [blockNumber, false]);
      blocks.push(block);
    }

    return blocks;
  }

  /**
   * Получить историю транзакций адреса (требует Alchemy/Infura)
   */
  async getAddressHistory(address: string, fromBlock = '0x0', toBlock = 'latest'): Promise<any[]> {
    try {
      // Используем Alchemy API для получения истории
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock,
              toBlock,
              fromAddress: address,
              category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
            },
          ],
          id: 1,
        }),
      });

      const data = await response.json();
      return data.result?.transfers || [];
    } catch (error) {
      console.error('Ethereum getAddressHistory error:', error);
      return [];
    }
  }
}

// Экспортируем singleton инстансы
export const ethereumMainnet = new EthereumAPI(false);
export const ethereumTestnet = new EthereumAPI(true);

// Экспортируем класс
export { EthereumAPI };
