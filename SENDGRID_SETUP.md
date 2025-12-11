# 📧 SendGrid Email System Setup Guide

**Status**: Ready to Configure
**Estimated Time**: 15 minutes
**Priority**: CRITICAL (Blocks MVP)

---

## 🎯 OVERVIEW

The email system is fully built with 10 professional templates. Only SendGrid configuration is needed.

### Email Templates Available

1. **Welcome** - New user onboarding
2. **Deposit Confirmed** - Successful deposit notification
3. **Withdrawal Confirmed** - Successful withdrawal notification
4. **Withdrawal Pending** - Manual approval required
5. **Withdrawal Approved** - Admin approved withdrawal
6. **Withdrawal Rejected** - Admin rejected withdrawal
7. **Daily Rewards** - Daily mining report
8. **Maintenance Invoice** - Monthly maintenance bill
9. **KYC Status Update** - KYC verification status
10. **Security Alert** - Security event notification
11. **Foundation Receipt** - Donation thank you

---

## ⚡ QUICK SETUP (15 Minutes)

### Step 1: Create SendGrid Account (5 min)

1. Go to https://sendgrid.com/
2. Click "Start for Free"
3. Sign up with email
4. Verify your email address
5. Complete profile setup

**Free Tier Includes**:
- 100 emails/day (sufficient for MVP)
- Full API access
- Email templates
- Analytics

### Step 2: Get API Key (2 min)

1. Login to SendGrid Dashboard
2. Go to **Settings** → **API Keys**
3. Click "Create API Key"
4. Name: `TYT-Production` (or `TYT-Staging`)
5. Permissions: **Full Access** (or "Mail Send" only)
6. Click "Create & View"
7. **COPY THE KEY IMMEDIATELY** (shown only once)

Example key format:
```
SG.xxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### Step 3: Verify Sender Email (5 min)

**Option A: Single Sender Verification (Faster)**

1. Go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Enter details:
   ```
   From Name: TakeYourToken
   From Email: noreply@takeyourtoken.app
   Reply To: support@takeyourtoken.app
   Company: TakeYourToken
   Address: [Your company address]
   City/State/Zip: [Your location]
   Country: [Your country]
   ```
4. Click "Create"
5. Check email inbox for verification link
6. Click verification link
7. **Status should show "Verified"**

**Option B: Domain Authentication (Better, but takes longer)**

1. Go to **Settings** → **Sender Authentication**
2. Click "Authenticate Your Domain"
3. Enter: `takeyourtoken.app`
4. Copy provided DNS records
5. Add to your domain DNS (Hostinger/Registrar):
   ```
   Type: CNAME
   Name: em1234.takeyourtoken.app
   Value: u1234567.wl123.sendgrid.net

   Type: CNAME
   Name: s1._domainkey.takeyourtoken.app
   Value: s1.domainkey.u1234567.wl123.sendgrid.net

   Type: CNAME
   Name: s2._domainkey.takeyourtoken.app
   Value: s2.domainkey.u1234567.wl123.sendgrid.net
   ```
6. Wait 24-48 hours for DNS propagation
7. Click "Verify" in SendGrid

**For MVP: Use Option A (Single Sender)**

### Step 4: Configure Supabase (3 min)

1. Login to Supabase Dashboard
2. Go to **Settings** → **Edge Functions**
3. Add environment variables:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=noreply@takeyourtoken.app
SENDGRID_FROM_NAME=TakeYourToken
```

4. Click "Save"
5. Restart edge functions (if needed)

---

## 🧪 TESTING

### Test Email Function

```bash
# Using curl
curl -X POST \
  'https://your-project.supabase.co/functions/v1/send-email' \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-test-email@example.com",
    "template": "welcome",
    "data": {
      "name": "Test User"
    }
  }'
```

### Test from Frontend

```typescript
import { emailNotifications } from '../utils/emailService';

// Test welcome email
await emailNotifications.welcome(
  'test@example.com',
  'Test User'
);

// Test deposit confirmation
await emailNotifications.depositConfirmed(
  'test@example.com',
  {
    amount: '0.001',
    asset: 'BTC',
    network: 'Bitcoin',
    newBalance: '0.001',
    txHash: '1234567890abcdef...',
  }
);
```

### Check Results

1. **In SendGrid Dashboard**:
   - Go to **Activity** tab
   - See real-time delivery status
   - Check open rates, clicks

2. **In Email Inbox**:
   - Check spam folder if not received
   - Verify email formatting
   - Test all links work

---

## 📋 INTEGRATION CHECKLIST

### Integrate with Auth Flow

```typescript
// In AuthContext.tsx - after signup
import { emailNotifications } from '../utils/emailService';

async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data.user) {
    // Send welcome email
    await emailNotifications.welcome(
      email,
      data.user.user_metadata?.name || 'there'
    );
  }
}
```

### Integrate with Deposits

```typescript
// In process-deposit edge function
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// After confirming deposit
await supabase.functions.invoke('send-email', {
  body: {
    to: userEmail,
    template: 'depositConfirmed',
    data: {
      amount: deposit.amount,
      asset: deposit.asset,
      newBalance: wallet.balance,
      txHash: deposit.tx_hash,
    },
  },
});
```

### Integrate with Withdrawals

```typescript
// In process-withdrawal edge function

// When withdrawal created (needs approval)
await supabase.functions.invoke('send-email', {
  body: {
    to: userEmail,
    template: 'withdrawalPending',
    data: {
      amount: withdrawal.amount,
      asset: withdrawal.asset,
      destination: withdrawal.destination,
      reason: 'Amount exceeds auto-approval limit',
    },
  },
});

// When admin approves
await supabase.functions.invoke('send-email', {
  body: {
    to: userEmail,
    template: 'withdrawalApproved',
    data: {
      amount: withdrawal.amount,
      asset: withdrawal.asset,
    },
  },
});

// When completed on blockchain
await supabase.functions.invoke('send-email', {
  body: {
    to: userEmail,
    template: 'withdrawalConfirmed',
    data: {
      amount: withdrawal.amount,
      asset: withdrawal.asset,
      fee: withdrawal.fee,
      destination: withdrawal.destination,
      txHash: withdrawal.tx_hash,
      remainingBalance: wallet.balance,
    },
  },
});
```

### Integrate with Daily Rewards

```typescript
// In cron-daily-rewards edge function

// After calculating rewards
await supabase.functions.invoke('send-email', {
  body: {
    to: userEmail,
    template: 'dailyRewards',
    data: {
      btcAmount: reward.btc_amount,
      usdValue: reward.usd_value,
      minersCount: user.miners_count,
      totalHashrate: user.total_hashrate,
      discount: reward.discount_applied,
      monthlyTotal: user.monthly_btc,
      monthlyDays: new Date().getDate(),
    },
  },
});
```

---

## 🔧 CONFIGURATION OPTIONS

### Environment Variables

```bash
# Required
SENDGRID_API_KEY=SG.xxx                        # API key from SendGrid
SENDGRID_FROM_EMAIL=noreply@takeyourtoken.app  # Verified sender email
SENDGRID_FROM_NAME=TakeYourToken               # Display name

# Optional
SENDGRID_REPLY_TO=support@takeyourtoken.app    # Reply-to address
SENDGRID_TEMPLATE_ID_WELCOME=d-xxx             # Custom template IDs
```

### Email Settings

**Delivery Optimization**:
- Batch sending: Up to 1000 emails/batch
- Rate limiting: Respect SendGrid limits
- Retry logic: 3 attempts with exponential backoff
- Queue failed emails for manual review

**Tracking**:
- Open tracking: Enabled
- Click tracking: Enabled
- Subscription tracking: Disabled (no unsubscribe for transactional)
- Google Analytics: Optional

---

## 📊 MONITORING

### SendGrid Dashboard

Monitor:
- **Delivery Rate**: Should be >95%
- **Open Rate**: Typical 20-40% for transactional
- **Bounce Rate**: Should be <5%
- **Spam Reports**: Should be <0.1%

### Alerts to Setup

1. **Deliverability Issues**:
   - Alert if delivery rate drops below 90%
   - Alert on high bounce rate

2. **Volume Issues**:
   - Alert when approaching free tier limit
   - Alert on unusual sending patterns

3. **Error Alerts**:
   - Alert on API errors
   - Alert on authentication failures

---

## 🚨 TROUBLESHOOTING

### Email Not Received

**Check 1: SendGrid Activity**
- Login to SendGrid Dashboard
- Go to Activity Feed
- Search for recipient email
- Check delivery status

**Check 2: Spam Folder**
- First emails often go to spam
- Mark as "Not Spam" to train filters
- Consider domain authentication

**Check 3: API Key**
- Verify key has correct permissions
- Check key hasn't been regenerated
- Ensure environment variable is set

### Delivery Failed

**Common Issues**:

1. **Invalid Sender Email**
   - Must be verified in SendGrid
   - Use exact email from verification

2. **Recipient Issues**
   - Email address might not exist
   - Domain might be blocking
   - Mailbox might be full

3. **Content Issues**
   - Too many links might trigger spam filters
   - Remove spam trigger words
   - Ensure proper HTML structure

### Rate Limit Errors

**Free Tier Limits**:
- 100 emails/day
- 3 emails/second

**Solutions**:
- Implement queue system
- Batch non-urgent emails
- Upgrade to paid plan ($15/mo for 40k emails)

---

## 💰 PRICING

### Free Tier
- **100 emails/day**
- Perfect for early testing
- Full API access
- Email validation

### Essentials ($19.95/mo)
- **50,000 emails/month**
- Recommended for MVP launch
- Email validation
- Basic support

### Pro ($89.95/mo)
- **100,000 emails/month**
- For scaling beyond MVP
- Advanced analytics
- Dedicated IPs
- 24/7 support

**Recommendation**: Start with Free tier for testing, upgrade to Essentials at launch.

---

## ✅ COMPLETION CHECKLIST

Before marking email system as complete:

- [ ] SendGrid account created
- [ ] API key generated and saved securely
- [ ] Sender email verified
- [ ] Environment variables set in Supabase
- [ ] Test email sent successfully
- [ ] Welcome email tested
- [ ] Deposit confirmation tested
- [ ] Withdrawal notifications tested
- [ ] Daily rewards email tested
- [ ] All templates display correctly
- [ ] Links work in all templates
- [ ] Mobile rendering checked
- [ ] Spam score checked (use mail-tester.com)
- [ ] Monitoring dashboard bookmarked
- [ ] Error alerts configured

---

## 🎉 LAUNCH READINESS

**When email system is ready**:
✅ All 10 templates working
✅ Integration with auth flow
✅ Integration with transactions
✅ Monitoring enabled
✅ Error handling in place

**Email System Status**: 🟡 Waiting for SendGrid Configuration

**Time to Complete**: 15 minutes

**After Configuration**: ✅ MVP READY

---

## 📞 SUPPORT

**SendGrid Support**:
- Docs: https://docs.sendgrid.com/
- Support: https://support.sendgrid.com/
- Status: https://status.sendgrid.com/

**TYT Documentation**:
- Email templates: `supabase/functions/send-email/index.ts`
- Email service: `src/utils/emailService.ts`
- Integration guide: This document

---

**Next Steps**:
1. Create SendGrid account (5 min)
2. Get API key (2 min)
3. Verify sender (5 min)
4. Configure Supabase (3 min)
5. Test (5 min)

**Total Time**: 20 minutes to production-ready email system! 🚀
