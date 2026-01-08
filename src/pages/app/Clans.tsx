import ComingSoon from '@/components/ComingSoon';
import { Users } from 'lucide-react';

export default function Clans() {
  return (
    <ComingSoon
      title="Clan System"
      description="Join or create mining clans to compete with other teams. Collaborate on quests, share strategies, and climb the clan leaderboard."
      features={[
        'Create and manage clans',
        'Clan leaderboard and rankings',
        'Team quests and challenges',
        'Shared mining statistics',
        'Clan chat and communication',
        'Exclusive clan rewards',
        'Clan wars and tournaments',
        'Custom clan badges and emblems',
      ]}
      expectedDate="Q3 2026"
      iconComponent={Users}
    />
  );
}
