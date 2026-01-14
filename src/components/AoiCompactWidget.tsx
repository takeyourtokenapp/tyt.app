import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import AoiChatWidget from './AoiChatWidget';
import { getAoiImage } from '../config/aoiConfig';

interface AoiCompactWidgetProps {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  showOnlineStatus?: boolean;
}

// Use portrait-close for compact widget (header badge)
const AOI_AVATAR_URL = getAoiImage('portraitClose');

export default function AoiCompactWidget({
  level = 4,
  className = '',
  showOnlineStatus = true,
}: AoiCompactWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [quickQuestion, setQuickQuestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowInput(false);
        setQuickQuestion('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowInput(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!quickQuestion) {
      setShowInput(false);
    }
  };

  const handleQuickSend = () => {
    if (quickQuestion.trim()) {
      setIsChatOpen(true);
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickSend();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Compact Badge */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={`
            group flex items-center gap-2.5 px-3 py-1.5
            bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-sm
            border border-slate-700/50 hover:border-indigo-500/60
            rounded-full transition-all duration-300
            hover:shadow-lg hover:shadow-indigo-500/30
            ${showInput ? 'scale-105' : 'hover:scale-105'}
          `}
          aria-label="Chat with aOi"
        >
          {/* Avatar with online status */}
          <div className="relative">
            <img
              src={AOI_AVATAR_URL}
              alt="aOi"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-400/70 transition-all"
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
        </button>

        {/* Quick Input Field (appears on hover) */}
        <div
          className={`
            absolute top-full left-0 right-0 mt-2
            transition-all duration-300 origin-top
            ${showInput ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          `}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-xl shadow-2xl shadow-indigo-500/20 p-3 w-80">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Ask aOi anything</span>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 bg-slate-800/50 text-white text-sm px-3 py-2 rounded-lg border border-slate-700/50 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500 transition-all"
              />
              <button
                onClick={handleQuickSend}
                disabled={!quickQuestion.trim()}
                className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                'How does mining work?',
                'What is TYT token?',
                'Tell me about the Foundation',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuickQuestion(suggestion);
                    setTimeout(handleQuickSend, 100);
                  }}
                  className="text-xs px-2 py-1 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-indigo-300 border border-slate-700/30 hover:border-indigo-500/30 rounded-full transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-900 border-t border-l border-indigo-500/40 rotate-45" />
          </div>
        </div>
      </div>

      {/* Full Chat Widget */}
      <AoiChatWidget
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setQuickQuestion('');
        }}
        context={quickQuestion ? { initialMessage: quickQuestion } : undefined}
      />
    </>
  );
}
