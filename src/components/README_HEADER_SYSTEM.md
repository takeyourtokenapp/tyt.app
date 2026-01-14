# Header System Documentation

## Overview

TYT Platform now features a **dual-mode header system** that adapts based on the page context, inspired by the elegant design of tyt.foundation.

## Components

### 1. **AoiBadgePill.tsx** (New)
Beautiful aOi badge component with:
- Avatar image with online status indicator
- Animated hover effects
- Gradient glow on interaction
- Tooltip with "Ask me anything"
- Sparkle icon animation

**Usage:**
```tsx
import AoiBadgePill from './AoiBadgePill';

<AoiBadgePill
  level={4}
  onClick={() => openAoiChat()}
  showOnlineStatus={true}
/>
```

### 2. **Header.tsx** (Enhanced)
Smart header that switches between two modes:

#### Full Mode (Default)
- Complete navigation with dropdowns
- All platform sections accessible
- Gold theme styling
- Used on: Landing, Dashboard, most app pages

#### Compact Mode (Auto-activated)
- Minimal navigation (Academy, Foundation, Dashboard)
- Sleeker design with enhanced backdrop blur
- Gray theme styling similar to tyt.foundation
- Used on: `/app/foundation`, `/app/academy`

**Auto-detection:**
```tsx
const isCompactMode = variant === 'compact' ||
  location.pathname.startsWith('/app/foundation') ||
  location.pathname.startsWith('/app/academy');
```

**Manual control:**
```tsx
<Header variant="compact" />  // Force compact mode
<Header variant="full" />     // Force full mode
<Header />                    // Auto-detect based on route
```

### 3. **CompactHeader.tsx** (New)
Standalone compact header component:
- Can be used independently
- Perfect for tyt.foundation portal
- Minimal dependencies

## Design Features

### AoiBadgePill Design
```
┌─────────────────────────────────┐
│  ◉  aOi • AI Guide  ✨         │  ← Pill shape
│  │   │     │         │          │
│  │   │     │         └─ Sparkle (on hover)
│  │   │     └─ Secondary text
│  │   └─ Main text
│  └─ Avatar with green dot
└─────────────────────────────────┘
```

**Colors:**
- Background: `gray-800/60` with backdrop blur
- Border: `gray-700/50` → `cyan-500/50` on hover
- Online status: `green-400` with pulse animation
- Text: `gray-200` → `cyan-400` on hover

### Compact Mode Header
```
┌───────────────────────────────────────────────────────┐
│ 🦉 TYT     Academy  Foundation  [✨ aOi] 🌐 ☀️     │
│    Platform                                            │
└───────────────────────────────────────────────────────┘
```

**Features:**
- `backdrop-blur-xl` for frosted glass effect
- Border: `gray-800/50`
- Background: `gray-900/80`
- Matches tyt.foundation aesthetic

## When to Use Each Mode

### Use Full Mode:
- Landing page
- Marketing pages
- Dashboard with multiple options
- Complex navigation needed

### Use Compact Mode:
- Foundation pages (focus on mission)
- Academy pages (focus on learning)
- Minimal distraction needed
- Clean, professional look

## Integration Examples

### In AppLayout:
```tsx
// src/components/AppLayout.tsx
import Header from './Header';

function AppLayout({ children }) {
  return (
    <>
      <Header /> {/* Auto-detects based on route */}
      <main>{children}</main>
    </>
  );
}
```

### In PublicLayout:
```tsx
// src/components/PublicLayout.tsx
import Header from './Header';

function PublicLayout({ children }) {
  return (
    <>
      <Header variant="full" /> {/* Always full mode */}
      <main>{children}</main>
    </>
  );
}
```

### For tyt.foundation:
```tsx
// tyt.foundation/components/Layout.tsx
import CompactHeader from './CompactHeader';

function Layout({ children }) {
  return (
    <>
      <CompactHeader />
      <main>{children}</main>
    </>
  );
}
```

## Customization

### Modify aOi Badge:
```tsx
// Change online status color
<AoiBadgePill showOnlineStatus={false} />

// Different size
<AoiBadgePill className="scale-75" />

// Custom click handler
<AoiBadgePill onClick={handleCustomAction} />
```

### Force specific mode:
```tsx
// In specific pages that need override
<Header variant="compact" />
```

## Accessibility

All components include:
- `aria-label` attributes
- Keyboard navigation support
- Focus states
- Screen reader compatibility
- WCAG 2.1 AA compliant

## Performance

- Lazy loading not needed (small components)
- No external dependencies beyond lucide-react
- Optimized animations with CSS transforms
- Minimal re-renders with React hooks

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

## Future Enhancements

- [ ] Add notification badge to aOi pill
- [ ] Voice activation indicator
- [ ] Multi-language auto-detection
- [ ] Custom theme per domain
- [ ] Analytics tracking for header interactions

## Migration Notes

**From old header:**
- Old sparkles button → New AoiBadgePill ✅
- Maintains all functionality
- No breaking changes
- Backward compatible

**New features:**
- Auto-switching based on route
- Compact mode for focused pages
- Enhanced visual design
- Better mobile experience

## Questions?

See:
- `src/components/AoiBadgePill.tsx` - Badge component
- `src/components/CompactHeader.tsx` - Standalone compact header
- `src/components/Header.tsx` - Main smart header
- `docs/AOI_FOUNDATION_FULL_ARCHITECTURE.md` - Full system architecture
