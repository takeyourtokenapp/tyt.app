import ComingSoon from '@/components/ComingSoon';
import { Cpu } from 'lucide-react';

export default function MinerDetail() {
  return (
    <ComingSoon
      title="Miner Details"
      description="Deep dive into individual miner performance with comprehensive analytics, maintenance history, and optimization tools."
      features={[
        'Real-time performance metrics',
        'Historical earnings charts',
        'Maintenance payment history',
        'Efficiency upgrade options',
        'Power consumption analytics',
        'Region and data center info',
        'Predictive ROI calculator',
        'Export and share functionality',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Cpu}
    />
  );
}
