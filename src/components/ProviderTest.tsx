"use client";

import React, { useEffect } from 'react';
import { useTranslations, useLanguage } from '@/providers/TranslationProvider';
import { useTranslation } from 'react-i18next';

export default function ProviderTest() {
  const { t, currentLanguage, isLoading } = useTranslations();
  const { changeLanguage, languages } = useLanguage();
  const { i18n } = useTranslation();

  useEffect(() => {
    console.log('=== Provider Test Debug ===');
    console.log('Current language:', currentLanguage);
    console.log('Is loading:', isLoading);
    console.log('i18n initialized:', i18n.isInitialized);
    console.log('i18n language:', i18n.language);
    console.log('Available languages:', languages);
  }, [currentLanguage, isLoading, i18n, languages]);

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-blue-800 mb-3">Provider Test</h3>
      
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>Current Language:</strong>
            <br />
            {currentLanguage}
          </div>
          <div>
            <strong>Loading:</strong>
            <br />
            {isLoading ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div>
          <strong>Test Translation:</strong>
          <br />
          {t('app.welcome')}
        </div>
        
        <div>
          <strong>Navigation Test:</strong>
          <br />
          {t('navigation.dashboard')}
        </div>
        
        <div>
          <strong>Landing Test:</strong>
          <br />
          {t('landing.nav.home')}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <div className="flex flex-wrap gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-2 py-1 text-xs rounded ${
                currentLanguage === lang.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {lang.flag} {lang.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
