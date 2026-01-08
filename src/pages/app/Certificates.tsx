import ComingSoon from '@/components/ComingSoon';
import { Award } from 'lucide-react';

export default function Certificates() {
  return (
    <ComingSoon
      title="Achievement Certificates"
      description="Earn beautiful NFT certificates for completing Academy tracks, quests, and platform milestones. Showcase your expertise and dedication."
      features={[
        'NFT-based achievement certificates',
        'Academy course completion certificates',
        'Quest milestone certificates',
        'Platform achievement certificates',
        'On-chain verification',
        'Shareable certificate links',
        'Certificate gallery and showcase',
        'Rare and limited edition certificates',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Award}
    />
  );
}
