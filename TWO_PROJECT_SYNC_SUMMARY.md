# 🔄 Two-Project Synchronization Summary

## 📊 Current State

### Project 1: takeyourtoken.app (Mining Platform)
- ✅ **Status**: Fully operational
- ✅ **Location**: bolt.new project 1
- ✅ **Purpose**: Web3 mining platform with NFT miners, rewards, marketplace
- ✅ **Database**: Supabase (57 tables, all working)
- ✅ **Features Complete**:
  - User authentication
  - NFT mining system
  - BTC rewards engine
  - Marketplace
  - Academy (learning platform)
  - Governance (veTYT)
  - Foundation integration (auto-donations)
  - aOi AI system (fully integrated)

### Project 2: tyt.foundation (Landing Page)
- 🔄 **Status**: Demo version (minimal)
- 🔄 **Location**: bolt.new project 2 (separate)
- 🔄 **Current**: https://tyt.foundation (basic header only)
- ⏳ **Needs**: Full Foundation features + aOi chat

---

## 🎯 Synchronization Goal

**Create unified ecosystem** where:
1. Both projects share **same Supabase database**
2. Real-time data syncs across domains
3. Users navigate seamlessly between sites
4. aOi AI works on both platforms
5. Donations from app → visible on Foundation site
6. Cross-domain authentication (optional but recommended)

---

## 📦 What to Copy from takeyourtoken.app → tyt.foundation

### Quick Reference (31 Files Total)

| Category | Files | Priority |
|----------|-------|----------|
| **Core Infrastructure** | 5 | 🔴 CRITICAL |
| **aOi AI System** | 12 | 🔴 HIGH |
| **Foundation Components** | 3 | 🟠 HIGH |
| **Edge Functions** | 8 | 🟡 MEDIUM |
| **Assets** | 3 | 🟢 LOW |

### Detailed Breakdown

#### 1️⃣ Core Infrastructure (CRITICAL - Copy First)
```bash
src/lib/supabase.ts                    # Supabase client
src/lib/supabase-diagnostic.ts         # Connection health
src/utils/foundationDataService.ts     # Foundation API service
src/types/aoi.ts                       # aOi types
src/config/aoiConfig.ts                # aOi configuration
```

#### 2️⃣ aOi AI System (12 Files)
```bash
# Components
src/components/AoiAvatar.tsx
src/components/AoiChatWidget.tsx
src/components/AoiCompactWidget.tsx
src/components/AoiImage.tsx
src/components/AoiBadgePill.tsx
src/components/AoiFoundationBadge.tsx
src/components/CrossDomainBridge.tsx

# Contexts & Services
src/contexts/AoiContext.tsx
src/contexts/AoiControlContext.tsx
src/lib/aoiApiClient.ts
src/lib/aoi/realtimeSync.ts
src/lib/aoi/crossDomainSync.ts
```

#### 3️⃣ Foundation Components (3 Files)
```bash
src/pages/Foundation.tsx               # Complete Foundation page
src/components/LiveFoundationTracker.tsx # Real-time stats
src/components/DonationWidget.tsx      # Donation form
```

#### 4️⃣ Edge Functions (8 Files)
```bash
supabase/functions/aoi-chat/index.ts
supabase/functions/aoi-user-context/index.ts
supabase/functions/aoi-status/index.ts
supabase/functions/aoi-activity-log/index.ts
supabase/functions/aoi-progress/index.ts
supabase/functions/aoi-audit/index.ts
supabase/functions/_shared/auth.ts
supabase/functions/_shared/rateLimiter.ts
```

#### 5️⃣ Assets (3 Files)
```bash
public/aoi/aoi-portrait-ai-chat.png
public/aoi/aoi-fullbody-welcome.png
public/logo.png
```

---

## 🔧 Configuration Changes for tyt.foundation

### .env Variables (SAME as takeyourtoken.app)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AOI_ENABLED=true
VITE_CROSS_DOMAIN_ENABLED=true
```

### aoiConfig.ts Modification
```typescript
// Change Foundation domain to SELF
foundation: {
  domain: 'https://tyt.foundation',    // ← SELF
  apiEndpoint: '/api/aoi',             // ← Local
}

// Keep app domain as external
app: {
  domain: 'https://takeyourtoken.app', // ← External
}

// Disable Foundation API fallback (we ARE Foundation)
features: {
  useFoundationApi: false,  // ← Important!
}
```

---

## 🚀 Quick Start Commands (tyt.foundation)

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js@^2.57.4
npm install lucide-react framer-motion
npm install react-router-dom
```

### Step 2: Create Directory Structure
```bash
mkdir -p src/lib src/types src/utils src/config
mkdir -p src/components src/contexts src/pages
mkdir -p public/aoi
mkdir -p supabase/functions/_shared
```

### Step 3: Copy Files
**Manual copy** from takeyourtoken.app bolt.new project to tyt.foundation project.

Use provided file list above. Maintain exact directory structure.

### Step 4: Update Imports
```typescript
// Change all relative imports to absolute:
import { supabase } from '../lib/supabase';
// To:
import { supabase } from '@/lib/supabase';
```

### Step 5: Deploy Edge Functions
```bash
supabase functions deploy aoi-chat
supabase functions deploy aoi-user-context
supabase functions deploy aoi-status
# ... deploy all 6 aOi functions
```

### Step 6: Test & Deploy
```bash
npm run build  # Test build
npm run dev    # Test locally
# Deploy to Vercel/Netlify
```

---

## 🔄 How Synchronization Works

### Real-Time Data Flow
```
User on takeyourtoken.app
    ↓
Makes donation → Supabase foundation_donations table
    ↓
Supabase Realtime broadcast (WebSocket)
    ↓
tyt.foundation subscription receives event
    ↓
UI updates automatically (< 100ms) ✅
```

### Cross-Domain Navigation
```
User on takeyourtoken.app
    ↓
Clicks "Visit Foundation" button
    ↓
CrossDomainBridge component:
  • Logs interaction
  • Adds aOi level/XP to URL
  • Sends postMessage
  • Opens tyt.foundation in new tab
    ↓
tyt.foundation loads with user context preserved ✅
```

---

## ✅ Verification Checklist

After copying files, verify:

### Database Connection
- [ ] Supabase client connects successfully
- [ ] Can query `foundation_campaigns` table
- [ ] Can query `aoi_user_progress` table
- [ ] RLS policies work

### Foundation Data Service
- [ ] `getOverallStats()` returns real data
- [ ] `getActiveCampaigns()` works
- [ ] Real-time subscriptions trigger updates

### aOi System
- [ ] Chat widget opens and renders
- [ ] Can send messages to aOi
- [ ] Messages saved to `aoi_conversations` table
- [ ] User progress tracked

### Edge Functions
- [ ] `/api/status` returns 200 OK
- [ ] `/api/aoi/chat` accepts POST
- [ ] CORS headers present
- [ ] Rate limiting works

### Cross-Domain
- [ ] CrossDomainBridge button navigates to app
- [ ] URL params preserved (aoi_level, aoi_xp)
- [ ] postMessage events fire correctly

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Shared Supabase Database                        │
│  • 57 Tables (Foundation, aOi, Academy, Mining)             │
│  • RLS Security Enabled                                      │
│  • Realtime Enabled                                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│ takeyourtoken.app   │  │  tyt.foundation     │
│ (bolt.new #1)       │  │  (bolt.new #2)      │
│                     │  │                     │
│ • Mining            │  │ • Mission           │
│ • Rewards           │  │ • aOi Chat          │
│ • Marketplace       │  │ • Donations         │
│ • Academy           │  │ • Impact Reports    │
│ • Auto-donate ───────►│ • Real-time Stats   │
└─────────────────────┘  └─────────────────────┘
         ▲                        │
         │    postMessage API     │
         └────────────────────────┘
             (Cross-Domain Sync)
```

---

## 🎯 Implementation Timeline

### Day 1: Core Setup (2-3 hours)
- [ ] Copy core infrastructure files
- [ ] Setup .env variables
- [ ] Test Supabase connection
- [ ] Copy foundationDataService.ts

### Day 2: Foundation Components (2-3 hours)
- [ ] Copy Foundation.tsx page
- [ ] Copy LiveFoundationTracker
- [ ] Copy DonationWidget
- [ ] Test real-time data display

### Day 3: aOi Integration (3-4 hours)
- [ ] Copy all aOi components
- [ ] Copy aOi contexts
- [ ] Copy aOi services
- [ ] Test chat widget

### Day 4: Edge Functions (2-3 hours)
- [ ] Copy Edge Functions
- [ ] Deploy to Supabase
- [ ] Test API endpoints
- [ ] Verify CORS and rate limiting

### Day 5: Cross-Domain & Deploy (2-3 hours)
- [ ] Implement CrossDomainBridge
- [ ] Test cross-domain navigation
- [ ] Test postMessage sync
- [ ] Deploy to production (Vercel/Netlify)

**Total Estimated Time**: 2-3 days (11-16 hours)

---

## 📚 Documentation Files Created

All documentation is in `takeyourtoken.app/docs/`:

1. **COPY_TO_TYT_FOUNDATION.md** - Original file list
2. **TYT_FOUNDATION_SYNC_COMPLETE_GUIDE.md** - Complete sync guide (NEW)
3. **TWO_PROJECT_SYNC_SUMMARY.md** - This file (executive summary)

**Related Documentation**:
- `AOI_INTEGRATION_COMPLETE.md` - aOi full integration details
- `AOI_FOUNDATION_BRIDGE.md` - Cross-domain architecture
- `FOUNDATION_API_COORDINATION.md` - API coordination

---

## 🆘 Common Issues & Solutions

### Issue: "Module not found: @supabase/supabase-js"
**Solution**: `npm install @supabase/supabase-js`

### Issue: "Database connection failed"
**Solution**:
- Verify `.env` variables match takeyourtoken.app exactly
- Check Supabase URL and ANON_KEY are correct
- Test: `console.log(import.meta.env.VITE_SUPABASE_URL)`

### Issue: "aOi chat not responding"
**Solution**:
- Test Edge Function: `curl https://[project-id].supabase.co/functions/v1/aoi-status`
- Check function logs: `supabase functions logs aoi-chat`
- Verify CORS headers in function

### Issue: "Real-time not working"
**Solution**:
- Enable Realtime in Supabase Dashboard for all Foundation tables
- Check subscription code: `supabase.channel('foundation_realtime').subscribe()`
- Verify RLS policies allow SELECT for authenticated users

---

## 🎉 Success Criteria

When sync is complete, you should be able to:

✅ Visit tyt.foundation and see real-time Foundation stats
✅ Chat with aOi on Foundation site
✅ Make donation on takeyourtoken.app → see update on Foundation instantly
✅ Navigate between domains with user context preserved
✅ See same data on both sites (single source of truth)

---

## 🚀 Next Actions

**For tyt.foundation project in bolt.new:**

1. Open bolt.new project for tyt.foundation
2. Start with **Day 1** tasks (core infrastructure)
3. Follow `TYT_FOUNDATION_SYNC_COMPLETE_GUIDE.md` step-by-step
4. Test thoroughly after each day
5. Deploy to production when complete

**Use this summary as quick reference, full guide for detailed steps.**

---

**Status**: ✅ Documentation Complete

**Owner**: takeyourtoken.app development team

**Contact**: dev@takeyourtoken.app

---

Good luck with the sync! 🚀💙
