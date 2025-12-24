# 🦉⚔️ TYT Icon System v1.0

## Overview

Complete Web3 icon system for takeyourtoken.app with cyberpunk aesthetic, CSS-based animations, and production-ready infrastructure.

---

## 🎯 Features

✅ **10 Core Navbar Icons** (home, wallet, token, marketplace, mining, staking, governance, ai, security, foundation)
✅ **CSS-based animations** (hover, active, pulse)
✅ **Design tokens** (gold palette, neon glows)
✅ **React component system** (TYTIcon, NavbarIcon, DashboardIcon)
✅ **SVG-first architecture** (vector-friendly, scalable)
✅ **Accessibility ready** (aria-labels, keyboard navigation, reduced motion)

---

## 📁 File Structure

```
/public/assets/icons/
  navbar/
    icon-home.svg
    icon-wallet.svg
    icon-token.svg
    icon-marketplace.svg
    icon-mining.svg
    icon-staking.svg
    icon-governance.svg
    icon-ai.svg
    icon-security.svg
    icon-foundation.svg

/src/styles/
  icon-system.css          # All icon animations & tokens

/src/components/icons/
  TYTIcon.tsx              # Main icon component
```

---

## 🚀 Usage

### Basic Icon

```tsx
import TYTIcon from '@/components/icons/TYTIcon';

<TYTIcon name="wallet" size="md" />
```

### Navbar Icon (Active State)

```tsx
import { NavbarIcon } from '@/components/icons/TYTIcon';

<NavbarIcon name="mining" active={isActive} />
```

### Dashboard Icon (Large)

```tsx
import { DashboardIcon } from '@/components/icons/TYTIcon';

<DashboardIcon name="staking" />
```

### Pulse Animation (AI/Security)

```tsx
<TYTIcon name="ai" pulse />
<TYTIcon name="security" pulse />
```

---

## 🎨 Design Tokens

### Colors

```css
--gold-500: #E6C15A;
--gold-600: #CFAE4C;
--neon-purple: #B88CFF;
--neon-blue: #7AD7FF;
```

### Sizes

- **sm**: 20×20px (menu items)
- **md**: 24×24px (buttons, navbar)
- **lg**: 32×32px (cards, dashboard)
- **xl**: 48×48px (feature blocks)

---

## ✨ Animations

### Hover Effect

```css
.tyt-icon:hover {
  filter:
    drop-shadow(0 0 6px rgba(180,140,255,.35))
    drop-shadow(0 0 12px rgba(120,200,255,.25));
  transform: translateY(-1px) scale(1.04);
}
```

### Active State (Selected)

```css
.tyt-icon--active {
  filter:
    drop-shadow(0 0 10px rgba(200,160,255,.7))
    drop-shadow(0 0 18px rgba(120,220,255,.45));
  transform: scale(1.06);
}
```

### Pulse Animation

```css
@keyframes tyt-icon-pulse {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(180,140,255,.35)); }
  50%      { filter: drop-shadow(0 0 14px rgba(200,160,255,.75)); }
}
```

---

## 🔧 Component API

### TYTIcon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | IconName | required | Icon identifier |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Icon size |
| `variant` | 'outline' \| 'solid' | 'outline' | Icon style |
| `active` | boolean | false | Active/selected state |
| `pulse` | boolean | false | Enable pulse animation |
| `disabled` | boolean | false | Disabled state |
| `className` | string | '' | Additional CSS classes |
| `aria-label` | string | - | Accessibility label |
| `onClick` | () => void | - | Click handler |

---

## 📋 Icon Inventory

| Icon | Usage | Notes |
|------|-------|-------|
| **home** | Homepage, dashboard link | Core navigation |
| **wallet** | Wallet page, balance displays | Multi-chain support |
| **token** | TYT token screens | Solana SPL token |
| **marketplace** | NFT miner marketplace | Trading interface |
| **mining** | My miners, mining stats | NFT miner cards |
| **staking** | Staking pools | Charity staking |
| **governance** | DAO, voting | veTYT system |
| **ai** | Automation, AI features | Use with pulse |
| **security** | KYC, 2FA, security settings | Use with pulse |
| **foundation** | Charity, brain cancer research | Heart-based design |

---

## 🎯 Next Steps (Future v2)

- [ ] Add dashboard-specific icons (20+ more)
- [ ] Create owl-themed custom SVGs (Midjourney/DALL·E)
- [ ] Add icon variants (filled, duotone)
- [ ] Implement icon sprite system (performance)
- [ ] Add animation presets (slide, bounce, rotate)
- [ ] Create icon documentation site

---

## 🔄 Migration from Lucide

### Before (Lucide Icons)

```tsx
import { Wallet } from 'lucide-react';

<Wallet className="w-6 h-6 text-gold-400" />
```

### After (TYT Icons)

```tsx
import TYTIcon from '@/components/icons/TYTIcon';

<TYTIcon name="wallet" size="md" />
```

---

## 🎨 Custom Icon Pipeline

### Step 1: Generate (AI)

Use Midjourney/DALL·E with the prompts from the specification:

```
Minimal flat cyberpunk web icon of a warrior owl helmet forming a shield,
central downward split sword with double vertical blade,
matte gold metal, subtle neon edge glow,
strict symmetry, strong silhouette,
vector-friendly, transparent background
```

### Step 2: Vectorize

- Import PNG to Illustrator/Inkscape
- Use Image Trace (expand to paths)
- Remove baked shadows/glows
- Simplify geometry

### Step 3: SVG Cleanup

```xml
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
  <!-- Paths here -->
</svg>
```

**Requirements:**
- `viewBox="0 0 24 24"`
- `stroke="currentColor"` or `fill="currentColor"`
- No `<filter>` elements (use CSS instead)
- Clean, minimal paths

### Step 4: Add to Repository

```bash
# Place SVG in correct folder
/public/assets/icons/navbar/icon-[name].svg

# Update TypeScript types
export type IconName = 'home' | 'wallet' | 'token' | ...;
```

---

## ♿ Accessibility

✅ **Semantic HTML**: Icons wrapped in `<span>` with proper roles
✅ **Aria Labels**: All icons support `aria-label` prop
✅ **Keyboard Navigation**: Clickable icons have `tabIndex={0}`
✅ **Reduced Motion**: Respects `prefers-reduced-motion`
✅ **Color Contrast**: Gold on dark meets WCAG AA standards

---

## 🎨 Design Philosophy

### Warrior Owl Motif

Every icon should subtly reference:
- **Helmet**: Protection, security
- **Split Sword**: Action, direction (vertical blade)
- **Gold Material**: Premium, value
- **Neon Glow**: Web3, cyberpunk aesthetic

### Readability First

Icons must be:
- **Recognizable** at 20×20px (navbar)
- **Distinct** from each other (no confusion)
- **Consistent** in stroke width (1.75px)
- **Symmetric** when possible (balance)

---

## 📦 Dependencies

- None (pure CSS + SVG)
- Optional: `lucide-react` (temporary fallback)

---

## 🔐 Security

- SVGs sanitized (no external scripts)
- No inline `<script>` tags allowed
- All animations via CSS (no JS injection)

---

## 📄 License

Part of TakeYourToken platform (proprietary)

---

**Status**: ✅ v1.0 Complete (Navbar Pack)
**Next Release**: v2.0 (Dashboard + Custom Owl Icons)
**Maintainer**: TYT Design Team
**Last Updated**: 2024-12-24
