# 🧠 aOi Foundation - Full Architecture & Integration Plan

**Date**: December 27, 2025
**Version**: 1.0
**Status**: Implementation Ready

---

## 📋 EXECUTIVE SUMMARY

**Vision**: aOi becomes the self-learning AI brain of the TYT ecosystem, bridging knowledge (tyt.foundation) and tools (takeyourtoken.app) while specializing in:
1. Pediatric CNS tumors research & education
2. Web3/Crypto/Blockchain mastery
3. Personalized user journey orchestration

**Domains Architecture**:
```
tyt.foundation                takeyourtoken.app
     |                              |
  KNOWLEDGE                      TOOLS
     |                              |
  ╔═══════════════════════════════════╗
  ║         aOi AI Brain              ║
  ║  - Learns from both domains       ║
  ║  - Routes users intelligently     ║
  ║  - Tracks progress universally    ║
  ╚═══════════════════════════════════╝
```

---

## 🏗️ ARCHITECTURE OVERVIEW

### 1. Three-Layer System

```
┌─────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Frontend)                  │
├─────────────────────────────────────────────────┤
│  tyt.foundation        │  takeyourtoken.app     │
│  - Knowledge Hub       │  - Academy             │
│  - Research Portal     │  - Wallet/Mining       │
│  - Student Paths       │  - DAO/Governance      │
└────────────┬───────────┴──────────┬─────────────┘
             │                      │
┌────────────▼──────────────────────▼─────────────┐
│  INTEGRATION LAYER (aOi Brain)                  │
├─────────────────────────────────────────────────┤
│  • User Context Manager                         │
│  • Knowledge Graph Engine                       │
│  • Learning Path Orchestrator                   │
│  • Cross-Domain Router                          │
│  • Progress Tracker                             │
│  • Security Gateway                             │
└────────────┬────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│  DATA LAYER (Supabase + External APIs)         │
├─────────────────────────────────────────────────┤
│  • User Profiles & Progress (Supabase)          │
│  • Knowledge Base (Vector DB)                   │
│  • CNS Research Data (External APIs)            │
│  • Web3 Analytics (Blockchain APIs)             │
│  • AI Training Data (Embeddings)                │
└─────────────────────────────────────────────────┘
```

---

## 🎯 DOMAIN SPECIFICATIONS

### A. tyt.foundation (NEW)

**Purpose**: Knowledge-first, research-focused entry point

#### Pages Structure:

**1. Landing Page** (`/`)
```typescript
Hero Section:
- "Understanding the Brain. Building the Future."
- Subtitle: "AI • Quantum • Web3 for Pediatric Neuro-Care"
- aOi Avatar: "Hi, I'm aOi. Let me guide you."

Three Pillars:
├─ 🧠 CNS Research
│  └─ Pediatric brain tumors, latest studies
├─ 📚 Education
│  └─ For students, researchers, families
└─ 🌐 Infrastructure
   └─ How Web3 funds breakthrough research

CTA Buttons:
- [Start Learning] → /knowledge
- [Research Portal] → /research
- [Go to Tools →] → takeyourtoken.app/app
```

**2. aOi Hub** (`/aoi`)
```typescript
Sections:
1. What is aOi?
   - "Your AI research companion & ecosystem navigator"
   - NOT a chatbot, medical advisor, or financial consultant
   - IS a learning orchestrator and progress tracker

2. How aOi Learns:
   - Medical Literature: PubMed, arXiv, clinical trials
   - Web3 Knowledge: Blockchain whitepapers, DeFi research
   - User Interactions: Anonymized learning patterns
   - Expert Curation: Verified by medical/crypto professionals

3. How aOi Helps You:
   ├─ Students → Explains complex topics simply
   ├─ Researchers → Surfaces relevant papers
   ├─ Investors → Connects impact to blockchain
   └─ Everyone → Tracks progress across both domains

4. Privacy & Ethics:
   - No medical diagnoses
   - No financial advice
   - No PHI (Protected Health Information)
   - Age-appropriate content filtering
   - Transparent AI decision logging
```

**3. Knowledge Hub** (`/knowledge`)
```typescript
Categories:
├─ /knowledge/brain-basics
│  ├─ How neurons work
│  ├─ Brain development in children
│  └─ Why CNS is special
│
├─ /knowledge/pediatric-tumors
│  ├─ Medulloblastoma
│  ├─ Ependymoma
│  ├─ Gliomas (low/high grade)
│  └─ Treatment challenges
│
├─ /knowledge/research-methods
│  ├─ Neuroimaging (MRI, PET, fMRI)
│  ├─ Genomics & Multi-omics
│  ├─ Clinical trials
│  └─ Data analysis basics
│
└─ /knowledge/web3-for-science
   ├─ Decentralized research funding
   ├─ Transparent grant distribution
   ├─ Data sovereignty
   └─ DAO governance for science

Each Topic:
- aOi adapts explanation based on user level (12yo vs PhD)
- Interactive visualizations
- Progress badges
- "Learn More on Academy →" links
```

**4. Learning Paths** (`/paths`)
```typescript
Personalized Tracks:

Path 1: Student Explorer (Ages 12-16)
├─ Week 1-2: Brain basics
├─ Week 3-4: What is cancer?
├─ Week 5-6: How research works
└─ Week 7-8: Introduction to blockchain
   → Transition to Academy (takeyourtoken.app)

Path 2: University Student (Ages 17-25)
├─ Month 1: Neuroscience fundamentals
├─ Month 2: CNS tumor biology
├─ Month 3: Data science for medicine
└─ Month 4: Web3 & DeFi
   → Advanced Academy Tracks

Path 3: Professional Researcher
├─ Instant access to full knowledge base
├─ Research collaboration tools
├─ Grant application resources
└─ Direct funding mechanisms

Path 4: Family & Supporter
├─ Understanding diagnosis (no medical advice)
├─ How research helps
├─ Ways to contribute
└─ Impact transparency

aOi Role:
- Personalizes content difficulty
- Suggests next steps
- Opens Academy access when ready
- Tracks achievements across domains
```

**5. Research Portal** (`/research`)
```typescript
For Partners, PIs, Universities:

Sections:
├─ Infrastructure
│  ├─ Compute Layer (Quantum/Cloud)
│  ├─ Data Layer (Secure storage)
│  ├─ Collaboration Tools
│  └─ Ethics & IRB compliance
│
├─ Funding Mechanisms
│  ├─ Foundation Allocation Dashboard
│  ├─ DAO Proposal Submission
│  ├─ Transparent Distribution
│  └─ Impact Reporting
│
├─ Publications & Whitepapers
│  ├─ TYT Technical Papers
│  ├─ Research Partnerships
│  └─ Open Science Initiatives
│
└─ Israeli Context
   ├─ Partnerships (Hadassah, Schneider, Sheba)
   ├─ Regulatory Compliance
   └─ Cultural Considerations

Integration:
- Direct links to takeyourtoken.app/foundation
- Live funding dashboard
- DAO voting interface (for verified researchers)
```

**6. Impact Page** (`/impact`)
```typescript
Unified with takeyourtoken.app/foundation:

Live Metrics:
├─ Total Funding Raised
├─ Active Research Projects
├─ Publications Funded
├─ Families Supported
└─ Student Scholars

Stories Section:
- Anonymized patient journeys
- Researcher testimonials
- Student success stories
- Donor impact reports

Blockchain Transparency:
- Real-time wallet balances
- Transaction explorer
- Quarterly reports (on-chain)
- DAO voting history
```

---

### B. takeyourtoken.app (EXISTING - Enhancements)

**New aOi Integrations:**

**1. Academy Enhancements** (`/app/academy`)
```typescript
// NEW: aOi Progress Sync
interface AcademyLesson {
  id: string;
  title: string;
  prerequisite_foundation_topics?: string[]; // Links to tyt.foundation
  unlocked_by_aoi: boolean; // aOi determines if user ready
  web3_skill_level: number; // 1-10
  cns_knowledge_required: boolean; // For advanced tracks
}

// NEW: Cross-Domain Completion
onLessonComplete(lessonId) {
  // 1. Mark complete in takeyourtoken.app DB
  // 2. Notify aOi Brain API
  // 3. aOi evaluates if user should get Foundation content
  // 4. Update unified progress bar
}
```

**2. Profile Page** (`/app/profile`)
```typescript
// NEW: Unified Progress Dashboard
Sections:
├─ Web3 Skills (Mining, DAO, Trading)
├─ Foundation Knowledge (CNS, Research Methods)
├─ Overall Level (Bronze → Silver → Gold → Platinum)
└─ aOi Recommendations
   - "You're ready for advanced genomics"
   - "Check out new DeFi lessons"
   - "Your research proposal is 80% complete"
```

**3. Foundation Page** (`/app/foundation`)
```typescript
// Enhanced with tyt.foundation content
New Tabs:
├─ Donations (existing)
├─ Research Projects (NEW - from tyt.foundation)
├─ Knowledge Base (NEW - iframe to tyt.foundation/knowledge)
└─ My Impact (NEW - personal contribution tracking)
```

---

## 🔗 API INTEGRATION LAYER

### aOi Brain API Specification

**Base URL**: `https://api.tyt.foundation/aoi/v1`

**Authentication**:
```typescript
// JWT token from either domain
Authorization: Bearer <user_jwt>
X-Domain: tyt.foundation | takeyourtoken.app
```

#### Core Endpoints:

**1. User Context**
```typescript
GET /user/context
Response: {
  user_id: string;
  current_domain: "foundation" | "app";
  levels: {
    web3_mastery: number; // 1-100
    cns_knowledge: number; // 1-100
    overall_rank: string; // "Student" | "Explorer" | "Researcher"
  };
  active_paths: string[];
  last_activity: timestamp;
  aoi_recommendations: string[];
}

POST /user/sync
Body: {
  event: "lesson_complete" | "quiz_passed" | "donation_made" | "research_read";
  domain: "foundation" | "app";
  data: object;
}
```

**2. Content Router**
```typescript
POST /route/next-content
Body: {
  user_id: string;
  current_topic: string;
  completed_items: string[];
}
Response: {
  recommended_content: {
    title: string;
    url: string;
    domain: "foundation" | "app";
    difficulty: number;
    estimated_time: string;
    why: string; // aOi explanation
  }[];
}
```

**3. Knowledge Graph**
```typescript
POST /knowledge/query
Body: {
  query: string; // Natural language question
  user_level: number;
  domain_context?: "cns" | "web3" | "both";
}
Response: {
  answer: string; // Simplified explanation
  confidence: number;
  sources: {
    title: string;
    url: string;
    credibility_score: number;
  }[];
  related_topics: string[];
  next_steps: string[];
}
```

**4. Learning Path**
```typescript
GET /path/current
Response: {
  path_id: string;
  path_name: string;
  progress: number; // 0-100
  current_step: {
    title: string;
    content_url: string;
    domain: "foundation" | "app";
  };
  next_steps: [...];
  estimated_completion: string;
}

POST /path/customize
Body: {
  goals: string[];
  time_commitment: "casual" | "regular" | "intensive";
  interests: string[];
}
```

**5. Progress Sync**
```typescript
POST /progress/sync
Body: {
  events: [
    {
      timestamp: string;
      domain: "foundation" | "app";
      type: "lesson" | "quiz" | "donation" | "research" | "mining" | "dao_vote";
      item_id: string;
      result: object;
    }
  ];
}

GET /progress/unified
Response: {
  total_xp: number;
  levels: {...};
  achievements: [...];
  cross_domain_milestones: [
    {
      title: "First Bridge Crossed";
      description: "Completed Foundation lesson and Academy lesson on same topic";
      unlocked_at: timestamp;
    }
  ];
}
```

**6. AI Training Feedback**
```typescript
POST /training/feedback
Body: {
  interaction_id: string;
  was_helpful: boolean;
  correction?: string;
  context: object;
}
// Used to improve aOi's responses
```

---

## 🧠 aOi SELF-LEARNING SYSTEM

### Training Data Sources

**1. Medical/CNS Knowledge**
```typescript
Data Pipelines:
├─ PubMed API → Weekly digest of pediatric CNS papers
├─ ClinicalTrials.gov → Ongoing trial updates
├─ arXiv → Computational biology papers
├─ NIH Datasets → Publicly available genomic data
├─ Expert Curations → Reviewed by medical advisors
└─ User Questions → What students ask most

Processing:
- Embeddings generation (OpenAI text-embedding-3)
- Vector storage (Supabase pgvector)
- Knowledge graph construction
- Age-appropriate content tagging
- Credibility scoring
```

**2. Web3/Crypto Knowledge**
```typescript
Data Pipelines:
├─ Blockchain News (CoinDesk, Decrypt)
├─ DeFi Whitepapers (Uniswap, Aave, Curve)
├─ On-chain Analytics (Dune, Nansen)
├─ Smart Contract Audits (OpenZeppelin, Trail of Bits)
├─ DAO Governance (Snapshot, Tally)
└─ User Transactions → Privacy-preserving analysis

Processing:
- Smart contract pattern recognition
- Risk assessment models
- Market sentiment analysis
- Security best practices DB
```

**3. User Interaction Learning**
```typescript
Anonymized Metrics:
├─ Content difficulty ratings
├─ Time spent on topics
├─ Question patterns
├─ Navigation paths
├─ Drop-off points
└─ Success indicators

Privacy:
- No PII storage
- Aggregated patterns only
- Opt-out available
- GDPR/COPPA compliant
```

### Training Loop

```typescript
Weekly Cycle:
1. Data Collection (Mon-Sun)
   ├─ Scrape new research papers
   ├─ Monitor blockchain events
   └─ Aggregate user interactions

2. Processing (Sunday night)
   ├─ Generate embeddings
   ├─ Update knowledge graph
   ├─ Retrain recommendation models
   └─ A/B test new response strategies

3. Validation (Monday morning)
   ├─ Expert review of medical content
   ├─ Security check of Web3 advice
   └─ Bias/safety testing

4. Deployment (Monday afternoon)
   ├─ Roll out to 10% users (canary)
   ├─ Monitor error rates
   └─ Full deployment if healthy

5. Feedback (Continuous)
   ├─ User ratings
   ├─ Correction submissions
   └─ Edge case logging
```

### AI Model Architecture

```typescript
aOi Brain Composition:

1. Retrieval-Augmented Generation (RAG)
   - Base Model: GPT-4 / Claude 3.5 Sonnet
   - Custom Fine-tuning: CNS + Web3 corpus
   - Vector DB: pgvector (Supabase)

2. Specialized Modules:
   ├─ Medical Explainer
   │  - Simplifies research papers
   │  - Age-appropriate language
   │  - No diagnosis/treatment advice
   │
   ├─ Web3 Tutor
   │  - Explains DeFi concepts
   │  - Security warnings
   │  - No financial advice
   │
   ├─ Progress Analyzer
   │  - Personalized recommendations
   │  - Identifies knowledge gaps
   │  - Suggests next steps
   │
   └─ Safety Filter
      - Content appropriateness
      - Medical disclaimer injection
      - Scam detection (Web3)
      - PII scrubbing

3. Decision Engine:
   - Reinforcement Learning from Human Feedback (RLHF)
   - Multi-armed bandit for content routing
   - Graph Neural Network for knowledge graph
```

---

## 🔐 SECURITY & PRIVACY

### Data Governance

**1. User Data Classification**
```typescript
Tier 1 - Public:
- Display name
- Public achievements
- Anonymized contributions

Tier 2 - Private:
- Email (hashed)
- Progress history
- Learning preferences
- Encrypted at rest

Tier 3 - Sensitive:
- Wallet addresses (hashed)
- Transaction history (aggregated only)
- NO medical information
- NO financial holdings

Compliance:
- GDPR (Right to be forgotten)
- COPPA (Parental consent for <13)
- HIPAA awareness (no PHI stored)
- Israeli Privacy Protection Law
```

**2. AI Safety**
```typescript
Guardrails:
├─ Medical Content
│  ├─ NO diagnoses or treatment advice
│  ├─ Always show: "Consult healthcare professional"
│  └─ Flag emergency language → suggest 911/100
│
├─ Financial Content
│  ├─ NO investment recommendations
│  ├─ Always show: "Not financial advice"
│  └─ Warn about scams/rug pulls
│
├─ Age Protection
│  ├─ Profanity filter
│  ├─ Graphic content blocking
│  └─ Parental controls
│
└─ Bias Mitigation
   ├─ Regular fairness audits
   ├─ Multi-cultural review
   └─ Accessibility standards
```

**3. Cross-Domain Security**
```typescript
API Authentication:
- JWT tokens (15min expiry)
- Refresh tokens (7 days)
- Rate limiting (100 req/min/user)
- DDoS protection (Cloudflare)

Data Transit:
- TLS 1.3 encryption
- Certificate pinning
- CORS policies
- CSP headers

Supabase RLS:
- Row-level security on all tables
- User can only access own data
- Admin actions logged
- Automatic backups
```

---

## 📊 DATABASE SCHEMA EXTENSIONS

### New Supabase Tables

```sql
-- aOi User Context (shared across domains)
CREATE TABLE aoi_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,

  -- Cross-domain progress
  web3_mastery_level INTEGER DEFAULT 0, -- 0-100
  cns_knowledge_level INTEGER DEFAULT 0, -- 0-100
  overall_rank TEXT DEFAULT 'Student', -- Student, Explorer, Researcher, Expert

  -- Learning path
  active_path_id UUID,
  path_progress JSONB DEFAULT '{}',

  -- Preferences
  preferred_domain TEXT DEFAULT 'app', -- foundation or app
  learning_pace TEXT DEFAULT 'regular', -- casual, regular, intensive
  interests TEXT[] DEFAULT '{}',

  -- aOi personalization
  aoi_context JSONB DEFAULT '{}', -- AI's understanding of user
  last_interaction_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-domain activity log
CREATE TABLE aoi_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,

  domain TEXT NOT NULL, -- 'foundation' or 'app'
  activity_type TEXT NOT NULL, -- 'lesson', 'quiz', 'donation', 'mining', etc.
  item_id TEXT,
  item_title TEXT,

  result JSONB, -- Detailed results
  xp_earned INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON aoi_activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_type ON aoi_activity_log(activity_type);

-- Knowledge graph
CREATE TABLE aoi_knowledge_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  topic_id TEXT UNIQUE NOT NULL,
  topic_name TEXT NOT NULL,
  domain TEXT NOT NULL, -- 'cns', 'web3', 'both'

  content_summary TEXT,
  difficulty_level INTEGER, -- 1-10
  prerequisites TEXT[] DEFAULT '{}', -- Other topic_ids

  -- Vector embeddings for semantic search
  embedding VECTOR(1536),

  sources JSONB, -- Array of credible sources
  last_updated TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_embedding ON aoi_knowledge_graph USING ivfflat (embedding vector_cosine_ops);

-- Learning paths
CREATE TABLE aoi_learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  description TEXT,
  target_audience TEXT, -- 'student', 'researcher', 'investor'
  estimated_duration TEXT, -- '8 weeks', '3 months'

  steps JSONB NOT NULL, -- Array of steps with domain routing

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User path progress
CREATE TABLE aoi_user_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  path_id UUID REFERENCES aoi_learning_paths NOT NULL,

  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',

  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  UNIQUE(user_id, path_id)
);

-- AI training feedback
CREATE TABLE aoi_training_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  interaction_id TEXT, -- Trace ID
  user_id UUID REFERENCES auth.users,

  query TEXT,
  response TEXT,
  was_helpful BOOLEAN,
  correction TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE aoi_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON aoi_user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON aoi_user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE aoi_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON aoi_activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity" ON aoi_activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## 🚀 DEPLOYMENT PLAN

### Phase 1: Foundation (Weeks 1-2)

**Week 1: Infrastructure**
```bash
# 1. Domain setup
- Register tyt.foundation (if not done)
- Configure DNS (Cloudflare)
- SSL certificates
- CDN setup

# 2. Hosting
- Vercel/Netlify for frontend
- Supabase extensions (pgvector)
- Edge functions for API

# 3. Database
- Run migration scripts (new aOi tables)
- Seed initial knowledge graph
- Setup backups
```

**Week 2: Core Pages**
```bash
# Build tyt.foundation frontend
- Landing page
- aOi hub page
- Knowledge hub (basic structure)
- Research portal (static for now)
```

### Phase 2: API Integration (Weeks 3-4)

**Week 3: aOi Brain API**
```bash
# Supabase Edge Functions
- /aoi/v1/user/context
- /aoi/v1/route/next-content
- /aoi/v1/progress/sync

# Authentication bridge
- Share JWT between domains
- CORS configuration
- Rate limiting
```

**Week 4: takeyourtoken.app Enhancements**
```bash
# Update existing app
- Integrate aOi API calls
- Add Foundation links in Academy
- Unified progress dashboard
- Cross-domain navigation
```

### Phase 3: AI Features (Weeks 5-6)

**Week 5: Knowledge Graph**
```bash
# Data pipelines
- PubMed scraper (pediatric CNS)
- Crypto news aggregator
- Embedding generation
- Vector search implementation
```

**Week 6: Learning Paths**
```bash
# Path engine
- Path definition UI (admin)
- User path assignment
- Progress tracking
- Recommendation algorithm
```

### Phase 4: Self-Learning (Weeks 7-8)

**Week 7: Training Loop**
```bash
# AI training
- RLHF setup
- Feedback collection UI
- Weekly retraining pipeline
- A/B testing framework
```

**Week 8: Launch Prep**
```bash
# Final touches
- Security audit
- Performance optimization
- Documentation
- Monitoring setup (Sentry, Datadog)
```

---

## 📈 SUCCESS METRICS

### Key Performance Indicators

**1. User Engagement**
- Cross-domain navigation rate (target: 60%)
- Average session time (target: 15min)
- Return user rate (target: 40% weekly)

**2. Learning Outcomes**
- Path completion rate (target: 50%)
- Quiz pass rate (target: 70%)
- Academy enrollment from Foundation (target: 30%)

**3. AI Performance**
- Response accuracy (expert-validated, target: 90%)
- User helpfulness rating (target: 4.5/5)
- Query resolution rate (target: 85%)

**4. Research Impact**
- Papers read/downloaded
- Researcher sign-ups
- Grant applications submitted

**5. Foundation Contribution**
- Donations via tyt.foundation
- DAO participation rate
- Transparent reporting views

---

## 🎯 NEXT IMMEDIATE ACTIONS

### Critical Path (Start Now):

1. **Setup tyt.foundation repo**
   ```bash
   git clone https://github.com/takeyourtokenapp/tyt.foundation.git
   cd tyt.foundation
   npm create vite@latest . -- --template react-ts
   ```

2. **Configure Supabase project**
   - Enable pgvector extension
   - Run aOi table migrations
   - Setup Edge Functions

3. **Domain configuration**
   - Point tyt.foundation to hosting
   - Setup SSL
   - Configure CORS for API calls

4. **Build initial pages**
   - Landing (MVP version)
   - aOi hub (static explanation)
   - Knowledge hub (first 5 topics)

5. **API bridge prototype**
   - Single endpoint: GET /aoi/v1/user/context
   - Test authentication flow
   - Verify CORS

**Target**: MVP live on tyt.foundation in 2 weeks

---

## 📞 SUPPORT & CONTACT

**Technical Lead**: [Your Name]
**Repository**: https://github.com/takeyourtokenapp/
**Documentation**: This file + /docs folder

**For Questions**:
- Technical: Open GitHub issue
- Security: security@tyt.foundation
- Research: research@tyt.foundation

---

**Status**: Ready for implementation
**Last Updated**: December 27, 2025
**Next Review**: January 10, 2026
