/**
 * @fileoverview Translation Provider
 * 
 * Internationalization provider using i18next.
 * 
 * @version 1.0.0
 * @domain shared
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { I18nextProvider, useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

// ================================
// Types
// ================================
interface TranslationContextType {
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
  t: (key: string, options?: any) => string;
  isLoading: boolean;
}

// ================================
// Context
// ================================
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// ================================
// Provider Component
// ================================
export function TranslationProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <TranslationProviderInner>
        {children}
      </TranslationProviderInner>
    </I18nextProvider>
  );
}

function TranslationProviderInner({ children }: { children: ReactNode }) {
  const { t, i18n: i18nInstance } = useI18nTranslation();

  const changeLanguage = async (lng: string): Promise<void> => {
    await i18nInstance.changeLanguage(lng);
  };

  const contextValue: TranslationContextType = {
    language: i18nInstance.language,
    changeLanguage,
    t,
    isLoading: !i18nInstance.isInitialized,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
