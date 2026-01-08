import ComingSoon from '@/components/ComingSoon';
import { Heart } from 'lucide-react';

export default function CharityStaking() {
  return (
    <ComingSoon
      title="Charity Staking"
      description="Stake your TYT tokens to support the TYT Children's Brain Cancer Foundation. Earn rewards while contributing to medical research."
      features={[
        'Stake TYT to support charity',
        'Competitive APY rewards',
        'Flexible staking periods',
        'Direct impact tracking',
        'Transparent fund allocation',
        'Staking certificates (NFT)',
        'Monthly foundation reports',
        'Early unstaking options',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Heart}
    />
  );
}
