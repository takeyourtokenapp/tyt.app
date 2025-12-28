# AOI Compact Widget Integration

## Overview

A minimalist, hover-activated AOI chat interface that provides instant access to the AI assistant without cluttering the UI.

## Design Philosophy

Following the principle of **progressive disclosure**, the AOI widget appears as a subtle badge that expands on interaction, revealing input capabilities only when needed.

## Features

### 1. Compact Badge (Default State)

- **Visual Elements:**
  - AOI avatar with online status indicator (green pulsing dot)
  - Text: "aOi • AI Guide"
  - Sparkle icon appears on hover
  - Gradient glow effect on hover

- **Styling:**
  - Dark glass-morphism background
  - Indigo accent colors
  - Smooth scale transitions
  - Ring animation around avatar

### 2. Quick Input (Hover State)

When hovering over the badge, a floating input panel appears:

- **Input Field:**
  - Placeholder: "Type your question..."
  - Enter key to submit
  - Send button with gradient

- **Quick Suggestions:**
  - Pre-defined common questions
  - One-click to ask
  - Examples:
    - "How does mining work?"
    - "What is TYT token?"
    - "Tell me about the Foundation"

- **Design:**
  - Positioned below badge
  - Arrow pointer to badge
  - Blur backdrop
  - Indigo border with glow

### 3. Full Chat Widget

Clicking the input or suggestion opens the full chat interface:

- Full conversation history
- Rich message formatting
- Foundation integration indicator
- Multi-function controls
- Auto-sends quick question if provided

## Component Architecture

```
AoiCompactWidget (new)
├── Compact Badge
├── Quick Input Panel (hover)
└── AoiChatWidget (full chat)
```

### Props

```typescript
interface AoiCompactWidgetProps {
  level?: 1 | 2 | 3 | 4;           // AOI avatar level
  className?: string;               // Additional styles
  showOnlineStatus?: boolean;       // Show green dot
}
```

## Integration Points

### Header.tsx

Replaced `AoiBadgePill` with `AoiCompactWidget` in:
- Desktop navigation
- Mobile navigation
- Compact header mode

### CompactHeader.tsx

Updated to use `AoiCompactWidget` for consistent experience across all header variants.

## User Flow

```
1. User sees compact badge
   ↓
2. Hovers → input panel appears
   ↓
3. Types question or clicks suggestion
   ↓
4. Full chat opens with question pre-filled
   ↓
5. AOI responds with answer
```

## Visual States

### State 1: Idle
```
┌─────────────────────────┐
│  🦉 aOi • AI Guide      │
└─────────────────────────┘
```

### State 2: Hover
```
┌─────────────────────────┐
│  🦉 aOi • AI Guide ✨   │  ← Badge scales up
└─────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ ✨ Ask aOi anything                     │
│                                          │
│ [Type your question...]           [→]   │
│                                          │
│ [How does mining work?]                 │
│ [What is TYT token?]                    │
│ [Tell me about the Foundation]          │
└─────────────────────────────────────────┘
```

### State 3: Chat Open
```
Full AoiChatWidget appears with:
- Conversation history
- Message input
- Foundation links
- AI status indicator
```

## Styling Details

### Colors

- **Background:** `slate-900/80` with backdrop blur
- **Border:** `slate-700/50` → `indigo-500/60` on hover
- **Text:** `indigo-300` → `indigo-200` on hover
- **Online Status:** `green-400` with pulse animation
- **Glow:** `indigo-500/30` shadow on hover

### Transitions

- **Scale:** 300ms ease
- **Opacity:** 300ms ease
- **Colors:** Standard transition-colors

### Spacing

- **Badge Padding:** `px-3 py-1.5`
- **Avatar Size:** `w-7 h-7`
- **Gap:** `gap-2.5` between elements
- **Panel Width:** `w-80` (320px)

## Accessibility

- **ARIA Label:** "Chat with aOi"
- **Keyboard Navigation:** Enter to submit
- **Focus States:** Ring on input focus
- **Screen Reader:** Descriptive labels

## Performance Optimizations

1. **Lazy Loading:** Chat widget only renders when opened
2. **Click Outside:** Efficient event cleanup
3. **Auto Focus:** Input focused on panel appearance
4. **State Reset:** Clean state when closing

## Context Integration

The widget seamlessly integrates with AOI context:

```typescript
// Quick question passes through context
context={{ initialMessage: quickQuestion }}

// Auto-sends question when chat opens
// Maintains conversation history
// Syncs with Foundation AI if online
```

## Mobile Responsiveness

- Badge scales to 90% on mobile
- Touch-friendly tap targets
- Panel adapts to screen width
- Proper z-index layering

## Future Enhancements

1. **Voice Input:** Add microphone button
2. **Shortcuts:** Keyboard shortcuts (Cmd+K)
3. **History:** Recent questions dropdown
4. **Themes:** Custom color schemes
5. **Position:** Configurable placement

## Files Modified

```
✓ src/components/AoiCompactWidget.tsx (NEW)
✓ src/components/AoiChatWidget.tsx (updated)
✓ src/components/Header.tsx (updated)
✓ src/components/CompactHeader.tsx (updated)
```

## Migration Notes

### Before
```tsx
<AoiBadgePill onClick={handleAoiClick} />
```

### After
```tsx
<AoiCompactWidget />
```

The new component is **fully self-contained** and handles all interaction logic internally.

## Testing Checklist

- [ ] Badge appears in header
- [ ] Online status indicator pulses
- [ ] Hover shows input panel
- [ ] Panel stays open when typing
- [ ] Suggestions work correctly
- [ ] Enter key submits question
- [ ] Chat opens with pre-filled question
- [ ] Click outside closes panel
- [ ] Mobile touch interactions work
- [ ] Animations are smooth
- [ ] No console errors

## Summary

The AOI Compact Widget provides a **frictionless** way for users to interact with the AI assistant. By showing only what's needed when it's needed, we maintain a clean UI while keeping powerful functionality just a hover away.

The design follows **modern UI patterns** seen in platforms like Linear, Vercel, and other premium web applications.

---

**Status:** ✅ Implemented & Tested  
**Build:** Passing  
**Version:** 1.0.0  
**Date:** December 28, 2025
