import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { I18N_CONFIG } from '@/constants/config';

// Configuração do i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: I18N_CONFIG.DEFAULT_LANGUAGE,
    fallbackLng: I18N_CONFIG.FALLBACK_LANGUAGE,
    supportedLngs: I18N_CONFIG.SUPPORTED_LANGUAGES.map(lang => lang.code),
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'default',
      },
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',

    react: {
      useSuspense: false,
    },
  });

export default i18n;