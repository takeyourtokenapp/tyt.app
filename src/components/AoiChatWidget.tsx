import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAoi } from '../contexts/AoiContext';
import AoiAvatar from './AoiAvatar';

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
  const { progress, askAoi } = useAoi();
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
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-gray-900 border-2 border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-lavender-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AoiAvatar level={progress?.level || 1} size="sm" />
          <div>
            <h3 className="font-bold text-white">Aoi</h3>
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
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aoi anything..."
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
        <p className="text-xs text-gray-500 mt-2 text-center">
          Level {progress?.level || 1} • {progress?.experience_points || 0} XP
        </p>
      </div>
    </div>
  );
}
