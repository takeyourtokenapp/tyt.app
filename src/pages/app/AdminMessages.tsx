import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Mail,
  User,
  Calendar,
  ExternalLink,
  AlertCircle,
  Download
} from 'lucide-react';

interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_answered: boolean;
  created_at: string;
  answered_at: string | null;
  user_email?: string;
}

export default function AdminMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'answered'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin && profile?.role !== 'admin') {
        window.location.href = '/app';
        return;
      }

      loadMessages();
    } catch (error) {
      console.error('Error checking admin access:', error);
      window.location.href = '/app';
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const markAsAnswered = async (messageId: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({
          is_answered: true,
          answered_at: new Date().toISOString()
        })
        .eq('id', messageId);

      setMessages(messages.map(msg =>
        msg.id === messageId
          ? { ...msg, is_answered: true, answered_at: new Date().toISOString() }
          : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as answered:', error);
    }
  };

  const openMessageDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetails(true);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const exportMessages = () => {
    const csv = [
      ['Date', 'Name', 'Email', 'Subject', 'Message', 'Status'],
      ...filteredMessages.map(msg => [
        new Date(msg.created_at).toLocaleString(),
        msg.name,
        msg.email,
        msg.subject,
        msg.message.replace(/\n/g, ' '),
        msg.is_answered ? 'Answered' : msg.is_read ? 'Read' : 'Unread'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = searchQuery === '' ||
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !msg.is_read) ||
      (filterStatus === 'read' && msg.is_read && !msg.is_answered) ||
      (filterStatus === 'answered' && msg.is_answered);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    read: messages.filter(m => m.is_read && !m.is_answered).length,
    answered: messages.filter(m => m.is_answered).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-500" />
                Contact Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all contact form submissions from users and visitors
              </p>
            </div>
            <button
              onClick={exportMessages}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.unread}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.read}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Answered</p>
                  <p className="text-2xl font-bold text-green-500">{stats.answered}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'unread'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilterStatus('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'read'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setFilterStatus('answered')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'answered'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Answered
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No messages found</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => openMessageDetails(message)}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                    !message.is_read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {message.subject}
                        </h3>
                        {!message.is_read && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-full">
                            New
                          </span>
                        )}
                        {message.is_answered && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                            Answered
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {message.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {message.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!message.is_answered && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsAnswered(message.id);
                          }}
                          className="px-3 py-1 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Mark Answered
                        </button>
                      )}
                      <a
                        href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Mail size={12} />
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Modal */}
        {showDetails && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Message Details
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedMessage.subject}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">From</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedMessage.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</label>
                  <p className="text-gray-900 dark:text-white mt-2 whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                  {!selectedMessage.is_answered && (
                    <button
                      onClick={() => {
                        markAsAnswered(selectedMessage.id);
                        setShowDetails(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle size={16} />
                      Mark as Answered
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
