/**
 * aOi Configuration - Cross-Domain AI Guide Bridge
 *
 * aOi lives at tyt.foundation but helps everywhere.
 * This configuration enables seamless cross-domain experience.
 *
 * Architecture:
 * - tyt.foundation: Knowledge, science, mission (WHY)
 * - takeyourtoken.app: Tools, Web3, academy (HOW)
 * - aOi: Navigator between them
 */
export const AOI_CONFIG = {
  // tyt.foundation - aOi's home base
  foundation: {
    domain: 'https://tyt.foundation',
    apiEndpoint: 'https://tyt.foundation/api/aoi', // AI chat endpoint
    websiteUrl: 'https://tyt.foundation',
    aboutUrl: 'https://tyt.foundation/aoi', // About aOi page
    statusUrl: 'https://tyt.foundation/api/status', // Health check
    knowledgeUrl: 'https://tyt.foundation/knowledge', // Scientific articles
    transparencyUrl: 'https://tyt.foundation/transparency', // Foundation reports
    donateUrl: 'https://tyt.foundation/donate', // Direct donation
  },

  // takeyourtoken.app - Current platform
  app: {
    domain: 'https://takeyourtoken.app',
    localApiPath: '/api/aoi', // Fallback local endpoint
    academyPath: '/app/academy',
    foundationPath: '/app/foundation',
  },

  // Cross-domain features
  features: {
    useFoundationApi: true, // Try Foundation API first
    fallbackToLocal: true, // Fall back to local if Foundation unavailable
    crossDomainAuth: true, // Enable auth token sharing
    sharedSessions: true, // Sync user progress across domains
    enableVoice: false, // Voice interface (future)
    multiLanguage: false, // Multi-language support (future)
  },

  personality: {
    name: 'Aoi',
    role: 'Educational AI Guide',
    home: 'TYT Children\'s Brain Cancer Research & Support Foundation',
    mission: 'Help users learn while supporting children with brain cancer',
    traits: [
      'Intelligent and knowledgeable',
      'Warm and empathetic',
      'Patient and encouraging',
      'Science-friendly educator',
      'Hopeful and caring',
    ],
  },

  // CDN configuration for aOi assets
  // All aOi visuals are served from a centralized CDN
  cdn: {
    primary: 'https://cdn.takeyourtoken.app/aoi',
    fallback: 'https://tyt.foundation/assets/aoi',
    timeout: 5000, // 5 seconds
    retries: 2,
    enableLocalCache: true,
    enableFallbackIcon: true, // Use Sparkles icon if CDN unavailable
  },

  // aOi visual assets - centralized CDN paths
  // Images are organized by context and size for optimal usage
  images: {
    // Avatars - for header, badges, small UI elements
    avatarSm: 'avatars/aoi-avatar-sm.png',      // 32x32
    avatarMd: 'avatars/aoi-avatar-md.png',      // 64x64
    avatarLg: 'avatars/aoi-avatar-lg.png',      // 128x128
    avatarXl: 'avatars/aoi-avatar-xl.png',      // 256x256

    // Heroes - for landing pages, large sections
    heroMain: 'heroes/aoi-hero-main.png',       // 600x600
    heroWelcome: 'heroes/aoi-hero-welcome.png', // 800x800
    heroPresenting: 'heroes/aoi-hero-presenting.png', // 800x1000

    // Levels - for Academy evolution system
    level1Beginner: 'levels/aoi-level-1-beginner.png',
    level2Explorer: 'levels/aoi-level-2-explorer.png',
    level3Builder: 'levels/aoi-level-3-builder.png',
    level4Guardian: 'levels/aoi-level-4-guardian.png',

    // Contexts - for specific interactions
    teaching: 'contexts/aoi-teaching.png',      // Academy
    helping: 'contexts/aoi-helping.png',        // Support
    celebrating: 'contexts/aoi-celebrating.png', // Achievements
    thinking: 'contexts/aoi-thinking.png',      // Analysis

    // Fallback
    placeholder: 'fallback/aoi-placeholder.svg',
  },

  evolution: {
    levels: [
      {
        level: 1,
        name: 'Beginner Guide',
        xpRequired: 0,
        description: 'Just starting your journey with Aoi',
        image: 'level1Beginner',
      },
      {
        level: 2,
        name: 'Explorer Mentor',
        xpRequired: 100,
        description: 'Exploring the crypto world together',
        image: 'level2Explorer',
      },
      {
        level: 3,
        name: 'Builder Advisor',
        xpRequired: 500,
        description: 'Building knowledge and skills',
        image: 'level3Builder',
      },
      {
        level: 4,
        name: 'Guardian Master',
        xpRequired: 1500,
        description: 'Guardian of knowledge and compassion',
        image: 'level4Guardian',
      },
    ],
  },

  branding: {
    colors: {
      primary: '#93C5FD',
      secondary: '#DDD6FE',
      accent: '#F0ABFC',
      background: '#1F2937',
    },
    tagline: 'Your AI companion for learning and giving',
    logo: 'logo.png',
  },
};

export function getAoiLevel(xp: number): number {
  if (xp >= 1500) return 4;
  if (xp >= 500) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function getAoiLevelInfo(level: number) {
  return AOI_CONFIG.evolution.levels.find(l => l.level === level) || AOI_CONFIG.evolution.levels[0];
}

export function getXpForNextLevel(currentXp: number): { current: number; next: number; progress: number } {
  const currentLevel = getAoiLevel(currentXp);
  const nextLevelInfo = AOI_CONFIG.evolution.levels.find(l => l.level === currentLevel + 1);

  if (!nextLevelInfo) {
    return { current: currentXp, next: currentXp, progress: 100 };
  }

  const currentLevelInfo = getAoiLevelInfo(currentLevel);
  const range = nextLevelInfo.xpRequired - currentLevelInfo.xpRequired;
  const progress = ((currentXp - currentLevelInfo.xpRequired) / range) * 100;

  return {
    current: currentXp,
    next: nextLevelInfo.xpRequired,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

/**
 * Get aOi image URL from centralized CDN
 * Returns CDN URL or null if not available (fallback to Sparkles icon)
 */
export function getAoiImageUrl(level: 1 | 2 | 3 | 4): string | null {
  const levelInfo = getAoiLevelInfo(level);
  const imageKey = levelInfo.image as keyof typeof AOI_CONFIG.images;
  const imagePath = AOI_CONFIG.images[imageKey];

  if (!imagePath) return null;

  // Try primary CDN first
  return `${AOI_CONFIG.cdn.primary}/${imagePath}`;
}

/**
 * Get specific aOi image by name from centralized CDN
 * @param imageName - Key from AOI_CONFIG.images
 * @returns CDN URL or null (use Sparkles icon as fallback)
 */
export function getAoiImage(imageName: keyof typeof AOI_CONFIG.images): string | null {
  const imagePath = AOI_CONFIG.images[imageName];
  if (!imagePath) return null;

  // Try primary CDN first
  return `${AOI_CONFIG.cdn.primary}/${imagePath}`;
}

/**
 * Get aOi image with automatic fallback
 * @param imageName - Key from AOI_CONFIG.images
 * @returns Object with primary and fallback URLs
 */
export function getAoiImageWithFallback(imageName: keyof typeof AOI_CONFIG.images) {
  const imagePath = AOI_CONFIG.images[imageName];
  if (!imagePath) return { primary: null, fallback: null };

  return {
    primary: `${AOI_CONFIG.cdn.primary}/${imagePath}`,
    fallback: `${AOI_CONFIG.cdn.fallback}/${imagePath}`,
  };
}

/**
 * Get aOi image by context and size
 * Smart selector for the right image based on usage
 */
export function getAoiImageByContext(
  context: 'avatar' | 'hero' | 'level' | 'teaching' | 'helping' | 'celebrating' | 'thinking',
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
  level?: 1 | 2 | 3 | 4
): string | null {
  let imageKey: keyof typeof AOI_CONFIG.images;

  switch (context) {
    case 'avatar':
      imageKey = size === 'sm' ? 'avatarSm' :
                 size === 'md' ? 'avatarMd' :
                 size === 'lg' ? 'avatarLg' : 'avatarXl';
      break;
    case 'hero':
      imageKey = size === 'sm' || size === 'md' ? 'heroMain' :
                 size === 'lg' ? 'heroWelcome' : 'heroPresenting';
      break;
    case 'level':
      if (!level) return null;
      imageKey = level === 1 ? 'level1Beginner' :
                 level === 2 ? 'level2Explorer' :
                 level === 3 ? 'level3Builder' : 'level4Guardian';
      break;
    case 'teaching':
      imageKey = 'teaching';
      break;
    case 'helping':
      imageKey = 'helping';
      break;
    case 'celebrating':
      imageKey = 'celebrating';
      break;
    case 'thinking':
      imageKey = 'thinking';
      break;
    default:
      return null;
  }

  return getAoiImage(imageKey);
}

/**
 * Get all aOi images mapping (for level-based avatars)
 */
export function getAoiImages(): Record<1 | 2 | 3 | 4, string> {
  return {
    1: getAoiImageUrl(1),
    2: getAoiImageUrl(2),
    3: getAoiImageUrl(3),
    4: getAoiImageUrl(4),
  };
}

/**
 * Get all aOi special images
 */
export function getAoiSpecialImages() {
  return {
    fullbodyWelcome: getAoiImage('fullbodyWelcome'),
    guidingLeft: getAoiImage('guidingLeft'),
    pointingRight: getAoiImage('pointingRight'),
    portraitClose: getAoiImage('portraitClose'),
    presentingOpen: getAoiImage('presentingOpen'),
    standingNeutral: getAoiImage('standingNeutral'),
    heroWelcome: getAoiImage('heroWelcome'),
    placeholder: getAoiImage('placeholder'),
  };
}

/**
 * Get TYT logo URL - using local favicon
 */
export function getTYTLogoUrl(): string {
  return '/favicon.svg';
}
