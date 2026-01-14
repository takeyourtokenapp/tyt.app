import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getAoiLevelInfo } from '../config/aoiConfig';
import AoiImage from './AoiImage';

interface AoiAvatarProps {
  level?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showLevel?: boolean;
  interactive?: boolean;
  onInteract?: () => void;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
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
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-md transition-opacity duration-300 ${
            pulseActive || isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        />

        {/* aOi Image from centralized CDN */}
        <div className="relative z-10 w-full h-full">
          <AoiImage
            context="level"
            size={size}
            level={level}
            className="border-2 border-blue-400/50 shadow-lg"
            showFallback={true}
          />
        </div>

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
          <div className="absolute -top-2 -right-2 z-20 animate-bounce">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
        )}
      </div>

      {showName && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-white">Aoi</span>
          {showLevel && (
            <span className="text-xs text-gray-400">{getAoiLevelInfo(level).name}</span>
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
