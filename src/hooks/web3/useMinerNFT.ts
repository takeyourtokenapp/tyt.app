import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddresses, isContractsConfigured } from '@/lib/web3/config';
import { minerNFTABI } from '@/lib/contracts/abis';

export function useMinerNFT() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintMiner = async (params: {
    to: string;
    powerTH: number;
    efficiencyWTH: number;
    region: string;
  }) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.minerNFT,
      abi: minerNFTABI,
      functionName: 'mint',
      args: [params.to, params.powerTH, params.efficiencyWTH, params.region]
    });
  };

  const upgradeMiner = async (tokenId: bigint, newPowerTH: number) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.minerNFT,
      abi: minerNFTABI,
      functionName: 'upgradePower',
      args: [tokenId, newPowerTH]
    });
  };

  return {
    mintMiner,
    upgradeMiner,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash
  };
}

export function useMinerBalance(address?: `0x${string}`) {
  const { data: balance } = useReadContract({
    address: contractAddresses.minerNFT,
    abi: minerNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isContractsConfigured
    }
  });

  return { balance: balance as bigint | undefined };
}

export function useMinerMetadata(tokenId?: bigint) {
  const { data: metadata } = useReadContract({
    address: contractAddresses.minerNFT,
    abi: minerNFTABI,
    functionName: 'getMinerMetadata',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && isContractsConfigured
    }
  });

  return { metadata };
}
