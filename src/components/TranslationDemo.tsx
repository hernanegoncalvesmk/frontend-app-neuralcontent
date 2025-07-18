"use client";

import React, { useState } from 'react';
import { useTranslations, useLanguage } from '@/providers/TranslationProvider';

export default function TranslationDemo() {
  const { t } = useTranslations();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const demoSections = [
    {
      title: 'App',
      key: 'app',
      items: [
        { key: 'app.name', label: 'Nome da App' },
        { key: 'app.description', label: 'Descrição' },
        { key: 'app.welcome', label: 'Boas-vindas' },
      ]
    },
    {
      title: 'Navigation',
      key: 'navigation',
      items: [
        { key: 'navigation.dashboard', label: 'Dashboard' },
        { key: 'navigation.billing', label: 'Cobrança' },
        { key: 'navigation.profile', label: 'Perfil' },
      ]
    },
    {
      title: 'Landing Page',
      key: 'landing',
      items: [
        { key: 'landing.hero.title.main', label: 'Título Principal' },
        { key: 'landing.hero.title.highlight', label: 'Destaque' },
        { key: 'landing.hero.subtitle', label: 'Subtítulo' },
        { key: 'landing.hero.buttons.startFree', label: 'Botão Começar' },
      ]
    },
    {
      title: 'Common',
      key: 'common',
      items: [
        { key: 'common.loading', label: 'Carregando' },
        { key: 'common.save', label: 'Salvar' },
        { key: 'common.cancel', label: 'Cancelar' },
        { key: 'common.success', label: 'Sucesso' },
      ]
    }
  ];

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-w-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🌍 Sistema de Tradução
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-2 py-1 text-xs rounded ${
                currentLanguage === lang.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {lang.flag} {lang.code}
            </button>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {demoSections.map((section) => (
              <div key={section.key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.key} className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {item.label}:
                      </div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {t(item.key)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Idioma atual: <span className="font-medium">{currentLanguage}</span>
        </div>
      </div>
    </div>
  );
}
