import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  walletService,
  type WalletAccount,
  type LedgerEntry,
  type LedgerEntryType,
} from '../lib/walletService';

export function useWalletLedger(currency?: string) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [ledgerHistory, setLedgerHistory] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLedgerHistory([]);
      setLoading(false);
      return;
    }

    fetchData();

    const unsubscribe = walletService.subscribeToWalletChanges(user.id, () => {
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, [user, currency]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [accountsData, historyData] = await Promise.all([
        walletService.getWalletAccounts(user.id, currency),
        walletService.getLedgerHistory(user.id, {
          currency,
          limit: 50,
        }),
      ]);

      setAccounts(accountsData);
      setLedgerHistory(historyData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet data';
      setError(message);
      console.error('Wallet ledger fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = (currency: string): number => {
    const account = accounts.find(
      (a) => a.account_type === 'user_main' && a.currency === currency
    );
    return account?.balance || 0;
  };

  const getAvailableBalance = (currency: string): number => {
    const account = accounts.find(
      (a) => a.account_type === 'user_main' && a.currency === currency
    );
    if (!account) return 0;
    return account.balance - account.locked_balance;
  };

  const getLockedBalance = (currency: string): number => {
    const account = accounts.find(
      (a) => a.account_type === 'user_main' && a.currency === currency
    );
    return account?.locked_balance || 0;
  };

  const filterByType = (type: LedgerEntryType): LedgerEntry[] => {
    return ledgerHistory.filter((entry) => entry.entry_type === type);
  };

  const getTotalDeposits = (currency: string): number => {
    return ledgerHistory
      .filter((entry) => entry.entry_type === 'deposit' && entry.currency === currency)
      .reduce((sum, entry) => sum + entry.credit, 0);
  };

  const getTotalWithdrawals = (currency: string): number => {
    return ledgerHistory
      .filter((entry) => entry.entry_type === 'withdrawal' && entry.currency === currency)
      .reduce((sum, entry) => sum + entry.debit, 0);
  };

  const getTotalRewards = (currency: string): number => {
    return ledgerHistory
      .filter((entry) => entry.entry_type === 'reward' && entry.currency === currency)
      .reduce((sum, entry) => sum + entry.credit, 0);
  };

  const refresh = () => {
    if (user) {
      fetchData();
    }
  };

  return {
    accounts,
    ledgerHistory,
    loading,
    error,
    getBalance,
    getAvailableBalance,
    getLockedBalance,
    filterByType,
    getTotalDeposits,
    getTotalWithdrawals,
    getTotalRewards,
    refresh,
  };
}
