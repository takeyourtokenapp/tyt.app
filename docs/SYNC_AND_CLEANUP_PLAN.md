# 🧹 TYT Projects Synchronization & Cleanup Plan

**Date**: December 27, 2025
**Status**: Ready for Execution
**Goal**: Sync tyt.foundation ↔ takeyourtoken.app, remove duplicates, ensure security

---

## 📊 CURRENT STATE AUDIT

### Project 1: takeyourtoken.app (THIS PROJECT)
```
Status: ✅ Production Ready
- Build: ✅ Successful (18.78s, 0 errors)
- Database: ✅ 140+ tables, aOi integrated
- Components: ✅ 74 React components
- Edge Functions: ✅ 27 deployed
- Documentation: 728KB (docs/) + 824KB (archive/)
- Security: ✅ RLS enabled, secrets managed
```

### Project 2: tyt.foundation
```
Status: 🔄 Needs Sync
- URL: https://tyt.foundation (LIVE)
- Content: Minimal (landing page only)
- Database: ⚠️ NOT connected to shared Supabase
- Components: ⚠️ Missing core components
- API: ⚠️ No endpoints yet
```

---

## 🎯 SYNCHRONIZATION PLAN

### Phase 1: Environment & Database (HIGH PRIORITY)

**Action**: Connect tyt.foundation to same Supabase instance

```bash
# In tyt.foundation project (.env.local)
VITE_SUPABASE_URL=<SAME_AS_TAKEYOURTOKEN_APP>
VITE_SUPABASE_ANON_KEY=<SAME_AS_TAKEYOURTOKEN_APP>
OPENAI_API_KEY=<YOUR_KEY>
```

**Files to Copy**:
```
FROM: takeyourtoken.app/src/lib/supabase.ts
TO:   tyt.foundation/lib/supabase.ts

FROM: takeyourtoken.app/src/utils/foundationDataService.ts
TO:   tyt.foundation/lib/foundationDataService.ts
```

**Verification**:
```typescript
// Test in tyt.foundation browser console
import { supabase } from './lib/supabase';
const { data } = await supabase.from('foundation_campaigns').select('count');
console.log('Connected:', data);
```

### Phase 2: Core Components (MEDIUM PRIORITY)

**Copy these components** (with adaptations):

1. **LiveFoundationTracker.tsx**
   ```bash
   FROM: src/components/LiveFoundationTracker.tsx
   TO:   components/LiveFoundationTracker.tsx

   # Update imports
   - import { supabase } from '@/lib/supabase'
   + import { supabase } from '../lib/supabase'
   ```

2. **AoiFoundationBadge.tsx**
   ```bash
   FROM: src/components/AoiFoundationBadge.tsx
   TO:   components/AoiFoundationBadge.tsx
   ```

3. **DonationWidget.tsx** (adapt auth)
   ```bash
   FROM: src/components/DonationWidget.tsx
   TO:   components/DonationWidget.tsx

   # Note: Requires auth context - may need to create simplified version
   ```

4. **ImpactReportsDashboard.tsx**
   ```bash
   FROM: src/components/ImpactReportsDashboard.tsx
   TO:   components/ImpactReportsDashboard.tsx
   ```

### Phase 3: API Endpoints (MEDIUM PRIORITY)

**Create in tyt.foundation**:

**A) /api/aoi - AI Chat**
```typescript
// app/api/aoi/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { question, context } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are aOi, an AI guide for TYT Foundation..."
      },
      { role: "user", content: question }
    ],
  });

  return NextResponse.json({
    response: completion.choices[0].message.content,
    source: "foundation"
  });
}
```

**B) /api/status - Health Check**
```typescript
// app/api/status/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { error } = await supabase.from('foundation_campaigns').select('count');

    return NextResponse.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      services: {
        database: !error,
        ai: !!process.env.OPENAI_API_KEY
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
```

**C) /api/donations - Public Feed**
```typescript
// app/api/donations/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase
    .from('foundation_donations')
    .select('amount_usd, asset, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({ donations: data || [] });
}
```

### Phase 4: Cross-Domain Links (LOW PRIORITY)

**Update takeyourtoken.app** (if not already done):
```typescript
// src/components/Header.tsx
<a href="https://tyt.foundation">Foundation</a>
<a href="https://tyt.foundation/aoi">Meet aOi</a>
```

**Update tyt.foundation**:
```typescript
// components/Header.tsx
<a href="https://takeyourtoken.app">Start Mining</a>
<a href="https://takeyourtoken.app/app">Dashboard</a>
```

### Phase 5: Real-Time Sync (OPTIONAL)

**Setup on both sites**:
```typescript
// Real-time donation updates
supabase
  .channel('foundation_updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'foundation_donations',
  }, (payload) => {
    console.log('New donation:', payload.new);
    // Update UI
  })
  .subscribe();
```

---

## 🧹 CLEANUP PLAN

### 1. Documentation Cleanup (HIGH PRIORITY)

**Problem**:
- 16 AOI documents (many duplicates)
- 63 archived documents (outdated)
- Total: 1.5MB documentation

**Action**: Consolidate and archive

**Keep (docs/)**:
```
ESSENTIAL:
✅ AOI_FOUNDATION_FULL_ARCHITECTURE.md    (master architecture)
✅ AOI_API_SPECIFICATION.md               (API reference)
✅ AOI_IMPLEMENTATION_ROADMAP.md          (implementation plan)
✅ PROJECT_SYNC_SUMMARY.md                (sync guide)
✅ TYT_FOUNDATION_SYNC_GUIDE.md          (detailed sync steps)
✅ SECURITY.md                           (security guidelines)
✅ ENV_SETUP_GUIDE.md                    (environment setup)
✅ README.md                             (project overview)

USEFUL:
✅ ROADMAP.md
✅ DESIGN_SYSTEM.md
✅ MULTILINGUAL_GUIDE.md
✅ ICON_SYSTEM_V1.md
```

**Archive (archive/)**:
```
DEPRECATED (can delete after backup):
❌ AOI_QUICK_START.md                    (superseded by ROADMAP)
❌ AOI_PHASE2_COMPLETE.md                (outdated status)
❌ AOI_FOUNDATION_BRIDGE.md              (merged into FULL_ARCHITECTURE)
❌ AOI_INTEGRATION_GUIDE.md              (superseded by API_SPEC)
❌ AOI_CHARACTER_SPECIFICATION.md        (moved to main docs)
❌ AOI_HEADER_INTEGRATION.md             (implementation done)
❌ AOI_IMPLEMENTATION_COMPLETE.md        (outdated status)
❌ AOI_UNIFIED_SUPPORT.md                (merged)
❌ AOI_VISUAL_SUMMARY.md                 (outdated)

All 63 files in archive/old-docs/ → can compress to .tar.gz
```

**Consolidate**:
```bash
# Create single comprehensive guide
docs/AOI_COMPLETE_GUIDE.md
├─ Architecture (from FULL_ARCHITECTURE)
├─ API Specification (from API_SPECIFICATION)
├─ Implementation (from ROADMAP)
├─ Sync Instructions (from SYNC_GUIDE)
└─ FAQ (from various docs)

# Then archive redundant files
mkdir archive/2025-12-27-pre-cleanup/
mv docs/AOI_QUICK_START.md archive/2025-12-27-pre-cleanup/
mv docs/AOI_PHASE2_COMPLETE.md archive/2025-12-27-pre-cleanup/
# ... etc
```

### 2. Code Cleanup (MEDIUM PRIORITY)

**Found Issues**:
```
src/utils/burnScheduler.ts:     TODO comment
src/utils/realBlockchain.ts:    TODO comment
src/pages/app/AdminWithdrawals.tsx: TODO comment
```

**Action**: Review and resolve TODOs

```typescript
// Example: burnScheduler.ts
- // TODO: implement automatic burn scheduling
+ // Automatic burn scheduling implemented via cron-weekly-burn Edge Function
```

**Unused Files** (check if needed):
```bash
# Find files not imported anywhere
grep -r "import.*from.*burnScheduler" src/
# If no results → can be removed or documented as utility
```

### 3. Dependency Cleanup (LOW PRIORITY)

**Current Dependencies**: 85 packages

**Action**: Remove unused
```bash
npm install -g depcheck
depcheck

# Example removals (if unused):
npm uninstall <unused-package>
```

### 4. Environment Variables Audit (HIGH PRIORITY - SECURITY)

**Current .env structure**:
```bash
# Check what's exposed
grep -r "import.meta.env" src/ | wc -l

# Verify no secrets in code
grep -r "sk-" src/
grep -r "secret" src/
grep -r "private" src/
```

**Action**: Ensure no hardcoded secrets
```bash
# All secrets must be in .env (not committed)
# Check .gitignore includes:
.env
.env.local
.env.*.local
```

### 5. Build Optimization (LOW PRIORITY)

**Current**: Main bundle 792KB (too large)

**Action**: Code splitting
```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'web3': ['wagmi', 'viem'],
          'utils': ['./src/utils/index.ts']
        }
      }
    }
  }
}
```

---

## 🔐 SECURITY CHECKLIST

### Critical Security Items

**✅ Completed**:
- [x] RLS enabled on all tables
- [x] Secrets not in code
- [x] CORS configured
- [x] Rate limiting on Edge Functions
- [x] Input validation
- [x] SQL injection protection (Supabase)

**⚠️ Pending**:
- [ ] Review all TODO comments for security implications
- [ ] Audit API endpoints for auth bypass
- [ ] Verify wallet key rotation complete (see EMERGENCY_WALLET_ROTATION.md)
- [ ] Enable Supabase leaked password protection
- [ ] Setup monitoring (Sentry)
- [ ] Penetration testing
- [ ] Bug bounty program

### Security Scan

**Run these commands**:
```bash
# Check for hardcoded secrets
npm audit

# Check dependencies
npm audit fix

# Scan with detect-secrets (if installed)
detect-secrets scan > .secrets.baseline

# Verify no API keys in code
grep -r "sk-" src/
grep -r "AKIA" src/ # AWS keys
grep -r "-----BEGIN" src/ # Private keys
```

**Expected**: Zero secrets found in src/

---

## 📋 EXECUTION TIMELINE

### Week 1: Critical Path

**Day 1** (High Priority):
- [ ] Setup tyt.foundation environment variables
- [ ] Copy supabase.ts
- [ ] Copy foundationDataService.ts
- [ ] Test database connection
- [ ] Review and resolve TODOs

**Day 2** (High Priority):
- [ ] Copy LiveFoundationTracker component
- [ ] Copy AoiFoundationBadge component
- [ ] Create /api/status endpoint
- [ ] Verify components render

**Day 3** (Medium Priority):
- [ ] Create /api/aoi endpoint
- [ ] Create /api/donations endpoint
- [ ] Test API endpoints
- [ ] Setup CORS

**Day 4** (Medium Priority):
- [ ] Add cross-domain links
- [ ] Test navigation flow
- [ ] Consolidate documentation
- [ ] Move redundant docs to archive

**Day 5** (Low Priority):
- [ ] Setup real-time sync (optional)
- [ ] Code splitting optimization
- [ ] Dependency cleanup
- [ ] Final testing

### Week 2: Polish

**Day 6-7**:
- [ ] Security audit
- [ ] Performance testing
- [ ] Documentation review
- [ ] User journey testing

**Day 8-10**:
- [ ] Build remaining pages (if needed)
- [ ] Content review
- [ ] Final cleanup
- [ ] Monitoring setup

---

## 📊 SUCCESS METRICS

### When Complete:

**✅ Synchronization**:
- Both sites connected to same database
- Real-time data syncing
- API endpoints responding
- Cross-domain navigation works

**✅ Cleanup**:
- Documentation reduced to essentials (<500KB)
- Zero TODO/FIXME in critical code
- No unused dependencies
- Build size optimized (<700KB main bundle)

**✅ Security**:
- No secrets in code
- All vulnerabilities fixed
- Monitoring active
- Audit passed

**✅ Performance**:
- Lighthouse score >90 on both sites
- API response <500ms
- Build time <20s
- No console errors

---

## 🔧 TOOLS & COMMANDS

### Useful Commands

**Check File Sizes**:
```bash
du -sh docs/ archive/ src/
find docs/ -name "*.md" -exec wc -l {} + | sort -n
```

**Find Duplicates**:
```bash
fdupes -r docs/
```

**Check Dependencies**:
```bash
npm list --depth=0
npm outdated
```

**Scan Security**:
```bash
npm audit
git secrets --scan
```

**Test Build**:
```bash
npm run build
npm run preview
```

### Backup Before Cleanup

```bash
# Create backup
tar -czf backup-$(date +%Y%m%d).tar.gz docs/ archive/ src/

# Store safely
mv backup-*.tar.gz ~/backups/
```

---

## 📞 ESCALATION

### If Issues Occur

**Database Connection Fails**:
1. Verify environment variables identical
2. Check Supabase dashboard (is project active?)
3. Test with simple query in Supabase SQL editor
4. Check network/firewall

**Components Don't Render**:
1. Check browser console for errors
2. Verify imports correct
3. Check dependencies installed
4. Test with minimal component first

**API Endpoints 500 Error**:
1. Check Edge Function logs in Supabase
2. Verify OpenAI API key valid
3. Test with curl first
4. Check CORS headers

**Build Fails**:
1. Clear node_modules and reinstall
2. Check for TypeScript errors
3. Verify all imports resolve
4. Check vite.config.ts

---

## 📁 REFERENCE FILES

**Master Documents** (keep these):
```
docs/AOI_FOUNDATION_FULL_ARCHITECTURE.md      ← Architecture master
docs/AOI_API_SPECIFICATION.md                 ← API reference
docs/AOI_IMPLEMENTATION_ROADMAP.md            ← Implementation guide
docs/PROJECT_SYNC_SUMMARY.md                  ← Sync instructions
docs/TYT_FOUNDATION_SYNC_GUIDE.md            ← Detailed steps
docs/SYNC_AND_CLEANUP_PLAN.md                ← This file
```

**Code References**:
```
src/lib/supabase.ts                          ← Database client
src/utils/foundationDataService.ts           ← Data service
src/components/LiveFoundationTracker.tsx     ← Live stats
src/config/aoiConfig.ts                      ← aOi configuration
```

**Migration Files**:
```
supabase/migrations/20251210102938_create_foundation_schema.sql
supabase/migrations/20251227181821_create_aoi_integration_system.sql
```

---

## ✅ FINAL CHECKLIST

**Before Starting**:
- [ ] Read this entire document
- [ ] Have both projects accessible
- [ ] Know Supabase credentials
- [ ] Have OpenAI API key ready
- [ ] Create backup of current state

**Phase 1 (Day 1)**:
- [ ] Environment variables set in tyt.foundation
- [ ] supabase.ts copied and working
- [ ] foundationDataService.ts copied
- [ ] Database connection verified
- [ ] TODOs reviewed

**Phase 2 (Day 2-3)**:
- [ ] Core components copied
- [ ] API endpoints created
- [ ] All endpoints tested
- [ ] No console errors

**Phase 3 (Day 4-5)**:
- [ ] Cross-domain links added
- [ ] Documentation consolidated
- [ ] Old docs archived
- [ ] Code cleanup done

**Final Verification**:
- [ ] Both sites build successfully
- [ ] Data syncs in real-time
- [ ] APIs respond quickly
- [ ] Navigation seamless
- [ ] No security issues
- [ ] Documentation up-to-date

---

## 🎯 PRIORITY SUMMARY

### DO THIS FIRST (Critical):
1. Connect tyt.foundation to shared Supabase
2. Copy supabase.ts and foundationDataService.ts
3. Test database connection
4. Review TODOs for security issues

### DO THIS NEXT (Important):
1. Copy core components
2. Create API endpoints
3. Test cross-domain functionality
4. Consolidate documentation

### DO THIS LATER (Nice to Have):
1. Real-time sync setup
2. Code splitting optimization
3. Dependency cleanup
4. Archive old documents

---

**Status**: Ready for Execution
**Owner**: Development Team
**Timeline**: 5-10 days for completion
**Risk Level**: Low (well documented, tested approach)

**Next Action**: Start with Phase 1, Day 1 tasks

**aOi says**: "Let's sync these projects and make everything secure and clean!" 🧹✨
