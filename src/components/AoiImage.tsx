import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getAoiImageByContext, getAoiImageWithFallback, AOI_CONFIG } from '../config/aoiConfig';

interface AoiImageProps {
  context: 'avatar' | 'hero' | 'level' | 'teaching' | 'helping' | 'celebrating' | 'thinking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  level?: 1 | 2 | 3 | 4;
  className?: string;
  alt?: string;
  showFallback?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Smart aOi Image Component
 *
 * Automatically loads the correct aOi image from centralized CDN
 * Falls back to Sparkles icon if image is unavailable
 *
 * Usage:
 * <AoiImage context="hero" size="lg" />
 * <AoiImage context="avatar" size="sm" />
 * <AoiImage context="level" level={3} size="md" />
 */
export default function AoiImage({
  context,
  size = 'md',
  level,
  className = '',
  alt = 'aOi AI Assistant',
  showFallback = true,
  onLoad,
  onError,
}: AoiImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the correct image URL based on context
    const imageUrl = getAoiImageByContext(context, size, level);
    setCurrentUrl(imageUrl);
    setImageLoaded(false);
    setImageError(false);
  }, [context, size, level]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    onError?.();

    // Try fallback URL if available
    if (currentUrl && currentUrl.includes(AOI_CONFIG.cdn.primary)) {
      const fallbackUrl = currentUrl.replace(AOI_CONFIG.cdn.primary, AOI_CONFIG.cdn.fallback);
      setCurrentUrl(fallbackUrl);
    }
  };

  // Size classes for Sparkles fallback icon
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Container size classes
  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // If no image URL or error occurred, show Sparkles fallback
  if (!currentUrl || (imageError && showFallback)) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ${containerSizeClasses[size]} ${className}`}
      >
        <Sparkles className={`${iconSizeClasses[size]} text-white`} />
      </div>
    );
  }

  return (
    <div className={`relative ${containerSizeClasses[size]} ${className}`}>
      <img
        src={currentUrl}
        alt={alt}
        className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Preload critical aOi images
 * Call this on app init to preload important images
 */
export function preloadAoiImages(contexts: Array<{
  context: AoiImageProps['context'];
  size?: AoiImageProps['size'];
  level?: AoiImageProps['level'];
}>) {
  contexts.forEach(({ context, size = 'md', level }) => {
    const imageUrl = getAoiImageByContext(context, size, level);
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
    }
  });
}

/**
 * Hook to check if aOi CDN is available
 */
export function useAoiCdnStatus() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCdn = async () => {
      try {
        const testUrl = `${AOI_CONFIG.cdn.primary}/fallback/aoi-placeholder.svg`;
        const response = await fetch(testUrl, { method: 'HEAD', timeout: AOI_CONFIG.cdn.timeout });
        setIsAvailable(response.ok);
      } catch (error) {
        setIsAvailable(false);
      }
    };

    checkCdn();
  }, []);

  return isAvailable;
}
