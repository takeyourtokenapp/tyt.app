# Logo Usage Policy

## Overview

This document outlines the platform's policy for displaying cryptocurrency and third-party logos to ensure compliance with trademark and brand guidelines.

## Current Implementation

### ✅ Compliant Approach

The platform uses **Unicode symbols** and **generic icons** instead of official brand logos:

| Asset | Symbol Used | Type |
|-------|-------------|------|
| Bitcoin (BTC) | ₿ | Unicode character |
| Ethereum (ETH) | Ξ | Unicode character |
| Solana (SOL) | ◎ | Unicode character |
| Tron (TRX) | ⬣ | Unicode character |
| XRP | ✕ | Unicode character |
| TON | 💎 | Emoji |
| TYT | 🦉 | Emoji |
| USDT | ₮ | Unicode character |
| USDC | $ | Unicode character |

### Icons from lucide-react

The platform uses open-source icons from `lucide-react` library for generic representations:
- Bitcoin icon (generic cryptocurrency representation)
- Wallet, Zap, Globe, etc. (functional icons)

## Prohibited Practices

### ❌ Do NOT Use:

1. **External logo CDNs**:
   - ❌ `cryptologos.cc`
   - ❌ `coinmarketcap.com/static/img/coins/`
   - ❌ `coingecko.com/coins/images/`

2. **Official brand logos** without permission:
   - Binance logo
   - Coinbase logo
   - Ethereum Foundation logo
   - Solana Foundation logo
   - Any trademarked company logos

3. **Modified versions** of official logos

## Approved Alternatives

### 1. Unicode Symbols
Use standard Unicode cryptocurrency symbols that are part of the Unicode standard and not trademarked.

### 2. Generic Icon Libraries
- **lucide-react**: MIT licensed, safe for commercial use
- **heroicons**: MIT licensed
- **feather icons**: MIT licensed

### 3. Custom SVG Icons
Create original, non-derivative icon designs that:
- Don't mimic official brand designs
- Use generic geometric shapes
- Follow our design system colors

## Implementation Examples

### ✅ Correct Usage

```tsx
// Using Unicode symbol
<div className="coin-symbol">Ξ</div>

// Using lucide-react icon
import { Bitcoin } from 'lucide-react';
<Bitcoin className="text-orange-400" />

// Using first letter
<div className="asset-initial">{asset[0]}</div>
```

### ❌ Incorrect Usage

```tsx
// Don't use external logo URLs
<img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" />

// Don't use downloaded official logos
<img src="/logos/ethereum-official.svg" />
```

## Brand Guidelines Reference

When users need to identify cryptocurrencies, the platform relies on:

1. **Asset name** (e.g., "Bitcoin", "Ethereum")
2. **Asset symbol** (e.g., "BTC", "ETH")
3. **Unicode representation** (e.g., ₿, Ξ)
4. **Color coding** (consistent across platform)

## Color Associations

The platform uses these color associations for better UX without using logos:

- Bitcoin: Orange/Amber (`#F59E0B`)
- Ethereum: Blue (`#3B82F6`)
- Solana: Purple (`#8B5CF6`)
- BNB: Yellow (`#F59E0B`)
- XRP: Slate (`#64748B`)
- TON: Cyan (`#06B6D4`)
- TYT: Gold (`#D2A44C`)

## Compliance Checklist

Before adding any new asset representation:

- [ ] Check if Unicode symbol exists
- [ ] Verify no trademarked logos are used
- [ ] Confirm icon library license (MIT/Apache 2.0)
- [ ] Test visual clarity at small sizes
- [ ] Ensure accessibility (sufficient contrast)
- [ ] Document color choice in design system

## Updates and Maintenance

This policy should be reviewed:
- When adding new cryptocurrency support
- When third-party services update their brand guidelines
- Quarterly to ensure ongoing compliance

## Legal Considerations

### Fair Use
The platform's use of cryptocurrency names and symbols falls under fair use for:
- Descriptive purposes (identifying assets)
- Functional purposes (enabling transactions)
- Non-source-identifying uses

### Trademark Compliance
The platform avoids:
- Creating likelihood of confusion
- Suggesting endorsement or affiliation
- Using logos in promotional materials
- Modifying official brand assets

## Contact

For questions about logo usage:
- Review this policy first
- Consult with legal team before using any official logos
- When in doubt, use Unicode symbols or generic icons

---

**Last Updated**: December 24, 2025
**Version**: 1.0
**Status**: Active
