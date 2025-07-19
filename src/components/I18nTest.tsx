"use client";

import { useTranslation } from 'react-i18next';
import '@/lib/i18n'; // Importar a configuração

export default function I18nTest() {
  const { t, i18n } = useTranslation('common');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Teste i18n</h2>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={() => changeLanguage('pt-BR')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          PT-BR
        </button>
        <button 
          onClick={() => changeLanguage('en-US')}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          EN-US
        </button>
      </div>

      <div className="space-y-2">
        <p><strong>Idioma atual:</strong> {i18n.language}</p>
        <p><strong>Nome do app:</strong> {t('app.name')}</p>
        <p><strong>Descrição:</strong> {t('app.description')}</p>
        <p><strong>Bem-vindo:</strong> {t('app.welcome')}</p>
        <p><strong>Carregando:</strong> {t('common.loading')}</p>
        <p><strong>Salvar:</strong> {t('common.save')}</p>
      </div>
    </div>
  );
}
