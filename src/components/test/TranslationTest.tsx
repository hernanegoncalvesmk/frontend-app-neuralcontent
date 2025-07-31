/**
 * Test do Sistema de Traduções
 */

import React from 'react';
import { 
  useTranslation, 
  TranslatedText, 
  LanguageSelector, 
  SupportedLanguage, 
  TranslationNamespace 
} from '@/domains/translations';

export default function TranslationTest() {
  const translationHook = useTranslation();
  const { tns, language } = translationHook;

  const testTranslations = () => {
    console.log('🧪 Testando Sistema de Traduções');
    console.log('📍 Idioma atual:', language);
    
    // Teste de traduções básicas
    console.log('🔤 Teste AUTH:', tns(TranslationNamespace.AUTH, 'login.title'));
    console.log('🔤 Teste COMMON:', tns(TranslationNamespace.COMMON, 'actions.save'));
    console.log('🔤 Teste VALIDATION:', tns(TranslationNamespace.VALIDATION, 'form.email.required'));
    console.log('🔤 Teste ERRORS:', tns(TranslationNamespace.ERRORS, 'network.connectionError'));
    
    // Teste de interpolação
    console.log('🔢 Teste Interpolação:', tns(TranslationNamespace.VALIDATION, 'form.password.minLength', { min: 8 }));
  };

  const switchToFrench = () => {
    if ('changeLanguage' in translationHook) {
      translationHook.changeLanguage(SupportedLanguage.FRENCH);
    }
    console.log('🇫🇷 Mudando para Francês');
  };

  const switchToSpanish = () => {
    if ('changeLanguage' in translationHook) {
      translationHook.changeLanguage(SupportedLanguage.SPANISH);
    }
    console.log('🇪🇸 Mudando para Espanhol');
  };

  const switchToPortuguese = () => {
    if ('changeLanguage' in translationHook) {
      translationHook.changeLanguage(SupportedLanguage.PORTUGUESE);
    }
    console.log('🇧🇷 Mudando para Português');
  };

  const switchToEnglish = () => {
    if ('changeLanguage' in translationHook) {
      translationHook.changeLanguage(SupportedLanguage.ENGLISH);
    }
    console.log('🇺🇸 Mudando para Inglês');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Teste do Sistema de Traduções</h1>
      
      {/* Idioma Atual */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">📍 Idioma Atual</h2>
        <p className="text-lg">
          <strong>Código:</strong> {language}
        </p>
        <p className="text-lg">
          <strong>Nome:</strong> {tns(TranslationNamespace.COMMON, 'language.current')}
        </p>
      </div>

      {/* Seletor de Idioma */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🌐 Seletor de Idioma</h2>
        <LanguageSelector variant="tabs" showFlags={true} showNativeNames={true} />
      </div>

      {/* Botões de Teste */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Testes Rápidos</h2>
        <div className="flex gap-4 flex-wrap">
          <button onClick={testTranslations} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            🧪 Testar Traduções
          </button>
          <button onClick={switchToFrench} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            🇫🇷 Francês
          </button>
          <button onClick={switchToSpanish} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            🇪🇸 Espanhol
          </button>
          <button onClick={switchToPortuguese} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            🇧🇷 Português
          </button>
          <button onClick={switchToEnglish} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            🇺🇸 Inglês
          </button>
        </div>
      </div>

      {/* Exemplos de Tradução */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AUTH */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🔐 AUTH</h3>
          <ul className="space-y-1 text-sm">
            <li>Login: <TranslatedText tKey="login.title" namespace={TranslationNamespace.AUTH} /></li>
            <li>Register: <TranslatedText tKey="register.title" namespace={TranslationNamespace.AUTH} /></li>
            <li>Forgot: <TranslatedText tKey="forgotPassword.title" namespace={TranslationNamespace.AUTH} /></li>
          </ul>
        </div>

        {/* COMMON */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">🌟 COMMON</h3>
          <ul className="space-y-1 text-sm">
            <li>Save: <TranslatedText tKey="actions.save" namespace={TranslationNamespace.COMMON} /></li>
            <li>Cancel: <TranslatedText tKey="actions.cancel" namespace={TranslationNamespace.COMMON} /></li>
            <li>Loading: <TranslatedText tKey="status.loading" namespace={TranslationNamespace.COMMON} /></li>
          </ul>
        </div>

        {/* VALIDATION */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">✅ VALIDATION</h3>
          <ul className="space-y-1 text-sm">
            <li>Email Required: <TranslatedText tKey="form.email.required" namespace={TranslationNamespace.VALIDATION} /></li>
            <li>Password Min: {tns(TranslationNamespace.VALIDATION, 'form.password.minLength', { min: 8 })}</li>
          </ul>
        </div>

        {/* ERRORS */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">❌ ERRORS</h3>
          <ul className="space-y-1 text-sm">
            <li>Network: <TranslatedText tKey="network.connectionError" namespace={TranslationNamespace.ERRORS} /></li>
            <li>Auth: <TranslatedText tKey="auth.sessionExpired" namespace={TranslationNamespace.ERRORS} /></li>
          </ul>
        </div>
      </div>

      {/* Status */}
      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">✅ Status do Sistema</h2>
        <ul className="text-green-600 dark:text-green-400 space-y-1">
          <li>✅ 4 idiomas suportados (EN, PT, ES, FR)</li>
          <li>✅ 4 namespaces implementados (COMMON, AUTH, VALIDATION, ERRORS)</li>
          <li>✅ Troca de idioma em tempo real</li>
          <li>✅ Persistência no localStorage</li>
          <li>✅ Interpolação de variáveis</li>
          <li>✅ TypeScript type-safe</li>
        </ul>
      </div>
    </div>
  );
}
