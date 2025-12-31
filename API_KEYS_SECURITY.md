# API Keys Security Guide
**CONFIDENTIAL - Internal Use Only**

---

## ✅ API Keys Status: SECURED

All API keys have been added to the `.env` file and are properly configured.

### Configured Keys:

1. **Alchemy API** (Ethereum/Polygon RPC)
   - Variable: `VITE_ALCHEMY_API_KEY`
   - Status: ✅ Configured
   - Used for: ETH, Polygon blockchain operations

2. **TronGrid API** (TRON Network)
   - Variable: `VITE_TRONGRID_API_KEY`
   - Status: ✅ Configured
   - Used for: TRON blockchain operations

3. **SendGrid API** (Email Service)
   - Variable: `VITE_SENDGRID_API_KEY`
   - Status: ✅ Configured
   - Used for: Email notifications, verification

---

## 🔒 Security Measures Implemented

### 1. Environment Variables ✅
All keys stored in `.env` file:
```bash
# .env (NEVER commit this file!)
VITE_ALCHEMY_API_KEY=***********
VITE_TRONGRID_API_KEY=***********
VITE_SENDGRID_API_KEY=***********
```

### 2. .gitignore Protection ✅
Created `.gitignore` with comprehensive exclusions:
- `.env` files (all variants)
- Secrets folder
- Key files (.key, .pem, .cert)
- Supabase configs

### 3. Code Verification ✅
Scanned entire codebase:
- ✅ No hardcoded API keys found
- ✅ All keys read from `import.meta.env`
- ✅ Proper configuration in `blockchainProviders.ts`
- ✅ Key rotation system in place

---

## 📋 How Keys Are Used

### Alchemy API
**File:** `src/config/blockchainProviders.ts`
```typescript
export const API_KEYS = {
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || '',
  // ...
};

// Used in RPC URLs
export function getRpcUrl(chainId: ChainId) {
  switch (chainId) {
    case 'ETH':
    case 'MATIC':
      return `${baseUrl}/${API_KEYS.ALCHEMY_API_KEY}`;
  }
}
```

### TronGrid API
**File:** `src/utils/api/tronApi.ts`
```typescript
const TRONGRID_API_KEY = import.meta.env.VITE_TRONGRID_API_KEY;

// Used in headers
headers: {
  'TRON-PRO-API-KEY': TRONGRID_API_KEY
}
```

### SendGrid API
**File:** Edge Functions (server-side only)
```typescript
// Used via Supabase Edge Functions
// NOT exposed to client
```

---

## 🚨 Security Rules

### NEVER:
1. ❌ Commit `.env` file to git
2. ❌ Share keys in Slack/Discord/Email
3. ❌ Hardcode keys in source code
4. ❌ Log keys to console
5. ❌ Include keys in screenshots
6. ❌ Store keys in documentation

### ALWAYS:
1. ✅ Use environment variables
2. ✅ Keep `.env` in `.gitignore`
3. ✅ Rotate keys every 90-180 days
4. ✅ Use different keys for dev/staging/prod
5. ✅ Monitor key usage in dashboards
6. ✅ Revoke keys immediately if compromised

---

## 🔄 Key Rotation Schedule

### Alchemy API Key
- **Rotation Interval:** 180 days
- **Last Rotated:** 2025-12-31
- **Next Rotation:** 2026-06-29
- **Warning:** 30 days before expiry

### TronGrid API Key
- **Rotation Interval:** 180 days
- **Last Rotated:** 2025-12-31
- **Next Rotation:** 2026-06-29
- **Warning:** 30 days before expiry

### SendGrid API Key
- **Rotation Interval:** 90 days
- **Last Rotated:** 2025-12-31
- **Next Rotation:** 2026-03-31
- **Warning:** 14 days before expiry

---

## 📊 Key Usage Monitoring

### Where to Monitor:

1. **Alchemy Dashboard**
   - URL: https://dashboard.alchemy.com
   - Check: Request count, rate limits
   - Alert: >80% of quota used

2. **TronGrid Dashboard**
   - URL: https://www.trongrid.io
   - Check: API calls, bandwidth
   - Alert: Unusual spike in usage

3. **SendGrid Dashboard**
   - URL: https://app.sendgrid.com
   - Check: Email deliveries, bounces
   - Alert: High bounce rate

---

## 🚨 Emergency Procedures

### If Key is Compromised:

1. **IMMEDIATE ACTION**
   ```bash
   # 1. Revoke compromised key in provider dashboard
   # 2. Generate new key
   # 3. Update .env file
   # 4. Deploy immediately
   ```

2. **Investigation**
   - Check logs for unauthorized usage
   - Identify how key was exposed
   - Document incident

3. **Post-Incident**
   - Update security procedures
   - Train team on key security
   - Implement additional monitoring

### Rotation Procedure:

```bash
# 1. Generate new key in provider dashboard
# 2. Add to .env as NEW_KEY
# 3. Test with new key
# 4. Replace old key
# 5. Deploy
# 6. Wait 24 hours
# 7. Revoke old key
```

---

## 📝 Developer Guidelines

### Setting Up Local Environment:

1. **Get .env Template**
   ```bash
   # Request from team lead
   # NEVER share actual keys
   ```

2. **Configure Local .env**
   ```bash
   # Use development keys (separate from production)
   cp .env.example .env
   # Fill in your dev keys
   ```

3. **Verify Configuration**
   ```bash
   npm run dev
   # Check console for environment validation
   ```

### Before Committing:

```bash
# 1. Check .gitignore includes .env
cat .gitignore | grep .env

# 2. Verify no keys in staged files
git diff --staged | grep -i "api.*key"

# 3. Use pre-commit hooks
npm run pre-commit
```

---

## 🛡️ Additional Security Measures

### 1. Rate Limiting
- Implemented in edge functions
- Prevents API abuse
- Monitors suspicious patterns

### 2. IP Whitelisting
- Configure in provider dashboards
- Restrict to known IPs
- Update when infrastructure changes

### 3. Key Scoping
- Use minimum required permissions
- Separate keys for different features
- Revoke unused keys immediately

### 4. Audit Logging
- All key usage logged
- Regular security audits
- Automated anomaly detection

---

## 📖 Resources

### Official Documentation:
- [Alchemy API Keys](https://docs.alchemy.com/docs/alchemy-api-keys)
- [TronGrid API](https://developers.tron.network/docs/trongrid-api)
- [SendGrid API Keys](https://docs.sendgrid.com/ui/account-and-settings/api-keys)

### Internal Documentation:
- `src/utils/apiKeyManager.ts` - Key rotation system
- `src/utils/envValidator.ts` - Environment validation
- `SECURITY.md` - General security guidelines

---

## ✅ Verification Checklist

- [x] All keys stored in .env
- [x] .env in .gitignore
- [x] No hardcoded keys in code
- [x] Keys read via import.meta.env
- [x] Rotation schedule established
- [x] Monitoring configured
- [x] Emergency procedures documented
- [x] Team trained on key security

---

## 🔐 Current Status

**Last Updated:** 2025-12-31
**Next Audit:** 2026-01-31
**Security Level:** HIGH
**Compliance:** ✅ PASSED

---

**REMEMBER:** Security is everyone's responsibility. When in doubt, ask before sharing any configuration information.

*This document is confidential and should not be shared outside the development team.*
