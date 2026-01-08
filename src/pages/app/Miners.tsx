import ComingSoon from '@/components/ComingSoon';
import { Cpu } from 'lucide-react';

export default function Miners() {
  return (
    <ComingSoon
      title="NFT Miners"
      description="Manage your digital mining fleet with powerful NFT-based miners. Monitor performance, track rewards, and optimize your mining operations."
      features={[
        'Real-time mining performance dashboard',
        'NFT miner management and monitoring',
        'Daily Bitcoin rewards tracking',
        'Maintenance fee payment system',
        'Efficiency upgrades and optimization',
        'Detailed miner statistics and analytics',
        'Multi-region mining support',
        'Auto-reinvest configuration',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Cpu}
    />
  );
}
