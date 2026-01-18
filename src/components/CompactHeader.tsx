import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Monitor, Globe, Check } from 'lucide-react';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../utils/languageDetector';
import AoiCompactWidget from './AoiCompactWidget';
import { getTYTLogoUrl } from '../config/aoiConfig';

export default function CompactHeader() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const themes: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];
  const ThemeIcon = currentTheme.icon;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-xl border-b border-secondary">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={getTYTLogoUrl()}
              alt="TYT"
              className="w-9 h-9 group-hover:drop-shadow-[0_0_12px_rgba(210,164,76,0.6)] transition-all"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-primary-text leading-tight">
                Take Your Token
              </span>
              <span className="text-[10px] text-tertiary-text leading-tight">
                Owl Warrior Ecosystem
              </span>
            </div>
          </Link>

          {/* Center Nav - Desktop only */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/app/academy"
              className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors"
            >
              {t('common:nav.academy')}
            </Link>
            <Link
              to="/app/foundation"
              className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors"
            >
              {t('common:nav.foundation')}
            </Link>
            {user && (
              <Link
                to="/app"
                className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors"
              >
                {t('common:nav.dashboard')}
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* aOi Badge */}
            <AoiCompactWidget />

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 bg-secondary hover:bg-tertiary rounded-lg transition-all flex items-center gap-1.5 backdrop-blur-sm border border-secondary"
                aria-label="Language"
              >
                <Globe className="w-4 h-4 text-tertiary-text" />
                <span className="text-sm text-secondary-text">{supportedLanguages[currentLanguage].flag}</span>
              </button>
              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card backdrop-blur-sm border border-secondary rounded-lg shadow-xl overflow-hidden z-50">
                    {(Object.keys(supportedLanguages) as SupportedLanguage[]).map((langCode) => {
                      const lang = supportedLanguages[langCode];
                      const isActive = langCode === currentLanguage;
                      return (
                        <button
                          key={langCode}
                          onClick={() => {
                            changeLanguage(langCode);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                            isActive ? 'bg-tertiary text-primary-text' : 'text-secondary-text hover:bg-secondary hover:text-primary-text'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm">{lang.nativeName}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 bg-secondary hover:bg-tertiary rounded-lg transition-all backdrop-blur-sm border border-secondary"
                aria-label="Theme"
              >
                <ThemeIcon className="w-4 h-4 text-tertiary-text" />
              </button>
              {themeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setThemeMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-36 bg-card backdrop-blur-sm border border-secondary rounded-lg shadow-xl overflow-hidden z-50">
                    {themes.map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setTheme(value);
                          setThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                          theme === value ? 'bg-gold-500/20 text-gold-400' : 'text-secondary-text hover:bg-secondary hover:text-primary-text'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                        {theme === value && <Check className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Profile Icon (Mobile) */}
            {user && (
              <Link
                to="/app/profile"
                className="md:hidden p-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-all backdrop-blur-sm border border-gray-700/50"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gold-400 to-amber-500" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
