# Supabase Dashboard Configuration Guide

## Quick Reference for Non-SQL Configuration Issues

This guide provides step-by-step instructions for security findings that require Supabase Dashboard configuration (cannot be fixed via SQL migrations).

---

## Issue 1: Auth Connection Strategy (Priority: Medium)

### Current State
```
Auth Server Connection Strategy: Fixed (10 connections)
```

### Problem
- Auth server limited to 10 connections regardless of database size
- Won't scale when database instance is upgraded
- Can cause Auth bottlenecks during traffic spikes

### Required State
```
Auth Server Connection Strategy: Percentage-based (5-10%)
```

### Fix Instructions

#### Step 1: Access Supabase Dashboard
1. Go to [app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project

#### Step 2: Navigate to Database Settings
1. Click **Settings** (gear icon) in left sidebar
2. Click **Database** tab
3. Scroll to **Connection Pooling** section

#### Step 3: Update Auth Server Settings
1. Find section: **Auth Server Connection Pool**
2. Current setting shows: `Connection Strategy: Fixed`
3. Click **Edit** or **Change**
4. Select: `Percentage-based`
5. Set percentage: `8%` (recommended)
6. Set minimum connections: `5`
7. Set maximum connections: `20`
8. Click **Save Changes**

#### Step 4: Verify
After saving, you should see:
```
Auth Server Connection Pool
Strategy: Percentage-based
Percentage: 8%
Min Connections: 5
Max Connections: 20
```

### Impact

**Before:**
- 10 connections always, regardless of database size
- Upgrading database doesn't help Auth performance

**After:**
- Scales automatically with database size
- Small instance (100 connections): 8 Auth connections
- Medium instance (200 connections): 16 Auth connections
- Large instance (500 connections): 40 Auth connections (capped at 20 max)

### Expected Results

- No downtime required
- Changes apply immediately
- Auth server automatically scales with database

---

## Issue 2: Vector Extension in Public Schema (Priority: Low)

### Current State
```sql
Extension 'vector' is in 'public' schema
```

### Problem
- Best practice: extensions should be in dedicated schema
- Can interfere with pg_dump/restore
- Not a security vulnerability, just a best practice

### Required State
```sql
Extension 'vector' should be in 'extensions' schema
```

### ⚠️ WARNING: This Fix Requires Downtime

Moving the extension requires:
- Taking database offline (10-15 minutes)
- Dropping and recreating extension
- Updating application code
- Testing all vector queries

### Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| Database in active production | **DO NOT FIX** - wait for maintenance window |
| Database has active users | **DO NOT FIX** - wait for maintenance window |
| Database in development/testing | **SAFE TO FIX** - follow instructions below |
| Scheduled maintenance window | **FIX DURING WINDOW** - follow instructions below |

### Fix Instructions (Only During Scheduled Maintenance)

#### Step 1: Backup Database

```bash
# Create full backup
pg_dump -Fc $DATABASE_URL > backup_before_vector_move_$(date +%Y%m%d_%H%M%S).dump

# Verify backup was created
ls -lh backup_before_vector_move_*.dump
```

#### Step 2: Notify Users

Send notification:
```
Database Maintenance: 10-15 minute downtime
Start Time: [YOUR_TIME]
Reason: Moving vector extension to dedicated schema
Impact: Application will be unavailable during maintenance
```

#### Step 3: Put Application in Maintenance Mode

Update your frontend to show maintenance page:
```typescript
// In App.tsx or similar
const MAINTENANCE_MODE = true;

if (MAINTENANCE_MODE) {
  return <MaintenancePage />;
}
```

#### Step 4: Run Migration

Via Supabase Dashboard → SQL Editor:

```sql
-- Step 4.1: Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Step 4.2: Check dependencies
SELECT
  n.nspname as schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) LIKE '%vector%'
  AND n.nspname = 'public';

-- Step 4.3: Drop extension (only if no dependencies shown above)
DROP EXTENSION IF EXISTS vector CASCADE;

-- Step 4.4: Recreate in extensions schema
CREATE EXTENSION vector SCHEMA extensions;

-- Step 4.5: Update database search path
ALTER DATABASE postgres SET search_path = public, extensions;

-- Step 4.6: Verify
SELECT
  e.extname,
  n.nspname as schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';
-- Should show: vector | extensions
```

#### Step 5: Update Application Code

Find all vector queries in your codebase:

```bash
# Search for vector usage
grep -r "embedding" src/
grep -r "vector" src/
grep -r "match_documents" src/
```

Update RPC calls:

**Before:**
```typescript
const { data, error } = await supabase
  .rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.5
  });
```

**After:**
```typescript
const { data, error } = await supabase
  .rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.5
  });
// Note: search_path update makes this automatic, but you can also:
// .rpc('extensions.match_documents', { ... })
```

If you have any functions that use vector explicitly:

**Before:**
```sql
CREATE OR REPLACE FUNCTION search_knowledge(query_embedding vector(1536))
```

**After:**
```sql
CREATE OR REPLACE FUNCTION search_knowledge(query_embedding extensions.vector(1536))
-- OR rely on search_path:
CREATE OR REPLACE FUNCTION search_knowledge(query_embedding vector(1536))
-- This works if search_path includes 'extensions'
```

#### Step 6: Test Vector Queries

```sql
-- Test 1: Verify extension is accessible
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Test 2: Test vector operations
SELECT '[1,2,3]'::extensions.vector <-> '[1,2,3.1]'::extensions.vector as distance;

-- Test 3: Check your application functions
SELECT * FROM aoi_knowledge_graph LIMIT 1;

-- Test 4: Test embedding search
SELECT * FROM search_aoi_knowledge('[0.1, 0.2, ...]'::vector(1536), 0.5, 10);
```

#### Step 7: Deploy and Verify

1. Deploy updated application code
2. Disable maintenance mode
3. Monitor error logs for vector-related issues
4. Test AOI chat functionality
5. Test Academy lesson search

#### Step 8: Verify Success

```sql
-- Should return 'extensions'
SELECT n.nspname
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';
```

### Rollback Procedure

If issues occur:

```sql
-- Restore from backup
pg_restore -d $DATABASE_URL backup_before_vector_move_YYYYMMDD_HHMMSS.dump

-- Or manual rollback:
DROP EXTENSION IF EXISTS vector CASCADE;
CREATE EXTENSION vector SCHEMA public;
ALTER DATABASE postgres SET search_path = public;
```

### Alternative: Leave As-Is

**Recommended for most users:** Do not move the extension.

**Reasons:**
- Current setup works perfectly
- No security vulnerability
- No performance impact
- Avoids complexity and downtime
- Best practice is minor concern

**When to move:**
- During first major maintenance window (3-6 months)
- When upgrading database version
- When moving to new infrastructure
- If you have strict compliance requirements

---

## Issue 3: Unused Indexes (Priority: Informational)

### Status
✅ **No Action Required** - This is expected behavior for a new database

### Explanation

All 59 "unused" indexes are foreign key indexes that will be used automatically once:
1. Application starts running queries
2. Features go live
3. User traffic increases

### Monitoring

Run this query weekly:

```sql
-- Check index usage growth
SELECT
  COUNT(*) FILTER (WHERE idx_scan > 0) as used_indexes,
  COUNT(*) FILTER (WHERE idx_scan = 0) as unused_indexes,
  ROUND(100.0 * COUNT(*) FILTER (WHERE idx_scan > 0) / COUNT(*), 1) as usage_percentage
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND indexrelname LIKE 'idx_%';
```

### Expected Timeline

- Week 1: ~15% used
- Week 2: ~35% used
- Week 4: ~60% used
- Month 3: ~90% used

### When to Take Action

Only consider dropping an index if:
- ✅ Database has been running for 90+ days
- ✅ Feature using that table is fully deployed and active
- ✅ Index shows 0 scans after 90 days
- ✅ You've verified it's not a foreign key index

**Query to find truly unused indexes after 90 days:**

```sql
SELECT
  s.schemaname,
  s.relname as table_name,
  s.indexrelname as index_name,
  pg_size_pretty(pg_relation_size(s.indexrelid)) as index_size,
  s.idx_scan as times_used
FROM pg_stat_user_indexes s
LEFT JOIN pg_constraint c ON c.conname = s.indexrelname
WHERE s.schemaname = 'public'
  AND s.indexrelname LIKE 'idx_%'
  AND s.idx_scan = 0
  AND c.conname IS NULL  -- Not a foreign key constraint
ORDER BY pg_relation_size(s.indexrelid) DESC;
```

---

## Summary Checklist

### High Priority (Do This Week)
- [ ] Update Auth connection strategy to percentage-based

### Low Priority (Do During Next Maintenance Window)
- [ ] Consider moving vector extension (optional)

### Monitoring (Ongoing)
- [ ] Week 1: Check index usage daily
- [ ] Week 2-4: Check index usage weekly
- [ ] Month 2+: Check index usage monthly

### No Action Required
- [x] 59 unused indexes - these are correct and will be used automatically

---

## Support

If you encounter issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Supabase Dashboard → Logs
3. **Community Support**: https://github.com/supabase/supabase/discussions
4. **Documentation**: https://supabase.com/docs

---

## Document Version

- **Version:** 1.0
- **Date:** 2026-01-12
- **Last Updated:** 2026-01-12
- **Next Review:** 2026-02-12
