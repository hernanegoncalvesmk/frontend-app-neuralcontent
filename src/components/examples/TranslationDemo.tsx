import React from 'react';
import { 
  TranslatedText, 
  LanguageSelector, 
  useTranslation 
} from '@/domains/translations';
import { TranslationNamespace } from '@/domains/translations/types/translation.types';

export default function TranslationDemo() {
  const { tns, language } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Translation System Demo
          </h1>
          <LanguageSelector 
            variant="tabs"
            showFlags={true}
            showNativeNames={true}
          />
        </div>

        {/* Current Language Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-2">Current Language: {language}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All translations below will update automatically when you change the language.
          </p>
        </div>

        {/* Common Translations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <TranslatedText 
              tKey="common" 
              namespace={TranslationNamespace.COMMON}
              fallback="Common Translations"
            />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Actions</h3>
              <ul className="space-y-1 text-sm">
                <li>• {tns(TranslationNamespace.COMMON, 'actions.create')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'actions.save')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'actions.delete')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'actions.cancel')}</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Navigation</h3>
              <ul className="space-y-1 text-sm">
                <li>• {tns(TranslationNamespace.COMMON, 'navigation.home')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'navigation.dashboard')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'navigation.settings')}</li>
                <li>• {tns(TranslationNamespace.COMMON, 'navigation.help')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Auth Translations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <TranslatedText 
              tKey="authentication" 
              fallback="Authentication Translations"
            />
          </h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Login Form</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {tns(TranslationNamespace.AUTH, 'login.title')}</p>
                  <p><strong>Email:</strong> {tns(TranslationNamespace.AUTH, 'login.email')}</p>
                  <p><strong>Password:</strong> {tns(TranslationNamespace.AUTH, 'login.password')}</p>
                  <p><strong>Button:</strong> {tns(TranslationNamespace.AUTH, 'login.signInButton')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Forgot Password</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {tns(TranslationNamespace.AUTH, 'forgotPassword.title')}</p>
                  <p><strong>Subtitle:</strong> {tns(TranslationNamespace.AUTH, 'forgotPassword.subtitle')}</p>
                  <p><strong>Button:</strong> {tns(TranslationNamespace.AUTH, 'forgotPassword.submitButton')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Validation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Form Validation Messages</h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {tns(TranslationNamespace.VALIDATION, 'form.email.required')}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {tns(TranslationNamespace.VALIDATION, 'form.password.minLength', { min: 8 })}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {tns(TranslationNamespace.VALIDATION, 'form.password.mismatch')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Messages */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Error Messages</h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                <p className="text-orange-600 dark:text-orange-400 text-sm">
                  {tns(TranslationNamespace.ERRORS, 'network.connectionError')}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {tns(TranslationNamespace.ERRORS, 'auth.sessionExpired')}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tns(TranslationNamespace.ERRORS, 'general.somethingWentWrong')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-green-600 dark:text-green-400 text-sm">
                  {tns(TranslationNamespace.COMMON, 'notifications.saved')}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-blue-600 dark:text-blue-400 text-sm">
                  {tns(TranslationNamespace.COMMON, 'notifications.updated')}
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded">
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  {tns(TranslationNamespace.COMMON, 'notifications.newVersionAvailable')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Language Selector Variants */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Language Selector Variants</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Dropdown Variant</h3>
              <LanguageSelector variant="dropdown" showFlags={true} showNativeNames={true} />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Button Variant</h3>
              <LanguageSelector variant="buttons" showFlags={true} showNativeNames={false} />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Tab Variant</h3>
              <LanguageSelector variant="tabs" showFlags={true} showNativeNames={true} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
