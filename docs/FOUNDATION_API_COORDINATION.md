# Foundation API Coordination Guide

**Date**: 2026-01-12
**Status**: READY FOR IMPLEMENTATION
**Priority**: HIGH (Required for full integration)

---

## Executive Summary

This document specifies the API endpoints that **tyt.foundation** must implement for seamless integration with **takeyourtoken.app**.

**Current Status**: App is ready, Foundation APIs pending

---

## Required Foundation APIs

### 1. aOi Chat API ⚠️ CRITICAL

**Endpoint**: `POST https://tyt.foundation/api/aoi`

**Purpose**: Primary AI chat interface powered by Foundation's medical knowledge base

**Request**:
```typescript
POST /api/aoi
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json

{
  "question": "What is medulloblastoma?",
  "context": {
    "domain": "app",           // or "foundation"
    "userLevel": 2,             // aOi level 1-4
    "language": "en",           // "en" | "ru" | "he"
    "userId": "uuid",           // Supabase user ID
    "conversationId": "uuid"    // Optional: for conversation continuity
  }
}
```

**Response**:
```typescript
{
  "success": true,
  "answer": "Medulloblastoma is the most common malignant brain tumor in children. It develops in the cerebellum...",
  "sources": [
    {
      "title": "Understanding Medulloblastoma",
      "url": "/knowledge/medulloblastoma",
      "relevance": 0.95,
      "excerpt": "This article explains..."
    }
  ],
  "xp_earned": 2,              // XP for asking question
  "confidence": 0.92,          // AI confidence score
  "timestamp": "2026-01-12T10:30:00Z",
  "conversationId": "uuid"     // Return for continuity
}
```

**Error Responses**:
```typescript
// 401 Unauthorized
{
  "success": false,
  "error": "Missing or invalid authentication token"
}

// 429 Too Many Requests
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds",
  "retryAfter": 60
}

// 500 Internal Server Error
{
  "success": false,
  "error": "AI service temporarily unavailable"
}
```

**Implementation Requirements**:
- Validate Supabase JWT token
- Query pgvector knowledge base
- Use OpenAI/Anthropic for response generation
- Rate limit: 10 requests/minute per user
- Log all queries to `aoi_interactions` table
- Award XP via `add_user_xp()` function
- Store conversation in `aoi_conversations` table

---

### 2. Health Check API ⚠️ REQUIRED

**Endpoint**: `GET https://tyt.foundation/api/status`

**Purpose**: Allow app to check Foundation API availability

**Request**:
```typescript
GET /api/status
// No authentication required
```

**Response**:
```typescript
{
  "status": "online",          // "online" | "degraded" | "offline"
  "version": "1.0.0",
  "services": {
    "aoi": "operational",      // "operational" | "degraded" | "down"
    "database": "operational",
    "knowledge_base": "operational"
  },
  "uptime": 99.9,              // Percentage
  "responseTime": 45,          // ms
  "lastUpdated": "2026-01-12T10:30:00Z"
}
```

**Implementation Requirements**:
- Check database connection
- Check aOi service availability
- Check pgvector search performance
- Return within 100ms
- Cache for 30 seconds
- No authentication needed (public endpoint)

---

### 3. Foundation Statistics API 🟡 IMPORTANT

**Endpoint**: `GET https://tyt.foundation/api/foundation-stats`

**Purpose**: Display real-time Foundation impact data in app

**Request**:
```typescript
GET /api/foundation-stats
Authorization: Bearer <token>  // Optional: for detailed stats
```

**Response (Public)**:
```typescript
{
  "success": true,
  "stats": {
    "totalRaised": "342150.50",
    "totalRaisedUSD": "342150.50",
    "activeGrants": 8,
    "completedGrants": 15,
    "familiesSupported": 47,
    "researchPartners": 12,
    "countries": 8,
    "lastUpdated": "2026-01-12T10:30:00Z"
  },
  "recentDonations": [
    {
      "amount": "100.00",
      "currency": "USDT",
      "network": "polygon",
      "timestamp": "2026-01-12T09:45:00Z",
      "anonymous": true
    },
    // ... last 5 donations
  ]
}
```

**Response (Authenticated - User's Donations)**:
```typescript
{
  "success": true,
  "stats": { /* same as above */ },
  "userStats": {
    "totalDonated": "250.00",
    "totalDonatedUSD": "250.00",
    "donationCount": 3,
    "firstDonation": "2025-12-01T10:00:00Z",
    "lastDonation": "2026-01-10T15:30:00Z",
    "currencies": ["USDT", "BTC"],
    "rank": 42,                 // Among all donors
    "percentile": 15            // Top 15%
  }
}
```

**Implementation Requirements**:
- Query from `foundation_donations` table
- Calculate totals from `foundation` table
- Cache for 5 minutes (public data)
- Return user stats if JWT provided
- Respect donor anonymity settings

---

### 4. Knowledge Search API 🟢 NICE TO HAVE

**Endpoint**: `POST https://tyt.foundation/api/knowledge-search`

**Purpose**: Vector search across Foundation knowledge base

**Request**:
```typescript
POST /api/knowledge-search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "treatment options for pediatric brain tumors",
  "domain": "medical",         // "medical" | "web3" | "all"
  "limit": 10,
  "language": "en"
}
```

**Response**:
```typescript
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "title": "Treatment Protocols for Medulloblastoma",
      "category": "CNS",
      "subcategory": "Treatment",
      "content": "Standard treatment protocols include...",
      "url": "/knowledge/medulloblastoma-treatment",
      "relevance": 0.95,
      "language": "en",
      "updatedAt": "2025-12-15T10:00:00Z"
    },
    // ... more results
  ],
  "totalResults": 47,
  "took": 125                   // Query time in ms
}
```

**Implementation Requirements**:
- Use pgvector for similarity search
- Query `knowledge_base_cns` and `knowledge_base_web3` tables
- Support multilingual search
- Return top 10 most relevant results
- Cache popular queries for 1 hour

---

## Authentication Flow

### JWT Token Validation

Foundation must validate Supabase JWT tokens:

```typescript
// On tyt.foundation API endpoint
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Extract token from Authorization header
const token = req.headers.authorization?.replace('Bearer ', '');

// Validate token and get user
const { data: { user }, error } = await supabase.auth.getUser(token);

if (error || !user) {
  return res.status(401).json({
    success: false,
    error: 'Invalid authentication token'
  });
}

// User is authenticated, proceed with request
const userId = user.id;
```

---

## CORS Configuration

Foundation must allow requests from app domain:

```typescript
// CORS headers for all /api/* endpoints
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://takeyourtoken.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

// Handle OPTIONS preflight
if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
```

---

## Rate Limiting

Recommended rate limits per endpoint:

| Endpoint | Authenticated | Anonymous | Window |
|----------|--------------|-----------|--------|
| /api/aoi | 10 req/min | N/A | 60s |
| /api/status | 60 req/min | 60 req/min | 60s |
| /api/foundation-stats | 20 req/min | 20 req/min | 60s |
| /api/knowledge-search | 30 req/min | 10 req/min | 60s |

**Implementation**:
- Use Redis or similar for rate limit tracking
- Return 429 status when limit exceeded
- Include `Retry-After` header

---

## App-Side Implementation (Already Done)

### aOi API Client

```typescript
// src/lib/aoiApiClient.ts
export async function chat(question: string, context: any) {
  // 1. Try Foundation API
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch('https://tyt.foundation/api/aoi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
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
    console.warn('Foundation API unavailable:', error);
  }

  // 2. Fallback to local Edge Function
  const { data, error } = await supabase.functions.invoke('aoi-chat', {
    body: { question, context }
  });

  return data || { error: 'AI service unavailable' };
}
```

### Foundation Stats Widget

```typescript
// src/components/LiveFoundationTracker.tsx
const [stats, setStats] = useState(null);

useEffect(() => {
  async function fetchStats() {
    try {
      const response = await fetch('https://tyt.foundation/api/foundation-stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      // Use cached data or show offline message
    }
  }

  fetchStats();
  const interval = setInterval(fetchStats, 60000); // Every minute
  return () => clearInterval(interval);
}, []);
```

---

## Testing Checklist

### Foundation Team Should Test

- [ ] Deploy `/api/aoi` endpoint
- [ ] Deploy `/api/status` endpoint
- [ ] Deploy `/api/foundation-stats` endpoint
- [ ] Configure CORS for takeyourtoken.app
- [ ] Test JWT validation with Supabase token
- [ ] Verify rate limiting works
- [ ] Test error responses (401, 429, 500)
- [ ] Verify pgvector search performance
- [ ] Test with multiple concurrent users

### App Team Will Test

- [ ] Verify Foundation API connectivity
- [ ] Test fallback to local Edge Functions
- [ ] Verify aOi responses render correctly
- [ ] Test Foundation stats widget
- [ ] Verify authentication flow
- [ ] Test rate limit handling
- [ ] Verify error messages display correctly

---

## Deployment Sequence

### Phase 1: Foundation API Development (2-3 days)

1. Create `/api` directory structure
2. Implement JWT validation middleware
3. Implement `/api/status` endpoint (simplest)
4. Test with curl/Postman

### Phase 2: aOi Integration (3-4 days)

1. Implement `/api/aoi` endpoint
2. Connect to pgvector knowledge base
3. Integrate with OpenAI/Anthropic
4. Test with sample questions
5. Implement rate limiting

### Phase 3: Stats & Knowledge Search (2-3 days)

1. Implement `/api/foundation-stats`
2. Implement `/api/knowledge-search` (optional)
3. Add caching layer
4. Test performance

### Phase 4: Integration Testing (1-2 days)

1. Test from takeyourtoken.app
2. Verify all endpoints working
3. Load testing (if needed)
4. Fix any issues

**Total Timeline**: 8-12 days for complete implementation

---

## Support & Contact

### App Team Contacts
- **Tech Lead**: (Available for integration support)
- **Backend**: (Available for API questions)
- **Frontend**: (Available for widget integration)

### Foundation Team Needs
- Access to Supabase project
- API development resources
- Testing credentials
- Deployment pipeline

---

## Success Criteria

Foundation APIs are considered ready when:

✅ `/api/status` returns 200 OK
✅ `/api/aoi` accepts authenticated requests
✅ `/api/aoi` returns valid AI responses
✅ `/api/foundation-stats` returns current data
✅ CORS configured for takeyourtoken.app
✅ Rate limiting functioning correctly
✅ JWT validation working
✅ Error responses properly formatted
✅ Response times < 2 seconds (aOi)
✅ Response times < 500ms (other endpoints)

---

## Appendix: Environment Variables

Foundation project needs these environment variables:

```bash
# Supabase Connection
SUPABASE_URL=https://xyoaobelwkmrncvktrkv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
SUPABASE_ANON_KEY=<anon_key>

# AI Service (OpenAI or Anthropic)
OPENAI_API_KEY=<openai_key>
# OR
ANTHROPIC_API_KEY=<anthropic_key>

# Rate Limiting (if using Redis)
REDIS_URL=<redis_connection_string>

# CORS
ALLOWED_ORIGINS=https://takeyourtoken.app

# Optional: Analytics
ANALYTICS_KEY=<analytics_key>
```

---

**Status**: Documentation complete, awaiting Foundation team implementation

**Next Steps**:
1. Share this document with Foundation team
2. Set up coordination meeting
3. Agree on timeline
4. Begin Phase 1 implementation
