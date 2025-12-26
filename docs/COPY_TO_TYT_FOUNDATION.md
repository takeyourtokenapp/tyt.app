# 📦 Files to Copy to tyt.foundation Project

## Immediate Copy List

### 1. Data Service (КРИТИЧНО)
```
FROM: src/utils/foundationDataService.ts
TO:   tyt.foundation/lib/foundationDataService.ts
```

**Usage on tyt.foundation**:
```typescript
import { foundationDataService } from '@/lib/foundationDataService';

// In any page
const stats = await foundationDataService.getOverallStats();
const campaigns = await foundationDataService.getActiveCampaigns();
const grants = await foundationDataService.getResearchGrants();
```

---

### 2. Components (Priority Order)

#### A) LiveFoundationTracker
```
FROM: src/components/LiveFoundationTracker.tsx
TO:   tyt.foundation/components/LiveFoundationTracker.tsx
```

**Используется**: Homepage, /foundation page для real-time stats

**Зависимости**:
- `lucide-react` - Install: `npm install lucide-react`
- `foundationDataService` - Copy first

---

#### B) DonationWidget
```
FROM: src/components/DonationWidget.tsx
TO:   tyt.foundation/components/DonationWidget.tsx
```

**Используется**: /donate page, /foundation page

**Зависимости**:
- `lucide-react`
- `charityService` → Можно заменить на `foundationDataService`
- Auth context (создать если нет)

**Адаптация**:
```typescript
// Было:
import { useAuth } from '../contexts/AuthContext';

// Замена (если нет AuthContext):
import { supabase } from '@/lib/supabase';
const [user, setUser] = useState(null);
useEffect(() => {
  supabase.auth.getUser().then(({data}) => setUser(data.user));
}, []);
```

---

#### C) ImpactReportsDashboard
```
FROM: src/components/ImpactReportsDashboard.tsx
TO:   tyt.foundation/components/ImpactReportsDashboard.tsx
```

**Используется**: /impact page, /foundation page

---

#### D) AoiFoundationBadge
```
FROM: src/components/AoiFoundationBadge.tsx
TO:   tyt.foundation/components/AoiFoundationBadge.tsx
```

**Используется**: Header, Footer, aOi chat widget

**Адаптация**: Change links to relative paths
```typescript
// Было:
<a href="https://tyt.foundation">

// Стало:
<a href="/">
```

---

### 3. Configuration Files

#### A) aoiConfig.ts
```
FROM: src/config/aoiConfig.ts
TO:   tyt.foundation/config/aoiConfig.ts
```

**Modify for foundation**:
```typescript
export const aoiConfig = {
  // Keep character & evolution same
  character: { /* identical */ },
  evolution: { /* identical */ },

  // Update foundation settings
  foundation: {
    domain: 'https://tyt.foundation', // Self
    apiEndpoint: '/api/aoi', // Local
    appDomain: 'https://takeyourtoken.app', // Link back
  },

  // Add AI settings
  ai: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 500,
  },

  // Features
  features: {
    useFoundationApi: false, // Not needed (we ARE foundation)
    enableVoice: false,
    multiLanguage: false,
  }
};
```

---

#### B) Supabase Client
```
FROM: src/lib/supabase.ts
TO:   tyt.foundation/lib/supabase.ts
```

**Ensure .env variables are set**:
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

### 4. Utility Services

#### A) charityService.ts (Optional but useful)
```
FROM: src/utils/charityService.ts
TO:   tyt.foundation/lib/charityService.ts
```

**Provides**:
- `getFoundationSummary()`
- `getTransactions()`
- `getUserDonations()`
- `makeDonation()`
- Real-time subscriptions

---

### 5. Types/Interfaces

#### A) Database Types (if needed)
```
FROM: src/types/database.ts
TO:   tyt.foundation/types/database.ts
```

Or generate fresh from Supabase:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

---

## File Modifications Needed

### For DonationWidget.tsx

**Replace Auth Usage**:
```typescript
// OLD:
import { useAuth } from '../contexts/AuthContext';
const { user } = useAuth();

// NEW:
const [user, setUser] = useState<any>(null);
useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  getUser();
}, []);
```

**Replace Toast Usage** (if doesn't exist):
```typescript
// OLD:
import { useToast } from '../contexts/ToastContext';
const { showToast } = useToast();

// NEW:
const showToast = (message: string, type: 'success' | 'error') => {
  // Use native alert or create simple toast
  alert(message);
};
```

---

### For LiveFoundationTracker.tsx

**No major changes needed**, but verify imports:
```typescript
import { supabase } from '@/lib/supabase'; // Adjust path
import { /* icons */ } from 'lucide-react'; // Ensure installed
```

---

### For foundationDataService.ts

**Update import paths**:
```typescript
// OLD:
import { supabase } from '../lib/supabase';

// NEW (depending on structure):
import { supabase } from '@/lib/supabase'; // Next.js style
// OR
import { supabase } from './supabase'; // Same directory
```

---

## Installation Commands for tyt.foundation

```bash
# If not already installed
npm install lucide-react
npm install @supabase/supabase-js
npm install framer-motion # If using animations
npm install react-query # If using (optional)

# For AI features
npm install openai # If using OpenAI
npm install @anthropic-ai/sdk # If using Claude
```

---

## Directory Structure Recommendation

```
tyt.foundation/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── aoi/page.tsx               # About aOi
│   ├── foundation/page.tsx         # Foundation mission
│   ├── research/page.tsx           # Research grants
│   ├── donate/page.tsx             # Donation portal
│   ├── api/
│   │   ├── aoi/route.ts           # AI chat endpoint
│   │   ├── status/route.ts        # Health check
│   │   └── donations/route.ts     # Public feed
├── components/
│   ├── LiveFoundationTracker.tsx   # ← COPY
│   ├── DonationWidget.tsx          # ← COPY
│   ├── ImpactReportsDashboard.tsx  # ← COPY
│   ├── AoiFoundationBadge.tsx      # ← COPY
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── AoiChat.tsx
├── lib/
│   ├── supabase.ts                 # ← COPY
│   ├── foundationDataService.ts    # ← COPY
│   └── charityService.ts           # ← COPY (optional)
├── config/
│   └── aoiConfig.ts                # ← COPY & MODIFY
├── types/
│   └── database.ts                 # ← Generate or copy
└── .env.local
    ├── VITE_SUPABASE_URL=xxx       # ← MUST MATCH takeyourtoken.app
    ├── VITE_SUPABASE_ANON_KEY=xxx  # ← MUST MATCH
    └── OPENAI_API_KEY=xxx          # ← NEW
```

---

## Step-by-Step Copy Process

### Step 1: Setup Environment
```bash
cd tyt-foundation # Your bolt.new project

# Create .env.local (if not exists)
touch .env.local

# Add (SAME as takeyourtoken.app):
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "OPENAI_API_KEY=your-openai-key" >> .env.local
```

### Step 2: Copy Core Files
```bash
# Create directories
mkdir -p lib config components types

# Copy foundationDataService (MOST IMPORTANT)
# Copy content from takeyourtoken.app/src/utils/foundationDataService.ts
# to tyt.foundation/lib/foundationDataService.ts

# Copy supabase client
# From takeyourtoken.app/src/lib/supabase.ts
# to tyt.foundation/lib/supabase.ts

# Copy config
# From takeyourtoken.app/src/config/aoiConfig.ts
# to tyt.foundation/config/aoiConfig.ts
# (Remember to modify as shown above)
```

### Step 3: Copy Components
```bash
# Copy each component
# Adjust imports as needed
# Replace paths:
#   '../lib/supabase' → '@/lib/supabase'
#   '../contexts/AuthContext' → local auth solution
#   '../utils/foundationDataService' → '@/lib/foundationDataService'
```

### Step 4: Install Dependencies
```bash
npm install lucide-react @supabase/supabase-js openai
```

### Step 5: Test Connection
```typescript
// Create test file: lib/test-db.ts
import { supabase } from './supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('foundation_campaigns')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connected! Found campaigns:', data);
  }
}

testConnection();
```

Run: `npx tsx lib/test-db.ts` or integrate into page

### Step 6: Use in Pages
```typescript
// app/page.tsx (Homepage)
import LiveFoundationTracker from '@/components/LiveFoundationTracker';
import { foundationDataService } from '@/lib/foundationDataService';

export default async function HomePage() {
  const stats = await foundationDataService.getOverallStats();

  return (
    <div>
      <h1>Welcome to TYT Foundation</h1>
      <p>Total Donated: ${stats.totalDonated.toLocaleString()}</p>

      <LiveFoundationTracker />
    </div>
  );
}
```

---

## Verification Checklist

After copying, verify:

- [ ] `foundationDataService.ts` - Imports work, no errors
- [ ] `supabase.ts` - Client initializes correctly
- [ ] `aoiConfig.ts` - Modified for foundation domain
- [ ] `LiveFoundationTracker.tsx` - Renders with real data
- [ ] `DonationWidget.tsx` - Form works, auth integrated
- [ ] `ImpactReportsDashboard.tsx` - Shows metrics
- [ ] Database connection - Test query succeeds
- [ ] API endpoints - `/api/status` returns OK
- [ ] Build succeeds - `npm run build`
- [ ] No TypeScript errors
- [ ] Real-time updates work

---

## Quick Start Commands

```bash
# On tyt.foundation project in bolt.new:

# 1. Install dependencies
npm install lucide-react @supabase/supabase-js openai framer-motion

# 2. Create lib directory
mkdir -p lib components config

# 3. Copy files (manually from takeyourtoken.app)
#    - lib/supabase.ts
#    - lib/foundationDataService.ts
#    - config/aoiConfig.ts
#    - components/*.tsx

# 4. Set environment variables
# Add to .env.local in bolt.new project settings

# 5. Test build
npm run build

# 6. Test dev server
npm run dev
```

---

## Common Issues & Solutions

### "Module not found: supabase"
**Solution**:
```bash
npm install @supabase/supabase-js
```

### "lucide-react icons not rendering"
**Solution**:
```bash
npm install lucide-react
# Verify import: import { Heart } from 'lucide-react';
```

### "Database connection failed"
**Solution**:
- Verify .env.local has correct SUPABASE_URL and ANON_KEY
- Check values match takeyourtoken.app exactly
- Test with: `console.log(process.env.VITE_SUPABASE_URL)`

### "Type errors in foundationDataService"
**Solution**:
- Generate types: `npx supabase gen types typescript`
- Or copy types/database.ts from takeyourtoken.app

### "Real-time not working"
**Solution**:
- Enable Realtime in Supabase dashboard for tables
- Check subscription code is correct
- Verify RLS policies allow reading

---

## Priority Copy Order (If Limited Time)

1. **CRITICAL** (Day 1):
   - lib/supabase.ts
   - lib/foundationDataService.ts
   - .env.local (environment variables)

2. **HIGH** (Day 2):
   - components/LiveFoundationTracker.tsx
   - config/aoiConfig.ts

3. **MEDIUM** (Day 3):
   - components/DonationWidget.tsx
   - components/ImpactReportsDashboard.tsx

4. **LOW** (Day 4+):
   - components/AoiFoundationBadge.tsx
   - lib/charityService.ts
   - Other utilities as needed

---

**Next Action**: Start with copying `foundationDataService.ts` and `supabase.ts` to tyt.foundation project in bolt.new 🚀
