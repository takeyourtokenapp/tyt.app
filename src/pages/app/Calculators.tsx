import ComingSoon from '@/components/ComingSoon';
import { Calculator } from 'lucide-react';

export default function Calculators() {
  return (
    <ComingSoon
      title="Advanced Calculators"
      description="Powerful calculation tools for mining profitability, VIP benefits, staking returns, and investment projections. Make informed decisions."
      features={[
        'Mining ROI calculator',
        'VIP tier benefits calculator',
        'Staking rewards estimator',
        'Maintenance cost calculator',
        'Break-even analysis tool',
        'Compound interest calculator',
        'Token burn impact simulator',
        'Multi-miner portfolio optimizer',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Calculator}
    />
  );
}
