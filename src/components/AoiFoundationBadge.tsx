import { Heart, ExternalLink, Activity } from 'lucide-react';
import { useAoi } from '../contexts/AoiContext';
import { AOI_CONFIG } from '../config/aoiConfig';

interface AoiFoundationBadgeProps {
  variant?: 'compact' | 'full' | 'minimal';
  showStatus?: boolean;
}

export default function AoiFoundationBadge({
  variant = 'compact',
  showStatus = true,
}: AoiFoundationBadgeProps) {
  const { foundationOnline, getFoundationLinks } = useAoi();
  const links = getFoundationLinks();

  if (variant === 'minimal') {
    return (
      <a
        href={links.home}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 transition-colors"
      >
        <Heart className="w-3 h-3" />
        <span>Powered by TYT Foundation</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-lg border border-pink-500/30">
        <Heart className="w-4 h-4 text-pink-400" />
        <div className="flex-1">
          <div className="text-xs font-semibold text-white">
            TYT Foundation
          </div>
          {showStatus && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Activity
                className={`w-2.5 h-2.5 ${
                  foundationOnline ? 'text-green-400' : 'text-gray-500'
                }`}
              />
              <span>{foundationOnline ? 'Online' : 'Offline'}</span>
            </div>
          )}
        </div>
        <a
          href={links.home}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-pink-500/30 p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white">
              TYT Children's Brain Cancer Foundation
            </h3>
            {showStatus && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  foundationOnline
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>{foundationOnline ? 'Connected' : 'Offline'}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-300 mb-3">
            aOi's home and knowledge base. Every conversation supports research
            into childhood brain cancer.
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={links.home}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-sm transition-colors"
            >
              <span>Visit Foundation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={links.aboutAoi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
            >
              <span>About aOi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Donate</span>
            </a>
          </div>
        </div>
      </div>

      {foundationOnline && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-500">
            🌐 Connected to {AOI_CONFIG.foundation.domain}
            <br />
            All AI responses are processed through the Foundation's secure API
          </p>
        </div>
      )}
    </div>
  );
}
