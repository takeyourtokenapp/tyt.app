/**
 * Auto-detect Language and Theme Utilities
 * Automatically determines user's preferred language and theme based on:
 * - Browser language
 * - Geolocation (timezone)
 * - Time of day (for theme)
 */

export interface UserPreferences {
  language: 'en' | 'ru' | 'he';
  theme: 'light' | 'dark';
  autoDetected: boolean;
}

/**
 * Map of country codes to default languages
 */
const COUNTRY_TO_LANGUAGE_MAP: Record<string, 'en' | 'ru' | 'he'> = {
  // Russian-speaking countries
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  KG: 'ru',
  UZ: 'ru',
  TJ: 'ru',
  AM: 'ru',
  AZ: 'ru',
  GE: 'ru',
  MD: 'ru',

  // Hebrew-speaking countries
  IL: 'he',

  // English as default for all others
};

/**
 * Detect user's preferred language based on multiple factors
 */
export function detectLanguage(): 'en' | 'ru' | 'he' {
  // 1. Check browser language
  const browserLang = navigator.language.toLowerCase();

  // Direct match
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('he')) return 'he';
  if (browserLang.startsWith('en')) return 'en';

  // 2. Check timezone to infer location
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Russian timezones
  if (timezone.includes('Moscow') ||
      timezone.includes('Kaliningrad') ||
      timezone.includes('Samara') ||
      timezone.includes('Yekaterinburg') ||
      timezone.includes('Omsk') ||
      timezone.includes('Krasnoyarsk') ||
      timezone.includes('Irkutsk') ||
      timezone.includes('Yakutsk') ||
      timezone.includes('Vladivostok') ||
      timezone.includes('Magadan')) {
    return 'ru';
  }

  // Israel timezone
  if (timezone.includes('Jerusalem') || timezone.includes('Tel_Aviv')) {
    return 'he';
  }

  // 3. Default to English
  return 'en';
}

/**
 * Detect preferred theme based on time of day
 * Light theme: 6:00 AM - 6:00 PM
 * Dark theme: 6:00 PM - 6:00 AM
 */
export function detectThemeByTime(): 'light' | 'dark' {
  const hour = new Date().getHours();

  // Light theme during daytime (6 AM - 6 PM)
  if (hour >= 6 && hour < 18) {
    return 'light';
  }

  // Dark theme during nighttime (6 PM - 6 AM)
  return 'dark';
}

/**
 * Detect preferred theme based on system preference
 */
export function detectThemeBySystem(): 'light' | 'dark' | null {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return null;
}

/**
 * Get comprehensive user preferences with auto-detection
 */
export function detectUserPreferences(): UserPreferences {
  // Try system theme first, fallback to time-based
  const systemTheme = detectThemeBySystem();
  const timeBasedTheme = detectThemeByTime();

  return {
    language: detectLanguage(),
    theme: systemTheme || timeBasedTheme,
    autoDetected: true
  };
}

/**
 * Get country code from timezone (approximation)
 */
export function getCountryFromTimezone(): string | null {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Map common timezones to country codes
  const timezoneToCountry: Record<string, string> = {
    'Europe/Moscow': 'RU',
    'Europe/Minsk': 'BY',
    'Asia/Almaty': 'KZ',
    'Asia/Jerusalem': 'IL',
    'Asia/Tel_Aviv': 'IL',
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Hong_Kong': 'HK',
    'Asia/Singapore': 'SG',
    'Australia/Sydney': 'AU',
    'Asia/Dubai': 'AE',
    'Asia/Bangkok': 'TH',
  };

  return timezoneToCountry[timezone] || null;
}

/**
 * Get language from country code
 */
export function getLanguageFromCountry(countryCode: string): 'en' | 'ru' | 'he' {
  return COUNTRY_TO_LANGUAGE_MAP[countryCode] || 'en';
}

/**
 * Format preferences for display
 */
export function formatPreferences(prefs: UserPreferences): string {
  const langNames = {
    en: 'English',
    ru: 'Русский',
    he: 'עברית'
  };

  const themeNames = {
    light: 'Light',
    dark: 'Dark'
  };

  return `Language: ${langNames[prefs.language]}, Theme: ${themeNames[prefs.theme]}`;
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(prefs: Partial<UserPreferences>): void {
  const existingPrefs = loadPreferences();
  const newPrefs = { ...existingPrefs, ...prefs };
  localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
}

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Get user preferences with fallback to auto-detection
 */
export function getUserPreferences(): UserPreferences {
  // First, try to load saved preferences
  const saved = loadPreferences();
  if (saved && !saved.autoDetected) {
    // User has manually set preferences
    return saved;
  }

  // Auto-detect if no manual preferences
  const detected = detectUserPreferences();

  // Save auto-detected preferences
  savePreferences(detected);

  return detected;
}

/**
 * Clear saved preferences (for testing)
 */
export function clearPreferences(): void {
  localStorage.removeItem('userPreferences');
}
