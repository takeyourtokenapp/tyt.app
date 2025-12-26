import { useEffect, useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface AoiAvatarProps {
  level?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showLevel?: boolean;
  interactive?: boolean;
  onInteract?: () => void;
  className?: string;
}

const AOI_IMAGES = {
  1: '/aoi/chatgpt_image_24_дек._2025_г.,_22_53_12.png',
  2: '/aoi/39afdcdf-bd3e-4c90-ac96-7d7672d2a91d.png',
  3: '/aoi/6daa0cbd-bd97-4d5a-956f-5a2ff414214b.png',
  4: '/aoi/04158264-901b-4e6d-9ab6-732b63335cbf.png',
};

const LEVEL_NAMES = {
  1: 'Beginner Guide',
  2: 'Explorer Mentor',
  3: 'Builder Advisor',
  4: 'Guardian Master',
};

const SIZE_CLASSES = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function AoiAvatar({
  level = 1,
  size = 'md',
  showName = false,
  showLevel = false,
  interactive = false,
  onInteract,
  className = '',
}: AoiAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (interactive) {
      const interval = setInterval(() => {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 2000);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [interactive]);

  const handleClick = () => {
    if (interactive && onInteract) {
      onInteract();
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center gap-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative ${SIZE_CLASSES[size]} ${
          interactive ? 'cursor-pointer' : ''
        } transition-transform duration-300 ${
          isHovered && interactive ? 'scale-110' : 'scale-100'
        }`}
        onClick={handleClick}
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-lavender-400/30 blur-md transition-opacity duration-300 ${
            pulseActive || isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />

        <img
          src={AOI_IMAGES[level]}
          alt={`Aoi - ${LEVEL_NAMES[level]}`}
          className="relative z-10 w-full h-full rounded-full object-cover border-2 border-blue-400/50 shadow-lg"
        />

        {interactive && (
          <div
            className={`absolute -bottom-1 -right-1 z-20 bg-gradient-to-br from-blue-500 to-lavender-500 rounded-full p-1.5 shadow-lg transition-all duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
        )}

        {showLevel && (
          <div className="absolute -top-1 -right-1 z-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900 shadow-lg">
            <span className="text-xs font-bold text-white">{level}</span>
          </div>
        )}

        {pulseActive && interactive && (
          <div className="absolute -top-2 -right-2 z-20">
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>
        )}
      </div>

      {showName && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-white">Aoi</span>
          {showLevel && (
            <span className="text-xs text-gray-400">{LEVEL_NAMES[level]}</span>
          )}
        </div>
      )}

      {isHovered && interactive && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-30 border border-blue-500/30">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3 h-3" />
            <span>Ask Aoi for help</span>
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-t border-l border-blue-500/30" />
        </div>
      )}
    </div>
  );
}
