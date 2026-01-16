import { Shield, Eye, CheckCircle, ExternalLink } from 'lucide-react';

interface OrbitalBadgeProps {
  type: 'reward' | 'burn' | 'foundation' | 'maintenance';
  verified?: boolean;
  witnessHash?: string;
  blockNumber?: number;
  blockchain?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function OrbitalBadge({
  type,
  verified = false,
  witnessHash,
  blockNumber,
  blockchain,
  size = 'sm',
  showDetails = false
}: OrbitalBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const typeColors = {
    reward: 'from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-400',
    burn: 'from-orange-500/20 to-red-500/20 border-orange-500/40 text-orange-400',
    foundation: 'from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-400',
    maintenance: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400'
  };

  const typeLabels = {
    reward: 'Reward',
    burn: 'Burn',
    foundation: 'Foundation',
    maintenance: 'Maintenance'
  };

  if (!showDetails) {
    // Compact badge view
    return (
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full border
          ${sizes[size]} ${typeColors[type]}
          bg-gradient-to-r font-medium
          transition-all hover:scale-105
        `}
        title={`${typeLabels[type]} witnessed on Orbital Layer`}
      >
        {verified ? (
          <CheckCircle className={iconSizes[size]} />
        ) : (
          <Eye className={iconSizes[size]} />
        )}
        <span>Orbital</span>
      </div>
    );
  }

  // Detailed badge view
  return (
    <div className={`bg-gradient-to-br rounded-lg border p-3 ${typeColors[type]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="font-semibold text-sm">Orbital Witness</span>
        </div>
        {verified && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-tertiary-text">Type:</span>
          <span className="ml-2 font-medium">{typeLabels[type]}</span>
        </div>

        {witnessHash && (
          <div>
            <span className="text-tertiary-text">Hash:</span>
            <div className="font-mono text-xs mt-1 truncate">
              {witnessHash}
            </div>
          </div>
        )}

        {blockchain && blockNumber && (
          <div className="pt-2 border-t border-secondary/50">
            <div className="flex items-center justify-between">
              <span className="text-tertiary-text">
                Block: {blockNumber} on {blockchain}
              </span>
              <button className="flex items-center gap-1 hover:text-purple-300">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
