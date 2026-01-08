import ComingSoon from '@/components/ComingSoon';
import { Repeat } from 'lucide-react';

export default function Swap() {
  return (
    <ComingSoon
      title="Token Swap"
      description="Exchange tokens instantly with the best rates from multiple DEX aggregators. Swap TYT, BTC, USDT, and more with minimal slippage."
      features={[
        'Multi-DEX aggregation for best rates',
        'Support for major tokens (TYT, BTC, USDT, ETH)',
        'Real-time price quotes',
        'Slippage protection',
        'One-click token swaps',
        'Gas fee optimization',
        'Swap history and analytics',
        'Price impact warnings',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Repeat}
    />
  );
}
