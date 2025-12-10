import { BlockchainNetwork } from '../contexts/MultiChainWeb3Context';
import { supabase } from '../lib/supabase';

export interface FiatRampQuote {
  type: 'buy' | 'sell';
  fiatCurrency: string;
  fiatAmount: number;
  cryptoCurrency: string;
  cryptoAmount: number;
  rate: number;
  fee: number;
  total: number;
  provider: string;
}

export interface FiatRampResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
}

export const FIAT_PROVIDERS = {
  moonpay: {
    name: 'MoonPay',
    supportedFiat: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    supportedCrypto: ['SOL', 'ETH', 'BNB', 'MATIC', 'TRX', 'USDC', 'USDT'],
    buyFee: 4.5,
    sellFee: 4.5,
    minBuy: 30,
    maxBuy: 10000
  },
  transak: {
    name: 'Transak',
    supportedFiat: ['USD', 'EUR', 'GBP', 'INR', 'BRL'],
    supportedCrypto: ['SOL', 'ETH', 'BNB', 'MATIC', 'USDC', 'USDT'],
    buyFee: 3.99,
    sellFee: 3.99,
    minBuy: 20,
    maxBuy: 50000
  },
  ramp: {
    name: 'Ramp Network',
    supportedFiat: ['USD', 'EUR', 'GBP'],
    supportedCrypto: ['SOL', 'ETH', 'BNB', 'MATIC', 'USDC'],
    buyFee: 2.9,
    sellFee: 2.9,
    minBuy: 50,
    maxBuy: 20000
  }
};

export const CRYPTO_FIAT_RATES: Record<string, number> = {
  SOL: 95.50,
  ETH: 3250.00,
  BNB: 580.00,
  MATIC: 1.15,
  TRX: 0.15,
  TYT: 0.05,
  USDC: 1.00,
  USDT: 1.00
};

export async function getBuyQuote(
  fiatAmount: number,
  fiatCurrency: string,
  cryptoCurrency: string,
  provider: keyof typeof FIAT_PROVIDERS = 'transak'
): Promise<FiatRampQuote | null> {
  const providerConfig = FIAT_PROVIDERS[provider];

  if (!providerConfig.supportedFiat.includes(fiatCurrency)) {
    return null;
  }

  if (!providerConfig.supportedCrypto.includes(cryptoCurrency)) {
    return null;
  }

  if (fiatAmount < providerConfig.minBuy || fiatAmount > providerConfig.maxBuy) {
    return null;
  }

  const rate = CRYPTO_FIAT_RATES[cryptoCurrency] || 1;
  const fee = (fiatAmount * providerConfig.buyFee) / 100;
  const amountAfterFee = fiatAmount - fee;
  const cryptoAmount = amountAfterFee / rate;

  return {
    type: 'buy',
    fiatCurrency,
    fiatAmount,
    cryptoCurrency,
    cryptoAmount: Math.floor(cryptoAmount * 100000) / 100000,
    rate,
    fee,
    total: fiatAmount,
    provider: providerConfig.name
  };
}

export async function getSellQuote(
  cryptoAmount: number,
  cryptoCurrency: string,
  fiatCurrency: string,
  provider: keyof typeof FIAT_PROVIDERS = 'transak'
): Promise<FiatRampQuote | null> {
  const providerConfig = FIAT_PROVIDERS[provider];

  if (!providerConfig.supportedFiat.includes(fiatCurrency)) {
    return null;
  }

  if (!providerConfig.supportedCrypto.includes(cryptoCurrency)) {
    return null;
  }

  const rate = CRYPTO_FIAT_RATES[cryptoCurrency] || 1;
  const fiatBeforeFee = cryptoAmount * rate;
  const fee = (fiatBeforeFee * providerConfig.sellFee) / 100;
  const fiatAmount = fiatBeforeFee - fee;

  return {
    type: 'sell',
    fiatCurrency,
    fiatAmount: Math.floor(fiatAmount * 100) / 100,
    cryptoCurrency,
    cryptoAmount,
    rate,
    fee,
    total: fiatAmount,
    provider: providerConfig.name
  };
}

export async function initiateBuy(
  userId: string,
  quote: FiatRampQuote,
  blockchain: BlockchainNetwork,
  walletAddress: string,
  paymentMethod: string = 'card'
): Promise<FiatRampResult> {
  try {
    const mockTransactionId = `buy_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const mockPaymentUrl = `https://buy.transak.com/?apiKey=mock&cryptoCurrencyCode=${quote.cryptoCurrency}&fiatAmount=${quote.fiatAmount}&walletAddress=${walletAddress}`;

    const { data: transaction, error } = await supabase
      .from('fiat_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'buy',
        fiat_currency: quote.fiatCurrency,
        fiat_amount: quote.fiatAmount,
        crypto_currency: quote.cryptoCurrency,
        crypto_amount: quote.cryptoAmount,
        blockchain,
        wallet_address: walletAddress,
        payment_method: paymentMethod,
        payment_provider: quote.provider.toLowerCase(),
        provider_transaction_id: mockTransactionId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    setTimeout(async () => {
      await supabase
        .from('fiat_transactions')
        .update({
          status: 'processing'
        })
        .eq('id', transaction.id);

      setTimeout(async () => {
        await supabase
          .from('fiat_transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', transaction.id);
      }, 180000);
    }, 60000);

    return {
      success: true,
      transactionId: transaction.id,
      paymentUrl: mockPaymentUrl
    };
  } catch (error: any) {
    console.error('Error initiating buy:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function initiateSell(
  userId: string,
  quote: FiatRampQuote,
  blockchain: BlockchainNetwork,
  walletAddress: string,
  bankAccount: string
): Promise<FiatRampResult> {
  try {
    const mockTransactionId = `sell_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const { data: transaction, error } = await supabase
      .from('fiat_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'sell',
        fiat_currency: quote.fiatCurrency,
        fiat_amount: quote.fiatAmount,
        crypto_currency: quote.cryptoCurrency,
        crypto_amount: quote.cryptoAmount,
        blockchain,
        wallet_address: walletAddress,
        payment_method: 'bank_transfer',
        payment_provider: quote.provider.toLowerCase(),
        provider_transaction_id: mockTransactionId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    setTimeout(async () => {
      await supabase
        .from('fiat_transactions')
        .update({
          status: 'processing'
        })
        .eq('id', transaction.id);

      setTimeout(async () => {
        await supabase
          .from('fiat_transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', transaction.id);
      }, 300000);
    }, 90000);

    return {
      success: true,
      transactionId: transaction.id
    };
  } catch (error: any) {
    console.error('Error initiating sell:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getFiatTransactionStatus(transactionId: string) {
  const { data, error } = await supabase
    .from('fiat_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }

  return data;
}

export async function getUserFiatHistory(userId: string) {
  const { data, error } = await supabase
    .from('fiat_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching fiat history:', error);
    return [];
  }

  return data || [];
}

export function getSupportedPaymentMethods(type: 'buy' | 'sell'): string[] {
  if (type === 'buy') {
    return ['card', 'bank_transfer', 'apple_pay', 'google_pay'];
  } else {
    return ['bank_transfer'];
  }
}

export function getProviderLimits(provider: keyof typeof FIAT_PROVIDERS) {
  const config = FIAT_PROVIDERS[provider];
  return {
    minBuy: config.minBuy,
    maxBuy: config.maxBuy,
    buyFee: config.buyFee,
    sellFee: config.sellFee
  };
}
