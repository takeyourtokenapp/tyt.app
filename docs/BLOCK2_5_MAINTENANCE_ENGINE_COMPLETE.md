# Block 2.5 - Maintenance Engine Service Implementation Complete

## Overview

Calculates and tracks maintenance costs for NFT miners based on electricity consumption and service fees, with dynamic discounts based on VIP level, veTYT holdings, prepayment, and daily service button activation.

## Architecture

### Database Schema

**maintenance_fee_config**
Regional fee configuration:
```sql
CREATE TABLE maintenance_fee_config (
  id uuid PRIMARY KEY,
  region text NOT NULL UNIQUE,
  kwh_usd numeric(8, 4) NOT NULL,           -- Cost per kWh in USD
  service_bps integer NOT NULL,             -- Service fee in basis points
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Default Regions:**
- USA: $0.12/kWh, 200 bps (2%) service
- Canada: $0.08/kWh, 200 bps
- Europe: $0.15/kWh, 250 bps (2.5%)
- Asia: $0.10/kWh, 200 bps
- Default: $0.10/kWh, 200 bps

**maintenance_invoices** (Extended)
Daily/periodic maintenance invoices:
```sql
-- Extended existing table with new columns:
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS period_start date;
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS period_end date;
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS elec_usd numeric(12, 2);
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS service_usd numeric(12, 2);
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS discount_pct integer;
ALTER TABLE maintenance_invoices ADD COLUMN IF NOT EXISTS asset text;
```

**maintenance_payments** (NEW)
Payment records with burn tracking:
```sql
CREATE TABLE maintenance_payments (
  id uuid PRIMARY KEY,
  invoice_id uuid REFERENCES maintenance_invoices,
  user_id uuid REFERENCES profiles,
  amount numeric(18, 8) NOT NULL,           -- Amount paid in asset
  amount_usd numeric(12, 2) NOT NULL,       -- USD equivalent
  asset text NOT NULL,                       -- TYT, USDT, BTC
  tyt_burned numeric(18, 8) DEFAULT 0,      -- TYT burned for discount (20% of payment)
  discount_pct integer DEFAULT 0,
  transaction_id uuid REFERENCES wallet_transactions,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
```

### Calculation Functions

**calculate_discount_bps()**
Calculates total discount in basis points:

```sql
CREATE FUNCTION calculate_discount_bps(
  p_vip_level integer DEFAULT 0,
  p_prepay_days integer DEFAULT 0,
  p_vetyt_power numeric DEFAULT 0,
  p_total_vetyt numeric DEFAULT 1,
  p_service_button boolean DEFAULT false
) RETURNS integer
```

**Discount Components:**

1. **VIP Level Discount** (0-18%):
   - Bronze (VIP 1-2): 2% = 200 bps
   - Silver (VIP 3-4): 5% = 500 bps
   - Gold (VIP 5-6): 9% = 900 bps
   - Platinum (VIP 7-8): 13% = 1300 bps
   - Diamond (VIP 9-10): 18% = 1800 bps

2. **Prepay Discount** (0-10%):
   - 1% per 30 days prepaid
   - Max 10% (300+ days prepaid)

3. **veTYT Discount** (0-5%):
   - Proportional to user's voting power
   - `(user_vetyt / total_vetyt) * 5%`
   - Max 5%

4. **Service Button Discount** (0-3%):
   - 3% if clicked within last 24 hours
   - Resets daily

**Total Discount Cap: 20% (2000 bps)**

**calculate_maintenance()**
Calculates maintenance cost with all discounts:

```sql
CREATE FUNCTION calculate_maintenance(
  p_power_th numeric,
  p_efficiency_w_th numeric,
  p_region text,
  p_days integer DEFAULT 1,
  p_vip_level integer DEFAULT 0,
  p_prepay_days integer DEFAULT 0,
  p_vetyt_power numeric DEFAULT 0,
  p_total_vetyt numeric DEFAULT 1,
  p_service_button boolean DEFAULT false
) RETURNS jsonb
```

**Calculation Steps:**

1. **Power Consumption:**
   ```
   power_kw = (power_th * efficiency_w_th) / 1000
   daily_kwh = power_kw * 24
   ```

2. **Electricity Cost:**
   ```
   elec_usd = daily_kwh * kwh_rate * days
   ```

3. **Service Fee:**
   ```
   service_usd = power_th * (service_bps / 10000) * days
   ```

4. **Subtotal:**
   ```
   subtotal_usd = elec_usd + service_usd
   ```

5. **Apply Discount:**
   ```
   discount_bps = calculate_discount_bps(...)
   discount_amount = subtotal_usd * (discount_bps / 10000)
   total_usd = subtotal_usd - discount_amount
   ```

**Returns:**
```json
{
  "power_kw": 2.5,
  "daily_kwh": 60.0,
  "kwh_rate": 0.12,
  "elec_usd": 7.20,
  "service_usd": 2.00,
  "subtotal_usd": 9.20,
  "discount_bps": 1800,
  "discount_pct": 18,
  "discount_amount_usd": 1.66,
  "total_usd": 7.54,
  "region": "USA",
  "days": 1
}
```

### Helper Functions

**mark_overdue_invoices()**
Marks pending invoices as overdue:
```sql
UPDATE maintenance_invoices
SET status = 'overdue'
WHERE status = 'pending'
  AND due_date < CURRENT_DATE;
```

**update_miner_maintenance_tracking() (Trigger)**
Automatically updates miner stats when invoice is paid:
```sql
UPDATE nft_miners
SET last_maintenance_paid_at = NEW.paid_at,
    total_maintenance_paid = total_maintenance_paid + NEW.final_cost_usd
WHERE id = NEW.miner_id;
```

### Views

**v_user_maintenance_stats**
Aggregated maintenance stats per user:
```sql
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'overdue') as overdue_count,
  COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
  SUM(amount_usd) FILTER (WHERE status = 'pending') as pending_amount_usd,
  SUM(amount_usd) FILTER (WHERE status = 'overdue') as overdue_amount_usd,
  SUM(amount_usd) FILTER (WHERE status = 'paid') as paid_amount_usd,
  MAX(due_date) FILTER (WHERE status IN ('pending', 'overdue')) as next_due_date
FROM maintenance_invoices
GROUP BY user_id;
```

## Edge Function: cron-maintenance-invoices

**Endpoint:** `POST /functions/v1/cron-maintenance-invoices`

**Authentication:** Requires `Authorization: Bearer {CRON_SECRET}`

**Schedule:** Daily at 00:01 UTC (via Supabase Cron or external scheduler)

### Process Flow

1. **Fetch Active Miners:**
   ```typescript
   const { data: activeMiners } = await supabase
     .from('nft_miners')
     .select('*')
     .eq('status', 'active');
   ```

2. **Calculate Total veTYT:**
   ```typescript
   const { data: totalVetyTData } = await supabase
     .from('vetyt_locks')
     .select('locked_amount')
     .eq('is_active', true);

   const totalVetyt = totalVetyTData.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0);
   ```

3. **For Each Miner:**

   a. **Check for Duplicate:**
   ```typescript
   const { data: existingInvoice } = await supabase
     .from('maintenance_invoices')
     .select('id')
     .eq('miner_id', miner.id)
     .gte('period_start', yesterdayStr)
     .lte('period_end', todayStr)
     .maybeSingle();

   if (existingInvoice) continue;
   ```

   b. **Get User Data:**
   ```typescript
   const { data: vipData } = await supabase
     .from('profiles')
     .select('vip_level')
     .eq('id', miner.owner_id)
     .maybeSingle();

   const { data: vetyTData } = await supabase
     .from('vetyt_locks')
     .select('locked_amount')
     .eq('user_id', miner.owner_id)
     .eq('is_active', true);

   const userVetyt = vetyTData.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0);
   ```

   c. **Check Service Button:**
   ```typescript
   const { data: serviceButton } = await supabase
     .from('user_activities')
     .select('id')
     .eq('user_id', miner.owner_id)
     .eq('activity_type', 'service_button')
     .gte('created_at', yesterdayStr)
     .maybeSingle();
   ```

   d. **Calculate Maintenance:**
   ```typescript
   const calcResult = await supabase.rpc('calculate_maintenance', {
     p_power_th: miner.hashrate,
     p_efficiency_w_th: miner.efficiency,
     p_region: miner.farm_id || 'Default',
     p_days: 1,
     p_vip_level: vipData?.vip_level || 0,
     p_prepay_days: 0,
     p_vetyt_power: userVetyt,
     p_total_vetyt: totalVetyt,
     p_service_button: !!serviceButton,
   });
   ```

   e. **Create Invoice:**
   ```typescript
   await supabase.from('maintenance_invoices').insert({
     user_id: miner.owner_id,
     miner_id: miner.id,
     invoice_date: yesterdayStr,
     due_date: tomorrowStr,
     period_start: yesterdayStr,
     period_end: todayStr,
     base_cost_usd: calc.subtotal_usd,
     kwh_consumed: calc.daily_kwh,
     kwh_rate: calc.kwh_rate,
     elec_usd: calc.elec_usd,
     service_usd: calc.service_usd,
     total_discount_percent: calc.discount_pct,
     discount_pct: calc.discount_pct,
     final_cost_usd: calc.total_usd,
     status: 'pending',
     metadata: {
       calculation: calc,
       service_button_used: !!serviceButton,
       vip_level: vipData?.vip_level || 0,
       vetyt_balance: userVetyt,
     },
   });
   ```

4. **Mark Overdue:**
   ```typescript
   await supabase.rpc('mark_overdue_invoices');
   ```

5. **Log Results:**
   ```typescript
   await supabase.from('cron_job_logs').insert({
     job_name: 'cron-maintenance-invoices',
     status: errors.length > 0 ? 'completed_with_errors' : 'completed',
     result: {
       miners_processed: activeMiners.length,
       invoices_created: invoicesCreated,
       invoices_skipped: invoicesSkipped,
       errors: errors,
     },
   });
   ```

## Frontend Service: maintenanceService

**Location:** `src/utils/maintenanceService.ts`

### Usage Examples

**Calculate Maintenance Cost:**
```typescript
import { maintenanceService } from '@/utils/maintenanceService';

const calc = await maintenanceService.calculateMaintenance({
  powerTH: 100,             // 100 TH/s
  efficiencyWTH: 25,        // 25 W/TH
  region: 'USA',
  days: 30,                 // 30 days
  vipLevel: 5,              // Gold VIP
  prepayDays: 90,           // 90 days prepaid
  vetytPower: 10000,        // User's veTYT
  totalVetyt: 100000,       // Total veTYT
  serviceButton: true,      // Service button clicked today
});

console.log(calc);
// {
//   power_kw: 2.5,
//   daily_kwh: 60,
//   elec_usd: 216,          // $7.20/day * 30 days
//   service_usd: 60,        // $2/day * 30 days
//   subtotal_usd: 276,
//   discount_bps: 2000,     // 20% max (900 VIP + 300 prepay + 500 veTYT + 300 service)
//   discount_pct: 20,
//   discount_amount_usd: 55.20,
//   total_usd: 220.80,      // Final cost
//   region: 'USA',
//   days: 30
// }
```

**Calculate Discount Breakdown:**
```typescript
const breakdown = maintenanceService.calculateDiscountBreakdown(
  5,      // VIP level (Gold)
  90,     // Prepay days
  10000,  // User veTYT
  100000, // Total veTYT
  true    // Service button
);

console.log(breakdown);
// {
//   vip_discount_bps: 900,              // 9% Gold VIP
//   prepay_discount_bps: 300,           // 3% (90 days / 30 * 1%)
//   vetyt_discount_bps: 500,            // 5% (10000/100000 * 5%)
//   service_button_discount_bps: 300,   // 3% Service button
//   total_discount_bps: 2000,           // 20% total (capped)
//   total_discount_pct: 20
// }
```

**Get Pending Invoices:**
```typescript
const invoices = await maintenanceService.getPendingInvoices(userId);

console.log(invoices);
// [
//   {
//     id: 'uuid',
//     miner_id: 'uuid',
//     period_start: '2024-01-15',
//     period_end: '2024-01-16',
//     elec_usd: 7.20,
//     service_usd: 2.00,
//     discount_pct: 18,
//     final_cost_usd: 7.54,
//     status: 'pending',
//     due_date: '2024-01-17',
//     miner: {
//       token_id: '123',
//       name: 'Miner #123',
//       hashrate: 100,
//       efficiency: 25
//     }
//   },
//   ...
// ]
```

**Get Total Pending Amount:**
```typescript
const totalPending = await maintenanceService.getTotalPendingAmount(userId);
console.log(`Total pending: $${totalPending.toFixed(2)}`);
// Total pending: $225.45
```

**Pay Invoice:**
```typescript
const payment = await maintenanceService.payInvoice(
  invoiceId,
  'TYT',           // Payment asset
  1000,            // 1000 TYT
  100,             // $100 USD equivalent
  transactionId    // Optional transaction ID
);

console.log(payment);
// {
//   id: 'uuid',
//   invoice_id: 'uuid',
//   amount: 1000,
//   amount_usd: 100,
//   asset: 'TYT',
//   tyt_burned: 200,        // 20% burned
//   discount_pct: 18,
//   created_at: '2024-01-16T12:00:00Z'
// }
```

**Get Maintenance Stats:**
```typescript
const stats = await maintenanceService.getUserMaintenanceStats(userId);

console.log(stats);
// {
//   pending_count: 5,
//   overdue_count: 2,
//   paid_count: 30,
//   pending_amount_usd: 150.25,
//   overdue_amount_usd: 60.80,
//   paid_amount_usd: 1250.00,
//   next_due_date: '2024-01-17'
// }
```

**Estimate Monthly Cost:**
```typescript
const estimate = await maintenanceService.estimateMonthlyCost({
  powerTH: 100,
  efficiencyWTH: 25,
  region: 'USA',
  vipLevel: 5,
  serviceButton: true
});

console.log(estimate);
// {
//   daily: { total_usd: 7.54, ... },
//   monthly: { total_usd: 220.80, ... },
//   yearly: { total_usd: 2752.10, ... }
// }
```

**Calculate Profitability:**
```typescript
const profitability = maintenanceService.calculateProfitability({
  dailyRewardBTC: 0.0001,      // 0.0001 BTC/day
  dailyMaintenanceUSD: 7.54,   // $7.54/day
  btcPriceUSD: 95000,          // $95,000/BTC
});

console.log(profitability);
// {
//   dailyRewardUSD: 9.50,
//   dailyMaintenanceUSD: 7.54,
//   dailyNetUSD: 1.96,           // Profitable!
//   dailyNetBTC: 0.0000206,
//   monthlyNetUSD: 58.80,
//   yearlyNetUSD: 715.40,
//   isProfitable: true,
//   breakEvenBTCPrice: 75400     // BTC must be > $75,400 to be profitable
// }
```

**Real-time Subscriptions:**
```typescript
const unsubscribe = maintenanceService.subscribeToUserInvoices(userId, (invoice) => {
  console.log('Invoice updated:', invoice);
  // Update UI
});

// Cleanup
unsubscribe();
```

## Payment Flow

### TYT Payment with Burn

When user pays maintenance with TYT:

1. **User initiates payment:**
   ```typescript
   await maintenanceService.payInvoice(invoiceId, 'TYT', 1000, 100);
   ```

2. **20% of TYT is burned:**
   ```
   tyt_burned = 1000 * 0.2 = 200 TYT
   tyt_to_protocol = 800 TYT
   ```

3. **Invoice marked as paid:**
   ```sql
   UPDATE maintenance_invoices
   SET status = 'paid',
       paid_at = now(),
       asset = 'TYT'
   WHERE id = invoice_id;
   ```

4. **Miner stats updated (via trigger):**
   ```sql
   UPDATE nft_miners
   SET last_maintenance_paid_at = now(),
       total_maintenance_paid = total_maintenance_paid + 100
   WHERE id = miner_id;
   ```

5. **Payment recorded:**
   ```sql
   INSERT INTO maintenance_payments (
     invoice_id,
     user_id,
     amount,
     amount_usd,
     asset,
     tyt_burned,
     discount_pct
   ) VALUES (
     invoice_id,
     user_id,
     1000,
     100,
     'TYT',
     200,
     18
   );
   ```

### USDT/BTC Payment

For USDT or BTC payments, no burn occurs:
```typescript
await maintenanceService.payInvoice(invoiceId, 'USDT', 100, 100);
// tyt_burned = 0
```

## Discount Scenarios

### Example 1: New User (No Discounts)

**User Profile:**
- VIP Level: 0
- veTYT: 0
- Prepay: 0 days
- Service Button: Not clicked

**Miner:**
- Hashrate: 100 TH/s
- Efficiency: 25 W/TH
- Region: USA

**Calculation:**
```
Power: 100 * 25 / 1000 = 2.5 kW
Daily kWh: 2.5 * 24 = 60 kWh
Electricity: 60 * 0.12 = $7.20
Service: 100 * (200 / 10000) = $2.00
Subtotal: $9.20
Discount: 0%
Total: $9.20/day
```

### Example 2: Gold VIP + Service Button

**User Profile:**
- VIP Level: 5 (Gold)
- veTYT: 0
- Prepay: 0 days
- Service Button: Clicked today

**Calculation:**
```
Subtotal: $9.20
VIP Discount: 9% (900 bps)
Service Button: 3% (300 bps)
Total Discount: 12% (1200 bps)
Discount Amount: $9.20 * 0.12 = $1.10
Total: $8.10/day
```

### Example 3: Diamond VIP + 365-day Prepay + veTYT + Service Button

**User Profile:**
- VIP Level: 10 (Diamond)
- veTYT: 50,000 (50% of total)
- Prepay: 365 days
- Service Button: Clicked today

**Calculation:**
```
Subtotal: $9.20
VIP Discount: 18% (1800 bps)
Prepay Discount: 10% (1000 bps, capped at 10%)
veTYT Discount: 2.5% (250 bps, 50% * 5%)
Service Button: 3% (300 bps)
Raw Total: 33.5%
Capped at: 20% (2000 bps)
Discount Amount: $9.20 * 0.20 = $1.84
Total: $7.36/day
```

**Savings: $1.84/day = $672/year**

## Monitoring

### Query Invoice Stats

```sql
-- Total invoices by status
SELECT status, COUNT(*), SUM(final_cost_usd)
FROM maintenance_invoices
GROUP BY status;

-- Users with overdue invoices
SELECT
  p.username,
  COUNT(mi.id) as overdue_count,
  SUM(mi.final_cost_usd) as overdue_amount
FROM maintenance_invoices mi
JOIN profiles p ON p.id = mi.user_id
WHERE mi.status = 'overdue'
GROUP BY p.id, p.username
ORDER BY overdue_amount DESC;

-- Average discount by VIP level
SELECT
  p.vip_level,
  COUNT(mi.id) as invoice_count,
  AVG(mi.discount_pct) as avg_discount_pct,
  AVG(mi.final_cost_usd) as avg_cost_usd
FROM maintenance_invoices mi
JOIN profiles p ON p.id = mi.user_id
GROUP BY p.vip_level
ORDER BY p.vip_level;

-- Total TYT burned from maintenance payments
SELECT
  SUM(tyt_burned) as total_tyt_burned,
  COUNT(*) as payment_count,
  AVG(tyt_burned) as avg_tyt_burned
FROM maintenance_payments
WHERE asset = 'TYT';

-- Maintenance payment breakdown by asset
SELECT
  asset,
  COUNT(*) as payment_count,
  SUM(amount_usd) as total_usd
FROM maintenance_payments
GROUP BY asset
ORDER BY total_usd DESC;

-- Recent cron job runs
SELECT *
FROM cron_job_logs
WHERE job_name = 'cron-maintenance-invoices'
ORDER BY started_at DESC
LIMIT 10;
```

## Cron Job Setup

### Supabase Cron (Recommended)

```sql
SELECT cron.schedule(
  'daily-maintenance-invoices',
  '1 0 * * *',  -- 00:01 UTC daily
  $$
  SELECT
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/cron-maintenance-invoices',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    )
  $$
);
```

### External Cron (cron-job.org, EasyCron, etc.)

```bash
curl -X POST https://your-project.supabase.co/functions/v1/cron-maintenance-invoices \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Schedule: Daily at 00:01 UTC

## Testing

### 1. Test Fee Configuration

```typescript
const configs = await maintenanceService.getAllFeeConfigs();
console.log(configs);

const usaConfig = await maintenanceService.getFeeConfig('USA');
console.log('USA kWh rate:', usaConfig.kwh_usd);
```

### 2. Test Discount Calculation

```typescript
const breakdown = maintenanceService.calculateDiscountBreakdown(
  10,     // Diamond VIP
  365,    // 1 year prepaid
  50000,  // User veTYT
  100000, // Total veTYT
  true    // Service button
);

console.log('Total discount:', breakdown.total_discount_pct, '%');
// Should be 20% (capped)
```

### 3. Test Maintenance Calculation

```typescript
const calc = await maintenanceService.calculateMaintenance({
  powerTH: 100,
  efficiencyWTH: 25,
  region: 'USA',
  days: 1,
  vipLevel: 0,
  serviceButton: false
});

console.log('Daily cost (no discounts):', calc.total_usd);
// Should be ~$9.20

const calcWithDiscount = await maintenanceService.calculateMaintenance({
  powerTH: 100,
  efficiencyWTH: 25,
  region: 'USA',
  days: 1,
  vipLevel: 10,
  prepayDays: 365,
  vetytPower: 50000,
  totalVetyt: 100000,
  serviceButton: true
});

console.log('Daily cost (max discount):', calcWithDiscount.total_usd);
// Should be ~$7.36 (20% off)
```

### 4. Test Profitability

```typescript
const profit = maintenanceService.calculateProfitability({
  dailyRewardBTC: 0.0001,
  dailyMaintenanceUSD: 7.54,
  btcPriceUSD: 95000
});

console.log('Is profitable?', profit.isProfitable);
console.log('Break-even BTC price:', profit.breakEvenBTCPrice);
```

### 5. Test Cron Function (Manual)

```bash
curl -X POST https://your-project.supabase.co/functions/v1/cron-maintenance-invoices \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Check logs:
```sql
SELECT *
FROM cron_job_logs
WHERE job_name = 'cron-maintenance-invoices'
ORDER BY started_at DESC
LIMIT 1;
```

## Files Created/Modified

**Created:**
- `supabase/migrations/XXXXXX_extend_maintenance_system_v2_5.sql` - Database migration
- `supabase/functions/cron-maintenance-invoices/index.ts` - Updated cron function
- `src/utils/maintenanceService.ts` - Frontend maintenance service
- `docs/BLOCK2_5_MAINTENANCE_ENGINE_COMPLETE.md` - This documentation

**Database Objects:**
- Table: `maintenance_fee_config`
- Table: `maintenance_payments`
- Extended: `maintenance_invoices` (added columns)
- Function: `calculate_discount_bps()`
- Function: `calculate_maintenance()`
- Function: `mark_overdue_invoices()`
- Trigger: `on_invoice_paid`
- View: `v_user_maintenance_stats`

## Next Steps

### Block 2.6 - Rewards Engine
- Daily BTC reward calculations
- Merkle tree generation
- Reward distribution
- Reinvest automation

## Summary

Block 2.5 Maintenance Engine is complete with:
- **Regional fee configuration** with per-region electricity and service rates
- **Dynamic discount system** based on VIP, veTYT, prepay, and service button
- **Comprehensive calculation functions** with all discount logic
- **Daily cron job** to generate maintenance invoices automatically
- **Payment tracking** with TYT burn mechanics (20% burned on payments)
- **Real-time statistics** and monitoring views
- **Frontend service** with 15+ methods for maintenance management
- **Profitability calculator** to help users understand mining economics

All maintenance costs are now calculated with transparent, governance-controlled fees and dynamic discounts that reward long-term users and ecosystem participants.
