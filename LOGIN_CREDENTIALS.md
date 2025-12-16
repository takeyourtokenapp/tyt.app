# TYT Platform - Test Login Credentials

## Status: USER RESET - REGISTRATION REQUIRED

The test user was reset. You need to register again.

## Test Account

**Email:** dolbpinisrail@gmail.com
**Password:** test123456

## IMPORTANT: You Must Register First

1. Go to `/signup` page
2. Enter the credentials above
3. Click "Sign Up"
4. You will be automatically logged in
5. Profile and wallets will be created automatically

## What Was Fixed

- Old user deleted from `auth.users`
- Old profile deleted via cascade
- Now you can register with correct password
- Email confirmation is DISABLED (instant login)

## Auto-Created Data

When you register, these will be created automatically via database triggers:

1. **Profile** (`profiles` table)
   - Username from email
   - Referral code generated
   - VIP level 0

2. **Custodial Wallets** (`custodial_wallets` table)
   - BTC wallet
   - TYT wallet
   - USDT wallet
   - All with 0 balance

3. **User Academy Stats** (`user_academy_stats` table)
   - XP tracking
   - Rank system

## Troubleshooting

If you still see errors after registering:

### Check Supabase Health
```bash
curl https://xyvzpezqavqujpxodtre.supabase.co/auth/v1/health
```

Expected response: `{"date":"...","description":"GoTrue operational"}`

### Check Auth Settings

In Supabase Dashboard → Authentication → Settings:
- Email confirmation: DISABLED
- Enable sign ups: ENABLED
- Site URL: http://localhost:5173

### Test Pages

- `/test-auth` - Test authentication
- `/test-supabase` - Test database connection

## Next Steps

1. Clear browser cache and cookies
2. Go to `/signup`
3. Register with credentials above
4. Check that you're redirected to `/app/dashboard`
