# aOi Images Integration Guide

Complete guide to aOi image usage across TakeYourToken platform.

## Overview

All aOi images are hosted on **tyt.foundation** and loaded dynamically with automatic fallback to local copies.

## Image Sources

### Primary CDN
```
https://tyt.foundation/aoi/
```

### Local Fallback
```
/public/aoi/
```

## Image Inventory

### 1. Portrait Close (`portrait-close.png`)
**Primary Usage**: Header badge, chat messages, compact widgets

**Used in**:
- `AoiCompactWidget` - Header badge with "aOi • AI Guide" text
- `AoiBadgePill` - Badge pill component
- `AoiChatWidget` - Avatar next to chat messages

**Size**: 7-8px (rounded)
**Context**: Small avatar in UI chrome elements

### 2. Logo (`logo.png`)
**Primary Usage**: Site branding

**Used in**:
- `Header` - Main navigation logo
- `Footer` - Footer branding
- `AppLayout` - Sidebar logo
- `CompactHeader` - Compact header logo
- `index.html` - Apple touch icon
- Payment providers - Ramp widget logo

**Size**: 9-10px
**Context**: TYT brand identity

### 3. Level-Based Evolution Images

#### Level 1: Beginner Guide (`portrait-close.png`)
- XP Required: 0
- Description: Just starting your journey with Aoi

#### Level 2: Explorer Mentor (`guiding-left.png`)
- XP Required: 100
- Description: Exploring the crypto world together

#### Level 3: Builder Advisor (`presenting-open.png`)
- XP Required: 500
- Description: Building knowledge and skills

#### Level 4: Guardian Master (`standing-neutral.png`)
- XP Required: 1500
- Description: Guardian of knowledge and compassion

**Used in**:
- `AoiAvatar` - User profile avatars
- `AoiChatWidget` - Header avatar (dynamic)

### 4. Special Poses

#### Full Body Welcome (`aoi-fullbody-welcome.png`)
- **Usage**: Landing page hero sections
- **Context**: Large format welcome imagery

#### Hero Welcome (`hero-welcome.png`)
- **Usage**: Social media cards, OG images
- **Context**: Share previews and promotional materials

#### Guiding Left (`guiding-left.png`)
- **Usage**: Directional guidance animations
- **Context**: Onboarding flows

#### Pointing Right (`pointing-right.png`)
- **Usage**: Call-to-action elements
- **Context**: Drawing attention to important UI elements

#### Presenting Open (`presenting-open.png`)
- **Usage**: Information presentation contexts
- **Context**: Academy, tutorials, explanations

#### Standing Neutral (`standing-neutral.png`)
- **Usage**: Default pose, level 4 avatar
- **Context**: Profile pictures, achievements

#### Placeholder (`aoi-placeholder.svg`)
- **Usage**: Loading states
- **Context**: Fallback when images fail to load

## Component Integration

### AoiCompactWidget
```typescript
import { getAoiImage } from '../config/aoiConfig';

const AOI_AVATAR_URL = getAoiImage('portraitClose');

<img
  src={AOI_AVATAR_URL}
  alt="aOi"
  className="w-7 h-7 rounded-full"
  onError={(e) => {
    e.currentTarget.src = '/aoi/portrait-close.png';
  }}
/>
```

### AoiChatWidget
```typescript
import { getAoiImage } from '../config/aoiConfig';

const AOI_CHAT_AVATAR = getAoiImage('portraitClose');

// Used in message rendering
{message.sender === 'aoi' && (
  <img
    src={AOI_CHAT_AVATAR}
    alt="aOi"
    className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40"
  />
)}
```

### AoiAvatar (Level-Based)
```typescript
import { getAoiImages } from '../config/aoiConfig';

const AOI_IMAGES = getAoiImages();

<img
  src={AOI_IMAGES[level]} // level: 1-4
  alt={`Aoi - ${getAoiLevelInfo(level).name}`}
  className="rounded-full border-2 border-blue-400/50"
/>
```

### Header Components
```typescript
import { getTYTLogoUrl } from '../config/aoiConfig';

<img
  src={getTYTLogoUrl()}
  alt="TYT"
  className="w-10 h-10"
/>
```

## Configuration API

### Core Functions

#### `getAoiImage(imageName)`
Get URL for specific aOi image.

```typescript
import { getAoiImage } from '../config/aoiConfig';

const portrait = getAoiImage('portraitClose');
// Returns: https://tyt.foundation/aoi/portrait-close.png

const hero = getAoiImage('heroWelcome');
// Returns: https://tyt.foundation/aoi/hero-welcome.png
```

Available image names:
- `portraitClose`
- `guidingLeft`
- `pointingRight`
- `presentingOpen`
- `standingNeutral`
- `fullbodyWelcome`
- `heroWelcome`
- `placeholder`

#### `getAoiImages()`
Get all level-based avatar URLs.

```typescript
import { getAoiImages } from '../config/aoiConfig';

const images = getAoiImages();
// Returns: {
//   1: 'https://tyt.foundation/aoi/portrait-close.png',
//   2: 'https://tyt.foundation/aoi/guiding-left.png',
//   3: 'https://tyt.foundation/aoi/presenting-open.png',
//   4: 'https://tyt.foundation/aoi/standing-neutral.png'
// }
```

#### `getAoiSpecialImages()`
Get all special image URLs.

```typescript
import { getAoiSpecialImages } from '../config/aoiConfig';

const special = getAoiSpecialImages();
// Returns object with all image URLs
```

#### `getTYTLogoUrl()`
Get TYT logo URL.

```typescript
import { getTYTLogoUrl } from '../config/aoiConfig';

const logo = getTYTLogoUrl();
// Returns: https://tyt.foundation/aoi/logo.png
```

#### `getAoiImageUrl(level)`
Get URL for specific level avatar.

```typescript
import { getAoiImageUrl } from '../config/aoiConfig';

const level2 = getAoiImageUrl(2);
// Returns: https://tyt.foundation/aoi/guiding-left.png
```

## Fallback Strategy

### Automatic Fallback
All components implement automatic fallback to local images:

```typescript
<img
  src={getAoiImage('portraitClose')}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/aoi/portrait-close.png';
  }}
/>
```

### CDN Health Check
The application monitors CDN availability via `useAoi()` context:

```typescript
const { foundationOnline } = useAoi();
// Returns true if tyt.foundation CDN is reachable
```

## Performance Considerations

### Image Sizes
- **Badge/Avatar**: ~7-10px (very small)
- **Chat Messages**: ~8px
- **Profile Avatars**: ~16-32px
- **Hero Images**: Full width (responsive)

### Loading Strategy
1. Primary: Load from tyt.foundation CDN
2. Fallback: Load from local `/aoi/` directory
3. Ultimate: Display placeholder or hide image

### Caching
- CDN images are cached by browser
- Local images are bundled with application
- No additional caching layer needed

## Social Media Integration

### OG/Twitter Cards
```html
<!-- index.html -->
<meta property="og:image" content="https://tyt.foundation/aoi/hero-welcome.png" />
<meta name="twitter:image" content="https://tyt.foundation/aoi/hero-welcome.png" />
```

### Apple Touch Icon
```html
<link rel="apple-touch-icon" sizes="180x180" href="https://tyt.foundation/aoi/logo.png" />
```

## Adding New Images

### 1. Upload to tyt.foundation
Upload new image to `tyt.foundation/aoi/[image-name].png`

### 2. Update Config
Add to `src/config/aoiConfig.ts`:

```typescript
images: {
  // ... existing images
  newImage: 'new-image.png',
}
```

### 3. Update Type Definitions
If needed, update TypeScript types for `getAoiImage()`.

### 4. Optional: Add Local Fallback
Copy image to `public/aoi/` for offline support.

## Testing

### Test CDN Availability
```typescript
// In browser console
const img = new Image();
img.src = 'https://tyt.foundation/aoi/portrait-close.png';
img.onload = () => console.log('CDN available');
img.onerror = () => console.log('CDN unavailable, using fallback');
```

### Test Fallback
1. Block requests to tyt.foundation
2. Verify images fall back to local copies
3. Check console for errors

## Troubleshooting

### Image Not Loading
1. Check CDN availability: `curl https://tyt.foundation/aoi/portrait-close.png`
2. Verify local fallback exists: `ls public/aoi/`
3. Check browser console for errors
4. Verify image name spelling in config

### Wrong Image Displayed
1. Check component using correct function (`getAoiImage` vs `getAoiImageUrl`)
2. Verify level parameter (1-4) is valid
3. Clear browser cache

### Performance Issues
1. Use smaller images for badges/avatars
2. Implement lazy loading for hero images
3. Use WebP format where supported
4. Enable CDN caching headers

## Future Enhancements

### Planned Features
- [ ] WebP/AVIF format support
- [ ] Lazy loading for large images
- [ ] Animated avatars (SVG/Lottie)
- [ ] Dynamic theme-based variants
- [ ] Progressive image loading
- [ ] Image preloading for critical paths

### Optimization Opportunities
- Convert to SVG where possible
- Implement responsive images
- Add loading="lazy" for non-critical images
- Use srcset for different screen densities
