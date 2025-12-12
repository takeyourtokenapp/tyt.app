export function OwlWarriorIllustration({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <defs>
        <linearGradient id="owl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D2A44C" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx="100" cy="100" r="80" fill="url(#owl-gradient)" opacity="0.1" />
      <circle cx="100" cy="100" r="60" fill="url(#owl-gradient)" opacity="0.2" />

      <g filter="url(#glow)">
        <path
          d="M100 40 L110 50 L120 45 L125 60 L115 70 L100 80 L85 70 L75 60 L80 45 L90 50 Z"
          fill="#1F2937"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />

        <circle cx="85" cy="70" r="12" fill="#D2A44C" opacity="0.8" />
        <circle cx="115" cy="70" r="12" fill="#D2A44C" opacity="0.8" />
        <circle cx="85" cy="70" r="6" fill="#0A1122" />
        <circle cx="115" cy="70" r="6" fill="#0A1122" />
        <circle cx="87" cy="68" r="2" fill="#D2A44C" />
        <circle cx="117" cy="68" r="2" fill="#D2A44C" />

        <path
          d="M100 80 L95 90 L100 95 L105 90 Z"
          fill="#F59E0B"
          stroke="#D2A44C"
          strokeWidth="1"
        />

        <path
          d="M60 90 L70 100 L75 110 L80 100 L85 110 L90 100 L85 90 Z"
          fill="#1F2937"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />
        <path
          d="M140 90 L130 100 L125 110 L120 100 L115 110 L110 100 L115 90 Z"
          fill="#1F2937"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />

        <rect
          x="85"
          y="100"
          width="30"
          height="40"
          rx="5"
          fill="#374151"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />

        <line x1="95" y1="110" x2="95" y2="130" stroke="#D2A44C" strokeWidth="2" />
        <line x1="105" y1="110" x2="105" y2="130" stroke="#D2A44C" strokeWidth="2" />
        <rect x="90" y="125" width="20" height="8" fill="#D2A44C" rx="2" />

        <circle cx="100" cy="120" r="8" fill="#1F2937" stroke="#D2A44C" strokeWidth="2" />
        <rect x="97" y="115" width="6" height="10" fill="#D2A44C" />

        <path
          d="M80 135 L75 160 L85 160 L85 140 Z"
          fill="#374151"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />
        <path
          d="M120 135 L125 160 L115 160 L115 140 Z"
          fill="#374151"
          stroke="url(#owl-gradient)"
          strokeWidth="2"
        />

        <path
          d="M115 115 L140 110 L145 125 L130 130 Z"
          fill="#6B7280"
          stroke="#D2A44C"
          strokeWidth="2"
        />
        <path
          d="M135 115 L145 110 L150 115 L143 120 Z"
          fill="#D2A44C"
        />
      </g>

      <circle cx="50" cy="70" r="2" fill="#D2A44C" opacity="0.5" className="animate-pulse" />
      <circle cx="150" cy="70" r="2" fill="#D2A44C" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      <circle cx="100" cy="40" r="2" fill="#F59E0B" opacity="0.5" className="animate-pulse" style={{ animationDelay: '1s' }} />
    </svg>
  );
}

export function MiningIllustration({ size = 150 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mining-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <rect x="30" y="50" width="90" height="60" rx="5" fill="#1F2937" stroke="url(#mining-gradient)" strokeWidth="2" />
      <rect x="35" y="55" width="35" height="25" fill="#059669" opacity="0.3" />
      <rect x="75" y="55" width="40" height="25" fill="#059669" opacity="0.3" />
      <rect x="35" y="85" width="80" height="3" fill="url(#mining-gradient)" />

      <circle cx="45" cy="67" r="2" fill="#10B981" className="animate-pulse" />
      <circle cx="55" cy="67" r="2" fill="#10B981" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <circle cx="45" cy="72" r="2" fill="#10B981" className="animate-pulse" style={{ animationDelay: '0.4s' }} />

      <line x1="85" y1="60" x2="110" y2="60" stroke="#10B981" strokeWidth="1" className="animate-pulse" />
      <line x1="85" y1="67" x2="105" y2="67" stroke="#10B981" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <line x1="85" y1="74" x2="108" y2="74" stroke="#10B981" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.6s' }} />

      <path d="M75 30 L85 40 L80 45 L75 40 L70 45 L65 40 Z" fill="#F59E0B" stroke="#D2A44C" strokeWidth="1" />
    </svg>
  );
}

export function FoundationIllustration({ size = 150 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      <path
        d="M75 110 L75 50 C75 45 70 40 65 40 C60 40 55 45 55 50 L55 65 L75 85 L95 65 L95 50 C95 45 90 40 85 40 C80 40 75 45 75 50 L75 110"
        fill="url(#heart-gradient)"
        opacity="0.3"
      />

      <path
        d="M75 120 C60 105 45 90 45 70 C45 60 52 52 62 52 C68 52 73 55 75 60 C77 55 82 52 88 52 C98 52 105 60 105 70 C105 90 90 105 75 120 Z"
        fill="url(#heart-gradient)"
        className="animate-pulse"
      />

      <circle cx="65" cy="60" r="3" fill="white" opacity="0.5" />
      <circle cx="75" cy="85" r="8" fill="white" opacity="0.2" />

      <circle cx="75" cy="40" r="2" fill="#EC4899" className="animate-ping" />
      <circle cx="50" cy="70" r="2" fill="#EF4444" className="animate-ping" style={{ animationDelay: '0.5s' }} />
      <circle cx="100" cy="70" r="2" fill="#EC4899" className="animate-ping" style={{ animationDelay: '1s' }} />
    </svg>
  );
}

export function ShieldIllustration({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      <path
        d="M60 20 L90 35 L90 60 C90 75 80 87 60 95 C40 87 30 75 30 60 L30 35 Z"
        fill="url(#shield-gradient)"
        opacity="0.3"
      />

      <path
        d="M60 25 L85 38 L85 58 C85 71 77 81 60 88 C43 81 35 71 35 58 L35 38 Z"
        fill="url(#shield-gradient)"
        stroke="#3B82F6"
        strokeWidth="2"
      />

      <path
        d="M50 55 L57 62 L72 47"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="60" cy="55" r="15" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
