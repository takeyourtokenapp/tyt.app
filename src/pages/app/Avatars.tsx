import ComingSoon from '@/components/ComingSoon';
import { Smile } from 'lucide-react';

export default function Avatars() {
  return (
    <ComingSoon
      title="Custom Avatars"
      description="Create and customize your unique avatar based on your owl rank. Unlock special items, accessories, and limited edition designs."
      features={[
        'Rank-based owl avatars (Worker to Warrior)',
        'Customizable accessories and items',
        'Limited edition collectibles',
        'Achievement-based unlocks',
        'Avatar showcase and gallery',
        'NFT avatar exports',
        'Seasonal avatar themes',
        'Avatar marketplace',
      ]}
      expectedDate="Q4 2026"
      iconComponent={Smile}
    />
  );
}
