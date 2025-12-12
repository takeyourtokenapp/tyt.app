import { useState, useEffect } from 'react';
import { X, Info, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { communityService, Announcement } from '../utils/communityService';

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    loadAnnouncements();
    const unsubscribe = communityService.subscribeToAnnouncements((announcement) => {
      setAnnouncements(prev => [announcement, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % announcements.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const loadAnnouncements = async () => {
    const data = await communityService.getActiveAnnouncements();
    const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
    setDismissed(dismissedIds);
    setAnnouncements(data.filter(a => !dismissedIds.includes(a.id)));
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed));
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  if (announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];
  if (!currentAnnouncement) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'announcement':
        return <Zap size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-100',
      green: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-100',
      amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-100',
      red: 'from-red-500/20 to-rose-500/20 border-red-500/50 text-red-100',
      purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-100',
      gold: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`bg-gradient-to-r ${getColorClasses(currentAnnouncement.color)} border-b backdrop-blur-sm animate-slide-down`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {currentAnnouncement.icon ? (
                <span className="text-2xl">{currentAnnouncement.icon}</span>
              ) : (
                getIcon(currentAnnouncement.type)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm md:text-base">
                {currentAnnouncement.title}
              </div>
              <div className="text-xs md:text-sm opacity-90 line-clamp-2">
                {currentAnnouncement.message}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {announcements.length > 1 && (
              <div className="hidden sm:flex items-center gap-1">
                {announcements.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => handleDismiss(currentAnnouncement.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss announcement"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
