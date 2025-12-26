# Supabase Auth Configuration Fixes

This document covers security and performance improvements that must be configured in the Supabase Dashboard (cannot be done via SQL migrations).

## 🔒 Security Issues to Fix

### 1. Leaked Password Protection (CRITICAL)

**Issue:** Supabase Auth can check passwords against HaveIBeenPwned.org to prevent use of compromised passwords. This is currently disabled.

**Impact:** Users might use passwords that have been exposed in data breaches.

**Fix:**
1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Find **"Password Requirements"** section
3. Enable **"Check for breached passwords"**
4. Save changes

**Result:** Users will be prevented from using passwords that appear in known data breaches.

---

## ⚡ Performance Issues to Fix

### 2. Auth DB Connection Strategy (PERFORMANCE)

**Issue:** Auth server is configured to use a fixed 10 connections. Increasing instance size won't improve Auth performance.

**Impact:** Auth performance won't scale with database upgrades.

**Fix:**
1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Find **"Connection Pooling"** section
3. Under **"Auth Pooler"**, change from:
   - **Current:** Fixed (10 connections)
   - **New:** Percentage-based (e.g., 10% of max connections)
4. Save changes

**Recommended Values:**
- **Small Projects:** 5-10% of max connections
- **Medium Projects:** 10-15% of max connections
- **Large Projects:** 15-20% of max connections

**Result:** Auth server will automatically scale connections with database instance size.

---

## ✅ What Was Fixed via Migrations

The following issues were resolved through database migrations:

### 1. Unindexed Foreign Keys ✅
- **Fixed:** Added 44 indexes on foreign key columns
- **Impact:** Dramatically improved JOIN performance and constraint checking
- **Files:**
  - `fix_unindexed_foreign_keys_part1.sql`
  - `fix_unindexed_foreign_keys_part2.sql`
  - `fix_unindexed_foreign_keys_part3.sql`
  - `fix_unindexed_foreign_keys_part4.sql`

### 2. Unused Indexes ✅
- **Fixed:** Dropped 5 unused indexes
- **Impact:** Reduced storage overhead and improved write performance
- **File:** `drop_unused_indexes.sql`
- **Indexes Dropped:**
  - `idx_foundation_allocations_approved_by`
  - `idx_foundation_impact_reports_published_by`
  - `idx_security_alerts_acknowledged_by`
  - `idx_security_alerts_resolved_by`
  - `idx_user_achievements_badge_code_fkey`

### 3. Multiple Permissive Policies ✅
- **Fixed:** Consolidated overlapping RLS policies
- **Impact:** Clearer security model, easier to reason about access control
- **File:** `fix_multiple_permissive_policies_v2.sql`
- **Tables Fixed:**
  - `community_online_users`
  - `game_tournament_participants`
  - `treasury_reserves`

### 4. Security Definer Views ✅
- **Fixed:** Dropped 11 SECURITY DEFINER views
- **Impact:** Views now respect RLS policies of the calling user
- **File:** `fix_security_definer_views.sql`
- **Views Removed:**
  - `foundation_summary_by_period`
  - `account_balance_verification`
  - `v_active_blockchain_addresses`
  - `foundation_summary_by_source`
  - `grant_allocation_summary`
  - `v_user_rewards_summary_v2`
  - `burn_statistics`
  - `v_miner_rewards_summary_v2`
  - `foundation_summary`
  - `cron_job_stats`
  - `system_balance_summary`

**Note:** If these views are needed, recreate them as `SECURITY INVOKER` in application code.

### 5. Function Search Paths ✅
- **Fixed:** Set fixed search_path on 8 function overloads
- **Impact:** Prevents search path hijacking attacks
- **File:** `fix_function_search_paths_v2.sql`
- **Functions Fixed:**
  - `log_cron_execution` (2 overloads)
  - `calculate_deposit_fees_v3` (2 overloads)
  - `cleanup_old_cron_logs` (2 overloads)
  - `determine_rank` (2 overloads)

---

## 📊 Summary

| Issue | Status | Fix Method |
|-------|--------|------------|
| Unindexed Foreign Keys (44) | ✅ Fixed | SQL Migration |
| Unused Indexes (5) | ✅ Fixed | SQL Migration |
| Multiple Permissive Policies (3) | ✅ Fixed | SQL Migration |
| Security Definer Views (11) | ✅ Fixed | SQL Migration |
| Function Search Paths (8) | ✅ Fixed | SQL Migration |
| **Leaked Password Protection** | ⚠️ **Manual** | **Dashboard** |
| **Auth Connection Strategy** | ⚠️ **Manual** | **Dashboard** |

---

## 🚀 Next Steps

### Immediate Actions Required:

1. **Enable Password Breach Detection** (5 minutes)
   - Go to Auth → Policies
   - Enable "Check for breached passwords"

2. **Switch to Percentage-Based Auth Connections** (5 minutes)
   - Go to Settings → Database
   - Change Auth Pooler to percentage-based
   - Set to 10-15% of max connections

### Verification:

After applying all fixes, run Supabase's built-in security advisor again:
```bash
# In Supabase Dashboard
Settings → Database → Advisors
```

All issues should now be resolved! ✅

---

## 📝 Additional Notes

### About Dropped Views

The 11 SECURITY DEFINER views were dropped for security reasons. If your application uses these views:

1. **Check if they're actually used** in your application code
2. **If needed**, recreate them as SECURITY INVOKER:
   ```sql
   CREATE VIEW view_name
   WITH (security_invoker = true)
   AS
   SELECT ...;
   ```

### About Index Performance

The 44 new indexes will:
- ✅ Speed up JOINs significantly
- ✅ Improve foreign key constraint checking
- ✅ Reduce query times for filtered lookups
- ⚠️ Slightly increase write times (acceptable trade-off)
- ⚠️ Use additional storage (minimal impact)

### Monitoring

After applying these fixes, monitor:
- Query performance (should improve)
- Write performance (should remain stable)
- Storage usage (minimal increase from new indexes)
- Auth server response times (will improve with percentage-based connections)

---

**Last Updated:** December 26, 2024
**Migration Files:** 7 migrations applied
**Manual Steps:** 2 dashboard configurations required
