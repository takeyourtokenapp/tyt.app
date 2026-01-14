# aOi Images Quick Start

Quick reference for developers working with aOi images.

## TL;DR

```typescript
import { getAoiImage, getTYTLogoUrl } from '../config/aoiConfig';

// Get aOi portrait for badges/chat
const avatar = getAoiImage('portraitClose');

// Get TYT logo
const logo = getTYTLogoUrl();

// Use in component
<img
  src={avatar}
  onError={(e) => e.currentTarget.src = '/aoi/portrait-close.png'}
/>
```

## Common Use Cases

### Header Badge (Most Common)
```typescript
import { getAoiImage } from '../config/aoiConfig';

const AOI_AVATAR = getAoiImage('portraitClose');

<img src={AOI_AVATAR} className="w-7 h-7 rounded-full" />
```

### Logo (Headers/Footers)
```typescript
import { getTYTLogoUrl } from '../config/aoiConfig';

<img src={getTYTLogoUrl()} className="w-10 h-10" />
```

### Level-Based Avatar
```typescript
import { getAoiImages } from '../config/aoiConfig';

const images = getAoiImages();
<img src={images[level]} />
```

## Image Reference

| Image | Use Case | Function |
|-------|----------|----------|
| `portrait-close.png` | Badge, chat | `getAoiImage('portraitClose')` |
| `logo.png` | Logo | `getTYTLogoUrl()` |
| `guiding-left.png` | Level 2 | `getAoiImageUrl(2)` |
| `presenting-open.png` | Level 3 | `getAoiImageUrl(3)` |
| `standing-neutral.png` | Level 4 | `getAoiImageUrl(4)` |
| `hero-welcome.png` | Hero sections | `getAoiImage('heroWelcome')` |

## Always Add Fallback

```typescript
onError={(e) => {
  e.currentTarget.src = '/aoi/[image-name].png';
}}
```

## Where Images Live

- **Primary**: `https://tyt.foundation/aoi/`
- **Fallback**: `/public/aoi/`
- **Config**: `src/config/aoiConfig.ts`

## Don't Do This

```typescript
// ❌ Hardcoded URL
<img src="https://tyt.foundation/aoi/portrait-close.png" />

// ❌ No fallback
<img src={getAoiImage('portraitClose')} />

// ❌ Wrong function
<img src={getAoiImages().portraitClose} /> // undefined!
```

## Do This Instead

```typescript
// ✅ Correct
const avatar = getAoiImage('portraitClose');
<img
  src={avatar}
  onError={(e) => e.currentTarget.src = '/aoi/portrait-close.png'}
/>
```

## Components Using aOi Images

- ✅ `AoiCompactWidget` - portrait-close
- ✅ `AoiBadgePill` - portrait-close
- ✅ `AoiChatWidget` - portrait-close
- ✅ `AoiAvatar` - level-based
- ✅ `Header` - logo
- ✅ `Footer` - logo
- ✅ `AppLayout` - logo
- ✅ `CompactHeader` - logo

## Need Help?

See [AOI_IMAGES_INTEGRATION.md](./AOI_IMAGES_INTEGRATION.md) for complete documentation.
