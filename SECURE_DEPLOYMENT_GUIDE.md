# TYT v2 - Secure Deployment Guide

## 🎯 Как Безопасно Опубликовать Проект

Этот гайд объясняет, как развернуть TYT в продакшн, защитив критические компоненты.

---

## 📋 Что Можно Публиковать

### ✅ GitHub Public Repository

**Безопасно для публикации:**

```
/src                    # Весь frontend код
/public                 # Статические файлы
/supabase/migrations    # SQL миграции (RLS защищает данные)
package.json
tsconfig.json
vite.config.ts
README.md
*.md (документация)
```

**Почему безопасно:**
- Frontend компилируется в статические файлы
- Нет hardcoded секретов
- Supabase RLS защищает данные на уровне базы
- API ключи в environment variables

---

## 🔐 Что НЕЛЬЗЯ Публиковать

### ❌ Критические Файлы

```bash
# УЖЕ В .gitignore
.env                    # Supabase ключи
.env.*                  # Все environment файлы
*.key                   # Приватные ключи
*.pem                   # Сертификаты
wallets/                # Blockchain кошельки
private-keys/           # Blockchain ключи
secrets/                # Любые секреты
admin/                  # Admin скрипты
```

---

## 🚀 Пошаговое Развертывание

### Этап 1: Проверка Безопасности (СЕЙЧАС)

**1. Проверьте .gitignore:**
```bash
cat .gitignore
# Убедитесь, что .env и *.key в списке
```

**2. Проверьте, что нет секретов в коде:**
```bash
# Поиск потенциальных секретов
grep -r "AKIA" src/           # AWS keys
grep -r "sk_live" src/        # Stripe keys
grep -r "xprv" src/           # Bitcoin private keys
grep -r "password.*=" src/    # Hardcoded passwords
```

**3. Удалите .env из истории Git (если был закоммичен):**
```bash
# Если случайно закоммитили .env
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Этап 2: GitHub Repository Setup

**1. Создайте репозиторий:**
- Имя: `tyt.app`
- Visibility: **Private** (на старте)
- Description: "TYT v2 - Web3 Mining Platform"

**2. Push код:**
```bash
git remote add origin git@github.com:takeyourtokenapp/tyt.app.git
git branch -M main
git push -u origin main
```

**3. Настройте Branch Protection:**

GitHub → Settings → Branches → Add rule:
- Branch name: `main`
- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ✅ Do not allow bypassing the above settings

### Этап 3: Supabase Production Setup

**1. Создайте Production Project:**
```bash
# Supabase Dashboard
https://supabase.com/dashboard/new
```

**2. Примените миграции:**
```bash
# Установите Supabase CLI
npm install -g supabase

# Login
supabase login

# Link к production
supabase link --project-ref <your-production-ref>

# Push migrations
supabase db push
```

**3. Настройте Environment Variables:**

Supabase Dashboard → Settings → API:
- Copy `URL`
- Copy `anon public` key
- Copy `service_role` key (СЕКРЕТНЫЙ!)

### Этап 4: Frontend Deployment (Vercel)

**1. Подключите GitHub:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link
```

**2. Настройте Environment Variables:**

Vercel Dashboard → Settings → Environment Variables:

```bash
# Public (доступны в браузере)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Private (только на сервере - для Supabase Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (СЕКРЕТНЫЙ!)
```

**3. Deploy:**
```bash
# Preview
vercel

# Production
vercel --prod
```

### Этап 5: Edge Functions Deployment

**1. Deploy каждую функцию:**
```bash
supabase functions deploy generate-custodial-address
supabase functions deploy process-deposit
supabase functions deploy process-withdrawal
supabase functions deploy blockchain-webhook
# ... остальные
```

**2. Настройте Secrets для Functions:**
```bash
# Blockchain API keys
supabase secrets set TATUM_API_KEY=xxx
supabase secrets set ALCHEMY_API_KEY=xxx
supabase secrets set QUICKNODE_API_KEY=xxx

# Payment providers
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set FIREBLOCKS_API_KEY=xxx
```

**3. Настройте Webhooks (для blockchain мониторинга):**
```bash
# Ваш webhook URL
https://xxx.supabase.co/functions/v1/blockchain-webhook

# Настройте в:
- Tatum Dashboard
- Alchemy Dashboard
- QuickNode Dashboard
```

---

## 🛡️ Защита Критических Компонентов

### 1. Supabase RLS (Row Level Security)

**УЖЕ НАСТРОЕНО в миграциях:**

```sql
-- Пример: users могут видеть только свои данные
CREATE POLICY "Users can only view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Miners принадлежат конкретному пользователю
CREATE POLICY "Users can view own miners"
  ON miners FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());
```

**Проверьте RLS на всех таблицах:**
```sql
-- Список таблиц без RLS
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename
    FROM pg_policies
  );
```

### 2. API Rate Limiting

**В Edge Functions добавьте:**

```typescript
// supabase/functions/_shared/rateLimiter.ts
export async function checkRateLimit(
  userId: string,
  action: string,
  limit: number = 10,
  window: number = 60
): Promise<boolean> {
  const key = `ratelimit:${userId}:${action}`;

  // Redis или Supabase count
  const { count } = await supabase
    .from('rate_limits')
    .select('count')
    .eq('key', key)
    .gte('created_at', new Date(Date.now() - window * 1000))
    .single();

  return count < limit;
}
```

### 3. Input Validation

**Все Edge Functions должны валидировать input:**

```typescript
import { z } from 'zod';

const DepositSchema = z.object({
  amount: z.number().positive().max(1000000),
  currency: z.enum(['BTC', 'USDT', 'TYT']),
  wallet_address: z.string().regex(/^[a-zA-Z0-9]{26,90}$/)
});

// В функции
try {
  const data = DepositSchema.parse(await req.json());
} catch (error) {
  return new Response(JSON.stringify({ error: 'Invalid input' }), {
    status: 400
  });
}
```

### 4. Smart Contract Security

**Перед deploy контрактов:**

```solidity
// ✅ Обязательные модификаторы
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

modifier whenNotPaused() {
    require(!paused, "Paused");
    _;
}

modifier nonReentrant() {
    require(!locked);
    locked = true;
    _;
    locked = false;
}

// ✅ Circuit breaker
function pause() external onlyOwner {
    paused = true;
    emit Paused();
}
```

---

## 🌐 Публикация в Blockchain Networks

### Testnet Deployment (СНАЧАЛА)

**1. Ethereum Sepolia:**
```bash
# Deploy на testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Verify
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

**2. Polygon Mumbai:**
```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

**3. Solana Devnet:**
```bash
solana config set --url devnet
solana program deploy target/deploy/tyt_token.so
```

### Mainnet Deployment (ПОСЛЕ АУДИТА)

**Требования перед mainnet:**
- [ ] Audit от 2+ фирм (CertiK, OpenZeppelin, Trail of Bits)
- [ ] Bug bounty program запущен
- [ ] Testnet работает 30+ дней без проблем
- [ ] Insurance покрытие
- [ ] Legal compliance check

**Deployment:**
```bash
# Multi-sig wallet required
# Timelock contract required

# Ethereum Mainnet
npx hardhat run scripts/deploy-mainnet.ts --network mainnet

# Solana Mainnet
solana config set --url mainnet-beta
solana program deploy --program-id <KEYPAIR> target/deploy/tyt_token.so
```

---

## 📊 Уровни Доступа

### Level 1: Public (Все Пользователи)

**Видят через Web App:**
- Свой dashboard
- Свои NFT miners
- Свои rewards
- Marketplace (публичные листинги)
- Foundation transparency (агрегированные данные)

**API доступ:**
- Public endpoints (rate limited)
- Authenticated endpoints (JWT required)

### Level 2: VIP Users

**Дополнительно:**
- Advanced analytics
- Priority support
- Beta features
- Governance voting

### Level 3: Admins (Приватный Доступ)

**Только через:**
- VPN
- 2FA
- Hardware keys (YubiKey)
- IP whitelist

**Видят:**
- System metrics
- User statistics (aggregated, GDPR compliant)
- Financial reports
- Fraud detection
- System health

---

## 🔍 Мониторинг и Алерты

### Setup Monitoring

**1. Sentry (Error Tracking):**
```bash
npm install @sentry/react

# В main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

**2. Supabase Logs:**
```bash
# Real-time logs
supabase functions logs generate-custodial-address --follow

# Filter errors
supabase functions logs process-deposit --filter "level=error"
```

**3. Custom Alerts:**

Supabase Dashboard → Database → Webhooks:
```sql
-- Alert на большие транзакции
CREATE OR REPLACE FUNCTION notify_large_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount > 10000 THEN
    PERFORM pg_notify('large_transaction', row_to_json(NEW)::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER large_transaction_trigger
AFTER INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION notify_large_transaction();
```

---

## 🚨 Incident Response

### Если обнаружена уязвимость:

**1. Немедленно (0-15 мин):**
```bash
# Pause контракты
cast send $CONTRACT "pause()" --private-key $ADMIN_KEY

# Disable endpoints
# Vercel Dashboard → Pause Deployment
```

**2. Оценка (15-60 мин):**
- Определите scope
- Проверьте затронутые системы
- Оцените ущерб

**3. Уведомление (1-4 часа):**
```typescript
// Отправьте email всем пользователям
await sendEmail({
  to: 'all_users',
  subject: 'Security Incident Notification',
  body: 'We detected and resolved a security issue...'
});

// Twitter announcement
// Discord announcement
```

**4. Восстановление (4-24 часа):**
- Примените патч
- Verify fix
- Постепенно возобновите сервис

**5. Post-Mortem (1-3 дня):**
- Публичный отчёт
- Компенсация (если нужна)
- Улучшение процессов

---

## ✅ Pre-Launch Checklist

### Security

- [ ] `.gitignore` настроен правильно
- [ ] Нет hardcoded секретов в коде
- [ ] RLS включен на всех таблицах
- [ ] Rate limiting настроен
- [ ] Input validation везде
- [ ] CORS правильно настроен
- [ ] HTTPS only (HSTS)
- [ ] CSP headers настроены
- [ ] Audit контрактов завершён
- [ ] Bug bounty program готов

### Infrastructure

- [ ] Supabase production настроен
- [ ] Vercel production настроен
- [ ] Edge Functions deployed
- [ ] Environment variables настроены
- [ ] Backups автоматические
- [ ] Monitoring и alerts
- [ ] DNS настроен
- [ ] CDN (Cloudflare)
- [ ] DDoS protection

### Legal & Compliance

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] KYC/AML procedures
- [ ] GDPR compliance (если EU)
- [ ] Cookie consent
- [ ] Refund policy
- [ ] Foundation legal structure

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Load testing
- [ ] Penetration testing
- [ ] User acceptance testing
- [ ] Disaster recovery drill

---

## 🎯 Go Live Plan

### Week -2: Final Prep
- Complete security audit
- Setup monitoring
- Train support team
- Prepare marketing

### Week -1: Soft Launch
- Private beta (50-100 users)
- Monitor everything
- Fix critical issues
- Collect feedback

### Week 0: Public Launch
- Press release
- Social media campaign
- Community events
- 24/7 monitoring

### Week +1: Post-Launch
- Daily metrics review
- Bug fixes
- Performance optimization
- User support

---

## 📞 Support & Security Contacts

**Security Issues:**
```
security@takeyourtoken.app
```

**Bug Bounty:**
```
https://takeyourtoken.app/security/bounty
```

**Emergency Hotline:**
```
[ENCRYPTED - Admin Only]
```

---

## 🔗 Useful Resources

- [Web3 Security](https://github.com/Consensys/smart-contract-best-practices)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CryptoCurrency Security Standard](https://cryptoconsortium.github.io/CCSS/)

---

**Status:** Production Ready
**Last Updated:** 2025-12-10
**Version:** 2.0.0
