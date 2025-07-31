"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  SupportedLanguage, 
  I18nConfig,
  TranslationServiceInterface
} from '../types/translation.types';
import { translationService } from '../services/TranslationService';
import { useLanguageDetection } from '../hooks/useTranslation';

interface TranslationProviderProps {
  children: React.ReactNode;
  config?: Partial<I18nConfig>;
}

interface TranslationContextValue {
  service: TranslationServiceInterface;
  language: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isReady: boolean;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  config
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.ENGLISH);

  // Initialize translation service
  useEffect(() => {
    const initializeTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Auto-detect language if enabled
        const detectedLanguage = detectBrowserLanguage();
        if (detectedLanguage) {
          await translationService.changeLanguage(detectedLanguage);
          setLanguage(detectedLanguage);
        }
        
        await translationService.initialize();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize translations:', error);
        // Set ready to true even if initialization fails to prevent app from hanging
        setIsReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTranslations();
  }, []);

  const detectBrowserLanguage = (): SupportedLanguage | null => {
    try {
      // Check localStorage first
      const savedLanguage = localStorage.getItem('app-language');
      if (savedLanguage && isValidLanguage(savedLanguage)) {
        return savedLanguage as SupportedLanguage;
      }

      // Detect from browser
      const browserLanguage = navigator.language.split('-')[0];
      if (isValidLanguage(browserLanguage)) {
        return browserLanguage as SupportedLanguage;
      }

      return null;
    } catch {
      return null;
    }
  };

  const isValidLanguage = (lang: string): boolean => {
    return Object.values(SupportedLanguage).includes(lang as SupportedLanguage);
  };

  const changeLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      setIsLoading(true);
      await translationService.changeLanguage(newLanguage);
      setLanguage(newLanguage);
      
      // Save to localStorage
      localStorage.setItem('app-language', newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TranslationContextValue = {
    service: translationService,
    language,
    changeLanguage,
    isReady,
    isLoading
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
