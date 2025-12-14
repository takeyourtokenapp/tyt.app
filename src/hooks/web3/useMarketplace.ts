import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { contractAddresses, isContractsConfigured } from '@/lib/web3/config';
import { marketplaceABI } from '@/lib/contracts/abis';
import { parseEther } from 'viem';

export function useMarketplace() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listMiner = async (tokenId: bigint, priceInTYT: string) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.marketplace,
      abi: marketplaceABI,
      functionName: 'listMiner',
      args: [tokenId, parseEther(priceInTYT)]
    });
  };

  const buyMiner = async (listingId: bigint, priceInTYT: string) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.marketplace,
      abi: marketplaceABI,
      functionName: 'buyMiner',
      args: [listingId],
      value: parseEther(priceInTYT)
    });
  };

  const cancelListing = async (listingId: bigint) => {
    if (!isContractsConfigured) {
      throw new Error('Smart contracts not configured');
    }

    return writeContract({
      address: contractAddresses.marketplace,
      abi: marketplaceABI,
      functionName: 'cancelListing',
      args: [listingId]
    });
  };

  return {
    listMiner,
    buyMiner,
    cancelListing,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: hash
  };
}

export function useMarketplaceListing(listingId?: bigint) {
  const { data: listing } = useReadContract({
    address: contractAddresses.marketplace,
    abi: marketplaceABI,
    functionName: 'getListing',
    args: listingId !== undefined ? [listingId] : undefined,
    query: {
      enabled: listingId !== undefined && isContractsConfigured
    }
  });

  return { listing };
}

export function useActiveListingsCount() {
  const { data: count } = useReadContract({
    address: contractAddresses.marketplace,
    abi: marketplaceABI,
    functionName: 'getActiveListingsCount',
    query: {
      enabled: isContractsConfigured
    }
  });

  return { count: count as bigint | undefined };
}
