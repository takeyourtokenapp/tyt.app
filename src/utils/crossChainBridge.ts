import { BlockchainNetwork } from '../contexts/MultiChainWeb3Context';
import { supabase } from '../lib/supabase';

export interface BridgeQuote {
  fromChain: BlockchainNetwork;
  toChain: BlockchainNetwork;
  token: string;
  amount: number;
  bridgeFee: number;
  estimatedTime: string;
  provider: string;
}

export interface BridgeResult {
  success: boolean;
  transferId?: string;
  sourceTxHash?: string;
  error?: string;
}

export const BRIDGE_PROVIDERS = {
  wormhole: {
    name: 'Wormhole',
    supportedChains: ['solana', 'ethereum', 'bsc', 'polygon'],
    baseFee: 0.001
  },
  multichain: {
    name: 'Multichain',
    supportedChains: ['ethereum', 'bsc', 'polygon', 'tron'],
    baseFee: 0.002
  },
  celer: {
    name: 'Celer cBridge',
    supportedChains: ['solana', 'ethereum', 'bsc', 'polygon'],
    baseFee: 0.0015
  }
};

export async function getBridgeQuote(
  fromChain: BlockchainNetwork,
  toChain: BlockchainNetwork,
  token: string,
  amount: number
): Promise<BridgeQuote | null> {
  if (fromChain === toChain) {
    return null;
  }

  const provider = selectBestProvider(fromChain, toChain);
  if (!provider) {
    return null;
  }

  const bridgeFee = calculateBridgeFee(amount, provider);
  const estimatedTime = estimateBridgeTime(fromChain, toChain);

  return {
    fromChain,
    toChain,
    token,
    amount,
    bridgeFee,
    estimatedTime,
    provider: provider.name
  };
}

function selectBestProvider(
  fromChain: BlockchainNetwork,
  toChain: BlockchainNetwork
): typeof BRIDGE_PROVIDERS[keyof typeof BRIDGE_PROVIDERS] | null {
  for (const provider of Object.values(BRIDGE_PROVIDERS)) {
    if (
      provider.supportedChains.includes(fromChain) &&
      provider.supportedChains.includes(toChain)
    ) {
      return provider;
    }
  }
  return null;
}

function calculateBridgeFee(
  amount: number,
  provider: typeof BRIDGE_PROVIDERS[keyof typeof BRIDGE_PROVIDERS]
): number {
  const percentageFee = amount * 0.001;
  return Math.max(percentageFee, provider.baseFee);
}

function estimateBridgeTime(
  fromChain: BlockchainNetwork,
  toChain: BlockchainNetwork
): string {
  const timeMap: Record<string, string> = {
    'solana-ethereum': '10-15 minutes',
    'solana-bsc': '10-15 minutes',
    'solana-polygon': '8-12 minutes',
    'ethereum-bsc': '5-10 minutes',
    'ethereum-polygon': '5-10 minutes',
    'ethereum-tron': '15-20 minutes',
    'bsc-polygon': '5-8 minutes',
    'bsc-tron': '12-18 minutes',
    'polygon-tron': '12-18 minutes'
  };

  const key = `${fromChain}-${toChain}`;
  const reverseKey = `${toChain}-${fromChain}`;

  return timeMap[key] || timeMap[reverseKey] || '10-15 minutes';
}

export async function initiateBridgeTransfer(
  userId: string,
  quote: BridgeQuote,
  fromAddress: string,
  toAddress: string,
  provider: any
): Promise<BridgeResult> {
  try {
    const mockSourceTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    const { data: transfer, error } = await supabase
      .from('cross_chain_transfers')
      .insert({
        user_id: userId,
        from_blockchain: quote.fromChain,
        to_blockchain: quote.toChain,
        token_symbol: quote.token,
        amount: quote.amount,
        bridge_fee: quote.bridgeFee,
        from_address: fromAddress,
        to_address: toAddress,
        source_tx_hash: mockSourceTxHash,
        bridge_provider: quote.provider.toLowerCase(),
        status: 'initiated'
      })
      .select()
      .single();

    if (error) throw error;

    setTimeout(async () => {
      await updateBridgeStatus(transfer.id, 'confirmed', mockSourceTxHash);

      setTimeout(async () => {
        const mockDestTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
        await completeBridgeTransfer(transfer.id, mockDestTxHash);
      }, 60000);
    }, 30000);

    return {
      success: true,
      transferId: transfer.id,
      sourceTxHash: mockSourceTxHash
    };
  } catch (error: any) {
    console.error('Error initiating bridge transfer:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function updateBridgeStatus(
  transferId: string,
  status: string,
  sourceTxHash?: string
): Promise<void> {
  await supabase
    .from('cross_chain_transfers')
    .update({
      status,
      ...(sourceTxHash && { source_tx_hash: sourceTxHash })
    })
    .eq('id', transferId);
}

async function completeBridgeTransfer(
  transferId: string,
  destinationTxHash: string
): Promise<void> {
  await supabase
    .from('cross_chain_transfers')
    .update({
      status: 'completed',
      destination_tx_hash: destinationTxHash,
      completed_at: new Date().toISOString()
    })
    .eq('id', transferId);
}

export async function getBridgeTransferStatus(transferId: string) {
  const { data, error } = await supabase
    .from('cross_chain_transfers')
    .select('*')
    .eq('id', transferId)
    .single();

  if (error) {
    console.error('Error fetching bridge transfer:', error);
    return null;
  }

  return data;
}

export async function getUserBridgeHistory(userId: string) {
  const { data, error } = await supabase
    .from('cross_chain_transfers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching bridge history:', error);
    return [];
  }

  return data || [];
}

export function isBridgeSupported(
  fromChain: BlockchainNetwork,
  toChain: BlockchainNetwork
): boolean {
  if (fromChain === toChain) return false;

  const provider = selectBestProvider(fromChain, toChain);
  return provider !== null;
}

export function getSupportedBridgeRoutes(fromChain: BlockchainNetwork): BlockchainNetwork[] {
  const routes: BlockchainNetwork[] = [];
  const allChains: BlockchainNetwork[] = ['solana', 'ethereum', 'bsc', 'polygon', 'tron'];

  for (const toChain of allChains) {
    if (isBridgeSupported(fromChain, toChain)) {
      routes.push(toChain);
    }
  }

  return routes;
}
