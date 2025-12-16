import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type WalletCurrency = 'BTC' | 'TYT' | 'USDT' | 'TRX' | 'ETH' | 'SOL';

export interface CustodialWallet {
  id: string;
  user_id: string;
  currency: WalletCurrency;
  balance: number;
  locked_balance: number;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useWallets() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<CustodialWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWallets([]);
      setLoading(false);
      return;
    }

    fetchWallets();

    const channel = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custodial_wallets',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchWallets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', user!.id)
        .order('currency', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setWallets(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallets';
      setError(message);
      console.error('Wallets fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWalletByCurrency = (currency: WalletCurrency): CustodialWallet | undefined => {
    return wallets.find((w) => w.currency === currency);
  };

  const getTotalBalance = (currency: WalletCurrency): number => {
    const wallet = getWalletByCurrency(currency);
    return wallet ? wallet.balance : 0;
  };

  const getAvailableBalance = (currency: WalletCurrency): number => {
    const wallet = getWalletByCurrency(currency);
    return wallet ? wallet.balance - wallet.locked_balance : 0;
  };

  const refreshWallets = () => {
    if (user) {
      fetchWallets();
    }
  };

  return {
    wallets,
    loading,
    error,
    getWalletByCurrency,
    getTotalBalance,
    getAvailableBalance,
    refreshWallets,
  };
}
