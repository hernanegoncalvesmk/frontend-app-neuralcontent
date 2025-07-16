// ============================================================================
// NEURAL CONTENT - PÁGINA DO PERFIL DO USUÁRIO
// ============================================================================

/**
 * Página principal do perfil do usuário
 * 
 * @description Implementação completa da página de perfil com navegação por abas,
 * incluindo informações pessoais, preferências e configurações de segurança
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

// Componentes das seções
import PersonalInfoSection from '@/components/profile/PersonalInfoSection';
import PreferencesSection from '@/components/profile/PreferencesSection';
import SecuritySection from '@/components/profile/SecuritySection';

// ============================================================================
// INTERFACES
// ============================================================================

type TabId = 'personal' | 'preferences' | 'security';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const PROFILE_TABS: Tab[] = [
  {
    id: 'personal',
    label: 'Informações Pessoais',
    icon: 'person',
    description: 'Gerencie suas informações pessoais e foto de perfil'
  },
  {
    id: 'preferences',
    label: 'Preferências',
    icon: 'settings',
    description: 'Configure idioma, tema e notificações'
  },
  {
    id: 'security',
    label: 'Segurança',
    icon: 'security',
    description: 'Gerencie senhas, 2FA e sessões ativas'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ProfilePage() {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [activeTab, setActiveTab] = useState<TabId>('personal');

  // ============================================================================
  // HOOKS
  // ============================================================================

  const {
    // Estado
    state,
    
    // Ações de perfil
    updateProfile,
    uploadAvatar,
    
    // Ações de preferências
    updatePreferences,
    
    // Ações de segurança
    enable2FA,
    disable2FA,
    terminateSession,
    terminateAllSessions,
    
    // Controle
    loadProfile,
    isLoading,
    hasError,
    getError
  } = useProfile();

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderTabNavigation = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="material-icons mr-2 text-lg group-hover:text-current">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Descrição da aba ativa */}
        <div className="mt-4">
          {PROFILE_TABS.map((tab) => (
            activeTab === tab.id && (
              <p key={tab.id} className="text-sm text-gray-600 dark:text-gray-400">
                {tab.description}
              </p>
            )
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!state.profile || !state.preferences || !state.security) {
      return null;
    }

    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoSection
            profile={state.profile}
            loading={isLoading('profile') || isLoading('avatar')}
            onUpdate={async (data) => {
              const success = await updateProfile(data);
              if (!success) {
                console.error('Erro ao atualizar perfil');
              }
            }}
            onAvatarUpload={async (file) => {
              const success = await uploadAvatar(file);
              if (!success) {
                console.error('Erro ao fazer upload do avatar');
              }
            }}
          />
        );

      case 'preferences':
        return (
          <PreferencesSection
            preferences={state.preferences}
            loading={isLoading('preferences')}
            onUpdate={async (data) => {
              const success = await updatePreferences(data);
              if (!success) {
                console.error('Erro ao atualizar preferências');
              }
            }}
          />
        );

      case 'security':
        return (
          <SecuritySection
            security={state.security}
            loading={isLoading('twoFactor') || isLoading('security')}
            onEnable2FA={async () => {
              const success = await enable2FA();
              if (!success) {
                console.error('Erro ao ativar 2FA');
              }
            }}
            onDisable2FA={async () => {
              const success = await disable2FA(''); // TODO: Implementar entrada de código
              if (!success) {
                console.error('Erro ao desativar 2FA');
              }
            }}
            onTerminateSession={async (sessionId) => {
              const success = await terminateSession(sessionId);
              if (!success) {
                console.error('Erro ao encerrar sessão');
              }
            }}
            onTerminateAllSessions={async () => {
              const success = await terminateAllSessions();
              if (!success) {
                console.error('Erro ao encerrar todas as sessões');
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  const renderHeader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
              {state.profile?.avatar ? (
                <img
                  src={state.profile.avatar}
                  alt={state.profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-icons text-2xl text-gray-400">person</span>
                </div>
              )}
            </div>
            
            {/* Info do usuário */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {state.profile?.name || 'Carregando...'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {state.profile?.email}
              </p>
              {state.profile?.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {state.profile.bio}
                </p>
              )}
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            {/* 2FA Status */}
            {state.security?.twoFactorAuth && (
              <div className="flex items-center">
                <span className={`
                  material-icons mr-1 text-sm
                  ${state.security.twoFactorAuth.enabled ? 'text-green-600' : 'text-gray-400'}
                `}>
                  {state.security.twoFactorAuth.enabled ? 'verified_user' : 'security'}
                </span>
                <span className={`
                  text-xs font-medium
                  ${state.security.twoFactorAuth.enabled ? 'text-green-600' : 'text-gray-500'}
                `}>
                  2FA {state.security.twoFactorAuth.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            )}
            
            {/* Sessions count */}
            {state.security?.sessions && (
              <div className="flex items-center">
                <span className="material-icons mr-1 text-sm text-blue-600">devices</span>
                <span className="text-xs font-medium text-blue-600">
                  {state.security.sessions.length} {state.security.sessions.length === 1 ? 'Sessão' : 'Sessões'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6">
      <div className="flex items-center">
        <span className="material-icons mr-3 text-red-600">error</span>
        <div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
            Erro ao Carregar Perfil
          </h3>
          <p className="text-red-600 dark:text-red-300 mt-1">
            {getError('profile') || 'Ocorreu um erro inesperado. Tente novamente.'}
          </p>
          <button
            onClick={loadProfile}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200"
          >
            <span className="material-icons mr-2 text-sm">refresh</span>
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            ))}
          </div>
          <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading('profile')) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderLoadingState()}
      </div>
    );
  }

  if (hasError('profile')) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderErrorState()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {renderHeader()}
      {renderTabNavigation()}
      {renderTabContent()}
    </div>
  );
}
