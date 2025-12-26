export const AOI_CONFIG = {
  foundation: {
    domain: 'https://tyt.foundation',
    apiEndpoint: 'https://tyt.foundation/api/aoi',
    websiteUrl: 'https://tyt.foundation',
    aboutUrl: 'https://tyt.foundation/aoi',
    statusUrl: 'https://tyt.foundation/api/status',
  },

  app: {
    domain: 'https://takeyourtoken.app',
    localApiPath: '/api/aoi',
  },

  features: {
    useFoundationApi: true,
    fallbackToLocal: true,
    crossDomainAuth: true,
    sharedSessions: true,
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

  evolution: {
    levels: [
      {
        level: 1,
        name: 'Beginner Guide',
        xpRequired: 0,
        description: 'Just starting your journey with Aoi',
        image: '/aoi/chatgpt_image_24_дек._2025_г.,_22_53_12.png',
      },
      {
        level: 2,
        name: 'Explorer Mentor',
        xpRequired: 100,
        description: 'Exploring the crypto world together',
        image: '/aoi/39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png',
      },
      {
        level: 3,
        name: 'Builder Advisor',
        xpRequired: 500,
        description: 'Building knowledge and skills',
        image: '/aoi/6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png',
      },
      {
        level: 4,
        name: 'Guardian Master',
        xpRequired: 1500,
        description: 'Guardian of knowledge and compassion',
        image: '/aoi/04158264-901b-4e6d-9ab6-732b63335cbf.png',
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
