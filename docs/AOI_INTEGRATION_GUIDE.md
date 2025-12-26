# aOi Integration Guide

## Quick Start

This guide explains how to integrate aOi (AI character) into the TakeYourToken platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    aOi Core Orchestrator                 │
│            (Context, Routing, Permissions)               │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼────────┐
│ tyt.foundation│  │takeyourtoken.app│
│   (Knowledge) │  │    (Tools)     │
└───────────────┘  └────────────────┘
```

## Database Schema

### Core Tables

```sql
-- User progress tracking
CREATE TABLE aoi_user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  level integer DEFAULT 1 CHECK (level BETWEEN 1 AND 4),
  experience_points integer DEFAULT 0,
  current_track text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Guardian consent tracking
CREATE TABLE aoi_guardian_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL REFERENCES profiles(id),
  guardian_email text NOT NULL,
  guardian_name text,
  consent_given boolean DEFAULT false,
  consent_timestamp timestamptz,
  expiry_date timestamptz,
  consent_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Achievement tracking
CREATE TABLE aoi_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  achievement_code text NOT NULL,
  achievement_type text NOT NULL, -- 'learning', 'contribution', 'milestone'
  metadata jsonb DEFAULT '{}'::jsonb,
  earned_at timestamptz DEFAULT now(),
  on_chain_hash text, -- For future blockchain anchoring
  UNIQUE(user_id, achievement_code)
);

-- aOi interaction log (audit trail)
CREATE TABLE aoi_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  session_id text,
  interaction_type text NOT NULL,
  agent_called text,
  context jsonb DEFAULT '{}'::jsonb,
  response_summary text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE aoi_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_guardian_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE aoi_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own progress"
  ON aoi_user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON aoi_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions"
  ON aoi_interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## Frontend Integration

### Context Provider

```typescript
// src/contexts/AoiContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AoiState {
  level: number;
  experience: number;
  currentTrack: string | null;
  isGuardianMode: boolean;
  achievements: Achievement[];
}

interface AoiContextValue {
  state: AoiState;
  updateProgress: (xp: number) => Promise<void>;
  getGuidance: (context: string) => Promise<string>;
}

const AoiContext = createContext<AoiContextValue | undefined>(undefined);

export function AoiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AoiState>({
    level: 1,
    experience: 0,
    currentTrack: null,
    isGuardianMode: false,
    achievements: []
  });

  // Load user progress
  useEffect(() => {
    loadUserProgress();
  }, []);

  async function loadUserProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: progress } = await supabase
      .from('aoi_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (progress) {
      setState(prev => ({
        ...prev,
        level: progress.level,
        experience: progress.experience_points,
        currentTrack: progress.current_track
      }));
    }
  }

  async function updateProgress(xp: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newXP = state.experience + xp;
    const newLevel = calculateLevel(newXP);

    await supabase
      .from('aoi_user_progress')
      .upsert({
        user_id: user.id,
        experience_points: newXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      });

    setState(prev => ({
      ...prev,
      experience: newXP,
      level: newLevel
    }));
  }

  async function getGuidance(context: string): Promise<string> {
    // Call to AI service or edge function
    const { data } = await supabase.functions.invoke('aoi-guidance', {
      body: { context, userLevel: state.level }
    });

    return data?.guidance || '';
  }

  return (
    <AoiContext.Provider value={{ state, updateProgress, getGuidance }}>
      {children}
    </AoiContext.Provider>
  );
}

export function useAoi() {
  const context = useContext(AoiContext);
  if (!context) {
    throw new Error('useAoi must be used within AoiProvider');
  }
  return context;
}

function calculateLevel(xp: number): number {
  // Simple level calculation
  if (xp < 100) return 1;
  if (xp < 500) return 2;
  if (xp < 1500) return 3;
  return 4;
}
```

### Visual Component

```typescript
// src/components/aoi/AoiAvatar.tsx
import { useAoi } from '@/contexts/AoiContext';

interface AoiAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
}

export function AoiAvatar({ size = 'md', showLevel = true }: AoiAvatarProps) {
  const { state } = useAoi();

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const levelConfig = {
    1: { name: 'Beginner', color: 'bg-blue-100', textColor: 'text-blue-700' },
    2: { name: 'Explorer', color: 'bg-green-100', textColor: 'text-green-700' },
    3: { name: 'Builder', color: 'bg-purple-100', textColor: 'text-purple-700' },
    4: { name: 'Guardian', color: 'bg-yellow-100', textColor: 'text-yellow-700' }
  };

  const config = levelConfig[state.level as keyof typeof levelConfig];

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${config.color}`}>
        {/* Placeholder - replace with actual aOi image */}
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl">葵</span>
        </div>
      </div>

      {showLevel && (
        <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}>
          Lv.{state.level}
        </div>
      )}
    </div>
  );
}
```

### Guidance Component

```typescript
// src/components/aoi/AoiGuidance.tsx
import { useState } from 'react';
import { useAoi } from '@/contexts/AoiContext';

interface AoiGuidanceProps {
  context: string;
  trigger?: React.ReactNode;
}

export function AoiGuidance({ context, trigger }: AoiGuidanceProps) {
  const { getGuidance } = useAoi();
  const [guidance, setGuidance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleGetGuidance() {
    setIsLoading(true);
    setIsOpen(true);
    const result = await getGuidance(context);
    setGuidance(result);
    setIsLoading(false);
  }

  return (
    <>
      <button
        onClick={handleGetGuidance}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        {trigger || (
          <>
            <span>葵</span>
            <span>Ask aOi</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-sm text-gray-600">aOi is thinking...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>葵</span>
                <span>aOi says:</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{guidance}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
```

## Edge Function for AI Guidance

```typescript
// supabase/functions/aoi-guidance/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GuidanceRequest {
  context: string;
  userLevel: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { context, userLevel }: GuidanceRequest = await req.json();

    // Adjust tone based on user level
    const tones = {
      1: "gentle and encouraging, using simple language",
      2: "supportive and exploratory, introducing concepts",
      3: "technical but accessible, assuming competence",
      4: "professional and direct, focused on system understanding"
    };

    const tone = tones[userLevel as keyof typeof tones] || tones[1];

    // In production, integrate with OpenAI or similar
    // For now, return contextual guidance
    const guidance = generateGuidance(context, tone);

    return new Response(
      JSON.stringify({ guidance }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateGuidance(context: string, tone: string): string {
  // Placeholder - integrate with actual AI service
  const responses = {
    "blockchain-basics": "Blockchain is like a shared notebook that everyone can read, but no one can erase. Each page is a 'block', connected to the previous one.",
    "web3-intro": "Web3 means you own your data and identity. Instead of companies holding your information, you hold the keys.",
    "smart-contracts": "Smart contracts are like vending machines - when you put in money, you automatically get what you paid for. No middleman needed."
  };

  return responses[context as keyof typeof responses] ||
    "I can explain this in simpler terms. What would you like to know?";
}
```

## Usage Examples

### In Academy Lessons

```typescript
// src/pages/app/Academy.tsx
import { AoiGuidance } from '@/components/aoi/AoiGuidance';

function LessonPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>Understanding Blockchain</h1>

      <div className="prose">
        <p>Blockchain technology forms the foundation...</p>
      </div>

      <AoiGuidance
        context="blockchain-basics"
        trigger={<span className="text-blue-600">Need help understanding?</span>}
      />
    </div>
  );
}
```

### In Navigation

```typescript
// src/components/Header.tsx
import { AoiAvatar } from '@/components/aoi/AoiAvatar';
import { useAoi } from '@/contexts/AoiContext';

function Header() {
  const { state } = useAoi();

  return (
    <header className="flex items-center justify-between p-4">
      <nav>...</nav>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium">Level {state.level}</div>
          <div className="text-xs text-gray-500">{state.experience} XP</div>
        </div>
        <AoiAvatar size="sm" showLevel={false} />
      </div>
    </header>
  );
}
```

## Progressive Enhancement

### Phase 1: Visual & Progress
- Display aOi avatar
- Track user level/experience
- Show achievements

### Phase 2: Contextual Help
- Add guidance tooltips
- Integrate with lesson content
- Provide explanations

### Phase 3: Interactive AI
- Connect to OpenAI/Claude API
- Real-time Q&A
- Personalized recommendations

### Phase 4: Full Orchestration
- Multi-agent system
- Knowledge base RAG
- Cross-platform context

## Best Practices

1. **Always check user level** before showing advanced content
2. **Log interactions** for improvement and safety
3. **Respect guardian mode** - no financial content for students
4. **Keep tone appropriate** to user's level
5. **Never store sensitive data** in aOi interactions

## Testing

```typescript
// Example test
describe('AoiContext', () => {
  it('should update user progress', async () => {
    const { result } = renderHook(() => useAoi(), {
      wrapper: AoiProvider
    });

    await act(async () => {
      await result.current.updateProgress(50);
    });

    expect(result.current.state.experience).toBe(50);
  });
});
```

## Deployment Checklist

- [ ] Deploy edge function `aoi-guidance`
- [ ] Run database migrations
- [ ] Add RLS policies
- [ ] Test guardian consent flow
- [ ] Verify audit logging
- [ ] Test all user levels
- [ ] Deploy frontend with AoiProvider
- [ ] Monitor interaction logs

---

**Last Updated:** December 26, 2024
**Version:** 1.0
**Status:** Implementation Guide
