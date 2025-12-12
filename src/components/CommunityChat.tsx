import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Smile } from 'lucide-react';

interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  owlRank: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export default function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'System',
      avatar: '🤖',
      owlRank: 'System',
      message: 'Welcome to TYT Community Chat! Be respectful and follow the rules.',
      timestamp: new Date(Date.now() - 3600000),
      isSystem: true
    },
    {
      id: '2',
      username: 'MiningKing_BTC',
      avatar: '👑',
      owlRank: 'Warrior',
      message: 'Just upgraded my miner to 500 TH/s! Who else is crushing it today?',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      username: 'CryptoOliver',
      avatar: '🦉',
      owlRank: 'Warrior',
      message: 'Nice! I just passed the Academy quiz with 95%. XP gains are real!',
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: '4',
      username: 'TokenTina',
      avatar: '💎',
      owlRank: 'Warrior',
      message: 'Don\'t forget to stake for charity! Already donated 500 TYT this month.',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '5',
      username: 'BlockchainSarah',
      avatar: '✨',
      owlRank: 'Diplomat',
      message: 'Anyone else excited for the AMA next week? Got so many questions!',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      avatar: '🦉',
      owlRank: 'Worker',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const responses = [
        'Great point!',
        'I totally agree!',
        'Same here!',
        'Thanks for sharing!',
        'Interesting perspective!'
      ];
      const randomUser = {
        id: (Date.now() + 1).toString(),
        username: 'CommunityMember',
        avatar: '👤',
        owlRank: 'Academic',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, randomUser]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const rankColors: Record<string, string> = {
    System: 'text-gray-400',
    Worker: 'text-gray-300',
    Academic: 'text-blue-400',
    Diplomat: 'text-purple-400',
    Peacekeeper: 'text-amber-400',
    Warrior: 'text-gold-400'
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-blue-700 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)]">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-glass border-b border-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500">
              <MessageCircle size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Live Community Chat</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400">{onlineUsers.toLocaleString()} online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <Users size={18} className="inline mr-2 text-blue-400" />
            <span className="text-sm font-semibold">Global Chat</span>
          </div>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isSystem ? 'justify-center' : ''}`}
          >
            {!msg.isSystem && (
              <div className="text-3xl flex-shrink-0">{msg.avatar}</div>
            )}
            <div className={`flex-1 ${msg.isSystem ? 'text-center' : ''}`}>
              {!msg.isSystem && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{msg.username}</span>
                  <span className={`text-xs ${rankColors[msg.owlRank] || 'text-gray-400'}`}>
                    {msg.owlRank} Owl
                  </span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
              )}
              <div className={`${
                msg.isSystem
                  ? 'inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-300'
                  : 'bg-gray-800/50 rounded-lg px-4 py-2 text-sm text-gray-200'
              }`}>
                {msg.message}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all pr-12"
              maxLength={500}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{inputMessage.length}/500 characters</span>
          <span>Press Enter to send</span>
        </div>
      </div>

      <div className="bg-amber-500/10 border-t border-amber-500/30 px-4 py-3">
        <p className="text-xs text-center text-gray-400">
          💡 <span className="font-semibold text-amber-400">Pro Tip:</span> Share your mining strategies and help others in the community!
        </p>
      </div>
    </div>
  );
}
