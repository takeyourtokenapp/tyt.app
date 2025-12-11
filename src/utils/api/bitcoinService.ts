import { bitcoinMainnet, type BitcoinTransaction, type BitcoinUTXO } from './bitcoinApi';
import { supabase } from '../../lib/supabase';

export interface BitcoinAddressInfo {
  id: string;
  address: string;
  addressType: 'legacy' | 'segwit' | 'native_segwit' | 'taproot';
  balanceConfirmed: number;
  balanceUnconfirmed: number;
  balanceTotal: number;
  utxoCount: number;
  txCount: number;
  label?: string;
}

export interface SpendableUTXO {
  id: string;
  txid: string;
  vout: number;
  valueSats: number;
  confirmations: number;
  privacyScore: number;
  scriptPubkey: string;
  addressId: string;
}

export interface BitcoinFeeEstimates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
  mempoolSizeMb?: number;
  mempoolTxCount?: number;
}

export interface TransactionBroadcastResult {
  success: boolean;
  txid?: string;
  error?: string;
}

class BitcoinService {
  async generateDepositAddress(
    userId: string,
    addressType: 'legacy' | 'segwit' | 'native_segwit' | 'taproot' = 'native_segwit',
    label?: string
  ): Promise<BitcoinAddressInfo> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-bitcoin-address', {
        body: {
          userId,
          addressType,
          label,
        },
      });

      if (error) throw error;

      return {
        id: data.id,
        address: data.address,
        addressType: data.address_type,
        balanceConfirmed: data.balance_confirmed || 0,
        balanceUnconfirmed: data.balance_unconfirmed || 0,
        balanceTotal: data.balance_total || 0,
        utxoCount: data.utxo_count || 0,
        txCount: data.tx_count || 0,
        label: data.label,
      };
    } catch (error) {
      console.error('Generate Bitcoin address error:', error);
      throw error;
    }
  }

  async getUserAddresses(userId: string): Promise<BitcoinAddressInfo[]> {
    try {
      const { data, error } = await supabase
        .from('bitcoin_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((addr) => ({
        id: addr.id,
        address: addr.address,
        addressType: addr.address_type,
        balanceConfirmed: addr.balance_confirmed || 0,
        balanceUnconfirmed: addr.balance_unconfirmed || 0,
        balanceTotal: addr.balance_total || 0,
        utxoCount: addr.utxo_count || 0,
        txCount: addr.tx_count || 0,
        label: addr.label,
      }));
    } catch (error) {
      console.error('Get user addresses error:', error);
      throw error;
    }
  }

  async getUserBalance(userId: string): Promise<{
    confirmedSats: number;
    unconfirmedSats: number;
    totalSats: number;
    confirmedBtc: string;
    unconfirmedBtc: string;
    totalBtc: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_user_bitcoin_balance', {
        p_user_id: userId,
      });

      if (error) throw error;

      const result = data[0] || {
        confirmed_sats: 0,
        unconfirmed_sats: 0,
        total_sats: 0,
        confirmed_btc: '0.00000000',
        unconfirmed_btc: '0.00000000',
        total_btc: '0.00000000',
      };

      return {
        confirmedSats: result.confirmed_sats,
        unconfirmedSats: result.unconfirmed_sats,
        totalSats: result.total_sats,
        confirmedBtc: result.confirmed_btc,
        unconfirmedBtc: result.unconfirmed_btc,
        totalBtc: result.total_btc,
      };
    } catch (error) {
      console.error('Get user balance error:', error);
      throw error;
    }
  }

  async syncAddressBalance(addressId: string, address: string): Promise<void> {
    try {
      const balance = await bitcoinMainnet.getBalance(address);
      const utxos = await bitcoinMainnet.getUTXOs(address);

      const { error } = await supabase
        .from('bitcoin_addresses')
        .update({
          balance_confirmed: balance.confirmed,
          balance_unconfirmed: balance.unconfirmed,
          balance_total: balance.total,
          utxo_count: utxos.length,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', addressId);

      if (error) throw error;
    } catch (error) {
      console.error('Sync address balance error:', error);
      throw error;
    }
  }

  async getSpendableUTXOs(
    userId: string,
    minConfirmations: number = 3
  ): Promise<SpendableUTXO[]> {
    try {
      const { data, error } = await supabase.rpc('get_spendable_utxos', {
        p_user_id: userId,
        p_min_confirmations: minConfirmations,
      });

      if (error) throw error;

      return (data || []).map((utxo: any) => ({
        id: utxo.utxo_id,
        txid: utxo.txid,
        vout: utxo.vout,
        valueSats: utxo.value_sats,
        confirmations: utxo.confirmations,
        privacyScore: utxo.privacy_score,
        scriptPubkey: '',
        addressId: '',
      }));
    } catch (error) {
      console.error('Get spendable UTXOs error:', error);
      throw error;
    }
  }

  async getFeeEstimates(): Promise<BitcoinFeeEstimates> {
    try {
      const { data, error } = await supabase
        .from('bitcoin_fee_estimates')
        .select('*')
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        return {
          fastestFee: data.fastest_fee,
          halfHourFee: data.half_hour_fee,
          hourFee: data.hour_fee,
          economyFee: data.economy_fee,
          minimumFee: data.minimum_fee,
          mempoolSizeMb: data.mempool_size_mb,
          mempoolTxCount: data.mempool_tx_count,
        };
      }

      const freshFees = await bitcoinMainnet.getFeeEstimate();

      await supabase.from('bitcoin_fee_estimates').insert({
        fastest_fee: freshFees.fastestFee,
        half_hour_fee: freshFees.halfHourFee,
        hour_fee: freshFees.hourFee,
        economy_fee: freshFees.economyFee,
        minimum_fee: freshFees.minimumFee,
      });

      return freshFees;
    } catch (error) {
      console.error('Get fee estimates error:', error);
      return {
        fastestFee: 20,
        halfHourFee: 15,
        hourFee: 10,
        economyFee: 5,
        minimumFee: 1,
      };
    }
  }

  async createTransaction(params: {
    userId: string;
    toAddress: string;
    amountSats: number;
    feePriority: 'economy' | 'normal' | 'high' | 'custom';
    customFeeRate?: number;
    enableRBF?: boolean;
  }): Promise<{
    success: boolean;
    psbt?: string;
    estimatedFee?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-bitcoin-transaction', {
        body: params,
      });

      if (error) throw error;

      return {
        success: true,
        psbt: data.psbt,
        estimatedFee: data.estimated_fee,
      };
    } catch (error: any) {
      console.error('Create transaction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create transaction',
      };
    }
  }

  async broadcastTransaction(
    userId: string,
    signedPSBT: string
  ): Promise<TransactionBroadcastResult> {
    try {
      const { data, error } = await supabase.functions.invoke('broadcast-bitcoin-transaction', {
        body: {
          userId,
          signedPSBT,
        },
      });

      if (error) throw error;

      return {
        success: true,
        txid: data.txid,
      };
    } catch (error: any) {
      console.error('Broadcast transaction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to broadcast transaction',
      };
    }
  }

  async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    id: string;
    txid: string;
    type: string;
    direction: string;
    amountSats: number;
    feeSats: number;
    status: string;
    confirmations: number;
    createdAt: string;
    confirmedAt?: string;
  }[]> {
    try {
      const { data, error } = await supabase
        .from('bitcoin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return (data || []).map((tx) => ({
        id: tx.id,
        txid: tx.txid,
        type: tx.tx_type,
        direction: tx.direction,
        amountSats: tx.amount_satoshis,
        feeSats: tx.fee_satoshis || 0,
        status: tx.status,
        confirmations: tx.confirmations || 0,
        createdAt: tx.created_at,
        confirmedAt: tx.confirmed_at,
      }));
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  }

  async monitorTransaction(txid: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    blockHeight?: number;
    blockTime?: number;
  }> {
    try {
      const status = await bitcoinMainnet.getTransactionStatus(txid);

      await supabase
        .from('bitcoin_transactions')
        .update({
          is_confirmed: status.confirmed,
          confirmations: status.confirmations || 0,
          block_height: status.blockHeight,
          block_time: status.blockTime ? new Date(status.blockTime * 1000).toISOString() : null,
          status: status.confirmed ? 'confirmed' : 'confirming',
          confirmed_at: status.confirmed ? new Date().toISOString() : null,
        })
        .eq('txid', txid);

      return {
        confirmed: status.confirmed,
        confirmations: status.confirmations || 0,
        blockHeight: status.blockHeight,
        blockTime: status.blockTime,
      };
    } catch (error) {
      console.error('Monitor transaction error:', error);
      throw error;
    }
  }

  satsToBTC(sats: number): string {
    return (sats / 100000000).toFixed(8);
  }

  btcToSats(btc: number): number {
    return Math.round(btc * 100000000);
  }

  formatBitcoinAddress(address: string): string {
    if (address.length <= 20) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }

  estimateTransactionSize(inputCount: number, outputCount: number, addressType: string = 'native_segwit'): number {
    const sizes = {
      legacy: {
        input: 148,
        output: 34,
        overhead: 10,
      },
      segwit: {
        input: 91,
        output: 32,
        overhead: 10.5,
      },
      native_segwit: {
        input: 68,
        output: 31,
        overhead: 10.5,
      },
      taproot: {
        input: 57.5,
        output: 43,
        overhead: 10.5,
      },
    };

    const config = sizes[addressType as keyof typeof sizes] || sizes.native_segwit;

    return Math.ceil(
      config.overhead +
      (inputCount * config.input) +
      (outputCount * config.output)
    );
  }

  calculateFee(txSize: number, feeRate: number): number {
    return Math.ceil(txSize * feeRate);
  }

  estimateWithdrawalFee(
    amountSats: number,
    utxos: SpendableUTXO[],
    feeRate: number,
    changeThreshold: number = 546
  ): {
    totalFee: number;
    inputCount: number;
    outputCount: number;
    hasChange: boolean;
  } {
    let selectedValue = 0;
    let inputCount = 0;

    for (const utxo of utxos) {
      selectedValue += utxo.valueSats;
      inputCount++;

      const outputCount = selectedValue - amountSats > changeThreshold ? 2 : 1;
      const txSize = this.estimateTransactionSize(inputCount, outputCount);
      const fee = this.calculateFee(txSize, feeRate);

      if (selectedValue >= amountSats + fee) {
        return {
          totalFee: fee,
          inputCount,
          outputCount,
          hasChange: outputCount === 2,
        };
      }
    }

    throw new Error('Insufficient funds');
  }
}

export const bitcoinService = new BitcoinService();
