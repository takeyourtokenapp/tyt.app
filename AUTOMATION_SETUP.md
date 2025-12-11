# 🤖 TYT Automation Setup Guide

## ✅ **Created Edge Functions**

Три автоматические системы созданы и готовы к деплою:

### 1. **Daily Rewards Distribution**
**File**: `supabase/functions/cron-daily-rewards/index.ts`

**Schedule**: Каждый день в 00:00 UTC

**Функционал**:
- Получает все активные майнеры
- Рассчитывает gross BTC на основе hashrate
- Вычитает electricity cost
- Вычитает service fee (15%)
- Применяет discount stacking:
  - VIP discount (0-15%)
  - Service button (−3% если нажата за последние 24ч)
  - Balance coverage (2-18% в зависимости от дней покрытия)
- Рассчитывает net BTC
- Обновляет BTC wallet balance
- Создает запись в `daily_rewards`
- Логирует транзакцию

**Algorithm**:
```
grossBTC = (hashrate / totalNetworkHashrate) × blockReward × blocksPerDay
electricityCost = (hashrate × W/TH × 24h × $0.05/kWh) / btcPrice
serviceFee = grossBTC × 15%
maintenanceCost = electricityCost + serviceFee

discounts = min(50%, VIP + serviceButton + balanceCoverage)
finalCost = maintenanceCost × (1 - discounts)

netBTC = grossBTC - finalCost
```

---

### 2. **Maintenance Invoice Generator**
**File**: `supabase/functions/cron-maintenance-invoices/index.ts`

**Schedule**: Каждый день в 00:00 UTC (после rewards)

**Функционал**:
- Получает все активные майнеры
- Рассчитывает daily maintenance cost
- Проверяет maintenance balance пользователя
- Применяет те же discount formulas
- Создает invoice в таблице `maintenance_invoices`
- Если balance достаточен → списывает и mark "paid"
- Если недостаточен → mark "unpaid" + send email reminder

**Statuses**:
- `paid` — автоматически оплачен из баланса
- `unpaid` — требуется пополнение
- `overdue` — просрочен (позже можно добавить штрафы)

---

### 3. **Weekly Burn Scheduler**
**File**: `supabase/functions/cron-weekly-burn/index.ts`

**Schedule**: Каждый вторник в 12:00 UTC

**Функционал**:
- Суммирует все TYT собранные за неделю:
  - Maintenance payments (TYT)
  - Marketplace fees (50% от комиссии)
  - Miner upgrades (100%)
- Создает burn event запись
- Рассчитывает CharityMint (25% от burn → foundation)
- Распределяет оставшиеся 75%:
  - 40% → hashrate providers (пропорционально TH/s)
  - 30% → veTYT holders (позже)
  - 20% → treasury
  - 10% → foundation
- Обновляет wallet balances
- Логирует все транзакции
- Генерирует публичный отчет

**Example**:
```
Week: Nov 25 - Dec 1
Collected: 100,000 TYT
- Maintenance: 70,000 TYT
- Marketplace: 20,000 TYT
- Upgrades: 10,000 TYT

Burn: 100,000 TYT
CharityMint: 25,000 TYT → Foundation

Distribution:
- Hashrate providers: 40,000 TYT
- veTYT holders: 30,000 TYT
- Treasury: 20,000 TYT
- Foundation: 10,000 TYT
```

---

## 🚀 **Deployment Steps**

### **Step 1: Deploy Edge Functions**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy functions
supabase functions deploy cron-daily-rewards
supabase functions deploy cron-maintenance-invoices
supabase functions deploy cron-weekly-burn
```

---

### **Step 2: Set Environment Variables**

В Supabase Dashboard → Settings → Edge Functions → Secrets:

```bash
# Add CRON_SECRET (для защиты от неавторизованных вызовов)
CRON_SECRET=your-random-secret-string-here

# Остальные переменные уже доступны:
# SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY
```

Генерируем секрет:
```bash
openssl rand -base64 32
```

---

### **Step 3: Setup Cron Jobs**

В Supabase есть 2 способа настроить cron:

#### **Option A: pg_cron (PostgreSQL extension)**

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily rewards (00:00 UTC)
SELECT cron.schedule(
  'daily-rewards-distribution',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-daily-rewards',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- Daily maintenance invoices (00:05 UTC - после rewards)
SELECT cron.schedule(
  'daily-maintenance-invoices',
  '5 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-maintenance-invoices',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- Weekly burn (every Tuesday at 12:00 UTC)
SELECT cron.schedule(
  'weekly-tyt-burn',
  '0 12 * * 2',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-weekly-burn',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

#### **Option B: External Cron (GitHub Actions)**

Создайте файл `.github/workflows/cron-jobs.yml`:

```yaml
name: TYT Automated Cron Jobs

on:
  schedule:
    # Daily rewards at 00:00 UTC
    - cron: '0 0 * * *'
    # Weekly burn every Tuesday at 12:00 UTC
    - cron: '0 12 * * 2'

jobs:
  daily-rewards:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 0 * * *'
    steps:
      - name: Trigger Daily Rewards
        run: |
          curl -X POST \
            https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-daily-rewards \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"

      - name: Trigger Maintenance Invoices
        run: |
          sleep 60
          curl -X POST \
            https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-maintenance-invoices \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"

  weekly-burn:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 12 * * 2'
    steps:
      - name: Trigger Weekly Burn
        run: |
          curl -X POST \
            https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-weekly-burn \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

---

### **Step 4: Test Functions Manually**

```bash
# Test daily rewards
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-daily-rewards \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"

# Test maintenance invoices
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-maintenance-invoices \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"

# Test weekly burn
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/cron-weekly-burn \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

---

## 📊 **Monitoring & Logs**

### **View Logs in Supabase Dashboard**

1. Go to **Edge Functions** → Select function
2. Click **Logs** tab
3. View real-time execution logs

### **Query Cron Job History**

```sql
-- Check pg_cron jobs
SELECT * FROM cron.job;

-- Check job run history
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;

-- Check recent rewards
SELECT * FROM daily_rewards
ORDER BY reward_date DESC
LIMIT 10;

-- Check recent invoices
SELECT * FROM maintenance_invoices
ORDER BY invoice_date DESC
LIMIT 10;

-- Check burn events
SELECT * FROM token_burn_events
ORDER BY burn_date DESC
LIMIT 5;
```

---

## 🔔 **Email Notifications** (Next Step)

После деплоя cron jobs, добавим email уведомления:

### **Services to integrate:**
- **SendGrid** (12K free emails/month)
- **Postmark** (100 free emails/month)
- **Resend** (100 emails/day free)

### **Email Templates:**
1. Daily reward summary
2. Maintenance invoice (unpaid reminder)
3. Weekly burn report
4. Low balance warning
5. KYC reminder

---

## 🎯 **Success Metrics**

After automation is live, track:

1. **Daily Rewards**:
   - Total BTC distributed
   - Average reward per user
   - Discount effectiveness

2. **Maintenance Invoices**:
   - Paid vs unpaid ratio
   - Average discount applied
   - Revenue collected

3. **Weekly Burns**:
   - Total TYT burned
   - CharityMint amount
   - Foundation balance growth

---

## ✅ **Checklist**

### **Pre-Production:**
- [ ] Deploy all 3 edge functions
- [ ] Set CRON_SECRET environment variable
- [ ] Test each function manually
- [ ] Setup pg_cron OR GitHub Actions
- [ ] Verify first successful run

### **Post-Production:**
- [ ] Monitor logs daily (first week)
- [ ] Check reward accuracy
- [ ] Verify invoice generation
- [ ] Confirm burn distribution
- [ ] Setup email notifications
- [ ] Create admin dashboard for monitoring

---

## 🚨 **Error Handling**

Functions include:
- Try-catch blocks for each user
- Detailed error logging
- Graceful failures (one user error doesn't stop others)
- Retry logic (can be added via pg_cron)

If a function fails:
1. Check logs in Supabase Dashboard
2. Verify CRON_SECRET is correct
3. Check database RLS policies
4. Test API endpoints (CoinGecko, etc.)
5. Re-run manually if needed

---

## 📝 **Next Steps**

**Week 2**: Payment Integration
- Stripe setup
- Deposit modal UI
- Payment webhook handler

**Week 3**: Blockchain Integration
- Deposit address generation
- Webhook listeners
- Withdrawal processing

**Week 4**: Marketplace Trading
- Buy/sell flows
- Offer system
- Transaction history

---

**Automation Complete! ✅**

All three backend systems are ready for deployment.
