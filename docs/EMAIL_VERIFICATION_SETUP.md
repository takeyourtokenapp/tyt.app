# Email Verification Setup Guide

## Overview

Email verification is now **required** for all new user registrations. This prevents spam registrations and ensures only real users can access the platform.

## Security Benefits

1. **Prevents Spam**: Automated bots cannot register without access to real email accounts
2. **Validates Users**: Ensures users have valid, working email addresses
3. **Reduces Manual Work**: No need to manually delete fake accounts
4. **Protects Resources**: Prevents abuse of platform resources
5. **Improves Security**: Enables password recovery and important notifications

## How It Works

### For Users

1. User signs up with email and password
2. Account is created but **login is blocked** until email is verified
3. User receives verification email with activation link
4. User clicks link to verify email
5. User can now log in and access the platform

### Technical Flow

```
Signup → Account Created → Email Sent → User Verifies → Login Enabled
         (blocked login)                  (click link)   (full access)
```

## Supabase Configuration

### Step 1: Enable Email Confirmation (CRITICAL)

1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Email Confirmations" section
3. **Enable**: "Enable email confirmations"
4. Set confirmation link TTL to 24 hours (86400 seconds)

### Step 2: Configure Email Templates

1. Go to Authentication → Email Templates
2. Select "Confirm signup" template
3. Update the template with your branding and messaging
4. Ensure the `{{ .ConfirmationURL }}` variable is included in the link

Example template:
```html
<h2>Welcome to TakeYourToken!</h2>
<p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
<a href="{{ .ConfirmationURL }}">Verify Email</a>
<p>This link expires in 24 hours.</p>
```

### Step 3: Set Redirect URLs

1. Go to Authentication → URL Configuration
2. Add your site URL to "Site URL": `https://takeyourtoken.app`
3. Add redirect URLs to "Redirect URLs":
   - `https://takeyourtoken.app/app/dashboard`
   - `http://localhost:5173/app/dashboard` (for development)

### Step 4: Test Configuration

1. Try registering a new test account
2. Check that login is blocked with message "Email not verified"
3. Check email inbox (including spam folder)
4. Click verification link
5. Try logging in again - should work

## Database Changes

The following tables and functions were created:

### email_verification_log
Tracks verification email sends for rate limiting and audit purposes.

**Columns:**
- `id`: Unique identifier
- `user_id`: Reference to profiles table
- `email`: Email address
- `sent_at`: When email was sent
- `ip_address`: Sender IP (for security)
- `user_agent`: Browser/device info

**Rate Limiting:**
- Maximum 5 emails per hour per user
- Minimum 2 minutes between sends

### Functions

1. **sync_email_verification()**: Syncs verification status from auth.users to profiles
2. **can_resend_verification_email(user_id)**: Checks if user can request another email

## Edge Functions

### resend-verification-email

**Endpoint:** `/functions/v1/resend-verification-email`

**Purpose:** Allows users to resend verification email if they didn't receive it

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox and spam folder."
}
```

**Rate Limiting:**
- 2 minutes between sends
- 5 emails per hour
- Returns 429 (Too Many Requests) if limit exceeded

## User Experience

### Signup Page
- Shows success message after registration
- Displays instructions to check email
- Provides link to login page after verification

### Login Page
- Blocks unverified users with clear message
- Shows "Email Not Verified" warning
- Provides "Resend Verification Email" button
- Guides user through verification process

### Dashboard
- EmailVerification component can be used anywhere
- Shows verification status
- Allows resending verification email
- Updates automatically when verified

## Common Issues

### Email Not Received

**Causes:**
- Email in spam folder
- Email provider blocking
- Wrong email address entered
- Email template misconfigured

**Solutions:**
1. Check spam/junk folder
2. Add `noreply@takeyourtoken.app` to contacts
3. Use "Resend Verification Email" button
4. Contact support if issue persists

### Link Expired

**Causes:**
- Link older than 24 hours
- Link already used

**Solutions:**
1. Request new verification email from login page
2. Click "Resend Verification Email" button

### Still Can't Login After Verifying

**Causes:**
- Browser cache not refreshed
- Session not updated
- Database sync issue

**Solutions:**
1. Clear browser cache
2. Try different browser
3. Check Supabase logs for errors
4. Verify email_confirmed_at is set in auth.users table

## Testing

### Manual Testing

1. Register new account: `test-$(date +%s)@example.com`
2. Try logging in immediately → Should be blocked
3. Check email and verify
4. Try logging in again → Should work

### Database Check

```sql
-- Check if user email is confirmed
SELECT email, email_confirmed_at
FROM auth.users
WHERE email = 'user@example.com';

-- Check verification log
SELECT * FROM email_verification_log
WHERE email = 'user@example.com'
ORDER BY sent_at DESC;

-- Manually verify user (emergency only)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'user@example.com';
```

## Security Considerations

1. **Never skip email verification** - It's your first line of defense
2. **Monitor verification logs** - Watch for unusual patterns
3. **Rate limiting is critical** - Prevents email bombing
4. **Use HTTPS only** - Verification links must be secure
5. **Expire old tokens** - 24 hours is recommended

## Support

If users report issues:

1. Check Supabase logs for errors
2. Verify email template is correct
3. Check rate limiting hasn't blocked them
4. Manually verify their email if urgent (use with caution)
5. Check spam filters on their email provider

## Monitoring

Watch these metrics:

- Registration rate vs verification rate
- Emails that bounce
- Users blocked at login
- Resend requests per user
- Time to verification (should be < 5 minutes typically)

## Rollback Plan

If you need to temporarily disable verification:

1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"
3. Wait 5 minutes for settings to propagate
4. **Important**: Re-enable as soon as issue is resolved

## Production Checklist

- [ ] Email confirmations enabled in Supabase
- [ ] Email template configured and tested
- [ ] Site URL and redirect URLs configured
- [ ] Edge function deployed and tested
- [ ] Rate limiting verified
- [ ] Test registration flow end-to-end
- [ ] Monitor logs for first 24 hours
- [ ] Document process for support team

## Documentation

For more information:
- [Supabase Email Auth Docs](https://supabase.com/docs/guides/auth/auth-email)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Auth Callbacks](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#customization)
