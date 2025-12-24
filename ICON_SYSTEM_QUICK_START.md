# TYT Icon System - Quick Start

## What's Included

- **10 Navbar Icons** (SVG format)
- **CSS Animation System** (hover, active, pulse)
- **React Components** (TYTIcon, NavbarIcon, DashboardIcon)
- **Design Tokens** (colors, sizes, effects)

## File Structure

```
/public/assets/icons/navbar/     # 10 SVG icons
/src/styles/icon-system.css      # All animations
/src/components/icons/           # React components
/docs/ICON_SYSTEM_V1.md          # Full documentation
```

## Usage in 3 Steps

### 1. Import

```tsx
import { NavbarIcon } from '@/components/icons';
```

### 2. Use

```tsx
<NavbarIcon name="wallet" active={isActive} />
```

### 3. Done!

The icon will automatically have:
- Gold color with neon glow
- Hover animation (lift + glow)
- Active state styling
- Accessibility support

## Quick Examples

```tsx
// Navbar (24px)
<NavbarIcon name="mining" />

// Dashboard (32px)
<DashboardIcon name="staking" />

// With pulse animation
<TYTIcon name="ai" pulse />

// Custom size
<TYTIcon name="token" size="xl" />
```

## Available Icons

1. home
2. wallet
3. token
4. marketplace
5. mining
6. staking
7. governance
8. ai (use with pulse)
9. security (use with pulse)
10. foundation

## Next Steps

1. Replace lucide-react icons in Header.tsx
2. Add icons to AppLayout sidebar
3. Use in dashboard cards
4. Customize colors via CSS variables

For full documentation, see `/docs/ICON_SYSTEM_V1.md`
