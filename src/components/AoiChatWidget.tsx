import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Heart, ExternalLink } from 'lucide-react';
import { useAoi } from '../contexts/AoiContext';
import AoiAvatar from './AoiAvatar';
import AoiFoundationBadge from './AoiFoundationBadge';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenAoi = () => {
      if (onClose && isOpen) {
        return;
      }
    };

    window.addEventListener('openAoi', handleOpenAoi);
    return () => window.removeEventListener('openAoi', handleOpenAoi);
  }, [isOpen, onClose]);

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
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[90vh] bg-gray-900 border-2 border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-lavender-600 p-4 flex items-center justify-between border-b border-blue-400/30">
        <div className="flex items-center gap-3">
          <AoiAvatar level={progress?.level || 1} size="sm" />
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              aOi
              {foundationOnline && (
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Connected to TYT Foundation" />
              )}
            </h3>
            <p className="text-xs text-blue-100">AI Learning Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border-b border-gray-700">
        <div className="space-y-2">
          <a
            href={links.home}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-pink-400 transition-colors group"
          >
            <Heart className="w-3 h-3 text-pink-400" />
            <span>Powered by TYT Children's Brain Cancer Foundation</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          {foundationOnline && (
            <div className="flex items-center gap-2 text-xs text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Connected to Foundation AI at tyt.foundation</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.sender === 'aoi' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-gray-400">Aoi</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-sm text-gray-300">Aoi is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask aOi anything..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-lavender-600 text-white rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
