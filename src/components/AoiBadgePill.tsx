import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getAoiImages, getAoiLevelInfo } from '../config/aoiConfig';

interface AoiBadgePillProps {
  level?: 1 | 2 | 3 | 4;
  onClick?: () => void;
  className?: string;
  showOnlineStatus?: boolean;
}

const AOI_IMAGES = getAoiImages();

export default function AoiBadgePill({
  level = 4,
  onClick,
  className = '',
  showOnlineStatus = true,
}: AoiBadgePillProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative flex items-center gap-2.5 px-3 py-1.5
        bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-sm
        border border-slate-700/50 hover:border-indigo-500/60
        rounded-full transition-all duration-300
        hover:shadow-lg hover:shadow-indigo-500/30
        hover:scale-105
        ${className}
      `}
      aria-label="Chat with aOi"
    >
      {/* Avatar with online status */}
      <div className="relative">
        <img
          src={AOI_IMAGES[level]}
          alt="aOi"
          className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-400/70 transition-all"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.startsWith('/aoi/')) {
              target.src = `/aoi/${getAoiLevelInfo(level).image}`;
            }
          }}
        />
        {showOnlineStatus && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
        )}

        {/* Glow effect on hover */}
        <div
          className={`
            absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-500/40 blur-md
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </div>

      {/* Text */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
          aOi
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
          AI Guide
        </span>
      </div>

      {/* Sparkle icon on hover */}
      <Sparkles
        className={`
          w-3.5 h-3.5 text-indigo-400
          transition-all duration-300
          ${isHovered ? 'opacity-100 scale-110 rotate-12' : 'opacity-0 scale-50'}
        `}
      />

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-slate-200 text-xs px-3 py-1.5 rounded-lg shadow-xl z-50 border border-indigo-500/40">
          Ask me anything
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-l border-indigo-500/40" />
        </div>
      )}
    </button>
  );
}
