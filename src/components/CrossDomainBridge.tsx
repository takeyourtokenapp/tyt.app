import { ExternalLink, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAoi } from '../contexts/AoiContext';
import type { AoiBridgeType } from '../types/aoi';

interface CrossDomainBridgeProps {
  type: AoiBridgeType;
  context?: Record<string, any>;
  className?: string;
  variant?: 'button' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

const BRIDGE_CONFIGS = {
  'to-foundation': {
    targetDomain: 'https://tyt.foundation',
    targetPath: '/',
    label: 'Visit TYT Foundation',
    description: 'Learn about our mission to support children with brain cancer',
    icon: Heart,
    gradient: 'from-pink-500 to-purple-600',
  },
  'to-app': {
    targetDomain: 'https://takeyourtoken.app',
    targetPath: '/app/dashboard',
    label: 'Go to App',
    description: 'Access your miners, rewards, and academy',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-600',
  },
};

export default function CrossDomainBridge({
  type,
  context = {},
  className = '',
  variant = 'button',
  size = 'md',
}: CrossDomainBridgeProps) {
  const { user } = useAuth();
  const { progress, logInteraction } = useAoi();
  const config = BRIDGE_CONFIGS[type];
  const Icon = config.icon;

  const handleNavigate = async () => {
    const url = new URL(config.targetPath, config.targetDomain);

    if (user && progress) {
      url.searchParams.set('aoi_level', progress.level.toString());
      url.searchParams.set('aoi_xp', progress.experience_points.toString());
    }

    if (context && Object.keys(context).length > 0) {
      url.searchParams.set('context', JSON.stringify(context));
    }

    await logInteraction('cross_domain_navigation', {
      from: 'takeyourtoken.app',
      to: config.targetDomain,
      type,
      user_level: progress?.level,
      context,
    });

    if (window.opener && window.opener !== window) {
      window.opener.postMessage(
        {
          type: 'AOI_SYNC_REQUEST',
          data: {
            level: progress?.level,
            xp: progress?.experience_points,
            timestamp: new Date().toISOString(),
          },
          source: 'takeyourtoken.app',
        },
        config.targetDomain
      );
    }

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleNavigate}
        className={`inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors ${className}`}
      >
        {config.label}
        <ExternalLink className="w-3 h-3" />
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div
        onClick={handleNavigate}
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${config.gradient} p-6 cursor-pointer hover:scale-105 transition-transform duration-300 ${className}`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <Icon className="w-12 h-12 text-white" />
            <ExternalLink className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{config.label}</h3>

          {config.description && (
            <p className="text-white/90 text-sm mb-4">{config.description}</p>
          )}

          <div className="flex items-center gap-2 text-white font-semibold">
            Visit Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} bg-gradient-to-r ${config.gradient} text-white rounded-lg hover:opacity-90 transition-opacity font-semibold ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      {config.label}
      <ExternalLink className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
    </button>
  );
}
