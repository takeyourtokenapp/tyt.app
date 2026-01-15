# 🔄 Complete TYT Foundation Synchronization Guide

## 📊 Two-Project Architecture

You have **two separate bolt.new projects** that need to work as **one unified ecosystem**:

```
┌─────────────────────────────────────────────────────────────┐
│              Shared Supabase Database                        │
│  (Single Source of Truth - Already Configured)              │
│                                                              │
│  ✅ 57 Tables Total                                          │
│  ✅ Foundation Tables (10)                                   │
│  ✅ aOi AI Tables (7)                                        │
│  ✅ Academy Tables (8)                                       │
│  ✅ Mining Tables (12)                                       │
│  ✅ All RLS Policies Active                                  │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│ takeyourtoken.app   │  │  tyt.foundation     │
│ (bolt.new project 1)│  │ (bolt.new project 2)│
│                     │  │                     │
│ ✅ COMPLETE         │  │ 🔄 NEEDS SYNC       │
│ • Full app logic    │  │ • Minimal demo      │
│ • Mining platform   │  │ • Just homepage     │
│ • Rewards engine    │  │                     │
│ • Marketplace       │  │ 📦 NEEDS:           │
│ • Academy           │  │ • Foundation data   │
│ • Auto-donate       │  │ • aOi chat          │
│ • aOi system        │  │ • Real-time sync    │
│ • Foundation pages  │◄─┤ • Cross-domain      │
│                     │  │ • API endpoints     │
└─────────────────────┘  └─────────────────────┘
```

---

## 🎯 Goal

**Transform tyt.foundation from demo → production-ready landing site** that:

1. ✅ Displays **real-time Foundation stats** from shared database
2. ✅ Hosts **aOi AI chat** as primary interface
3. ✅ Accepts **donations** (BTC, ETH, USDT)
4. ✅ Shows **research grants** and impact reports
5. ✅ Enables **cross-domain navigation** to takeyourtoken.app
6. ✅ Syncs **user context** via postMessage API

---

## 📦 Complete File Copy List

### ✅ Category 1: Core Infrastructure (CRITICAL)

```bash
# Supabase Client & Config
src/lib/supabase.ts                    # Database connection
src/lib/supabase-diagnostic.ts         # Health checks

# Environment Variables
.env.example                           # Template (modify for Foundation)
```

**Action**: Copy these **first** and test database connection.

---

### ✅ Category 2: Foundation Data Layer (HIGH PRIORITY)

```bash
# Foundation Service
src/utils/foundationDataService.ts     # ✅ Real-time data service

# Types
src/types/database.ts                  # Database schema types (optional, can generate)
```

**Provides**:
- `getOverallStats()` - Total donated, families supported, etc.
- `getActiveCampaigns()` - Current fundraising campaigns
- `getResearchGrants()` - Active research projects
- `getHospitalPartners()` - Partner institutions
- `subscribeToFoundationUpdates()` - Real-time Supabase subscriptions

---

### ✅ Category 3: Foundation UI Components (HIGH PRIORITY)

```bash
# Pages
src/pages/Foundation.tsx               # ✅ Complete Foundation landing page

# Components
src/components/LiveFoundationTracker.tsx    # Real-time stats widget
src/components/DonationWidget.tsx           # Donation form (BTC/ETH/USDT)
src/components/ImpactReportsDashboard.tsx   # Quarterly reports display
```

---

### ✅ Category 4: aOi AI System (COMPLETE INTEGRATION)

#### Types & Configuration
```bash
src/types/aoi.ts                       # ✅ aOi TypeScript types
src/config/aoiConfig.ts                # ✅ aOi config (personality, CDN, levels)
```

#### Core Components
```bash
src/components/AoiAvatar.tsx           # ✅ Level-based avatar (1-4)
src/components/AoiChatWidget.tsx       # ✅ Full chat interface
src/components/AoiCompactWidget.tsx    # ✅ Header mini-widget
src/components/AoiImage.tsx            # ✅ CDN image loader with fallback
src/components/AoiBadgePill.tsx        # ✅ Level badge display
src/components/AoiFoundationBadge.tsx  # ✅ Foundation-specific badge
src/components/CrossDomainBridge.tsx   # ✅ Navigation between domains
```

#### Context & Services
```bash
src/contexts/AoiContext.tsx            # ✅ aOi state management
src/contexts/AoiControlContext.tsx     # ✅ Control state
src/lib/aoiApiClient.ts                # ✅ API client (Foundation primary)
src/lib/aoi/realtimeSync.ts            # ✅ Supabase Realtime sync
src/lib/aoi/crossDomainSync.ts         # ✅ postMessage cross-domain sync
```

---

### ✅ Category 5: Supabase Edge Functions (API LAYER)

```bash
# aOi AI API Endpoints
supabase/functions/aoi-chat/index.ts           # Chat completions
supabase/functions/aoi-user-context/index.ts   # User context retrieval
supabase/functions/aoi-status/index.ts         # Health check endpoint
supabase/functions/aoi-activity-log/index.ts   # Activity logging
supabase/functions/aoi-progress/index.ts       # Progress tracking
supabase/functions/aoi-audit/index.ts          # Audit log

# Shared Utilities
supabase/functions/_shared/auth.ts             # Auth helpers
supabase/functions/_shared/rateLimiter.ts      # Rate limiting
```

**Deployment**:
```bash
# Deploy from tyt.foundation project
supabase functions deploy aoi-chat
supabase functions deploy aoi-user-context
supabase functions deploy aoi-status
# ... etc
```

---

### ✅ Category 6: Assets

```bash
# aOi Images
public/aoi/aoi-portrait-ai-chat.png   # ✅ Chat portrait (128x128)
public/aoi/aoi-fullbody-welcome.png   # ✅ Welcome hero (600x600)
public/aoi/README.md                  # ✅ Asset documentation

# Branding
public/logo.png                       # ✅ TYT logo
public/favicon.svg                    # ✅ Favicon
```

---

## 🔧 Step-by-Step Setup for tyt.foundation

### Step 1: Clone Core Infrastructure

In **tyt.foundation** bolt.new project:

```bash
# Create directory structure
mkdir -p src/lib src/types src/utils src/config
mkdir -p src/components src/contexts src/pages
mkdir -p public/aoi
mkdir -p supabase/functions/_shared
```

### Step 2: Configure Environment Variables

Create/update `.env` in **tyt.foundation**:

```bash
# Supabase (SAME as takeyourtoken.app)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# aOi Configuration
VITE_AOI_ENABLED=true
VITE_AOI_API_ENDPOINT=https://tyt.foundation/api/aoi

# Domains
VITE_APP_DOMAIN=https://takeyourtoken.app
VITE_FOUNDATION_DOMAIN=https://tyt.foundation

# Features
VITE_CROSS_DOMAIN_ENABLED=true
VITE_REAL_TIME_SYNC=true

# AI Provider (Optional - for enhanced aOi)
OPENAI_API_KEY=sk-...
```

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js@^2.57.4
npm install lucide-react
npm install framer-motion
npm install react-router-dom
```

### Step 4: Copy Core Files

**4.1 Supabase Client**

Copy `src/lib/supabase.ts` from takeyourtoken.app **exactly as is**.

**4.2 Foundation Data Service**

Copy `src/utils/foundationDataService.ts` → `src/lib/foundationDataService.ts`

Update import:
```typescript
// Change:
import { supabase } from '../lib/supabase';
// To:
import { supabase } from './supabase';
```

**4.3 aOi Configuration**

Copy `src/config/aoiConfig.ts` and **modify**:

```typescript
export const AOI_CONFIG = {
  foundation: {
    domain: 'https://tyt.foundation',          // ✅ SELF
    apiEndpoint: '/api/aoi',                   // ✅ Local endpoint
    websiteUrl: 'https://tyt.foundation',
    statusUrl: '/api/status',
  },

  app: {
    domain: 'https://takeyourtoken.app',       // ✅ External app
    localApiPath: '/api/aoi',
    academyPath: '/app/academy',
    foundationPath: '/app/foundation',
  },

  features: {
    useFoundationApi: false,   // ✅ WE ARE the Foundation
    fallbackToLocal: false,    // No fallback needed
    crossDomainAuth: true,     // Enable cross-domain sync
    sharedSessions: true,
  },

  // Keep rest of config identical
  personality: { /* same */ },
  evolution: { /* same */ },
  images: { /* same */ },
};
```

### Step 5: Copy aOi Components

Copy all aOi components listed in Category 4 above.

**Update imports** in each component:
```typescript
// Example: AoiChatWidget.tsx
// Change all relative imports to absolute:
import { useAoi } from '../contexts/AoiContext';
// To:
import { useAoi } from '@/contexts/AoiContext';

import { supabase } from '../lib/supabase';
// To:
import { supabase } from '@/lib/supabase';
```

### Step 6: Setup Router

Create `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AoiProvider } from './contexts/AoiContext';
import Foundation from './pages/Foundation';

function App() {
  return (
    <AoiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Foundation />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </AoiProvider>
  );
}

export default App;
```

### Step 7: Deploy Edge Functions

```bash
# Navigate to supabase/functions directory
cd supabase/functions

# Deploy each function
supabase functions deploy aoi-chat
supabase functions deploy aoi-user-context
supabase functions deploy aoi-status
supabase functions deploy aoi-activity-log
supabase functions deploy aoi-progress

# Verify
supabase functions list
```

**Important**: Edge Functions must be deployed from **tyt.foundation** project.

### Step 8: Test Connection

Create `src/lib/test-connection.ts`:

```typescript
import { supabase } from './supabase';
import { foundationDataService } from './foundationDataService';

export async function testFoundationConnection() {
  console.log('🔍 Testing Foundation connection...');

  // Test 1: Supabase connection
  const { data: campaigns, error } = await supabase
    .from('foundation_campaigns')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }

  console.log('✅ Database connected! Found campaigns:', campaigns);

  // Test 2: Foundation data service
  const stats = await foundationDataService.getOverallStats();
  console.log('✅ Foundation stats:', stats);

  // Test 3: Edge Function
  const response = await fetch('/api/status');
  const status = await response.json();
  console.log('✅ Edge Function status:', status);

  return true;
}
```

Call this in your main page to verify everything works.

---

## 🔄 Real-Time Synchronization

### How It Works

```
User on takeyourtoken.app makes donation
    ↓
Insert into foundation_donations table (Supabase)
    ↓
Supabase Realtime broadcast (WebSocket)
    ↓
tyt.foundation subscribed listener receives event
    ↓
UI updates automatically (no page refresh)
    ↓
Both sites show same data in < 100ms ✅
```

### Implementation in Foundation Page

```typescript
// src/pages/Foundation.tsx
import { useEffect, useState } from 'react';
import { foundationDataService } from '@/lib/foundationDataService';

export default function Foundation() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Initial load
    foundationDataService.getOverallStats().then(setStats);

    // Subscribe to real-time updates
    const unsubscribe = foundationDataService.subscribeToFoundationUpdates(
      (newStats) => {
        console.log('📊 Foundation stats updated:', newStats);
        setStats(newStats);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1>TYT Foundation</h1>
      <p>Total Donated: ${stats.totalDonated.toLocaleString()}</p>
      <p>Families Supported: {stats.familiesSupported}</p>
      <p>Research Grants: {stats.researchGrants}</p>
      <p>Active Clinical Trials: {stats.activeClinicalTrials}</p>

      {/* Real-time updates happen automatically! */}
    </div>
  );
}
```

---

## 🌐 Cross-Domain Navigation

### User Flow Example

```
1. User visits takeyourtoken.app
2. Logs in → profile created in Supabase
3. Mines BTC → auto-donates 1%
4. Donation recorded in foundation_donations table
5. User clicks "Visit Foundation" button
   ↓
   CrossDomainBridge component:
   - Logs navigation event
   - Adds aOi level/XP to URL params
   - Sends postMessage to Foundation
   - Opens tyt.foundation in new tab
   ↓
6. tyt.foundation loads
   - Reads aOi level/XP from URL params
   - Displays personalized welcome
   - Shows real-time donation impact
7. User chats with aOi on Foundation site
8. aOi answers questions about research
9. User navigates back to app
10. Progress synced via Supabase Realtime ✅
```

### Implement CrossDomainBridge

```typescript
// In tyt.foundation
import CrossDomainBridge from '@/components/CrossDomainBridge';

// On homepage
<CrossDomainBridge
  type="to-app"
  variant="card"
  size="lg"
  className="max-w-md"
/>

// This creates a beautiful card that links to takeyourtoken.app
// with user context preserved
```

---

## 🧪 Testing Checklist

### Database Connection
```bash
✅ Supabase client initializes
✅ Environment variables loaded
✅ Can query foundation_campaigns
✅ Can query aoi_user_progress
✅ RLS policies work correctly
```

### Foundation Data Service
```bash
✅ getOverallStats() returns data
✅ getActiveCampaigns() works
✅ getResearchGrants() works
✅ subscribeToFoundationUpdates() triggers on changes
```

### aOi System
```bash
✅ AoiChatWidget opens and renders
✅ Can send messages to aOi
✅ aOi responds (check Edge Function logs)
✅ User progress tracked in database
✅ Levels/XP display correctly
```

### Edge Functions
```bash
✅ /api/status returns 200 OK
✅ /api/aoi/chat accepts POST requests
✅ CORS headers present
✅ Rate limiting works
✅ Auth checks function
```

### Cross-Domain
```bash
✅ CrossDomainBridge button works
✅ URL params preserved (aoi_level, aoi_xp)
✅ postMessage events fire
✅ Navigation logged in aoi_interactions table
```

### Real-Time Sync
```bash
✅ Open tyt.foundation in two tabs
✅ Make change in takeyourtoken.app (simulate donation)
✅ Both Foundation tabs update automatically
✅ < 1 second latency
```

---

## 🚀 Deployment

### Deploy tyt.foundation to Production

**Option A: Vercel (Recommended)**

```bash
# Connect to Vercel
vercel init

# Add environment variables in Vercel Dashboard
# (same as .env above)

# Deploy
vercel --prod
```

**Option B: Netlify**

```bash
netlify init
netlify env:set VITE_SUPABASE_URL "https://..."
netlify env:set VITE_SUPABASE_ANON_KEY "..."
netlify deploy --prod
```

### DNS Setup

```bash
# Add DNS records for tyt.foundation
A     @      [Vercel/Netlify IP]
CNAME www    [deployment-url]

# SSL automatically handled by Vercel/Netlify
```

---

## 📊 Post-Deployment Monitoring

### Health Checks

```bash
# Check main site
curl https://tyt.foundation
# Should return 200 OK

# Check API endpoint
curl https://tyt.foundation/api/status
# Should return: {"status":"ok","timestamp":"..."}

# Check Edge Function
curl https://[project-id].supabase.co/functions/v1/aoi-status
# Should return: {"status":"healthy"}
```

### Real-Time Monitoring

Setup alerts in Supabase Dashboard:
- Monitor Edge Function errors
- Track database query performance
- Watch Realtime subscription counts

---

## 🔗 Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    USER EXPERIENCE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  takeyourtoken.app          tyt.foundation                  │
│  ├─ Mining Platform         ├─ Mission & Impact             │
│  ├─ Rewards Engine          ├─ aOi AI Chat                  │
│  ├─ Marketplace             ├─ Donation Portal              │
│  ├─ Academy                 ├─ Research Info                │
│  └─ Auto-Donate ──────────► └─ Real-Time Stats              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                  SYNC LAYER                                  │
│  • Supabase Realtime (WebSocket)                            │
│  • postMessage API (Cross-Domain)                           │
│  • Shared User Context                                      │
├─────────────────────────────────────────────────────────────┤
│                  DATA LAYER                                  │
│  • Supabase PostgreSQL (Single Instance)                    │
│  • 57 Tables (Shared)                                       │
│  • RLS Security Enabled                                     │
│  • Real-Time Enabled                                        │
├─────────────────────────────────────────────────────────────┤
│                  API LAYER                                   │
│  • Supabase Edge Functions (Deno)                           │
│  • aOi AI Endpoints                                         │
│  • Rate Limiting                                            │
│  • CORS Enabled                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 File Checklist Summary

**Copy to tyt.foundation**:

```bash
# Core (5 files)
✅ src/lib/supabase.ts
✅ src/lib/supabase-diagnostic.ts
✅ src/utils/foundationDataService.ts
✅ src/types/aoi.ts
✅ src/config/aoiConfig.ts

# aOi Components (7 files)
✅ src/components/AoiAvatar.tsx
✅ src/components/AoiChatWidget.tsx
✅ src/components/AoiCompactWidget.tsx
✅ src/components/AoiImage.tsx
✅ src/components/AoiBadgePill.tsx
✅ src/components/AoiFoundationBadge.tsx
✅ src/components/CrossDomainBridge.tsx

# aOi System (5 files)
✅ src/contexts/AoiContext.tsx
✅ src/contexts/AoiControlContext.tsx
✅ src/lib/aoiApiClient.ts
✅ src/lib/aoi/realtimeSync.ts
✅ src/lib/aoi/crossDomainSync.ts

# Foundation Components (3 files)
✅ src/pages/Foundation.tsx
✅ src/components/LiveFoundationTracker.tsx
✅ src/components/DonationWidget.tsx

# Edge Functions (8 files)
✅ supabase/functions/aoi-chat/index.ts
✅ supabase/functions/aoi-user-context/index.ts
✅ supabase/functions/aoi-status/index.ts
✅ supabase/functions/aoi-activity-log/index.ts
✅ supabase/functions/aoi-progress/index.ts
✅ supabase/functions/aoi-audit/index.ts
✅ supabase/functions/_shared/auth.ts
✅ supabase/functions/_shared/rateLimiter.ts

# Assets (3 files)
✅ public/aoi/aoi-portrait-ai-chat.png
✅ public/aoi/aoi-fullbody-welcome.png
✅ public/logo.png

# Total: 31 files to copy
```

---

## 🎯 Next Steps

1. **Day 1**: Copy core infrastructure + test database connection
2. **Day 2**: Copy Foundation data service + components
3. **Day 3**: Copy aOi system + test chat
4. **Day 4**: Deploy Edge Functions + test cross-domain
5. **Day 5**: Deploy to production + monitoring

---

## 🆘 Support

For issues during sync:

1. Check environment variables match exactly
2. Verify Supabase connection in both projects
3. Test Edge Functions with curl
4. Check browser console for errors
5. Review Supabase logs in dashboard

---

**Status**: ✅ Complete Guide Ready

**Estimated Time**: 2-3 days for full sync

**Complexity**: Medium (mostly copy-paste, some config tweaks)

---

Good luck with the synchronization! 🚀

**Contact**: dev@takeyourtoken.app
