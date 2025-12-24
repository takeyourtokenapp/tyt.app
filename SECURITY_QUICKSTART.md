# БЫСТРАЯ ИНСТРУКЦИЯ ПО ИСПРАВЛЕНИЮ КРИТИЧЕСКИХ ПРОБЛЕМ

## ⚡ СРОЧНО - СДЕЛАТЬ СЕГОДНЯ

### 1. Исправить шифрование приватных ключей (КРИТИЧНО!)
**Файл:** `supabase/functions/generate-deposit-address/index.ts`

Заменить строки 118, 133, 143, 157, 164, 171:
```typescript
// УДАЛИТЬ:
privateKeyEncrypted = btoa(`${encryptionKey}:${privateKeyBytes.toString('hex')}`);

// ДОБАВИТЬ:
import { crypto } from "node:crypto";

function encryptPrivateKey(privateKey: string, masterKey: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(masterKey).digest();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(privateKey, 'utf8'),
    cipher.final()
  ]);

  return JSON.stringify({
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex')
  });
}

privateKeyEncrypted = encryptPrivateKey(privateKey, encryptionKey);
```

---

### 2. Исправить XSS в Academy
**Файл:** `src/pages/app/Academy.tsx:763`

```bash
npm install dompurify @types/dompurify
```

```tsx
import DOMPurify from 'dompurify';

// Заменить:
<div dangerouslySetInnerHTML={{ __html: selectedLesson.content_mdx.replace(/\n/g, '<br/>') }} />

// На:
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(
    selectedLesson.content_mdx.replace(/\n/g, '<br/>'),
    { ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'code', 'pre'] }
  )
}} />
```

---

### 3. Ротировать Alchemy API ключ
1. Перейти на https://dashboard.alchemy.com
2. Создать новый API ключ
3. Обновить `.env`:
```bash
VITE_ALCHEMY_API_KEY=<новый_ключ>
```
4. Деактивировать старый ключ (смотри Alchemy Dashboard)

---

### 4. Исправить webhook secret
**Файл:** `supabase/functions/blockchain-webhook/index.ts:38`

```typescript
// Заменить:
const webhookSecret = Deno.env.get('WEBHOOK_SECRET') || 'change-in-production';

// На:
const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
if (!webhookSecret || webhookSecret === 'change-in-production') {
  throw new Error('WEBHOOK_SECRET must be configured with a secure value');
}
```

Установить в production:
```bash
# Сгенерировать безопасный секрет
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Установить как env var
```

---

### 5. Добавить авторизацию в check-balance
**Файл:** `supabase/functions/check-balance/index.ts:82`

Добавить в начало функции:
```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  { global: { headers: { Authorization: authHeader } } }
);

const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return new Response(
    JSON.stringify({ error: 'Invalid token' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Проверить владение адресом
const { data: wallet } = await supabase
  .from('custodial_wallets')
  .select('address')
  .eq('user_id', user.id)
  .eq('address', address)
  .maybeSingle();

if (!wallet) {
  return new Response(
    JSON.stringify({ error: 'Address not owned by user' }),
    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

---

### 6. Обновить зависимости с уязвимостями
```bash
npm audit fix --force
npm update @babel/helpers glob cross-spawn @eslint/plugin-kit
npm test
npm run build
```

---

## 📋 ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ

- [ ] Исправлено шифрование приватных ключей
- [ ] XSS патч установлен (DOMPurify)
- [ ] Alchemy API ключ ротирован
- [ ] WEBHOOK_SECRET установлен безопасный
- [ ] check-balance требует авторизацию
- [ ] Зависимости обновлены
- [ ] `.env` не в git репозитории
- [ ] Все тесты проходят: `npm test`
- [ ] Проект собирается: `npm run build`
- [ ] Environment variables установлены в production

---

## 🔐 ГЕНЕРАЦИЯ БЕЗОПАСНЫХ СЕКРЕТОВ

```bash
# Для production установить:

# WEBHOOK_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# WALLET_ENCRYPTION_KEY (для AES-256)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚨 ЕСЛИ ПРОИЗОШЛА УТЕЧКА

1. **Немедленно ротировать все ключи:**
   - Supabase service_role key
   - Alchemy API key
   - WEBHOOK_SECRET
   - CRON_SECRET

2. **Проверить логи на подозрительную активность:**
   ```sql
   SELECT * FROM audit_logs
   WHERE created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   ```

3. **Заблокировать скомпрометированные аккаунты:**
   ```sql
   UPDATE profiles
   SET is_blocked = true
   WHERE user_id IN (/* список подозрительных user_id */);
   ```

4. **Уведомить пользователей** если их данные были затронуты

5. **Провести полное расследование** и задокументировать инцидент

---

## 📊 МОНИТОРИНГ ПОСЛЕ ДЕПЛОЯ

Следить за:
- [ ] CPU/Memory usage Edge Functions
- [ ] Database connection pool
- [ ] Error rate (<1%)
- [ ] Подозрительные входы
- [ ] Необычные транзакции
- [ ] Failed authentication attempts

Dashboard: https://app.supabase.com/project/xyvzpezqavqujpxodtre

---

## 📞 КОНТАКТЫ

**Security Lead:** [назначить]
**DevOps:** [назначить]
**Emergency:** [создать процедуру]

**Incident Response Plan:** `docs/incident-response.md` (создать!)

---

Полный отчет: `SECURITY_AUDIT_REPORT.md`
