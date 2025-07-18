"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18N_CONFIG } from '@/constants/config';

// Importar i18n apenas no lado cliente
import '@/lib/i18n';

interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
  isActive: boolean;
  isDefault: boolean;
  rtl: boolean;
}

interface TranslationContextType {
  // Estado atual
  currentLanguage: string;
  languages: Language[];
  isLoading: boolean;
  
  // Funções de controle
  changeLanguage: (language: string) => Promise<void>;
  refreshTranslations: () => Promise<void>;
  
  // Função de tradução personalizada
  t: (key: string, options?: any) => string;
  
  // Informações da linguagem atual
  currentLanguageInfo: Language | null;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(I18N_CONFIG.DEFAULT_LANGUAGE);
  const [languages] = useState<Language[]>([
    { id: '1', code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', isActive: true, isDefault: true, rtl: false },
    { id: '2', code: 'en-US', name: 'English (US)', flag: '🇺🇸', isActive: true, isDefault: false, rtl: false },
    { id: '3', code: 'es-ES', name: 'Español', flag: '🇪🇸', isActive: true, isDefault: false, rtl: false },
    { id: '4', code: 'fr-FR', name: 'Français', flag: '🇫🇷', isActive: true, isDefault: false, rtl: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Detectar mudanças de idioma
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      
      // Atualizar atributos do HTML
      document.documentElement.lang = lng;
      
      // Salvar preferência
      localStorage.setItem('i18nextLng', lng);
      
      // Atualizar direção do texto se necessário
      const languageInfo = languages.find(lang => lang.code === lng);
      if (languageInfo?.rtl) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    };

    i18nInstance.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance, languages]);

  // Função para mudar idioma
  const changeLanguage = async (language: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Verificar se o idioma está disponível
      const languageExists = languages.some(lang => lang.code === language && lang.isActive);
      if (!languageExists) {
        throw new Error(`Language ${language} is not available`);
      }

      // Mudar idioma no i18next
      await i18nInstance.changeLanguage(language);
      
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar traduções
  const refreshTranslations = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Recarregar traduções
      await i18nInstance.reloadResources();
      
    } catch (error) {
      console.error('Failed to refresh translations:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de tradução customizada com fallback
  const customT = (key: string, options?: any): string => {
    try {
      const translation = t(key, options);
      
      // Se a tradução retornar a chave (não encontrou tradução)
      if (translation === key) {
        // Tentar fallback
        const fallbackTranslation = t(key, { ...options, lng: I18N_CONFIG.FALLBACK_LANGUAGE });
        if (fallbackTranslation !== key) {
          return String(fallbackTranslation);
        }
        
        // Última opção: retornar a chave formatada
        return key.split('.').pop() || key;
      }
      
      return String(translation);
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  // Informações da linguagem atual
  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage) || null;
  const isRTL = currentLanguageInfo?.rtl || false;

  const value: TranslationContextType = {
    currentLanguage,
    languages,
    isLoading,
    changeLanguage,
    refreshTranslations,
    t: customT,
    currentLanguageInfo,
    isRTL,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook para usar o contexto de tradução
export const useTranslations = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
};

// Hook simplificado para apenas traduções
export const useT = () => {
  const { t } = useTranslations();
  return t;
};

// Hook para informações de idioma
export const useLanguage = () => {
  const { currentLanguage, currentLanguageInfo, isRTL, changeLanguage, languages } = useTranslations();
  return {
    currentLanguage,
    currentLanguageInfo,
    isRTL,
    changeLanguage,
    languages,
  };
};
