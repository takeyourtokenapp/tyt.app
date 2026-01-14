# aOi Assets Integration Guide

## Overview

All aOi assets (images, avatars, animations) are hosted on **tyt.foundation** and loaded via CDN. This ensures:

1. **Single source of truth**: Assets are managed in the aOi AI Guide project
2. **Cross-domain consistency**: Same aOi appearance across all TYT properties
3. **Easy updates**: Update assets in one place, reflect everywhere
4. **Performance**: CDN delivery with automatic fallback to local assets

## Architecture

```
tyt.foundation (Primary)
  └── /assets/aoi/images/
      ├── chatgpt_image_24_дек._2025_г.,_22_53_12.png  (Level 1)
      ├── 39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png      (Level 2)
      ├── 6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png      (Level 3)
      └── 04158264-901b-4e6d-9ab6-732b63335cbf.png      (Level 4)

takeyourtoken.app (Fallback)
  └── /public/aoi/
      └── [same files for offline/CDN failure scenarios]
```

## Configuration

All aOi assets are configured in `src/config/aoiConfig.ts`:

```typescript
export const AOI_CONFIG = {
  cdn: {
    baseUrl: 'https://tyt.foundation',
    assetsPath: '/assets/aoi',
    imagesPath: '/assets/aoi/images',
    fallbackToLocal: true,
  },

  evolution: {
    levels: [
      {
        level: 1,
        name: 'Beginner Guide',
        image: 'chatgpt_image_24_дек._2025_г.,_22_53_12.png',
      },
      // ... other levels
    ],
  },
};
```

## Usage in Components

### Method 1: Use Helper Functions (Recommended)

```typescript
import { getAoiImages, getAoiImageUrl } from '../config/aoiConfig';

// Get all images
const AOI_IMAGES = getAoiImages();

// Or get specific level
const level2Image = getAoiImageUrl(2);
```

### Method 2: With Automatic Fallback

Always include `onError` handler for automatic fallback:

```typescript
import { getAoiImages, getAoiLevelInfo } from '../config/aoiConfig';

const AOI_IMAGES = getAoiImages();

<img
  src={AOI_IMAGES[level]}
  alt="aOi"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.startsWith('/aoi/')) {
      target.src = `/aoi/${getAoiLevelInfo(level).image}`;
    }
  }}
/>
```

## Current Implementation

### Components Using aOi Images

1. **AoiAvatar.tsx** - Full avatar with levels and interactions
2. **AoiCompactWidget.tsx** - Compact header widget
3. **AoiBadgePill.tsx** - Inline badge/pill component
4. **AoiChatWidget.tsx** - Chat interface avatar

All components now use centralized configuration with automatic CDN → Local fallback.

## Adding New aOi Assets

### 1. Upload to tyt.foundation

Upload new assets to:
```
https://tyt.foundation/assets/aoi/images/[filename]
```

### 2. Update Configuration

Edit `src/config/aoiConfig.ts`:

```typescript
evolution: {
  levels: [
    // ... existing levels
    {
      level: 5, // new level
      name: 'New Level Name',
      xpRequired: 3000,
      description: 'Level description',
      image: 'new-level-image.png', // filename only
    },
  ],
}
```

### 3. Optional: Add Local Fallback

Copy file to `/public/aoi/` for offline support:
```bash
cp new-level-image.png public/aoi/
```

## Testing

### Test CDN Loading
1. Open browser DevTools → Network tab
2. Load page with aOi component
3. Verify images load from `https://tyt.foundation/assets/aoi/images/`

### Test Fallback
1. Block requests to `tyt.foundation` (e.g., browser extension)
2. Reload page
3. Images should load from `/aoi/` local path

### Test All Levels

```typescript
// Test component
import AoiAvatar from './components/AoiAvatar';

<div className="flex gap-4">
  <AoiAvatar level={1} size="lg" showName showLevel />
  <AoiAvatar level={2} size="lg" showName showLevel />
  <AoiAvatar level={3} size="lg" showName showLevel />
  <AoiAvatar level={4} size="lg" showName showLevel />
</div>
```

## Troubleshooting

### Images Not Loading

1. **Check CDN URL**: Verify `https://tyt.foundation/assets/aoi/images/[filename]` is accessible
2. **Check CORS**: Ensure tyt.foundation allows cross-origin requests
3. **Check Filename**: Image filenames must match exactly (case-sensitive)
4. **Check Fallback**: Verify local files exist in `/public/aoi/`

### Mixed Content Errors

If app is HTTPS but CDN is HTTP:
- Ensure CDN URL uses HTTPS: `https://tyt.foundation`
- Update `AOI_CONFIG.cdn.baseUrl` in config

### Caching Issues

Clear browser cache or use cache busting:
```typescript
const imageUrl = `${getAoiImageUrl(level)}?v=${Date.now()}`;
```

## Performance Optimization

### Preload Critical Images

Add to `index.html`:
```html
<link rel="preload" as="image" href="https://tyt.foundation/assets/aoi/images/chatgpt_image_24_дек._2025_г.,_22_53_12.png">
```

### Use Next-Gen Formats

Consider converting to WebP/AVIF on tyt.foundation:
```
chatgpt_image_24_дек._2025_г.,_22_53_12.webp
```

Update config to check browser support and serve appropriate format.

## Security Considerations

1. **Content Security Policy**: Add tyt.foundation to CSP image sources
2. **Subresource Integrity**: Consider adding SRI hashes for images
3. **Rate Limiting**: Respect CDN rate limits
4. **Authentication**: No auth required for public images

## Future Enhancements

- [ ] Implement health check for CDN availability
- [ ] Add image lazy loading for better performance
- [ ] Support animated aOi (GIF/Lottie)
- [ ] Add dark/light mode variants
- [ ] Implement progressive image loading
- [ ] Add image optimization (compression, resizing)

## Contact

For issues with aOi assets or integration:
- Foundation Team: foundation@tyt.foundation
- Dev Team: dev@takeyourtoken.app
