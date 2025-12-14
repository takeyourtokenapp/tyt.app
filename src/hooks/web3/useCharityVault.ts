import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractAddresses, isContractsConfigured } from '@/lib/web3/config';
import { charityVaultABI } from '@/lib/contracts/abis';
import { parseEther } from 'viem';

export function useCharityVault() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const donate = async (amountInTYT: string) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.charityVault,
      abi: charityVaultABI,
      functionName: 'donate',
      value: parseEther(amountInTYT)
    });
  };

  return {
    donate,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash
  };
}

export function useCharityBalance() {
  const { data: balance, refetch } = useReadContract({
    address: contractAddresses.charityVault,
    abi: charityVaultABI,
    functionName: 'getTotalDonations',
    query: {
      enabled: isContractsConfigured
    }
  });

  return {
    balance: balance as bigint | undefined,
    refetch
  };
}

export function useUserDonations(address?: `0x${string}`) {
  const { data: donations } = useReadContract({
    address: contractAddresses.charityVault,
    abi: charityVaultABI,
    functionName: 'getUserDonations',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isContractsConfigured
    }
  });

  return { donations: donations as bigint | undefined };
}
