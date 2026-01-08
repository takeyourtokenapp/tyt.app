import ComingSoon from '@/components/ComingSoon';
import { Vote } from 'lucide-react';

export default function Governance() {
  return (
    <ComingSoon
      title="DAO Governance"
      description="Participate in TYT platform governance. Lock TYT tokens for veTYT voting power and shape the future of the ecosystem."
      features={[
        'Create and vote on proposals',
        'veTYT locking mechanism (1 week to 4 years)',
        'Voting power based on lock duration',
        'Proposal categories (fees, discounts, burns, foundation)',
        'On-chain proposal execution',
        'Delegate voting power',
        'Governance analytics and history',
        'Community discussion forums',
      ]}
      expectedDate="Q3 2026"
      iconComponent={Vote}
    />
  );
}
