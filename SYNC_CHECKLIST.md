# ✅ TYT Foundation Sync Checklist

## 🎯 Quick Overview

**From**: takeyourtoken.app (this project)
**To**: tyt.foundation (bolt.new project 2)
**Goal**: Share database, components, and create unified ecosystem
**Time**: 2-3 days (11-16 hours)

---

## 📋 Pre-Flight Checklist

### Supabase Configuration
- [ ] Open Supabase dashboard
- [ ] Copy Project URL: `https://____________.supabase.co`
- [ ] Copy Anon Key: `eyJhbGciOiJI_______________`
- [ ] Copy Service Role Key (for Edge Functions)
- [ ] Note Project ID: `____________`

---

## 📦 Day 1: Core Infrastructure (2-3 hours)

### Step 1.1: Environment Variables
**In tyt.foundation bolt.new project**:

```bash
# Add to .env file:
VITE_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
VITE_AOI_ENABLED=true
VITE_CROSS_DOMAIN_ENABLED=true
VITE_APP_DOMAIN=https://takeyourtoken.app
VITE_FOUNDATION_DOMAIN=https://tyt.foundation

# For AI features:
OPENAI_API_KEY=sk-[YOUR_KEY]
```

**Checklist**:
- [ ] Created .env file
- [ ] Added all variables
- [ ] Values match takeyourtoken.app exactly

---

### Step 1.2: Install Dependencies

```bash
npm install @supabase/supabase-js@^2.57.4
npm install lucide-react
npm install framer-motion
npm install react-router-dom
```

**Checklist**:
- [ ] Dependencies installed
- [ ] No errors in terminal
- [ ] package.json updated

---

### Step 1.3: Copy Core Files (5 files)

**Create directories first**:
```bash
mkdir -p src/lib src/types src/utils src/config
```

**Copy these files** (maintain exact content):

| # | From (takeyourtoken.app) | To (tyt.foundation) | Status |
|---|-------------------------|---------------------|--------|
| 1 | `src/lib/supabase.ts` | `src/lib/supabase.ts` | [ ] |
| 2 | `src/lib/supabase-diagnostic.ts` | `src/lib/supabase-diagnostic.ts` | [ ] |
| 3 | `src/utils/foundationDataService.ts` | `src/lib/foundationDataService.ts` | [ ] |
| 4 | `src/types/aoi.ts` | `src/types/aoi.ts` | [ ] |
| 5 | `src/config/aoiConfig.ts` | `src/config/aoiConfig.ts` | [ ] |

**After copying aoiConfig.ts, modify**:
```typescript
// Line 15-17, change:
foundation: {
  domain: 'https://tyt.foundation',    // ← SELF
  apiEndpoint: '/api/aoi',             // ← Local
}

// Line 45-49, change:
features: {
  useFoundationApi: false,  // ← Important! We ARE Foundation
  fallbackToLocal: false,
}
```

**After copying foundationDataService.ts, update import**:
```typescript
// Line 1, change:
import { supabase } from '../lib/supabase';
// To:
import { supabase } from './supabase';
```

**Checklist**:
- [ ] All 5 files copied
- [ ] aoiConfig.ts modified
- [ ] foundationDataService.ts import updated
- [ ] No TypeScript errors

---

### Step 1.4: Test Database Connection

Create `src/lib/test-connection.ts`:
```typescript
import { supabase } from './supabase';

export async function testConnection() {
  console.log('🔍 Testing Supabase connection...');

  const { data, error } = await supabase
    .from('foundation_campaigns')
    .select('id, title')
    .limit(1);

  if (error) {
    console.error('❌ Failed:', error.message);
    return false;
  }

  console.log('✅ Connected! Found:', data);
  return true;
}

// Run immediately
testConnection();
```

**Test**:
```bash
npx tsx src/lib/test-connection.ts
```

**Expected output**:
```
🔍 Testing Supabase connection...
✅ Connected! Found: [...]
```

**Checklist**:
- [ ] Test file created
- [ ] Test runs successfully
- [ ] Database returns data
- [ ] No connection errors

---

## 📦 Day 2: Foundation Components (2-3 hours)

### Step 2.1: Copy Foundation Page

```bash
mkdir -p src/pages
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `src/pages/Foundation.tsx` | `src/pages/Foundation.tsx` | [ ] |

**Update imports** (if needed):
```typescript
// Change all '../' paths to '@/' paths
import { foundationDataService } from '@/lib/foundationDataService';
```

**Checklist**:
- [ ] Foundation.tsx copied
- [ ] Imports updated
- [ ] Component renders without errors

---

### Step 2.2: Copy Foundation Components (3 files)

```bash
mkdir -p src/components
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `src/components/LiveFoundationTracker.tsx` | `src/components/LiveFoundationTracker.tsx` | [ ] |
| 2 | `src/components/DonationWidget.tsx` | `src/components/DonationWidget.tsx` | [ ] |
| 3 | `src/components/ImpactReportsDashboard.tsx` | `src/components/ImpactReportsDashboard.tsx` | [ ] |

**For each component, update imports**:
- `'../lib/supabase'` → `'@/lib/supabase'`
- `'../utils/foundationDataService'` → `'@/lib/foundationDataService'`
- Remove any Auth context dependencies (use direct supabase.auth)

**Checklist**:
- [ ] All 3 components copied
- [ ] Imports updated
- [ ] Components compile without errors
- [ ] Can render in test page

---

### Step 2.3: Setup Router

Create `src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Foundation from './pages/Foundation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Foundation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

Update `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Checklist**:
- [ ] App.tsx created
- [ ] main.tsx updated
- [ ] Router working
- [ ] Foundation page loads at /

---

### Step 2.4: Test Build

```bash
npm run build
```

**Expected**: Build succeeds with no errors.

**Checklist**:
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] dist/ folder created
- [ ] File sizes reasonable

---

## 📦 Day 3: aOi AI System (3-4 hours)

### Step 3.1: Copy aOi Components (7 files)

```bash
mkdir -p src/components
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `src/components/AoiAvatar.tsx` | `src/components/AoiAvatar.tsx` | [ ] |
| 2 | `src/components/AoiChatWidget.tsx` | `src/components/AoiChatWidget.tsx` | [ ] |
| 3 | `src/components/AoiCompactWidget.tsx` | `src/components/AoiCompactWidget.tsx` | [ ] |
| 4 | `src/components/AoiImage.tsx` | `src/components/AoiImage.tsx` | [ ] |
| 5 | `src/components/AoiBadgePill.tsx` | `src/components/AoiBadgePill.tsx` | [ ] |
| 6 | `src/components/AoiFoundationBadge.tsx` | `src/components/AoiFoundationBadge.tsx` | [ ] |
| 7 | `src/components/CrossDomainBridge.tsx` | `src/components/CrossDomainBridge.tsx` | [ ] |

**Update imports in each file**:
- `'../contexts/'` → `'@/contexts/'`
- `'../lib/'` → `'@/lib/'`
- `'../config/'` → `'@/config/'`

**Checklist**:
- [ ] All 7 components copied
- [ ] Imports updated
- [ ] Components compile
- [ ] No missing dependencies

---

### Step 3.2: Copy aOi Contexts (2 files)

```bash
mkdir -p src/contexts
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `src/contexts/AoiContext.tsx` | `src/contexts/AoiContext.tsx` | [ ] |
| 2 | `src/contexts/AoiControlContext.tsx` | `src/contexts/AoiControlContext.tsx` | [ ] |

**Update imports**.

**Checklist**:
- [ ] Both contexts copied
- [ ] Imports updated
- [ ] Contexts work

---

### Step 3.3: Copy aOi Services (3 files)

```bash
mkdir -p src/lib/aoi
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `src/lib/aoiApiClient.ts` | `src/lib/aoiApiClient.ts` | [ ] |
| 2 | `src/lib/aoi/realtimeSync.ts` | `src/lib/aoi/realtimeSync.ts` | [ ] |
| 3 | `src/lib/aoi/crossDomainSync.ts` | `src/lib/aoi/crossDomainSync.ts` | [ ] |

**Checklist**:
- [ ] All 3 files copied
- [ ] Imports updated
- [ ] No errors

---

### Step 3.4: Copy Assets

```bash
mkdir -p public/aoi
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `public/aoi/aoi-portrait-ai-chat.png` | `public/aoi/aoi-portrait-ai-chat.png` | [ ] |
| 2 | `public/aoi/aoi-fullbody-welcome.png` | `public/aoi/aoi-fullbody-welcome.png` | [ ] |
| 3 | `public/logo.png` | `public/logo.png` | [ ] |

**Checklist**:
- [ ] All 3 images copied
- [ ] Images load correctly
- [ ] No 404 errors

---

### Step 3.5: Test aOi Chat

Add to a test page:
```typescript
import AoiChatWidget from '@/components/AoiChatWidget';

<AoiChatWidget />
```

**Checklist**:
- [ ] Chat widget renders
- [ ] Can type messages
- [ ] No console errors
- [ ] API endpoint configured

---

## 📦 Day 4: Edge Functions (2-3 hours)

### Step 4.1: Copy Edge Functions (8 files)

```bash
mkdir -p supabase/functions/_shared
mkdir -p supabase/functions/aoi-chat
mkdir -p supabase/functions/aoi-user-context
mkdir -p supabase/functions/aoi-status
mkdir -p supabase/functions/aoi-activity-log
mkdir -p supabase/functions/aoi-progress
mkdir -p supabase/functions/aoi-audit
```

| # | From | To | Status |
|---|------|-----|--------|
| 1 | `supabase/functions/_shared/auth.ts` | `supabase/functions/_shared/auth.ts` | [ ] |
| 2 | `supabase/functions/_shared/rateLimiter.ts` | `supabase/functions/_shared/rateLimiter.ts` | [ ] |
| 3 | `supabase/functions/aoi-chat/index.ts` | `supabase/functions/aoi-chat/index.ts` | [ ] |
| 4 | `supabase/functions/aoi-user-context/index.ts` | `supabase/functions/aoi-user-context/index.ts` | [ ] |
| 5 | `supabase/functions/aoi-status/index.ts` | `supabase/functions/aoi-status/index.ts` | [ ] |
| 6 | `supabase/functions/aoi-activity-log/index.ts` | `supabase/functions/aoi-activity-log/index.ts` | [ ] |
| 7 | `supabase/functions/aoi-progress/index.ts` | `supabase/functions/aoi-progress/index.ts` | [ ] |
| 8 | `supabase/functions/aoi-audit/index.ts` | `supabase/functions/aoi-audit/index.ts` | [ ] |

**Checklist**:
- [ ] All 8 function files copied
- [ ] Directory structure correct
- [ ] No syntax errors

---

### Step 4.2: Deploy Edge Functions

**Login to Supabase CLI**:
```bash
npx supabase login
npx supabase link --project-ref [YOUR_PROJECT_ID]
```

**Deploy each function**:
```bash
npx supabase functions deploy aoi-chat
npx supabase functions deploy aoi-user-context
npx supabase functions deploy aoi-status
npx supabase functions deploy aoi-activity-log
npx supabase functions deploy aoi-progress
npx supabase functions deploy aoi-audit
```

**Verify deployment**:
```bash
npx supabase functions list
```

**Expected output**:
```
aoi-chat         deployed
aoi-user-context deployed
aoi-status       deployed
...
```

**Checklist**:
- [ ] CLI logged in
- [ ] Project linked
- [ ] All functions deployed
- [ ] No deployment errors

---

### Step 4.3: Test Edge Functions

**Test status endpoint**:
```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/aoi-status
```

**Expected**:
```json
{"status":"healthy","timestamp":"..."}
```

**Test chat endpoint**:
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/aoi-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{"message":"Hello aOi"}'
```

**Checklist**:
- [ ] Status endpoint returns 200 OK
- [ ] Chat endpoint responds
- [ ] CORS headers present
- [ ] No 500 errors

---

## 📦 Day 5: Cross-Domain & Deploy (2-3 hours)

### Step 5.1: Test Cross-Domain Navigation

**In takeyourtoken.app**, add button:
```typescript
<a href="https://tyt.foundation" target="_blank">
  Visit Foundation
</a>
```

**In tyt.foundation**, add button:
```typescript
<a href="https://takeyourtoken.app" target="_blank">
  Visit Mining App
</a>
```

**Checklist**:
- [ ] Links work both ways
- [ ] Pages load correctly
- [ ] No CORS errors

---

### Step 5.2: Test Real-Time Sync

**Open two browser tabs**:
1. Tab 1: tyt.foundation (homepage with live stats)
2. Tab 2: takeyourtoken.app (simulate donation)

**Simulate donation** in Supabase SQL Editor:
```sql
INSERT INTO foundation_donations (
  amount_usd,
  asset,
  source,
  status,
  tx_hash
) VALUES (
  100,
  'USDT',
  'direct',
  'completed',
  'test-' || gen_random_uuid()
);
```

**Expected**: Tab 1 updates within 1 second.

**Checklist**:
- [ ] Real-time subscription active
- [ ] Stats update automatically
- [ ] Latency < 1 second
- [ ] No errors in console

---

### Step 5.3: Deploy to Production

**Option A: Vercel**
```bash
# In tyt.foundation project
vercel init
vercel --prod
```

**Add environment variables in Vercel Dashboard**:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- OPENAI_API_KEY
- All other .env variables

**Option B: Netlify**
```bash
netlify init
netlify deploy --prod
```

**Checklist**:
- [ ] Domain connected (tyt.foundation)
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Site accessible

---

### Step 5.4: DNS Configuration

**Add DNS records**:
```
A     @      [Vercel/Netlify IP]
CNAME www    [deployment-url]
```

**Checklist**:
- [ ] DNS records added
- [ ] Propagation complete (24-48h)
- [ ] HTTPS working
- [ ] www redirect working

---

## ✅ Final Verification

### Functionality Tests

| Test | Status |
|------|--------|
| Homepage loads with real stats | [ ] |
| Foundation page displays campaigns | [ ] |
| Donation widget accepts input | [ ] |
| aOi chat responds to messages | [ ] |
| Real-time updates work | [ ] |
| Cross-domain navigation smooth | [ ] |
| Mobile responsive | [ ] |
| Images load correctly | [ ] |

---

### Performance Tests

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Lighthouse Performance | >90 | ___ | [ ] |
| First Contentful Paint | <1.5s | ___ | [ ] |
| Time to Interactive | <3s | ___ | [ ] |
| API Response Time | <500ms | ___ | [ ] |

---

### Security Tests

| Test | Status |
|------|--------|
| HTTPS active on both domains | [ ] |
| CORS properly configured | [ ] |
| RLS policies enforced | [ ] |
| No API keys exposed in client | [ ] |
| Auth tokens validated | [ ] |

---

## 🎉 Completion

When all checkboxes above are ticked:

✅ **Synchronization Complete!**

Both projects now share:
- ✅ Same Supabase database
- ✅ Real-time data sync
- ✅ Cross-domain navigation
- ✅ Unified aOi AI system
- ✅ Shared Foundation components

---

## 📚 Reference Documentation

- **Full Guide**: `/docs/TYT_FOUNDATION_SYNC_COMPLETE_GUIDE.md`
- **Quick Summary**: `/docs/TWO_PROJECT_SYNC_SUMMARY.md`
- **File List**: `/docs/COPY_TO_TYT_FOUNDATION.md`

---

## 🆘 Quick Troubleshooting

**Database connection fails**:
→ Check .env variables match exactly

**API returns 401**:
→ Verify ANON_KEY is correct

**Real-time not working**:
→ Enable Realtime in Supabase Dashboard

**Build fails**:
→ Check all imports resolved

**Edge Function 500 error**:
→ Check function logs: `supabase functions logs aoi-chat`

---

**Time to complete**: Approximately 11-16 hours over 5 days

**Difficulty**: Medium (mostly copy-paste with config tweaks)

**Last updated**: 2025-01-15

Good luck! 🚀
