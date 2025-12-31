# 🚀 TYT Foundation + takeyourtoken.app - Project Synchronization

## 📋 Quick Start

У вас есть **два проекта в bolt.new**:

1. **takeyourtoken.app** (этот проект) - ✅ Полностью работает
2. **tyt.foundation** (https://bolt.new/~/sb1-qn2rs3sq) - 🔄 Требует синхронизации

**Цель**: Синхронизировать данные, компоненты и API между проектами для seamless user experience.

---

## 📚 Документация (Читать в Порядке)

### 1️⃣ START HERE: PROJECT_SYNC_SUMMARY.md ⭐
**Файл**: `/docs/PROJECT_SYNC_SUMMARY.md`

**Содержит**:
- Overview ситуации
- Quick checklist (что копировать)
- Приоритеты по дням
- Testing strategy
- Success metrics

**Читать первым**: Общий overview и план действий

---

### 2️⃣ COPY THIS: COPY_TO_TYT_FOUNDATION.md ⭐
**Файл**: `/docs/COPY_TO_TYT_FOUNDATION.md`

**Содержит**:
- Конкретный список файлов для копирования
- Необходимые модификации кода
- Installation commands
- Verification checklist
- Common issues & solutions

**Использовать**: Как пошаговую инструкцию при копировании файлов

---

### 3️⃣ IMPLEMENT THIS: TYT_FOUNDATION_SYNC_GUIDE.md ⭐
**Файл**: `/docs/TYT_FOUNDATION_SYNC_GUIDE.md`

**Содержит**:
- 10-дневный plan синхронизации
- API endpoint code (ready to use!)
- Cross-domain auth setup
- Real-time sync implementation
- Troubleshooting guide

**Использовать**: Для имплементации API endpoints и advanced features

---

### 4️⃣ BUILD THIS: TYT_FOUNDATION_LANDING_STRUCTURE.md
**Файл**: `/docs/TYT_FOUNDATION_LANDING_STRUCTURE.md`

**Содержит**:
- Полная структура 8 страниц (1800+ строк!)
- Content для каждой страницы
- Design system
- Component specifications
- Technical stack

**Использовать**: Как reference при построении страниц на tyt.foundation

---

### 5️⃣ STATUS: FOUNDATION_SYNC_COMPLETE.md
**Файл**: `/docs/FOUNDATION_SYNC_COMPLETE.md`

**Содержит**:
- Что уже сделано в takeyourtoken.app
- Database schema overview
- Existing components analysis
- API status
- Next steps

**Использовать**: Для понимания текущего состояния проектов

---

### 6️⃣ ARCHITECTURE: AOI_FOUNDATION_BRIDGE.md
**Файл**: `/docs/AOI_FOUNDATION_BRIDGE.md`

**Содержит**:
- Cross-domain architecture
- aOi API client details
- Smart fallback mechanism
- Bridge pattern implementation

**Использовать**: Для понимания как работает связь между проектами

---

## 🎯 Quick Action Plan

### Phase 1: Database (Day 1) - КРИТИЧНО!

**В проекте tyt.foundation в bolt.new**:

1. Откройте Settings → Environment Variables
2. Добавьте (ДОЛЖНЫ СОВПАДАТЬ с takeyourtoken.app!):
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   OPENAI_API_KEY=your-openai-key
   ```

3. Скопируйте файлы:
   ```
   takeyourtoken.app/src/lib/supabase.ts
   → tyt.foundation/lib/supabase.ts

   takeyourtoken.app/src/utils/foundationDataService.ts
   → tyt.foundation/lib/foundationDataService.ts
   ```

4. Тест:
   ```typescript
   import { supabase } from './lib/supabase';
   const { data } = await supabase.from('foundation_campaigns').select('*').limit(1);
   console.log('Connected:', !!data);
   ```

**✅ Success**: Оба проекта видят одни и те же таблицы

---

### Phase 2: Components (Day 2)

**Скопируйте в tyt.foundation**:

```bash
# Install first
npm install lucide-react @supabase/supabase-js openai framer-motion

# Copy files
components/LiveFoundationTracker.tsx    # Live stats
components/DonationWidget.tsx           # Donation form
components/ImpactReportsDashboard.tsx   # Impact metrics
config/aoiConfig.ts                     # Configuration (modify!)
```

**Modify imports**:
```typescript
// Change all imports from:
import { supabase } from '../lib/supabase';

// To:
import { supabase } from '@/lib/supabase';
```

**✅ Success**: Components render без errors

---

### Phase 3: API Endpoints (Day 3-4)

**Create in tyt.foundation**:

- `app/api/aoi/route.ts` - AI chat (code in SYNC_GUIDE.md)
- `app/api/status/route.ts` - Health check
- `app/api/donations/route.ts` - Public feed

**Test**:
```bash
curl https://tyt.foundation/api/status
# Returns: {"status":"online",...}
```

**Update takeyourtoken.app**:
```typescript
// src/config/aoiConfig.ts
foundation: {
  apiEndpoint: 'https://tyt.foundation/api/aoi', // Real URL
}
```

**✅ Success**: Chat on app connects to foundation API

---

### Phase 4: Build Pages (Day 5-30)

**Use structure from TYT_FOUNDATION_LANDING_STRUCTURE.md**:

- Week 1: Homepage + /aoi + /foundation
- Week 2: /research + /donate
- Week 3: /learn + /impact + /partners
- Week 4: Polish, test, optimize

**✅ Success**: Full site operational

---

## 📦 Key Files to Copy

### Priority 1 (Day 1) - КРИТИЧНО
- [x] `src/lib/supabase.ts`
- [x] `src/utils/foundationDataService.ts`
- [x] `.env` variables

### Priority 2 (Day 2)
- [ ] `src/components/LiveFoundationTracker.tsx`
- [ ] `src/config/aoiConfig.ts`

### Priority 3 (Day 3)
- [ ] `src/components/DonationWidget.tsx`
- [ ] `src/components/ImpactReportsDashboard.tsx`

### Optional (Day 4+)
- [ ] `src/components/AoiFoundationBadge.tsx`
- [ ] `src/utils/charityService.ts`

---

## 🔐 Environment Variables

**MUST BE IDENTICAL**:

```bash
# takeyourtoken.app/.env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...

# tyt.foundation/.env
VITE_SUPABASE_URL=https://xxx.supabase.co  # SAME!
VITE_SUPABASE_ANON_KEY=eyJhb...            # SAME!
OPENAI_API_KEY=sk-...                      # NEW
```

**Verify**:
```typescript
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should print SAME URL on both sites
```

---

## 🧪 Testing Checklist

### Database Sync
- [ ] Insert row on app → visible on foundation
- [ ] Real-time updates work
- [ ] RLS policies consistent

### API Integration
- [ ] `/api/status` returns 200
- [ ] `/api/aoi` responds < 500ms
- [ ] `/api/donations` returns data
- [ ] CORS works cross-domain

### User Experience
- [ ] Navigation between sites smooth
- [ ] Data consistent everywhere
- [ ] Real-time updates instant
- [ ] No errors in console

### Performance
- [ ] Lighthouse score > 90
- [ ] Database queries < 200ms
- [ ] API responses < 500ms
- [ ] Build succeeds

---

## 🎯 Success Criteria

**Project is synced when**:

✅ User can navigate seamlessly between domains
✅ Donation on app → visible on foundation instantly
✅ aOi chat connects to foundation API
✅ All data consistent (campaigns, grants, stats)
✅ Real-time updates work everywhere
✅ No duplicate or conflicting data
✅ Performance excellent on both sites

---

## 📊 Current Status

| Component | takeyourtoken.app | tyt.foundation |
|-----------|-------------------|----------------|
| Database | ✅ 12 tables | ⏳ Need to connect |
| Data Service | ✅ Complete | ⏳ Need to copy |
| Components | ✅ All working | ⏳ Need to copy |
| API Endpoints | ✅ Edge functions | ⏳ Need to create |
| Pages | ✅ Complete | ⏳ Need to build |
| Build | ✅ Success | ⏳ Pending |

**Overall**: takeyourtoken.app 100% ✅ | tyt.foundation 30% 🔄

---

## 🚀 Next Action

**RIGHT NOW**:
1. Open tyt.foundation project in bolt.new
2. Go to Settings → Environment Variables
3. Add Supabase credentials (SAME as takeyourtoken.app)
4. Copy `supabase.ts` and `foundationDataService.ts`
5. Test database connection

**THEN**: Follow COPY_TO_TYT_FOUNDATION.md step by step

---

## 💡 Key Principles

### 1. Single Source of Truth
**One Supabase database** = No sync issues

### 2. Shared Components
**DRY principle** = Copy once, use everywhere

### 3. Smart Fallback
**API with fallback** = Always available

### 4. Real-time Sync
**Subscriptions** = Instant updates

### 5. Documentation First
**Everything documented** = Repeatable process

---

## 📞 Need Help?

**If stuck**:
1. Check relevant .md file in `/docs/`
2. Review `COPY_TO_TYT_FOUNDATION.md` Common Issues
3. Verify environment variables match
4. Test with simple query first
5. Check Supabase dashboard

**Common Issues**:
- "Module not found" → `npm install` package
- "Database error" → Check env variables match
- "API not responding" → Verify endpoint created
- "CORS error" → Check headers in API route

---

## 📚 Documentation Index

**Core Guides** (Read First):
- `PROJECT_SYNC_SUMMARY.md` - Overall plan
- `COPY_TO_TYT_FOUNDATION.md` - Copy instructions
- `TYT_FOUNDATION_SYNC_GUIDE.md` - Implementation guide

**Reference**:
- `TYT_FOUNDATION_LANDING_STRUCTURE.md` - Page structures
- `FOUNDATION_SYNC_COMPLETE.md` - Current status
- `AOI_FOUNDATION_BRIDGE.md` - Architecture

**Quick Guides**:
- `AOI_QUICK_START.md` - aOi quick start
- `AOI_INTEGRATION_GUIDE.md` - Integration guide

**Created Files**:
- `src/utils/foundationDataService.ts` - Data service ⭐
- `src/config/aoiConfig.ts` - Configuration

---

## ✅ Final Checklist

**Before Starting**:
- [ ] Read PROJECT_SYNC_SUMMARY.md
- [ ] Have both projects open in bolt.new
- [ ] Know Supabase credentials
- [ ] Have OpenAI API key

**Week 1 Goals**:
- [ ] Database connected
- [ ] Data service copied
- [ ] Components working
- [ ] API endpoints created
- [ ] Basic pages built

**Launch Goals**:
- [ ] All 8 pages complete
- [ ] Full sync working
- [ ] Tests passing
- [ ] Performance optimized
- [ ] Ready for users

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────┐
│    Shared Supabase Database         │
│  (Single Source of Truth)           │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│takeyourtoken │  │    tyt.      │
│    .app      │  │ foundation   │
│              │  │              │
│ Mining       │  │ AI Chat      │
│ Rewards      │  │ Education    │
│ Marketplace  │◄─┤ Donations    │
│ Auto-donate  │  │ Transparency │
└──────────────┘  └──────────────┘
```

**User Flow**:
1. Discover on tyt.foundation
2. Learn about Foundation & aOi
3. Click "Start Mining"
4. Sign up on takeyourtoken.app
5. Mine & earn rewards
6. Auto-donations to Foundation
7. Chat with aOi (API bridge)
8. View impact on both sites
9. Make direct donation
10. See real-time updates everywhere

---

**Created**: December 26, 2025
**Status**: Ready for Implementation
**Next Step**: Phase 1 (Database Connection)

**Let's build something that changes lives!** 💙❤️
