import ComingSoon from '@/components/ComingSoon';
import { ArrowLeftRight } from 'lucide-react';

export default function Bridge() {
  return (
    <ComingSoon
      title="Cross-Chain Bridge"
      description="Seamlessly transfer assets between different blockchain networks. Bridge your tokens across EVM chains, Solana, and more."
      features={[
        'Multi-chain support (Ethereum, Polygon, BSC, Solana)',
        'TYT token bridging',
        'Wrapped Bitcoin (wBTC) transfers',
        'Secure bridge smart contracts',
        'Real-time transaction tracking',
        'Automatic gas fee estimation',
        'Bridge history and analytics',
        'Competitive bridge fees',
      ]}
      expectedDate="Q3 2026"
      iconComponent={ArrowLeftRight}
    />
  );
}
