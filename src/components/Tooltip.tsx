import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  icon?: boolean;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
  icon = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = -tooltipRect.height - 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.height + 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = -tooltipRect.width - 8;
          break;
        case 'right':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.width + 8;
          break;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          aria-label="More information"
        >
          {icon && <Info className="w-3.5 h-3.5 text-gray-300" />}
        </button>
      )}

      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
              position === 'top'
                ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r'
                : position === 'bottom'
                ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'left'
                ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t'
                : 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
            }`}
          />
        </div>
      )}
    </div>
  );
}

export function FeeModelTooltip() {
  return (
    <Tooltip
      content={
        <div className="w-64 text-left whitespace-normal">
          <div className="font-semibold mb-2">Platform Fee: 1%</div>
          <div className="text-xs space-y-1 text-gray-300">
            <div>• 60% → Protocol Revenue</div>
            <div>• 30% → Children's Brain Cancer Foundation</div>
            <div>• 10% → Digital-Interactive-Technology-Blockchain Academia</div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
            All fee parameters controlled by veTYT governance
          </div>
        </div>
      }
      position="bottom"
      icon
    />
  );
}
