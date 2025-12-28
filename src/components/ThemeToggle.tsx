import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
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

  const themes: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: t('theme.light') || 'Light' },
    { value: 'dark', icon: Moon, label: t('theme.dark') || 'Dark' },
    { value: 'auto', icon: Monitor, label: t('theme.auto') || 'Auto' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors border border-amber-200 dark:border-gray-700"
        aria-label="Select theme"
      >
        <CurrentIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {themes.map(({ value, icon: Icon, label }) => {
              const isActive = theme === value;

              return (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-amber-50 dark:bg-gray-700/50 text-amber-600 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-amber-600 dark:text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
