import ComingSoon from '@/components/ComingSoon';
import { Flame } from 'lucide-react';

export default function BurnReports() {
  return (
    <ComingSoon
      title="Token Burn Reports"
      description="Track TYT token burns with detailed analytics. View historical burn events, impact on circulating supply, and deflationary metrics."
      features={[
        'Real-time burn event tracking',
        'Historical burn analytics',
        'Circulating supply charts',
        'Burn sources breakdown (maintenance, marketplace, upgrades)',
        'Deflationary impact metrics',
        'Weekly and monthly burn summaries',
        'Burn schedule calendar',
        'Community burn proposals',
      ]}
      expectedDate="Q3 2026"
      iconComponent={Flame}
    />
  );
}
