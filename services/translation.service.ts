import { API_CONFIG } from '@/constants/config';

export interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  namespace: string;
  isComplete: boolean;
  updatedAt: string;
  updatedBy?: string;
}

export interface TranslationKey {
  id: string;
  key: string;
  module: string;
  context: string;
  defaultValue: string;
  isRequired: boolean;
  translations: Translation[];
}

export interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
  isActive: boolean;
  isDefault: boolean;
  rtl: boolean;
}

export interface TranslationBatch {
  language: string;
  namespace: string;
  translations: Record<string, string>;
}

// Simple API service for translations
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

class TranslationService {
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 60 * 60 * 1000; // 1 hora

  /**
   * Buscar todas as linguagens disponíveis
   */
  async getLanguages(): Promise<Language[]> {
    const cacheKey = 'languages';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiCall('/api/translations/languages');
      const data = await response.json();
      const languages = data.languages || data;
      
      this.setCache(cacheKey, languages);
      return languages;
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback para linguagens padrão
      return [
        { id: '1', code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', isActive: true, isDefault: true, rtl: false },
        { id: '2', code: 'en-US', name: 'English (US)', flag: '🇺🇸', isActive: true, isDefault: false, rtl: false },
        { id: '3', code: 'es-ES', name: 'Español', flag: '🇪🇸', isActive: true, isDefault: false, rtl: false },
        { id: '4', code: 'fr-FR', name: 'Français', flag: '🇫🇷', isActive: true, isDefault: false, rtl: false },
      ];
    }
  }

  /**
   * Buscar traduções para um idioma e namespace específicos
   */
  async getTranslations(language: string, namespace: string = 'common'): Promise<Record<string, string>> {
    const cacheKey = `translations_${language}_${namespace}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await apiCall(`/api/translations/${language}/${namespace}`);
      const data = await response.json();
      const translations = data.translations || {};
      
      this.setCache(cacheKey, translations);
      return translations;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}/${namespace}:`, error);
      return {};
    }
  }

  /**
   * Buscar todas as traduções para um idioma
   */
  async getAllTranslations(language: string): Promise<Record<string, Record<string, string>>> {
    const namespaces = ['common', 'auth', 'dashboard', 'admin', 'billing', 'profile'];
    const translations: Record<string, Record<string, string>> = {};

    await Promise.all(
      namespaces.map(async (namespace) => {
        translations[namespace] = await this.getTranslations(language, namespace);
      })
    );

    return translations;
  }

  /**
   * Atualizar tradução (apenas para admins)
   */
  async updateTranslation(keyId: string, language: string, value: string): Promise<void> {
    try {
      await apiCall(`/api/admin/translations/${keyId}/${language}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });

      // Limpar cache relacionado
      this.clearCacheForLanguage(language);
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  }

  /**
   * Criar ou atualizar traduções em lote
   */
  async batchUpdateTranslations(batch: TranslationBatch): Promise<void> {
    try {
      await apiCall('/api/admin/translations/batch', {
        method: 'PUT',
        body: JSON.stringify(batch),
      });

      // Limpar cache relacionado
      this.clearCacheForLanguage(batch.language);
    } catch (error) {
      console.error('Error batch updating translations:', error);
      throw error;
    }
  }

  /**
   * Buscar chaves de tradução não traduzidas
   */
  async getMissingTranslations(language: string): Promise<TranslationKey[]> {
    try {
      const response = await apiCall(`/api/admin/translations/missing/${language}`);
      const data = await response.json();
      return data.keys || [];
    } catch (error) {
      console.error('Error fetching missing translations:', error);
      return [];
    }
  }

  /**
   * Registrar chave de tradução não encontrada
   */
  async reportMissingKey(key: string, namespace: string, language: string): Promise<void> {
    try {
      await apiCall('/api/translations/missing-key', {
        method: 'POST',
        body: JSON.stringify({
          key,
          namespace,
          language,
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
    } catch (error) {
      console.warn('Failed to report missing key:', error);
    }
  }

  /**
   * Gerenciamento de cache
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearCacheForLanguage(language: string): void {
    for (const [key] of this.cache) {
      if (key.includes(`_${language}_`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpar todo o cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Pré-carregar traduções para múltiplos idiomas
   */
  async preloadTranslations(languages: string[], namespaces: string[] = ['common']): Promise<void> {
    const promises: Promise<any>[] = [];

    languages.forEach(language => {
      namespaces.forEach(namespace => {
        promises.push(this.getTranslations(language, namespace));
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some translations failed to preload:', error);
    }
  }
}

export const translationService = new TranslationService();
