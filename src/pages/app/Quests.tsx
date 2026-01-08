import ComingSoon from '@/components/ComingSoon';
import { Target } from 'lucide-react';

export default function Quests() {
  return (
    <ComingSoon
      title="Quest System"
      description="Complete exciting quests to earn XP, TYT tokens, and unlock exclusive rewards. Engage with the platform and community to level up your owl rank."
      features={[
        'Daily and weekly quest challenges',
        'Platform action quests (trade, stake, refer)',
        'Social engagement quests (Twitter, Telegram)',
        'Educational quests (Academy completion)',
        'Community quests (clan activities)',
        'XP and TYT token rewards',
        'Achievement tracking and badges',
        'Repeatable quest system',
      ]}
      expectedDate="Q2 2026"
      iconComponent={Target}
    />
  );
}
