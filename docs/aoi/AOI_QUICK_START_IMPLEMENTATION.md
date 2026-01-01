# 🚀 aOi Implementation Quick Start

**Goal**: Get aOi cross-domain integration running in 2 weeks

---

## ✅ COMPLETED

### 1. Database Schema
- ✅ Created 7 new tables for aOi system
- ✅ Enabled pgvector for semantic search
- ✅ Implemented RLS policies
- ✅ Created helper functions for activity logging
- ✅ Seeded initial learning paths and knowledge topics

**Migration Applied**: `20251227_create_aoi_integration_system.sql`

### 2. API Specification
- ✅ Complete REST API design (`AOI_API_SPECIFICATION.md`)
- ✅ 8 endpoint categories defined
- ✅ WebSocket events planned
- ✅ Rate limiting specified
- ✅ Error handling documented

### 3. Edge Functions (Started)
- ✅ `aoi-user-context` - Get user profile and stats
- ✅ `aoi-activity-log` - Log activities and update levels

---

## 📋 TODO - PHASE 1 (Week 1)

### Day 1-2: Complete Core API Functions

```bash
# Create remaining Edge Functions
cd supabase/functions

# 1. Content routing
mkdir aoi-route-content
# 2. Learning paths
mkdir aoi-paths
# 3. Knowledge query (RAG)
mkdir aoi-knowledge-query
```

**Priority Order**:
1. `aoi-route-content` - Recommend next content
2. `aoi-paths` - Enroll and track paths
3. `aoi-knowledge-query` - Answer questions (basic version)

### Day 3: Domain Setup

```bash
# 1. Register/configure tyt.foundation domain
# - Point DNS to hosting provider
# - Setup SSL certificate
# - Configure CDN (Cloudflare)

# 2. CORS configuration
# Add tyt.foundation to allowed origins in Supabase Dashboard
```

### Day 4-5: Frontend Skeleton (tyt.foundation)

Create minimal React app:
```bash
# New repo: takeyourtokenapp/tyt.foundation
npm create vite@latest tyt-foundation -- --template react-ts
cd tyt-foundation
npm install

# Install dependencies
npm install @supabase/supabase-js react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Pages to create**:
1. `/` - Landing (static MVP)
2. `/aoi` - aOi explanation (static)
3. `/knowledge` - Knowledge hub (list view)
4. `/knowledge/:topicId` - Topic detail (dynamic)

### Day 6-7: Basic Integration

**In takeyourtoken.app**:
```typescript
// src/lib/aoiClient.ts
export const aoiClient = {
  async getUserContext(token: string) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/aoi-user-context`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async logActivity(token: string, activity: any) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/aoi-activity-log`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity)
    });
    return res.json();
  }
};
```

**Update Academy page**:
```typescript
// src/pages/app/Academy.tsx
import { aoiClient } from '@/lib/aoiClient';

// After lesson completion:
await aoiClient.logActivity(token, {
  domain: 'app',
  activity_type: 'lesson_complete',
  item_id: lesson.id,
  item_title: lesson.title,
  xp_earned: 100
});
```

---

## 📋 TODO - PHASE 2 (Week 2)

### Day 8-10: Knowledge Graph Population

**Script**: `scripts/populate-knowledge.ts`
```typescript
// Populate aoi_knowledge_graph with real topics

const topics = [
  {
    topic_id: 'brain_anatomy_intro',
    topic_name: 'Introduction to Brain Anatomy',
    domain: 'cns',
    difficulty_level: 2,
    content_full: '...',
    sources: [...]
  },
  // ... 50+ topics
];

// Generate embeddings using OpenAI
// Insert into database
```

**Sources for content**:
- CNS: NIH, Mayo Clinic, pediatric oncology journals
- Web3: Bitcoin.org, Ethereum.org, CoinDesk Academy

### Day 11-12: AI Query System (Basic RAG)

**Edge Function**: `aoi-knowledge-query/index.ts`
```typescript
// 1. Generate embedding for user query
// 2. Search aoi_knowledge_graph using vector similarity
// 3. Format response with sources
// 4. Return simplified answer
```

**Use**:
- OpenAI API for embeddings (text-embedding-3-small)
- Store API key in Supabase Vault
- Simple prompt template for now

### Day 13-14: UI Polish & Testing

**tyt.foundation**:
- Polish landing page
- Add navigation between sections
- Implement search bar (calls aoi-knowledge-query)
- Link to takeyourtoken.app Academy

**takeyourtoken.app**:
- Add "Foundation" link in header
- Show unified progress in Profile
- Display cross-domain recommendations

**Testing**:
```bash
# Test user journey
1. Sign up on takeyourtoken.app
2. Complete a lesson → Check aoi_activity_log
3. Visit tyt.foundation → Should see progress
4. Read a Foundation article → Should earn XP
5. Return to app → Should see updated levels
```

---

## 🎯 MVP SUCCESS CRITERIA

By end of Week 2:

### Must Have:
- [x] Database schema deployed
- [ ] 3 core API endpoints working (context, activity, paths)
- [ ] tyt.foundation live with 5 knowledge topics
- [ ] takeyourtoken.app logs activities to aOi
- [ ] User can see unified progress
- [ ] Cross-domain navigation works

### Nice to Have:
- [ ] AI query system (basic)
- [ ] 20+ knowledge topics
- [ ] Learning path enrollment
- [ ] Recommendations

### Can Wait:
- [ ] Advanced RAG with multi-source synthesis
- [ ] WebSocket real-time updates
- [ ] A/B testing framework
- [ ] Mobile apps

---

## 🔧 TECHNICAL STACK

### Frontend (tyt.foundation)
```json
{
  "framework": "React 18 + TypeScript",
  "build": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router",
  "state": "React Query + Context",
  "hosting": "Vercel"
}
```

### Backend (Supabase)
```json
{
  "database": "PostgreSQL + pgvector",
  "api": "Edge Functions (Deno)",
  "auth": "Supabase Auth (shared with app)",
  "storage": "Supabase Storage (for images)",
  "ai": "OpenAI API (embeddings + GPT-4)"
}
```

### Integration
```json
{
  "auth_sharing": "JWT tokens work on both domains",
  "api_gateway": "Supabase Edge Functions",
  "cors": "Configured for both domains",
  "cdn": "Cloudflare"
}
```

---

## 📝 DEPLOYMENT CHECKLIST

### Environment Variables

**Supabase Secrets** (already configured):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**New Secrets Needed**:
```bash
# Add to Supabase Dashboard → Project Settings → Secrets
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=https://takeyourtoken.app,https://tyt.foundation
```

### DNS Configuration
```
tyt.foundation
  A     → Vercel IP
  CNAME → vercel-alias.com
  TXT   → Verification

api.tyt.foundation (optional, for custom API domain)
  CNAME → [project-ref].supabase.co
```

### Supabase Dashboard Settings
1. **Authentication → URL Configuration**
   - Add `https://tyt.foundation` to allowed redirect URLs
   - Add `https://tyt.foundation/*` to allowed origins

2. **Edge Functions**
   - Deploy all aoi-* functions
   - Verify logs show no errors
   - Test with curl/Postman

3. **Database**
   - Verify migration applied
   - Check table sizes (should be empty initially)
   - Test RLS policies manually

---

## 🐛 TROUBLESHOOTING

### Common Issues

**1. CORS Errors**
```typescript
// Add to Edge Function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

**2. Auth Tokens Not Working Cross-Domain**
```typescript
// Verify JWT is valid
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);
```

**3. Vector Search Slow**
```sql
-- Check index exists
SELECT * FROM pg_indexes WHERE tablename = 'aoi_knowledge_graph';

-- If missing, create:
CREATE INDEX idx_knowledge_embedding ON aoi_knowledge_graph
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

**4. Activity Not Logging**
```sql
-- Check RLS policies
SELECT * FROM aoi_activity_log WHERE user_id = '<user_id>';

-- If empty, check function:
SELECT log_aoi_activity(
  '<user_id>'::uuid,
  'app',
  'test',
  'test-123',
  'Test Activity',
  '{}'::jsonb,
  100
);
```

---

## 📞 SUPPORT & ESCALATION

### Before Asking for Help:
1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify environment variables
4. Test API endpoints with curl
5. Check database directly with SQL queries

### Where to Get Help:
- **GitHub Issues**: Technical bugs
- **Supabase Discord**: Database/Edge Functions
- **OpenAI Forum**: AI/RAG questions

---

## 🎉 NEXT STEPS AFTER MVP

### Month 2: AI Enhancement
- Fine-tune prompts for better answers
- Add multi-source RAG
- Implement feedback loop
- A/B test recommendations

### Month 3: Mobile Apps
- React Native wrapper for both domains
- Offline mode for knowledge base
- Push notifications for achievements

### Month 4: Research Portal
- Partner integrations (hospitals, universities)
- Grant application system
- Transparent funding dashboard

---

**Current Status**: Database deployed, APIs in progress
**Last Updated**: December 27, 2025
**Next Milestone**: Complete 3 core APIs by Dec 29
