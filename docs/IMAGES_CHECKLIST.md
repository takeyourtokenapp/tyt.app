# TakeYourToken Images & Assets Checklist

## Current Status

### aOi AI Guide Assets ✅

**Status**: Configured to load from tyt.foundation CDN

**Location**:
- Primary: `https://tyt.foundation/assets/aoi/images/`
- Fallback: `/public/aoi/` (local)

**Files Required**:
- ✅ `chatgpt_image_24_дек._2025_г.,_22_53_12.png` (Level 1 - Beginner Guide)
- ✅ `39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png` (Level 2 - Explorer Mentor)
- ✅ `6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png` (Level 3 - Builder Advisor)
- ✅ `04158264-901b-4e6d-9ab6-732b63335cbf.png` (Level 4 - Guardian Master)

**Components Using**:
- `AoiAvatar.tsx`
- `AoiCompactWidget.tsx`
- `AoiBadgePill.tsx`
- `AoiChatWidget.tsx`

**Configuration**: `src/config/aoiConfig.ts`

---

## Missing or Empty Assets

### Brand Assets ⚠️

**Location**: `/public/`

1. **logo.png** (0 bytes - EMPTY)
   - Purpose: Main TYT logo
   - Recommended size: 512x512px or larger
   - Format: PNG with transparency
   - Usage: Header, footer, marketing materials

2. **image.png** (0 bytes - EMPTY)
   - Purpose: Social media / OG image
   - Recommended size: 1200x630px
   - Format: PNG or JPG
   - Usage: Meta tags for social sharing

3. **favicon.png** (0 bytes - EMPTY)
   - Purpose: Browser tab icon
   - Recommended size: 32x32px, 64x64px, 128x128px
   - Format: PNG
   - Usage: Browser favicon

4. **favicon.svg** (531 bytes - ✅ EXISTS)
   - SVG version of favicon
   - Scalable for all sizes

### Icon System ✅

**Location**: `/public/assets/icons/navbar/`

All navbar icons exist and are properly sized:
- ✅ icon-ai.svg (288 bytes)
- ✅ icon-home.svg (342 bytes)
- ✅ icon-token.svg (307 bytes)
- ✅ icon-wallet.svg (433 bytes)
- ✅ icon-mining.svg (348 bytes)
- ✅ icon-staking.svg (321 bytes)
- ✅ icon-security.svg (322 bytes)
- ✅ icon-foundation.svg (383 bytes)
- ✅ icon-governance.svg (337 bytes)
- ✅ icon-marketplace.svg (354 bytes)

---

## Recommended Additional Assets

### Landing Page

1. **Hero Background**
   - Subtle pattern or gradient
   - Size: 1920x1080px
   - Format: WebP or optimized JPG
   - Purpose: Landing page hero section background

2. **Miner NFT Previews**
   - Preview images of different miner tiers
   - Size: 400x400px
   - Format: PNG with transparency
   - Purpose: Showcase in marketplace/landing

3. **Feature Icons** (if not using Lucide)
   - Bitcoin mining icon
   - Foundation/charity icon
   - Security shield icon
   - Community icon

### Foundation Section

1. **Impact Photos**
   - Children (stock photos or provided by foundation)
   - Research facilities
   - Medical equipment
   - Size: 800x600px
   - Format: JPG (optimized)

2. **Foundation Logo**
   - TYT Foundation official logo
   - Size: 512x512px
   - Format: PNG with transparency

### Marketing Assets

1. **Social Media Cards**
   - Twitter/X card: 1200x675px
   - Facebook card: 1200x630px
   - LinkedIn card: 1200x627px

2. **Email Templates**
   - Header banner: 600px wide
   - Footer logo: 200px wide

---

## Integration Instructions

### For Local Assets (TakeYourToken.app)

1. **Add to `/public/` directory**
```bash
public/
├── logo.png          # Main logo
├── image.png         # OG/social image
├── favicon.png       # Browser favicon
└── favicon.svg       # SVG favicon (already exists)
```

2. **Update HTML meta tags** in `index.html`:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta property="og:image" content="/image.png" />
<meta name="twitter:image" content="/image.png" />
```

3. **Use in components**:
```typescript
// Logo usage example
<img src="/logo.png" alt="TakeYourToken" className="h-10" />
```

### For CDN Assets (tyt.foundation)

1. **Upload to tyt.foundation**:
```
https://tyt.foundation/assets/
├── brand/
│   ├── logo.png
│   ├── logo-white.png
│   └── foundation-logo.png
├── aoi/
│   └── images/ (already configured)
└── marketing/
    ├── social-cards/
    └── banners/
```

2. **Configure CDN paths** in config file
3. **Add fallback logic** like aOi images

---

## Asset Optimization Guidelines

### Image Sizes

| Asset Type | Recommended Size | Max File Size |
|-----------|------------------|---------------|
| Logo | 512x512px | 50KB |
| Favicon | 32x32, 64x64, 128x128 | 10KB |
| OG Image | 1200x630px | 200KB |
| Hero Background | 1920x1080px | 300KB |
| NFT Preview | 400x400px | 100KB |
| Icons | 24x24, 32x32, 48x48 | 5KB each |

### Formats

- **Logos**: PNG with transparency
- **Photos**: WebP (primary), JPG (fallback)
- **Icons**: SVG (scalable) or PNG sprites
- **Backgrounds**: WebP or optimized JPG

### Compression

Use tools like:
- **TinyPNG** for PNG compression
- **Squoosh** for WebP conversion
- **SVGOMG** for SVG optimization

---

## Priority Action Items

### High Priority 🔴

1. **Add main logo.png**
   - Required for header/footer
   - Brand identity

2. **Add favicon.png**
   - Browser tab visibility
   - Professional appearance

3. **Add OG image (image.png)**
   - Social media sharing
   - Professional sharing previews

### Medium Priority 🟡

4. **Add hero background**
   - Landing page visual appeal
   - Better user engagement

5. **Add miner NFT previews**
   - Marketplace functionality
   - Visual product showcase

### Low Priority 🟢

6. **Add marketing assets**
   - Email campaigns
   - Social media posts

7. **Add foundation photos**
   - Emotional connection
   - Impact demonstration

---

## Testing Checklist

After adding images, verify:

- [ ] Logo displays correctly in header (all pages)
- [ ] Logo displays correctly in footer (all pages)
- [ ] Favicon shows in browser tab
- [ ] OG image shows when sharing on social media
- [ ] aOi avatars load from CDN (check Network tab)
- [ ] aOi avatars fallback to local if CDN fails
- [ ] All navbar icons display properly
- [ ] Images are optimized (check file sizes)
- [ ] Images are responsive (test mobile/tablet/desktop)
- [ ] Dark mode compatibility (if applicable)

---

## Contact & Resources

**Design Team**: design@takeyourtoken.app
**Foundation Assets**: foundation@tyt.foundation
**Developer Support**: dev@takeyourtoken.app

**Asset Libraries**:
- Stock Photos: [Pexels](https://pexels.com), [Unsplash](https://unsplash.com)
- Icons: [Lucide](https://lucide.dev), [Heroicons](https://heroicons.com)
- Optimization: [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
