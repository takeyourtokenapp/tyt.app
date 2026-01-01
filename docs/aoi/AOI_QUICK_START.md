# aOi Quick Start Guide

## For Users

### Finding aOi

1. **Log in** to takeyourtoken.app
2. Look for the **avatar in the top-right corner** of the header
3. **Click the avatar** to open the chat widget

### Using aOi Chat

1. **Type your question** in the input box
2. **Press Enter** or click Send
3. **Read the response** - aOi knows about:
   - Mining and NFT miners
   - TYT token features
   - Rewards and earnings
   - Academy lessons
   - Foundation mission
   - Platform features

### Leveling Up

- **Earn XP** by completing lessons and quizzes
- **Watch aOi evolve** through 4 levels:
  - Level 1: Beginner Guide (0-99 XP)
  - Level 2: Explorer Mentor (100-499 XP)
  - Level 3: Builder Advisor (500-1499 XP)
  - Level 4: Guardian Master (1500+ XP)

### Your aOi Profile

Visit `/app/aoi` to see:
- Current level and XP
- Achievements earned
- Evolution timeline
- Links to TYT Foundation

## For Developers

### Basic Integration

```typescript
import { useAoi } from '../contexts/AoiContext';

function MyComponent() {
  const { progress, askAoi, addExperience } = useAoi();

  // Show user's level
  console.log(`Level: ${progress?.level}`);

  // Ask aOi a question
  const answer = await askAoi('What is mining?');

  // Award XP
  await addExperience(10, 'lesson_completed');
}
```

### Using the Avatar

```typescript
import AoiAvatar from '../components/AoiAvatar';

<AoiAvatar
  level={2}
  size="lg"
  showName={true}
  showLevel={true}
  interactive={true}
  onInteract={() => console.log('Clicked!')}
/>
```

### Foundation Links

```typescript
import { useAoi } from '../contexts/AoiContext';

function MyComponent() {
  const { getFoundationLinks } = useAoi();
  const links = getFoundationLinks();

  return (
    <a href={links.home} target="_blank">
      Visit TYT Foundation
    </a>
  );
}
```

### Configuration

Edit `/src/config/aoiConfig.ts` to:
- Change Foundation API endpoint
- Enable/disable features
- Adjust evolution levels
- Customize branding

## Key Files

- `/src/components/AoiAvatar.tsx` - Character display
- `/src/components/AoiChatWidget.tsx` - Chat interface
- `/src/components/AoiFoundationBadge.tsx` - Foundation links
- `/src/contexts/AoiContext.tsx` - Global state
- `/src/config/aoiConfig.ts` - Configuration
- `/src/lib/aoiApiClient.ts` - API bridge
- `/supabase/functions/aoi-chat/index.ts` - Fallback AI

## Status Indicators

🟢 **Foundation Connected** - Using tyt.foundation API
🔴 **Local Mode** - Using local fallback

Check in:
- Chat widget footer
- aOi profile page
- Foundation badge component

## Links

- **Foundation**: https://tyt.foundation
- **About aOi**: https://tyt.foundation/aoi
- **Documentation**: `/docs/AOI_INTEGRATION_GUIDE.md`
- **Architecture**: `/docs/AOI_FOUNDATION_BRIDGE.md`

---

**Need help?** Ask aOi directly in the chat widget!
