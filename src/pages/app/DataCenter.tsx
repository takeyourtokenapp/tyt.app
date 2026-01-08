import ComingSoon from '@/components/ComingSoon';
import { Server } from 'lucide-react';

export default function DataCenter() {
  return (
    <ComingSoon
      title="Data Center Insights"
      description="Explore real-time analytics from TYT mining data centers across the globe. View regional performance, energy efficiency, and network health."
      features={[
        'Global data center map',
        'Real-time mining statistics by region',
        'Energy consumption and efficiency metrics',
        'Network hashrate distribution',
        'Temperature and uptime monitoring',
        'Regional performance comparisons',
        'Data center selection for new miners',
        'Transparent operations reporting',
      ]}
      expectedDate="Q4 2026"
      iconComponent={Server}
    />
  );
}
