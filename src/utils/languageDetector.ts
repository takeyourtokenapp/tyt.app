export type SupportedLanguage = 'en' | 'ru' | 'he';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    flag: '🇮🇱',
    dir: 'rtl',
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const COUNTRY_TO_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  UA: 'ru',
  IL: 'he',
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',
  SG: 'en',
  IN: 'en',
  ZA: 'en',
  NG: 'en',
  KE: 'en',
};

interface GeolocationResponse {
  country?: string;
  countryCode?: string;
}

export async function detectLanguageFromGeolocation(): Promise<SupportedLanguage> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Geolocation API request failed');
    }

    const data: GeolocationResponse = await response.json();
    const countryCode = data.countryCode?.toUpperCase();

    if (countryCode && COUNTRY_TO_LANGUAGE_MAP[countryCode]) {
      return COUNTRY_TO_LANGUAGE_MAP[countryCode];
    }

    return detectLanguageFromBrowser();
  } catch (error) {
    console.warn('Geolocation detection failed, falling back to browser detection:', error);
    return detectLanguageFromBrowser();
  }
}

export function detectLanguageFromBrowser(): SupportedLanguage {
  const browserLang = navigator.language || (navigator as any).userLanguage;

  const langCode = browserLang.split('-')[0].toLowerCase();

  if (langCode === 'ru') return 'ru';
  if (langCode === 'he' || langCode === 'iw') return 'he';

  return 'en';
}

export function getStoredLanguage(): SupportedLanguage | null {
  try {
    const stored = localStorage.getItem('tyt_language');
    if (stored && (stored === 'en' || stored === 'ru' || stored === 'he')) {
      return stored as SupportedLanguage;
    }
  } catch (error) {
    console.warn('Failed to read stored language:', error);
  }
  return null;
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem('tyt_language', lang);
  } catch (error) {
    console.warn('Failed to store language:', error);
  }
}

export function applyLanguageDirection(lang: SupportedLanguage | string): void {
  if (typeof lang !== 'string') {
    console.warn('Invalid language type:', typeof lang, lang);
    lang = DEFAULT_LANGUAGE;
  }

  const normalizedLang = lang.toLowerCase() as SupportedLanguage;

  const langConfig = SUPPORTED_LANGUAGES[normalizedLang] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
  const dir = langConfig.dir;

  document.documentElement.dir = dir;
  document.documentElement.lang = normalizedLang;

  if (dir === 'rtl') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
}

export async function detectInitialLanguage(): Promise<SupportedLanguage> {
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }

  const geoLang = await detectLanguageFromGeolocation();
  setStoredLanguage(geoLang);
  return geoLang;
}
