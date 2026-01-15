# 🔄 Quick Start: TYT Foundation Sync

## Overview

This document provides the fastest path to sync **takeyourtoken.app** with **tyt.foundation**.

---

## 🚀 30-Second Summary

1. **Two separate bolt.new projects**
2. **Share same Supabase database**
3. **Copy 31 files** from this project → tyt.foundation
4. **Deploy Edge Functions**
5. **Done! Real-time sync active**

---

## 📚 Documentation Structure

| File | Purpose | Use When |
|------|---------|----------|
| **SYNC_CHECKLIST.md** | Day-by-day tasks with checkboxes | Doing the sync |
| **TYT_FOUNDATION_SYNC_COMPLETE_GUIDE.md** | Complete technical guide | Need details |
| **TWO_PROJECT_SYNC_SUMMARY.md** | Executive summary | Quick overview |
| **COPY_TO_TYT_FOUNDATION.md** | File list & setup | Need file paths |

---

## ⚡ Quick Start (5 minutes)

### Step 1: Get Supabase Credentials

From Supabase Dashboard:
```
Project URL:   https://____________.supabase.co
Anon Key:      eyJhbGciOiJI_______________
Project ID:    ____________
```

### Step 2: Setup tyt.foundation Environment

In tyt.foundation bolt.new project, create `.env`:
```bash
VITE_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
VITE_AOI_ENABLED=true
```

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js@^2.57.4 lucide-react framer-motion react-router-dom
```

### Step 4: Follow Checklist

Open **SYNC_CHECKLIST.md** and follow Day 1 → Day 5.

---

## 📦 What Gets Copied (31 Files)

### Core (5)
- supabase.ts
- foundationDataService.ts
- aoiConfig.ts
- aoi.ts types
- diagnostic

### aOi System (12)
- 7 components (Avatar, Chat, Widget, etc.)
- 2 contexts
- 3 services

### Foundation (3)
- Foundation.tsx page
- LiveFoundationTracker
- DonationWidget

### Edge Functions (8)
- aoi-chat, aoi-status, etc.
- Shared utilities

### Assets (3)
- aOi images
- Logo

---

## 🎯 Expected Results

**After sync**:

✅ tyt.foundation displays real-time Foundation stats
✅ aOi chat works on both sites
✅ Donations sync instantly between domains
✅ Cross-domain navigation seamless
✅ Both sites use same database

---

## ⏱️ Time Estimate

| Phase | Duration |
|-------|----------|
| Day 1: Core setup | 2-3 hours |
| Day 2: Components | 2-3 hours |
| Day 3: aOi system | 3-4 hours |
| Day 4: Edge Functions | 2-3 hours |
| Day 5: Deploy & test | 2-3 hours |
| **Total** | **11-16 hours** |

---

## 🔗 Architecture

```
takeyourtoken.app          tyt.foundation
      ↓                          ↓
      └──────→ Supabase ←────────┘
                 (shared)
```

**Both projects**:
- Read/write same database
- Use same Supabase RLS policies
- Share user authentication
- Sync via Realtime subscriptions

---

## ✅ Success Criteria

When complete, you should be able to:

1. Visit tyt.foundation → see real Foundation stats
2. Chat with aOi on Foundation site
3. Make donation on app → instantly visible on Foundation
4. Navigate between domains smoothly
5. Both sites show identical data

---

## 🆘 Need Help?

**Quick fixes**:
- Database not connecting? → Check .env values match
- API 401 error? → Verify ANON_KEY correct
- Real-time not working? → Enable in Supabase Dashboard
- Build fails? → Check all imports resolved

**Full troubleshooting**: See **TYT_FOUNDATION_SYNC_COMPLETE_GUIDE.md** section "Troubleshooting"

---

## 📞 Support

- Check documentation in `/docs/`
- Review Supabase logs in dashboard
- Test Edge Functions with curl
- Verify environment variables

---

**Status**: ✅ Ready to Start

**Next Action**: Open **SYNC_CHECKLIST.md** and begin Day 1

Good luck! 🚀
