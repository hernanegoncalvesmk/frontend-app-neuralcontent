/**
 * @fileoverview Translation Domain Types
 * 
 * Core type definitions for the translation/i18n domain.
 * Includes language configs, translation keys, and service interfaces.
 * 
 * @version 1.0.0
 * @domain translations
 */

import React from 'react';

// ============================================================================
// ENUMS
// ============================================================================

export enum SupportedLanguage {
  ENGLISH = 'en',
  PORTUGUESE = 'pt',
  SPANISH = 'es',
  FRENCH = 'fr'
}

export enum TranslationNamespace {
  COMMON = 'common',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  BILLING = 'billing',
  ADMIN = 'admin',
  ERRORS = 'errors',
  VALIDATION = 'validation'
}

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  dateFormat: string;
  numberFormat: string;
  pluralRules?: string[];
}

export interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  fallbackLanguage: SupportedLanguage;
  namespaces: TranslationNamespace[];
  languages: LanguageConfig[];
}

// ============================================================================
// TRANSLATION RESOURCES
// ============================================================================

export type TranslationKey = string;
export type TranslationValue = string | { [key: string]: any };
export type TranslationVariables = Record<string, string | number>;

export interface TranslationResource {
  [key: TranslationKey]: TranslationValue;
}

export interface NamespaceResources {
  [namespace: string]: TranslationResource;
}

export interface LanguageResources {
  [language: string]: NamespaceResources;
}

// ============================================================================
// TRANSLATION SERVICE INTERFACES
// ============================================================================

export interface TranslationServiceInterface {
  /**
   * Translate a key with optional variables
   */
  t(key: TranslationKey, variables?: TranslationVariables): string;
  
  /**
   * Translate with specific namespace
   */
  tns(namespace: TranslationNamespace, key: TranslationKey, variables?: TranslationVariables): string;
  
  /**
   * Change the current language
   */
  changeLanguage(language: SupportedLanguage): Promise<void>;
  
  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage;
  
  /**
   * Get available languages
   */
  getAvailableLanguages(): LanguageConfig[];
  
  /**
   * Check if translation exists
   */
  exists(key: TranslationKey, namespace?: TranslationNamespace): boolean;
  
  /**
   * Load translations for a namespace
   */
  loadNamespace(namespace: TranslationNamespace): Promise<void>;
  
  /**
   * Get translation resource for debugging
   */
  getResource(language: SupportedLanguage, namespace: TranslationNamespace): TranslationResource | null;
}

// ============================================================================
// HOOKS AND CONTEXT TYPES
// ============================================================================

export interface UseTranslationResult {
  t: TranslationServiceInterface['t'];
  tns: TranslationServiceInterface['tns'];
  language: SupportedLanguage;
  changeLanguage: TranslationServiceInterface['changeLanguage'];
  isLoading: boolean;
  isReady: boolean;
}

export interface TranslationContextType extends UseTranslationResult {
  config: I18nConfig;
  service: TranslationServiceInterface;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface LanguageSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dropdown' | 'tabs' | 'buttons';
  showFlags?: boolean;
  showNativeNames?: boolean;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export interface TranslatedTextProps {
  tKey: TranslationKey;
  namespace?: TranslationNamespace;
  variables?: TranslationVariables;
  fallback?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  [key: string]: any;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface TranslationApiResponse {
  language: SupportedLanguage;
  namespace: TranslationNamespace;
  translations: TranslationResource;
  version: string;
  lastUpdated: string;
}

export interface TranslationSyncRequest {
  language: SupportedLanguage;
  namespace: TranslationNamespace;
  clientVersion?: string;
}

export interface TranslationSyncResponse {
  hasUpdates: boolean;
  translations?: TranslationResource;
  version: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class TranslationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'TranslationError';
  }
}

export class MissingTranslationError extends TranslationError {
  constructor(key: TranslationKey, language: SupportedLanguage, namespace?: TranslationNamespace) {
    super(
      `Missing translation for key "${key}" in language "${language}"${namespace ? ` (namespace: ${namespace})` : ''}`,
      'MISSING_TRANSLATION',
      { key, language, namespace }
    );
  }
}

export class NamespaceNotLoadedError extends TranslationError {
  constructor(namespace: TranslationNamespace, language: SupportedLanguage) {
    super(
      `Namespace "${namespace}" not loaded for language "${language}"`,
      'NAMESPACE_NOT_LOADED',
      { namespace, language }
    );
  }
}

export class LanguageNotSupportedError extends TranslationError {
  constructor(language: string) {
    super(
      `Language "${language}" is not supported`,
      'LANGUAGE_NOT_SUPPORTED',
      { language }
    );
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type TranslationKeys<T> = string;

export type NestedKeyOf<ObjectType> = string;

// ============================================================================
// CONSTANTS
// ============================================================================

export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  {
    code: SupportedLanguage.ENGLISH,
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US'
  },
  {
    code: SupportedLanguage.PORTUGUESE,
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'pt-BR'
  },
  {
    code: SupportedLanguage.SPANISH,
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES'
  },
  {
    code: SupportedLanguage.FRENCH,
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR'
  }
];

export const DEFAULT_I18N_CONFIG: I18nConfig = {
  defaultLanguage: SupportedLanguage.ENGLISH,
  supportedLanguages: [
    SupportedLanguage.ENGLISH,
    SupportedLanguage.PORTUGUESE,
    SupportedLanguage.SPANISH,
    SupportedLanguage.FRENCH
  ],
  fallbackLanguage: SupportedLanguage.ENGLISH,
  namespaces: Object.values(TranslationNamespace),
  languages: LANGUAGE_CONFIGS
};
