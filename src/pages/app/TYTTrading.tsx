import ComingSoon from '@/components/ComingSoon';
import { TrendingUp } from 'lucide-react';

export default function TYTTrading() {
  return (
    <ComingSoon
      title="TYT Trading"
      description="Advanced trading interface for TYT token. Access real-time charts, order books, and professional trading tools."
      features={[
        'Real-time TYT price charts',
        'Advanced order types (limit, market, stop-loss)',
        'Order book and trade history',
        'Technical analysis indicators',
        'Portfolio tracking',
        'Price alerts and notifications',
        'Trading API for automation',
        'Integration with major DEXs',
      ]}
      expectedDate="Q3 2026"
      iconComponent={TrendingUp}
    />
  );
}
