import ComingSoon from '@/components/ComingSoon';
import { ShoppingBag } from 'lucide-react';

export default function Marketplace() {
  return (
    <ComingSoon
      title="NFT Marketplace"
      description="Buy, sell, and trade NFT miners in a secure peer-to-peer marketplace. Find the perfect miners to expand your mining operation."
      features={[
        'Browse and search NFT miner listings',
        'Advanced filtering (TH/s, efficiency, price, region)',
        'Secure escrow-based transactions',
        'Competitive pricing and auctions',
        'Instant listing and delisting',
        'Transaction history and analytics',
        'Creator royalties and platform fees',
        'TYT-only payment system',
      ]}
      expectedDate="Q2 2026"
      iconComponent={ShoppingBag}
    />
  );
}
