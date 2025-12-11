# 🚀 TYT MVP - Next Implementation Steps

**Current Status**: Foundation Complete, Using Existing TYT Token
**Token**: APadkPpjonaLBpLYDzKB6753QQU3s8VZhEtkvLgrpump (Solana/pump.fun)

---

## ✅ **SIMPLIFIED MVP APPROACH**

Пропускаем deployment новых смарт-контрактов и используем:
- **TYT Token**: Уже существует на Solana (pump.fun)
- **NFT Miners**: Храним в базе данных (off-chain metadata)
- **Marketplace**: Backend + database (без on-chain escrow для MVP)
- **Rewards**: Backend-контролируемая дистрибуция

**Преимущества:**
- Быстрый запуск (2-4 недели вместо 12)
- Минимальные затраты (без аудитов)
- Используем реальный ликвидный токен
- Позже можем добавить on-chain контракты

---

## 🎯 **CRITICAL PATH (Weeks 1-4)**

### **Week 1: Backend Automation**

#### **A. Daily Rewards Engine**

**Файл**: `supabase/functions/cron-daily-rewards/index.ts`

```typescript
// Cron: 00:00 UTC daily
// Algorithm:
1. Получить все активные майнеры
2. Рассчитать gross BTC (hashrate × network difficulty)
3. Вычесть electricity cost
4. Вычесть service fee
5. Применить discount stacking (VIP + token + service button + balance coverage)
6. Рассчитать net BTC
7. Обновить wallet balance (BTC)
8. Создать daily_rewards запись
9. Отправить уведомление пользователю
```

**Implementation:**
- [ ] Create edge function
- [ ] Get BTC price API
- [ ] Calculate network difficulty
- [ ] Apply discount formula
- [ ] Update wallet balances
- [ ] Send email notifications
- [ ] Log all transactions

---

#### **B. Maintenance Invoice Generator**

**Файл**: `supabase/functions/cron-maintenance-invoices/index.ts`

```typescript
// Cron: 00:00 UTC daily
// Algorithm:
1. Получить все активные майнеры
2. Рассчитать daily cost (electricity + service fee)
3. Проверить maintenance balance
4. Применить available discounts
5. Создать invoice
6. Списать из maintenance balance
7. Если недостаточно → mark "unpaid" + send reminder
```

**Implementation:**
- [ ] Create edge function
- [ ] Calculate per-miner cost
- [ ] Check balance coverage tier (Bronze → Diamond)
- [ ] Apply discount curve
- [ ] Deduct from balance
- [ ] Create invoice record
- [ ] Handle insufficient balance

---

#### **C. Weekly Burn Scheduler**

**Файл**: `supabase/functions/cron-weekly-burn/index.ts`

```typescript
// Cron: Tuesday 12:00 UTC
// Algorithm:
1. Sum all TYT collected (maintenance, marketplace, upgrades)
2. Calculate CharityMint (25% of burn → foundation)
3. Record burn event
4. Update circulating supply
5. Distribute rewards (40% hashrate, 30% veTYT, 20% treasury, 10% foundation)
6. Generate public report
7. Post to Twitter/Telegram
```

**Implementation:**
- [ ] Create edge function
- [ ] Sum weekly TYT transactions
- [ ] Calculate burn amount
- [ ] Update token metrics
- [ ] Distribute rewards
- [ ] Generate transparency report
- [ ] Auto-post to socials

---

### **Week 2: Payment Integration**

#### **A. Stripe Setup**

**Features:**
- Credit/Debit cards
- Apple Pay / Google Pay
- 3D Secure
- Webhooks

**Files:**
- `src/components/DepositModal.tsx` - Payment UI
- `src/utils/stripe.ts` - Stripe client
- `supabase/functions/stripe-webhook/index.ts` - Webhook handler
- `supabase/functions/create-payment-intent/index.ts` - Payment creation

**Implementation:**
```typescript
// Flow:
1. User clicks "Deposit"
2. Select amount ($50, $100, $500, $1000)
3. Stripe widget opens
4. Payment processed
5. Webhook confirms
6. Credit wallet (USDT or BTC equivalent)
7. Show confirmation
```

**Steps:**
- [ ] Create Stripe account
- [ ] Get API keys (test + prod)
- [ ] Build payment modal
- [ ] Create payment intent endpoint
- [ ] Handle webhook events
- [ ] Test cards: 4242 4242 4242 4242
- [ ] Go live

---

#### **B. Crypto Ramp (Optional for MVP)**

**Provider**: Ramp Network or Transak

```typescript
// Widget integration:
<RampInstantSDK
  hostApiKey="YOUR_API_KEY"
  variant="auto"
  defaultAsset="BTC_BTC"
  userAddress={userBtcAddress}
  webhookUrl="https://your-domain.com/api/ramp-webhook"
/>
```

**Later**: После Stripe

---

### **Week 3: Blockchain Deposits & Withdrawals**

#### **A. Generate Deposit Addresses**

**Already exists**: `supabase/functions/generate-deposit-address/index.ts`

**Chains to support:**
- Bitcoin (BIP32)
- Ethereum (BIP44)
- TRON (TronWeb)
- Solana (Ed25519)
- XRP (Ripple)

**Implementation:**
```typescript
// On first wallet visit:
1. Check if user has deposit address for chain
2. If not → generate HD wallet address
3. Store: user_id, chain, address, derivation_path
4. Return address + QR code
5. Start monitoring
```

**Steps:**
- [ ] Update function with HD wallet generation
- [ ] Test on testnets
- [ ] Generate QR codes
- [ ] Display in Wallet UI
- [ ] Add "Copy Address" button

---

#### **B. Monitor Deposits**

**Already exists**: `supabase/functions/blockchain-webhook/index.ts`

**Services:**
- BlockCypher (BTC)
- Infura/Alchemy (ETH)
- TronGrid (TRX)
- Helius (SOL)
- Ripple API (XRP)

**Flow:**
```typescript
// On transaction detected:
1. Webhook hits endpoint
2. Verify signature
3. Check confirmations (BTC: 3, ETH: 12, TRX: 19, SOL: 32)
4. Update wallet balance
5. Create transaction record
6. Send notification "Deposit confirmed: 0.001 BTC"
```

**Steps:**
- [ ] Setup webhook URLs
- [ ] Register addresses with services
- [ ] Handle confirmation logic
- [ ] Update wallet balances
- [ ] Send push notifications

---

#### **C. Process Withdrawals**

**Already exists**: `supabase/functions/process-withdrawal/index.ts`

**Flow:**
```typescript
// User requests withdrawal:
1. Check KYC tier limits (Tier 1: $1K/day, Tier 2: $10K/day, Tier 3: unlimited)
2. Verify balance
3. Calculate network fee
4. Deduct from balance
5. Create withdrawal record (pending)
6. Admin approves (later: hot wallet auto-approve)
7. Broadcast transaction
8. Update status (confirmed)
9. Send notification
```

**Steps:**
- [ ] Build withdrawal UI
- [ ] Implement tier checks
- [ ] Calculate dynamic fees
- [ ] Create admin approval dashboard
- [ ] Later: integrate hot wallet (Fireblocks)

---

### **Week 4: Marketplace & Trading**

#### **A. Miner Purchase Flow**

**File**: `src/pages/app/Marketplace.tsx`

**Features:**
- Browse miners (filters: TH/s, W/TH, price, region)
- View details (ROI calculator)
- Buy with: TYT, USDT, BTC, or fiat (Stripe)
- Instant ownership transfer

**Implementation:**
```typescript
// Purchase flow:
1. User selects miner
2. Choose payment method
3. If TYT → check balance → deduct → transfer miner
4. If USDT/BTC → check wallet → deduct → transfer
5. If fiat → Stripe payment → wait confirmation → transfer
6. Update owner_id in nft_miners table
7. Create marketplace_sales record (3% fee, 1% foundation)
8. Send notification
```

**Steps:**
- [ ] Build marketplace UI
- [ ] Filter & sort miners
- [ ] ROI calculator component
- [ ] Payment method selector
- [ ] Purchase confirmation modal
- [ ] Transfer ownership logic

---

#### **B. List Miner for Sale**

**Features:**
- Set fixed price (TYT only)
- Add description
- Upload custom image (optional)
- Enable/disable listing
- Cancel anytime

**Implementation:**
```typescript
// Listing flow:
1. User clicks "Sell Miner"
2. Select miner from owned list
3. Enter price in TYT
4. Add description
5. Preview listing
6. Confirm → create marketplace_listings record
7. Miner appears in marketplace
```

**Steps:**
- [ ] Build "Sell" modal
- [ ] Price input (TYT)
- [ ] Description editor
- [ ] Image upload (S3/IPFS)
- [ ] Preview component
- [ ] Create listing logic

---

#### **C. Offers System**

**Features:**
- Buyers can make offers below asking price
- Sellers can accept/reject/counter
- Auto-expire after 48h

**Implementation:**
```typescript
// Offer flow:
1. Buyer enters offer amount
2. Create marketplace_offers record (status: pending)
3. Seller receives notification
4. Seller accepts → complete sale
5. Seller rejects → notify buyer
6. Seller counters → update offer → notify buyer
```

**Later**: Post-MVP

---

## 🎮 **DEMO DATA & TESTING**

### **Seed Production-Ready Demo**

**File**: `src/utils/seedData.ts` (update)

**Data to seed:**
1. Sample miners (различные TH/s, efficiency, regions)
2. VIP levels (0-10)
3. Sample rewards history (last 7 days)
4. Sample marketplace listings
5. Academy tracks & lessons
6. Foundation campaigns

**Usage:**
```typescript
// In Dashboard:
if (miners.length === 0) {
  <button onClick={seedDemoData}>Load Demo Data</button>
}
```

---

## 📊 **WEEK-BY-WEEK DELIVERABLES**

### **Week 1 Deliverables:**
- [x] TYT token configured (Solana address)
- [ ] Daily rewards automation (edge function)
- [ ] Maintenance invoicing (edge function)
- [ ] Weekly burn scheduler (edge function)
- [ ] Email notifications working

### **Week 2 Deliverables:**
- [ ] Stripe account setup
- [ ] Deposit modal UI
- [ ] Payment processing flow
- [ ] Webhook handling
- [ ] Test payments working

### **Week 3 Deliverables:**
- [ ] Deposit addresses generation (all chains)
- [ ] Blockchain webhook monitoring
- [ ] Withdrawal UI & flow
- [ ] Admin approval dashboard
- [ ] Notifications system

### **Week 4 Deliverables:**
- [ ] Marketplace filters & search
- [ ] Miner purchase flow (all payment methods)
- [ ] List miner UI
- [ ] Offers system (basic)
- [ ] Transaction history

---

## 🔐 **SECURITY CHECKLIST**

### **Before Launch:**
- [ ] RLS policies verified (all tables)
- [ ] API rate limiting (per user)
- [ ] Webhook signature verification
- [ ] SQL injection tests passed
- [ ] XSS protection enabled
- [ ] CORS configured correctly
- [ ] Environment secrets rotated
- [ ] 2FA enabled for admin
- [ ] Hot wallet security (multi-sig)
- [ ] Backup procedures documented

---

## 📈 **SUCCESS METRICS (MVP)**

### **Week 1:**
- 50 beta users registered
- 5 miners purchased
- $1K total volume
- 0 critical bugs
- 99% uptime

### **Week 4:**
- 200 users
- 50 miners sold
- $20K volume
- 10 marketplace sales
- 5 foundation donations

### **Month 3:**
- 1,000 users
- 500 miners
- $200K volume
- Foundation: $10K raised
- Press coverage (1+ article)

---

## 🚀 **IMMEDIATE NEXT ACTIONS**

### **Action 1: Create Daily Rewards Engine** (Today)
```bash
# Create edge function
mkdir -p supabase/functions/cron-daily-rewards

# Implementation:
- Calculate BTC rewards
- Apply discounts
- Update wallets
- Log transactions
```

### **Action 2: Build Stripe Integration** (This Week)
```bash
# Setup:
- Create Stripe account
- Get API keys
- Install SDK: npm install stripe @stripe/stripe-js
- Build payment modal
```

### **Action 3: Enable Deposits** (Next Week)
```bash
# Implementation:
- Generate addresses
- Setup webhooks
- Monitor deposits
- Credit wallets
```

---

## 💰 **REVISED BUDGET (Simplified MVP)**

| Item | Cost | Notes |
|------|------|-------|
| Stripe Setup | $0 | 2.9% + $0.30 per tx |
| Blockchain APIs | $100-$500/mo | Infura, Helius, TronGrid |
| Email Service | $50/mo | SendGrid/Postmark |
| Storage (S3) | $20-$50/mo | Images, backups |
| Infrastructure | $200-$500/mo | Supabase Pro |
| Legal Docs | $2,000-$5,000 | Terms, Privacy |
| **Total (MVP)** | **$5,000-$10,000** | First 3 months |

**No smart contract audits needed** = −$25K saved!

---

## 🎯 **READY TO START?**

**Рекомендую порядок:**

1. **Week 1**: Backend automation (rewards, maintenance, burn)
2. **Week 2**: Stripe payments + deposits
3. **Week 3**: Blockchain monitoring + withdrawals
4. **Week 4**: Marketplace trading

**Начинаем с Week 1 / Action 1?**

Создаю систему автоматических наград (Daily Rewards Engine)?
