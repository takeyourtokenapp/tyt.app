import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAoiExplain, type ExplainSubjectType } from '../hooks/useAoiExplain';

interface AoiExplainButtonProps {
  subjectType: ExplainSubjectType;
  subjectId?: string;
  contextData?: Record<string, any>;
  variant?: 'icon' | 'text' | 'pill';
  className?: string;
  size?: 'sm' | 'md';
}

export function AoiExplainButton({
  subjectType,
  subjectId,
  contextData,
  variant = 'icon',
  className = '',
  size = 'sm'
}: AoiExplainButtonProps) {
  const { explain, isExplaining } = useAoiExplain({ subjectType, subjectId, contextData });

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    explain();
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isExplaining}
        className={`
          inline-flex items-center justify-center rounded-full
          bg-purple-500/10 hover:bg-purple-500/20
          text-purple-600 dark:text-purple-400
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          group relative
          ${sizeClasses[size]}
          ${className}
        `}
        title="Ask aOi to explain this"
        aria-label="Explain with aOi"
      >
        <Sparkles className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ${isExplaining ? 'animate-pulse' : ''}`} />

        <span className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
          whitespace-nowrap z-50
        ">
          Ask aOi
        </span>
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={isExplaining}
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded
          text-purple-600 dark:text-purple-400 hover:bg-purple-500/10
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${size === 'sm' ? 'text-xs' : 'text-sm'}
          ${className}
        `}
      >
        <Sparkles className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ${isExplaining ? 'animate-pulse' : ''}`} />
        <span>Explain</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isExplaining}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-gradient-to-r from-purple-500/20 to-pink-500/20
        hover:from-purple-500/30 hover:to-pink-500/30
        text-purple-600 dark:text-purple-400
        border border-purple-500/30
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
        ${className}
      `}
    >
      <Sparkles className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ${isExplaining ? 'animate-pulse' : ''}`} />
      <span>Ask aOi</span>
    </button>
  );
}
