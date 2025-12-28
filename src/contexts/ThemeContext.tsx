import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tyt-theme-preference';

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'auto';
}

function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore localStorage errors
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function getTimeBasedTheme(): ResolvedTheme {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 18) {
    return 'light';
  }

  return 'dark';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  const timeTheme = getTimeBasedTheme();
  const systemTheme = getSystemTheme();

  return timeTheme === systemTheme ? timeTheme : timeTheme;
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  const body = document.body;

  // Force remove/add classes
  root.classList.remove('light', 'dark');
  body.classList.remove('light', 'dark');

  if (theme === 'dark') {
    root.classList.add('dark');
    body.classList.add('dark');
    root.style.colorScheme = 'dark';
    root.setAttribute('data-theme', 'dark');
    body.style.backgroundColor = '#0A1122';
    body.style.color = '#F8FAFC';
  } else {
    root.classList.add('light');
    body.classList.add('light');
    root.style.colorScheme = 'light';
    root.setAttribute('data-theme', 'light');
    body.style.backgroundColor = '#FFFFFF';
    body.style.color = '#0F172A';
  }

  console.log('[ThemeContext] Theme applied:', theme, {
    htmlClasses: root.className,
    bodyClasses: body.className,
    colorScheme: root.style.colorScheme
  });

  // Force repaint
  void root.offsetHeight;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    const newResolved = resolveTheme(storedTheme);
    setResolvedTheme(newResolved);
    applyTheme(newResolved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const newResolved = resolveTheme(theme);
    setResolvedTheme(newResolved);
    applyTheme(newResolved);
  }, [theme, mounted]);

  useEffect(() => {
    if (theme !== 'auto') return;

    const updateTheme = () => {
      const newResolved = resolveTheme('auto');
      setResolvedTheme(newResolved);
      applyTheme(newResolved);
    };

    const interval = setInterval(updateTheme, 60000);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      clearInterval(interval);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
