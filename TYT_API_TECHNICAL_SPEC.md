# TYT API & TECHNICAL SPECIFICATION

**Version**: 2.0.0
**Last Updated**: December 10, 2024
**API Base URL**: `https://api.takeyourtoken.app/v1`

---

## 🎯 API OVERVIEW

### Authentication

**JWT Bearer Token**:
```http
Authorization: Bearer <JWT_TOKEN>
```

**Token Expiry**: 24 hours
**Refresh Token**: 30 days

### Rate Limiting

- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **VIP**: 1000 requests/minute

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-12-10T00:00:00Z"
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2024-12-10T00:00:00Z"
}
```

---

## 📡 CORE API ENDPOINTS

### 1. AUTHENTICATION

#### POST `/auth/register`

Register new user with email.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "referralCode": "OWL123" // optional
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 86400
  }
}
```

#### POST `/auth/login`

Login with credentials.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**: Same as register

#### POST `/auth/wallet-connect`

Authenticate with Web3 wallet.

**Request**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x...",
  "message": "Sign this message to authenticate..."
}
```

**Response**: Same as register

#### POST `/auth/refresh`

Refresh access token.

**Request**:
```json
{
  "refreshToken": "eyJ..."
}
```

---

### 2. USER MANAGEMENT

#### GET `/users/me`

Get current user profile.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "walletAddress": "0x...",
    "kycStatus": "VERIFIED",
    "vipTier": "GOLD",
    "owlRank": "DIPLOMAT",
    "owlXP": 450,
    "referralCode": "OWL123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PATCH `/users/me`

Update user profile.

**Request**:
```json
{
  "displayName": "Owl Warrior",
  "avatar": "https://...",
  "preferences": {
    "language": "en",
    "currency": "USD",
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```

#### POST `/users/kyc`

Submit KYC verification.

**Request** (multipart/form-data):
```
firstName: John
lastName: Doe
dateOfBirth: 1990-01-01
country: USA
idDocument: <file>
proofOfAddress: <file>
selfie: <file>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "kycId": "uuid",
    "status": "PENDING",
    "submittedAt": "2024-12-10T00:00:00Z",
    "estimatedReviewTime": "24-48 hours"
  }
}
```

---

### 3. MINERS (NFTs)

#### GET `/miners`

Get all miners owned by user.

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `sortBy` (powerTH, efficiency, createdAt)
- `order` (asc, desc)

**Response**:
```json
{
  "success": true,
  "data": {
    "miners": [
      {
        "id": "uuid",
        "tokenId": "12345",
        "powerTH": 120.5,
        "efficiencyWTH": 28.5,
        "region": "USA_DC_01",
        "maintenanceRate": 0.065,
        "tier": "ASIC_S19_XP",
        "dailyGrossBTC": 0.00045,
        "dailyNetBTC": 0.00032,
        "roi": 15.2,
        "status": "ACTIVE",
        "createdAt": "2024-01-01T00:00:00Z",
        "lastUpgradeAt": "2024-06-01T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

#### GET `/miners/:id`

Get detailed miner information.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tokenId": "12345",
    "owner": {
      "id": "uuid",
      "displayName": "Owl Warrior"
    },
    "powerTH": 120.5,
    "efficiencyWTH": 28.5,
    "region": "USA_DC_01",
    "maintenanceRate": 0.065,
    "tier": "ASIC_S19_XP",
    "performance": {
      "last7Days": {
        "avgHashrate": 119.8,
        "uptime": 99.5,
        "totalBTC": 0.00224
      },
      "last30Days": {
        "avgHashrate": 120.1,
        "uptime": 99.2,
        "totalBTC": 0.00960
      },
      "allTime": {
        "totalBTC": 0.15600,
        "totalDays": 180
      }
    },
    "upgrades": [
      {
        "type": "HASHRATE",
        "amount": 20.5,
        "date": "2024-06-01T00:00:00Z"
      }
    ],
    "metadata": {
      "image": "https://ipfs.io/ipfs/...",
      "attributes": [...]
    }
  }
}
```

#### POST `/miners/purchase`

Purchase new miner.

**Request**:
```json
{
  "tier": "ASIC_S19_XP",
  "powerTH": 100,
  "region": "USA_DC_01",
  "paymentMethod": "TYT" // or USDT, BTC
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "minerId": "uuid",
    "tokenId": "12345",
    "price": 5000,
    "currency": "USD",
    "txHash": "0x...",
    "foundationDonation": 50
  }
}
```

#### POST `/miners/:id/upgrade-hashrate`

Upgrade miner hashrate.

**Request**:
```json
{
  "additionalTH": 20,
  "paymentMethod": "TYT"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "minerId": "uuid",
    "oldPowerTH": 100,
    "newPowerTH": 120,
    "cost": 1000,
    "currency": "USD",
    "txHash": "0x..."
  }
}
```

#### POST `/miners/:id/upgrade-efficiency`

Upgrade miner efficiency.

**Request**:
```json
{
  "targetEfficiency": 25.0,
  "paymentMethod": "TYT"
}
```

**Response**: Similar to hashrate upgrade

---

### 4. REWARDS

#### GET `/rewards`

Get reward history.

**Query Parameters**:
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `minerId` (optional)
- `page`, `limit`

**Response**:
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": "uuid",
        "date": "2024-12-09",
        "miner": {
          "id": "uuid",
          "tokenId": "12345",
          "powerTH": 120.5
        },
        "grossBTC": 0.00045,
        "electricityCostBTC": 0.00008,
        "serviceFeeB TC": 0.00005,
        "discountPercent": 9,
        "netBTC": 0.00032,
        "reinvestBTC": 0.00000,
        "creditedBTC": 0.00032,
        "proofHash": "0x...",
        "status": "CREDITED"
      }
    ],
    "summary": {
      "totalGrossBTC": 0.01350,
      "totalNetBTC": 0.00960,
      "totalDays": 30,
      "avgDailyBTC": 0.00032
    }
  }
}
```

#### GET `/rewards/pending`

Get pending (today's) rewards.

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2024-12-10",
    "estimatedCreditTime": "2024-12-11T00:00:00Z",
    "miners": [
      {
        "minerId": "uuid",
        "tokenId": "12345",
        "estimatedGrossBTC": 0.00045,
        "estimatedNetBTC": 0.00032
      }
    ],
    "totalEstimatedBTC": 0.00160
  }
}
```

---

### 5. MAINTENANCE

#### GET `/maintenance/status`

Get maintenance payment status.

**Response**:
```json
{
  "success": true,
  "data": {
    "miners": [
      {
        "minerId": "uuid",
        "tokenId": "12345",
        "dailyFeeUSD": 7.82,
        "balance": {
          "days": 45,
          "amountUSD": 351.90
        },
        "autoPay": {
          "enabled": true,
          "method": "TYT",
          "discountPercent": 9
        },
        "lastPaidAt": "2024-12-09T00:00:00Z",
        "status": "ACTIVE"
      }
    ],
    "totalDailyFeeUSD": 31.28,
    "totalBalanceDays": 38
  }
}
```

#### POST `/maintenance/pay`

Manually pay maintenance.

**Request**:
```json
{
  "minerId": "uuid",
  "days": 30,
  "paymentMethod": "TYT" // or USDT, BTC
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "minerId": "uuid",
    "days": 30,
    "totalFeeUSD": 234.60,
    "discountPercent": 9,
    "finalFeeUSD": 213.49,
    "tytBurned": 4269.80, // if paid in TYT
    "newBalanceDays": 75,
    "txHash": "0x..."
  }
}
```

#### PATCH `/maintenance/autopay`

Configure auto-pay settings.

**Request**:
```json
{
  "minerId": "uuid",
  "enabled": true,
  "method": "TYT",
  "minDaysThreshold": 7
}
```

---

### 6. MARKETPLACE

#### GET `/marketplace/listings`

Browse marketplace listings.

**Query Parameters**:
- `minPowerTH`, `maxPowerTH`
- `minEfficiency`, `maxEfficiency`
- `region`
- `sortBy` (price, powerTH, roi)
- `order` (asc, desc)
- `page`, `limit`

**Response**:
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": "uuid",
        "miner": {
          "tokenId": "12345",
          "powerTH": 120.5,
          "efficiencyWTH": 28.5,
          "tier": "ASIC_S19_XP",
          "dailyNetBTC": 0.00032,
          "image": "https://..."
        },
        "seller": {
          "id": "uuid",
          "displayName": "Seller123"
        },
        "price": 5500,
        "currency": "USD",
        "priceInTYT": 110000,
        "roi": 14.8,
        "listedAt": "2024-12-01T00:00:00Z",
        "expiresAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 142,
    "page": 1,
    "pages": 8
  }
}
```

#### POST `/marketplace/list`

List miner for sale.

**Request**:
```json
{
  "minerId": "uuid",
  "priceUSD": 5500,
  "duration": 2592000 // 30 days in seconds
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "listingId": "uuid",
    "minerId": "uuid",
    "priceUSD": 5500,
    "priceInTYT": 110000,
    "expiresAt": "2025-01-10T00:00:00Z",
    "txHash": "0x..."
  }
}
```

#### POST `/marketplace/buy`

Purchase listed miner.

**Request**:
```json
{
  "listingId": "uuid",
  "paymentMethod": "TYT" // only TYT accepted
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "purchaseId": "uuid",
    "minerId": "uuid",
    "tokenId": "12345",
    "price": 5500,
    "platformFee": 165, // 3%
    "foundationDonation": 165,
    "sellerReceived": 5335,
    "txHash": "0x..."
  }
}
```

#### DELETE `/marketplace/listings/:id`

Cancel listing.

---

### 7. WALLET

#### GET `/wallet/balances`

Get all wallet balances.

**Response**:
```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "currency": "BTC",
        "balance": 0.05230000,
        "usdValue": 2615.00,
        "pending": 0.00032000
      },
      {
        "currency": "TYT",
        "balance": 125000.00,
        "usdValue": 6250.00,
        "locked": 50000.00 // veTYT
      },
      {
        "currency": "USDT",
        "balance": 1500.00,
        "usdValue": 1500.00
      }
    ],
    "totalUSDValue": 10365.00
  }
}
```

#### GET `/wallet/transactions`

Get transaction history.

**Query Parameters**:
- `currency` (BTC, TYT, USDT, ALL)
- `type` (DEPOSIT, WITHDRAWAL, REWARD, BURN, PURCHASE, SALE)
- `startDate`, `endDate`
- `page`, `limit`

**Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "REWARD",
        "currency": "BTC",
        "amount": 0.00032000,
        "usdValue": 16.00,
        "from": "REWARDS_ENGINE",
        "to": "USER_WALLET",
        "status": "COMPLETED",
        "txHash": "bc1q...",
        "createdAt": "2024-12-10T00:00:00Z"
      }
    ],
    "page": 1,
    "pages": 10
  }
}
```

#### POST `/wallet/deposit`

Get deposit address.

**Request**:
```json
{
  "currency": "BTC" // or USDT
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "currency": "BTC",
    "address": "bc1q...",
    "qrCode": "data:image/png;base64,...",
    "minDeposit": 0.0001,
    "confirmations": 3,
    "network": "BITCOIN"
  }
}
```

#### POST `/wallet/withdraw`

Request withdrawal.

**Request**:
```json
{
  "currency": "BTC",
  "amount": 0.05000000,
  "address": "bc1q...",
  "network": "BITCOIN", // or LIGHTNING, LIQUID, etc.
  "twoFactorCode": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "withdrawalId": "uuid",
    "currency": "BTC",
    "amount": 0.05000000,
    "fee": 0.00005000,
    "netAmount": 0.04995000,
    "address": "bc1q...",
    "status": "PENDING",
    "estimatedTime": "30 minutes",
    "createdAt": "2024-12-10T00:00:00Z"
  }
}
```

---

### 8. ACADEMY

#### GET `/academy/courses`

Get course catalog.

**Query Parameters**:
- `track` (BLOCKCHAIN, SECURITY, NFT, DEFI, MINING, DEVELOPMENT)
- `level` (BEGINNER, INTERMEDIATE, ADVANCED)
- `language`

**Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Bitcoin Mining Fundamentals",
        "description": "Learn the basics of Bitcoin mining...",
        "track": "MINING",
        "level": "BEGINNER",
        "duration": 45, // minutes
        "xpReward": 50,
        "lessons": 8,
        "quizzes": 3,
        "thumbnail": "https://...",
        "progress": 0, // 0-100
        "completed": false
      }
    ]
  }
}
```

#### GET `/academy/courses/:id`

Get course details and content.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Bitcoin Mining Fundamentals",
    "description": "...",
    "track": "MINING",
    "level": "BEGINNER",
    "lessons": [
      {
        "id": "uuid",
        "order": 1,
        "title": "What is Mining?",
        "type": "VIDEO",
        "duration": 8,
        "videoUrl": "https://...",
        "transcript": "...",
        "completed": false
      },
      {
        "id": "uuid",
        "order": 2,
        "title": "Quiz: Mining Basics",
        "type": "QUIZ",
        "questions": [
          {
            "id": "uuid",
            "question": "What is a hash?",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": 0
          }
        ]
      }
    ]
  }
}
```

#### POST `/academy/progress`

Mark lesson as completed.

**Request**:
```json
{
  "courseId": "uuid",
  "lessonId": "uuid",
  "quizScore": 80 // if quiz
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "lessonCompleted": true,
    "xpEarned": 10,
    "newTotalXP": 460,
    "rankUp": false,
    "courseProgress": 25
  }
}
```

#### GET `/academy/certificates`

Get user certificates.

**Response**:
```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "uuid",
        "tokenId": "67890",
        "track": "MINING",
        "tier": "BRONZE",
        "issuedAt": "2024-06-15T00:00:00Z",
        "blockchain": "POLYGON",
        "txHash": "0x...",
        "imageUrl": "https://...",
        "verificationUrl": "https://polygonscan.com/token/..."
      }
    ]
  }
}
```

---

### 9. FOUNDATION

#### GET `/foundation/stats`

Get foundation statistics.

**Response**:
```json
{
  "success": true,
  "data": {
    "treasury": {
      "totalRaisedUSD": 1250000,
      "currentBalanceUSD": 450000,
      "totalDisbursedUSD": 800000
    },
    "impact": {
      "grantsAwarded": 12,
      "familiesSupported": 156,
      "institutionPartners": 8,
      "publicationsFunded": 23
    },
    "recentDonations": [
      {
        "id": "uuid",
        "amount": 500,
        "currency": "USD",
        "source": "MARKETPLACE",
        "date": "2024-12-09T12:00:00Z"
      }
    ]
  }
}
```

#### GET `/foundation/grants`

Get active grants.

**Response**:
```json
{
  "success": true,
  "data": {
    "grants": [
      {
        "id": "uuid",
        "title": "Advanced MRI for Pediatric Brain Tumors",
        "institution": "Children's Hospital Boston",
        "amount": 150000,
        "status": "ACTIVE",
        "startDate": "2024-01-01",
        "endDate": "2025-12-31",
        "progress": 35,
        "milestones": [
          {
            "description": "Equipment purchase",
            "status": "COMPLETED",
            "completedAt": "2024-03-15"
          },
          {
            "description": "First patient cohort enrolled",
            "status": "IN_PROGRESS"
          }
        ]
      }
    ]
  }
}
```

#### POST `/foundation/donate`

Make direct donation.

**Request**:
```json
{
  "amount": 1000,
  "currency": "USDT", // or BTC, TYT
  "message": "In memory of...",
  "anonymous": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "donationId": "uuid",
    "amount": 1000,
    "currency": "USDT",
    "receiptUrl": "https://...",
    "txHash": "0x...",
    "taxDeductible": true
  }
}
```

---

### 10. GOVERNANCE

#### GET `/governance/proposals`

Get all proposals.

**Query Parameters**:
- `status` (DRAFT, ACTIVE, PASSED, REJECTED, EXECUTED)
- `type` (DISCOUNT_CURVE, MAINTENANCE_RATE, BURN_SCHEDULE, FOUNDATION_ALLOCATION)

**Response**:
```json
{
  "success": true,
  "data": {
    "proposals": [
      {
        "id": "uuid",
        "proposer": {
          "id": "uuid",
          "displayName": "Owl Warrior"
        },
        "title": "Increase Diamond Tier Discount to 20%",
        "description": "...",
        "type": "DISCOUNT_CURVE",
        "votingStartsAt": "2024-12-05T00:00:00Z",
        "votingEndsAt": "2024-12-12T00:00:00Z",
        "status": "ACTIVE",
        "votes": {
          "for": 1250000,
          "against": 350000,
          "abstain": 100000,
          "total": 1700000
        },
        "quorum": {
          "required": 1000000,
          "current": 1700000,
          "met": true
        },
        "threshold": {
          "required": 60,
          "current": 73.5,
          "met": true
        }
      }
    ]
  }
}
```

#### POST `/governance/proposals`

Create new proposal.

**Request**:
```json
{
  "title": "Increase Diamond Tier Discount to 20%",
  "description": "Detailed proposal...",
  "type": "DISCOUNT_CURVE",
  "changes": {
    "tierChanges": [
      {
        "tier": "DIAMOND",
        "currentDiscount": 18,
        "proposedDiscount": 20
      }
    ]
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "proposalId": "uuid",
    "status": "DRAFT",
    "discussionEndsAt": "2024-12-13T00:00:00Z",
    "votingStartsAt": "2024-12-13T00:00:00Z"
  }
}
```

#### POST `/governance/vote`

Vote on proposal.

**Request**:
```json
{
  "proposalId": "uuid",
  "vote": "FOR", // FOR, AGAINST, ABSTAIN
  "reason": "Optional explanation..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "voteId": "uuid",
    "votingPower": 5000,
    "txHash": "0x..."
  }
}
```

#### GET `/governance/voting-power`

Get user's veTYT balance and voting power.

**Response**:
```json
{
  "success": true,
  "data": {
    "tytLocked": 50000,
    "lockEnd": "2025-12-10T00:00:00Z",
    "votingPower": 25000,
    "decay": {
      "daily": 68,
      "weekly": 476
    }
  }
}
```

---

## 🔐 WEBSOCKET API

**Endpoint**: `wss://api.takeyourtoken.app/ws`

### Authentication

Send immediately after connection:
```json
{
  "type": "AUTH",
  "token": "JWT_TOKEN"
}
```

### Subscribe to Events

```json
{
  "type": "SUBSCRIBE",
  "channels": ["rewards", "marketplace", "governance"]
}
```

### Event Types

**Reward Distributed**:
```json
{
  "type": "REWARD_DISTRIBUTED",
  "data": {
    "minerId": "uuid",
    "btcAmount": 0.00032,
    "date": "2024-12-10"
  }
}
```

**Marketplace Update**:
```json
{
  "type": "LISTING_CREATED",
  "data": {
    "listingId": "uuid",
    "minerId": "uuid",
    "price": 5500
  }
}
```

**Governance Update**:
```json
{
  "type": "PROPOSAL_CREATED",
  "data": {
    "proposalId": "uuid",
    "title": "..."
  }
}
```

---

## 📊 WEBHOOK ENDPOINTS (For Platform)

### Foundation Donations

**POST** `{YOUR_WEBHOOK_URL}`

Triggered when donation received.

**Payload**:
```json
{
  "event": "donation.received",
  "donationId": "uuid",
  "amount": 500,
  "currency": "USD",
  "source": "MARKETPLACE",
  "timestamp": "2024-12-10T00:00:00Z"
}
```

### Burn Events

**POST** `{YOUR_WEBHOOK_URL}`

Triggered on weekly burn.

**Payload**:
```json
{
  "event": "tokens.burned",
  "burnId": "uuid",
  "amountTYT": 125000,
  "usdValue": 6250,
  "txHash": "0x...",
  "timestamp": "2024-12-10T00:00:00Z"
}
```

---

## 🚀 SDK & LIBRARIES

### JavaScript/TypeScript

```bash
npm install @takeyourtoken/sdk
```

**Usage**:
```typescript
import { TYTClient } from '@takeyourtoken/sdk';

const client = new TYTClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production' // or 'sandbox'
});

// Get user miners
const miners = await client.miners.list();

// Purchase miner
const purchase = await client.miners.purchase({
  tier: 'ASIC_S19_XP',
  powerTH: 100,
  region: 'USA_DC_01'
});
```

### Python

```bash
pip install takeyourtoken
```

**Usage**:
```python
from takeyourtoken import TYTClient

client = TYTClient(api_key='YOUR_API_KEY')

# Get rewards
rewards = client.rewards.list(start_date='2024-01-01')

# Pay maintenance
payment = client.maintenance.pay(
    miner_id='uuid',
    days=30,
    method='TYT'
)
```

---

## 🧪 TESTING

### Sandbox Environment

**Base URL**: `https://sandbox-api.takeyourtoken.app/v1`

- Free test TYT tokens
- Fake BTC rewards (instant)
- No real blockchain transactions
- Reset data weekly

### Test Credentials

```
Email: test@takeyourtoken.app
Password: TestPass123!
```

### Test Wallet

```
Address: bc1qtest...
Private Key: (provided in sandbox dashboard)
```

---

**End of API Specification**

*For support, contact: api-support@takeyourtoken.app*
