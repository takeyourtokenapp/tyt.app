# 🔗 aOi Cross-Domain API Specification

**Version**: 1.0.0
**Base URL**: `https://api.tyt.foundation/aoi/v1`
**Protocol**: HTTPS only, TLS 1.3+
**Authentication**: JWT Bearer tokens

---

## 🔐 AUTHENTICATION

### Token Format

```typescript
// JWT payload structure
interface AoiJWTPayload {
  sub: string;          // user_id
  email: string;
  role: "student" | "researcher" | "admin";
  domains: string[];    // ["foundation", "app"]
  exp: number;          // Unix timestamp
  iat: number;
}

// Request header
Authorization: Bearer <jwt_token>
X-Domain: "foundation" | "app"
X-Request-ID: <uuid>  // For tracing
```

### Token Exchange

```http
POST /auth/exchange
Content-Type: application/json

{
  "source_domain": "takeyourtoken.app",
  "source_token": "<app_jwt>",
  "target_domain": "tyt.foundation"
}

Response 200:
{
  "target_token": "<foundation_jwt>",
  "expires_in": 900  // 15 minutes
}
```

---

## 📊 ENDPOINTS

### 1. User Context Management

#### Get User Context
```http
GET /user/context
Authorization: Bearer <token>

Response 200:
{
  "user_id": "uuid",
  "profile": {
    "display_name": "Student123",
    "avatar_url": "https://...",
    "joined_at": "2025-01-15T10:00:00Z"
  },
  "levels": {
    "web3_mastery": 45,      // 0-100
    "cns_knowledge": 32,     // 0-100
    "overall_rank": "Explorer"  // Student, Explorer, Researcher, Expert
  },
  "active_paths": [
    {
      "path_id": "uuid",
      "name": "Student Explorer Track",
      "progress": 65,  // percentage
      "current_step": {
        "title": "Understanding Medulloblastoma",
        "domain": "foundation",
        "url": "/knowledge/pediatric-tumors/medulloblastoma"
      }
    }
  ],
  "stats": {
    "total_lessons_completed": 23,
    "total_xp": 4500,
    "achievements_unlocked": 8,
    "days_active": 14
  },
  "recommendations": [
    {
      "type": "next_topic",
      "title": "Learn about blockchain for science",
      "domain": "foundation",
      "url": "/knowledge/web3-for-science",
      "reason": "You completed CNS basics - bridge to Web3"
    }
  ],
  "last_activity": {
    "domain": "app",
    "type": "lesson_complete",
    "title": "Bitcoin Mining Basics",
    "timestamp": "2025-12-27T14:30:00Z"
  }
}

Error 401:
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

#### Update User Context
```http
PATCH /user/context
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": {
    "learning_pace": "intensive",  // casual | regular | intensive
    "interests": ["genomics", "defi"],
    "preferred_domain": "foundation"
  }
}

Response 200:
{
  "success": true,
  "updated_fields": ["learning_pace", "interests"]
}
```

---

### 2. Activity Sync

#### Log Activity Event
```http
POST /activity/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "domain": "app",
  "activity_type": "lesson_complete",
  "item_id": "lesson_bitcoin_mining_101",
  "item_title": "Bitcoin Mining 101",
  "result": {
    "score": 95,
    "time_spent_seconds": 1200,
    "quiz_passed": true
  },
  "xp_earned": 100,
  "timestamp": "2025-12-27T14:30:00Z"
}

Response 201:
{
  "activity_id": "uuid",
  "success": true,
  "new_total_xp": 4600,
  "level_up": false,
  "achievements_unlocked": [],
  "aoi_response": {
    "congratulations": "Great work on Bitcoin Mining!",
    "next_suggestion": "Try 'Proof of Work vs Proof of Stake' next"
  }
}
```

#### Get Activity History
```http
GET /activity/history?limit=50&offset=0&domain=both
Authorization: Bearer <token>

Response 200:
{
  "activities": [
    {
      "id": "uuid",
      "domain": "app",
      "activity_type": "lesson_complete",
      "item_title": "Bitcoin Mining 101",
      "xp_earned": 100,
      "timestamp": "2025-12-27T14:30:00Z"
    },
    // ...more activities
  ],
  "total_count": 127,
  "pagination": {
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

---

### 3. Content Routing & Recommendations

#### Get Next Content Recommendation
```http
POST /route/next-content
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_topic": "bitcoin-mining",
  "completed_items": ["lesson_bitcoin_mining_101", "quiz_mining_basics"],
  "time_available_minutes": 30,
  "preferred_domain": "both"  // foundation | app | both
}

Response 200:
{
  "recommendations": [
    {
      "rank": 1,
      "content_id": "lesson_blockchain_consensus",
      "title": "Blockchain Consensus Mechanisms",
      "domain": "app",
      "url": "/app/academy/blockchain-consensus",
      "difficulty": 6,  // 1-10
      "estimated_time_minutes": 25,
      "xp_reward": 150,
      "reason": "Natural progression from mining to consensus",
      "prerequisites_met": true,
      "confidence_score": 0.92
    },
    {
      "rank": 2,
      "content_id": "article_neuroimaging_basics",
      "title": "Introduction to Neuroimaging",
      "domain": "foundation",
      "url": "/knowledge/research-methods/neuroimaging",
      "difficulty": 5,
      "estimated_time_minutes": 20,
      "xp_reward": 100,
      "reason": "Balance your learning with medical knowledge",
      "prerequisites_met": true,
      "confidence_score": 0.78
    }
  ],
  "learning_path_progress": {
    "current_path": "Student Explorer Track",
    "next_milestone": "Complete 5 more lessons",
    "estimated_completion": "2026-01-10"
  }
}
```

#### Search Content Across Domains
```http
GET /content/search?q=brain+tumor&domain=both&difficulty=1-7
Authorization: Bearer <token>

Response 200:
{
  "results": [
    {
      "content_id": "knowledge_medulloblastoma",
      "title": "What is Medulloblastoma?",
      "domain": "foundation",
      "url": "/knowledge/pediatric-tumors/medulloblastoma",
      "snippet": "Medulloblastoma is the most common malignant brain tumor in children...",
      "difficulty": 4,
      "relevance_score": 0.95
    }
    // ...more results
  ],
  "total_count": 12,
  "search_meta": {
    "query": "brain tumor",
    "filters_applied": ["difficulty: 1-7"],
    "search_time_ms": 45
  }
}
```

---

### 4. Learning Paths

#### Get Available Paths
```http
GET /paths/available
Authorization: Bearer <token>

Response 200:
{
  "paths": [
    {
      "id": "uuid",
      "name": "Student Explorer (Ages 12-16)",
      "description": "Start your journey into brain science and blockchain",
      "target_audience": "student",
      "estimated_duration": "8 weeks",
      "difficulty": "beginner",
      "steps_count": 24,
      "domains_covered": ["foundation", "app"],
      "prerequisites": [],
      "enrolled_count": 1247,
      "completion_rate": 0.68
    }
    // ...more paths
  ]
}
```

#### Enroll in Path
```http
POST /paths/{path_id}/enroll
Authorization: Bearer <token>

Response 201:
{
  "enrollment_id": "uuid",
  "path": {
    "id": "uuid",
    "name": "Student Explorer",
    "first_step": {
      "title": "Welcome to Brain Science",
      "domain": "foundation",
      "url": "/knowledge/brain-basics"
    }
  },
  "estimated_completion_date": "2026-02-20"
}
```

#### Get Path Progress
```http
GET /paths/{path_id}/progress
Authorization: Bearer <token>

Response 200:
{
  "path_id": "uuid",
  "enrollment_date": "2025-12-01T00:00:00Z",
  "current_step": 12,
  "total_steps": 24,
  "progress_percentage": 50,
  "completed_steps": [
    {
      "step_number": 1,
      "title": "Welcome to Brain Science",
      "completed_at": "2025-12-02T15:00:00Z",
      "xp_earned": 50
    }
    // ...more steps
  ],
  "next_step": {
    "step_number": 13,
    "title": "Understanding Blockchain",
    "domain": "app",
    "url": "/app/academy/blockchain-intro",
    "unlocks_at": null  // null means unlocked now
  },
  "estimated_completion": "2026-02-15",
  "on_track": true
}
```

---

### 5. Knowledge Graph Query

#### Ask aOi a Question
```http
POST /knowledge/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "What causes medulloblastoma in children?",
  "context": {
    "user_level": 45,  // 0-100, determines answer complexity
    "domain_preference": "cns"  // cns | web3 | both
  }
}

Response 200:
{
  "query_id": "uuid",
  "answer": {
    "text": "Medulloblastoma is caused by genetic mutations that occur during brain development. While the exact cause isn't fully understood, researchers have identified several risk factors including certain genetic syndromes like Li-Fraumeni syndrome and exposure to radiation. Most cases appear to be sporadic, meaning they occur randomly without a clear inherited pattern.",
    "simplified_for_age": 14,  // Answer tailored for this age
    "confidence": 0.89,
    "warning": null  // Medical disclaimer if needed
  },
  "sources": [
    {
      "title": "Pediatric Medulloblastoma: Current Management",
      "url": "https://pubmed.ncbi.nlm.nih.gov/...",
      "publication": "Journal of Pediatric Oncology",
      "year": 2024,
      "credibility_score": 0.95
    }
  ],
  "related_topics": [
    {
      "topic_id": "genetic_mutations",
      "title": "What are genetic mutations?",
      "url": "/knowledge/brain-basics/genetics"
    },
    {
      "topic_id": "brain_development",
      "title": "How does the brain develop?",
      "url": "/knowledge/brain-basics/development"
    }
  ],
  "next_steps": [
    "Learn about treatment options",
    "Understand clinical trials",
    "Explore current research"
  ],
  "aoi_note": "This is educational information only. Always consult healthcare professionals for medical advice."
}

Response 400 (Inappropriate Query):
{
  "error": "content_policy_violation",
  "message": "This query requests medical advice which aOi cannot provide",
  "suggestion": "Please consult a healthcare professional for personalized medical guidance"
}
```

#### Get Knowledge Topic
```http
GET /knowledge/topics/{topic_id}?difficulty=auto
Authorization: Bearer <token>

Response 200:
{
  "topic_id": "medulloblastoma_overview",
  "name": "Medulloblastoma Overview",
  "domain": "cns",
  "difficulty_level": 5,  // 1-10, adjusted to user level
  "content": {
    "summary": "...",
    "key_points": ["point1", "point2"],
    "visuals": [
      {
        "type": "diagram",
        "url": "/images/medullo_brain_location.png",
        "alt_text": "Location of medulloblastoma in brain"
      }
    ]
  },
  "prerequisites": [
    {
      "topic_id": "brain_anatomy",
      "completed": true
    }
  ],
  "related_content": {
    "foundation": [...],
    "app": [...]
  },
  "last_updated": "2025-11-20T00:00:00Z"
}
```

---

### 6. Progress & Achievements

#### Get Unified Progress Dashboard
```http
GET /progress/unified
Authorization: Bearer <token>

Response 200:
{
  "user_id": "uuid",
  "total_xp": 4600,
  "levels": {
    "web3_mastery": {
      "current_level": 45,
      "next_level_at": 5000,
      "xp_to_next": 400
    },
    "cns_knowledge": {
      "current_level": 32,
      "next_level_at": 3500,
      "xp_to_next": 100
    },
    "overall_rank": "Explorer"
  },
  "achievements": [
    {
      "id": "first_foundation_lesson",
      "title": "Knowledge Seeker",
      "description": "Completed your first Foundation lesson",
      "icon_url": "/achievements/knowledge_seeker.svg",
      "unlocked_at": "2025-12-02T15:00:00Z",
      "rarity": "common"
    },
    {
      "id": "bridge_walker",
      "title": "Bridge Walker",
      "description": "Completed lessons on both domains in same week",
      "icon_url": "/achievements/bridge_walker.svg",
      "unlocked_at": "2025-12-10T20:00:00Z",
      "rarity": "rare"
    }
  ],
  "cross_domain_milestones": [
    {
      "title": "First Cross-Domain Week",
      "description": "Active on both Foundation and App",
      "achieved_at": "2025-12-10T00:00:00Z"
    }
  ],
  "streaks": {
    "current_daily_streak": 7,
    "longest_daily_streak": 14,
    "current_weekly_streak": 3
  },
  "summary": {
    "total_lessons": 23,
    "total_quizzes": 15,
    "foundation_hours": 8.5,
    "app_hours": 12.3,
    "donations_made": 2,
    "dao_votes": 3
  }
}
```

---

### 7. AI Training & Feedback

#### Submit Feedback on aOi Response
```http
POST /training/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "interaction_id": "uuid",  // From previous aOi response
  "feedback_type": "accuracy" | "helpfulness" | "clarity",
  "rating": 4,  // 1-5
  "was_helpful": true,
  "comment": "Great explanation but could use more visuals",
  "suggested_improvement": "Add diagram showing tumor location"
}

Response 201:
{
  "feedback_id": "uuid",
  "success": true,
  "message": "Thank you! Your feedback helps aOi improve.",
  "xp_earned": 10  // Small reward for providing feedback
}
```

#### Report Content Issue
```http
POST /training/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "content_type": "knowledge_article" | "aoi_response" | "lesson",
  "content_id": "uuid",
  "issue_type": "inaccurate" | "inappropriate" | "broken_link" | "other",
  "description": "The article states incorrect information about...",
  "severity": "low" | "medium" | "high"
}

Response 201:
{
  "report_id": "uuid",
  "success": true,
  "message": "Report received. Our team will review within 24 hours.",
  "ticket_number": "RPT-2025-1234"
}
```

---

### 8. Admin Endpoints (Restricted)

#### Update Knowledge Graph
```http
POST /admin/knowledge/update
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "topic_id": "new_topic_123",
  "content": {...},
  "embeddings": [...],
  "sources": [...]
}

Response 201:
{
  "success": true,
  "topic_id": "new_topic_123",
  "indexed_at": "2025-12-27T15:00:00Z"
}
```

#### Retrain AI Models
```http
POST /admin/ai/retrain
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "model_type": "recommendation" | "rag" | "all",
  "training_data_since": "2025-12-20T00:00:00Z",
  "validation_split": 0.2
}

Response 202:
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_duration_minutes": 120,
  "check_status_url": "/admin/ai/jobs/uuid"
}
```

---

## 🔄 WEBSOCKET EVENTS (Real-time)

### Connection
```javascript
// Client connects
const ws = new WebSocket('wss://api.tyt.foundation/aoi/v1/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: '<jwt_token>'
  }));
};
```

### Server → Client Events

**Progress Update**
```json
{
  "type": "progress_update",
  "data": {
    "xp_earned": 100,
    "new_total_xp": 4700,
    "level_up": false,
    "achievement_unlocked": null
  }
}
```

**New Recommendation**
```json
{
  "type": "new_recommendation",
  "data": {
    "title": "Try this next!",
    "content_id": "lesson_xyz",
    "domain": "foundation",
    "url": "/knowledge/..."
  }
}
```

**aOi Message**
```json
{
  "type": "aoi_message",
  "data": {
    "message": "Great progress today! You've completed 3 lessons.",
    "emoji": "🎉",
    "action": {
      "text": "Continue learning",
      "url": "/app/academy"
    }
  }
}
```

---

## 📝 ERROR CODES

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate action (e.g., already enrolled) |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - AI model offline |

### Error Response Format
```json
{
  "error": "error_code",
  "message": "Human-readable error description",
  "details": {
    "field": "specific_field",
    "reason": "detailed_reason"
  },
  "request_id": "uuid",
  "timestamp": "2025-12-27T15:00:00Z"
}
```

---

## 🚦 RATE LIMITS

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Read (GET) | 100 req | 1 minute |
| Write (POST/PATCH) | 30 req | 1 minute |
| Knowledge Query | 20 req | 1 minute |
| WebSocket | 1 connection | Per user |

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1703779200
```

---

## 🧪 TESTING

### Example: Full User Journey

```javascript
// 1. Authenticate
const authRes = await fetch('https://api.tyt.foundation/aoi/v1/auth/exchange', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source_domain: 'takeyourtoken.app',
    source_token: '<app_jwt>',
    target_domain: 'tyt.foundation'
  })
});
const { target_token } = await authRes.json();

// 2. Get user context
const contextRes = await fetch('https://api.tyt.foundation/aoi/v1/user/context', {
  headers: { 'Authorization': `Bearer ${target_token}` }
});
const context = await contextRes.json();

// 3. Get next recommendation
const recRes = await fetch('https://api.tyt.foundation/aoi/v1/route/next-content', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${target_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_topic: context.last_activity.title,
    completed_items: [],
    time_available_minutes: 30
  })
});
const recommendations = await recRes.json();

// 4. Log activity
await fetch('https://api.tyt.foundation/aoi/v1/activity/log', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${target_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: 'foundation',
    activity_type: 'lesson_complete',
    item_id: recommendations.recommendations[0].content_id,
    xp_earned: 100
  })
});
```

---

**Status**: Production Ready
**Last Updated**: December 27, 2025
**API Version**: 1.0.0
