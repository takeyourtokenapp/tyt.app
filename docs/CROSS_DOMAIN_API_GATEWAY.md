# 🌉 Cross-Domain API Gateway & Portal System

**takeyourtoken.app ↔ tyt.foundation**

## 🎯 Overview

This document describes the complete API gateway and cross-domain communication system between the two TYT domains, ensuring secure, seamless data flow and user experience.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│             Shared Supabase Database (Single Source)          │
│  - Users & Auth (auth.users, profiles)                        │
│  - Foundation Data (foundation_*)                             │
│  - aOi System (aoi_*)                                         │
│  - Mining & Rewards (miners, rewards_*)                       │
│  - All business logic tables                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌──────────────────┐    ┌──────────────────┐
│ takeyourtoken.app│◄──►│  tyt.foundation  │
│  (Main Platform) │    │  (Landing + AI)  │
└──────────────────┘    └──────────────────┘
          │                     │
          │    Cross-Domain     │
          │   Communication:    │
          │   - Shared Auth     │
          │   - API Bridge      │
          │   - Deep Links      │
          │   - postMessage     │
          └─────────────────────┘
```

---

## 📊 Database Schema Status

### ✅ Foundation Tables (Ready)
```
foundation_campaigns
foundation_donations
foundation_donation_receipts
foundation_grants
foundation_grant_milestones
foundation_research_partners
foundation_family_support
foundation_impact_metrics
foundation_transparency_reports
```

### ✅ aOi System Tables (Applied)
```
aoi_user_progress
aoi_guardian_consents
aoi_achievements
aoi_interactions
aoi_conversations
aoi_messages
```

### 🔒 Security Features
- ✅ RLS enabled on all tables
- ✅ User-specific policies
- ✅ Cross-domain auth support
- ✅ Audit logging enabled

---

## 🔐 Authentication & Session Management

### Current Configuration

**Supabase Instance**: `https://xyoaobelwkmrncvktrkv.supabase.co`

Both domains MUST use:
```env
VITE_SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Session Sharing Strategy

#### Option 1: JWT Token Passing (Recommended)
```typescript
// From takeyourtoken.app
async function redirectToFoundation(path: string) {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const url = new URL(`https://tyt.foundation${path}`);
    url.searchParams.set('token', session.access_token);
    url.searchParams.set('refresh_token', session.refresh_token);
    window.location.href = url.toString();
  } else {
    window.location.href = `https://tyt.foundation${path}`;
  }
}
```

#### Option 2: Supabase Native Cross-Domain Auth
```typescript
// Configure in Supabase Dashboard
// Auth > URL Configuration
// Site URL: https://takeyourtoken.app
// Additional Redirect URLs:
//   - https://tyt.foundation/auth/callback
//   - https://tyt.foundation/*
```

---

## 🚀 API Gateway Implementation

### For tyt.foundation

Create these Edge Functions or API routes:

#### 1. `/api/aoi/chat` - AI Chat Endpoint

**File**: `tyt.foundation/app/api/aoi/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Get auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get request body
    const { message, context } = await req.json();

    // Get user progress
    const { data: progress } = await supabase
      .from('aoi_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Build AI prompt with context
    const systemPrompt = `You are aOi, an empathetic AI guide for TYT platform.
User Level: ${progress?.level || 1}
User XP: ${progress?.experience_points || 0}

Mission: Help users learn about Web3, crypto, and blockchain while supporting children with brain cancer.

Guidelines:
- Be encouraging and patient
- Explain concepts simply
- Connect learning to Foundation mission
- Celebrate progress`;

    // Call OpenAI (or your AI provider)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const aiData = await aiResponse.json();
    const response = aiData.choices?.[0]?.message?.content;

    // Save interaction
    await supabase.from('aoi_interactions').insert({
      user_id: user.id,
      interaction_type: 'chat',
      agent_called: 'openai-gpt4',
      context: { message, level: progress?.level },
      response_summary: response?.substring(0, 200),
    });

    // Award XP
    if (progress) {
      await supabase.rpc('add_user_xp', {
        p_user_id: user.id,
        p_xp_amount: 5
      });
    }

    return NextResponse.json({
      response,
      user_level: progress?.level || 1,
      xp_earned: 5,
      source: 'tyt.foundation',
    });

  } catch (error) {
    console.error('aOi chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CORS Configuration
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://takeyourtoken.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

#### 2. `/api/foundation/stats` - Foundation Statistics

```typescript
// tyt.foundation/app/api/foundation/stats/route.ts
export async function GET(req: NextRequest) {
  try {
    const { data: campaigns } = await supabase
      .from('foundation_campaigns')
      .select('*')
      .eq('status', 'active');

    const { data: donations, count: donationCount } = await supabase
      .from('foundation_donations')
      .select('amount_usd', { count: 'exact' })
      .eq('status', 'completed');

    const totalRaised = donations?.reduce((sum, d) => sum + d.amount_usd, 0) || 0;

    const { data: grants, count: grantCount } = await supabase
      .from('foundation_grants')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    return NextResponse.json({
      total_raised_usd: totalRaised,
      total_donations: donationCount || 0,
      active_campaigns: campaigns?.length || 0,
      active_grants: grantCount || 0,
      last_updated: new Date().toISOString(),
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
```

#### 3. `/api/donations/recent` - Recent Donations Feed

```typescript
// tyt.foundation/app/api/donations/recent/route.ts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    const { data: donations } = await supabase
      .from('foundation_donations')
      .select('id, amount_usd, asset, source, created_at, is_anonymous')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    const sanitized = donations?.map(d => ({
      id: d.id,
      amount_usd: d.amount_usd,
      currency: d.asset,
      source: d.source,
      timestamp: d.created_at,
      donor: d.is_anonymous ? 'Anonymous' : 'Supporter',
    }));

    return NextResponse.json({
      donations: sanitized || [],
      count: sanitized?.length || 0,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=30',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
```

#### 4. `/api/health` - Health Check

```typescript
// tyt.foundation/app/api/health/route.ts
export async function GET() {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    return NextResponse.json({
      status: error ? 'degraded' : 'operational',
      services: {
        database: error ? 'error' : 'operational',
        ai: process.env.OPENAI_API_KEY ? 'operational' : 'not_configured',
        api: 'operational',
      },
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
```

---

## 🔗 Cross-Domain Navigation System

### For takeyourtoken.app

Create navigation helper:

**File**: `src/lib/crossDomainNav.ts`

```typescript
import { supabase } from './supabase';

const FOUNDATION_DOMAIN = 'https://tyt.foundation';

export interface CrossDomainNavOptions {
  preserveAuth?: boolean;
  openInNewTab?: boolean;
  params?: Record<string, string>;
}

export async function navigateToFoundation(
  path: string,
  options: CrossDomainNavOptions = {}
) {
  const { preserveAuth = true, openInNewTab = false, params = {} } = options;

  const url = new URL(`${FOUNDATION_DOMAIN}${path}`);

  // Add query params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  // Add auth token if requested
  if (preserveAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      url.searchParams.set('token', session.access_token);
    }
  }

  // Add source tracking
  url.searchParams.set('source', 'takeyourtoken.app');

  if (openInNewTab) {
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url.toString();
  }
}

export const foundationLinks = {
  home: () => navigateToFoundation('/'),
  about: () => navigateToFoundation('/about'),
  aoi: () => navigateToFoundation('/aoi'),
  donate: (preserveAuth = true) => navigateToFoundation('/donate', { preserveAuth }),
  research: () => navigateToFoundation('/research'),
  grants: () => navigateToFoundation('/grants'),
  transparency: () => navigateToFoundation('/transparency'),
  contact: () => navigateToFoundation('/contact'),
};

// Reverse navigation (for tyt.foundation → takeyourtoken.app)
export async function navigateToApp(
  path: string,
  options: CrossDomainNavOptions = {}
) {
  const { preserveAuth = true, openInNewTab = false, params = {} } = options;

  const url = new URL(`https://takeyourtoken.app${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  if (preserveAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      url.searchParams.set('token', session.access_token);
    }
  }

  url.searchParams.set('source', 'tyt.foundation');

  if (openInNewTab) {
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url.toString();
  }
}

export const appLinks = {
  home: () => navigateToApp('/'),
  dashboard: () => navigateToApp('/app'),
  academy: () => navigateToApp('/app/academy'),
  marketplace: () => navigateToApp('/app/marketplace'),
  miners: () => navigateToApp('/app/miners'),
  wallet: () => navigateToApp('/app/wallet'),
  signup: () => navigateToApp('/signup'),
  login: () => navigateToApp('/login'),
};
```

### Usage in Components

```typescript
// takeyourtoken.app components
import { foundationLinks } from '@/lib/crossDomainNav';

<button onClick={() => foundationLinks.donate()}>
  Donate to Foundation
</button>

<a onClick={() => foundationLinks.aoi()}>
  Meet aOi
</a>
```

```typescript
// tyt.foundation components
import { appLinks } from '@/lib/crossDomainNav';

<button onClick={() => appLinks.signup()}>
  Start Mining
</button>

<a onClick={() => appLinks.dashboard()}>
  Go to Dashboard
</a>
```

---

## 🛡️ Security & CORS Configuration

### CORS Headers (Required on tyt.foundation APIs)

```typescript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://takeyourtoken.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Info',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Credentials': 'true',
};

// For public endpoints (donations, stats)
const PUBLIC_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
```

### Security Checklist

- ✅ Validate JWT tokens on all protected endpoints
- ✅ Use service_role key only on server-side
- ✅ Never expose service_role key to client
- ✅ Rate limit API endpoints
- ✅ Sanitize user inputs
- ✅ Use HTTPS only
- ✅ Implement CSP headers
- ✅ Enable RLS on all database tables
- ✅ Log all cross-domain requests

---

## 📡 Real-Time Synchronization

### Donation Feed (Live)

```typescript
// On both sites, subscribe to real-time donations
const channel = supabase
  .channel('foundation_donations')
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
```

### User Progress Sync

```typescript
// Sync aOi progress across domains using postMessage
const aoiSync = supabase
  .channel('aoi_progress')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'aoi_user_progress',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    // Broadcast to other domain if in iframe/window
    if (window.opener) {
      window.opener.postMessage({
        type: 'AOI_PROGRESS_UPDATE',
        data: payload.new,
      }, 'https://takeyourtoken.app');
    }
  })
  .subscribe();
```

---

## 🧪 Testing Strategy

### 1. Health Check Tests

```bash
# Test tyt.foundation API
curl https://tyt.foundation/api/health

# Expected: {"status":"operational",...}
```

### 2. Auth Token Flow

```typescript
// Test 1: Login on app → redirect to foundation with token
// Test 2: Verify token on foundation
// Test 3: Session persists across domains
// Test 4: Logout on one domain → logout on both
```

### 3. API Gateway Tests

```typescript
// Test aOi chat endpoint
const response = await fetch('https://tyt.foundation/api/aoi/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What is TYT?',
    context: {},
  }),
});

// Expected: 200 OK with AI response
```

### 4. CORS Tests

```javascript
// From takeyourtoken.app console:
fetch('https://tyt.foundation/api/foundation/stats')
  .then(r => r.json())
  .then(console.log);

// Should NOT get CORS error
```

---

## 📋 Deployment Checklist

### tyt.foundation Setup

- [ ] Deploy API routes (`/api/aoi/chat`, `/api/foundation/stats`, etc.)
- [ ] Configure CORS headers for takeyourtoken.app
- [ ] Set environment variables (SUPABASE_URL, OPENAI_API_KEY)
- [ ] Configure rate limiting (100 req/min per IP)
- [ ] Set up monitoring (Sentry, Datadog)
- [ ] Add SSL certificate
- [ ] Configure CDN caching

### takeyourtoken.app Setup

- [ ] Implement crossDomainNav helper
- [ ] Update all foundation links
- [ ] Test auth token passing
- [ ] Verify CORS requests work
- [ ] Add error handling for API failures
- [ ] Implement fallback for offline mode

### Both Domains

- [ ] Use same Supabase instance
- [ ] Verify RLS policies
- [ ] Test real-time subscriptions
- [ ] Configure OAuth redirect URLs
- [ ] Set up analytics tracking
- [ ] Document API endpoints
- [ ] Create runbook for incidents

---

## 🎯 Success Criteria

✅ **Authentication**
- User can log in on app and access foundation without re-auth
- Sessions sync automatically
- Logout works on both domains

✅ **API Communication**
- aOi chat works from app → foundation API
- Foundation stats load on app
- Donation feed updates in real-time

✅ **Navigation**
- Links between domains work seamlessly
- Auth tokens pass correctly
- No broken links or 404s

✅ **Security**
- CORS properly configured
- JWT tokens validated
- RLS enforced
- No secrets exposed

✅ **Performance**
- API responses < 500ms
- Real-time updates < 1s latency
- No CORS preflight delays

---

## 🚨 Troubleshooting

### CORS Errors

**Problem**: `Access to fetch at 'https://tyt.foundation/api/...' from origin 'https://takeyourtoken.app' has been blocked by CORS`

**Solution**: Add proper CORS headers to tyt.foundation API responses.

### Auth Token Invalid

**Problem**: `401 Unauthorized` on tyt.foundation API

**Solution**: Check token expiration, verify Supabase keys match, ensure user is authenticated.

### Real-Time Not Working

**Problem**: Donations don't update live

**Solution**: Enable Realtime in Supabase Dashboard, check subscription code, verify RLS policies.

---

## 📚 Related Documentation

- [TYT_FOUNDATION_SYNC_GUIDE.md](./TYT_FOUNDATION_SYNC_GUIDE.md)
- [AOI_FOUNDATION_BRIDGE.md](./AOI_FOUNDATION_BRIDGE.md)
- [SECURITY.md](../SECURITY.md)

---

**Status**: Implementation Ready
**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Owner**: TYT Tech Team
