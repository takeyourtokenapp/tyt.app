# Quick Start: Apply Security Fixes

## 1. Review Changes
Read these files first:
- `SECURITY_AUDIT_FIXES_COMPLETE.md` - Full overview
- `SECURITY_FIXES_AUTH_SETTINGS.md` - Manual steps

## 2. Apply Migrations

### Option A: Using Supabase CLI (Recommended)
```bash
# Navigate to project directory
cd /tmp/cc-agent/61475162/project

# Apply migrations
supabase db push

# Or apply individually
supabase migration up
```

### Option B: Using Supabase Dashboard
1. Go to **Database** → **Migrations**
2. Upload each migration file in order:
   - `20251228200000_drop_unused_indexes_part1.sql`
   - `20251228200005_drop_unused_indexes_part2.sql`
   - `20251228200010_drop_unused_indexes_part3.sql`
   - `20251228200015_drop_unused_indexes_part4.sql`
   - `20251228200020_drop_unused_indexes_part5.sql`
   - `20251228200025_drop_unused_indexes_part6.sql`
   - `20251228200030_drop_unused_indexes_part7.sql`
   - `20251228200035_move_vector_extension.sql`

### Option C: Direct SQL Execution
```bash
# Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"

# Run each migration
\i supabase/migrations/20251228200000_drop_unused_indexes_part1.sql
\i supabase/migrations/20251228200005_drop_unused_indexes_part2.sql
\i supabase/migrations/20251228200010_drop_unused_indexes_part3.sql
\i supabase/migrations/20251228200015_drop_unused_indexes_part4.sql
\i supabase/migrations/20251228200020_drop_unused_indexes_part5.sql
\i supabase/migrations/20251228200025_drop_unused_indexes_part6.sql
\i supabase/migrations/20251228200030_drop_unused_indexes_part7.sql
\i supabase/migrations/20251228200035_move_vector_extension.sql
```

## 3. Verify Migrations Applied

```sql
-- Check vector extension location (should be 'extensions')
SELECT e.extname, n.nspname AS schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';

-- Count remaining indexes starting with idx_
SELECT COUNT(*) as remaining_idx_indexes
FROM pg_indexes
WHERE indexname LIKE 'idx_%';
```

## 4. Apply Manual Auth Settings

Follow instructions in `SECURITY_FIXES_AUTH_SETTINGS.md`:
1. Enable HaveIBeenPwned password protection
2. Switch Auth connections to percentage-based

## 5. Test Changes

### Test 1: Password Protection
Try to register with weak password (should fail)

### Test 2: Application Functionality
- Run your application
- Test key features
- Monitor for any errors

### Test 3: Performance
Monitor write operation performance (should improve)

## Summary Checklist

- [ ] Backup database before applying
- [ ] Apply 8 SQL migrations
- [ ] Verify vector extension moved
- [ ] Configure Auth password protection
- [ ] Configure Auth connection pool
- [ ] Test application functionality
- [ ] Monitor performance metrics

---

**Estimated Time:** 15-30 minutes
**Risk Level:** Low (all changes are non-breaking)
**Rollback:** Indexes can be recreated if needed
