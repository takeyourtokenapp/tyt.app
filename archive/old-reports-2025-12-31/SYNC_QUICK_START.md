# ⚡ TYT SYNC QUICK START - DO THIS NOW

**Date**: December 27, 2025
**Time to Complete**: 2-4 hours
**Status**: tyt.foundation LIVE ✅ | Ready to synchronize

---

## 🎯 IMMEDIATE ACTIONS (Do in order)

### ACTION 1: Verify tyt.foundation (15 min)

**Login to bolt.new:**
1. Go to https://bolt.new
2. Find project: "aOi AI Guide"
3. Open project settings/environment

**Check these values:**
```
✅ VITE_SUPABASE_URL = ?
✅ VITE_SUPABASE_ANON_KEY = ?
✅ OPENAI_API_KEY = ? (present or missing?)
```

**Write down** or screenshot these values!

---

### ACTION 2: Test tyt.foundation Live (10 min)

**Open in browser:**
1. https://tyt.foundation
2. Open DevTools (F12) → Network tab
3. Reload page
4. Look for API calls

**Document what you see:**
- [ ] Homepage loads?
- [ ] aOi chat widget visible?
- [ ] Any API calls to Supabase? (look for `.supabase.co` in Network)
- [ ] Any errors in Console?

**Try these URLs manually:**
- https://tyt.foundation/api/status
- https://tyt.foundation/api/aoi
- https://tyt.foundation/aoi

Note which ones work (200) vs. don't work (404)

---

### ACTION 3: Security Check (20 min)

**In your local takeyourtoken.app folder:**

```bash
cd /tmp/cc-agent/61475162/project

# Check for exposed secrets (CRITICAL!)
grep -r "sk-" src/
grep -r "eyJ" src/ | grep -v "node_modules" | head -5
grep -r "supabase" src/ | grep "http"

# Check .gitignore
cat .gitignore | grep -E "(\.env|secret|key)"

# If .env exists, check it's gitignored
ls -la .env && git check-ignore .env
```

**If you see**:
- ✅ "No matches found" → SAFE
- ⚠️ Any matches → **STOP AND TELL ME**

---

### ACTION 4: Compare Environment Variables (10 min)

**Create comparison file:**

```bash
# In takeyourtoken.app folder
cat > env-comparison.txt << 'EOF'
# takeyourtoken.app .env:
VITE_SUPABASE_URL=<paste from your .env>
VITE_SUPABASE_ANON_KEY=<paste from your .env>

# tyt.foundation (bolt.new):
VITE_SUPABASE_URL=<paste from bolt.new>
VITE_SUPABASE_ANON_KEY=<paste from bolt.new>
OPENAI_API_KEY=<paste from bolt.new or write "missing">

# Are they the same?
MATCH: YES / NO
EOF

cat env-comparison.txt
```

**Expected result:**
- ✅ Supabase URLs MUST match
- ✅ Supabase keys MUST match
- ⚠️ OpenAI key only needed on tyt.foundation

---

### ACTION 5: Backup Current State (15 min)

**Export from bolt.new:**
1. In bolt.new project "aOi AI Guide"
2. Click "Download" or export option
3. Save to your computer
4. Unzip if needed

**Create backup of takeyourtoken.app:**
```bash
cd /tmp/cc-agent/61475162/project

# Create backup
tar -czf ../tyt-app-backup-$(date +%Y%m%d).tar.gz .

# Verify backup created
ls -lh ../tyt-app-backup-*.tar.gz
```

**You should now have:**
- ✅ tyt.foundation code downloaded
- ✅ takeyourtoken.app backed up
- ✅ Safe to proceed with changes

---

### ACTION 6: Test Database Connection from Both Sites (15 min)

**Create test file:**

```typescript
// test-db.ts (create in both projects)
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'YOUR_URL_HERE';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY_HERE';

const supabase = createClient(url, key);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', url.substring(0, 30) + '...');

  // Test 1: Foundation table
  const { data: campaigns, error: e1 } = await supabase
    .from('foundation_campaigns')
    .select('count')
    .limit(1);

  console.log('✅ Foundation campaigns:', campaigns ? 'ACCESSIBLE' : 'ERROR');
  if (e1) console.error('Error:', e1.message);

  // Test 2: User profiles
  const { data: profiles, error: e2 } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);

  console.log('✅ User profiles:', profiles ? 'ACCESSIBLE' : 'ERROR');
  if (e2) console.error('Error:', e2.message);

  // Test 3: aOi tables
  const { data: aoi, error: e3 } = await supabase
    .from('aoi_activity_logs')
    .select('count')
    .limit(1);

  console.log('✅ aOi logs:', aoi ? 'ACCESSIBLE' : 'ERROR');
  if (e3) console.error('Error:', e3.message);

  console.log('\n✅ Test complete!');
}

testConnection();
```

**Run test in takeyourtoken.app:**
```bash
cd /tmp/cc-agent/61475162/project
npx tsx test-db.ts
```

**Run test in tyt.foundation:**
```bash
# If you have it locally:
cd path/to/tyt-foundation
npx tsx test-db.ts

# Or run in bolt.new web console
```

**Expected result:**
- ✅ All 3 tests show "ACCESSIBLE"
- ✅ Same results from both sites
- ⚠️ If different results → databases NOT synced

---

## 📊 SYNC STATUS CHECKLIST

After completing all 6 actions, fill this out:

```
[ ] tyt.foundation verified in bolt.new
[ ] Environment variables documented
[ ] Security check passed (no exposed secrets)
[ ] Environment variables match between sites
[ ] Both codebases backed up
[ ] Database connection tested from both sites

Database Sync Status:
[ ] foundation_campaigns accessible from both: YES / NO
[ ] profiles table accessible from both: YES / NO
[ ] aoi_activity_logs accessible from both: YES / NO

Are databases synced? YES / NO
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: Different Supabase URLs
**Problem**: tyt.foundation uses different Supabase project

**Fix**:
1. Update tyt.foundation environment in bolt.new
2. Set VITE_SUPABASE_URL to match takeyourtoken.app
3. Set VITE_SUPABASE_ANON_KEY to match takeyourtoken.app
4. Redeploy tyt.foundation
5. Test again

### Issue 2: Tables Not Accessible
**Problem**: Database connection works but tables return errors

**Fix**:
1. Check RLS policies in Supabase dashboard
2. Verify you're using correct anon key (not service_role)
3. Check table names (exact spelling)
4. Confirm migrations ran successfully

### Issue 3: CORS Errors
**Problem**: API calls blocked by CORS

**Fix**:
1. Check API endpoint CORS headers
2. Add `Access-Control-Allow-Origin: *`
3. Add `Access-Control-Allow-Methods: GET, POST, OPTIONS`
4. Handle OPTIONS preflight requests

### Issue 4: Secrets Exposed in Code
**Problem**: grep found API keys in source files

**🚨 CRITICAL FIX REQUIRED:**
1. **STOP** - Don't commit anything
2. Remove all hardcoded secrets
3. Move to .env file
4. Add .env to .gitignore
5. If already committed to git, rotate keys immediately
6. Use BFG Repo-Cleaner to remove from history

---

## ✅ COMPLETION CRITERIA

**You're ready for next steps when:**

✅ All 6 actions completed
✅ No security issues found
✅ Database accessible from both sites
✅ Environment variables documented
✅ Backups created
✅ Sync checklist filled out

**Then proceed to**: V3_SYNCHRONIZATION_ACTION_PLAN.md → DAY 2

---

## 📞 NEED HELP?

**If you encounter:**
- 🔴 Security issues (exposed secrets)
- 🔴 Database connection failures
- 🔴 Missing access to bolt.new
- 🔴 Any errors you can't resolve

**STOP and provide me with:**
1. Which action you were on (1-6)
2. Exact error message
3. What you tried
4. Screenshots if helpful

I'll provide specific fixes for your situation.

---

## 🎯 NEXT STEP

After completing this quick start:

👉 **Report back with:**
```
Sync Quick Start Complete ✅

Database Status: SYNCED / NOT SYNCED
Security Check: PASSED / ISSUES FOUND
Environment Match: YES / NO

Ready for: DAY 2 (Security Cleanup) / Need Help
```

Then we'll proceed with full synchronization and GitHub setup!

---

**Estimated Time**: 2-4 hours
**Difficulty**: Medium
**Prerequisites**: Access to bolt.new, local terminal, Supabase dashboard

🚀 **Start with ACTION 1 now!**

---

*Part of: TYT V3 SYNCHRONIZATION PROJECT*
*Created: December 27, 2025*
*Status: READY TO EXECUTE*
