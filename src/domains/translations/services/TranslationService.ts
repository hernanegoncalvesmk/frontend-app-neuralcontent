import { 
  SupportedLanguage, 
  TranslationNamespace, 
  TranslationKey,
  TranslationValue,
  I18nConfig,
  TranslationServiceInterface,
  LanguageConfig,
  TranslationError,
  MissingTranslationError,
  NamespaceNotLoadedError,
  LanguageNotSupportedError,
  TranslationVariables
} from '../types/translation.types';

/**
 * Translation Service Implementation
 * 
 * Manages internationalization (i18n) functionality following Domain-Driven Design principles.
 * Provides centralized translation management with namespace isolation and error handling.
 */
export class TranslationService implements TranslationServiceInterface {
  private currentLanguage: SupportedLanguage = SupportedLanguage.ENGLISH;
  private fallbackLanguage: SupportedLanguage = SupportedLanguage.ENGLISH;
  private translations: Map<SupportedLanguage, Map<TranslationNamespace, Record<string, any>>> = new Map();
  private languageConfigs: Map<SupportedLanguage, LanguageConfig> = new Map();
  private initialized = false;

  /**
   * Language configurations with proper RTL and formatting support
   */
  private readonly defaultLanguageConfigs: Record<SupportedLanguage, LanguageConfig> = {
    [SupportedLanguage.ENGLISH]: {
      code: SupportedLanguage.ENGLISH,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      dateFormat: 'MM/dd/yyyy',
      numberFormat: 'en-US'
    },
    [SupportedLanguage.PORTUGUESE]: {
      code: SupportedLanguage.PORTUGUESE,
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'pt-BR'
    },
    [SupportedLanguage.SPANISH]: {
      code: SupportedLanguage.SPANISH,
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'es-ES'
    },
    [SupportedLanguage.FRENCH]: {
      code: SupportedLanguage.FRENCH,
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'fr-FR'
    }
  };

  constructor(config?: I18nConfig) {
    this.setupLanguageConfigs();
    
    if (config) {
      this.currentLanguage = config.defaultLanguage || SupportedLanguage.ENGLISH;
      this.fallbackLanguage = config.fallbackLanguage || SupportedLanguage.ENGLISH;
    }
  }

  /**
   * Initialize the translation service with translation data
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Load all translation files for all supported languages
      await this.loadAllTranslations();
      this.initialized = true;
    } catch (error) {
      throw new TranslationError(
        `Failed to initialize translation service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INITIALIZATION_FAILED'
      );
    }
  }

  /**
   * Load all translation files for all supported languages and namespaces
   */
  private async loadAllTranslations(): Promise<void> {
    const languages = Object.values(SupportedLanguage);
    const namespaces = Object.values(TranslationNamespace);

    for (const language of languages) {
      const languageTranslations = new Map<TranslationNamespace, Record<string, any>>();
      
      for (const namespace of namespaces) {
        try {
          const translations = await this.loadTranslationFile(language, namespace);
          languageTranslations.set(namespace, translations);
        } catch (error) {
          // Log warning but continue loading other translations
          console.warn(`Failed to load ${namespace} translations for ${language}:`, error);
          // Set empty object as fallback
          languageTranslations.set(namespace, {});
        }
      }
      
      this.translations.set(language, languageTranslations);
    }
  }

  /**
   * Load translation file for specific language and namespace
   */
  private async loadTranslationFile(
    language: SupportedLanguage, 
    namespace: TranslationNamespace
  ): Promise<Record<string, any>> {
    try {
      // Dynamic import of translation files
      const translationModule = await import(
        `../resources/locales/${language}/${namespace}.json`
      );
      return translationModule.default || translationModule;
    } catch (error) {
      throw new TranslationError(
        `Failed to load translation file for ${language}/${namespace}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FILE_LOAD_FAILED'
      );
    }
  }

  /**
   * Setup language configurations
   */
  private setupLanguageConfigs(): void {
    Object.entries(this.defaultLanguageConfigs).forEach(([language, config]) => {
      this.languageConfigs.set(language as SupportedLanguage, config);
    });
  }

  /**
   * Get translated text for a specific key
   */
  translate(
    key: TranslationKey, 
    namespace: TranslationNamespace = TranslationNamespace.COMMON,
    params?: Record<string, string | number>
  ): TranslationValue {
    this.ensureInitialized();

    try {
      let value = this.getTranslationValue(this.currentLanguage, namespace, key);
      
      // Fallback to default language if translation not found
      if (value === undefined && this.currentLanguage !== this.fallbackLanguage) {
        value = this.getTranslationValue(this.fallbackLanguage, namespace, key);
      }
      
      // If still not found, return the key itself as fallback
      if (value === undefined) {
        console.warn(`Translation not found: ${namespace}.${key} for language ${this.currentLanguage}`);
        return key;
      }

      // Apply parameter interpolation if params provided
      if (params && typeof value === 'string') {
        return this.interpolateParams(value, params);
      }

      return value;
    } catch (error) {
      if (error instanceof TranslationError) {
        throw error;
      }
      throw new TranslationError(
        `Failed to translate key "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        'TRANSLATION_FAILED'
      );
    }
  }

  /**
   * Translate a key with optional variables (interface method)
   */
  t(key: TranslationKey, variables?: TranslationVariables): string {
    const result = this.translate(key, TranslationNamespace.COMMON, variables);
    return typeof result === 'string' ? result : key;
  }
  
  /**
   * Translate with specific namespace (interface method)
   */
  tns(namespace: TranslationNamespace, key: TranslationKey, variables?: TranslationVariables): string {
    const result = this.translate(key, namespace, variables);
    return typeof result === 'string' ? result : key;
  }

  /**
   * Get translation value from nested object using dot notation
   */
  private getTranslationValue(
    language: SupportedLanguage,
    namespace: TranslationNamespace,
    key: TranslationKey
  ): TranslationValue | undefined {
    const languageTranslations = this.translations.get(language);
    if (!languageTranslations) {
      throw new LanguageNotSupportedError(language);
    }

    const namespaceTranslations = languageTranslations.get(namespace);
    if (!namespaceTranslations) {
      throw new NamespaceNotLoadedError(namespace, language);
    }

    // Support dot notation for nested keys (e.g., "auth.login.title")
    const keyParts = key.split('.');
    let value: any = namespaceTranslations;

    for (const part of keyParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Interpolate parameters in translation strings
   * Supports {{param}} syntax
   */
  private interpolateParams(value: string, params: Record<string, string | number>): string {
    return value.replace(/\\{\\{(\\w+)\\}\\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  /**
   * Change current language
   */
  async changeLanguage(language: SupportedLanguage): Promise<void> {
    if (!Object.values(SupportedLanguage).includes(language)) {
      throw new LanguageNotSupportedError(language);
    }

    this.currentLanguage = language;
    
    // Trigger language change event if needed
    this.notifyLanguageChange(language);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(language?: SupportedLanguage): LanguageConfig {
    const targetLanguage = language || this.currentLanguage;
    const config = this.languageConfigs.get(targetLanguage);
    
    if (!config) {
      throw new LanguageNotSupportedError(targetLanguage);
    }
    
    return config;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return Array.from(this.languageConfigs.values());
  }

  /**
   * Get available languages (interface method alias)
   */
  getAvailableLanguages(): LanguageConfig[] {
    return this.getSupportedLanguages();
  }

  /**
   * Check if translation exists
   */
  exists(key: TranslationKey, namespace: TranslationNamespace = TranslationNamespace.COMMON): boolean {
    try {
      const value = this.getTranslationValue(this.currentLanguage, namespace, key);
      return value !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Load translations for a namespace
   */
  async loadNamespace(namespace: TranslationNamespace): Promise<void> {
    try {
      const languageTranslations = this.translations.get(this.currentLanguage);
      if (!languageTranslations) {
        throw new LanguageNotSupportedError(this.currentLanguage);
      }

      if (!languageTranslations.has(namespace)) {
        const translations = await this.loadTranslationFile(this.currentLanguage, namespace);
        languageTranslations.set(namespace, translations);
      }
    } catch (error) {
      throw new TranslationError(
        `Failed to load namespace ${namespace}`,
        'NAMESPACE_LOAD_FAILED',
        { namespace, language: this.currentLanguage }
      );
    }
  }

  /**
   * Get translation resource for debugging
   */
  getResource(language: SupportedLanguage, namespace: TranslationNamespace): Record<string, any> | null {
    const languageTranslations = this.translations.get(language);
    if (!languageTranslations) {
      return null;
    }
    
    return languageTranslations.get(namespace) || null;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: string): language is SupportedLanguage {
    return Object.values(SupportedLanguage).includes(language as SupportedLanguage);
  }

  /**
   * Get all translations for a specific namespace
   */
  getNamespaceTranslations(
    namespace: TranslationNamespace, 
    language?: SupportedLanguage
  ): Record<string, any> {
    this.ensureInitialized();
    
    const targetLanguage = language || this.currentLanguage;
    const languageTranslations = this.translations.get(targetLanguage);
    
    if (!languageTranslations) {
      throw new LanguageNotSupportedError(targetLanguage);
    }
    
    const namespaceTranslations = languageTranslations.get(namespace);
    if (!namespaceTranslations) {
      throw new NamespaceNotLoadedError(namespace, targetLanguage);
    }
    
    return namespaceTranslations;
  }

  /**
   * Format date according to current language settings
   */
  formatDate(date: Date, format?: string): string {
    const config = this.getLanguageConfig();
    const targetFormat = format || config.dateFormat;
    
    try {
      return new Intl.DateTimeFormat(config.numberFormat, {
        dateStyle: this.getDateStyle(targetFormat)
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  /**
   * Format number according to current language settings
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const config = this.getLanguageConfig();
    
    try {
      return new Intl.NumberFormat(config.numberFormat, options).format(number);
    } catch (error) {
      return number.toString();
    }
  }

  /**
   * Format currency according to current language settings
   */
  formatCurrency(amount: number, currency?: string): string {
    const config = this.getLanguageConfig();
    const targetCurrency = currency || 'USD';
    
    try {
      return new Intl.NumberFormat(config.numberFormat, {
        style: 'currency',
        currency: targetCurrency
      }).format(amount);
    } catch (error) {
      return `${targetCurrency} ${amount}`;
    }
  }

  /**
   * Get date style from format string
   */
  private getDateStyle(format: string): "full" | "long" | "medium" | "short" {
    if (format.includes('yyyy')) return 'long';
    if (format.includes('yy')) return 'medium';
    return 'short';
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new TranslationError('Translation service not initialized. Call initialize() first.', 'NOT_INITIALIZED');
    }
  }

  /**
   * Notify language change (can be extended for event systems)
   */
  private notifyLanguageChange(language: SupportedLanguage): void {
    // This can be extended to emit events or trigger callbacks
    console.log(`Language changed to: ${language}`);
  }

  /**
   * Get translation completion percentage for a language
   */
  getTranslationCompleteness(language: SupportedLanguage): number {
    this.ensureInitialized();
    
    const languageTranslations = this.translations.get(language);
    const fallbackTranslations = this.translations.get(this.fallbackLanguage);
    
    if (!languageTranslations || !fallbackTranslations) {
      return 0;
    }

    let totalKeys = 0;
    let translatedKeys = 0;

    for (const namespace of Object.values(TranslationNamespace)) {
      const fallbackNs = fallbackTranslations.get(namespace);
      const targetNs = languageTranslations.get(namespace);
      
      if (fallbackNs) {
        const fallbackCount = this.countNestedKeys(fallbackNs);
        const targetCount = targetNs ? this.countNestedKeys(targetNs) : 0;
        
        totalKeys += fallbackCount;
        translatedKeys += Math.min(targetCount, fallbackCount);
      }
    }

    return totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;
  }

  /**
   * Count nested keys in translation object
   */
  private countNestedKeys(obj: Record<string, any>, prefix = ''): number {
    let count = 0;
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        count += this.countNestedKeys(value, `${prefix}${key}.`);
      } else {
        count++;
      }
    }
    
    return count;
  }
}

// Singleton instance for global use
export const translationService = new TranslationService();

// Export default service instance
export default translationService;
