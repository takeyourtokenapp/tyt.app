# TYT Icon Components

Quick reference for using the TYT icon system.

## Import

```tsx
import TYTIcon, { NavbarIcon, DashboardIcon } from '@/components/icons';
```

## Examples

### Basic Usage

```tsx
<TYTIcon name="wallet" />
<TYTIcon name="mining" size="lg" />
<TYTIcon name="ai" pulse />
```

### In Navigation

```tsx
<NavbarIcon name="home" active={currentPage === 'home'} />
<NavbarIcon name="marketplace" />
```

### In Dashboard Cards

```tsx
<DashboardIcon name="staking" />
<DashboardIcon name="governance" />
```

### With Click Handlers

```tsx
<TYTIcon
  name="security"
  onClick={() => navigate('/app/kyc')}
  aria-label="Open security settings"
/>
```

## Available Icons

- `home` - Homepage/Dashboard
- `wallet` - Wallet/Balance
- `token` - TYT Token
- `marketplace` - NFT Marketplace
- `mining` - Miners/Mining
- `staking` - Staking Pools
- `governance` - DAO/Voting
- `ai` - AI/Automation
- `security` - Security/KYC
- `foundation` - Charity/Foundation

## States

- Default (opacity: 0.9)
- Hover (glow + lift)
- Active (strong glow + scale)
- Pulse (AI/Security icons)
- Disabled (grayscale)

## Sizes

- `sm` - 20px (compact menus)
- `md` - 24px (navbar, buttons) - **default**
- `lg` - 32px (cards, dashboard)
- `xl` - 48px (features, hero)
