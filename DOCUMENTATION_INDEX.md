# 📚 TYT Platform - Documentation Index

Complete guide to all project documentation.

**Last Updated**: January 1, 2026

---

## 🚀 Quick Start

**New to TYT?** Start here:

1. **Project Overview**: `README.md`
2. **Environment Setup**: `.env.example` + `docs/ENV_SETUP_GUIDE.md`
3. **Quick Start**: `docs/QUICK_START_PRODUCTION.md`
4. **Architecture**: `docs/ARCHITECTURE_IMPLEMENTATION.md`

---

## 📋 Documentation Categories

### 🔐 Security & Compliance

**Location**: Root directory

- **`SECURITY.md`** - Security guidelines and policies
- **`API_KEYS_SECURITY.md`** - API key management best practices
- **`SECURITY_AUDIT_2026-01-01.md`** - Latest security audit (Jan 1, 2026)
- **`SECURITY_AND_CLEANUP_SUMMARY.md`** - Security summary and status
- **`CLEANUP_REPORT_2026-01-01.md`** - Latest cleanup report

**Related Docs**:
- `docs/EMERGENCY_KEY_COMPROMISE.md` - Key compromise response
- `docs/SECURITY_HARDENING_GUIDE.md` - Security hardening
- `docs/SAFE_DOCUMENTATION_GUIDE.md` - Safe documentation practices
- `docs/ALCHEMY_KEY_ROTATION.md` - API key rotation

### 🎨 Design System

**Location**: Root + `/docs`

- **`DESIGN_SYSTEM_GUIDE.md`** - Design system overview
- **`HEADER_SYSTEM_VISUAL_GUIDE.md`** - Header system guide
- **`LOGO_USAGE_POLICY.md`** - Logo usage guidelines
- **`ORBITAL_COINS_SYSTEM.md`** - Animated coins system
- **`FLOATING_COINS_INTEGRATION.md`** - Floating coins integration
- **`UX_IMPROVEMENTS_QUICK_GUIDE.md`** - UX improvements

**Related Docs**:
- `docs/DESIGN_SYSTEM.md` - Detailed design system
- `docs/THEME_SYSTEM.md` - Theme system
- `docs/ICON_SYSTEM_V1.md` - Icon system
- `docs/ICON_SYSTEM_QUICK_START.md` - Icon quick start
- `src/components/icons/README.md` - Icon components

### 🌍 Internationalization (i18n)

**Location**: Root + `/docs`

- **`I18N_AUTO_DETECT_GUIDE.md`** - Auto language detection
- **`MULTILINGUAL_QUICKSTART.md`** - Quick start guide

**Related Docs**:
- `docs/MULTILINGUAL_GUIDE.md` - Detailed i18n guide
- `src/i18n/config.ts` - i18n configuration
- `src/locales/` - Translation files

### 🏗️ Foundation & Cross-Domain

**Location**: Root + `/docs`

- **`FOUNDATION_SYNC_GUIDE.md`** - Foundation synchronization
- **`EXECUTIVE_SUMMARY.md`** - Project executive summary

**Related Docs**:
- `docs/TYT_FOUNDATION_SYNC_GUIDE.md` - Detailed foundation sync
- `docs/TYT_FOUNDATION_LANDING_STRUCTURE.md` - Foundation landing page
- `docs/CROSS_DOMAIN_API_GATEWAY.md` - Cross-domain gateway
- `docs/COPY_TO_TYT_FOUNDATION.md` - Foundation copy guide

### 🔒 App Security & Deployment

**Location**: Root + `/docs`

- **`APP_DEPLOYMENT_QUICK_START.md`** - Deploy in 1-2 hours ⚡
- **`APP_SECURITY_COMPLETE_REPORT.md`** - Complete security audit
- **`docs/APP_SECURITY_DEPLOYMENT_GUIDE.md`** - Full security guide

**Related Docs**:
- All 33 app pages: `/src/pages/app/`
- Access control: `/src/components/AccessGuard.tsx`
- Auth context: `/src/contexts/AuthContext.tsx`

### 📧 Contact & Support System

**Location**: Root

- **`CONTACT_SYSTEM_GUIDE.md`** - Complete contact system implementation (44KB)
  - User contact form
  - Email + Telegram notifications
  - Admin message management
  - Database triggers
  - Edge Function setup

**Components**:
- Contact form: `/src/pages/Contact.tsx` (to be created)
- Admin panel: `/src/pages/app/AdminMessages.tsx` (to be created)
- Edge Function: `/supabase/functions/contact-notification/` (to be created)
- Database: `contact_submissions` table

### 📦 Smart Contracts & Blockchain

**Location**: `/contracts/evm` and `/contracts/solana`

#### EVM Contracts (Polygon/Ethereum)

**Main Documentation**:
- `contracts/evm/README.md` - Contracts overview
- `contracts/evm/README_DEPLOYMENT.md` - Deployment navigation hub

**Quick Start**:
- `contracts/evm/QUICKSTART.md` - Fastest start (30 min)
- `contracts/evm/QUICK_START_TESTNET.md` - Quick testnet deployment

**Testnet Deployment**:
- `contracts/evm/TESTNET_DEPLOYMENT_GUIDE.md` - Full testnet guide
- `contracts/evm/TESTNET_DEPLOYMENT_SUMMARY.md` - Testnet results
- `contracts/evm/PRE_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist

**Mainnet Deployment**:
- `contracts/evm/DEPLOYMENT_GUIDE.md` - General deployment
- `contracts/evm/DEPLOYMENT_GUIDE_V3.md` - V3 specific deployment
- `contracts/evm/DEPLOYMENT_VIDEO_SCRIPT.md` - Video tutorial script

**Technical Details**:
- `contracts/evm/MINERNFT_V3_IMPLEMENTATION.md` - MinerNFT implementation
- `contracts/evm/foundry.toml` - Foundry configuration
- `contracts/evm/src/` - Contract source code

#### Solana Contracts

- `contracts/solana/DEPLOYMENT_GUIDE.md` - Solana deployment
- `contracts/solana/tyt_academy_sbt/README.md` - Academy SBT program

### 🚀 Deployment & DevOps

**Location**: Root + `/docs`

- **`DEPLOYMENT_INSTRUCTIONS.md`** - Production deployment
- **Root `TESTNET_DEPLOYMENT_GUIDE.md`** removed (use contracts/evm version)

**Related Docs**:
- `docs/QUICK_START_PRODUCTION.md` - Production quick start
- `docs/ENV_SETUP_GUIDE.md` - Environment setup
- `.env.example` - Environment template

### 🤖 AOI (AI Guide) System

**Location**: `/docs/aoi`

**Main Hub**: `docs/aoi/README.md` - Navigation and overview

**Core Documentation**:
- `docs/aoi/AOI_QUICK_START.md` - Quick start
- `docs/aoi/AOI_CHARACTER_SPECIFICATION.md` - AOI personality
- `docs/aoi/AOI_API_SPECIFICATION.md` - API documentation
- `docs/aoi/AOI_INTEGRATION_GUIDE.md` - Integration guide

**Architecture**:
- `docs/aoi/AOI_FOUNDATION_FULL_ARCHITECTURE.md` - Full architecture
- `docs/aoi/AOI_PLATFORM_CONTROL.md` - Platform control
- `docs/aoi/AOI_UNIFIED_SUPPORT.md` - Unified support

**Integration**:
- `docs/aoi/AOI_FOUNDATION_BRIDGE.md` - Foundation integration
- `docs/aoi/AOI_HEADER_INTEGRATION.md` - Header integration
- `docs/aoi/AOI_COMPACT_WIDGET_INTEGRATION.md` - Widget integration

**Implementation**:
- `docs/aoi/AOI_IMPLEMENTATION_ROADMAP.md` - Roadmap
- `docs/aoi/AOI_QUICK_START_IMPLEMENTATION.md` - Implementation guide

### 📊 Architecture & Planning

**Location**: `/docs`

- **`docs/ROADMAP.md`** - Project roadmap
- **`docs/ARCHITECTURE_IMPLEMENTATION.md`** - Architecture overview
- **`docs/FEE_SYSTEM_INTEGRATION_GUIDE.md`** - Fee system
- **`docs/V3_TRANSITION_PLAN.md`** - V3 transition

**Related Docs**:
- `TYT_V3_REALWORLD_MASTER_ROADMAP.md` - Master roadmap (2.7k lines)
- `TYT_MAINNET_LAUNCH_ROADMAP.md` - Mainnet launch plan
- `docs/TYT_FULL_PROMPT_PACK_V6.md` - Full prompt pack
- `docs/AGENT_PROMPTS_V3.md` - Agent prompts

### 🔧 Development Guides

**Location**: `/docs`

- `docs/CODE_INTEGRITY_VERIFICATION.md` - Code integrity
- `docs/INDEX_USAGE_EXPLANATION.md` - Database indexes
- `docs/SUPABASE_AUTH_CONFIG_FIXES.md` - Auth configuration
- `src/components/README_HEADER_SYSTEM.md` - Header system component

---

## 📁 Archive

**Location**: `/docs/archive`

### Completed Features (2025)
**Location**: `/docs/archive/2025-completed`

Contains 16 completion documents from 2025:
- AOI implementation documents (6 files)
- Backend services (Block 2) documents (5 files)
- Cross-domain features (2 files)
- Deployment & sync (2 files)
- Project summary (1 file)

See: `docs/archive/2025-completed/README.md`

### Historical Reports (2025)
**Location**: `/docs/archive/reports-2025`

Contains historical reports and audits:
- Security audits and fixes
- Cleanup and optimization reports
- Repository cleanup documentation

See: `docs/archive/reports-2025/README.md`

---

## 🎯 Documentation by Role

### For New Developers

**Day 1**:
1. `README.md` - Project overview
2. `.env.example` - Setup environment
3. `docs/ENV_SETUP_GUIDE.md` - Configure environment
4. `docs/QUICK_START_PRODUCTION.md` - Run the app

**Week 1**:
5. `docs/ARCHITECTURE_IMPLEMENTATION.md` - Understand architecture
6. `DESIGN_SYSTEM_GUIDE.md` - Learn design system
7. `SECURITY.md` - Security guidelines
8. `contracts/evm/README.md` - Smart contracts

### For Frontend Developers

1. `DESIGN_SYSTEM_GUIDE.md` - Design system
2. `docs/THEME_SYSTEM.md` - Theming
3. `docs/ICON_SYSTEM_V1.md` - Icons
4. `I18N_AUTO_DETECT_GUIDE.md` - i18n
5. `src/components/icons/README.md` - Icon components
6. `docs/aoi/AOI_HEADER_INTEGRATION.md` - AOI integration

### For Backend Developers

1. `docs/ARCHITECTURE_IMPLEMENTATION.md` - Architecture
2. `docs/FEE_SYSTEM_INTEGRATION_GUIDE.md` - Fee system
3. `docs/CODE_INTEGRITY_VERIFICATION.md` - Code quality
4. `docs/INDEX_USAGE_EXPLANATION.md` - Database
5. `SECURITY.md` - Security
6. `API_KEYS_SECURITY.md` - API security

### For Smart Contract Developers

1. `contracts/evm/README.md` - Overview
2. `contracts/evm/README_DEPLOYMENT.md` - Deployment hub
3. `contracts/evm/QUICKSTART.md` - Quick start
4. `contracts/evm/MINERNFT_V3_IMPLEMENTATION.md` - Implementation
5. `contracts/evm/TESTNET_DEPLOYMENT_GUIDE.md` - Testing
6. `contracts/evm/DEPLOYMENT_GUIDE_V3.md` - Production

### For DevOps Engineers

1. `DEPLOYMENT_INSTRUCTIONS.md` - Deployment
2. `docs/QUICK_START_PRODUCTION.md` - Production setup
3. `SECURITY.md` - Security policies
4. `docs/EMERGENCY_KEY_COMPROMISE.md` - Incident response
5. `docs/ALCHEMY_KEY_ROTATION.md` - Key rotation
6. `.env.example` - Configuration

### For Product Managers

1. `EXECUTIVE_SUMMARY.md` - Executive summary
2. `TYT_V3_REALWORLD_MASTER_ROADMAP.md` - Master roadmap
3. `TYT_MAINNET_LAUNCH_ROADMAP.md` - Launch plan
4. `docs/ROADMAP.md` - Project roadmap
5. `docs/aoi/AOI_PLATFORM_CONTROL.md` - AOI features
6. `UX_IMPROVEMENTS_QUICK_GUIDE.md` - UX improvements

### For Designers

1. `DESIGN_SYSTEM_GUIDE.md` - Design system
2. `HEADER_SYSTEM_VISUAL_GUIDE.md` - Header design
3. `LOGO_USAGE_POLICY.md` - Logo guidelines
4. `ORBITAL_COINS_SYSTEM.md` - Animations
5. `docs/THEME_SYSTEM.md` - Theming
6. `docs/aoi/AOI_CHARACTER_SPECIFICATION.md` - AOI character

---

## 📊 Documentation Statistics

### Active Documentation
- **Root**: 17 files
- **docs/**: 23 files
- **docs/aoi/**: 12 files
- **contracts/evm/**: 10 files
- **contracts/solana/**: 2 files
- **Components**: 3 files
- **Total Active**: ~67 files

### Archived Documentation
- **Completed Features**: 16 files
- **Historical Reports**: 8 files
- **Total Archived**: 24 files

### Total Documentation: ~91 files

---

## 🔍 Finding Documentation

### By Topic

**Security**: Search for `SECURITY` in root and `/docs`
**Design**: Look in root for `DESIGN_`, `HEADER_`, `LOGO_`, `ORBITAL_`, `FLOATING_`
**Deployment**: Check `/contracts/evm/` and root `DEPLOYMENT_`
**i18n**: Look for `I18N_`, `MULTILINGUAL_` in root and `/docs`
**AOI**: All in `/docs/aoi/`
**Architecture**: Check `/docs/` for `ARCHITECTURE_`, `ROADMAP`, `V3_`

### By File Type

**Guides**: End with `_GUIDE.md` or `_QUICKSTART.md`
**Reports**: End with `_REPORT.md` or `_SUMMARY.md`
**Specifications**: End with `_SPECIFICATION.md`
**Implementation**: Contain `IMPLEMENTATION` or `INTEGRATION`

---

## 🆘 Getting Help

### Can't find what you need?

1. **Search**: Use `grep -r "keyword" docs/`
2. **This index**: Use Ctrl+F to search
3. **README files**: Check category README files
4. **Archive**: Might be in `/docs/archive/`

### Documentation Issues

- **Outdated?** Check dates in headers
- **Missing?** Might be in archive
- **Duplicate?** Use this index to find canonical version
- **Unclear?** See related docs section

---

## 📌 Document Status Legend

- ✅ **Active** - Current and maintained
- 📦 **Archived** - Historical reference only
- 🔄 **Updated** - Recently updated
- ⚠️ **Outdated** - May need updates

---

## 🔗 External Resources

- **Supabase**: https://supabase.com/docs
- **Foundry**: https://book.getfoundry.sh
- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com

---

**Maintained by**: Development Team
**Last Review**: January 1, 2026
**Next Review**: April 1, 2026
**Status**: ✅ Current and Complete

### 🎯 Production Deployment

**Location**: Root

- **`PRODUCTION_DEPLOYMENT_CHECKLIST.md`** - Complete deployment checklist (270 lines)
  - Security checklist
  - Deployment steps
  - Testing checklist
  - Post-deployment monitoring
- **`FEATURES_STATUS_SUMMARY.md`** - Complete features status (262 lines)
  - Production ready features (13)
  - Coming Soon features (16)
  - Development roadmap
  - Progress tracking

**Status**: ✅ Ready for Production Release
