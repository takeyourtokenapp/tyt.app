# Supabase Email Verification - Quick Start

## ⚠️ CRITICAL: Enable Email Verification in Supabase Dashboard

Email verification is now **REQUIRED** for security. Follow these steps immediately:

## 1. Enable Email Confirmations

```
Supabase Dashboard → Authentication → Settings → Email Confirmations
```

**Enable:**
- ✅ "Enable email confirmations"
- Set TTL to **86400** seconds (24 hours)

**This is the most important step!** Without this, users can log in without verifying their email.

## 2. Configure Site URL

```
Supabase Dashboard → Authentication → URL Configuration
```

**Site URL:**
```
https://takeyourtoken.app
```

**Redirect URLs (add both):**
```
https://takeyourtoken.app/app/dashboard
http://localhost:5173/app/dashboard
```

## 3. Customize Email Template (Optional)

```
Supabase Dashboard → Authentication → Email Templates → Confirm signup
```

Replace the default template with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #D2A44C 0%, #F4D03F 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #ddd; }
    .button { display: inline-block; padding: 12px 30px; background: #D2A44C; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to TakeYourToken!</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>Thank you for joining TakeYourToken! Please verify your email address to activate your account and start earning.</p>
      <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
      <p style="color: #666; font-size: 14px;">Or copy this link into your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #999;">{{ .ConfirmationURL }}</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2026 TakeYourToken. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

## 4. Test the Setup

1. Open your app: `http://localhost:5173`
2. Click "Sign Up"
3. Register with a **real email address** you can check
4. You should see: "Account Created Successfully! Check your email..."
5. Check your email inbox (and spam folder)
6. Click "Verify Email Address"
7. You should be redirected to `/app/dashboard`
8. Now try logging out and logging back in - should work

## 5. Verify Database Setup

The migration has already created:
- ✅ `email_verification_log` table
- ✅ `sync_email_verification()` function
- ✅ `can_resend_verification_email()` function
- ✅ Edge function `resend-verification-email`

Check they exist:

```sql
-- Check if table exists
SELECT * FROM email_verification_log LIMIT 1;

-- Check if functions exist
SELECT proname FROM pg_proc WHERE proname LIKE '%verification%';
```

## What Happens Now

### When User Signs Up:
1. Account created in `auth.users` with `email_confirmed_at = NULL`
2. Verification email sent automatically by Supabase
3. Login attempts are **blocked** until verified
4. User sees message: "Please verify your email address before logging in"

### When User Tries to Login (Unverified):
1. Login blocked by Supabase Auth
2. Error: "Email not confirmed"
3. UI shows "Email Not Verified" warning
4. Button to "Resend Verification Email"

### After User Clicks Verification Link:
1. `auth.users.email_confirmed_at` set to current timestamp
2. Trigger updates `profiles.email_verified = true`
3. User can now log in successfully

## Troubleshooting

### "Email confirmations not working"

**Check:**
```sql
-- Is email confirmation enabled?
SELECT * FROM auth.config
WHERE parameter = 'enable_email_confirmation';
```

If not enabled, go back to Step 1.

### "Users not receiving emails"

**Possible causes:**
- Emails going to spam (most common)
- Email template has errors
- SMTP not configured (Supabase should handle this)
- Rate limiting blocking sends

**Solutions:**
1. Check spam folder
2. Verify email template has `{{ .ConfirmationURL }}`
3. Check Supabase logs for errors
4. Use "Resend Verification Email" button

### "Verification link not working"

**Check:**
- Link not expired (24 hours)
- Redirect URLs configured correctly
- Site URL matches your domain

### "Still can't login after verifying"

**Check database:**
```sql
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'user@example.com';
```

If `email_confirmed_at` is `NULL`, verification didn't work. Check:
1. Did user click the right link?
2. Was link expired?
3. Any errors in Supabase logs?

**Emergency fix (use with caution):**
```sql
-- Manually verify a user
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'user@example.com';
```

## Production Deployment

Before going live:

1. ✅ Enable email confirmations in **Production** Supabase project
2. ✅ Update Site URL to production domain
3. ✅ Update Redirect URLs to production domain
4. ✅ Test full signup flow on production
5. ✅ Monitor first 100 signups closely
6. ✅ Have support team ready for email issues

## Security Notes

🔒 **Never disable email verification in production!**

This feature prevents:
- Spam bot registrations
- Fake account creation
- Email harvesting
- Resource abuse

Rate limits protect against:
- Email bombing
- Spam attacks
- Abuse of resend functionality

## Need Help?

If you encounter issues:

1. Check Supabase Dashboard → Logs
2. Review email_verification_log table
3. Test with different email providers (Gmail, Outlook, etc.)
4. Read full guide: `docs/EMAIL_VERIFICATION_SETUP.md`
5. Contact Supabase support if infrastructure issue

## Success Indicators

✅ Email verification is working if:
- New signups can't login immediately
- Verification emails arrive within 1 minute
- Clicking link redirects to dashboard
- After verification, login works
- Rate limiting prevents spam

---

**Status**: ✅ Code deployed, DB migrated, Edge function ready

**Next Step**: Enable email confirmations in Supabase Dashboard (Step 1)
