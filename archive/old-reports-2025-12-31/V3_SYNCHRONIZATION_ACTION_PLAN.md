# 🔄 TYT V3 SYNCHRONIZATION & CLEANUP ACTION PLAN

**Date**: December 27, 2025
**Status**: tyt.foundation DEPLOYED ✅ | takeyourtoken.app READY ✅
**Goal**: Complete synchronization, security cleanup, and production readiness

---

## 🎯 CRITICAL DISCOVERY

**tyt.foundation is LIVE**: https://tyt.foundation
- Already deployed via bolt.new (project: "aOi AI Guide")
- Same user account
- **STATUS: Needs verification and sync with takeyourtoken.app**

**takeyourtoken.app is READY**:
- Build successful (15.06s)
- 96 migrations, 29 Edge Functions
- Full feature set (88% MVP complete)
- **STATUS: Needs GitHub sync and security cleanup**

---

## 📋 IMMEDIATE ACTION PLAN (Next 7 Days)

### DAY 1: VERIFICATION & ACCESS (TODAY)

#### Task 1.1: Verify tyt.foundation Configuration ⚡ CRITICAL
```bash
# Check if tyt.foundation is connected to correct Supabase
# Access bolt.new project "aOi AI Guide"

Steps:
1. Login to bolt.new
2. Open project "aOi AI Guide"
3. Check Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - OPENAI_API_KEY (if exists)
4. Verify they match takeyourtoken.app/.env
5. Check deployed files structure

Expected Result:
✅ Both sites use SAME Supabase instance
✅ Environment variables documented
✅ File structure mapped
```

#### Task 1.2: Test tyt.foundation Endpoints
```bash
# Manual browser tests
1. Visit https://tyt.foundation
2. Check for:
   - aOi chat interface
   - Navigation menu
   - API endpoints (/api/status, /api/aoi)
3. Open Browser DevTools → Network tab
4. Look for API calls to Supabase
5. Document all findings

Expected Result:
✅ Current feature list documented
✅ API availability confirmed
✅ Database connectivity verified
```

#### Task 1.3: GitHub Repository Audit
```bash
# Check existing GitHub repos

Repositories to verify:
1. https://github.com/takeyourtokenapp/tyt.app
   - Last commit date
   - Branch structure
   - .env.example present
   - Secrets exposed? (CRITICAL CHECK)

2. https://github.com/takeyourtokenapp/aOi_intelligent_guide
   - Current state
   - Connection to tyt.foundation
   - Deployment config

3. Check for any other related repos

Action:
- If repos don't exist → CREATE them
- If repos exist but outdated → DOCUMENT gaps
- If secrets exposed → IMMEDIATE rotation required
```

---

### DAY 2: SECURITY CLEANUP ⚠️ PRIORITY

#### Task 2.1: Environment Variables Security Audit
```bash
# Local project (takeyourtoken.app)
cd /tmp/cc-agent/61475162/project

# 1. Verify .env is in .gitignore
grep "^\.env$" .gitignore || echo ".env" >> .gitignore
grep "^\.env\.local$" .gitignore || echo ".env.local" >> .gitignore

# 2. Check for exposed secrets in code
grep -r "sk-" src/ && echo "⚠️ OPENAI KEY FOUND"
grep -r "eyJ" src/ && echo "⚠️ JWT/ANON KEY FOUND"
grep -r "postgresql://" src/ && echo "⚠️ DB URL FOUND"

# 3. Check git history for secrets (if repo initialized)
git log --all --full-history -- .env
git log --all --full-history -- "*.key"

# 4. If secrets found in history:
# Use BFG Repo-Cleaner or git-filter-branch to remove
```

**If Secrets Exposed in GitHub**:
```bash
# EMERGENCY PROTOCOL
1. Immediately rotate ALL exposed keys:
   - Supabase: Project Settings → API → Reset keys
   - OpenAI: Platform → API Keys → Revoke
   - Any blockchain RPC keys

2. Update .env files on both projects
3. Redeploy both sites with new keys
4. Document incident in SECURITY.md
```

#### Task 2.2: Create Clean .env.example Files
```bash
# For takeyourtoken.app
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Blockchain RPC URLs (Optional for V3)
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_ALCHEMY_API_KEY=your-alchemy-key

# Feature Flags
VITE_ENABLE_AOI=true
VITE_FOUNDATION_URL=https://tyt.foundation
EOF

# For tyt.foundation (bolt.new project)
cat > .env.example << 'EOF'
# Supabase (MUST MATCH takeyourtoken.app)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI for aOi
OPENAI_API_KEY=sk-your-key-here

# Cross-domain
VITE_APP_URL=https://takeyourtoken.app
EOF
```

#### Task 2.3: Security Scan
```bash
# Run npm audit
npm audit --production

# Check for high/critical vulnerabilities
npm audit --audit-level=moderate

# Update vulnerable packages
npm audit fix

# If breaking changes needed:
npm audit fix --force
# Then test: npm run build
```

---

### DAY 3: GitHub Synchronization

#### Task 3.1: Sync takeyourtoken.app to GitHub
```bash
cd /tmp/cc-agent/61475162/project

# Initialize if needed
git init

# Add all files (after ensuring .gitignore is correct)
git add .

# First commit (or sync with existing)
git commit -m "feat: v3 foundation - complete synchronized codebase

- 96 SQL migrations (complete database schema)
- 237 TypeScript files (74 components, 36 pages)
- 29 Edge Functions (Supabase backend)
- 10 Smart Contracts (audit-ready)
- Foundation integration complete
- aOi system ready for cross-domain
- Security cleanup applied
- Ready for V3 blockchain integration"

# Set remote (if not exists)
git remote add origin https://github.com/takeyourtokenapp/tyt.app

# Push to main
git branch -M main
git push -u origin main --force # Use --force ONLY if needed to override

# Create development branch
git checkout -b v3-realworld-development
git push -u origin v3-realworld-development
```

#### Task 3.2: Setup GitHub Actions CI/CD
```bash
# Create .github/workflows directory
mkdir -p .github/workflows

# CI Pipeline (already in roadmap)
# Copy from TYT_V3_REALWORLD_MASTER_ROADMAP.md → GitHub Actions section
```

#### Task 3.3: Sync tyt.foundation Code
```bash
# In bolt.new "aOi AI Guide" project

Steps:
1. Export/download project from bolt.new
2. Create local directory:
   mkdir -p ~/tyt-foundation-sync
   cd ~/tyt-foundation-sync

3. Initialize git:
   git init
   git remote add origin https://github.com/takeyourtokenapp/aOi_intelligent_guide

4. Commit current state:
   git add .
   git commit -m "sync: current deployed state of tyt.foundation"
   git push -u origin main

5. Document deployment:
   - Vercel/Netlify/bolt.new hosting details
   - Environment variables
   - Build configuration
```

---

### DAY 4-5: Database & API Synchronization

#### Task 4.1: Verify Supabase Shared Access
```sql
-- Connect to Supabase SQL Editor

-- 1. Check all Foundation tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'foundation_%'
ORDER BY table_name;

-- Expected tables (12):
-- foundation_annual_reports
-- foundation_campaigns
-- foundation_donations
-- foundation_expenses
-- foundation_grants_applications
-- foundation_hospital_partners
-- foundation_impact_metrics
-- foundation_research_grants
-- foundation_transparency_reports
-- (+ 3 more related tables)

-- 2. Check aOi tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'aoi_%'
ORDER BY table_name;

-- Expected tables:
-- aoi_user_contexts
-- aoi_activity_logs
-- aoi_knowledge_graph
-- aoi_recommendations

-- 3. Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('foundation_donations', 'aoi_activity_logs')
ORDER BY tablename;
```

#### Task 4.2: Test Cross-Domain Database Access
```typescript
// Test script for both sites

// File: test-database-sync.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testSync() {
  console.log('Testing Supabase connectivity...');

  // Test 1: Foundation tables
  const { data: campaigns, error: e1 } = await supabase
    .from('foundation_campaigns')
    .select('count');

  console.log('Foundation campaigns:', campaigns, e1 || '✅');

  // Test 2: aOi tables
  const { data: logs, error: e2 } = await supabase
    .from('aoi_activity_logs')
    .select('count')
    .limit(1);

  console.log('aOi logs:', logs, e2 || '✅');

  // Test 3: User profiles
  const { data: profiles, error: e3 } = await supabase
    .from('profiles')
    .select('count');

  console.log('User profiles:', profiles, e3 || '✅');

  // Test 4: Real-time subscription test
  const channel = supabase
    .channel('test-sync')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'foundation_donations'
    }, (payload) => {
      console.log('Real-time update:', payload);
    })
    .subscribe();

  console.log('Real-time subscription active ✅');

  // Cleanup
  setTimeout(() => {
    channel.unsubscribe();
    console.log('Test complete!');
  }, 5000);
}

testSync();
```

**Run on both projects**:
```bash
# takeyourtoken.app
npx tsx test-database-sync.ts

# tyt.foundation (in bolt.new or locally)
npx tsx test-database-sync.ts
```

#### Task 4.3: Deploy/Update tyt.foundation API Endpoints

**Check if these exist** in bolt.new project:
```
/api/aoi → POST endpoint for aOi chat
/api/status → GET endpoint for health check
/api/foundation-stats → GET endpoint for dashboard
```

**If missing, create them** (code in TYT_V3_REALWORLD_MASTER_ROADMAP.md Phase 1.3)

**Test endpoints**:
```bash
# Status check
curl https://tyt.foundation/api/status

# Should return:
# {
#   "status": "online",
#   "services": {
#     "database": true,
#     "ai": true,
#     "api": true
#   }
# }

# aOi chat test
curl -X POST https://tyt.foundation/api/aoi \
  -H "Content-Type: application/json" \
  -d '{"question": "What is TYT Foundation?", "userId": "test"}'

# Should return AI response
```

---

### DAY 6-7: Cross-Domain Integration Testing

#### Task 6.1: Update takeyourtoken.app Configuration
```typescript
// src/config/aoiConfig.ts (already exists, verify URLs)

export const AOI_CONFIG = {
  foundation: {
    domain: 'https://tyt.foundation', // ✅ VERIFY
    apiEndpoint: 'https://tyt.foundation/api/aoi', // ✅ TEST
    statusUrl: 'https://tyt.foundation/api/status', // ✅ TEST
    websiteUrl: 'https://tyt.foundation',
  },

  features: {
    useFoundationApi: true, // ✅ Enable
    fallbackToLocal: true,
    crossDomainAuth: true,
  }
};
```

#### Task 6.2: Add Cross-Domain Links

**In tyt.foundation** (homepage):
```html
<!-- Add prominent CTA -->
<a href="https://takeyourtoken.app/app"
   className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-bold">
  Start Mining & Earning →
</a>

<a href="https://takeyourtoken.app/app/foundation"
   className="text-blue-400 hover:underline">
  View Foundation Dashboard
</a>
```

**In takeyourtoken.app** (/app/foundation page):
```typescript
// Add link back to tyt.foundation
<a href="https://tyt.foundation"
   target="_blank"
   className="text-blue-400 hover:underline flex items-center gap-2">
  <ExternalLink size={16} />
  Visit Foundation Website
</a>

<a href="https://tyt.foundation/research"
   className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
  Explore Research
</a>
```

#### Task 6.3: Test Complete User Journey
```
User Journey Test:

1. Start: https://tyt.foundation
   → User reads about mission
   → Clicks "Start Mining"

2. Redirect: https://takeyourtoken.app/signup
   → User creates account
   → Email verification (if enabled)

3. Login: https://takeyourtoken.app/app/dashboard
   → User sees dashboard
   → Navigates to /app/foundation

4. Foundation Block: View donation stats
   → Real-time data from shared Supabase
   → Click "Learn More About Research"

5. Redirect: https://tyt.foundation/research
   → Seamless navigation
   → User context maintained

6. aOi Interaction:
   → User asks question
   → aOi queries Supabase for user data
   → Personalized response

7. Complete: User returns to app
   → All data synced
   → Progress tracked across domains

✅ PASS if all steps work seamlessly
⚠️ FAIL if any broken links or missing data
```

---

## 🔍 VERIFICATION CHECKLIST

### Security ✅
- [ ] No secrets in code (GitHub scan)
- [ ] .env files in .gitignore
- [ ] .env.example files created
- [ ] npm audit passed
- [ ] Supabase keys rotated (if needed)
- [ ] OpenAI key secured
- [ ] RLS policies verified

### GitHub Sync ✅
- [ ] takeyourtoken.app pushed to main
- [ ] v3-realworld-development branch created
- [ ] tyt.foundation code backed up
- [ ] .github/workflows/ci.yml configured
- [ ] README.md files updated
- [ ] SECURITY.md documented

### Database ✅
- [ ] Both sites use same Supabase
- [ ] Foundation tables accessible
- [ ] aOi tables accessible
- [ ] RLS policies working
- [ ] Real-time subscriptions active
- [ ] Test queries successful

### API Endpoints ✅
- [ ] /api/status returns 200
- [ ] /api/aoi accepts POST
- [ ] Database queries work
- [ ] CORS configured correctly
- [ ] Error handling present
- [ ] Rate limiting (optional)

### Cross-Domain ✅
- [ ] Links from foundation → app work
- [ ] Links from app → foundation work
- [ ] aOi can access both databases
- [ ] User context shared
- [ ] Session management working
- [ ] No CORS errors in console

### Build & Deploy ✅
- [ ] takeyourtoken.app builds successfully
- [ ] tyt.foundation builds successfully
- [ ] Environment variables set
- [ ] DNS configured correctly
- [ ] SSL certificates valid
- [ ] Performance acceptable (<2s load)

---

## 📊 CURRENT STATE MATRIX

```
┌─────────────────────────────────────────────────────────────┐
│ COMPONENT              │ takeyourtoken.app │ tyt.foundation │
├─────────────────────────────────────────────────────────────┤
│ Deployment             │ ✅ Ready          │ ✅ Live        │
│ GitHub Sync            │ ⏳ Pending        │ ⏳ Pending     │
│ Database Connected     │ ✅ Yes            │ ❓ Verify      │
│ API Endpoints          │ ✅ 29 Functions   │ ❓ Check       │
│ aOi Integration        │ ✅ Ready          │ ❓ Check       │
│ Cross-Domain Links     │ ⏳ Add            │ ⏳ Add         │
│ Environment Variables  │ ✅ Set            │ ❓ Verify      │
│ Security Cleanup       │ ⏳ Pending        │ ⏳ Pending     │
│ Documentation          │ ✅ Complete       │ ⏳ Add         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 SUCCESS CRITERIA

**Week 1 Complete When**:
1. ✅ Both sites use same Supabase instance (verified)
2. ✅ No secrets exposed in GitHub
3. ✅ takeyourtoken.app synced to GitHub
4. ✅ tyt.foundation code backed up
5. ✅ Cross-domain links working
6. ✅ aOi can query both sites' data
7. ✅ All builds successful
8. ✅ Documentation complete

**Ready for V3 Blockchain Integration When**:
1. All Week 1 criteria met
2. Smart contracts audit initiated
3. Test environment configured
4. Team aligned on roadmap
5. Budget approved ($200k)

---

## 🚨 EMERGENCY CONTACTS & ESCALATION

### If Secrets Exposed:
1. **STOP ALL WORK**
2. Rotate keys immediately (Supabase, OpenAI)
3. Document in security incident log
4. Update both deployments
5. Scan for unauthorized access
6. Consider legal notification if required

### If Database Issues:
1. Check Supabase dashboard status
2. Verify RLS policies not blocking
3. Test with service_role_key (careful!)
4. Check logs in Supabase
5. Contact Supabase support if needed

### If Deployment Fails:
1. Check build logs
2. Verify environment variables
3. Test locally first
4. Rollback to previous version
5. Debug incrementally

---

## 📋 DAILY STANDUP FORMAT (Next 7 Days)

### Daily Report Template:
```
Date: YYYY-MM-DD
Status: 🟢 On Track | 🟡 Minor Issues | 🔴 Blocked

Completed Today:
- [ ] Task 1
- [ ] Task 2

Blockers:
- None / [Describe blocker]

Tomorrow's Goals:
- [ ] Task 3
- [ ] Task 4

Notes:
[Any observations, discoveries, or concerns]
```

---

## 🎉 WEEK 1 COMPLETION CELEBRATION

**When all tasks complete**, you will have:
- ✅ Two production sites fully synchronized
- ✅ Shared database with full RLS security
- ✅ aOi AI with complete Foundation access
- ✅ All code backed up to GitHub
- ✅ Security hardened and verified
- ✅ Cross-domain user journey working
- ✅ Ready for V3 blockchain transformation

**Next Steps**: Follow TYT_V3_REALWORLD_MASTER_ROADMAP.md Phase 2 (Smart Contract Audit)

---

## 📞 QUESTIONS TO ANSWER (User Input Needed)

### Critical Questions:
1. **Supabase Credentials**: Do both sites use the same Supabase project?
2. **OpenAI Key**: Is OPENAI_API_KEY already set in tyt.foundation?
3. **GitHub Access**: Do you have push access to both repos?
4. **Bolt.new Access**: Can you export/download the tyt.foundation project?
5. **Budget**: Is $200k budget approved for V3 transformation?

### Configuration Questions:
1. Should email verification be enabled? (Currently disabled)
2. What domains for CORS? (Currently allow all with *)
3. Any other environment variables needed?
4. Preferred deployment platform for tyt.foundation? (Vercel/Netlify/bolt.new)

### Roadmap Questions:
1. Target launch date for V3?
2. Priority: Speed vs. Thoroughness?
3. Team size: Solo or hiring developers?
4. Marketing budget allocation?

---

**NEXT IMMEDIATE ACTION**:

Start with **DAY 1, Task 1.1** → Verify tyt.foundation configuration in bolt.new

🚀 **Ready to begin synchronization!**

---

*Document Version: 1.0*
*Created: December 27, 2025*
*Part of: TYT V3 REALWORLD MASTER ROADMAP*
*Status: ACTION REQUIRED*
