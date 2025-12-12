import { useState, useEffect } from 'react';
import { Cookie, X, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShow(true), 1000);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(allAccepted);
    setShow(false);
    applyCookiePreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShow(false);
    applyCookiePreferences(preferences);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(onlyEssential);
    setShow(false);
    applyCookiePreferences(onlyEssential);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    if (!prefs.analytics) {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_ga') || name.startsWith('_gid')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }

    if (!prefs.marketing) {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_fbp') || name.startsWith('_fbc')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }

    window.dispatchEvent(new CustomEvent('cookie-preferences-updated', { detail: prefs }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Cookie Preferences</h2>
                <p className="text-sm text-gray-400">We respect your privacy</p>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-3 mb-6">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300 mb-3">
                    We use cookies to enhance your experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies.
                  </p>
                  <Link
                    to="/privacy"
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    Learn more in our Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/50"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Reject All
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Essential cookies are always enabled to ensure platform functionality
              </p>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <CookieCategory
                  icon="🔒"
                  title="Essential Cookies"
                  description="Required for the platform to function. These cannot be disabled."
                  enabled={true}
                  disabled={true}
                  onChange={() => {}}
                />

                {/* Functional Cookies */}
                <CookieCategory
                  icon="⚙️"
                  title="Functional Cookies"
                  description="Remember your preferences and settings for a better experience."
                  enabled={preferences.functional}
                  onChange={(checked) => setPreferences(prev => ({ ...prev, functional: checked }))}
                />

                {/* Analytics Cookies */}
                <CookieCategory
                  icon="📊"
                  title="Analytics Cookies"
                  description="Help us understand how you use our platform to improve it."
                  enabled={preferences.analytics}
                  onChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                />

                {/* Marketing Cookies */}
                <CookieCategory
                  icon="📢"
                  title="Marketing Cookies"
                  description="Used to deliver personalized ads and track their effectiveness."
                  enabled={preferences.marketing}
                  onChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>🍪 Cookies help us deliver the best experience</span>
            <span>Updated: Dec 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieCategory({
  icon,
  title,
  description,
  enabled,
  disabled = false,
  onChange
}: {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full peer
            ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'}
            peer-checked:after:translate-x-full peer-checked:after:border-white
            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:rounded-full after:h-5 after:w-5
            after:transition-all
            ${enabled ? 'peer-checked:bg-green-500' : ''}
          `}></div>
        </label>
      </div>
    </div>
  );
}
