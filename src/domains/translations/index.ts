/**
 * @fileoverview Translation Domain Index
 * 
 * Central export point for the translation/i18n domain.
 * 
 * @version 1.0.0
 * @domain translations
 */

// Export enums
export {
  SupportedLanguage,
  TranslationNamespace
} from './types/translation.types';

// Export hooks
export {
  useTranslation,
  useLanguageConfig
} from './hooks/useTranslation';

// Export components
export {
  TranslatedText
} from './components/TranslatedText';

export {
  LanguageSelector,
  CompactLanguageSelector
} from './components/LanguageSelector';

// Export providers
export {
  TranslationProvider,
  useTranslationContext
} from './providers/TranslationProvider';
