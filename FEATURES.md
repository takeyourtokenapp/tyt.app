# TYT Platform - Feature Guide

## 🎯 Quick Feature Overview

### 1. Demo Data Loading

**Location**: Dashboard (when no data exists)

**Usage**:
1. Login to your account
2. Click "Load Demo Data" button on Dashboard
3. System automatically creates:
   - 3 sample NFT miners with different statuses
   - Multi-asset wallet balances (BTC, ETH, SOL, TRX, XRP, TYT, USDT)
   - 7 days of reward history per miner
   - Foundation campaigns
   - Academy tracks

**What you get**:
- Realistic mining data to explore
- Pre-populated wallet balances
- Sample rewards for testing
- Active foundation campaigns
- Complete learning tracks

### 2. Multi-Asset Wallet

**Location**: `/app/wallet`

**Features**:
- View all asset balances in one place
- Deposit addresses for each crypto (with copy button)
- Withdrawal forms (UI ready)
- Transaction history
- Total portfolio value in USD

**Supported Assets**:
- BTC (Bitcoin)
- ETH (Ethereum)
- SOL (Solana)
- TRX (Tron)
- XRP (Ripple)
- TYT (Platform token)
- USDT (Stablecoin)

### 3. NFT Miner Management

**Location**: `/app/miners`

**Features**:
- View all your miners with real-time stats
- See hashrate and efficiency metrics
- Monitor maintenance status
- Track TYT discount tiers
- Adjust reinvestment percentage
- View daily maintenance costs
- Quick actions (Upgrade, Pay Maintenance)

**Miner Statuses**:
- 🟢 **Active** - Mining and earning
- 🟡 **Maintenance Due** - Payment needed soon
- 🔴 **Delinquent** - Offline, needs payment
- ⚪ **Inactive** - Not operational

### 4. Rewards History

**Location**: `/app/rewards`

**Features**:
- Complete history of daily BTC earnings
- Gross vs. Net rewards tracking
- Maintenance cost breakdown
- Merkle proof verification status
- Time range filters (7d, 30d, 90d, all)
- Export to CSV (button ready)
- Statistics dashboard

**Reward Calculation**:
```
Gross BTC = Miner Hashrate × Pool Share
Maintenance = Electricity + Service Fee
Net BTC = Gross - Maintenance
Claimable = Net × (1 - Reinvest %)
```

### 5. Marketplace

**Location**: `/app/marketplace`

**Features**:
- Browse available NFT miners
- Sort by price, hashrate, efficiency
- Filter by payment asset
- Search by miner ID
- View miner specifications
- 24h volume statistics
- Buy instantly with wallet balance

**Listing Types**:
- Fixed Price (available now)
- Auction (coming soon)

**Payment Options**:
- TYT (platform discount)
- USDT (stablecoin)
- BTC (direct crypto)

### 6. Crypto Academia

**Location**: `/app/academy`

**Features**:
- Owl Rank progression system
- XP tracking and milestones
- 6 pre-populated learning tracks
- Progress monitoring
- Track difficulty levels
- Completion statistics
- Certificate tracking (UI ready)

**Owl Ranks**:
1. 🦉 **Worker** (0-99 XP) - Getting started
2. 📚 **Academic** (100-299 XP) - Learning fundamentals
3. 🤝 **Diplomat** (300-699 XP) - Understanding ecosystems
4. 🛡️ **Peacekeeper** (700-1,499 XP) - Security master
5. ⚔️ **Warrior** (1,500+ XP) - Platform expert

**Learning Tracks**:
- Bitcoin Mining Basics (Level 1)
- Blockchain Technology (Level 1)
- Cryptocurrency Trading (Level 2)
- DeFi & Smart Contracts (Level 2)
- NFT Technology (Level 2)
- Advanced Mining Operations (Level 3)

### 7. TYT Foundation

**Location**: `/app/foundation`

**Features**:
- View active fundraising campaigns
- Real-time progress tracking
- Multi-asset donation support
- Campaign types (Research, Family Support, Equipment)
- Transparency reporting
- Impact metrics
- Tax-deductible receipts

**Donation Process**:
1. Click "Donate" on any campaign
2. Enter donation amount in USD
3. Select payment asset (TYT, USDT, BTC, ETH)
4. Confirm transaction
5. Receive instant toast notification
6. Campaign progress updates automatically

**Campaign Types**:
- 🔬 **Research** - Fund medical research
- 👨‍👩‍👧‍👦 **Family Support** - Direct financial assistance
- 🏥 **Equipment** - Medical device purchases

### 8. Settings

**Location**: `/app/settings`

**Features**:
- Profile management
- Username customization
- KYC status and verification
- Two-factor authentication toggle
- Notification preferences (Email, Push)
- Connected devices tracking
- Password management (UI ready)
- Security settings

**KYC Levels**:
- Level 0: No verification (limited features)
- Level 1: Basic verification (standard limits)
- Level 2: Enhanced verification (higher limits)
- Level 3: Full verification (no limits)

## 🔧 Developer Features

### Toast Notifications

**Usage in any component**:

```typescript
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const toast = useToast();

  const handleAction = () => {
    toast.showSuccess('Action completed!');
    // OR
    toast.showError('Something went wrong');
    // OR
    toast.showWarning('Please verify your action');
  };
}
```

### Blockchain Utilities

**Available functions**:

```typescript
import {
  generateMerkleProof,
  verifyMerkleProof,
  formatAddress,
  validatePolygonAddress,
  estimateGas,
  waitForTransaction
} from '../utils/blockchain';

// Generate Merkle proof
const proof = generateMerkleProof(leafHash, rootHash);

// Verify proof
const isValid = verifyMerkleProof(leaf, proof, root);

// Format addresses
const short = formatAddress('0x1234...5678'); // "0x1234...5678"

// Validate addresses
if (validatePolygonAddress(address)) {
  // Process transaction
}

// Estimate gas
const estimate = estimateGas('claimRewards');
// Returns: { gasLimit, gasPrice, estimatedCost }
```

### Payment Processing

**Available functions**:

```typescript
import {
  payMaintenanceInvoice,
  purchaseMiner,
  claimRewards,
  createMarketplaceListing,
  makeDonation
} from '../utils/payments';

// Pay maintenance
const result = await payMaintenanceInvoice(
  invoiceId,
  userId,
  'TYT' // or 'USDT' | 'BTC'
);

if (result.success) {
  console.log('TX Hash:', result.transactionHash);
}

// Make donation
const donation = await makeDonation(
  campaignId,
  userId,
  100, // amount in selected asset
  'USDT'
);
```

### Seed Data Management

```typescript
import { seedDemoData, clearDemoData } from '../utils/seedData';

// Load demo data
await seedDemoData(userId);

// Clear demo data
await clearDemoData(userId);
```

## 📊 Data Flow

### Rewards Distribution

```
1. Daily Cron Job (00:00 UTC)
   ↓
2. Calculate rewards for all active miners
   ↓
3. Generate Merkle tree from all rewards
   ↓
4. Publish root to Polygon smart contract
   ↓
5. Update daily_rewards table with proofs
   ↓
6. Users can claim with proof verification
```

### Maintenance Payment

```
1. User initiates payment
   ↓
2. Check wallet balance
   ↓
3. Calculate TYT discount (if applicable)
   ↓
4. Deduct from wallet
   ↓
5. Update invoice status
   ↓
6. Activate miner
   ↓
7. Show success notification
```

### Marketplace Transaction

```
1. Buyer clicks "Buy Now"
   ↓
2. Verify wallet balance
   ↓
3. Deduct payment
   ↓
4. Transfer NFT ownership
   ↓
5. Credit seller wallet
   ↓
6. Update listing status
   ↓
7. Emit transaction events
```

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: Amber/Gold (#F59E0B)
- **Background**: Dark gradients (gray-900, gray-800)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)

### Animations
- Smooth page transitions
- Hover effects on cards
- Progress bar animations
- Toast slide-in from right
- Loading spinners

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons
- Collapsible sidebar on mobile

## 🔐 Security Features

### Implemented
- ✅ Row Level Security (RLS) on all tables
- ✅ Authenticated-only routes
- ✅ Protected API endpoints
- ✅ Environment variable security
- ✅ SQL injection prevention
- ✅ XSS protection via React

### Coming Soon
- 🔜 2FA via authenticator apps
- 🔜 Session management
- 🔜 Rate limiting
- 🔜 IP whitelisting
- 🔜 Smart contract audits

## 📱 Future Features

### Phase 3 (Q2 2025)
- Mobile app (React Native)
- Push notifications
- Biometric auth
- Offline mode
- Advanced charts

### Phase 4 (Q3 2025)
- veTYT governance voting
- DAO proposals
- Staking pools
- Liquidity mining
- Cross-chain bridges

### Phase 5 (Q4 2025)
- AI-powered mining optimization
- Automated reinvestment strategies
- Social trading features
- Advanced analytics dashboard
- API for third-party integrations

---

**Last Updated**: December 2024
**Version**: 1.0.0 MVP
**Status**: Production Ready
