'use client';

import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

export function TranslationTest() {
  const { t, i18n } = useTranslation();

  const testKeys = [
    'common:app.name',
    'common:app.description',
    'landing:hero.title.main',
    'landing:hero.title.highlight',
    'landing:hero.subtitle',
    'landing:hero.buttons.startFree',
    'landing:hero.buttons.viewPlans',
    'landing:nav.home',
    'landing:nav.features',
    'auth:login.title',
    'dashboard:title',
    'common:languages.chooseLang',
    'common:languages.pt-BR',
    'common:languages.en-US',
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Teste de Traduções</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Seletor de Idioma:</h2>
        <LanguageSelector variant="dropdown" />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Idioma atual:</strong> {i18n.language} | 
          <strong> Idiomas carregados:</strong> {i18n.languages.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Traduções de Teste:</h2>
        <div className="grid gap-3">
          {testKeys.map((key) => (
            <div key={key} className="border rounded p-3 bg-gray-50">
              <div className="font-mono text-sm text-blue-600 mb-1">{key}</div>
              <div className="text-gray-800">{t(key)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Status da Tradução:</h3>
        <p className="text-sm text-yellow-700">
          {t('landing:hero.title.main') === 'landing:hero.title.main' 
            ? '❌ Chaves sendo mostradas (problema na tradução)'
            : '✅ Traduções funcionando corretamente'
          }
        </p>
      </div>
    </div>
  );
}
