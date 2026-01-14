# aOi Visual Usage Map

Comprehensive mapping of aOi images to UI contexts for optimal visual communication.

## Image Selection Principles

Each aOi image is chosen based on the **emotional context** and **user intent** of the interface location:

1. **portrait-close.png** - Intimate, personal contexts (badges, avatars)
2. **guiding-left.png** - Directional guidance, learning contexts
3. **pointing-right.png** - Attention-directing, call-to-action
4. **presenting-open.png** - Welcoming, open communication
5. **standing-neutral.png** - Calm presence, supportive contexts
6. **hero-welcome.png** - Large format hero sections
7. **fullbody-welcome.png** - Welcome screens, onboarding

## Current Implementation Map

### 🎯 Header & Navigation (Small, Always Visible)
**Context**: Persistent UI chrome, needs to be compact and recognizable

| Component | Image | Size | Rationale |
|-----------|-------|------|-----------|
| `AoiCompactWidget` | **portrait-close.png** | 7px | Compact circular badge fits header perfectly |
| `AoiBadgePill` | **portrait-close.png** | 7px | Consistent with header badge |
| Header Logo | **logo.png** | 9-10px | TYT brand identity |

### 💬 Chat & Messaging (Interactive, Conversational)
**Context**: Active communication, needs to feel present and responsive

| Component | Image | Size | Rationale |
|-----------|-------|------|-----------|
| Chat Messages | **portrait-close.png** | 8px | Small circular avatar next to messages |
| Chat Header | **presenting-open.png** | 10px | Welcoming open gesture for conversation start |
| Chat Loading | **portrait-close.png** | 8px | Consistent with messages |

**Why presenting-open for header?**
- Open arms gesture = welcoming
- Larger than portrait = more prominent
- Sets friendly tone for conversation

### 📚 Academy Page (Educational, Guiding)
**Context**: Learning environment, needs to feel instructive and supportive

| Location | Image | Size | Rationale |
|----------|-------|------|-----------|
| Hero Section | **guiding-left.png** | 96px | Points left, guides attention to content |
| Track Cards | Level-based | 16px | Shows user progress through evolution |

**Why guiding-left?**
- Directional gesture = "follow me"
- Perfect for educational context
- Points toward learning content

### ❤️ Foundation Page (Compassionate, Hopeful)
**Context**: Charity and hope, needs to feel caring and present

| Location | Image | Size | Rationale |
|----------|-------|------|-----------|
| Hero Section | **standing-neutral.png** | 128px | Calm, supportive presence |
| Donation Cards | **presenting-open.png** | 64px | Open gesture = giving/receiving |

**Why standing-neutral?**
- Guardian stance = protective
- Level 4 "Guardian Master" = fitting for foundation
- Calming presence for serious topic

### 🏠 Landing Page (Welcoming, Impressive)
**Context**: First impression, needs to wow and welcome

| Location | Image | Size | Rationale |
|----------|-------|------|-----------|
| Hero Section | **hero-welcome.png** | 500px | Large format welcome image |
| Floating Coins | Background | - | Visual context for aOi presence |

**Why hero-welcome?**
- Specifically designed for hero sections
- Large format = detailed view
- Creates memorable first impression

### 👤 User Profiles (Personal, Progressive)
**Context**: User identity and progress

| Component | Image | Size | Rationale |
|-----------|-------|------|-----------|
| `AoiAvatar` (Level 1) | **portrait-close.png** | 32px | Beginner - close personal view |
| `AoiAvatar` (Level 2) | **guiding-left.png** | 32px | Explorer - being guided |
| `AoiAvatar` (Level 3) | **presenting-open.png** | 32px | Builder - presenting work |
| `AoiAvatar` (Level 4) | **standing-neutral.png** | 32px | Guardian - master stance |

**Progressive evolution visual story:**
1. Close-up (learning basics)
2. Being guided (exploring)
3. Presenting (building)
4. Standing proud (mastery)

## Visual Hierarchy

### Size Guidelines
- **Tiny (7-10px)**: Badges, avatars in UI chrome
- **Small (16-32px)**: Chat messages, profile pictures
- **Medium (64-96px)**: Section headers, feature highlights
- **Large (128px+)**: Hero sections, welcome screens

### Gesture Meanings
- **Portrait**: Personal, intimate connection
- **Guiding**: Directional, educational
- **Pointing**: Attention, call-to-action
- **Presenting**: Open, welcoming, sharing
- **Standing**: Supportive, guardian, presence

## Optimization Rules

### DO Use:
✅ portrait-close for small circular avatars (<16px)
✅ guiding-left for educational contexts
✅ presenting-open for welcoming contexts
✅ standing-neutral for supportive/guardian contexts
✅ hero-welcome for large hero sections

### DON'T Use:
❌ hero-welcome in small spaces (will be pixelated)
❌ standing-neutral in tiny badges (gesture not visible)
❌ portrait-close in large hero sections (not enough detail)
❌ Multiple different images in same component (confusing)

## Future Enhancements

### Planned Contextual Uses

#### Onboarding Flow
- Step 1: **fullbody-welcome.png** (full introduction)
- Step 2: **guiding-left.png** (guiding through setup)
- Step 3: **presenting-open.png** (presenting features)
- Complete: **standing-neutral.png** (ready to assist)

#### Error States
- 404: **pointing-right.png** pointing to "Go Home" button
- 500: **standing-neutral.png** supportive presence
- Success: **presenting-open.png** celebrating with user

#### Contextual Help
- Tooltip hover: **portrait-close.png** (quick help)
- Help modal: **guiding-left.png** (detailed guidance)
- Tutorial: **presenting-open.png** (teaching mode)

### Responsive Considerations

#### Mobile (< 768px)
- Use portrait-close for all small contexts
- Hide large images in hero sections
- Prioritize compact variants

#### Tablet (768-1024px)
- Can show medium images (64-96px)
- Balance between detail and space

#### Desktop (> 1024px)
- Full visual hierarchy
- All gestures visible and meaningful

## Testing Checklist

When adding new aOi image usage:

- [ ] Does image size match context? (see Size Guidelines)
- [ ] Does gesture match user intent? (see Gesture Meanings)
- [ ] Is fallback image provided?
- [ ] Does it work on mobile?
- [ ] Is loading state handled?
- [ ] Does it enhance user experience?

## Performance Notes

### Loading Strategy
1. **Critical**: portrait-close (header badge) - load immediately
2. **Important**: Chat images - load on interaction
3. **Deferred**: Hero images - lazy load
4. **Optional**: Decorative images - load after core content

### Caching Priority
1. portrait-close.png (most used)
2. logo.png (brand identity)
3. presenting-open.png (chat + foundation)
4. guiding-left.png (academy)
5. standing-neutral.png (foundation)
6. hero-welcome.png (landing page)

### Bandwidth Optimization
- Use WebP format where supported
- Implement responsive images (srcset)
- Lazy load non-critical images
- Preload critical images

## Analytics & A/B Testing

### Metrics to Track
- Image load times
- User engagement with aOi features
- Click-through rates on aOi-highlighted CTAs
- Time spent in sections with aOi presence

### A/B Test Ideas
- Different poses for same context
- With/without aOi in sections
- Size variations for hero sections
- Animated vs static images

## Brand Guidelines

### Consistency Rules
1. aOi should feel like ONE character across platform
2. Gestures should be intuitive and culturally appropriate
3. Image quality should be consistent
4. Positioning should follow natural reading flow (LTR/RTL)

### Voice & Tone
- **Friendly**: Not corporate or distant
- **Knowledgeable**: Expert but approachable
- **Supportive**: Helper, not commander
- **Hopeful**: Positive, especially for foundation

## Accessibility Considerations

### Alt Text Standards
- Descriptive: "aOi - Your Learning Guide"
- Context-aware: "aOi welcoming you to TYT Platform"
- Action-oriented: "aOi pointing to next step"

### Visual Accessibility
- Ensure sufficient contrast with backgrounds
- Don't rely solely on images for critical info
- Provide text alternatives for all gestures
- Test with screen readers

## Conclusion

aOi's visual presence is carefully orchestrated to:
1. **Guide** users through learning (guiding-left)
2. **Welcome** new users (hero-welcome, presenting-open)
3. **Support** emotional contexts (standing-neutral)
4. **Connect** personally (portrait-close)

Each image choice reinforces the platform's mission: making Web3 accessible while supporting children in need.
