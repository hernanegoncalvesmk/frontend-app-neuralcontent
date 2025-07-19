"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  className?: string;
  showFlags?: boolean;
  showNames?: boolean;
}

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector({ 
  variant = 'dropdown',
  className = '',
  showFlags = true,
  showNames = true 
}: LanguageSelectorProps) {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language);

  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              i18n.language === language.code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={language.name}
          >
            {showFlags && language.flag}
            {showNames && <span className="ml-1">{language.code}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Render buttons variant
  if (variant === 'buttons') {
    return (
      <div className={`space-y-2 ${className}`}>
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
              i18n.language === language.code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
            }`}
          >
            {showFlags && <span className="mr-2">{language.flag}</span>}
            {showNames && language.name}
          </button>
        ))}
      </div>
    );
  }

  // Render dropdown variant (default)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
        aria-label={t('languages.chooseLang')}
      >
        {showFlags && <span className="text-lg">{currentLang?.flag || '🌐'}</span>}
        {showNames && <span className="hidden md:inline">{currentLang?.name || 'Português'}</span>}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg min-w-[200px] z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              {t('languages.chooseLang')}
            </div>
            
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-left ${
                  i18n.language === language.code 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                {showFlags && <span className="text-lg">{language.flag}</span>}
                {showNames && <span className="flex-1 text-sm font-medium">{language.name}</span>}
                {i18n.language === language.code && (
                  <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
