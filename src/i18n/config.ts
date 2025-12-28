import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import ruCommon from '../locales/ru/common.json';
import heCommon from '../locales/he/common.json';

import { detectInitialLanguage, applyLanguageDirection } from '../utils/languageDetector';

export const resources = {
  en: {
    common: enCommon,
  },
  ru: {
    common: ruCommon,
  },
  he: {
    common: heCommon,
  },
} as const;

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'tytCustomDetector',
  lookup: () => {
    try {
      const stored = localStorage.getItem('tyt_language');
      if (stored && (stored === 'en' || stored === 'ru' || stored === 'he')) {
        return stored;
      }
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const langCode = browserLang.split('-')[0].toLowerCase();
      if (langCode === 'ru') return 'ru';
      if (langCode === 'he' || langCode === 'iw') return 'he';
      return 'en';
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en';
    }
  },
  cacheUserLanguage: (lng: string) => {
    try {
      if (typeof lng === 'string' && (lng === 'en' || lng === 'ru' || lng === 'he')) {
        localStorage.setItem('tyt_language', lng);
      }
    } catch (error) {
      console.error('Failed to cache language:', error);
    }
  },
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    load: 'languageOnly',

    detection: {
      order: ['localStorage', 'tytCustomDetector', 'navigator'],
      lookupLocalStorage: 'tyt_language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

i18n.on('languageChanged', (lng: string) => {
  try {
    if (!lng || typeof lng !== 'string') {
      console.warn('Invalid language in languageChanged event:', lng);
      applyLanguageDirection('en');
      return;
    }
    applyLanguageDirection(lng);
  } catch (error) {
    console.error('Error in languageChanged handler:', error);
    applyLanguageDirection('en');
  }
});

i18n.on('initialized', () => {
  console.log('i18n initialized with language:', i18n.language);
  applyLanguageDirection(i18n.language || 'en');
});

export default i18n;
