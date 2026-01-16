# 🎯 TYT Platform - Next Tasks (Add-Only)

**Date**: 2026-01-16
**Focus**: Gap Closure Without Refactoring
**Strategy**: Add missing features to match unified specification

---

## 📋 QUICK SUMMARY

**Current Status**: 85% Complete
**Missing**: Transparency UX, Contextual aOi, Orbital Badges, Enhanced Proof UI
**Approach**: Add new components and features WITHOUT breaking existing code

---

## 🔥 PHASE 1: CORE TRANSPARENCY (Priority: CRITICAL)

### Task 1.1: aOi Explain Button Integration
**Estimated**: 3 days
**Complexity**: Low
**Impact**: High (User Education)

#### Subtasks:
- [ ] **Create AoiExplainButton Component** (4 hours)
  - Reusable button with aOi avatar icon
  - Props: `topic`, `contextData`, `position`
  - Opens AoiChatWidget with pre-filled question
  - Hover shows mini tooltip

- [ ] **Integrate in Dashboard** (2 hours)
  - Add explain button next to: Total Hashrate, Daily BTC, VIP Level, Service Button
  - Context: Pass user's mining stats to aOi

- [ ] **Integrate in Wallet** (2 hours)
  - Add explain button next to: Each currency balance, Swap rate, Bridge fee
  - Context: Pass transaction details to aOi

- [ ] **Integrate in Miners** (2 hours)
  - Add explain button next to: Hashrate, Efficiency, Maintenance fee, Upgrade cost
  - Context: Pass miner details to aOi

- [ ] **Integrate in Rewards** (2 hours)
  - Add explain button next to: Reward calculation, Merkle proof, Discount breakdown
  - Context: Pass reward details to aOi

- [ ] **Integrate in Foundation** (1 hour)
  - Add explain button next to: Campaign progress, Impact metrics, Donation flow
  - Context: Pass foundation stats to aOi

- [ ] **Integrate in Academy** (1 hour)
  - Add explain button next to: XP calculation, Rank progression, Quest rewards
  - Context: Pass learning progress to aOi

**Files to Create**:
```
src/components/AoiExplainButton.tsx
src/hooks/useAoiExplain.ts
```

**Files to Modify**:
```
src/pages/app/Dashboard.tsx (add 4 buttons)
src/components/WalletBalances.tsx (add buttons per currency)
src/components/MinerCard.tsx (add 3 buttons)
src/components/RewardsSummaryWidget.tsx (add 2 buttons)
src/components/LiveFoundationTracker.tsx (add buttons)
src/components/XPProgressCard.tsx (add button)
```

**Acceptance Criteria**:
- ✅ Explain button visible on all key metrics
- ✅ Clicking button opens aOi chat with context
- ✅ aOi provides contextual explanation based on topic
- ✅ Button design matches existing UI
- ✅ No breaking changes to existing components

---

### Task 1.2: Foundation Reports & Ledger Proof Links
**Estimated**: 4 days
**Complexity**: Medium
**Impact**: High (Trust & Transparency)

#### Subtasks:
- [ ] **Create FoundationTransparencyDashboard** (8 hours)
  - Display all foundation accounts (charity_fund, academy_fund)
  - Show ledger entries filtered by foundation sources
  - Real-time balance updates
  - Transaction history with filters

- [ ] **Create FoundationBlockchainProof Component** (6 hours)
  - Display blockchain transaction for each donation
  - Add "View on Explorer" links (Etherscan, Solscan, etc.)
  - Show confirmation status
  - QR code for transaction hash

- [ ] **Add DonationBlockchainLink Component** (4 hours)
  - Inline link component for donation tx hashes
  - Auto-detect blockchain and use correct explorer
  - Copy-to-clipboard functionality
  - Verification badge (confirmed/pending)

- [ ] **Create Quarterly Report Generator** (8 hours)
  - Query ledger for foundation transactions by quarter
  - Generate PDF report with charts
  - Include: Total donations, Fee allocations, Campaign progress, Grant disbursements
  - Download button on Foundation page

- [ ] **Add Merkle Proof Links for Allocations** (4 hours)
  - Generate Merkle proof for each foundation allocation
  - Display proof in transparency dashboard
  - Link to on-chain Merkle root
  - Verification UI

**Files to Create**:
```
src/components/FoundationTransparencyDashboard.tsx
src/components/FoundationBlockchainProof.tsx
src/components/DonationBlockchainLink.tsx
src/utils/foundationProofs.ts
src/utils/reportGenerator.ts
```

**Files to Modify**:
```
src/pages/app/Foundation.tsx (add Transparency tab)
src/components/LiveFoundationTracker.tsx (add blockchain links)
src/components/ImpactReportsDashboard.tsx (add download button)
```

**Database Queries Needed**:
```sql
-- Get foundation ledger entries
SELECT * FROM ledger_entries
WHERE account_id IN (
  SELECT id FROM wallet_accounts
  WHERE account_type IN ('charity_fund', 'academy_fund')
)
ORDER BY created_at DESC;

-- Get donation transactions with blockchain details
SELECT
  fd.id,
  fd.tx_hash,
  fd.blockchain,
  fd.amount_usd,
  fd.asset,
  fd.created_at,
  fd.status
FROM foundation_donations fd
WHERE fd.status = 'completed'
ORDER BY fd.created_at DESC;
```

**Acceptance Criteria**:
- ✅ Transparency dashboard displays all foundation transactions
- ✅ Each donation has blockchain explorer link
- ✅ Quarterly reports downloadable as PDF
- ✅ Merkle proofs visible for fee allocations
- ✅ Real-time balance tracking
- ✅ No sensitive data exposed

---

### Task 1.3: Unified Fee Breakdown UI (60/30/10)
**Estimated**: 3 days
**Complexity**: Low
**Impact**: High (Trust)

#### Subtasks:
- [ ] **Create FeeBreakdownCard Component** (6 hours)
  - Display fee split: 60% Protocol, 30% Charity, 10% Academy
  - Visual pie chart (use Recharts or similar)
  - Tooltip with detailed explanation
  - Color coding: Blue (Protocol), Pink (Charity), Green (Academy)
  - Props: `totalFee`, `feeType` (deposit, swap, marketplace, maintenance)

- [ ] **Create FeeDistributionChart Component** (4 hours)
  - Interactive pie chart
  - Click segment to see details
  - Animation on load
  - Responsive design

- [ ] **Create MyFoundationContribution Widget** (6 hours)
  - Display user's total contribution to foundation
  - Breakdown by source: Deposits, Swaps, Marketplace, Maintenance
  - Timeline chart (monthly contributions)
  - "Share your impact" button (social media)

- [ ] **Integrate in Deposit Flow** (2 hours)
  - Show FeeBreakdownCard before confirming deposit
  - Highlight charity/academy portions
  - Add "Learn more about fee distribution" link to Foundation page

- [ ] **Integrate in Swap Flow** (2 hours)
  - Show FeeBreakdownCard in swap preview
  - Display exact USD value for each portion

- [ ] **Integrate in Marketplace** (2 hours)
  - Show FeeBreakdownCard on purchase confirmation
  - Include VIP discount visualization

- [ ] **Integrate in Maintenance Payment** (3 hours)
  - Show FeeBreakdownCard with all discounts
  - Display: Base cost → Discounts → Final cost → Fee split
  - Breakdown TYT burn separately

- [ ] **Add to Profile Page** (2 hours)
  - Add MyFoundationContribution widget
  - Show cumulative impact
  - Display badges for contribution milestones

**Files to Create**:
```
src/components/FeeBreakdownCard.tsx
src/components/FeeDistributionChart.tsx
src/components/MyFoundationContribution.tsx
src/hooks/useUserContributions.ts
```

**Files to Modify**:
```
src/components/wallet/WalletDeposit.tsx
src/components/wallet/WalletSwap.tsx
src/components/wallet/WalletWithdraw.tsx
src/components/MaintenancePaymentFlow.tsx
src/pages/app/Marketplace.tsx
src/pages/app/Profile.tsx
```

**API Needed**:
```typescript
// Calculate user's total foundation contribution
async function getUserFoundationContribution(userId: string) {
  const { data } = await supabase
    .from('ledger_entries')
    .select('credit, entry_type, created_at')
    .eq('account_id', /* charity_fund account */)
    .eq('ref_type', 'user_id')
    .eq('ref_id', userId);

  // Aggregate by source type
  return {
    total_usd: sum(data.credit),
    by_source: groupBy(data, 'entry_type'),
    timeline: groupByMonth(data)
  };
}
```

**Acceptance Criteria**:
- ✅ Fee breakdown visible on all payment flows
- ✅ 60/30/10 split clearly labeled
- ✅ Visual charts enhance understanding
- ✅ User can see their cumulative contribution
- ✅ All numbers match backend calculations
- ✅ Mobile responsive

---

### Task 1.4: Proof Verifier UI Enhancement
**Estimated**: 4 days
**Complexity**: Medium
**Impact**: High (Transparency)

#### Subtasks:
- [ ] **Create Enhanced MerkleProofViewer** (8 hours)
  - Visual tree representation (D3.js or similar)
  - Highlight verification path
  - Show root hash prominently
  - Step-by-step verification animation
  - Copy proof array button
  - Export proof as JSON button

- [ ] **Create ProofHistoryViewer Component** (6 hours)
  - Display all historical proofs for user
  - Filter by epoch, status (verified/pending)
  - Search by transaction ID
  - Pagination for large lists

- [ ] **Add QR Code Scanning** (4 hours)
  - Scan QR code to import proof
  - Validate proof format
  - Auto-fill verification form

- [ ] **Create ProofExportPanel** (4 hours)
  - Export formats: JSON, CSV, PDF
  - Include: Proof, Root, Leaf, Verification result
  - Shareable link generation

- [ ] **Integrate with RewardsMerkle Contract** (6 hours)
  - Connect to smart contract
  - Check on-chain root hash
  - Display contract verification status
  - Add "Claim on-chain" button if unclaimed

**Files to Create**:
```
src/components/proof/EnhancedMerkleProofViewer.tsx
src/components/proof/ProofHistoryViewer.tsx
src/components/proof/ProofQRScanner.tsx
src/components/proof/ProofExportPanel.tsx
src/utils/proofExport.ts
src/utils/proofImport.ts
```

**Files to Modify**:
```
src/components/MerkleProofViewer.tsx (enhance existing)
src/pages/app/Rewards.tsx (integrate new viewers)
```

**Smart Contract Integration**:
```typescript
// Check on-chain root and claim status
async function verifyProofOnChain(
  epoch: number,
  proof: string[],
  leafHash: string
) {
  const contract = new Contract(REWARDS_MERKLE_ADDRESS, ABI, provider);

  const root = await contract.getMerkleRoot(epoch);
  const hasClaimed = await contract.hasClaimed(userAddress, epoch);

  // Verify proof matches on-chain root
  const isValid = MerkleTree.verify(leafHash, proof, root, index);

  return { isValid, hasClaimed, root };
}
```

**Acceptance Criteria**:
- ✅ Visual tree representation of proof
- ✅ Step-by-step verification animation
- ✅ Export proof in multiple formats
- ✅ Import proof via QR code
- ✅ On-chain verification status displayed
- ✅ Historical proof lookup functional
- ✅ Integration with smart contract working

---

## 🎯 PHASE 2: ENGAGEMENT FEATURES (Priority: HIGH)

### Task 2.1: Orbital Badge/Events System
**Estimated**: 5 days
**Complexity**: Medium
**Impact**: High (Engagement)

#### Subtasks:
- [ ] **Design Orbital Achievement System** (4 hours)
  - Define badges: BTC Voyager, ETH Explorer, Solana Pioneer, Multi-Chain Master
  - Rarity tiers: Bronze (1 use), Silver (10 uses), Gold (50 uses), Platinum (100 uses)
  - Badge artwork/icons

- [ ] **Create Database Schema** (2 hours)
  - Table: `orbital_achievements`
    ```sql
    CREATE TABLE orbital_achievements (
      id uuid PRIMARY KEY,
      user_id uuid REFERENCES profiles(id),
      blockchain text NOT NULL,
      tier text CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
      transaction_count int DEFAULT 0,
      first_transaction_at timestamptz,
      last_transaction_at timestamptz,
      badge_unlocked_at timestamptz,
      created_at timestamptz DEFAULT now()
    );
    ```

- [ ] **Create OrbitalBadge Component** (6 hours)
  - Display badge with blockchain icon
  - Tier indicator (color coding)
  - Progress bar to next tier
  - Tooltip with stats

- [ ] **Create OrbitalBadgeGallery Component** (8 hours)
  - Grid layout of all badges
  - Locked vs unlocked states
  - Rarity indicators
  - "Share on social" buttons

- [ ] **Track Cross-Chain Transactions** (8 hours)
  - Listen to `blockchain_deposits`, `withdrawals` tables
  - Increment transaction count per blockchain
  - Trigger badge unlock when tier threshold reached
  - Send notification on unlock

- [ ] **Create Achievement Notification** (4 hours)
  - Toast notification with badge animation
  - Confetti effect on unlock
  - Sound effect (optional)

- [ ] **Integrate in Profile** (4 hours)
  - Add "Orbital Achievements" section
  - Display badge gallery
  - Show total transaction count per chain

**Files to Create**:
```
src/components/orbital/OrbitalBadge.tsx
src/components/orbital/OrbitalBadgeGallery.tsx
src/components/orbital/OrbitalAchievementNotification.tsx
src/utils/orbitalAchievements.ts
src/hooks/useOrbitalProgress.ts
supabase/migrations/YYYYMMDD_create_orbital_achievements.sql
```

**Files to Modify**:
```
src/pages/app/Profile.tsx (add badge gallery)
src/contexts/AuthContext.tsx (track achievements on mount)
```

**Tracking Logic**:
```typescript
// Track transaction and update achievements
async function trackOrbitalTransaction(
  userId: string,
  blockchain: string,
  transactionType: 'deposit' | 'withdrawal' | 'swap' | 'bridge'
) {
  // Increment transaction count
  const { data: achievement } = await supabase
    .from('orbital_achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('blockchain', blockchain)
    .maybeSingle();

  const newCount = (achievement?.transaction_count || 0) + 1;

  // Determine new tier
  const newTier = getTierForCount(newCount);
  const oldTier = achievement?.tier || 'none';

  // Update or insert
  await supabase.from('orbital_achievements').upsert({
    user_id: userId,
    blockchain,
    transaction_count: newCount,
    tier: newTier,
    badge_unlocked_at: newTier !== oldTier ? new Date() : achievement?.badge_unlocked_at,
    last_transaction_at: new Date()
  });

  // Notify if tier upgraded
  if (newTier !== oldTier && newTier !== 'none') {
    showAchievementNotification({
      blockchain,
      tier: newTier,
      badge: `${blockchain} ${newTier} Badge`
    });
  }
}

function getTierForCount(count: number): string {
  if (count >= 100) return 'platinum';
  if (count >= 50) return 'gold';
  if (count >= 10) return 'silver';
  if (count >= 1) return 'bronze';
  return 'none';
}
```

**Acceptance Criteria**:
- ✅ Badges unlock automatically on transaction count
- ✅ 4 tiers per blockchain (10 blockchains = 40 possible badges)
- ✅ Badge gallery displays locked/unlocked states
- ✅ Notifications show on unlock
- ✅ Profile displays orbital achievements
- ✅ Progress visible to next tier

---

### Task 2.2: Enhanced Academy Progression UI
**Estimated**: 5 days
**Complexity**: Medium
**Impact**: High (Learning Engagement)

#### Subtasks:
- [ ] **Create SkillTreeViewer Component** (10 hours)
  - Visual skill tree with nodes for each lesson
  - Prerequisite connections (lines between nodes)
  - Node states: Locked, Available, In Progress, Completed
  - Click node to view lesson details
  - Zoom/pan functionality
  - D3.js or React Flow for visualization

- [ ] **Create LearningPathRoadmap Component** (8 hours)
  - Linear roadmap view (alternative to skill tree)
  - Milestones for track completion
  - Estimated time to complete
  - Progress percentage per track

- [ ] **Create StreakTracker Component** (6 hours)
  - Display current streak (consecutive days with activity)
  - Calendar heatmap (GitHub-style)
  - Longest streak badge
  - Streak milestones (7, 30, 100, 365 days)
  - Notification when streak at risk

- [ ] **Create AchievementShareCard Component** (4 hours)
  - Generate social media shareable image
  - Include: Badge, XP earned, Rank, Username
  - Download as PNG
  - Pre-filled tweet/post text

- [ ] **Add "Next Recommended Lesson" Widget** (4 hours)
  - Algorithm: Based on current track, prerequisites, difficulty
  - Display on Dashboard and Academy home
  - "Start Learning" CTA button

- [ ] **Add Peer Comparison (Anonymous)** (6 hours)
  - Show user's rank percentile
  - Display average XP for user's tier
  - Comparison chart (user vs average)
  - Privacy: No identifiable data

**Files to Create**:
```
src/components/academy/SkillTreeViewer.tsx
src/components/academy/LearningPathRoadmap.tsx
src/components/academy/StreakTracker.tsx
src/components/academy/AchievementShareCard.tsx
src/components/academy/NextLessonWidget.tsx
src/components/academy/PeerComparisonChart.tsx
src/utils/streakCalculation.ts
src/utils/socialShareGenerator.ts
```

**Files to Modify**:
```
src/pages/app/Academy.tsx (add new visualizations)
src/pages/app/Dashboard.tsx (add next lesson widget)
src/pages/app/Profile.tsx (add streak tracker)
```

**Streak Calculation**:
```typescript
async function calculateStreak(userId: string) {
  const { data: interactions } = await supabase
    .from('aoi_interactions')
    .select('created_at')
    .eq('user_id', userId)
    .in('interaction_type', ['lesson_completed', 'quiz_submitted'])
    .order('created_at', { ascending: false });

  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate = new Date();

  for (const interaction of interactions) {
    const date = new Date(interaction.created_at);
    const diffDays = Math.floor((lastDate - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      break; // Streak broken
    }

    lastDate = date;
  }

  return { currentStreak, longestStreak };
}
```

**Acceptance Criteria**:
- ✅ Skill tree visualization functional
- ✅ Streak tracking accurate
- ✅ Next lesson recommendations relevant
- ✅ Achievement cards shareable
- ✅ Peer comparison anonymous
- ✅ All features mobile responsive

---

### Task 2.3: VIP Tier Progress Visualization
**Estimated**: 4 days
**Complexity**: Low
**Impact**: Medium (Retention)

#### Subtasks:
- [ ] **Create VIPProgressWidget Component** (8 hours)
  - Current tier badge
  - Progress bar to next tier
  - Requirements display: TYT balance, hashrate, voting power
  - ETA to next tier (based on current rate)
  - "How to upgrade" tips

- [ ] **Create VIPBenefitsComparison Component** (6 hours)
  - Table comparing all tier benefits
  - Highlight current tier
  - Show what user gains at next tier
  - Interactive: Click tier to see full benefits

- [ ] **Create VIPSavingsCalculator Component** (8 hours)
  - Input: Monthly maintenance cost
  - Calculate savings at each VIP tier
  - Show ROI on TYT purchase for tier upgrade
  - Annual savings projection
  - Break-even analysis

- [ ] **Integrate in Profile** (2 hours)
  - Add VIP section with progress widget

- [ ] **Integrate in VIP Page** (2 hours)
  - Replace static benefits table with interactive comparison
  - Add savings calculator

- [ ] **Add Tier Upgrade Notification** (2 hours)
  - Detect tier changes
  - Show celebration modal on upgrade
  - Display new benefits unlocked

**Files to Create**:
```
src/components/vip/VIPProgressWidget.tsx
src/components/vip/VIPBenefitsComparison.tsx
src/components/vip/VIPSavingsCalculator.tsx
src/components/vip/TierUpgradeNotification.tsx
src/utils/vipProgressCalculation.ts
```

**Files to Modify**:
```
src/pages/app/Profile.tsx (add VIP widget)
src/pages/VIP.tsx (replace with interactive components)
```

**Progress Calculation**:
```typescript
async function calculateVIPProgress(userId: string) {
  const profile = await getUserProfile(userId);
  const currentTier = profile.vip_level;
  const nextTier = currentTier + 1;

  if (nextTier > 5) return { isMaxTier: true };

  const requirements = VIP_REQUIREMENTS[nextTier];

  const progress = {
    tytBalance: {
      current: await getTYTBalance(userId),
      required: requirements.minTYTBalance,
      percentage: (current / required) * 100
    },
    hashrate: {
      current: profile.total_hashrate,
      required: requirements.minHashrate,
      percentage: (current / required) * 100
    },
    votingPower: {
      current: await getVotingPower(userId),
      required: requirements.minVotingPower,
      percentage: (current / required) * 100
    }
  };

  const overallProgress = Math.min(
    progress.tytBalance.percentage,
    progress.hashrate.percentage,
    progress.votingPower.percentage
  );

  return { currentTier, nextTier, progress, overallProgress };
}
```

**Acceptance Criteria**:
- ✅ Progress widget shows accurate data
- ✅ Benefits comparison interactive
- ✅ Savings calculator functional with realistic numbers
- ✅ Tier upgrade notifications working
- ✅ Mobile responsive

---

## 🔄 PHASE 3: UX POLISH (Priority: MEDIUM)

### Task 3.1: Real-Time Multi-Tab Sync Indicators
**Estimated**: 2 days
**Complexity**: Low
**Impact**: Medium (UX Polish)

#### Subtasks:
- [ ] **Create SyncStatusIndicator Component** (4 hours)
  - Icon in header: Green (synced), Yellow (syncing), Red (offline)
  - Tooltip: "X tabs open, synced 2s ago"
  - Pulse animation when syncing

- [ ] **Create useSyncStatus Hook** (6 hours)
  - Detect connection status
  - Count open tabs
  - Track last sync time
  - Handle reconnection logic

- [ ] **Add Toast Notifications for Multi-Tab Events** (4 hours)
  - Notify when: Balance updated in another tab, Miner purchased, Reward claimed
  - Option to dismiss or refresh

- [ ] **Add Offline Mode Detection** (4 hours)
  - Display banner when offline
  - Queue actions for when back online
  - Auto-retry failed requests

**Files to Create**:
```
src/components/SyncStatusIndicator.tsx
src/hooks/useSyncStatus.ts
src/utils/offlineQueue.ts
```

**Files to Modify**:
```
src/components/Header.tsx (add sync indicator)
src/contexts/ToastContext.tsx (add multi-tab toast types)
```

**Acceptance Criteria**:
- ✅ Sync status visible in header
- ✅ Multi-tab updates trigger notifications
- ✅ Offline mode detected and displayed
- ✅ Auto-reconnect functional

---

### Task 3.2: Cross-Domain Navigation Improvements
**Estimated**: 3 days
**Complexity**: Low
**Impact**: Medium (UX)

#### Subtasks:
- [ ] **Create CrossDomainNavigator Component** (6 hours)
  - "Continue to Foundation" button with aOi badge
  - "Return to App" button on tyt.foundation
  - Show last visited page
  - Deep linking support

- [ ] **Preserve User Context Across Domains** (8 hours)
  - Serialize user state to URL params (safe, non-sensitive data only)
  - Restore state on destination domain
  - Handle: aOi level, current page, action in progress

- [ ] **Add Navigation History Tracker** (4 hours)
  - Track cross-domain navigation
  - "Go back" button aware of domain boundaries
  - Breadcrumb trail

**Files to Create**:
```
src/components/CrossDomainNavigator.tsx
src/utils/crossDomainState.ts
src/hooks/useNavigationHistory.ts
```

**Files to Modify**:
```
src/components/Header.tsx (add domain switch button)
src/pages/app/Foundation.tsx (add "Visit Foundation Site" CTA)
```

**Acceptance Criteria**:
- ✅ Cross-domain navigation seamless
- ✅ User context preserved
- ✅ Deep linking functional
- ✅ Navigation history accurate

---

### Task 3.3: Maintenance Discount Optimizer
**Estimated**: 2 days
**Complexity**: Low
**Impact**: Medium (User Value)

#### Subtasks:
- [ ] **Create DiscountOptimizer Component** (8 hours)
  - Wizard UI: Step 1: Current costs, Step 2: Recommendations, Step 3: Actions
  - Calculate optimal prepay period
  - Calculate ROI on TYT purchase
  - Recommend VIP tier upgrade if close

- [ ] **Create DiscountSavingsComparison Component** (6 hours)
  - Side-by-side comparison: Current vs Optimized
  - Annual savings projection
  - Break-even timeline

- [ ] **Add Discount Expiry Reminders** (4 hours)
  - Notification 7 days before prepay discount expires
  - Notification when service button available
  - Email reminder option

**Files to Create**:
```
src/components/maintenance/DiscountOptimizer.tsx
src/components/maintenance/DiscountSavingsComparison.tsx
src/utils/discountOptimization.ts
```

**Files to Modify**:
```
src/pages/app/Miners.tsx (add optimizer link)
src/components/MinerCard.tsx (add "Optimize discounts" button)
```

**Acceptance Criteria**:
- ✅ Optimizer provides actionable recommendations
- ✅ Savings calculations accurate
- ✅ Reminders sent on time
- ✅ User can take action from optimizer

---

## 📊 IMPLEMENTATION CHECKLIST

### Before Starting Each Task:
- [ ] Read existing code in files to be modified
- [ ] Verify no breaking changes to existing functionality
- [ ] Check database schema compatibility
- [ ] Review component prop interfaces

### During Implementation:
- [ ] Follow existing code style and patterns
- [ ] Add TypeScript types for all new code
- [ ] Write inline comments for complex logic
- [ ] Test on mobile and desktop
- [ ] Verify accessibility (ARIA labels, keyboard navigation)

### After Completing Each Task:
- [ ] Run `npm run build` to ensure no errors
- [ ] Test all new features manually
- [ ] Verify no existing features broken
- [ ] Update documentation if needed
- [ ] Create pull request with clear description

---

## 🎯 SUCCESS METRICS

### Phase 1 (Transparency):
- User engagement with aOi explain buttons > 30% of users
- Foundation transparency dashboard views > 1000/month
- Fee breakdown understanding survey score > 4/5
- Proof verification usage > 20% of rewards claims

### Phase 2 (Engagement):
- Orbital badge unlocks > 50% of active users
- Academy streak > 7 days for > 15% of users
- VIP tier upgrades +20% after progress widget

### Phase 3 (UX Polish):
- Sync indicator reduces confusion support tickets by 30%
- Cross-domain navigation bounce rate < 10%
- Discount optimizer increases prepay adoption by 25%

---

## 🚀 DEPLOYMENT STRATEGY

### Phase 1: Deploy Incrementally
- Week 1: Task 1.1 (aOi Explain) → Deploy to production
- Week 2: Task 1.2 (Foundation Proofs) → Deploy to production
- Week 3: Task 1.3 (Fee Breakdown) → Deploy to production
- Week 4: Task 1.4 (Proof Verifier) → Deploy to production

### Phase 2: Bundle Release
- Deploy all 3 tasks together as "Engagement Update"
- Marketing push: Blog post, social media, email campaign

### Phase 3: Polish Release
- Deploy as "UX Improvements Update"
- Gather user feedback for further iterations

---

## 📝 NOTES

**No Refactoring Required**: All tasks are ADD-ONLY. Existing code remains functional.

**Database Migrations**: Only 1 new table needed (`orbital_achievements`). All other features use existing tables.

**External Dependencies**: Minimal. May need:
- Recharts (fee charts)
- D3.js (skill tree, proof tree)
- html2canvas (achievement share cards)

**Testing Priority**: Focus on Phase 1 tasks (transparency). These are most critical for user trust.

**Future Phases**: Tasks 11-13 (Marketplace, Social, Notarization) are roadmap features and not included in this sprint.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-16
**Status**: Ready for Implementation

**Estimated Total Time**: 14 days (2 sprints)
**Team Size**: 2-3 developers
**Complexity**: Low to Medium

**🎯 START WITH PHASE 1, TASK 1.1** - Highest impact, lowest complexity!
