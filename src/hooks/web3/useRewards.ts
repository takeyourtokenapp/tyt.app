import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractAddresses, isContractsConfigured } from '@/lib/web3/config';
import { rewardsMerkleABI } from '@/lib/contracts/abis';
import { parseEther } from 'viem';

interface ClaimParams {
  epoch: bigint;
  amount: string;
  proof: `0x${string}`[];
}

export function useRewards() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRewards = async ({ epoch, amount, proof }: ClaimParams) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.rewardsMerkle,
      abi: rewardsMerkleABI,
      functionName: 'claimRewards',
      args: [epoch, parseEther(amount), proof]
    });
  };

  return {
    claimRewards,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash
  };
}

export function useRewardsClaimed(address?: `0x${string}`, epoch?: bigint) {
  const { data: isClaimed } = useReadContract({
    address: contractAddresses.rewardsMerkle,
    abi: rewardsMerkleABI,
    functionName: 'hasClaimed',
    args: address && epoch !== undefined ? [address, epoch] : undefined,
    query: {
      enabled: !!address && epoch !== undefined && isContractsConfigured
    }
  });

  return { isClaimed: isClaimed as boolean | undefined };
}

export function useCurrentEpoch() {
  const { data: epoch } = useReadContract({
    address: contractAddresses.rewardsMerkle,
    abi: rewardsMerkleABI,
    functionName: 'currentEpoch',
    query: {
      enabled: isContractsConfigured
    }
  });

  return { epoch: epoch as bigint | undefined };
}
