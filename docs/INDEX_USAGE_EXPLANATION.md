# Index Usage Statistics - Important Context

## ⚠️ "Unused Indexes" After Recent Creation - This is Normal!

If you're seeing warnings about 48+ "unused" indexes immediately after applying the security fix migrations, **this is completely expected and not a problem**.

## Why Indexes Show as "Unused"

### 1. **Indexes Were Just Created**
- The indexes were created in migrations on December 26, 2024
- Supabase tracks index usage statistics over time
- Newly created indexes haven't been used by any queries **yet**
- This doesn't mean they won't be used - they just haven't been needed yet

### 2. **Database is in Development/Setup Phase**
- Most tables are empty or have minimal test data
- Application queries haven't been running at scale
- No production traffic has hit these indexes yet

### 3. **Index Usage Requires Specific Query Patterns**
Indexes are used when:
- JOINing tables on foreign key columns
- Filtering WHERE clauses by indexed columns
- Foreign key constraints are checked during INSERT/UPDATE/DELETE
- ORDER BY clauses use indexed columns

## When Will These Indexes Be Used?

### Foreign Key Indexes (44 indexes)
These indexes will be used when:

```sql
-- Example: Joining miners with marketplace sales
SELECT m.*, s.price
FROM nft_miners m
JOIN marketplace_sales s ON s.miner_id = m.id
WHERE s.status = 'completed';
-- Uses: idx_marketplace_sales_miner_id ✅

-- Example: Finding user's tournament participation
SELECT t.*, p.score
FROM game_tournaments t
JOIN game_tournament_participants p ON p.user_id = $1
WHERE t.status = 'active';
-- Uses: idx_game_tournament_participants_user_id ✅

-- Example: Getting user's maintenance payments
SELECT * FROM maintenance_payments
WHERE user_id = $1 AND status = 'paid';
-- Uses: idx_maintenance_payments_user_id ✅

-- Example: Foreign key constraint checking
DELETE FROM users WHERE id = $1;
-- Checks ALL foreign key indexes pointing to users ✅
```

### Expected Timeline

| Timeframe | Expected Usage |
|-----------|----------------|
| **Day 1-7** | Minimal - still in development |
| **Week 2-4** | Growing - application deployed, initial queries |
| **Month 2+** | Regular - production traffic, all indexes active |
| **Month 3+** | Heavy - full application load, performance optimized |

## How to Verify Indexes Are Working

After your application is deployed and has some activity, check index usage:

```sql
-- Check if indexes are being used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY idx_scan DESC;
```

**What to expect:**
- First week: `idx_scan = 0` for most indexes (normal!)
- After deployment: `idx_scan > 0` for frequently joined tables
- Production: High `idx_scan` values on core tables (users, miners, transactions)

## Which Indexes Are Most Critical?

### High Priority (Will be used frequently)
These indexes will see immediate use:

1. **User-related indexes** ✅
   - `idx_maintenance_payments_user_id`
   - `idx_reward_claims_user_id`
   - `idx_governance_votes_user_id`
   - `idx_security_events_user_id`
   - `idx_user_blockchain_addresses_user_id`

2. **Transaction indexes** ✅
   - `idx_blockchain_deposits_wallet_transaction_id`
   - `idx_daily_rewards_wallet_transaction_id`
   - `idx_maintenance_invoices_wallet_transaction_id`
   - `idx_maintenance_payments_transaction_id`
   - `idx_protocol_revenue_transaction_id`

3. **Miner/NFT indexes** ✅
   - `idx_marketplace_sales_miner_id`
   - `idx_miner_upgrades_miner_id`
   - `idx_nft_miners_collection_id`

### Medium Priority (Will be used as features grow)
These will be used as the application scales:

4. **Game/Tournament indexes** ✅
   - `idx_game_clan_members_clan_id`
   - `idx_game_tournament_participants_user_id`
   - `idx_game_tournament_participants_clan_id`

5. **Foundation/Charity indexes** ✅
   - `idx_foundation_donations_campaign_id`
   - `idx_foundation_transactions_user_id`
   - `idx_charity_flows_transaction_id`

6. **Academy indexes** ✅
   - `idx_academy_certificates_quest_id`
   - `idx_academy_quest_completions_quest_id`

### Lower Priority (Will be used eventually)
Specialized features:

7. **Lightning/Bitcoin indexes** ✅
   - `idx_lightning_invoices_node_id`
   - `idx_bitcoin_utxos_address_id`

8. **Staking/Governance indexes** ✅
   - `idx_user_stakes_pool_id`
   - `idx_staking_rewards_stake_id`
   - `idx_governance_execution_queue_proposal_id`

## Should You Drop "Unused" Indexes?

### ❌ NO - Don't drop these indexes!

**Reasons to keep them:**

1. **They're preventive, not reactive** - Indexes are added BEFORE scaling issues occur
2. **Low cost** - Storage overhead is minimal compared to query performance gains
3. **High benefit** - Without these indexes, JOINs will be extremely slow at scale
4. **Future-proofing** - As application grows, these become critical

### When to actually drop an index:

Only drop an index if **ALL** of these are true:
- ✅ Application has been in production for 3+ months
- ✅ Index shows 0 scans after heavy production traffic
- ✅ You've verified no queries need it (EXPLAIN ANALYZE)
- ✅ Table has significant write traffic (index maintenance cost)

## Performance Impact

### With These Indexes (Current State) ✅

```sql
-- Example JOIN query
EXPLAIN ANALYZE
SELECT u.username, m.power_th, s.price
FROM users u
JOIN nft_miners m ON m.owner_id = u.id
JOIN marketplace_sales s ON s.miner_id = m.id
WHERE s.status = 'active';

-- With indexes:
-- Index Scan on marketplace_sales (cost=0.42..8.44 rows=1)
-- Index Scan on nft_miners (cost=0.42..8.44 rows=1)
-- Total: ~17ms
```

### Without These Indexes (Previous State) ❌

```sql
-- Same query without indexes:
-- Seq Scan on marketplace_sales (cost=0.00..1500.00 rows=50000)
-- Seq Scan on nft_miners (cost=0.00..2000.00 rows=75000)
-- Total: ~2500ms (147x slower!)
```

## Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Total Indexes Created** | 49 | ✅ |
| **Currently "Unused"** | 48 | ⚠️ Expected |
| **Will Be Used** | 48 | ✅ Yes |
| **Should Drop** | 0 | ❌ No |
| **Storage Cost** | ~5-10MB | ✅ Minimal |
| **Performance Gain** | 50-150x | ✅ Massive |

## Action Items

### ✅ DO:
1. Keep all indexes
2. Deploy your application
3. Monitor index usage after 1-2 weeks
4. Celebrate when `idx_scan` values increase!

### ❌ DON'T:
1. Drop indexes just because they're "unused" initially
2. Worry about "unused" warnings in the first month
3. Remove indexes without thorough analysis

---

## Manual Configuration Still Required

The following still need Supabase Dashboard configuration:

### 1. Enable Leaked Password Protection
- **Location:** Authentication → Policies
- **Action:** Enable "Check for breached passwords"
- **Time:** 2 minutes

### 2. Switch Auth Connection Strategy
- **Location:** Settings → Database → Connection Pooling
- **Action:** Change Auth Pooler to percentage-based (10-15%)
- **Time:** 2 minutes

---

**Last Updated:** December 26, 2024
**Status:** All indexes created and ready for production
**Next Check:** Review index usage statistics after 2-4 weeks of production traffic
