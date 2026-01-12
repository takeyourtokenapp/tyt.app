# Foundation ↔ App Integration Guide

> **Purpose**: Seamless integration between tyt.foundation and takeyourtoken.app
> **Status**: Partially Implemented (60% complete)
> **Updated**: 2026-01-12

---

## Overview

This document describes the integration architecture between two separate domains that function as a unified ecosystem:

- **tyt.foundation** - Knowledge, Mission, Medical Research, Trust
- **takeyourtoken.app** - Web3 Tools, NFT Mining, DeFi, Blockchain Practice

---

## Architecture Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────────────────┐
│              WHAT EACH DOMAIN DOES                  │
└─────────────────────────────────────────────────────┘

tyt.foundation (KNOWLEDGE & MISSION):
  ✅ Medical knowledge base (CNS research)
  ✅ Foundation mission and values
  ✅ Research grants display
  ✅ Transparency reports
  ✅ Family support resources
  ✅ Educational content (read-only)
  📖 Shows NFT mining info (educational, links to app)
  📖 Shows donation options (can donate directly)

takeyourtoken.app (TOOLS & PRACTICE):
  ✅ Web3 Academy (interactive courses)
  ✅ NFT miner management (buy, sell, upgrade)
  ✅ Multi-chain wallet
  ✅ DeFi tools (swap, bridge, stake)
  ✅ DAO governance
  ✅ Marketplace
  ✅ User dashboard
  📖 Shows Foundation impact (stats from Foundation)
  📖 Links to Foundation for donations
```

### 2. Unified Data Layer

```
┌─────────────────────────────────────────────────────┐
│            SHARED SUPABASE DATABASE                 │
│                                                     │
│  • User profiles (single source of truth)          │
│  • aOi progress (synchronized across domains)      │
│  • Academy progress (XP, levels, achievements)     │
│  • Foundation donations (recorded in both)         │
│  • Knowledge base (vector search, shared)          │
│  • Authentication (Supabase Auth)                  │
└─────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
  tyt.foundation              takeyourtoken.app
  (reads data)                 (reads + writes data)
```

### 3. Cross-Domain Communication

```
User starts on tyt.foundation
    │
    ├─> Reads: Foundation info, research, knowledge
    │
    ├─> Clicks: "Start Mining" or "Join Academy"
    │
    ▼
Redirects to takeyourtoken.app
    │
    ├─> Passes: Auth token (via URL param or cookie)
    │
    ├─> User logs in or continues session
    │
    ▼
User interacts with app
    │
    ├─> Mints NFT, completes lesson, earns XP
    │
    ├─> Data saved to shared database
    │
    ▼
User returns to tyt.foundation
    │
    ├─> Foundation reads updated data
    │
    └─> Shows: User progress, donations, impact
```

---

## Technical Implementation

### 1. Shared Database Schema

Both domains connect to the same Supabase project:

```typescript
// Both projects use identical env vars
VITE_SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

// Connection
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Key Shared Tables:**
- `profiles` - User profiles (name, avatar, is_admin, aoi_level)
- `aoi_user_progress` - aOi level, XP, achievements
- `academy_progress` - Lesson completions, quiz scores
- `foundation_donations` - Donation records
- `knowledge_base_*` - Medical and Web3 knowledge
- `aoi_conversations` - Chat history

### 2. Cross-Domain Navigation

#### From Foundation → App

```typescript
// On tyt.foundation
import { navigateToApp } from '@/lib/crossDomainNav';

// When user clicks "Start Mining"
<button onClick={() => navigateToApp('/app/miners')}>
  Start Mining
</button>

// Implementation:
function navigateToApp(path: string) {
  const token = await supabase.auth.getSession();
  const params = new URLSearchParams({
    source: 'foundation',
    token: token.access_token, // Pass auth token
    redirect: path
  });

  window.location.href = `https://takeyourtoken.app?${params}`;
}
```

#### From App → Foundation

```typescript
// On takeyourtoken.app
import { navigateToFoundation } from '@/lib/crossDomainNav';

// When user clicks "Learn More About Foundation"
<button onClick={() => navigateToFoundation('/research')}>
  View Research
</button>

// Implementation:
function navigateToFoundation(path: string) {
  const token = await supabase.auth.getSession();
  const params = new URLSearchParams({
    source: 'app',
    token: token.access_token,
    redirect: path
  });

  window.location.href = `https://tyt.foundation?${params}`;
}
```

### 3. aOi AI Integration

#### Architecture

```
User asks aOi a question on takeyourtoken.app
    │
    ▼
App tries Foundation API first
    │
    ├─> POST https://tyt.foundation/api/aoi
    ├─> Headers: Authorization: Bearer <token>
    ├─> Body: { question, context, language }
    │
    ▼
Foundation API responds (if online)
    │
    ├─> Uses RAG (vector search on knowledge base)
    ├─> Returns: { answer, sources, xp_earned }
    │
    ▼
App displays response
    │
    └─> Source indicator: "Powered by TYT Foundation AI"

If Foundation API fails:
    │
    ▼
App fallsback to local Edge Function
    │
    ├─> POST /functions/v1/aoi-chat
    ├─> Uses local pattern matching
    │
    ▼
App displays response
    │
    └─> Source indicator: "Local AI (Foundation offline)"
```

#### Implementation

```typescript
// takeyourtoken.app: src/lib/aoiApiClient.ts

export async function chat(question: string, context: any) {
  // 1. Try Foundation API
  try {
    const response = await fetch('https://tyt.foundation/api/aoi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question, context })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        source: 'foundation',
        online: true
      };
    }
  } catch (error) {
    console.warn('Foundation API unavailable, using fallback');
  }

  // 2. Fallback to local Edge Function
  const { data, error } = await supabase.functions.invoke('aoi-chat', {
    body: { question, context }
  });

  if (!error && data) {
    return {
      ...data,
      source: 'local',
      online: false
    };
  }

  // 3. Last resort: Pattern matching
  return {
    answer: patternMatch(question),
    source: 'pattern',
    online: false
  };
}
```

### 4. Foundation API Endpoints

**Required endpoints on tyt.foundation:**

#### 4.1 aOi Chat
```typescript
POST /api/aoi
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "question": "What is medulloblastoma?",
  "context": {
    "domain": "app" | "foundation",
    "userLevel": 1 | 2 | 3 | 4,
    "language": "en" | "ru" | "he"
  }
}

Response:
{
  "answer": "Medulloblastoma is the most common malignant brain tumor in children...",
  "sources": [
    {
      "title": "Understanding Medulloblastoma",
      "url": "/knowledge/medulloblastoma",
      "relevance": 0.95
    }
  ],
  "xp_earned": 2,
  "timestamp": "2026-01-12T10:30:00Z"
}

Errors:
401: Missing or invalid token
429: Rate limit exceeded
500: Internal server error
```

#### 4.2 Foundation Status
```typescript
GET /api/status

Response:
{
  "status": "online",
  "version": "1.0.0",
  "services": {
    "aoi": "operational",
    "database": "operational",
    "knowledge_base": "operational"
  },
  "uptime": 99.9,
  "last_updated": "2026-01-12T10:30:00Z"
}
```

#### 4.3 Foundation Statistics
```typescript
GET /api/foundation-stats
Authorization: Bearer <token> (optional)

Response:
{
  "total_raised": "342150.50",
  "total_raised_usd": "342150.50",
  "active_grants": 8,
  "completed_grants": 15,
  "families_supported": 47,
  "research_partners": 12,
  "countries": 8,
  "last_updated": "2026-01-12T10:30:00Z",
  "recent_donations": [
    {
      "amount": "100.00",
      "currency": "USDT",
      "network": "polygon",
      "timestamp": "2026-01-12T09:45:00Z",
      "anonymous": true
    }
  ]
}
```

#### 4.4 Knowledge Search
```typescript
POST /api/knowledge-search
Content-Type: application/json

Request:
{
  "query": "brain tumor treatment options",
  "category": "cns" | "web3" | "all",
  "language": "en" | "ru",
  "limit": 10
}

Response:
{
  "results": [
    {
      "title": "Treatment Options for Pediatric Brain Tumors",
      "excerpt": "Modern treatment approaches include...",
      "similarity": 0.92,
      "url": "/knowledge/treatment-options",
      "category": "cns",
      "reading_level": "intermediate"
    }
  ],
  "total": 45,
  "query_time_ms": 23
}
```

### 5. Cross-Domain Event Sync (PostMessage API)

For real-time updates between open tabs:

```typescript
// takeyourtoken.app sends event
window.postMessage({
  type: 'AOI_LEVEL_UPDATE',
  payload: {
    userId: 'user-123',
    oldLevel: 2,
    newLevel: 3,
    timestamp: Date.now()
  },
  source: 'takeyourtoken.app'
}, 'https://tyt.foundation');

// tyt.foundation listens
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://takeyourtoken.app') return;

  if (event.data.type === 'AOI_LEVEL_UPDATE') {
    // Update UI to reflect new level
    updateAoiLevel(event.data.payload.newLevel);
  }
});
```

**Supported Events:**
- `AOI_LEVEL_UPDATE` - User leveled up
- `AOI_XP_EARNED` - User earned XP
- `AOI_ACHIEVEMENT_EARNED` - User earned achievement
- `ACADEMY_LESSON_COMPLETE` - Lesson completed
- `FOUNDATION_DONATION_MADE` - Donation made
- `AUTH_STATE_CHANGED` - Login/logout

---

## User Flows

### Flow 1: New User Journey

```
1. User lands on tyt.foundation
   ├─> Reads about Foundation mission
   ├─> Learns about brain cancer research
   └─> Explores knowledge base (via aOi)

2. User clicks "Support Through Mining"
   ├─> Redirects to takeyourtoken.app
   └─> URL: https://takeyourtoken.app?source=foundation&redirect=/app/miners

3. User signs up on takeyourtoken.app
   ├─> Creates account (Supabase Auth)
   ├─> Profile auto-created in shared database
   ├─> aOi initialized (level 1, 0 XP)

4. User mints first NFT miner
   ├─> Transaction recorded in database
   ├─> Foundation fee (1%) auto-allocated
   └─> Donation receipt minted (Soulbound NFT)

5. User returns to tyt.foundation
   ├─> Foundation reads user data from database
   ├─> Shows: "You own 1 miner, supporting 1 family"
   └─> Displays impact dashboard
```

### Flow 2: Existing User Cross-Domain

```
1. User logged in on takeyourtoken.app
   ├─> Completes Academy lesson
   ├─> Earns 10 XP
   ├─> Data saved to database
   └─> aOi level updates (if threshold reached)

2. User clicks "Foundation Research" link
   ├─> Navigates to tyt.foundation
   ├─> Auth token passed via URL
   └─> Session restored on Foundation

3. User on tyt.foundation
   ├─> Foundation reads aOi progress from database
   ├─> Shows updated level and XP
   ├─> Unlocks level-appropriate content
   └─> aOi provides personalized guidance
```

### Flow 3: Donation Flow

```
Option A: Donate from takeyourtoken.app
  ├─> User has wallet balance
  ├─> Clicks "Donate to Foundation"
  ├─> Transaction created in app
  ├─> Recorded in foundation_donations table
  ├─> Foundation sees donation in real-time
  └─> Soulbound receipt issued

Option B: Donate from tyt.foundation
  ├─> User clicks "Donate"
  ├─> Foundation UI shows donation options
  ├─> If user has app account:
  │   └─> Can use app wallet balance
  ├─> If user doesn't have app account:
  │   └─> Can donate directly (external wallet)
  ├─> Transaction recorded in database
  └─> Receipt issued
```

---

## Data Synchronization

### Real-time Sync (Supabase Realtime)

Both domains subscribe to relevant database changes:

```typescript
// takeyourtoken.app
const channel = supabase
  .channel('aoi-progress')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'aoi_user_progress',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Update local state
      setAoiLevel(payload.new.level);
      setXP(payload.new.xp);
    }
  )
  .subscribe();

// tyt.foundation (same subscription)
// Both domains stay in sync automatically
```

### Eventual Consistency

For less critical data, batch sync every 5-10 minutes:

```typescript
// Foundation stats update
setInterval(async () => {
  const stats = await supabase
    .from('foundation_statistics')
    .select('*')
    .single();

  updateFoundationStats(stats);
}, 5 * 60 * 1000); // 5 minutes
```

---

## Security Considerations

### 1. Token-Based Auth

```typescript
// SECURE: Token passed in Authorization header
fetch('https://tyt.foundation/api/aoi', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// INSECURE: Token in URL (avoid)
// https://tyt.foundation/api/aoi?token=xxx
```

### 2. CORS Configuration

**On tyt.foundation:**
```typescript
// api/aoi/index.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://takeyourtoken.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
```

### 3. RLS Policies

```sql
-- Users can only read own aOi progress
CREATE POLICY "Users can view own aoi progress"
  ON aoi_user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Foundation donations are public read, authenticated write
CREATE POLICY "Anyone can view donations"
  ON foundation_donations FOR SELECT
  TO anon, authenticated
  USING (NOT anonymous OR is_public = true);

CREATE POLICY "Authenticated users can donate"
  ON foundation_donations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
```

### 4. Rate Limiting

Both domains implement rate limiting:

```typescript
// Per user (if authenticated)
const userLimit = await checkRateLimit(`user:${userId}`, {
  max: 100,
  window: 60000 // 100 requests per minute
});

// Per IP (if anonymous)
const ipLimit = await checkRateLimit(`ip:${ip}`, {
  max: 20,
  window: 60000 // 20 requests per minute
});
```

---

## Testing Cross-Domain Integration

### 1. Manual Testing Checklist

- [ ] User can navigate Foundation → App
- [ ] User can navigate App → Foundation
- [ ] Auth token passes correctly
- [ ] Session restored on destination domain
- [ ] aOi responses come from Foundation API
- [ ] aOi fallback works when Foundation offline
- [ ] aOi progress syncs between domains
- [ ] Foundation stats display correctly on App
- [ ] App donations appear on Foundation
- [ ] Real-time updates work (open both tabs)

### 2. Automated Tests

```typescript
// Cypress test: cross-domain-navigation.spec.ts
describe('Cross-Domain Navigation', () => {
  it('navigates from Foundation to App with auth', () => {
    // 1. Login on Foundation
    cy.visit('https://tyt.foundation');
    cy.login('test@example.com', 'password');

    // 2. Click "Start Mining"
    cy.contains('Start Mining').click();

    // 3. Should redirect to App
    cy.origin('https://takeyourtoken.app', () => {
      cy.url().should('include', '/app/miners');
      cy.contains('My Miners'); // Logged in
    });
  });

  it('aOi chat uses Foundation API', () => {
    cy.visit('https://takeyourtoken.app/app/dashboard');
    cy.login('test@example.com', 'password');

    // Open aOi chat
    cy.get('[data-testid="aoi-widget"]').click();

    // Ask question
    cy.get('[data-testid="aoi-input"]').type('What is Bitcoin?{enter}');

    // Should show response from Foundation
    cy.contains('Source: TYT Foundation AI');
  });
});
```

---

## Monitoring & Observability

### Metrics to Track

```yaml
Cross-Domain Navigation:
  - Foundation → App clicks: Count
  - App → Foundation clicks: Count
  - Auth token pass success rate: %
  - Session restoration rate: %

aOi Integration:
  - Foundation API success rate: %
  - Fallback usage rate: %
  - Response time (Foundation): ms
  - Response time (fallback): ms

Data Sync:
  - Realtime event latency: ms
  - Database query time: ms
  - Sync errors: Count
```

### Alerting

```typescript
// Alert if Foundation API down for > 5 minutes
if (foundationAPIDowntime > 5 * 60 * 1000) {
  alert('Foundation API down, users using fallback');
}

// Alert if cross-domain auth failing
if (authSuccessRate < 0.95) {
  alert('Cross-domain auth failing, investigate');
}
```

---

## Troubleshooting

### Issue 1: aOi Not Responding

**Symptoms:**
- User asks question, no response
- Error: "Failed to connect to Foundation API"

**Diagnosis:**
```bash
# Check Foundation API status
curl https://tyt.foundation/api/status

# Check CORS headers
curl -H "Origin: https://takeyourtoken.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://tyt.foundation/api/aoi

# Expected: CORS headers in response
```

**Solution:**
1. If Foundation API down: Verify fallback working
2. If CORS issue: Update Foundation CORS config
3. If rate limited: Check rate limits

### Issue 2: Auth Not Passing Between Domains

**Symptoms:**
- User clicks link, arrives logged out
- Session not restored

**Diagnosis:**
```typescript
// Check token in URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
console.log('Token received:', token ? 'Yes' : 'No');

// Try to restore session
const { data, error } = await supabase.auth.setSession({
  access_token: token,
  refresh_token: token
});
console.log('Session restored:', !error);
```

**Solution:**
1. Verify token passed in URL
2. Check token expiration
3. Verify Supabase auth configuration

### Issue 3: Data Not Syncing

**Symptoms:**
- User earns XP on App, not reflected on Foundation
- Donation made, not showing up

**Diagnosis:**
```typescript
// Check database directly
const { data } = await supabase
  .from('aoi_user_progress')
  .select('*')
  .eq('user_id', userId)
  .single();

console.log('Current XP in DB:', data.xp);

// Check Realtime subscription
const channel = supabase.channel('test');
console.log('Realtime connected:', channel.state === 'joined');
```

**Solution:**
1. Verify database write succeeded
2. Check Realtime subscription active
3. Force refresh if needed

---

## Deployment Checklist

### Foundation Deployment

- [ ] Deploy Foundation API endpoints
  - [ ] `/api/aoi`
  - [ ] `/api/status`
  - [ ] `/api/foundation-stats`
  - [ ] `/api/knowledge-search`
- [ ] Configure CORS
  - [ ] Allow origin: `https://takeyourtoken.app`
  - [ ] Allow methods: GET, POST, OPTIONS
  - [ ] Allow headers: Content-Type, Authorization
- [ ] Set up auth token verification
- [ ] Deploy knowledge base (with embeddings)
- [ ] Test endpoints from App

### App Deployment

- [ ] Update Foundation API URLs (production)
- [ ] Test Foundation API connection
- [ ] Verify fallback working
- [ ] Test cross-domain navigation
- [ ] Test aOi chat with Foundation
- [ ] Verify data sync
- [ ] Load test cross-domain traffic

### Post-Deployment

- [ ] Monitor Foundation API health
- [ ] Monitor cross-domain navigation success rate
- [ ] Monitor aOi response times
- [ ] Check error logs
- [ ] User acceptance testing

---

## Conclusion

This integration guide provides the technical foundation for seamless cooperation between tyt.foundation and takeyourtoken.app. Key principles:

1. **Separation of Concerns**: Each domain has clear responsibilities
2. **Shared Data**: Single database, synchronized state
3. **Fallback Systems**: Graceful degradation if Foundation offline
4. **Security**: Token-based auth, RLS, rate limiting
5. **User Experience**: Seamless navigation, no friction

### Current Status: 60% Complete

**What Works:**
- ✅ Shared database connection
- ✅ Cross-domain navigation (basic)
- ✅ aOi fallback system
- ✅ Foundation page on App (display only)

**What's Pending:**
- ⏳ Foundation API deployment (need Foundation team)
- ⏳ Real-time PostMessage sync
- ⏳ Production CORS configuration
- ⏳ Full E2E testing

### Next Steps:
1. Coordinate with Foundation team on API deployment
2. Test integration in staging environment
3. Implement real-time sync (PostMessage)
4. Load testing with both domains
5. Production deployment

---

**Document Version**: 1.0
**Last Updated**: 2026-01-12
**Status**: Active Development
**Contact**: Development Team