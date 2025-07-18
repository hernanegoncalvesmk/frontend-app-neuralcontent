"use client";

import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';

/**
 * Componente de demonstração dos diferentes variants do LanguageSelector
 */
export default function LanguageSelectorExamples() {
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Seletores de Idioma
      </h3>
      
      <div className="space-y-4">
        {/* Dropdown Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dropdown (padrão):
          </label>
          <LanguageSelector variant="dropdown" />
        </div>
        
        {/* Buttons Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Botões:
          </label>
          <LanguageSelector variant="buttons" />
        </div>
        
        {/* Minimal Variant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimal:
          </label>
          <LanguageSelector variant="minimal" />
        </div>
        
        {/* Minimal com apenas flags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Apenas bandeiras:
          </label>
          <LanguageSelector 
            variant="minimal" 
            showFlags={true} 
            showNames={false}
          />
        </div>
      </div>
    </div>
  );
}
