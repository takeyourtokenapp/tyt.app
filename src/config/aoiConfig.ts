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
  cdn: {
    baseUrl: 'https://tyt.foundation',
    assetsPath: '/assets/aoi',
    imagesPath: '/assets/aoi/images',
    fallbackToLocal: true, // Use local images if CDN unavailable
  },

  evolution: {
    levels: [
      {
        level: 1,
        name: 'Beginner Guide',
        xpRequired: 0,
        description: 'Just starting your journey with Aoi',
        image: 'chatgpt_image_24_дек._2025_г.,_22_53_12.png',
      },
      {
        level: 2,
        name: 'Explorer Mentor',
        xpRequired: 100,
        description: 'Exploring the crypto world together',
        image: '39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png',
      },
      {
        level: 3,
        name: 'Builder Advisor',
        xpRequired: 500,
        description: 'Building knowledge and skills',
        image: '6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png',
      },
      {
        level: 4,
        name: 'Guardian Master',
        xpRequired: 1500,
        description: 'Guardian of knowledge and compassion',
        image: '04158264-901b-4e6d-9ab6-732b63335cbf.png',
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
 * Get aOi image URL from CDN or local fallback
 * Images are hosted on tyt.foundation but can fall back to local
 */
export function getAoiImageUrl(level: 1 | 2 | 3 | 4): string {
  const levelInfo = getAoiLevelInfo(level);
  const imageName = levelInfo.image;

  // Primary: Load from tyt.foundation CDN
  const cdnUrl = `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/${imageName}`;

  // Fallback: Local images (if CDN is unavailable)
  const localUrl = `/aoi/${imageName}`;

  // For now, return CDN URL (browser will handle fallback via onerror)
  // In production, you might want to implement health check logic
  return cdnUrl;
}

/**
 * Get all aOi images mapping
 */
export function getAoiImages(): Record<1 | 2 | 3 | 4, string> {
  return {
    1: getAoiImageUrl(1),
    2: getAoiImageUrl(2),
    3: getAoiImageUrl(3),
    4: getAoiImageUrl(4),
  };
}
