"use client";

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function I18nDebug() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('i18n Debug - Current language:', i18n.language);
    console.log('i18n Debug - Loaded resources:', i18n.store.data);
    console.log('i18n Debug - Available languages:', i18n.languages);
    console.log('i18n Debug - Is initialized:', i18n.isInitialized);
  }, [i18n]);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-yellow-800 mb-2">i18n Debug</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>Initialized:</strong> {i18n.isInitialized ? 'Yes' : 'No'}</p>
        <p><strong>Test Translation:</strong> {t('app.welcome')}</p>
        <p><strong>Available Languages:</strong> {i18n.languages.join(', ')}</p>
      </div>
    </div>
  );
}
