import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';
import { SupportedLanguage } from '../utils/languageDetector';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    try {
      await changeLanguage(lang);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const currentLangConfig = supportedLanguages[currentLanguage];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium">{currentLangConfig.flag}</span>
        <span className="text-sm text-gray-300">{currentLangConfig.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {(Object.keys(supportedLanguages) as SupportedLanguage[]).map((langCode) => {
              const lang = supportedLanguages[langCode];
              const isActive = langCode === currentLanguage;

              return (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{lang.nativeName}</div>
                      <div className="text-xs text-gray-400">{lang.name}</div>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-700 px-4 py-2 bg-gray-900/50">
            <div className="text-xs text-gray-500">
              Language detected automatically based on your location
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
