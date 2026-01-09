# ⚡ TYT App - Quick Deployment Guide

**Get your TYT Platform deployed in production in under 2 hours**

**Last Updated**: January 2, 2026

---

## 🎯 Quick Overview

This guide covers:
- ⏱️ **Time**: 1-2 hours
- 📋 **33 App Pages**: All secured and ready
- 🔐 **Security**: 94% score, production-ready
- ✅ **Status**: Fully tested and verified

---

## 🚀 5-Step Deployment

### Step 1: Prerequisites (10 minutes)

#### Required Accounts
- [ ] [Supabase](https://supabase.com) - Database & Auth
- [ ] [Alchemy](https://alchemy.com) - Blockchain RPC (free tier OK)
- [ ] [WalletConnect](https://walletconnect.com) - Web3 wallet connections
- [ ] [Vercel](https://vercel.com) or [Netlify](https://netlify.com) - Hosting (free tier OK)

#### Required Tools
```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# Install if missing: https://nodejs.org/
```

---

### Step 2: Setup Supabase (20 minutes)

#### 2.1 Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `tyt-platform` (or your choice)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for provisioning

#### 2.2 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them next):
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbG...
   ```

#### 2.3 Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations (creates all tables & security)
supabase db push

# Verify
supabase db diff
```

**Expected output**: "No schema differences detected"

#### 2.4 Configure Authentication

1. Go to **Authentication** → **Settings**
2. **Email Auth**: Enable ✅
3. **Confirm Email**: Disable ❌ (as per requirements)
4. **Site URL**: Add your domain (e.g., `https://app.takeyourtoken.com`)
5. **Redirect URLs**: Add:
   - `http://localhost:5173/**` (development)
   - `https://yourdomain.com/**` (production)

#### 2.5 Create Storage Buckets

1. Go to **Storage**
2. Create buckets:

**Bucket 1: `kyc-documents`**
```sql
-- Settings:
- Public: NO (private)
- File size limit: 10 MB
- Allowed MIME types: image/*, application/pdf
```

**Bucket 2: `avatars`**
```sql
-- Settings:
- Public: YES
- File size limit: 2 MB
- Allowed MIME types: image/*
```

**Bucket 3: `certificates`**
```sql
-- Settings:
- Public: YES
- File size limit: 5 MB
- Allowed MIME types: image/*, application/pdf
```

#### 2.6 Create First Admin User

```sql
-- Run in SQL Editor (after you create your account via app)

-- 1. Get your user ID (replace with your email)
SELECT id FROM auth.users WHERE email = 'your@email.com';

-- 2. Make yourself admin (use the ID from step 1)
UPDATE profiles
SET is_admin = true,
    role = 'admin',
    access_level = 'vip'
WHERE id = 'your-user-id-here';
```

---

### Step 3: Get API Keys (15 minutes)

#### 3.1 Alchemy (Blockchain RPC)

1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Create account (free)
3. Click "Create App"
4. Fill in:
   - **Chain**: Polygon (or your target chain)
   - **Network**: Mainnet (or Amoy for testnet)
   - **Name**: TYT Platform
5. Click app → View Key → Copy **API Key**

#### 3.2 WalletConnect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up (free)
3. Create new project
4. Copy **Project ID**

#### 3.3 CoinGecko (Optional)

1. Go to [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for free tier
3. Copy API key

---

### Step 4: Configure Environment (10 minutes)

#### 4.1 Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/tyt-platform
cd tyt-platform

# Install dependencies
npm install
```

#### 4.2 Create Environment File

```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env  # or use your favorite editor
```

#### 4.3 Fill Environment Variables

```bash
# === REQUIRED === #

# Supabase (from Step 2.2)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# Alchemy (from Step 3.1)
VITE_ALCHEMY_API_KEY=your-alchemy-key

# WalletConnect (from Step 3.2)
VITE_WALLETCONNECT_PROJECT_ID=your-project-id

# === OPTIONAL === #

# CoinGecko (from Step 3.3)
VITE_COINGECKO_API_KEY=your-coingecko-key

# === AFTER CONTRACT DEPLOYMENT === #

# Smart Contracts (add after deploying contracts)
VITE_MINER_NFT_ADDRESS=0x...
VITE_MARKETPLACE_ADDRESS=0x...
VITE_FEE_CONFIG_ADDRESS=0x...
VITE_CHARITY_VAULT_ADDRESS=0x...
VITE_ACADEMY_VAULT_ADDRESS=0x...
VITE_REWARDS_MERKLE_ADDRESS=0x...
VITE_VOTING_ESCROW_ADDRESS=0x...
```

#### 4.4 Test Locally

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:5173

# Test:
1. Sign up with your email
2. Login
3. Try to access /app/dashboard
4. Should see your dashboard!
```

---

### Step 5: Deploy to Production (30 minutes)

#### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to project? Yes
# - Scope? Your account
# - Link to existing? No
# - Name? tyt-platform
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ALCHEMY_API_KEY
vercel env add VITE_WALLETCONNECT_PROJECT_ID
# ... add all env vars

# Deploy to production
vercel --prod
```

**Add Custom Domain**:
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Follow DNS instructions

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Follow prompts:
# - Create new site? Yes
# - Team? Your team
# - Site name? tyt-platform
# - Build command? npm run build
# - Publish directory? dist

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your-value"
netlify env:set VITE_SUPABASE_ANON_KEY "your-value"
# ... add all env vars

# Deploy
netlify deploy --prod
```

**Add Custom Domain**:
1. Go to Netlify Dashboard → Your Site
2. Domain settings → Add custom domain
3. Follow DNS instructions

---

## ✅ Post-Deployment Checklist

### Immediate Tests (10 minutes)

- [ ] Visit your production URL
- [ ] Test sign up flow
- [ ] Test login flow
- [ ] Access dashboard
- [ ] Try all main menu items
- [ ] Test mobile view (use DevTools)

### Security Verification (15 minutes)

```bash
# Test 1: Unauthenticated access
# Open incognito window → Try /app/dashboard
# Expected: Redirect to /login ✅

# Test 2: Admin pages
# Login as non-admin → Try /app/admin-users
# Expected: Access denied or empty ✅

# Test 3: Build warnings
npm run build
# Expected: No errors, minimal warnings ✅

# Test 4: Env vars loaded
# Open browser console on your site
# Type: import.meta.env
# Expected: See all VITE_ variables ✅
```

### Supabase Verification (10 minutes)

```sql
-- Run in Supabase SQL Editor

-- 1. Check RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
-- Expected: Empty result (all have RLS) ✅

-- 2. Check admin user
SELECT id, email, full_name, is_admin, role
FROM profiles
WHERE is_admin = true;
-- Expected: Your admin account ✅

-- 3. Check storage buckets
SELECT * FROM storage.buckets;
-- Expected: kyc-documents, avatars, certificates ✅
```

---

## 🎯 Admin User Setup

### Create Admin Account

```sql
-- Method 1: Via SQL (recommended)
-- After signing up via app, run:

UPDATE profiles
SET
  is_admin = true,
  role = 'admin',
  access_level = 'vip',
  kyc_tier = 3,
  kyc_status = 'approved'
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@yourdomain.com'
);
```

### Test Admin Access

1. Login with admin account
2. Navigate to:
   - `/app/admin-users` ✅ Should see all users
   - `/app/admin-withdrawals` ✅ Should see withdrawal requests
   - `/app/admin-contracts` ✅ Should see contract controls
3. Try non-admin account
   - Should NOT see admin pages ✅

---

## 📊 Monitoring Setup

### 1. Supabase Monitoring

**Dashboard → Settings → Monitoring**

Enable:
- [ ] Database query monitoring
- [ ] Slow query alerts (>1s)
- [ ] Storage usage alerts (>80%)
- [ ] Auth success rate monitoring

### 2. Error Tracking (Optional but Recommended)

**Install Sentry**:

```bash
npm install @sentry/react
```

**Configure** (`src/main.tsx`):

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 3. Uptime Monitoring

Use one of:
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://pingdom.com) (paid)
- [StatusCake](https://statuscake.com) (free tier)

Monitor:
- [ ] Homepage: `https://yourdomain.com`
- [ ] App: `https://yourdomain.com/app/dashboard`
- [ ] API: `https://yourdomain.com/api/health` (if applicable)

---

## 🚨 Troubleshooting

### Issue: "Missing Supabase URL"

```bash
# Check .env file
cat .env | grep VITE_SUPABASE

# Should see:
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...

# If missing, add them and rebuild:
npm run build
vercel --prod  # or netlify deploy --prod
```

### Issue: "Redirected to login immediately"

```bash
# Check Supabase auth settings
# Dashboard → Authentication → URL Configuration

# Add your production URL to:
- Site URL: https://yourdomain.com
- Redirect URLs: https://yourdomain.com/**
```

### Issue: "Admin pages show access denied"

```sql
-- Check your admin status
SELECT id, email, is_admin, role
FROM profiles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your@email.com'
);

-- If is_admin is false, update:
UPDATE profiles
SET is_admin = true, role = 'admin'
WHERE user_id = 'your-user-id';
```

### Issue: "RLS blocks my queries"

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'your_table_name';

-- Temporarily disable RLS to test (NOT FOR PRODUCTION!)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable immediately after testing
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: "File upload fails"

```sql
-- Check storage buckets exist
SELECT * FROM storage.buckets;

-- Check bucket policies
SELECT * FROM storage.policies
WHERE bucket_id = 'kyc-documents';

-- If missing, create bucket and policies (see deployment guide)
```

---

## 🎉 You're Live!

### Next Steps

1. **Announce Launch** 🚀
   - Tweet about it
   - Post on Discord/Telegram
   - Email early users

2. **Monitor First 24 Hours** 👀
   - Watch Supabase dashboard
   - Check error rates
   - Monitor sign-ups

3. **Deploy Smart Contracts** 📝
   - See `/contracts/evm/README_DEPLOYMENT.md`
   - Add contract addresses to `.env`
   - Redeploy app

4. **Set Up Marketing** 📣
   - Configure SEO meta tags
   - Set up analytics (Google/Plausible)
   - Create social media posts

5. **Ongoing Maintenance** 🔧
   - Weekly: Review logs
   - Monthly: Update dependencies
   - Quarterly: Security audit

---

## 📚 Full Documentation

For detailed documentation, see:

- **Complete Security Guide**: `/docs/APP_SECURITY_DEPLOYMENT_GUIDE.md`
- **Documentation Index**: `/DOCUMENTATION_INDEX.md`
- **Environment Setup**: `/docs/ENV_SETUP_GUIDE.md`
- **Smart Contracts**: `/contracts/evm/README_DEPLOYMENT.md`
- **Security Policy**: `/SECURITY.md`

---

## 🆘 Need Help?

### Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Check TypeScript errors

# Supabase
supabase status      # Check local status
supabase db diff     # Check for schema changes
supabase db push     # Push migrations
supabase db reset    # Reset database (CAUTION!)

# Deployment
vercel --prod        # Deploy to Vercel
netlify deploy --prod # Deploy to Netlify
```

### Support Resources

- **Documentation**: `/docs/`
- **GitHub Issues**: Create an issue
- **Discord**: Join our server
- **Email**: support@takeyourtoken.com

---

## ✅ Deployment Status

Track your progress:

- [ ] Step 1: Prerequisites ✅
- [ ] Step 2: Setup Supabase ✅
- [ ] Step 3: Get API Keys ✅
- [ ] Step 4: Configure Environment ✅
- [ ] Step 5: Deploy to Production ✅
- [ ] Post-Deployment Tests ✅
- [ ] Admin User Created ✅
- [ ] Monitoring Enabled ✅
- [ ] **🎉 LIVE IN PRODUCTION!** ✅

---

**Estimated Total Time**: 1-2 hours
**Difficulty**: Intermediate
**Status**: Production Ready ✅

**Last Updated**: January 2, 2026
**Version**: 1.0

Good luck with your launch! 🚀
