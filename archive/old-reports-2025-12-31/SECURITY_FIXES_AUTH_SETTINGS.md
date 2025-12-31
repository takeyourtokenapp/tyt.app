# Auth Configuration Security Fixes - Manual Steps Required

## Overview
Some security improvements require manual configuration changes in the Supabase Dashboard as they cannot be applied via SQL migrations.

---

## 1. Enable Leaked Password Protection

### What It Does
Prevents users from setting passwords that have been compromised in data breaches by checking against the HaveIBeenPwned.org database.

### How to Enable
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Policies**
3. Find the section **"Password Protection"**
4. Enable **"Check passwords against HaveIBeenPwned"**
5. Click **Save**

### Why It's Important
- Prevents users from using known compromised passwords
- Reduces risk of account takeovers
- Industry best practice for authentication security

---

## 2. Switch Auth Connection Pool to Percentage-Based

### Current Issue
Your Auth server is configured to use a fixed maximum of 10 connections. This means:
- Increasing instance size won't improve Auth server performance
- Connection pool doesn't scale with database resources

### What to Change
Switch from **Fixed Number** to **Percentage-Based** connection allocation.

### How to Change
1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Database**
3. Find the **"Connection Pooling"** section
4. Locate **"Auth Server Connections"**
5. Change from:
   - **Mode:** Fixed (10 connections)
   - To **Mode:** Percentage (recommended: 5-10%)
6. Click **Save**

### Why It's Important
- Auth connections automatically scale with database size
- Better resource utilization
- Improved performance during high load
- Future-proof configuration

### Recommended Settings

| Database Size | Recommended % | Approx. Connections |
|---------------|---------------|---------------------|
| Free/Starter  | 10%           | ~1-2 connections    |
| Pro           | 7-10%         | ~7-15 connections   |
| Team/Enterprise | 5-7%        | ~15-35 connections  |

---

## 3. Review Other Auth Settings (Optional but Recommended)

### Session Settings
- **Session timeout:** Consider reducing from default 604800s (7 days) to 86400s (24 hours) for increased security
- **Refresh token rotation:** Enable if not already enabled

### Email Settings
- **Enable email confirmations:** For production environments
- **Enable email change confirmations:** Prevent unauthorized email changes

### Security Settings
- **Enable reCAPTCHA/hCaptcha:** Prevent bot signups
- **Enable MFA (Multi-Factor Authentication):** For admin/high-value accounts

---

## Verification After Changes

### 1. Password Protection
Try to register a user with a weak/known password:
```
Email: test@example.com
Password: password123
```
Should receive error: "This password has been compromised and cannot be used"

### 2. Connection Pool
Check in Dashboard → Settings → Database:
- Auth connections should show percentage value
- Should scale appropriately with database tier

---

## Summary Checklist

- [ ] Enable HaveIBeenPwned password protection
- [ ] Switch Auth connections to percentage-based (5-10%)
- [ ] Test password protection with known weak password
- [ ] Verify connection pool shows percentage in dashboard
- [ ] (Optional) Review and update session timeout settings
- [ ] (Optional) Enable MFA for admin accounts

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Connection Pooling Best Practices](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)

---

*Last updated: December 28, 2025*
*These settings require Supabase Dashboard access and cannot be automated via migrations*
