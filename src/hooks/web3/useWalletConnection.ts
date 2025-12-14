import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';

export function useWalletConnection() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: polygonAmoy.id
  });

  const isCorrectChain = chain?.id === polygonAmoy.id;

  return {
    address,
    isConnected,
    chain,
    isCorrectChain,
    balance,
    connect: (connectorId?: string) => {
      const connector = connectorId
        ? connectors.find(c => c.id === connectorId)
        : connectors[0];
      if (connector) {
        connect({ connector });
      }
    },
    disconnect,
    connectors,
    isPending
  };
}
