import { useId } from 'react';

export function BitcoinIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `bitcoin-gradient-${id}`;
  const neonGradientId = `bitcoin-neon-gradient-${id}`;
  const glowGradientId = `bitcoin-glow-gradient-${id}`;
  const shadowGradientId = `bitcoin-inner-shadow-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={`${className} drop-shadow-[0_0_20px_rgba(230,193,90,0.4)]`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C15A" />
          <stop offset="50%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#CFAE4C" />
        </linearGradient>
        <linearGradient id={neonGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B88CFF" />
          <stop offset="50%" stopColor="#7AD7FF" />
          <stop offset="100%" stopColor="#B88CFF" />
        </linearGradient>
        <linearGradient id={glowGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C15A" />
          <stop offset="100%" stopColor="#CFAE4C" />
        </linearGradient>
        <radialGradient id={shadowGradientId}>
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="#0A1122" />
        </radialGradient>
      </defs>

      <circle
        cx="20"
        cy="20"
        r="19"
        fill="none"
        stroke={`url(#${glowGradientId})`}
        strokeWidth="0.5"
        opacity="0.6"
      />

      <circle
        cx="20"
        cy="20"
        r="18.5"
        fill="none"
        stroke={`url(#${neonGradientId})`}
        strokeWidth="1"
        opacity="0.8"
      />

      <circle
        cx="20"
        cy="20"
        r="17.5"
        fill={`url(#${gradientId})`}
      />

      <circle
        cx="20"
        cy="20"
        r="17.5"
        fill={`url(#${shadowGradientId})`}
        opacity="0.15"
      />

      <circle
        cx="16"
        cy="14"
        r="4"
        fill="white"
        opacity="0.15"
      />

      <g transform="translate(20, 20)">
        <line x1="-1" y1="-10" x2="-1" y2="-7" stroke="#0A1122" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1" y1="-10" x2="1" y2="-7" stroke="#0A1122" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-1" y1="7" x2="-1" y2="10" stroke="#0A1122" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1" y1="7" x2="1" y2="10" stroke="#0A1122" strokeWidth="1.5" strokeLinecap="round" />

        <path
          d="M-3 -7 L-3 7 L3 7 C5.5 7 7 5.5 7 3.5 C7 2 6 1 5 0.5 C6 0 7 -1 7 -2.5 C7 -5 5.5 -7 3 -7 L-3 -7 Z M0 -5 L3 -5 C4 -5 5 -4 5 -2.5 C5 -1 4 0 3 0 L0 0 L0 -5 Z M0 2 L3 2 C4.5 2 5.5 3 5.5 4 C5.5 5 4.5 6 3 6 L0 6 L0 2 Z"
          fill="#0A1122"
          stroke="#0A1122"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function MiningIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="5" y="12" width="30" height="20" rx="2" fill="#1F2937" stroke="#10B981" strokeWidth="1.5" />
      <rect x="8" y="15" width="10" height="7" fill="#10B981" opacity="0.3" />
      <rect x="22" y="15" width="10" height="7" fill="#10B981" opacity="0.3" />
      <line x1="8" y1="27" x2="32" y2="27" stroke="#10B981" strokeWidth="1" />
      <circle cx="11" cy="18" r="1" fill="#10B981" className="animate-pulse" />
      <circle cx="15" cy="18" r="1" fill="#10B981" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <circle cx="11" cy="20" r="1" fill="#10B981" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
      <path d="M20 6l3 4h-2v4h-2v-4h-2z" fill="#F59E0B" />
    </svg>
  );
}

export function ShieldCheckIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `shield-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <path
        d="M20 6L30 11V19C30 25 25 30 20 34C15 30 10 25 10 19V11L20 6Z"
        fill={`url(#${gradientId})`}
        opacity="0.2"
      />
      <path
        d="M20 8L28 12V18C28 23 24.5 27 20 30C15.5 27 12 23 12 18V12L20 8Z"
        fill={`url(#${gradientId})`}
        stroke="#3B82F6"
        strokeWidth="1.5"
      />
      <path
        d="M16 19L18.5 21.5L24 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `heart-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <path
        d="M20 32C14 27 8 22 8 15C8 11 11 8 15 8C17 8 19 9 20 11C21 9 23 8 25 8C29 8 32 11 32 15C32 22 26 27 20 32Z"
        fill={`url(#${gradientId})`}
        className="animate-pulse"
      />
      <circle cx="17" cy="14" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}

export function RocketIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `rocket-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
      </defs>
      <path
        d="M20 6C20 6 28 10 28 18V24L26 28L20 30L14 28L12 24V18C12 10 20 6 20 6Z"
        fill={`url(#${gradientId})`}
      />
      <ellipse cx="20" cy="16" rx="4" ry="6" fill="#1F2937" />
      <ellipse cx="20" cy="16" rx="2" ry="3" fill="#3B82F6" className="animate-pulse" />
      <path d="M14 28L12 34L16 32L14 28Z" fill="#6B7280" />
      <path d="M26 28L28 34L24 32L26 28Z" fill="#6B7280" />
      <circle cx="20" cy="30" r="2" fill="#F59E0B" className="animate-pulse" />
      <circle cx="17" cy="32" r="1" fill="#F59E0B" opacity="0.5" className="animate-ping" />
      <circle cx="23" cy="32" r="1" fill="#F59E0B" opacity="0.5" className="animate-ping" style={{ animationDelay: '0.3s' }} />
    </svg>
  );
}

export function GlobeIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `globe-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="14" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="20" rx="5" ry="14" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" />
      <line x1="6" y1="20" x2="34" y2="20" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path d="M20 6C22 10 23 15 23 20C23 25 22 30 20 34" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" />
      <path d="M20 6C18 10 17 15 17 20C17 25 18 30 20 34" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="20" r="2" fill="#3B82F6" className="animate-pulse" />
    </svg>
  );
}

export function ChartIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="8" y="24" width="4" height="10" fill="#10B981" rx="1" />
      <rect x="14" y="18" width="4" height="16" fill="#3B82F6" rx="1" />
      <rect x="20" y="14" width="4" height="20" fill="#8B5CF6" rx="1" />
      <rect x="26" y="10" width="4" height="24" fill="#F59E0B" rx="1" />
      <path d="M6 8L10 12L16 10L22 6L28 8L34 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="10" cy="12" r="2" fill="#10B981" />
      <circle cx="22" cy="6" r="2" fill="#10B981" />
      <circle cx="34" cy="4" r="2" fill="#10B981" className="animate-pulse" />
    </svg>
  );
}

export function CommunityIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `community-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="12" r="4" fill={`url(#${gradientId})`} />
      <path d="M20 18C16 18 12 20 12 24V28H28V24C28 20 24 18 20 18Z" fill={`url(#${gradientId})`} />
      <circle cx="10" cy="14" r="3" fill={`url(#${gradientId})`} opacity="0.7" />
      <path d="M10 20C7 20 4 21 4 24V26H12V24C12 22 11 21 10 20Z" fill={`url(#${gradientId})`} opacity="0.7" />
      <circle cx="30" cy="14" r="3" fill={`url(#${gradientId})`} opacity="0.7" />
      <path d="M30 20C33 20 36 21 36 24V26H28V24C28 22 29 21 30 20Z" fill={`url(#${gradientId})`} opacity="0.7" />
    </svg>
  );
}

export function LightningIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId();
  const gradientId = `lightning-gradient-${id}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M22 4L10 20H20L18 36L30 20H20L22 4Z"
        fill={`url(#${gradientId})`}
        className="animate-pulse"
      />
      <path
        d="M22 4L10 20H20L18 36L30 20H20L22 4Z"
        stroke="#F59E0B"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
