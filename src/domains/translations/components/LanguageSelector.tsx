"use client";

import React, { useState } from 'react';
import { 
  SupportedLanguage, 
  LanguageSelectorProps,
  LanguageConfig 
} from '../types/translation.types';
import { useTranslation, useLanguageConfig } from '../hooks/useTranslation';

/**
 * LanguageSelector Component
 * 
 * Dropdown component for selecting and changing the application language.
 * Supports multiple variants and customization options.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  size = 'md',
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  onLanguageChange
}) => {
  const { language, changeLanguage, isLoading } = useTranslation();
  const { config: currentConfig } = useLanguageConfig();
  const [isOpen, setIsOpen] = useState(false);

  // Get all available languages from translation service
  const availableLanguages: LanguageConfig[] = [
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

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    try {
      await changeLanguage(newLanguage);
      onLanguageChange?.(newLanguage);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-3';
      default:
        return 'text-base px-3 py-2';
    }
  };

  const renderLanguageOption = (lang: LanguageConfig, isSelected = false) => {
    const displayName = showNativeNames ? lang.nativeName : lang.name;
    
    return (
      <div className="flex items-center space-x-2">
        {showFlags && <span className="text-lg">{lang.flag}</span>}
        <span className={isSelected ? 'font-medium' : ''}>{displayName}</span>
      </div>
    );
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isLoading}
            className={`
              ${getSizeClasses()}
              rounded-md border transition-colors duration-200
              ${language === lang.code
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
            `}
          >
            {renderLanguageOption(lang, language === lang.code)}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'tabs') {
    return (
      <div className={`border-b border-gray-200 ${className}`}>
        <nav className="flex space-x-8">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isLoading}
              className={`
                ${getSizeClasses()}
                border-b-2 font-medium transition-colors duration-200
                ${language === lang.code
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {renderLanguageOption(lang, language === lang.code)}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          ${getSizeClasses()}
          inline-flex items-center justify-between w-full
          bg-white border border-gray-300 rounded-md shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined !text-[20px] md:!text-[22px]">translate</span>
          {currentConfig && renderLanguageOption(currentConfig, true)}
        </div>
        <span 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        >
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isLoading}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors duration-200
                    ${language === lang.code
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  `}
                >
                  {renderLanguageOption(lang, language === lang.code)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Props for CompactLanguageSelector
 */
interface CompactLanguageSelectorProps {
  className?: string;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

/**
 * CompactLanguageSelector Component
 * 
 * Minimal language selector showing only flags in a compact layout.
 */
export const CompactLanguageSelector: React.FC<CompactLanguageSelectorProps> = ({
  className = '',
  onLanguageChange
}) => {
  const { language, changeLanguage, isLoading } = useTranslation();

  const languageFlags = {
    [SupportedLanguage.ENGLISH]: '🇺🇸',
    [SupportedLanguage.PORTUGUESE]: '🇧🇷',
    [SupportedLanguage.SPANISH]: '🇪🇸',
    [SupportedLanguage.FRENCH]: '🇫🇷'
  };

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    try {
      await changeLanguage(newLanguage);
      onLanguageChange?.(newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Object.entries(languageFlags).map(([lang, flag]) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang as SupportedLanguage)}
          disabled={isLoading}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-lg
            transition-all duration-200 hover:scale-110
            ${language === lang
              ? 'ring-2 ring-blue-600 ring-offset-2'
              : 'hover:bg-gray-100'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={lang}
        >
          {flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
