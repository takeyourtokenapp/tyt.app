/**
 * aOi CDN Health Check Utility
 *
 * Checks if tyt.foundation CDN is available and images are accessible
 */

import { AOI_CONFIG } from '../config/aoiConfig';

interface CdnHealthStatus {
  available: boolean;
  latency: number;
  error?: string;
}

/**
 * Check if aOi CDN is available
 */
export async function checkAoiCdnHealth(): Promise<CdnHealthStatus> {
  const startTime = performance.now();

  try {
    const response = await fetch(
      `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/chatgpt_image_24_дек._2025_г.,_22_53_12.png`,
      {
        method: 'HEAD',
        mode: 'no-cors', // Avoid CORS issues for health check
        cache: 'no-cache',
      }
    );

    const latency = performance.now() - startTime;

    // With no-cors mode, we can't read the response, but if it doesn't throw, it's available
    return {
      available: true,
      latency: Math.round(latency),
    };
  } catch (error) {
    const latency = performance.now() - startTime;

    return {
      available: false,
      latency: Math.round(latency),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Preload critical aOi images for better performance
 */
export function preloadAoiImages(levels: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4]): void {
  levels.forEach(level => {
    const levelInfo = AOI_CONFIG.evolution.levels.find(l => l.level === level);
    if (!levelInfo) return;

    const img = new Image();
    const cdnUrl = `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/${levelInfo.image}`;

    img.src = cdnUrl;

    // Fallback to local if CDN fails
    img.onerror = () => {
      img.src = `/aoi/${levelInfo.image}`;
    };
  });
}

/**
 * Get image URL with CDN health awareness
 * This is a more advanced version that checks CDN health first
 */
let cdnHealthCache: { status: boolean; timestamp: number } | null = null;
const CDN_HEALTH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAoiImageUrlSmart(level: 1 | 2 | 3 | 4): Promise<string> {
  const levelInfo = AOI_CONFIG.evolution.levels.find(l => l.level === level);
  if (!levelInfo) {
    return `/aoi/chatgpt_image_24_дек._2025_г.,_22_53_12.png`; // fallback
  }

  // Check cached health status
  const now = Date.now();
  if (cdnHealthCache && (now - cdnHealthCache.timestamp) < CDN_HEALTH_CACHE_TTL) {
    if (cdnHealthCache.status) {
      return `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/${levelInfo.image}`;
    } else {
      return `/aoi/${levelInfo.image}`;
    }
  }

  // Check CDN health
  try {
    const health = await checkAoiCdnHealth();
    cdnHealthCache = {
      status: health.available,
      timestamp: now,
    };

    if (health.available) {
      return `${AOI_CONFIG.cdn.baseUrl}${AOI_CONFIG.cdn.imagesPath}/${levelInfo.image}`;
    }
  } catch (error) {
    console.warn('CDN health check failed, using local images', error);
    cdnHealthCache = {
      status: false,
      timestamp: now,
    };
  }

  // Fallback to local
  return `/aoi/${levelInfo.image}`;
}

/**
 * Clear CDN health cache (useful for testing)
 */
export function clearCdnHealthCache(): void {
  cdnHealthCache = null;
}
