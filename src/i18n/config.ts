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
  lookup: async () => {
    try {
      const detectedLang = await detectInitialLanguage();
      return detectedLang;
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en';
    }
  },
  cacheUserLanguage: (lng: string) => {
    try {
      localStorage.setItem('tyt_language', lng);
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

    detection: {
      order: ['localStorage', 'tytCustomDetector', 'navigator'],
      lookupLocalStorage: 'tyt_language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof lng === 'string') {
    applyLanguageDirection(lng);
  } else {
    console.warn('Invalid language type in languageChanged event:', typeof lng);
    applyLanguageDirection('en');
  }
});

export default i18n;
