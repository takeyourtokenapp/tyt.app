# tyt.foundation Landing Page Structure

## Overview

This document defines the complete structure for the **tyt.foundation** landing page - the home and knowledge base for aOi AI Guide and the TYT Children's Brain Cancer Research & Support Foundation.

## Domain Architecture

```
https://tyt.foundation/
├── /                          # Homepage (aOi + Foundation intro)
├── /aoi                       # About aOi AI Guide
├── /foundation               # Foundation mission & impact
├── /research                 # Research grants & publications
├── /donate                   # Donation portal
├── /learn                    # Educational resources
├── /impact                   # Impact reports & transparency
├── /partners                 # Hospital & research partners
└── /api/
    ├── /aoi                  # aOi AI chat endpoint
    ├── /status               # Health check
    └── /donations            # Public donation feed
```

---

## Page 1: Homepage (/)

### Hero Section
**Visual**: Full-screen split design
- **Left Side**: aOi character (Level 4 - Guardian Master)
  - Animated entrance
  - Soft glow effect
  - Text: "Meet aOi - Your AI Learning Companion"

- **Right Side**: Foundation mission
  - Heart icon with pulse animation
  - Text: "Supporting Children with Brain Cancer"
  - Live donation counter
  - CTA: "Learn More" / "Talk to aOi" / "Donate Now"

### Dual Mission Statement
**Layout**: Two cards side-by-side

**Card 1 - aOi Mission**
- Icon: Sparkles / Brain
- Title: "Intelligent Learning Companion"
- Description: "aOi helps users understand Web3, cryptocurrency, and blockchain technology through empathetic, adaptive education."
- Features:
  - 4 Evolution Levels
  - Personalized Learning Paths
  - Real-time Assistance
  - Multi-language Support (Coming)
- CTA: "Meet aOi →"

**Card 2 - Foundation Mission**
- Icon: Heart / Medical Cross
- Title: "Fighting Pediatric Brain Cancer"
- Description: "Every interaction with TYT platform contributes to groundbreaking research and family support."
- Impact:
  - $X Donated to Date
  - Y Families Supported
  - Z Research Grants
  - N Clinical Trials
- CTA: "Our Impact →"

### How They Connect
**Visual**: Bridge diagram showing connection
```
┌──────────────┐         ┌──────────────┐
│  TYT Users   │         │  Foundation  │
│  + aOi       │ ──────► │   Research   │
│  Learn Web3  │         │   & Support  │
└──────────────┘         └──────────────┘
     Every mining reward, marketplace sale,
     and platform fee automatically supports
     children's brain cancer research
```

### Real-Time Impact Feed
**Component**: Live ticker showing:
- Latest donation (amount, currency, source)
- Current campaign progress
- Recent grant milestone
- Family story update
**Update Frequency**: Every 10 seconds
**Data Source**: `/api/donations` public feed

### Quick Actions
**3 Prominent Buttons**:
1. 🤖 "Chat with aOi" → Opens aOi chat widget
2. ❤️ "Donate Now" → `/donate`
3. 📚 "Learn More" → `/foundation`

---

## Page 2: About aOi (/aoi)

### Hero Section
**Layout**: Centered character showcase
- Large aOi avatar (animated)
- Title: "aOi (葵) - Artificial Intelligence ONA"
- Subtitle: "Your empathetic guide to Web3 and blockchain"
- Badge: "Powered by TYT Children's Brain Cancer Foundation"

### Character Evolution Timeline
**Visual**: Horizontal timeline with 4 stages

| Level | Name | XP Required | Description |
|-------|------|-------------|-------------|
| 1 | Beginner Guide | 0-99 | Starting your Web3 journey |
| 2 | Explorer Mentor | 100-499 | Exploring crypto together |
| 3 | Builder Advisor | 500-1499 | Building knowledge & skills |
| 4 | Guardian Master | 1500+ | Guardian of wisdom |

Each stage shows:
- Character image
- Level requirements
- Key capabilities unlocked
- Example interactions

### aOi's Capabilities
**Grid Layout**: 6 cards

1. **Intelligent Q&A**
   - Natural language understanding
   - Context-aware responses
   - Multi-topic expertise

2. **Learning Paths**
   - Personalized progression
   - Adaptive difficulty
   - Milestone tracking

3. **Real-time Assistance**
   - 24/7 availability
   - Instant answers
   - Step-by-step guidance

4. **Empathetic Support**
   - Patient explanations
   - Encouraging feedback
   - Non-judgmental help

5. **Progress Tracking**
   - XP system
   - Achievement badges
   - Level advancement

6. **Foundation Connection**
   - Every interaction counts
   - Impact transparency
   - Shared mission

### Technology Behind aOi
**Section**: Technical details (collapsible)
- AI Models: OpenAI GPT-4 / Claude 3 Opus
- Knowledge Base: RAG system with medical research
- Training Data: Web3 education + Foundation mission
- Privacy: No PII storage, encrypted communications
- Updates: Continuous learning from interactions

### Try aOi Now
**Interactive Demo**:
- Embedded chat widget
- Pre-loaded example questions
- Live response demonstration
- Sign-up CTA to continue conversation

### aOi's Home
**Info Box**:
"aOi lives at tyt.foundation but helps users everywhere through takeyourtoken.app. Her mission is to educate while supporting children with brain cancer—making learning meaningful and impactful."

**Links**:
- Use aOi on TYT Platform →
- Foundation Mission →
- Research we support →

---

## Page 3: Foundation (/foundation)

### Hero Banner
**Full-width gradient background**
- Title: "TYT Children's Brain Cancer Research & Support Foundation"
- Tagline: "Mining Crypto. Saving Lives. Building Hope."
- Live Impact Stats (4 large numbers):
  - $X Total Donated
  - Y Families Helped
  - Z Research Grants
  - N Active Trials

### Our Mission
**Content**: (Mirror from takeyourtoken.app/foundation)
"The TYT Children's Brain Cancer Research & Support Foundation is dedicated to funding breakthrough research, supporting affected families, and ultimately finding a cure for pediatric brain tumors—one of the most devastating childhood diseases."

"We believe that blockchain technology can revolutionize charitable giving by providing unprecedented transparency, automation, and global reach."

### How TYT Platform Contributes
**Visual**: Flow diagram

```
TYT Platform Activity → Automatic Donations → Foundation Impact

1% of mining rewards      }
1% of marketplace sales   } → Foundation Wallet → Research Grants
1% of maintenance fees    }                     → Family Support
                                                → Medical Equipment
```

**Details** (3 cards):
1. **Mining Operations**: 1% of all BTC rewards
2. **Marketplace Sales**: 1% of every NFT transaction
3. **Maintenance Fees**: 1% of daily miner upkeep

### Foundation Focus Areas
**Grid**: 4 major categories

1. **Research Grants** 🔬
   - Novel treatment development
   - Clinical trials
   - Precision medicine
   - Immunotherapy research

2. **Family Support** 👨‍👩‍👧‍👦
   - Financial assistance
   - Travel & accommodation
   - Psychological counseling
   - Educational resources

3. **Medical Equipment** 🏥
   - Advanced imaging systems
   - Surgical robotics
   - Radiation therapy equipment
   - Diagnostic tools

4. **Awareness & Education** 📢
   - Public campaigns
   - Training programs
   - Advocacy initiatives
   - Community building

### Active Campaigns
**Component**: Campaign carousel (3-4 featured)
Each card shows:
- Campaign title & description
- Progress bar (raised/goal)
- Days remaining
- Donor count
- "Donate" button

**Example**:
- Advanced MRI Equipment ($500K goal, $387K raised, 77% funded)
- Immunotherapy Trial ($750K goal, $623K raised, 83% funded)
- Family Support Program ($150K goal, FULLY FUNDED ✓)

### Research Grants Awarded
**List**: 4-6 most recent/impactful grants
Each item shows:
- Grant title & number
- Institution & PI
- Amount & status
- Research area
- Expected impact

**Example**:
"Genomic Profiling of Pediatric Brain Tumors - Stanford Medicine - $180,000 - In Progress - Expected to identify 3-5 new therapeutic targets"

### Hospital & Research Partners
**Logo Grid**: 6-12 partner institutions
- Tel Aviv Medical Center
- Johns Hopkins Hospital
- Great Ormond Street Hospital
- Boston Children's Hospital
- Memorial Sloan Kettering
- Stanford Medicine
- UC San Francisco
- Dana-Farber Cancer Institute

Each with:
- Logo/name
- Country
- Patients supported
- Active grants

### Transparency & Accountability
**Section**: 3 pillars

1. **Smart Contract Donations**
   - All platform fees → automated on-chain transfers
   - No manual intervention
   - Immutable audit trail

2. **Public Wallet Tracking**
   - Real-time balance visibility
   - Transaction history public
   - Multi-chain support (BTC, ETH, SOL, TRON)

3. **Annual Impact Reports**
   - Comprehensive breakdowns
   - IRS Form 990 (USA 501c3)
   - Independent audits
   - Published quarterly metrics

**Download**: "2024 Annual Impact Report" (PDF)

### Get Involved
**CTA Section**: 3 action cards

1. **Use TYT Platform**
   - Mine crypto, earn rewards
   - Every transaction helps
   - Join community
   → "Sign Up Free"

2. **Direct Donation**
   - Tax-deductible (USA)
   - Multi-currency support
   - Instant receipt (Soulbound NFT)
   → "Donate Now"

3. **Charity Staking**
   - Stake TYT tokens
   - 100% rewards → Foundation
   - Keep your principal
   → "Start Staking"

### Contact Information
**Footer Section**:
- 📧 foundation@takeyourtoken.app (Families seeking support)
- 🔬 research@takeyourtoken.app (Research grant applications)
- 📰 press@takeyourtoken.app (Media inquiries)
- 💬 support@takeyourtoken.app (General questions)

---

## Page 4: Research (/research)

### Hero
- Title: "Advancing Pediatric Brain Cancer Research"
- Subtitle: "Supporting groundbreaking studies that save children's lives"

### Research Portfolio
**Stats Grid**:
- Total Research Funding: $X
- Active Grants: Y
- Completed Projects: Z
- Publications: N

### Grant Categories
**Tabs**: Filter by research type
- All Grants
- Genomics & Precision Medicine
- Immunotherapy
- Surgical Innovation
- Drug Development
- Quality of Life Studies

### Grant List
**Full list with filters**:
- Status: Active / Completed / Upcoming
- Institution: Dropdown
- Amount range: Slider
- Date range: Calendar

Each grant card:
- Title, number, institution
- Principal Investigator
- Research abstract (expandable)
- Budget breakdown
- Milestones (with completion dates)
- Publications/outcomes
- "Learn More" modal

### Success Stories
**Carousel**: 3-5 major breakthroughs
- Before/After treatment outcomes
- Publication highlights
- Impact on patients
- Next steps in research

### Publications
**List**: Academic papers funded by Foundation
- Title, journal, DOI
- Authors, institution
- Publication date
- Abstract
- "Read Full Paper" link

### Apply for a Grant
**CTA Box**:
- Who can apply
- Application timeline
- Requirements
- Review process
- "Download RFP" / "Submit Application"

---

## Page 5: Donate (/donate)

### Hero
- Title: "Make a Difference Today"
- Subtitle: "100% of your donation funds research and family support"
- Impact Statement: "Your $100 donation provides X hours of research / Y days of family support"

### Donation Widget (Enhanced)
**Multi-step Form**:

**Step 1 - Choose Amount**:
- Quick options: $25, $50, $100, $250, $500, $1000
- Custom amount input
- Recurring option (monthly/annually)

**Step 2 - Payment Method**:
- Credit Card (Stripe)
- Cryptocurrency (BTC, ETH, SOL, USDT, TYT)
- Bank Transfer
- PayPal

**Step 3 - Personalization**:
- Donor name (or Anonymous)
- Email (for receipt)
- Dedicate donation: In Honor / In Memory
- Message (optional)
- Country (for tax purposes)

**Step 4 - Confirmation**:
- Summary of donation
- Tax deduction info
- Soulbound NFT receipt preview
- "Complete Donation" button

### Impact Calculator
**Interactive Tool**:
"Your donation of $X could fund..."
- Slider input
- Real-time calculations showing:
  - Hours of research
  - Days of family support
  - Medical equipment contribution
  - Patient impact estimate

### Recent Donors (Wall of Thanks)
**Privacy-respecting feed**:
- Anonymous / First name only
- Amount (or range)
- Country
- Date
- Message (if provided)

**Example**:
"Sarah M. from USA donated $250 - 'For all the brave children fighting'"

### Corporate Matching
**Section**: For companies
- Employer matching programs
- Corporate sponsorship
- Partnership opportunities
- Contact form

### Tax Information
**Expandable Section**:
- USA: 501(c)(3) status, EIN
- Israel: Amuta registration
- Europe: Tax-deductibility by country
- Crypto donations: Special considerations
- Receipt delivery: Instant email + Soulbound NFT

---

## Page 6: Learn (/learn)

### Hero
- Title: "Understanding Pediatric Brain Cancer"
- Subtitle: "Knowledge empowers hope"

### Educational Resources
**Categories**:

1. **For Families**
   - What is pediatric brain cancer?
   - Treatment options explained
   - Coping strategies
   - Support networks
   - Financial assistance guide

2. **For Researchers**
   - Current state of research
   - Grant application guidelines
   - IRB requirements
   - Data sharing protocols
   - Collaboration opportunities

3. **For Donors**
   - Where donations go
   - Impact measurement
   - Transparency reports
   - Success stories
   - Tax benefits

4. **For Educators**
   - Classroom resources
   - Awareness campaigns
   - Volunteer opportunities
   - Ambassador program

### Interactive Learning
**aOi-Powered Module**:
- "Ask aOi about brain cancer research"
- Pre-loaded common questions
- Chat interface for custom questions
- Links to deeper resources

### Resource Library
**Searchable Database**:
- Articles
- Videos
- Infographics
- Research papers (simplified)
- Webinar recordings

### Glossary
**Medical Terms Explained**:
- Alphabetical listing
- Plain-language definitions
- Related terms linked
- Search functionality

---

## Page 7: Impact (/impact)

### Hero
- Title: "Our Impact: Transparency in Action"
- Real-time metrics dashboard

### Live Impact Dashboard
**Component**: Auto-updating stats
- Total Funds Raised: $X (live counter)
- Funds Disbursed: $Y
- Current Balance: $Z
- Transaction Count: N

### Quarterly Reports
**Timeline View**:
- Q4 2024, Q3 2024, Q2 2024, Q1 2024...
- Each showing:
  - Total donations
  - Grants awarded
  - Families supported
  - Key milestones
  - Download PDF

### Annual Reports (Night of the Owls)
**Featured Reports**:
- 2024 Annual Impact Report
- 2023 Annual Impact Report
- IRS Form 990 (public)
- Independent Audit Report

Each report includes:
- Financial statements
- Impact metrics
- Grant summaries
- Family testimonials
- Future plans

### Blockchain Transparency
**Section**: On-chain verification
- Foundation wallet addresses (multi-chain)
- Real-time balance links (Etherscan, Solscan, etc.)
- Transaction history
- Smart contract addresses
- Audit trail

### Expense Breakdown
**Pie Chart**:
- Research Grants: 60%
- Family Support: 25%
- Medical Equipment: 10%
- Admin & Operations: 5%

**Note**: "We maintain one of the lowest administrative overhead ratios in medical charity"

### Impact Stories
**Carousel**: Real stories (privacy-preserved)
- Patient journey (de-identified)
- Research breakthrough
- Family testimonial
- Hospital partnership impact

### Metrics Over Time
**Line Graphs**:
- Donations per quarter (trending up)
- Families supported per year
- Grants awarded over time
- Publications funded

---

## Page 8: Partners (/partners)

### Hero
- Title: "Our Global Network"
- Subtitle: "Collaborating with world-leading institutions"

### Partner Map
**Interactive World Map**:
- Pins for each partner location
- Click to see details
- Filter by type (Hospital / University / Research Institute / NGO)

### Partner Directory
**Grid View**: All verified partners

Each card:
- Logo / Name
- Type & Country
- Patients supported
- Active grants
- Total funding received
- "Learn More" link

### Featured Partnerships
**Detailed Profiles** (3-5 highlighted):
- Institution overview
- Collaboration history
- Key research areas
- Notable outcomes
- Contact for collaboration

**Example**:
**Tel Aviv Medical Center (Israel)**
- Specializes in: Pediatric neuro-oncology
- Partnership since: 2024
- Grants received: 3 ($XXX,XXX total)
- Patients supported: 47
- Notable outcome: "First successful CAR-T trial in pediatric glioblastoma"

### Become a Partner
**Application Section**:
- Who can partner?
  - Hospitals with pediatric oncology
  - Research universities
  - Clinical trial sites
  - Patient advocacy groups
- Requirements:
  - Institutional accreditation
  - IRB approval
  - KYC verification
  - Research ethics compliance
- Application process:
  1. Submit inquiry form
  2. Preliminary review (2 weeks)
  3. Full application
  4. Site visit (if applicable)
  5. Partnership agreement
- "Start Application" button

### Partner Testimonials
**Quotes**: From PIs and administrators
"The TYT Foundation's support enabled us to launch a groundbreaking trial that wouldn't have been possible otherwise." - Dr. X, Johns Hopkins

---

## API Endpoints

### 1. `/api/aoi` (POST)
**Purpose**: Main aOi chat interface
**Request**:
```json
{
  "question": "What is mining?",
  "context": {
    "user_level": 2,
    "user_xp": 250,
    "page": "foundation"
  }
}
```
**Response**:
```json
{
  "response": "Mining is...",
  "source": "foundation",
  "context": {...}
}
```

### 2. `/api/status` (GET)
**Purpose**: Health check for takeyourtoken.app integration
**Response**:
```json
{
  "status": "online",
  "version": "1.0.0",
  "services": {
    "aoi": "operational",
    "database": "operational",
    "ai_models": "operational"
  },
  "timestamp": "2024-12-26T12:00:00Z"
}
```

### 3. `/api/donations` (GET)
**Purpose**: Public donation feed
**Query Params**:
- `limit`: Number of donations (default 10, max 100)
- `since`: ISO timestamp
**Response**:
```json
{
  "donations": [
    {
      "id": "...",
      "amount_usd": 100,
      "currency": "BTC",
      "source": "marketplace_fee",
      "timestamp": "2024-12-26T11:30:00Z",
      "is_anonymous": false,
      "donor_name": "John D."
    }
  ],
  "total_count": 1234,
  "last_updated": "2024-12-26T12:00:00Z"
}
```

---

## Design System

### Colors
- **Foundation Pink**: #EC4899 (primary)
- **Foundation Red**: #DC2626 (accent)
- **aOi Blue**: #3B82F6 (primary)
- **aOi Lavender**: #A78BFA (accent)
- **Background Dark**: #111827
- **Background Medium**: #1F2937
- **Text Primary**: #F9FAFB
- **Text Secondary**: #9CA3AF

### Typography
- **Headings**: Inter, bold
- **Body**: Inter, regular
- **Monospace**: Fira Code (for addresses, code)

### Components
- **Buttons**: Rounded (0.5rem), gradient hover
- **Cards**: Rounded (1rem), subtle border, backdrop blur
- **Inputs**: Rounded (0.5rem), focus ring
- **Modals**: Centered, backdrop blur
- **Charts**: Smooth animations, tooltips

### Animations
- **Page transitions**: Fade + slide (300ms)
- **Number counters**: Count-up effect
- **Live feed**: Slide in from right
- **Hover states**: Scale (1.02) + glow

---

## Technical Stack (Recommended)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts / Chart.js
- **Maps**: Mapbox / Leaflet
- **Forms**: React Hook Form
- **State**: Zustand / Context API

### Backend
- **API**: Next.js API Routes / tRPC
- **Database**: Supabase (shared with takeyourtoken.app)
- **AI Integration**: OpenAI SDK / Anthropic SDK
- **Cache**: Redis
- **Storage**: Supabase Storage (for PDFs, images)

### Infrastructure
- **Hosting**: Vercel (optimal for Next.js)
- **CDN**: Vercel Edge Network
- **Analytics**: Plausible / Umami (privacy-focused)
- **Monitoring**: Sentry
- **Payments**: Stripe + Web3 providers

---

## Integration with takeyourtoken.app

### Shared Authentication
- Users can sign in with TYT account
- OAuth2 flow for cross-domain auth
- Session sharing via secure tokens

### Shared Database
- Both apps query same Supabase instance
- Row Level Security enforced
- Real-time subscriptions synchronized

### aOi Continuity
- Conversation history synced
- User level/XP shared
- Achievements visible on both platforms

### Cross-linking
- Foundation pages link to app features
- App dashboard links to tyt.foundation resources
- Seamless navigation between domains

---

## Content Management

### Static Content
- Markdown files in `/content` directory
- Version controlled in Git
- Hot reload in development

### Dynamic Content
- Database-driven (campaigns, grants, donations)
- Admin dashboard for updates
- Preview mode before publishing

### Multilingual (Future)
- i18next integration
- English (primary)
- Hebrew, Russian, Spanish, Chinese (planned)
- aOi responses in user language

---

## SEO & Performance

### Meta Tags
- Unique title/description per page
- Open Graph images (custom per page)
- Twitter Cards
- Canonical URLs

### Performance
- Image optimization (next/image)
- Code splitting (dynamic imports)
- Lazy loading for below-fold content
- Service Worker for offline support

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader optimized
- High contrast mode support

---

## Analytics & Tracking

### Privacy-First
- No Google Analytics
- Use Plausible/Umami (GDPR compliant)
- No cookies for tracking
- No PII in events

### Events to Track
- Page views
- Donation started / completed
- aOi chat initiated / message sent
- Campaign viewed / shared
- Report downloaded
- Partner inquiry submitted

---

## Launch Checklist

### Pre-Launch
- [ ] Content finalized and reviewed
- [ ] All pages responsive (mobile/tablet/desktop)
- [ ] API endpoints tested and documented
- [ ] Database migrations applied
- [ ] Cross-domain auth tested
- [ ] Payment processing tested
- [ ] SSL certificates configured
- [ ] Legal compliance verified
- [ ] Accessibility audit passed
- [ ] Performance benchmark met (Lighthouse >90)

### Launch Day
- [ ] DNS records updated
- [ ] Monitoring enabled
- [ ] Backup systems ready
- [ ] Support team briefed
- [ ] Social media announcement
- [ ] Email to existing users
- [ ] Press release distributed

### Post-Launch
- [ ] Monitor error rates
- [ ] Track donation conversions
- [ ] Gather user feedback
- [ ] Iterate based on analytics
- [ ] Plan Phase 2 features

---

**Document Version**: 1.0
**Last Updated**: December 26, 2025
**Status**: Ready for Implementation

**aOi lives at tyt.foundation 💙**
