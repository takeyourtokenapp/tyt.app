# 🚀 Complete Deployment & Synchronization Guide

**takeyourtoken.app ↔ tyt.foundation**

## 🎯 Overview

This is the master guide for deploying and synchronizing both TYT platform domains with shared database, ensuring seamless cross-domain functionality and data integrity.

---

## 📊 Current Status

### ✅ Completed Components

#### takeyourtoken.app
- ✅ Full platform deployed
- ✅ Database schema complete (108+ migrations)
- ✅ aOi system integrated
- ✅ Foundation integration complete
- ✅ Cross-domain navigation ready
- ✅ RLS policies enforced
- ✅ Real-time subscriptions active

#### Shared Database (Supabase)
- ✅ Instance: `https://xyoaobelwkmrncvktrkv.supabase.co`
- ✅ All migrations applied
- ✅ Foundation tables created
- ✅ aOi tables created
- ✅ RLS enabled on all tables
- ✅ Indexes optimized
- ✅ Functions and triggers active

#### Documentation
- ✅ API Gateway guide
- ✅ Cross-domain navigation system
- ✅ Environment secrets management
- ✅ Security policies
- ✅ Sync strategy

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  SHARED SUPABASE DATABASE                                │
│  https://xyoaobelwkmrncvktrkv.supabase.co               │
│                                                           │
│  Tables:                                                  │
│  ├─ profiles, users (auth)                              │
│  ├─ foundation_* (9 tables)                             │
│  ├─ aoi_* (6 tables)                                    │
│  ├─ miners, rewards, marketplace                        │
│  ├─ academy, community, governance                      │
│  └─ ... (108 total migrations)                          │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐      ┌──────────────────┐
│takeyourtoken.app │◄────►│  tyt.foundation  │
│                  │ API  │                  │
│  Main Platform   │Bridge│  Landing + AI    │
│  - Mining        │      │  - About aOi     │
│  - Marketplace   │      │  - Foundation    │
│  - Academy       │      │  - Research      │
│  - Wallet        │      │  - Donations     │
│  - Dashboard     │      │  - AI Chat API   │
└──────────────────┘      └──────────────────┘
```

---

## 📋 Pre-Deployment Checklist

### Both Domains

- [ ] **Environment Variables**
  - [ ] VITE_SUPABASE_URL matches
  - [ ] VITE_SUPABASE_ANON_KEY matches
  - [ ] Cross-domain URLs configured
  - [ ] API keys secured (server-only)

- [ ] **Database**
  - [ ] All migrations applied
  - [ ] RLS policies tested
  - [ ] Indexes created
  - [ ] Functions working

- [ ] **Security**
  - [ ] CORS headers configured
  - [ ] CSP headers set
  - [ ] Secrets not in Git
  - [ ] Rate limiting enabled

- [ ] **Testing**
  - [ ] Build passes locally
  - [ ] No TypeScript errors
  - [ ] API endpoints functional
  - [ ] Auth flow working

---

## 🚀 Deployment Steps

### Phase 1: Verify Database (takeyourtoken.app)

#### Step 1.1: Check Applied Migrations

```bash
# Connect to Supabase
cd /tmp/cc-agent/61475162/project

# Verify migrations
npm run supabase:list-migrations

# Expected: 108+ migrations applied
```

#### Step 1.2: Test Database Connections

```typescript
// Test from takeyourtoken.app
import { supabase } from './src/lib/supabase';

// Test 1: Basic query
const { data, error } = await supabase
  .from('profiles')
  .select('id')
  .limit(1);

console.log('DB Connection:', error ? 'FAILED' : 'OK');

// Test 2: Foundation tables
const { data: campaigns } = await supabase
  .from('foundation_campaigns')
  .select('*')
  .limit(1);

console.log('Foundation tables:', campaigns ? 'OK' : 'MISSING');

// Test 3: aOi tables
const { data: progress } = await supabase
  .from('aoi_user_progress')
  .select('*')
  .limit(1);

console.log('aOi tables:', progress !== null ? 'OK' : 'MISSING');
```

#### Step 1.3: Verify RLS Policies

```sql
-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'foundation_%' OR tablename LIKE 'aoi_%';

-- Should return: rowsecurity = true for all
```

### Phase 2: Deploy takeyourtoken.app

#### Step 2.1: Build Production

```bash
cd /tmp/cc-agent/61475162/project

# Install dependencies
npm install

# Type check
npm run typecheck

# Build
npm run build

# Expected: ✓ built in ~20s, no errors
```

#### Step 2.2: Deploy to Vercel/Netlify

```bash
# Option A: Vercel
vercel --prod

# Option B: Netlify
netlify deploy --prod

# Option C: Manual
# Upload dist/ folder to hosting provider
```

#### Step 2.3: Configure Environment Variables on Host

**Vercel Dashboard** → Settings → Environment Variables

```
VITE_SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_FOUNDATION_DOMAIN=https://tyt.foundation
VITE_APP_DOMAIN=https://takeyourtoken.app
VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

#### Step 2.4: Verify Deployment

```bash
# Test production site
curl https://takeyourtoken.app/api/health
# Expected: 200 OK

# Test database connection from production
# Open browser console on https://takeyourtoken.app
# Run: await fetch('/api/test-db').then(r => r.json())
```

### Phase 3: Setup tyt.foundation

#### Step 3.1: Create New Project (bolt.new or local)

```bash
# Option A: Next.js (Recommended)
npx create-next-app@latest tyt-foundation --typescript --tailwind --app

cd tyt-foundation

# Option B: Use bolt.new
# Create new project at https://bolt.new
# Name: tyt.foundation
```

#### Step 3.2: Configure Environment Variables

**File**: `tyt.foundation/.env`

```env
# CRITICAL: Must match takeyourtoken.app exactly
NEXT_PUBLIC_SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider
OPENAI_API_KEY=sk-proj-...

# Cross-domain
NEXT_PUBLIC_APP_DOMAIN=https://takeyourtoken.app
NEXT_PUBLIC_FOUNDATION_DOMAIN=https://tyt.foundation

# Email
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@tyt.foundation
```

#### Step 3.3: Copy Shared Code

```bash
# From takeyourtoken.app to tyt.foundation

# Supabase client
cp src/lib/supabase.ts → tyt-foundation/lib/supabase.ts

# Foundation data service
cp src/utils/foundationDataService.ts → tyt-foundation/lib/foundationService.ts

# Cross-domain navigation (reverse)
cp src/lib/crossDomainNav.ts → tyt-foundation/lib/crossDomainNav.ts

# Types
cp src/types/database.ts → tyt-foundation/types/database.ts
cp src/types/aoi.ts → tyt-foundation/types/aoi.ts
```

#### Step 3.4: Create API Routes

Create these files in `tyt.foundation/app/api/`:

1. **aoi/chat/route.ts** (AI chat endpoint) - See [CROSS_DOMAIN_API_GATEWAY.md](./CROSS_DOMAIN_API_GATEWAY.md)
2. **foundation/stats/route.ts** (Foundation statistics)
3. **donations/recent/route.ts** (Recent donations feed)
4. **health/route.ts** (Health check endpoint)

#### Step 3.5: Build and Deploy tyt.foundation

```bash
cd tyt-foundation

# Build
npm run build

# Deploy
vercel --prod
# or
netlify deploy --prod
```

### Phase 4: Configure Cross-Domain Communication

#### Step 4.1: Enable CORS on tyt.foundation APIs

**File**: `tyt.foundation/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', 'https://takeyourtoken.app');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Info');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

#### Step 4.2: Update Supabase Auth Settings

**Supabase Dashboard** → Authentication → URL Configuration

```
Site URL: https://takeyourtoken.app

Redirect URLs:
- https://takeyourtoken.app/**
- https://tyt.foundation/**
- http://localhost:5173/**
- http://localhost:3000/**
```

#### Step 4.3: Test Cross-Domain Communication

```javascript
// From takeyourtoken.app console:
fetch('https://tyt.foundation/api/health')
  .then(r => r.json())
  .then(console.log);

// Expected: {status: 'operational', services: {...}}

// Test aOi chat
fetch('https://tyt.foundation/api/aoi/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What is TYT?',
    context: {},
  }),
})
  .then(r => r.json())
  .then(console.log);

// Expected: {response: 'AI response...', user_level: 1, ...}
```

### Phase 5: Implement Navigation Links

#### Step 5.1: Update takeyourtoken.app Links

```typescript
// src/components/Header.tsx
import { foundationLinks } from '@/lib/crossDomainNav';

<nav>
  <a onClick={() => foundationLinks.home()}>Foundation</a>
  <a onClick={() => foundationLinks.aoi()}>Meet aOi</a>
  <a onClick={() => foundationLinks.donate()}>Donate</a>
  <a onClick={() => foundationLinks.research()}>Research</a>
</nav>
```

#### Step 5.2: Update tyt.foundation Links

```typescript
// tyt-foundation/components/Header.tsx
import { appLinks } from '@/lib/crossDomainNav';

<nav>
  <a onClick={() => appLinks.home()}>Platform</a>
  <a onClick={() => appLinks.signup()}>Sign Up</a>
  <a onClick={() => appLinks.dashboard()}>Dashboard</a>
  <a onClick={() => appLinks.academy()}>Academy</a>
</nav>
```

### Phase 6: Enable Real-Time Sync

#### Step 6.1: Subscribe to Donations (both sites)

```typescript
// On both takeyourtoken.app and tyt.foundation
import { supabase } from '@/lib/supabase';

const donationsChannel = supabase
  .channel('donations_feed')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'foundation_donations',
    filter: 'status=eq.completed',
  }, (payload) => {
    // Update UI with new donation
    addDonationToFeed({
      amount: payload.new.amount_usd,
      currency: payload.new.asset,
      timestamp: payload.new.created_at,
    });
  })
  .subscribe();

// Cleanup on unmount
return () => {
  supabase.removeChannel(donationsChannel);
};
```

#### Step 6.2: Subscribe to aOi Progress

```typescript
// Sync user progress across domains
const userId = 'user_id_here';

const progressChannel = supabase
  .channel('aoi_progress')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'aoi_user_progress',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    // Update local state
    setUserLevel(payload.new.level);
    setUserXP(payload.new.experience_points);
  })
  .subscribe();
```

---

## 🧪 Testing Procedure

### Test 1: Database Connectivity

```bash
# Test from both domains
curl https://takeyourtoken.app/api/health
curl https://tyt.foundation/api/health

# Both should return: {"status":"operational"}
```

### Test 2: Authentication Flow

```
1. Sign up on takeyourtoken.app
2. Verify email (if enabled)
3. Click "Visit Foundation"
4. Check: Should be logged in on tyt.foundation
5. Click "Go to Dashboard"
6. Check: Should be logged in on takeyourtoken.app
```

### Test 3: Cross-Domain API

```javascript
// From takeyourtoken.app
const response = await fetch('https://tyt.foundation/api/foundation/stats');
const stats = await response.json();

console.log(stats);
// Expected: {total_raised_usd: ..., active_campaigns: ...}
```

### Test 4: Real-Time Sync

```
1. Make donation on takeyourtoken.app
2. Check: Donation appears on tyt.foundation feed within 1 second
3. Complete lesson on takeyourtoken.app Academy
4. Check: XP updates on both sites
```

### Test 5: Navigation

```
1. Click "Meet aOi" on takeyourtoken.app
2. Check: Navigates to tyt.foundation/aoi
3. Check: Auth token passed (if logged in)
4. Click "Start Mining" on tyt.foundation
5. Check: Navigates to takeyourtoken.app
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Set up monitoring (every 5 minutes)
curl https://takeyourtoken.app/api/health
curl https://tyt.foundation/api/health

# Alert if status !== 'operational'
```

### Database Monitoring

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Error Tracking

```typescript
// Setup Sentry on both sites
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 🚨 Troubleshooting

### Issue: CORS Errors

**Symptom**: `Access to fetch at '...' has been blocked by CORS policy`

**Solution**:
1. Check middleware.ts on tyt.foundation
2. Verify CORS headers include takeyourtoken.app
3. Add OPTIONS handler to API routes
4. Clear browser cache

### Issue: Database Connection Failed

**Symptom**: `Connection to database failed`

**Solution**:
1. Verify VITE_SUPABASE_URL is correct
2. Check anon key is valid
3. Test connection from Supabase Dashboard
4. Verify RLS policies aren't blocking

### Issue: Auth Token Not Passing

**Symptom**: User logged out when switching domains

**Solution**:
1. Check crossDomainNav.ts implementation
2. Verify token in URL params
3. Add auth callback handler
4. Check Supabase redirect URLs

### Issue: Real-Time Not Working

**Symptom**: Updates don't appear live

**Solution**:
1. Enable Realtime in Supabase Dashboard
2. Check subscription code
3. Verify RLS allows SELECT
4. Test with manual INSERT

---

## 📋 Post-Deployment Checklist

### takeyourtoken.app

- [ ] Site loads correctly
- [ ] Auth flow works (signup, login, logout)
- [ ] Dashboard displays data
- [ ] Mining operations functional
- [ ] Marketplace accessible
- [ ] Academy lessons load
- [ ] Wallet shows balances
- [ ] Foundation links work
- [ ] aOi chat functional
- [ ] Real-time updates work

### tyt.foundation

- [ ] Site loads correctly
- [ ] About page displays
- [ ] aOi chat API responds
- [ ] Donation widget functional
- [ ] Foundation stats load
- [ ] Research page displays
- [ ] Grants page accessible
- [ ] Links to app work
- [ ] Real-time feed updates
- [ ] CORS working

### Cross-Domain

- [ ] Navigation seamless
- [ ] Auth tokens pass correctly
- [ ] API calls succeed
- [ ] Real-time sync works
- [ ] No CORS errors
- [ ] Performance acceptable (<500ms)

---

## 📚 Related Documentation

- [CROSS_DOMAIN_API_GATEWAY.md](./CROSS_DOMAIN_API_GATEWAY.md)
- [ENVIRONMENT_SECRETS_MANAGEMENT.md](./ENVIRONMENT_SECRETS_MANAGEMENT.md)
- [TYT_FOUNDATION_SYNC_GUIDE.md](./TYT_FOUNDATION_SYNC_GUIDE.md)
- [SECURITY.md](../SECURITY.md)

---

## 🎯 Success Criteria

✅ **Both sites deployed and operational**
✅ **Shared database functioning correctly**
✅ **Cross-domain navigation seamless**
✅ **API communication working**
✅ **Real-time sync functional**
✅ **Security measures in place**
✅ **Monitoring and alerts configured**
✅ **Documentation complete**

---

**Status**: Implementation Ready
**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Deployment Owner**: TYT DevOps Team
