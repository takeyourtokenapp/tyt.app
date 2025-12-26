# 🔄 TYT Foundation + takeyourtoken.app Sync Guide

## Ситуация

**Два проекта в bolt.new**:
1. **takeyourtoken.app** (этот проект) - Mining platform с полной Foundation интеграцией
2. **aOi AI Guide Landing Page** (https://tyt.foundation) - Отдельный landing page

**Цель**: Синхронизировать данные, API, компоненты между проектами для seamless user experience.

---

## 🎯 Архитектура Синхронизации

```
┌──────────────────────────────────────────────────────────────────┐
│                    Shared Supabase Database                       │
│  - foundation_* tables                                            │
│  - user profiles & auth                                           │
│  - charity transactions                                           │
│  - aoi conversation history                                       │
└──────────────────────────┬───────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│  takeyourtoken.app  │              │  tyt.foundation     │
│  (Mining Platform)  │◄─── API ────►│  (Landing + AI)     │
│                     │   Bridge     │                     │
│  - NFT Miners       │              │  - aOi Home         │
│  - Rewards          │              │  - Foundation Info  │
│  - Marketplace      │              │  - Donations        │
│  - Academy          │              │  - Research         │
│  - Wallet           │              │  - AI Chat API      │
│  - Auto-donations   │              │  - Impact Reports   │
└─────────────────────┘              └─────────────────────┘
```

---

## 📦 Что Нужно Синхронизировать

### 1. Supabase Configuration (КРИТИЧНО!)

**Оба проекта должны использовать ОДНУ И ТУ ЖЕ Supabase instance**.

#### В takeyourtoken.app (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### В tyt.foundation (.env)
```bash
# ДОЛЖНЫ БЫТЬ ИДЕНТИЧНЫМИ!
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Дополнительно для AI:
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key (optional)
```

**✅ Чек-лист**:
- [ ] Оба проекта подключены к одной Supabase instance
- [ ] Anon key совпадают
- [ ] Service role key настроен для Edge Functions
- [ ] RLS policies применены ко всем таблицам
- [ ] Auth settings синхронизированы

---

### 2. Database Tables (Уже Созданы)

**В takeyourtoken.app проекте уже есть все таблицы**:

✅ Foundation Core:
- `foundation_campaigns`
- `foundation_donations`
- `foundation_donation_receipts`
- `foundation_grants`
- `foundation_grant_milestones`
- `foundation_research_partners`
- `foundation_family_support`
- `foundation_impact_metrics`
- `foundation_transparency_reports`

✅ Charity Staking:
- `charity_staking_pools`
- `charity_stakes`
- `charity_staking_rewards`

✅ aOi System (создана в последней миграции):
- `aoi_conversations`
- `aoi_messages`
- `aoi_knowledge_base`
- `aoi_user_context`

**Действия для tyt.foundation**:
1. Использовать ТУ ЖЕ Supabase instance
2. Все миграции уже применены
3. Ничего создавать не нужно

---

### 3. aOi System Sync

#### aOi Configuration

**В takeyourtoken.app** (`/src/config/aoiConfig.ts`):
```typescript
export const aoiConfig = {
  character: {
    name: 'aOi (葵)',
    fullName: 'Artificial Intelligence ONA',
    personality: 'Empathetic, patient, knowledgeable',
    mission: 'Educate users + support Foundation',
  },
  evolution: {
    levels: [
      { level: 1, name: 'Beginner Guide', minXP: 0 },
      { level: 2, name: 'Explorer Mentor', minXP: 100 },
      { level: 3, name: 'Builder Advisor', minXP: 500 },
      { level: 4, name: 'Guardian Master', minXP: 1500 },
    ]
  },
  foundation: {
    domain: 'https://tyt.foundation',
    apiEndpoint: 'https://tyt.foundation/api/aoi',
    statusEndpoint: 'https://tyt.foundation/api/status',
    fallbackToLocal: true, // ✅ Smart fallback
  },
  features: {
    useFoundationApi: true, // ✅ Включено
    enableVoice: false,
    multiLanguage: false,
  }
};
```

**В tyt.foundation** нужно создать аналогичный конфиг:
```typescript
// config/aoiConfig.ts
export const aoiConfig = {
  // ИДЕНТИЧНАЯ структура
  character: { /* same */ },
  evolution: { /* same */ },
  foundation: {
    domain: 'https://tyt.foundation', // Self-reference
    apiEndpoint: '/api/aoi', // Local endpoint
    appDomain: 'https://takeyourtoken.app', // Link back
  },
  ai: {
    provider: 'openai', // or 'anthropic'
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 500,
  }
};
```

---

### 4. API Endpoints to Create on tyt.foundation

#### A) POST /api/aoi (Primary AI Chat)

**Файл**: `tyt.foundation/app/api/aoi/route.ts` (Next.js) или `pages/api/aoi.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    // Authenticate user (if provided)
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Build system prompt
    const systemPrompt = `You are aOi (葵), an empathetic AI guide for TYT platform.
Your mission: Educate users about Web3, cryptocurrency, and blockchain while supporting the TYT Children's Brain Cancer Foundation.

User Level: ${context?.user_level || 1}
User XP: ${context?.user_xp || 0}

Guidelines:
- Be patient and encouraging
- Explain complex concepts simply
- Connect learning to Foundation mission
- Celebrate user progress
- Provide actionable next steps`;

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    // Save to database (if user authenticated)
    if (userId) {
      await supabase.from('aoi_messages').insert({
        user_id: userId,
        role: 'user',
        content: question,
        context: context,
      });

      await supabase.from('aoi_messages').insert({
        user_id: userId,
        role: 'assistant',
        content: response,
      });
    }

    return NextResponse.json({
      response,
      source: 'foundation',
      context: {
        model: 'gpt-4-turbo',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('aOi API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Enable CORS for takeyourtoken.app
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://takeyourtoken.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}
```

#### B) GET /api/status (Health Check)

```typescript
// tyt.foundation/app/api/status/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check database connection
    const { error: dbError } = await supabase
      .from('foundation_campaigns')
      .select('id')
      .limit(1);

    const dbStatus = dbError ? 'error' : 'operational';

    // Check AI service (simple ping)
    const aiStatus = process.env.OPENAI_API_KEY ? 'operational' : 'not_configured';

    return NextResponse.json({
      status: 'online',
      version: '1.0.0',
      services: {
        aoi: aiStatus,
        database: dbStatus,
        ai_models: aiStatus,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Service unavailable',
      },
      { status: 503 }
    );
  }
}
```

#### C) GET /api/donations (Public Feed)

```typescript
// tyt.foundation/app/api/donations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const since = searchParams.get('since');

    let query = supabase
      .from('foundation_donations')
      .select('id, amount_usd, asset, source, created_at, is_anonymous, donor_name')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gte('created_at', since);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Anonymize data
    const donations = (data || []).map(d => ({
      id: d.id,
      amount_usd: d.amount_usd,
      currency: d.asset,
      source: d.source,
      timestamp: d.created_at,
      is_anonymous: d.is_anonymous,
      donor_name: d.is_anonymous ? 'Anonymous' : d.donor_name || 'Anonymous',
    }));

    return NextResponse.json({
      donations,
      total_count: count || 0,
      last_updated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Donations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
```

---

### 5. Components to Share

**Из takeyourtoken.app в tyt.foundation**:

#### foundationDataService.ts ✅
```bash
# Copy from takeyourtoken.app
cp src/utils/foundationDataService.ts → tyt.foundation/lib/foundationDataService.ts
```

Использовать для:
- Homepage stats
- /foundation page data
- /research grants
- /partners directory

#### DonationWidget Component
```bash
cp src/components/DonationWidget.tsx → tyt.foundation/components/DonationWidget.tsx
```

#### LiveFoundationTracker Component
```bash
cp src/components/LiveFoundationTracker.tsx → tyt.foundation/components/LiveFoundationTracker.tsx
```

#### ImpactReportsDashboard Component
```bash
cp src/components/ImpactReportsDashboard.tsx → tyt.foundation/components/ImpactReportsDashboard.tsx
```

**Адаптация**: Убрать зависимости от других компонентов TYT app, добавить standalone версии.

---

### 6. Cross-Domain Authentication

#### JWT Token Sharing

**На takeyourtoken.app** (когда user нажимает ссылку на tyt.foundation):
```typescript
// Generate secure token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Redirect with token
window.location.href = `https://tyt.foundation/auth/callback?token=${token}&redirect=/donate`;
```

**На tyt.foundation** (`/auth/callback`):
```typescript
// Validate and set session
const { searchParams } = new URL(request.url);
const token = searchParams.get('token');
const redirect = searchParams.get('redirect') || '/';

if (token) {
  const { data, error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: '', // Will be handled by Supabase
  });

  if (!error) {
    return Response.redirect(`${origin}${redirect}`);
  }
}
```

#### Session Persistence
- Используйте `supabase.auth.onAuthStateChange()` на обоих сайтах
- Синхронизируйте через `localStorage` (если same-site cookies)
- Fallback: Deep links с token параметром

---

### 7. Content Sync Strategy

#### Shared Content (Single Source of Truth)

**В Supabase создать таблицу** (если нужно):
```sql
CREATE TABLE IF NOT EXISTS shared_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  content_type text NOT NULL, -- 'markdown', 'html', 'json'
  content text NOT NULL,
  version int DEFAULT 1,
  published_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shared_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public content readable by all"
  ON shared_content FOR SELECT
  TO authenticated, anon
  USING (published_at IS NOT NULL);
```

**Использование**:
```typescript
// Fetch content on both sites
const { data } = await supabase
  .from('shared_content')
  .select('content')
  .eq('key', 'foundation_mission')
  .maybeSingle();

const missionText = data?.content || 'Default mission text...';
```

**Content Keys**:
- `foundation_mission`
- `aoi_introduction`
- `research_focus_areas`
- `donation_impact_calculator_formula`
- `faq_items`

---

### 8. Real-Time Sync

#### Donation Feed (Live Updates)

**На takeyourtoken.app** (когда происходит донат):
```typescript
// Record donation
await supabase.from('foundation_donations').insert({
  donor_user_id: userId,
  amount_usd: 100,
  asset: 'USDT',
  source: 'direct',
  status: 'completed',
});

// Broadcast event (optional)
await supabase.channel('donations').send({
  type: 'broadcast',
  event: 'new_donation',
  payload: { amount: 100, currency: 'USDT' },
});
```

**На tyt.foundation** (homepage live feed):
```typescript
// Subscribe to donations
const channel = supabase
  .channel('donations')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'foundation_donations',
  }, (payload) => {
    // Update UI with new donation
    addDonationToFeed(payload.new);
  })
  .subscribe();
```

---

### 9. SEO & Social Sharing

#### Open Graph Tags (для обоих сайтов)

**takeyourtoken.app**:
```html
<meta property="og:title" content="TakeYourToken - Web3 Mining Platform">
<meta property="og:description" content="Mine crypto, earn rewards, support children with brain cancer">
<meta property="og:image" content="https://takeyourtoken.app/og-image.png">
<meta property="og:url" content="https://takeyourtoken.app">
```

**tyt.foundation**:
```html
<meta property="og:title" content="TYT Children's Brain Cancer Foundation">
<meta property="og:description" content="Every crypto transaction funds breakthrough research. Meet aOi, your AI guide.">
<meta property="og:image" content="https://tyt.foundation/og-foundation.png">
<meta property="og:url" content="https://tyt.foundation">
```

#### Canonical Links
```html
<!-- On takeyourtoken.app/foundation -->
<link rel="canonical" href="https://takeyourtoken.app/foundation">
<link rel="alternate" href="https://tyt.foundation/foundation">

<!-- On tyt.foundation/foundation -->
<link rel="canonical" href="https://tyt.foundation/foundation">
```

---

### 10. Monitoring & Analytics

#### Shared Events (Track on Both)

**Setup Plausible/Umami** (privacy-first):
```javascript
// On both domains
plausible('pageview');

// Custom events
plausible('Donation Started', { amount: 100, currency: 'USDT' });
plausible('aOi Chat Initiated');
plausible('Campaign Viewed', { campaign: 'mri-equipment' });
```

**Cross-domain tracking**:
- Use same Plausible domain for both sites
- Tag events with `source: 'app'` or `source: 'foundation'`
- Create unified dashboard

---

## 🚀 Пошаговый План Синхронизации

### Phase 1: Database Connection (День 1)

1. **В tyt.foundation проекте (bolt.new)**:
   ```bash
   # Добавить в .env (должны совпадать с takeyourtoken.app!)
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxx
   ```

2. **Проверить подключение**:
   ```typescript
   // test-connection.ts
   import { supabase } from './lib/supabase';

   const { data, error } = await supabase
     .from('foundation_campaigns')
     .select('*')
     .limit(1);

   console.log('Connected:', !error);
   ```

3. **✅ Чек**: Оба проекта видят одни и те же таблицы

### Phase 2: API Endpoints (День 2-3)

1. **Создать в tyt.foundation**:
   - `/api/aoi` - AI chat endpoint
   - `/api/status` - Health check
   - `/api/donations` - Public feed

2. **Тестировать**:
   ```bash
   curl https://tyt.foundation/api/status
   # Should return: {"status":"online"...}
   ```

3. **В takeyourtoken.app обновить**:
   ```typescript
   // src/config/aoiConfig.ts
   foundation: {
     apiEndpoint: 'https://tyt.foundation/api/aoi', // ✅ Real URL
   }
   ```

4. **✅ Чек**: Chat на takeyourtoken.app подключается к tyt.foundation API

### Phase 3: Shared Components (День 4-5)

1. **Копировать в tyt.foundation**:
   - `foundationDataService.ts`
   - `DonationWidget.tsx`
   - `LiveFoundationTracker.tsx`

2. **Адаптировать imports**:
   ```typescript
   // Было:
   import { supabase } from '../lib/supabase';

   // Стало (для tyt.foundation):
   import { supabase } from '@/lib/supabase';
   ```

3. **Использовать на страницах**:
   ```typescript
   // tyt.foundation/app/page.tsx
   import { foundationDataService } from '@/lib/foundationDataService';
   import LiveFoundationTracker from '@/components/LiveFoundationTracker';

   const stats = await foundationDataService.getOverallStats();
   ```

4. **✅ Чек**: Страницы показывают real data из Supabase

### Phase 4: Cross-Domain Links (День 6)

1. **В takeyourtoken.app добавить ссылки**:
   ```typescript
   // Header, Footer, aOi chat widget
   <a href="https://tyt.foundation">Learn More about Foundation</a>
   <a href="https://tyt.foundation/aoi">Meet aOi</a>
   <a href="https://tyt.foundation/donate">Donate Directly</a>
   ```

2. **В tyt.foundation добавить ссылки**:
   ```typescript
   <a href="https://takeyourtoken.app">Start Mining</a>
   <a href="https://takeyourtoken.app/app">Open Dashboard</a>
   ```

3. **✅ Чек**: Navigation между сайтами seamless

### Phase 5: Real-Time Sync (День 7)

1. **Настроить subscriptions**:
   ```typescript
   // На обоих сайтах
   supabase
     .channel('foundation_updates')
     .on('postgres_changes', {
       event: '*',
       schema: 'public',
       table: 'foundation_donations',
     }, handleUpdate)
     .subscribe();
   ```

2. **✅ Чек**: Donation на app → instantly visible на foundation

### Phase 6: Testing & Polish (День 8-10)

1. **End-to-End Tests**:
   - User signs up on app → session works on foundation
   - Donation on app → shows in foundation feed
   - Chat on app → calls foundation API
   - Content updates → reflected on both sites

2. **Performance**:
   - Lighthouse score > 90 на обоих
   - API response < 500ms
   - Real-time updates < 1s latency

3. **Security**:
   - CORS properly configured
   - RLS policies tested
   - Auth tokens validated

---

## 📋 Sync Checklist

### Environment Variables
- [ ] VITE_SUPABASE_URL - Identical on both
- [ ] VITE_SUPABASE_ANON_KEY - Identical on both
- [ ] OPENAI_API_KEY - Set on tyt.foundation
- [ ] VITE_FOUNDATION_API_URL - Set on takeyourtoken.app

### Database
- [ ] Both projects connected to same Supabase
- [ ] All migrations applied
- [ ] RLS policies active
- [ ] Test queries work from both

### API Endpoints (tyt.foundation)
- [ ] POST /api/aoi - Implemented & tested
- [ ] GET /api/status - Returns correct status
- [ ] GET /api/donations - Returns public feed
- [ ] CORS configured for takeyourtoken.app

### Components
- [ ] foundationDataService copied & working
- [ ] DonationWidget integrated
- [ ] LiveFoundationTracker showing real data
- [ ] aOi chat widget functional

### Cross-Domain
- [ ] Links between sites working
- [ ] Auth token passing (if needed)
- [ ] Session persistence
- [ ] Deep links functional

### Content
- [ ] Foundation mission aligned
- [ ] Stats match between sites
- [ ] Campaign data synced
- [ ] Grant information consistent

### Real-Time
- [ ] Donation feed updates live
- [ ] Campaign progress synced
- [ ] User stats updated
- [ ] Notifications cross-domain (optional)

### Testing
- [ ] Manual testing completed
- [ ] API endpoints tested
- [ ] Real-time sync verified
- [ ] Performance benchmarked

---

## 🔧 Troubleshooting

### Issue: "API not responding"
**Solution**:
1. Check `/api/status` on tyt.foundation
2. Verify CORS headers
3. Check browser console for errors
4. Ensure API key set in .env

### Issue: "Database connection failed"
**Solution**:
1. Verify VITE_SUPABASE_URL matches
2. Check anon key is correct
3. Test with Supabase dashboard
4. Check RLS policies aren't blocking

### Issue: "Real-time updates not working"
**Solution**:
1. Enable Realtime in Supabase dashboard
2. Check channel subscription code
3. Verify table has REPLICA IDENTITY FULL
4. Test with simple insert

### Issue: "Auth not syncing between domains"
**Solution**:
1. Use explicit token passing (query param)
2. Check session expiry settings
3. Verify redirect URLs in Supabase
4. Consider OAuth2 flow for production

---

## 📚 Documentation References

**Created in this project**:
- `/docs/TYT_FOUNDATION_LANDING_STRUCTURE.md` - Full structure for tyt.foundation
- `/docs/FOUNDATION_SYNC_COMPLETE.md` - Sync status report
- `/docs/AOI_FOUNDATION_BRIDGE.md` - Bridge architecture
- `/src/utils/foundationDataService.ts` - Shared data service

**Supabase Docs**:
- Realtime: https://supabase.com/docs/guides/realtime
- Auth: https://supabase.com/docs/guides/auth
- RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎯 Success Criteria

**When sync is complete**:
✅ User can chat with aOi on both sites seamlessly
✅ Donations appear instantly on both sites
✅ Campaign/grant data consistent everywhere
✅ Navigation between sites is smooth
✅ No duplicate data or conflicts
✅ Performance excellent on both
✅ Security maintained across domains

**Final Test**:
User journey: Sign up on app → mine → auto-donate → see impact on foundation → chat with aOi → make direct donation → view in real-time

---

**Status**: Ready for Implementation
**Estimated Time**: 7-10 days
**Priority**: High
**Owner**: TYT Team

**Next Step**: Apply Phase 1 (Database Connection) on tyt.foundation bolt.new project 🚀
