import { useState, useEffect, useCallback } from 'react';
import { 
  SupportedLanguage, 
  TranslationNamespace, 
  TranslationKey,
  TranslationVariables,
  UseTranslationResult,
  LanguageConfig
} from '../types/translation.types';
import { translationService } from '../services/TranslationService';
import { useTranslationContext } from '../providers/TranslationProvider';

/**
 * useTranslation Hook
 * 
 * Primary hook for using the translation service in React components.
 * Provides translation functions and language management capabilities.
 */
/**
 * useTranslation Hook
 * 
 * Primary hook for using the translation service in React components.
 * Provides translation functions and language management capabilities.
 */
export function useTranslation(): UseTranslationResult {
  // Use context
  const { service, language, changeLanguage, isReady, isLoading } = useTranslationContext();
  
  const t = useCallback((key: TranslationKey, variables?: TranslationVariables) => {
    if (!isReady) return key;
    return service.t(key, variables);
  }, [service, isReady]);

  const tns = useCallback((namespace: TranslationNamespace, key: TranslationKey, variables?: TranslationVariables) => {
    if (!isReady) return key;
    return service.tns(namespace, key, variables);
  }, [service, isReady]);

  return {
    t,
    tns,
    language,
    changeLanguage,
    isLoading,
    isReady
  };
}

/**
 * useLanguageConfig Hook
 * 
 * Hook for accessing language configuration and formatting utilities.
 */
export function useLanguageConfig(language?: SupportedLanguage) {
  const [config, setConfig] = useState<LanguageConfig | null>(null);
  const currentLanguage = language || translationService.getCurrentLanguage();

  useEffect(() => {
    try {
      const languageConfig = translationService.getLanguageConfig(currentLanguage);
      setConfig(languageConfig);
    } catch (error) {
      console.error('Failed to get language config:', error);
      setConfig(null);
    }
  }, [currentLanguage]);

  return {
    config,
    formatDate: (date: Date, format?: string) => translationService.formatDate(date, format),
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) => translationService.formatNumber(number, options),
    formatCurrency: (amount: number, currency?: string) => translationService.formatCurrency(amount, currency)
  };
}

/**
 * useTranslationLoader Hook
 * 
 * Hook for loading specific translation namespaces dynamically.
 */
export function useTranslationLoader() {
  const [loadingNamespaces, setLoadingNamespaces] = useState<Set<TranslationNamespace>>(new Set());

  const loadNamespace = useCallback(async (namespace: TranslationNamespace) => {
    if (loadingNamespaces.has(namespace)) {
      return; // Already loading
    }

    setLoadingNamespaces(prev => new Set([...prev, namespace]));
    
    try {
      await translationService.loadNamespace(namespace);
    } catch (error) {
      console.error(`Failed to load namespace ${namespace}:`, error);
    } finally {
      setLoadingNamespaces(prev => {
        const newSet = new Set(prev);
        newSet.delete(namespace);
        return newSet;
      });
    }
  }, [loadingNamespaces]);

  const isNamespaceLoading = useCallback((namespace: TranslationNamespace) => {
    return loadingNamespaces.has(namespace);
  }, [loadingNamespaces]);

  return {
    loadNamespace,
    isNamespaceLoading,
    loadingNamespaces: Array.from(loadingNamespaces)
  };
}

/**
 * useLanguageDetection Hook
 * 
 * Hook for detecting and setting the user's preferred language.
 */
export function useLanguageDetection() {
  const { changeLanguage } = useTranslation();

  const detectLanguage = useCallback((): SupportedLanguage => {
    // Try to detect from browser
    const browserLanguage = navigator.language.split('-')[0];
    
    // Check if detected language is supported
    if (translationService.isLanguageSupported(browserLanguage)) {
      return browserLanguage as SupportedLanguage;
    }

    // Try to detect from localStorage
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && translationService.isLanguageSupported(savedLanguage)) {
      return savedLanguage as SupportedLanguage;
    }

    // Fallback to English
    return SupportedLanguage.ENGLISH;
  }, []);

  const setLanguagePreference = useCallback(async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);
      localStorage.setItem('app-language', language);
    } catch (error) {
      console.error('Failed to set language preference:', error);
    }
  }, [changeLanguage]);

  const autoDetectAndSet = useCallback(async () => {
    const detectedLanguage = detectLanguage();
    await setLanguagePreference(detectedLanguage);
  }, [detectLanguage, setLanguagePreference]);

  return {
    detectLanguage,
    setLanguagePreference,
    autoDetectAndSet
  };
}

export default useTranslation;
