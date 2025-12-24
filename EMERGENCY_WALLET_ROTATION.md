# 🚨 EMERGENCY WALLET ROTATION GUIDE

**Date:** December 24, 2024
**Status:** CRITICAL - Immediate Action Required
**Incident:** Compromised wallet key exposure

---

## ⚡ IMMEDIATE ACTIONS (Do This First!)

### 1. Stop All Services Immediately
```bash
# Stop development server
pkill -f "npm run dev"
pkill -f "vite"

# Stop any running edge functions
# (if deployed to Supabase)
```

### 2. Revoke Compromised Keys Immediately

#### If Already Deployed:
```bash
# Revoke all API keys from providers:
# 1. Alchemy - https://dashboard.alchemy.com/
# 2. Supabase - https://supabase.com/dashboard/
# 3. Any blockchain RPC providers
# 4. Payment processors (if configured)
```

#### List of Services to Check:
- [ ] Alchemy API keys (Ethereum, Polygon, etc.)
- [ ] Supabase service role key
- [ ] Supabase anon key
- [ ] Tron API keys
- [ ] Solana RPC endpoints
- [ ] XRP/Ripple API keys
- [ ] Payment processor keys (Stripe, etc.)
- [ ] Email service keys (SendGrid, etc.)

---

## 🔐 WALLET MIGRATION PROCEDURE

### Step 1: Generate New Wallets Securely

**CRITICAL:** Never generate wallets on a compromised machine!

#### For Master/Hot Wallets:
```bash
# Install secure tools (if not already)
npm install -g @solana/web3.js ethers

# Generate new Ethereum wallet
node -e "const ethers = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log('Address:', wallet.address); console.log('Private Key:', wallet.privateKey); console.log('Mnemonic:', wallet.mnemonic.phrase);"

# IMMEDIATELY save to secure password manager (1Password, Bitwarden)
# NEVER save to files in project directory
```

#### For Solana:
```bash
# Generate new Solana keypair
solana-keygen new --outfile ~/secure-location/solana-new.json
# Move to hardware wallet or secure cold storage immediately
```

#### For Bitcoin/Lightning:
```bash
# Use hardware wallet (Ledger, Trezor) or
# Secure desktop wallet (Electrum, Sparrow)
# Generate new address offline
```

### Step 2: Update Environment Variables

Create new `.env` file (NEVER commit this):

```bash
# Backup old .env (if it exists and wasn't compromised)
cp .env .env.old.backup.$(date +%Y%m%d_%H%M%S)

# Create new .env with NEW keys
cat > .env << 'EOF'
# === SUPABASE (Generate new project or rotate keys) ===
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...NEW_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...NEW_SERVICE_KEY

# === BLOCKCHAIN RPC (Create new API keys) ===
VITE_ALCHEMY_API_KEY=NEW_KEY_FROM_ALCHEMY
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/NEW_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/NEW_KEY

# === TRON (New API key) ===
VITE_TRON_API_KEY=NEW_TRONGRID_KEY
VITE_TRON_RPC_URL=https://api.trongrid.io

# === SOLANA (New RPC endpoint) ===
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_SOLANA_RPC_WS=wss://api.mainnet-beta.solana.com

# === MASTER WALLETS (NEW ADDRESSES ONLY) ===
# CRITICAL: Use Supabase secrets or AWS Secrets Manager
# NEVER store private keys here!
MASTER_WALLET_ETH=0xNEW_ADDRESS_ONLY
MASTER_WALLET_SOL=NEW_SOL_ADDRESS_ONLY
MASTER_WALLET_BTC=NEW_BTC_ADDRESS_ONLY
MASTER_WALLET_TRX=NEW_TRX_ADDRESS_ONLY

# === WEBHOOKS (New secret tokens) ===
WEBHOOK_SECRET=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)

# === EMAIL (Rotate if needed) ===
SENDGRID_API_KEY=NEW_KEY_IF_COMPROMISED
EOF

# Verify .env is in .gitignore
grep "^.env$" .gitignore || echo ".env" >> .gitignore
```

### Step 3: Update Supabase Edge Functions

If you deployed edge functions with old keys:

```bash
# Delete all existing edge functions
# (They may have cached old keys)
supabase functions delete blockchain-webhook
supabase functions delete process-deposit
# ... delete all functions

# Redeploy with NEW environment variables
# Update Supabase dashboard secrets:
# https://supabase.com/dashboard/project/_/settings/secrets
```

### Step 4: Database Wallet Migration

```sql
-- Connect to Supabase SQL Editor
-- Update wallet addresses in database

-- 1. Create migration for new master wallets
BEGIN;

-- Update blockchain monitoring with new addresses
UPDATE blockchain_address_mapping
SET monitored_address = 'NEW_ETH_ADDRESS'
WHERE blockchain = 'ethereum' AND address_type = 'master';

UPDATE blockchain_address_mapping
SET monitored_address = 'NEW_SOL_ADDRESS'
WHERE blockchain = 'solana' AND address_type = 'master';

-- Log the migration
INSERT INTO security_audit_log (
  event_type,
  severity,
  description,
  metadata
) VALUES (
  'wallet_rotation',
  'critical',
  'Emergency wallet rotation due to key compromise',
  jsonb_build_object(
    'timestamp', now(),
    'rotated_chains', ARRAY['ethereum', 'solana', 'bitcoin', 'tron'],
    'reason', 'security_incident'
  )
);

COMMIT;
```

### Step 5: Update Smart Contracts (If Deployed)

If smart contracts are already deployed with old wallet as owner:

```solidity
// For EVM contracts (Ethereum, Polygon, Tron)
// Call transferOwnership from OLD wallet to NEW wallet

// Example using ethers.js
const oldWallet = new ethers.Wallet(OLD_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, oldWallet);

// Transfer ownership to new wallet
const tx = await contract.transferOwnership(NEW_WALLET_ADDRESS);
await tx.wait();

// Verify
const newOwner = await contract.owner();
console.log('New owner:', newOwner);
```

For Solana programs:
```bash
# Update program authority
solana program set-upgrade-authority \
  PROGRAM_ID \
  --upgrade-authority OLD_KEYPAIR.json \
  --new-upgrade-authority NEW_WALLET_ADDRESS
```

---

## 🧹 GIT HISTORY CLEANUP

### Option 1: Clean History (If Repo Already Exists)

#### Using BFG Repo-Cleaner (Recommended)
```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone repo with mirror
git clone --mirror https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO.git

# Remove all .env files from history
bfg --delete-files '.env*' .

# Remove any files with "key" or "secret" in name
bfg --delete-files '*key*' .
bfg --delete-files '*secret*' .

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Destructive!)
git push --force

# IMPORTANT: All team members must re-clone!
```

#### Using git-filter-branch
```bash
# Remove .env from all history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local .env.production" \
  --prune-empty --tag-name-filter cat -- --all

# Remove any private key files
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch **/*.key **/*.pem" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
git push origin --force --tags
```

### Option 2: Fresh Start (Recommended if Heavily Compromised)

```bash
# 1. Backup current codebase
cp -r /tmp/cc-agent/61475162/project ~/tyt-backup-$(date +%Y%m%d)

# 2. Delete .git directory
rm -rf .git

# 3. Initialize fresh repo
git init

# 4. Verify .gitignore is comprehensive
cat >> .gitignore << 'EOF'
# Secrets (CRITICAL)
.env
.env.*
!.env.example
*.key
*.pem
*.wallet
mnemonic.txt
private-keys/
secrets/
wallets/

# Sensitive configs
*-secrets.js
*-secrets.ts
*-secrets.json
config/production.json
config/secrets.json
EOF

# 5. Create safe .env.example
cat > .env.example << 'EOF'
# === SUPABASE ===
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# === BLOCKCHAIN RPC ===
VITE_ALCHEMY_API_KEY=your_alchemy_key
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# === MASTER WALLETS (PUBLIC ADDRESSES ONLY) ===
# NEVER put private keys here!
MASTER_WALLET_ETH=0xYOUR_ADDRESS
MASTER_WALLET_SOL=YOUR_ADDRESS
MASTER_WALLET_BTC=YOUR_ADDRESS
EOF

# 6. First commit with clean history
git add .
git commit -m "Initial commit - TYT Platform v2.0 (clean security baseline)"

# 7. Create new GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO.git
git branch -M main
git push -u origin main
```

---

## 🛡️ PREVENT FUTURE INCIDENTS

### 1. Install Pre-Commit Hooks

```bash
# Install detect-secrets
pip install detect-secrets

# Create pre-commit config
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: package-lock.json

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: check-merge-conflict
      - id: check-yaml
      - id: detect-private-key
      - id: end-of-file-fixer
      - id: trailing-whitespace
EOF

# Initialize baseline
detect-secrets scan > .secrets.baseline

# Install hooks
pre-commit install

# Test
pre-commit run --all-files
```

### 2. Use Secrets Management Service

**Recommended: Supabase Secrets (Built-in)**
```bash
# Set secrets in Supabase dashboard
# https://supabase.com/dashboard/project/_/settings/secrets

# Or via CLI:
supabase secrets set MASTER_WALLET_PRIVATE_KEY="0x..."
supabase secrets set ALCHEMY_API_KEY="..."

# Access in edge functions:
const privateKey = Deno.env.get('MASTER_WALLET_PRIVATE_KEY');
```

**Alternative: AWS Secrets Manager**
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });
const response = await client.send(
  new GetSecretValueCommand({ SecretId: "tyt/production/wallets" })
);
const secrets = JSON.parse(response.SecretString);
```

### 3. Implement Key Rotation Schedule

```typescript
// src/utils/keyRotation.ts
export const KEY_ROTATION_SCHEDULE = {
  alchemy: '90 days',
  supabase_service: '180 days',
  webhooks: '30 days',
  master_wallets: 'yearly or on compromise',
  api_keys: '90 days'
};

// Implement automated rotation reminders
export async function checkKeyAge() {
  const lastRotation = await supabase
    .from('security_audit_log')
    .select('created_at')
    .eq('event_type', 'key_rotation')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const daysSinceRotation =
    (Date.now() - new Date(lastRotation.created_at).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysSinceRotation > 90) {
    // Send alert to admin
    await sendSecurityAlert('Key rotation overdue');
  }
}
```

---

## ✅ VERIFICATION CHECKLIST

After completing rotation, verify:

### Security:
- [ ] All old API keys revoked from provider dashboards
- [ ] New `.env` created with fresh keys
- [ ] `.env` is in `.gitignore` and not tracked
- [ ] No private keys in codebase (search: `grep -r "0x[0-9a-fA-F]{64}" .`)
- [ ] Pre-commit hooks installed and working
- [ ] Git history cleaned (if repo existed)

### Functionality:
- [ ] Application builds successfully: `npm run build`
- [ ] Can connect to Supabase
- [ ] Can connect to blockchain RPCs
- [ ] Edge functions work with new secrets
- [ ] Database migrations applied

### Wallets:
- [ ] New master wallets funded (if needed)
- [ ] Old wallet balances transferred to new wallets
- [ ] Smart contract ownership transferred
- [ ] New addresses updated in database
- [ ] Monitoring configured for new addresses

### Documentation:
- [ ] Security incident documented
- [ ] Team notified of new keys location
- [ ] `.env.example` updated (no sensitive data)
- [ ] SECURITY.md updated with lessons learned

---

## 📞 INCIDENT RESPONSE CONTACTS

### If Public Exposure:
1. **GitHub Security:** https://github.com/security/advisories
2. **Supabase Support:** support@supabase.com
3. **Alchemy Support:** support@alchemy.com

### Internal Actions:
1. Document incident timeline
2. Estimate potential damage
3. Monitor old wallets for suspicious activity
4. Update security training materials

---

## 📊 POST-INCIDENT REVIEW

After 48 hours, conduct review:

```markdown
## Incident Report: Wallet Key Compromise

**Date:** 2024-12-24
**Severity:** Critical
**Status:** Resolved

### What Happened:
[Describe how keys were compromised]

### Impact:
- [ ] Keys exposed in git history
- [ ] Keys exposed in public repo
- [ ] Keys exposed in chat/email
- [ ] Funds at risk: Yes/No
- [ ] Actual losses: $0

### Actions Taken:
1. Revoked all API keys
2. Generated new wallets
3. Migrated smart contract ownership
4. Cleaned git history
5. Implemented pre-commit hooks

### Lessons Learned:
1. [What went wrong]
2. [What we'll do differently]

### Prevention Measures:
1. Mandatory pre-commit hooks
2. Secrets in Supabase Vault only
3. Quarterly key rotation
4. Security training for team
```

---

## 🔗 USEFUL RESOURCES

- **Check if keys leaked:** https://haveibeenpwned.com/
- **GitHub secret scanning:** https://docs.github.com/en/code-security/secret-scanning
- **BFG Repo Cleaner:** https://rtyley.github.io/bfg-repo-cleaner/
- **Supabase Secrets:** https://supabase.com/docs/guides/functions/secrets
- **OWASP Key Management:** https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html

---

**REMEMBER:**
- ⚠️ Once a key is exposed, consider it compromised forever
- ⚠️ Rotation is the ONLY solution
- ⚠️ Prevention > Cleanup
- ⚠️ Use hardware wallets for high-value assets

**Status:** This guide executed on 2024-12-24
**Next Review:** After incident resolution
