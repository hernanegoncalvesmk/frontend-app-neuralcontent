import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18N_CONFIG } from '@/constants/config';

// Importar recursos diretamente - Common
import ptBRCommon from '../../public/locales/pt-BR/common.json';
import enUSCommon from '../../public/locales/en-US/common.json';
import esESCommon from '../../public/locales/es-ES/common.json';
import frFRCommon from '../../public/locales/fr-FR/common.json';

// Importar recursos diretamente - Auth
import ptBRAuth from '../../public/locales/pt-BR/auth.json';
import enUSAuth from '../../public/locales/en-US/auth.json';
import esESAuth from '../../public/locales/es-ES/auth.json';
import frFRAuth from '../../public/locales/fr-FR/auth.json';

// Configuração do i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: I18N_CONFIG.DEFAULT_LANGUAGE,
    fallbackLng: I18N_CONFIG.FALLBACK_LANGUAGE,
    supportedLngs: I18N_CONFIG.SUPPORTED_LANGUAGES.map(lang => lang.code),
    debug: process.env.NODE_ENV === 'development',
    
    resources: {
      'pt-BR': {
        common: ptBRCommon,
        auth: ptBRAuth,
      },
      'en-US': {
        common: enUSCommon,
        auth: enUSAuth,
      },
      'es-ES': {
        common: esESCommon,
        auth: esESAuth,
      },
      'fr-FR': {
        common: frFRCommon,
        auth: frFRAuth,
      },
    },
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    ns: ['common', 'auth'],
    defaultNS: 'common',

    react: {
      useSuspense: false,
    },
  });

export default i18n;