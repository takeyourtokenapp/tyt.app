import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Heart, ExternalLink } from 'lucide-react';
import { useAoi } from '../contexts/AoiContext';
import { getAoiImage } from '../config/aoiConfig';

// Use portrait-close for chat messages (small circular avatars)
const AOI_CHAT_AVATAR = getAoiImage('portraitClose');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'aoi';
  timestamp: Date;
}

interface AoiChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  context?: Record<string, any>;
}

export default function AoiChatWidget({
  isOpen,
  onClose,
  context,
}: AoiChatWidgetProps) {
  const { progress, askAoi, foundationOnline, getFoundationLinks } = useAoi();
  const links = getFoundationLinks();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Aoi, your learning companion. I'm here to help you understand blockchain, mining, and the TYT ecosystem. What would you like to know?",
      sender: 'aoi',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenAoi = () => {
      if (isOpen) {
        return;
      }
    };

    window.addEventListener('openAoi', handleOpenAoi);
    return () => window.removeEventListener('openAoi', handleOpenAoi);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && context?.initialMessage && !hasProcessedInitialMessage) {
      const initialMessage = context.initialMessage;
      setInput(initialMessage);
      setHasProcessedInitialMessage(true);

      setTimeout(async () => {
        if (initialMessage.trim()) {
          const userMessage: Message = {
            id: Date.now().toString(),
            text: initialMessage,
            sender: 'user',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, userMessage]);
          setInput('');
          setIsLoading(true);

          try {
            const response = await askAoi(initialMessage, context);

            const aoiMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: response,
              sender: 'aoi',
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aoiMessage]);
          } catch (error) {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: "I'm having trouble responding right now. Please try again.",
              sender: 'aoi',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        }
      }, 500);
    }

    if (!isOpen) {
      setHasProcessedInitialMessage(false);
    }
  }, [isOpen, context, hasProcessedInitialMessage, askAoi]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAoi(input, context);

      const aoiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'aoi',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aoiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again.",
        sender: 'aoi',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[90vh] bg-secondary border-2 border-accent/50 rounded-2xl shadow-2xl aoi-widget flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-accent to-amber-500 p-4 flex items-center justify-between border-b border-accent/30">
        <div className="flex items-center gap-3">
          {/* Use presenting-open for chat header - welcoming and open gesture */}
          <img
            src={getAoiImage('presentingOpen')}
            alt="aOi"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/aoi/presenting-open.png';
            }}
          />
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              aOi
              {foundationOnline && (
                <span className="w-2 h-2 bg-success rounded-full animate-pulse aoi-glow" title="Connected to TYT Foundation" />
              )}
            </h3>
            <p className="text-xs text-white/90">AI Learning Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-accent/10 border-b border-secondary">
        <div className="space-y-2">
          <a
            href={links.home}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-secondary-text hover:text-pink-400 transition-colors group"
          >
            <Heart className="w-3 h-3 text-pink-400" />
            <span>Powered by TYT Children's Brain Cancer Foundation</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          {foundationOnline && (
            <div className="flex items-center gap-2 text-xs text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Connected to Foundation AI at tyt.foundation</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'aoi' && (
              <img
                src={AOI_CHAT_AVATAR}
                alt="aOi"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 flex-shrink-0 self-end"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/aoi/portrait-close.png';
                }}
              />
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user'
                  ? 'bg-accent text-white font-medium'
                  : 'aoi-chat-bubble text-primary-text'
              }`}
            >
              {message.sender === 'aoi' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span className="text-xs font-semibold text-accent">aOi</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <img
              src={AOI_CHAT_AVATAR}
              alt="aOi"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 flex-shrink-0 self-end"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/aoi/portrait-close.png';
              }}
            />
            <div className="aoi-chat-bubble rounded-2xl p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span className="text-sm text-primary-text font-medium">aOi is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-secondary border-t border-primary">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask aOi anything..."
            className="flex-1 bg-tertiary text-primary-text rounded-lg px-4 py-2 border-2 border-accent/30 focus:outline-none focus:border-accent placeholder-tertiary-text"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-accent to-amber-500 text-white font-bold rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <a
              href={links.aboutAoi}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded text-xs text-blue-300 transition-all flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              About aOi
            </a>
            <a
              href={links.research}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-2 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded text-xs text-purple-300 transition-all flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Research
            </a>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Level {progress?.level || 1} • {progress?.experience_points || 0} XP
            </span>
            <span className={`flex items-center gap-1 ${foundationOnline ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {foundationOnline ? 'Foundation AI' : 'Local Mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
