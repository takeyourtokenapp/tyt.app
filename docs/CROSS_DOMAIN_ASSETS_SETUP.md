# Cross-Domain Assets Setup Guide

## Overview

This guide explains how to properly configure asset loading between:
- **tyt.foundation** (aOi AI Guide project - assets host)
- **takeyourtoken.app** (Main platform - assets consumer)

## Architecture

```
┌─────────────────────────────────────┐
│      tyt.foundation                 │
│  (aOi AI Guide Project)             │
│                                     │
│  /assets/aoi/images/                │
│  ├── Level 1 avatar                 │
│  ├── Level 2 avatar                 │
│  ├── Level 3 avatar                 │
│  └── Level 4 avatar                 │
│                                     │
│  + CORS headers configured          │
│  + CDN/caching enabled              │
└─────────────────────────────────────┘
             │
             │ HTTPS + CORS
             ▼
┌─────────────────────────────────────┐
│   takeyourtoken.app                 │
│   (Main Platform)                   │
│                                     │
│   Components:                       │
│   ├── AoiAvatar                     │
│   ├── AoiCompactWidget              │
│   └── AoiBadgePill                  │
│                                     │
│   Config: src/config/aoiConfig.ts   │
│   + Automatic fallback to local     │
└─────────────────────────────────────┘
```

## Setup Instructions

### 1. tyt.foundation Configuration (Asset Host)

#### File Structure

Create the following structure in your tyt.foundation project:

```
tyt.foundation/
└── public/
    └── assets/
        └── aoi/
            └── images/
                ├── chatgpt_image_24_дек._2025_г.,_22_53_12.png
                ├── 39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png
                ├── 6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png
                └── 04158264-901b-4e6d-9ab6-732b63335cbf.png
```

#### CORS Configuration

Add CORS headers to allow takeyourtoken.app to load assets:

**For Nginx:**
```nginx
location /assets/aoi/ {
    add_header Access-Control-Allow-Origin "https://takeyourtoken.app" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type" always;
    add_header Cache-Control "public, max-age=31536000, immutable";

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

**For Apache (.htaccess):**
```apache
<IfModule mod_headers.c>
    <FilesMatch "\.(png|jpg|jpeg|gif|svg|webp)$">
        Header set Access-Control-Allow-Origin "https://takeyourtoken.app"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>
```

**For Vite (Development):**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    cors: {
      origin: ['https://takeyourtoken.app', 'http://localhost:5173'],
      methods: ['GET', 'OPTIONS'],
      credentials: false,
    },
  },
});
```

**For Express.js:**
```javascript
const cors = require('cors');

app.use('/assets/aoi', cors({
  origin: ['https://takeyourtoken.app', 'http://localhost:5173'],
  methods: ['GET', 'OPTIONS'],
}));
```

#### Caching Strategy

Optimize performance with proper caching:

```nginx
location /assets/aoi/images/ {
    # Long-term caching (1 year)
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";

    # CORS
    add_header Access-Control-Allow-Origin "https://takeyourtoken.app" always;

    # Compression
    gzip on;
    gzip_types image/png image/jpeg image/webp;
}
```

### 2. takeyourtoken.app Configuration (Consumer)

#### Configuration File

Already configured in `src/config/aoiConfig.ts`:

```typescript
export const AOI_CONFIG = {
  cdn: {
    baseUrl: 'https://tyt.foundation',
    assetsPath: '/assets/aoi',
    imagesPath: '/assets/aoi/images',
    fallbackToLocal: true,
  },
  // ... rest of config
};
```

#### Local Fallback Setup

1. **Copy images to local fallback directory:**
```bash
# In takeyourtoken.app project
mkdir -p public/aoi
cp /path/to/aoi/images/* public/aoi/
```

2. **Verify fallback structure:**
```
public/
└── aoi/
    ├── chatgpt_image_24_дек._2025_г.,_22_53_12.png
    ├── 39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png
    ├── 6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png
    └── 04158264-901b-4e6d-9ab6-732b63335cbf.png
```

#### Component Usage

All aOi components automatically handle CDN → Local fallback:

```typescript
import { getAoiImages } from '../config/aoiConfig';

const AOI_IMAGES = getAoiImages(); // Loads from CDN

<img
  src={AOI_IMAGES[level]}
  onError={(e) => {
    // Automatic fallback to local
    if (!e.target.src.startsWith('/aoi/')) {
      e.target.src = `/aoi/${filename}`;
    }
  }}
/>
```

### 3. Security Considerations

#### CSP (Content Security Policy)

Update CSP headers to allow images from tyt.foundation:

```html
<!-- In index.html or server headers -->
<meta http-equiv="Content-Security-Policy"
      content="img-src 'self' https://tyt.foundation data: blob:;">
```

**For Nginx:**
```nginx
add_header Content-Security-Policy "img-src 'self' https://tyt.foundation data: blob:;";
```

#### HTTPS Only

Ensure both domains use HTTPS:
- ✅ `https://tyt.foundation`
- ✅ `https://takeyourtoken.app`

Mixed content (HTTP on HTTPS page) will be blocked by browsers.

#### Rate Limiting

Protect CDN from abuse:

```nginx
# Limit requests to assets
limit_req_zone $binary_remote_addr zone=assets:10m rate=30r/s;

location /assets/aoi/ {
    limit_req zone=assets burst=50;
}
```

### 4. Testing & Verification

#### Test CDN Loading

1. **Open takeyourtoken.app**
2. **Open DevTools → Network tab**
3. **Filter by "Img"**
4. **Verify images load from:**
   ```
   https://tyt.foundation/assets/aoi/images/...
   ```

#### Test CORS

```bash
# Test CORS headers
curl -I -H "Origin: https://takeyourtoken.app" \
  https://tyt.foundation/assets/aoi/images/chatgpt_image_24_дек._2025_г.,_22_53_12.png

# Should return:
# Access-Control-Allow-Origin: https://takeyourtoken.app
```

#### Test Fallback

1. **Block tyt.foundation** (browser extension or hosts file)
2. **Reload takeyourtoken.app**
3. **Images should load from** `/aoi/` (local)
4. **Check Network tab** for fallback

#### Performance Testing

Use browser DevTools or Lighthouse:
- Image load time < 500ms
- Proper caching headers
- No 404 errors
- No CORS errors

### 5. Deployment Checklist

#### tyt.foundation (Asset Host)

- [ ] Upload aOi images to `/public/assets/aoi/images/`
- [ ] Configure CORS headers (allow takeyourtoken.app)
- [ ] Enable caching (1 year for images)
- [ ] Enable compression (gzip/brotli)
- [ ] Test CORS with curl
- [ ] Verify HTTPS certificate
- [ ] Configure CDN (optional: Cloudflare, CloudFront)

#### takeyourtoken.app (Consumer)

- [ ] Verify aoiConfig.ts has correct CDN URL
- [ ] Copy images to `/public/aoi/` for fallback
- [ ] Test components render with CDN images
- [ ] Test fallback when CDN blocked
- [ ] Update CSP headers
- [ ] Test on production domain
- [ ] Monitor error logs for CORS issues

### 6. Monitoring & Maintenance

#### Metrics to Track

1. **CDN Availability**
   - Uptime percentage
   - Response time
   - Error rate (4xx, 5xx)

2. **Fallback Usage**
   - How often local images are used
   - Why CDN failed (timeout, CORS, DNS)

3. **Performance**
   - Image load time
   - Cache hit rate
   - Bandwidth usage

#### Health Check

Implement automated health check:

```typescript
// src/utils/aoiCdnCheck.ts (already created)
import { checkAoiCdnHealth } from './utils/aoiCdnCheck';

// Run periodically
setInterval(async () => {
  const health = await checkAoiCdnHealth();
  if (!health.available) {
    console.warn('aOi CDN unavailable, using local fallback');
    // Optional: Send alert to monitoring service
  }
}, 5 * 60 * 1000); // Every 5 minutes
```

### 7. Troubleshooting

#### Images Not Loading

**Symptoms**: Broken image icons, 404 errors

**Solutions**:
1. Check CDN URL in aoiConfig.ts
2. Verify files exist on tyt.foundation
3. Check CORS headers (use curl)
4. Verify HTTPS certificate
5. Check browser console for errors

#### CORS Errors

**Symptoms**: Console error "blocked by CORS policy"

**Solutions**:
1. Add correct CORS headers on tyt.foundation
2. Include `Access-Control-Allow-Origin` header
3. Handle OPTIONS preflight requests
4. Verify origin matches exactly (no trailing slash)

#### Mixed Content Errors

**Symptoms**: Console warning "mixed content blocked"

**Solutions**:
1. Ensure CDN URL uses HTTPS
2. Update `AOI_CONFIG.cdn.baseUrl` to use `https://`
3. Check SSL certificate on tyt.foundation

#### Slow Loading

**Symptoms**: Images take >2 seconds to load

**Solutions**:
1. Enable compression (gzip/brotli)
2. Optimize image file sizes (TinyPNG)
3. Enable CDN caching
4. Use WebP format
5. Add preload hints in HTML

### 8. Future Enhancements

- [ ] Implement WebP with PNG fallback
- [ ] Add image lazy loading
- [ ] Use responsive images (srcset)
- [ ] Implement CDN failover (multiple CDNs)
- [ ] Add image versioning for cache busting
- [ ] Compress images further (Squoosh)
- [ ] Add image loading placeholders
- [ ] Implement progressive image loading

## Contact

**Technical Issues**: dev@takeyourtoken.app
**Asset Updates**: aoi@tyt.foundation
**CDN Setup**: devops@tyt.foundation
