import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles, User as UserIcon, Heart, ExternalLink, Home } from 'lucide-react';
import { useAoi } from '../contexts/AoiContext';
import { useAoiControl } from '../contexts/AoiControlContext';
import { useAuth } from '../contexts/AuthContext';
import AoiAvatar from './AoiAvatar';
import { AOI_CONFIG } from '../config/aoiConfig';

interface Message {
  id: string;
  sender: 'user' | 'aoi';
  message: string;
  timestamp: Date;
}

export default function LiveSupportWidget() {
  const { user } = useAuth();
  const { askAoi, progress, foundationOnline } = useAoi();
  const aoiControl = useAoiControl();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'aoi',
      message: "Hello! I'm aOi (葵), your guide and controller of the TYT ecosystem. I manage all elements of takeyourtoken.app and bridge it with tyt.foundation. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && unreadCount > 0) {
      const pulse = setInterval(() => {
        const badge = document.getElementById('support-badge');
        if (badge) {
          badge.classList.add('animate-ping');
          setTimeout(() => badge.classList.remove('animate-ping'), 1000);
        }
      }, 3000);

      return () => clearInterval(pulse);
    }
  }, [isOpen, unreadCount]);

  useEffect(() => {
    const handleOpenAoi = () => {
      handleOpen();
    };

    window.addEventListener('openAoi', handleOpenAoi);
    return () => window.removeEventListener('openAoi', handleOpenAoi);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get full user context through AoiControl
      const context = user ? await aoiControl.getCurrentContext() : null;

      // Ask aOi with full context
      const response = await askAoi(currentInput, context || {});

      const aoiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'aoi',
        message: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aoiMessage]);

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('aOi error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'aoi',
        message: "I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const quickReplies = [
    'How do I buy a miner?',
    'What are the fees?',
    'How do withdrawals work?',
    'Tell me about the Foundation'
  ];

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        title="Chat with aOi - Your AI Guide"
      >
        <Sparkles size={28} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span
            id="support-badge"
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
          >
            {unreadCount}
          </span>
        )}
        {foundationOnline && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" title="Connected to Foundation" />
        )}
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-gray-900 border-2 border-blue-500 rounded-2xl shadow-2xl transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AoiAvatar level={progress?.level || 1} size="sm" />
          <div className="text-white">
            <div className="font-bold flex items-center gap-2">
              aOi (葵)
              {foundationOnline && (
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Connected to tyt.foundation" />
              )}
            </div>
            <div className="text-xs flex items-center gap-1">
              <Sparkles size={12} className="text-amber-300" />
              <span>AI Guide & Platform Controller</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="border-b border-gray-700">
            <div className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span>Connecting Technology & Medicine for Children</span>
                </div>
                <a
                  href={AOI_CONFIG.foundation.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Visit aOi's home at tyt.foundation"
                >
                  <Home className="w-3 h-3" />
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            {foundationOnline && (
              <div className="px-4 py-1.5 bg-green-500/10 text-xs">
                <div className="flex items-center gap-2 text-green-400">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium">Connected to tyt.foundation</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-300">Cross-domain AI active</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-[380px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {msg.sender === 'user' ? (
                    <UserIcon size={18} className="text-white" />
                  ) : (
                    <Sparkles size={18} className="text-white" />
                  )}
                </div>
                <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-white animate-pulse" />
                </div>
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-3">
              <div className="text-xs text-gray-400 mb-2">Quick replies:</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(reply);
                      handleSendMessage();
                    }}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded-full border border-gray-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask aOi anything..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                maxLength={500}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-500">
                aOi guides, but doesn't give medical or financial advice
              </span>
              <span className={`flex items-center gap-1 ${foundationOnline ? 'text-green-400' : 'text-gray-500'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {foundationOnline ? 'Foundation AI' : 'Local Mode'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
