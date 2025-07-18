// ============================================================================
// NEURAL CONTENT - SEÇÃO DE PREFERÊNCIAS
// ============================================================================

/**
 * Componente para configuração de preferências do usuário
 * 
 * @description Seção do perfil para configurar idioma, timezone, tema,
 * notificações e outras preferências do usuário
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  PreferencesSectionProps, 
  UserPreferences, 
  // NotificationSettings, // Será usado posteriormente
  NotificationCategory,
  NotificationType,
  ThemeMode
} from '@/types/profile.types';

// ============================================================================
// INTERFACES
// ============================================================================

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'pt-BR', name: 'Português (Brasil)', nativeName: 'Português' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
  { code: 'es-ES', name: 'Español (España)', nativeName: 'Español' },
  { code: 'fr-FR', name: 'Français (France)', nativeName: 'Français' },
];

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)', offset: '-03:00' },
  { value: 'America/New_York', label: 'New York (GMT-5)', offset: '-05:00' },
  { value: 'Europe/London', label: 'London (GMT+0)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offset: '+09:00' },
];

const THEME_OPTIONS: ThemeOption[] = [
  { value: ThemeMode.LIGHT, label: 'Claro', icon: 'light_mode' },
  { value: ThemeMode.DARK, label: 'Escuro', icon: 'dark_mode' },
  { value: ThemeMode.SYSTEM, label: 'Sistema', icon: 'computer' },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PreferencesSection({
  preferences,
  loading = false,
  onUpdate
}: PreferencesSectionProps) {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(
    preferences || {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      theme: ThemeMode.SYSTEM,
      notifications: {
        [NotificationCategory.CREDITS]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: true,
        },
        [NotificationCategory.SECURITY]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: true,
        },
        [NotificationCategory.SYSTEM]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: false,
        },
        [NotificationCategory.MARKETING]: {
          [NotificationType.EMAIL]: false,
          [NotificationType.IN_APP]: false,
          [NotificationType.PUSH]: false,
        },
      },
    }
  );

  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePreferenceChange = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await onUpdate(localPreferences);
      setIsEditing(false);
      setIsDirty(false);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  }, [localPreferences, onUpdate]);

  const handleCancel = useCallback(() => {
    setLocalPreferences(preferences || localPreferences);
    setIsEditing(false);
    setIsDirty(false);
  }, [preferences, localPreferences]);

  const handleReset = useCallback(() => {
    const defaultPreferences: UserPreferences = {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      theme: ThemeMode.SYSTEM,
      notifications: {
        [NotificationCategory.CREDITS]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: true,
        },
        [NotificationCategory.SECURITY]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: true,
        },
        [NotificationCategory.SYSTEM]: {
          [NotificationType.EMAIL]: true,
          [NotificationType.IN_APP]: true,
          [NotificationType.PUSH]: false,
        },
        [NotificationCategory.MARKETING]: {
          [NotificationType.EMAIL]: false,
          [NotificationType.IN_APP]: false,
          [NotificationType.PUSH]: false,
        },
      },
    };
    
    setLocalPreferences(defaultPreferences);
    setIsDirty(true);
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderLanguageSelect = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Idioma da Interface
      </label>
      <select
        value={localPreferences.language}
        onChange={(e) => handlePreferenceChange('language', e.target.value)}
        disabled={!isEditing || loading}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
      >
        {LANGUAGE_OPTIONS.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );

  const renderTimezoneSelect = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Fuso Horário
      </label>
      <select
        value={localPreferences.timezone}
        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
        disabled={!isEditing || loading}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
      >
        {TIMEZONE_OPTIONS.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderThemeSelect = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tema da Interface
      </label>
      <div className="grid grid-cols-3 gap-2">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.value}
            onClick={() => handlePreferenceChange('theme', theme.value)}
            disabled={!isEditing || loading}
            className={`
              p-3 border rounded-lg flex flex-col items-center gap-2 transition-all duration-200 disabled:opacity-50
              ${localPreferences.theme === theme.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
          >
            <span className="material-icons text-xl">{theme.icon}</span>
            <span className="text-xs font-medium">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderNotificationToggle = (
    category: NotificationCategory,
    type: NotificationType,
    label: string,
    description?: string
  ) => {
    const isEnabled = localPreferences.notifications?.[category]?.[type] || false;
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </h4>
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            const newNotifications = {
              ...localPreferences.notifications,
              [category]: {
                ...localPreferences.notifications[category],
                [type]: !isEnabled,
              },
            };
            handlePreferenceChange('notifications', newNotifications);
          }}
          disabled={!isEditing || loading}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
            ${isEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferências
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure suas preferências de idioma, tema e notificações
            </p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
            >
              <span className="material-icons mr-2 text-sm">settings</span>
              Configurar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
              >
                <span className="material-icons text-sm">restore</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !isDirty}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <span className="material-icons animate-spin text-sm mr-2">refresh</span>
                ) : (
                  <span className="material-icons mr-2 text-sm">save</span>
                )}
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="space-y-8">
          
          {/* Seção: Localização */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">language</span>
              Localização e Idioma
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderLanguageSelect()}
              {renderTimezoneSelect()}
            </div>
          </div>

          {/* Seção: Aparência */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">palette</span>
              Aparência
            </h4>
            <div className="space-y-4">
              {renderThemeSelect()}
            </div>
          </div>

          {/* Seção: Notificações */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">notifications</span>
              Notificações
            </h4>
            <div className="space-y-4">
              {renderNotificationToggle(
                NotificationCategory.CREDITS,
                NotificationType.EMAIL,
                'Créditos por Email',
                'Receba notificações sobre créditos por email'
              )}
              {renderNotificationToggle(
                NotificationCategory.CREDITS,
                NotificationType.PUSH,
                'Créditos Push',
                'Receba notificações instantâneas sobre créditos'
              )}
              {renderNotificationToggle(
                NotificationCategory.SECURITY,
                NotificationType.EMAIL,
                'Segurança por Email',
                'Receba alertas de segurança por email'
              )}
              {renderNotificationToggle(
                NotificationCategory.SYSTEM,
                NotificationType.EMAIL,
                'Sistema por Email',
                'Receba atualizações do sistema por email'
              )}
              {renderNotificationToggle(
                NotificationCategory.MARKETING,
                NotificationType.EMAIL,
                'Marketing por Email',
                'Receba ofertas especiais e novidades'
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
