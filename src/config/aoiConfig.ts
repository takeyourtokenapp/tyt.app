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
    baseUrl: '', // Use local assets
    assetsPath: '/aoi',
    imagesPath: '/aoi',
    fallbackToLocal: true, // Use local images
  },

  // aOi visual assets - using local image
  images: {
    fullbodyWelcome: 'image.png',
    guidingLeft: 'image.png',
    pointingRight: 'image.png',
    portraitClose: 'image.png',
    presentingOpen: 'image.png',
    presenting: 'image.png',
    standingNeutral: 'image.png',
    heroWelcome: 'image.png',
    placeholder: 'image.png',
  },

  evolution: {
    levels: [
      {
        level: 1,
        name: 'Beginner Guide',
        xpRequired: 0,
        description: 'Just starting your journey with Aoi',
        image: 'image.png',
      },
      {
        level: 2,
        name: 'Explorer Mentor',
        xpRequired: 100,
        description: 'Exploring the crypto world together',
        image: 'image.png',
      },
      {
        level: 3,
        name: 'Builder Advisor',
        xpRequired: 500,
        description: 'Building knowledge and skills',
        image: 'image.png',
      },
      {
        level: 4,
        name: 'Guardian Master',
        xpRequired: 1500,
        description: 'Guardian of knowledge and compassion',
        image: 'image.png',
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
 * Get aOi image URL from local assets
 * All aOi visuals use the same local image
 */
export function getAoiImageUrl(level: 1 | 2 | 3 | 4): string {
  const levelInfo = getAoiLevelInfo(level);
  const imageName = levelInfo.image;
  return `/aoi/${imageName}`;
}

/**
 * Get specific aOi image by name
 * Returns local image path
 */
export function getAoiImage(imageName: keyof typeof AOI_CONFIG.images): string {
  const fileName = AOI_CONFIG.images[imageName];
  return `/aoi/${fileName}`;
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
 * Get TYT logo URL from tyt.foundation
 */
export function getTYTLogoUrl(): string {
  return `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/${AOI_CONFIG.branding.logo}`;
}
