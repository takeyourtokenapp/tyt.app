import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  setStoredLanguage,
  applyLanguageDirection,
  detectInitialLanguage,
} from '../utils/languageDetector';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLanguage = async () => {
      try {
        if (!i18n.isInitialized) {
          await new Promise(resolve => {
            if (i18n.isInitialized) {
              resolve(true);
            } else {
              i18n.on('initialized', () => resolve(true));
            }
          });
        }

        const detectedLang = await detectInitialLanguage();

        if (typeof detectedLang === 'string' && (detectedLang === 'en' || detectedLang === 'ru' || detectedLang === 'he')) {
          await i18n.changeLanguage(detectedLang);
          setCurrentLanguage(detectedLang);
          applyLanguageDirection(detectedLang);
        } else {
          console.warn('Invalid detected language, falling back to en:', detectedLang);
          await i18n.changeLanguage('en');
          setCurrentLanguage('en');
          applyLanguageDirection('en');
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
        await i18n.changeLanguage('en');
        setCurrentLanguage('en');
        applyLanguageDirection('en');
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: SupportedLanguage) => {
    try {
      if (typeof lang !== 'string' || !(lang === 'en' || lang === 'ru' || lang === 'he')) {
        console.error('[LanguageContext] Invalid language:', lang);
        throw new Error(`Invalid language: ${lang}`);
      }

      console.log('[LanguageContext] Changing language to:', lang);
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      setStoredLanguage(lang);
      applyLanguageDirection(lang);

      console.log('[LanguageContext] Language changed successfully:', lang, {
        htmlLang: document.documentElement.lang,
        htmlDir: document.documentElement.dir,
        i18nLang: i18n.language,
        currentState: lang
      });

      // Force re-render by dispatching event
      window.dispatchEvent(new Event('languagechange'));
    } catch (error) {
      console.error('[LanguageContext] Failed to change language:', error);
      throw error;
    }
  };

  const isRTL = SUPPORTED_LANGUAGES[currentLanguage].dir === 'rtl';

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    isRTL,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isLoading,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
