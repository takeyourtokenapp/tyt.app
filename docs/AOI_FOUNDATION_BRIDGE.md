# aOi Foundation Bridge Architecture

## Overview

This document describes the secure bridge architecture connecting **takeyourtoken.app** (TYT App) with **tyt.foundation** (aOi's home).

## Conceptual Model

```
┌─────────────────────────────────────────────────────────────┐
│                       tyt.foundation                        │
│                  (aOi's Home & Knowledge Base)              │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐      │
│  │ AI Engine   │  │ Research DB  │  │ Foundation  │      │
│  │ (OpenAI/    │  │              │  │ Operations  │      │
│  │  Claude)    │  │ Medical Data │  │             │      │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘      │
│         │                │                   │              │
│         └────────────────┴───────────────────┘              │
│                          │                                   │
│                    ┌─────▼──────┐                          │
│                    │ Public API │                          │
│                    │ /api/aoi   │                          │
│                    └─────┬──────┘                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    🌐 HTTPS Bridge
                     (Secure API)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    takeyourtoken.app                        │
│                  (TYT Platform & Tools)                     │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐      │
│  │ AoiContext  │  │ Local Edge   │  │ User UI     │      │
│  │ (Frontend)  │  │ Functions    │  │             │      │
│  │             │  │ (Fallback)   │  │ Chat Widget │      │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘      │
│         │                │                   │              │
│         └────────────────┴───────────────────┘              │
│                    AoiApiClient                             │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Components

### 1. Foundation API (`tyt.foundation`)

**Purpose**: Central knowledge base and AI processing

**Endpoints**:
- `POST /api/aoi` - Chat and Q&A
- `GET /api/status` - Health check
- `GET /aoi` - About aOi page
- `GET /learn` - Learning resources
- `GET /donate` - Donation portal
- `GET /research` - Research publications

**Features**:
- Advanced AI (OpenAI/Claude integration)
- Medical research database access
- RAG (Retrieval Augmented Generation) for scientific papers
- Multi-language support
- Voice synthesis
- Personalized learning paths

### 2. App Integration (`takeyourtoken.app`)

**Purpose**: User interface and local processing

**Components**:
- `AoiApiClient` - Bridge client with automatic fallback
- `AoiContext` - Global state management
- `AoiAvatar` - Visual character component
- `AoiChatWidget` - Chat interface
- `AoiFoundationBadge` - Branding and links
- Local Edge Function - Fallback when Foundation offline

**Features**:
- Seamless switching between Foundation and local mode
- Automatic reconnection
- Status monitoring
- Cross-domain authentication
- Shared user context

## Security Model

### Cross-Domain Authentication

```typescript
// User authenticates on takeyourtoken.app
const session = supabase.auth.getSession();

// Token is passed to Foundation API
fetch('https://tyt.foundation/api/aoi', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'X-Source-Domain': 'https://takeyourtoken.app'
  }
});

// Foundation validates token and user permissions
```

### Data Flow Security

1. **User Request** → `takeyourtoken.app`
2. **Auth Token** → Added to request
3. **Encrypted HTTPS** → `tyt.foundation`
4. **Token Validation** → Foundation checks auth
5. **Response** → Encrypted back to app
6. **Local Storage** → Never stores sensitive data

### Privacy Protection

- **No PII in URLs**: User data in encrypted body only
- **Session-based**: No persistent cookies
- **Audit Trail**: All interactions logged (both sides)
- **GDPR Compliant**: Right to deletion, export
- **Minor Protection**: Guardian consent system

## Implementation

### Configuration (`aoiConfig.ts`)

```typescript
export const AOI_CONFIG = {
  foundation: {
    domain: 'https://tyt.foundation',
    apiEndpoint: 'https://tyt.foundation/api/aoi',
    websiteUrl: 'https://tyt.foundation',
    aboutUrl: 'https://tyt.foundation/aoi',
  },
  features: {
    useFoundationApi: true,      // Try Foundation first
    fallbackToLocal: true,        // Use local if offline
    crossDomainAuth: true,        // Share auth tokens
    sharedSessions: true,         // Sync user state
  }
};
```

### API Client (`aoiApiClient.ts`)

```typescript
class AoiApiClient {
  async chat(message: AoiMessage): Promise<AoiResponse> {
    // Try Foundation API
    if (AOI_CONFIG.features.useFoundationApi) {
      try {
        return await this.chatWithFoundation(message);
      } catch (error) {
        // Fallback to local
        if (AOI_CONFIG.features.fallbackToLocal) {
          return await this.chatWithLocal(message);
        }
      }
    }

    // Default to local
    return await this.chatWithLocal(message);
  }
}
```

### Status Monitoring

```typescript
// Check Foundation status every 60 seconds
useEffect(() => {
  checkFoundationStatus();
  const interval = setInterval(checkFoundationStatus, 60000);
  return () => clearInterval(interval);
}, []);

const checkFoundationStatus = async () => {
  const status = await aoiApiClient.checkFoundationStatus();
  setFoundationOnline(status);
};
```

## User Experience

### When Foundation is Online 🟢

- **Chat responses**: Powered by advanced AI (OpenAI/Claude)
- **Knowledge depth**: Access to medical research database
- **Features**: Voice, multi-language, personalized paths
- **Status indicator**: Green dot in chat widget
- **Footer text**: "Foundation Connected"

### When Foundation is Offline 🔴

- **Chat responses**: Powered by local Edge Function
- **Knowledge depth**: Basic pre-programmed responses
- **Features**: Text-only, English, general guidance
- **Status indicator**: Gray dot in chat widget
- **Footer text**: "Local Mode"

### Seamless Transition

- **No user action required**: Automatic fallback
- **No data loss**: Messages queued if needed
- **Clear indication**: Status always visible
- **Quick recovery**: Reconnects automatically when Foundation back online

## Links & Hyperconnectivity

### Foundation Links Available Everywhere

```typescript
const links = getFoundationLinks();
// Returns:
{
  home: 'https://tyt.foundation',
  aboutAoi: 'https://tyt.foundation/aoi',
  learnMore: 'https://tyt.foundation/learn',
  donate: 'https://tyt.foundation/donate',
  research: 'https://tyt.foundation/research'
}
```

### Link Placement

1. **Chat Widget Header**: Small badge with Foundation logo
2. **aOi Profile Page**: Full Foundation card with multiple links
3. **Academy Lessons**: Contextual links to research
4. **Foundation Page**: Direct portal to tyt.foundation
5. **Footer**: "Powered by TYT Foundation" badge

## Mobile & Wearable Support

### Header Avatar (Always Visible)

- **Desktop**: Top-right corner, medium size
- **Mobile**: Top-right corner, small size
- **Tablet**: Top-right corner, medium size
- **Wearables**: Simplified icon version

### Chat Widget Responsive

- **Desktop**: 384px width, bottom-right
- **Mobile**: Full width, slide up from bottom
- **Tablet**: 400px width, bottom-right
- **Wearables**: Full screen overlay

### Touch Optimization

- **Tap targets**: Minimum 44x44px
- **Swipe gestures**: Close chat, navigate messages
- **Voice input**: Available on supported devices
- **Haptic feedback**: On important actions

## Future Enhancements (Phase 3+)

### Advanced AI Features
- OpenAI GPT-4 integration
- Claude 3 Opus for complex queries
- Voice-to-text and text-to-voice
- Image recognition for medical diagrams
- Video explanations

### Personalization
- Learning style detection
- Adaptive difficulty
- Personal knowledge graph
- Study schedule optimization
- Goal tracking and reminders

### Community Features
- Q&A marketplace
- Peer tutoring matching
- Expert office hours
- Study groups
- Community knowledge base

### Research Integration
- Live access to medical journals
- Citation generation
- Research paper summarization
- Clinical trial finder
- Expert researcher network

## Monitoring & Analytics

### Foundation API Metrics
- Response time
- Success rate
- Error types
- Usage patterns
- User satisfaction

### App Integration Metrics
- Foundation vs local usage ratio
- Fallback frequency
- Average session duration
- User retention
- Feature adoption

### Foundation Impact Metrics
- Donations generated
- Research papers accessed
- Educational outcomes
- User testimonials
- Lives impacted

## Development Guidelines

### Adding New Features

1. **Check Foundation API**: Does it exist there?
2. **Fallback Plan**: What happens if offline?
3. **Status Indicator**: How to show users?
4. **Error Handling**: Graceful degradation
5. **Testing**: Both online and offline modes

### API Changes

1. **Version headers**: Always include API version
2. **Backward compatibility**: Support old clients
3. **Deprecation notices**: 90 days minimum
4. **Migration guides**: Clear documentation
5. **Status page**: Announce planned maintenance

### Security Updates

1. **Coordinate**: Both teams must update together
2. **Test thoroughly**: Auth flow, token validation
3. **Monitor closely**: Watch error logs post-deployment
4. **Rollback plan**: Ready to revert if issues
5. **User communication**: Transparent about changes

## Support & Troubleshooting

### Common Issues

**Foundation not connecting**
- Check `foundationOnline` status
- Verify CORS headers
- Check auth token validity
- Review network logs

**Slow responses**
- Check Foundation API latency
- Consider local caching
- Optimize request size
- Use compression

**Auth errors**
- Refresh user session
- Verify token format
- Check CORS configuration
- Review RLS policies

### Debug Mode

Enable detailed logging:
```typescript
localStorage.setItem('AOI_DEBUG', 'true');
// Logs all Foundation API calls, responses, and timings
```

## Conclusion

The aOi Foundation Bridge creates a powerful, secure, and seamless connection between TYT's platform and the Foundation's knowledge base. Users benefit from advanced AI capabilities when online, with graceful fallback to local mode when needed.

This architecture supports the Foundation's mission by:
- Making research accessible
- Educating users effectively
- Generating awareness and donations
- Demonstrating real-world impact
- Building community trust

**aOi lives at tyt.foundation, but helps users everywhere through takeyourtoken.app.**

---

**Status**: ✅ Bridge Architecture Implemented
**Foundation API**: 🔄 Awaiting deployment at tyt.foundation
**App Integration**: ✅ Complete with fallback
**Last Updated**: December 26, 2025
