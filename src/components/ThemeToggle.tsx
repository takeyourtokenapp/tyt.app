import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themes: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: t('theme.light') || 'Light' },
    { value: 'dark', icon: Moon, label: t('theme.dark') || 'Dark' },
    { value: 'auto', icon: Monitor, label: t('theme.auto') || 'Auto' },
  ];

  return (
    <div className="flex items-center gap-0.5 bg-gray-800/50 dark:bg-gray-800 rounded-lg p-1 w-full">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            onClick={() => {
              console.log('Changing theme to:', value);
              setTheme(value);
            }}
            className={`
              flex-1 p-2.5 rounded-md transition-all
              ${isActive
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
            title={label}
            aria-label={label}
          >
            <Icon className="w-4 h-4 mx-auto" />
          </button>
        );
      })}
    </div>
  );
}
