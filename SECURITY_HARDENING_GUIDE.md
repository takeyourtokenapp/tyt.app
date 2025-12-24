# TYT Platform Security Hardening Guide

## Overview

This document provides comprehensive security measures implemented in the TYT platform to protect against malicious actors, data breaches, and unauthorized access.

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Database Security (RLS)](#database-security-rls)
3. [Input Validation & Sanitization](#input-validation--sanitization)
4. [API Security](#api-security)
5. [Smart Contract Security](#smart-contract-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Secrets Management](#secrets-management)
8. [Frontend Security](#frontend-security)
9. [Monitoring & Incident Response](#monitoring--incident-response)
10. [Security Checklist](#security-checklist)

---

## 1. Authentication & Authorization

### Implemented Measures

#### Supabase Auth
- **Email/Password Authentication**: Secure password hashing (bcrypt)
- **JWT-based sessions**: Short-lived access tokens
- **Row Level Security (RLS)**: Database-level access control
- **Session Management**: Automatic token refresh

#### Access Control Levels
```typescript
// Access levels hierarchy
enum AccessLevel {
  ANONYMOUS = 0,    // Public pages only
  KYC_BASIC = 1,    // Email verified
  KYC_FULL = 2,     // Full KYC verified
  VIP = 3,          // VIP tier members
  ADMIN = 99        // Platform administrators
}
```

### Best Practices

✅ **DO**:
- Use `auth.uid()` in all RLS policies
- Verify user session before sensitive operations
- Implement MFA for admin accounts
- Log all authentication events

❌ **DON'T**:
- Store passwords in plain text
- Use predictable session tokens
- Allow unlimited login attempts
- Trust client-side authentication state

---

## 2. Database Security (RLS)

### RLS Policy Structure

All tables MUST have RLS enabled:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Policy Types

#### 1. Restrictive Policies (Default)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

#### 2. Service-Only Access
```sql
-- Financial data: No public access
-- protocol_revenue, treasury_reserves, fee_audit_log
-- Access via service_role or admin RPC functions only
```

#### 3. Read-Only Tables
```sql
-- Block all modifications on reference data
CREATE POLICY "Block inserts on academy_lessons"
  ON academy_lessons FOR INSERT
  TO authenticated
  WITH CHECK (false);
```

### Critical Tables

#### Protected Financial Data
- `protocol_revenue` - NO public access
- `treasury_reserves` - NO public access
- `fee_audit_log` - NO public access
- `custodial_wallets` - Owner only
- `withdrawal_requests` - Owner + admin

#### Protected User Data
- `profiles` - Owner only
- `kyc_submissions` - Owner + admin
- `wallet_ledger_entries` - Owner only
- `referral_rewards` - Owner only

### RLS Performance

All RLS policies use indexed columns:
```sql
CREATE INDEX idx_profiles_id ON profiles(id);
CREATE INDEX idx_wallets_user_id ON custodial_wallets(user_id);
CREATE INDEX idx_miners_owner_id ON nft_miners(owner_id);
```

---

## 3. Input Validation & Sanitization

### Client-Side Validation

Located in: `/src/utils/security.ts`

#### String Sanitization
```typescript
sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '')           // Remove < and >
    .replace(/javascript:/gi, '')    // Remove javascript: protocol
    .replace(/on\w+=/gi, '');       // Remove event handlers
}
```

#### Address Validation
```typescript
validateEthAddress(address: string): boolean
validateSolanaAddress(address: string): boolean
validateBitcoinAddress(address: string): boolean
validateTronAddress(address: string): boolean
```

#### Amount Validation
```typescript
validateAmount(amount: number, min: number, max: number): boolean
```

### XSS Protection

#### DOMPurify Integration
```typescript
import DOMPurify from 'dompurify';

// Safe HTML rendering
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
```

#### CSP Headers
```typescript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  img-src 'self' data: https:;
```

---

## 4. API Security

### Rate Limiting

#### Client-Side Rate Limiter
```typescript
const rateLimiter = new ClientRateLimiter(10, 60000); // 10 req/min

if (!rateLimiter.check(userId)) {
  throw new Error('Rate limit exceeded');
}
```

#### Server-Side Rate Limiting
Edge Functions implement rate limiting per IP/user:
```typescript
// supabase/functions/_shared/rateLimiter.ts
const RATE_LIMITS = {
  withdrawals: { max: 5, window: 3600 },    // 5/hour
  deposits: { max: 20, window: 3600 },      // 20/hour
  api_calls: { max: 100, window: 3600 }     // 100/hour
};
```

### API Authentication

All Edge Functions verify authentication:
```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response('Unauthorized', { status: 401 });
}

const token = authHeader.replace('Bearer ', '');
const { data: { user }, error } = await supabase.auth.getUser(token);
```

### CORS Configuration

All Edge Functions implement strict CORS:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey'
};
```

---

## 5. Smart Contract Security

### Audit Checklist

✅ **Implemented**:
- Reentrancy guards on all external calls
- Integer overflow protection (Solidity 0.8+)
- Access control modifiers (onlyOwner, onlyRole)
- Pausable functionality for emergency stops
- Event logging for all state changes
- Time-locked upgrades (24-hour delay)

### Contract Security Features

#### MinerNFT.sol
```solidity
// Access control
modifier onlyMinterOrMarketplace() {
    require(
        hasRole(MINTER_ROLE, msg.sender) ||
        msg.sender == marketplace,
        "Unauthorized"
    );
    _;
}

// Reentrancy protection
function safeMint(address to) external nonReentrant onlyMinterOrMarketplace {
    // Mint logic
}
```

#### FeeConfig.sol
```solidity
// Range validation
function setMaintenanceFee(uint256 _feePercentage) external onlyOwner {
    require(_feePercentage <= MAX_FEE, "Fee too high");
    require(_feePercentage >= MIN_FEE, "Fee too low");
    maintenanceFeePercentage = _feePercentage;
    emit MaintenanceFeeUpdated(_feePercentage);
}
```

### Deployment Security

1. **Testnet First**: Deploy to Polygon Amoy testnet
2. **Verify Contracts**: Verify on Polygonscan
3. **Audit**: External audit before mainnet
4. **Multi-sig**: Use multi-sig wallet for admin functions
5. **Time Locks**: 24-hour delay on critical changes

---

## 6. Infrastructure Security

### Environment Variables

#### .env File Security
```bash
# NEVER commit to git
.env
.env.*
*.key
*.pem
private-keys/
secrets/
```

#### Variable Naming Convention
```bash
# Public (included in frontend bundle)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # NEVER expose to frontend
DATABASE_PASSWORD=xxx              # Backend only
PRIVATE_KEY=xxx                    # Backend only
```

### Firewall Rules

```bash
# Allow only necessary ports
- 443 (HTTPS)
- 5432 (PostgreSQL - internal only)

# Block all other inbound traffic
```

### SSL/TLS

- Force HTTPS on all endpoints
- TLS 1.3 minimum
- HSTS enabled
- Certificate auto-renewal

---

## 7. Secrets Management

### API Key Rotation

#### Alchemy API Key
```bash
# Rotate every 90 days
1. Generate new key in Alchemy dashboard
2. Update VITE_ALCHEMY_API_KEY in .env
3. Deploy updated environment
4. Revoke old key after 24 hours
```

#### Supabase Keys
```bash
# Service Role Key: Rotate annually
# Anon Key: Regenerate if compromised
```

### Key Storage

✅ **DO**:
- Store in environment variables
- Use secret management service (AWS Secrets Manager, Vault)
- Encrypt at rest
- Rotate regularly

❌ **DON'T**:
- Hardcode in source code
- Commit to git
- Share via email/chat
- Log in plain text

---

## 8. Frontend Security

### Secure Coding Practices

#### 1. No External CDN Dependencies
```typescript
// ❌ BAD: External CDN
<script src="https://external-cdn.com/library.js"></script>

// ✅ GOOD: npm package
import { library } from 'local-library';
```

#### 2. Logo Usage Compliance
See: `LOGO_USAGE_POLICY.md`

- Use Unicode symbols (₿, Ξ, ◎) instead of copyrighted logos
- Use MIT-licensed icon libraries (lucide-react)
- Never hotlink to external logo CDNs

#### 3. No Inline Event Handlers
```typescript
// ❌ BAD
<button onClick="doSomething()">Click</button>

// ✅ GOOD
<button onClick={handleClick}>Click</button>
```

#### 4. Content Security Policy
Implemented in Supabase Edge Functions:
```typescript
headers.set('Content-Security-Policy',
  "default-src 'self'; script-src 'self'"
);
```

---

## 9. Monitoring & Incident Response

### Security Monitoring

#### Database Monitoring
```sql
-- Audit log table
CREATE TABLE security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text,
  resource text,
  ip_address inet,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);
```

#### Failed Login Attempts
```typescript
// Track failed attempts
if (loginFailed) {
  await supabase.from('failed_login_attempts').insert({
    email,
    ip_address,
    timestamp: new Date()
  });

  // Block after 5 failed attempts
  if (failedCount >= 5) {
    await blockUser(email, '15 minutes');
  }
}
```

### Incident Response Plan

#### 1. Detection
- Monitor error logs (Sentry)
- Track unusual activity patterns
- User reports

#### 2. Containment
```bash
# Immediate actions
1. Revoke compromised credentials
2. Block malicious IPs
3. Pause affected services
4. Enable maintenance mode
```

#### 3. Investigation
```bash
1. Review audit logs
2. Identify attack vector
3. Assess damage scope
4. Document timeline
```

#### 4. Recovery
```bash
1. Apply security patches
2. Restore from backup if needed
3. Notify affected users
4. Gradual service restoration
```

#### 5. Post-Incident
```bash
1. Root cause analysis
2. Update security measures
3. Team training
4. Documentation update
```

---

## 10. Security Checklist

### Pre-Deployment

- [ ] All RLS policies enabled and tested
- [ ] Environment variables properly configured
- [ ] API rate limiting implemented
- [ ] Input validation on all forms
- [ ] XSS protection (DOMPurify) active
- [ ] Smart contracts audited
- [ ] SSL certificates valid
- [ ] Secrets not in source code
- [ ] .gitignore includes .env
- [ ] CSP headers configured
- [ ] Error handling doesn't leak info
- [ ] Logging doesn't contain secrets

### Weekly

- [ ] Review failed login attempts
- [ ] Check audit logs for anomalies
- [ ] Verify SSL certificate expiry
- [ ] Review API rate limit violations
- [ ] Check for dependency vulnerabilities

### Monthly

- [ ] Dependency updates (npm audit)
- [ ] Review RLS policies
- [ ] Access control audit
- [ ] Backup verification
- [ ] Security training for team

### Quarterly

- [ ] API key rotation
- [ ] Penetration testing
- [ ] Security policy review
- [ ] Incident response drill
- [ ] Third-party security audit

---

## Emergency Contacts

### Security Incident Response Team

```
Security Lead: [To be assigned]
Database Admin: [To be assigned]
DevOps Lead: [To be assigned]
Legal Contact: [To be assigned]
```

### External Resources

- Supabase Support: https://supabase.com/support
- Alchemy Support: https://www.alchemy.com/support
- OWASP: https://owasp.org/
- Web3 Security: https://consensys.github.io/smart-contract-best-practices/

---

## Reporting Security Vulnerabilities

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead, report to: security@takeyourtoken.com

Include:
1. Detailed description
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

Response time: Within 24 hours

---

## Compliance

### Standards Followed

- OWASP Top 10 (Web Application Security)
- CWE Top 25 (Software Weaknesses)
- NIST Cybersecurity Framework
- GDPR (Data Protection)
- SOC 2 Type II (in progress)

### Regular Audits

- Smart Contract Audit: Before mainnet launch
- Security Audit: Quarterly
- Penetration Testing: Bi-annually
- Compliance Review: Annually

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 24, 2024 | Initial comprehensive security guide |

---

**Last Updated**: December 24, 2024
**Status**: Active
**Next Review**: March 24, 2025
