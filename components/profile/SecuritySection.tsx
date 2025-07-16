// ============================================================================
// NEURAL CONTENT - SEÇÃO DE SEGURANÇA
// ============================================================================

/**
 * Componente para configurações de segurança do usuário
 * 
 * @description Seção do perfil para gerenciar 2FA, sessões ativas,
 * alteração de senha e atividades de segurança
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  SecuritySectionProps, 
  // SecuritySettings, // Será usado posteriormente
  // TwoFactorAuth, // Será usado posteriormente
  UserSession, 
  SecurityActivity,
  // TwoFactorStatus, // Será usado posteriormente
  SecurityActivityType
} from '@/types/profile.types';

// ============================================================================
// INTERFACES
// ============================================================================

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SecuritySection({
  security,
  loading = false,
  onEnable2FA,
  onDisable2FA,
  onTerminateSession,
  onTerminateAllSessions
}: SecuritySectionProps) {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePasswordChange = useCallback((field: keyof PasswordChangeForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo específico
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [validationErrors]);

  const validatePasswordForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Nova senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Nova senha deve ter ao menos uma letra maiúscula, minúscula e um número';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Confirmação da senha não confere';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordForm]);

  const handlePasswordSubmit = useCallback(async () => {
    if (!validatePasswordForm()) return;

    try {
      // Implementar integração com API de alteração de senha
      console.log('Alterando senha...', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
    }
  }, [validatePasswordForm, passwordForm]);

  const handle2FAToggle = useCallback(async () => {
    try {
      setPendingAction('2fa');
      
      if (security?.twoFactorAuth?.enabled) {
        await onDisable2FA();
      } else {
        await onEnable2FA();
      }
    } catch (error) {
      console.error('Erro ao alterar 2FA:', error);
    } finally {
      setPendingAction(null);
    }
  }, [security?.twoFactorAuth?.enabled, onEnable2FA, onDisable2FA]);

  const handleSessionTerminate = useCallback(async (sessionId: string) => {
    try {
      setPendingAction(sessionId);
      await onTerminateSession(sessionId);
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    } finally {
      setPendingAction(null);
    }
  }, [onTerminateSession]);

  const handleTerminateAllSessions = useCallback(async () => {
    if (!confirm('Tem certeza que deseja encerrar todas as outras sessões?')) return;

    try {
      setPendingAction('all-sessions');
      await onTerminateAllSessions();
    } catch (error) {
      console.error('Erro ao encerrar todas as sessões:', error);
    } finally {
      setPendingAction(null);
    }
  }, [onTerminateAllSessions]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPasswordSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Alterar Senha
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Mantenha sua conta segura com uma senha forte
          </p>
        </div>
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
        >
          <span className="material-icons mr-2 text-sm">lock</span>
          {showPasswordForm ? 'Cancelar' : 'Alterar Senha'}
        </button>
      </div>

      {showPasswordForm && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha Atual
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${validationErrors.currentPassword 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
                }
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              `}
              placeholder="Digite sua senha atual"
            />
            {validationErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${validationErrors.newPassword 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
                }
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              `}
              placeholder="Digite a nova senha"
            />
            {validationErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${validationErrors.confirmPassword 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
                }
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              `}
              placeholder="Confirme a nova senha"
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPasswordForm(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handlePasswordSubmit}
              disabled={loading}
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
        </div>
      )}
    </div>
  );

  const render2FASection = () => (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Autenticação em Duas Etapas (2FA)
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {security?.twoFactorAuth?.enabled 
            ? `Ativo via email: ${security.twoFactorAuth.email}`
            : 'Adicione uma camada extra de segurança'
          }
        </p>
        {security?.twoFactorAuth?.enabled && security.twoFactorAuth.enabledAt && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Ativo desde: {new Date(security.twoFactorAuth.enabledAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
      
      <button
        onClick={handle2FAToggle}
        disabled={loading || pendingAction === '2fa'}
        className={`
          px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50
          ${security?.twoFactorAuth?.enabled 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
          }
        `}
      >
        {pendingAction === '2fa' ? (
          <span className="material-icons animate-spin text-sm">refresh</span>
        ) : (
          <>
            <span className="material-icons mr-2 text-sm">
              {security?.twoFactorAuth?.enabled ? 'security' : 'enhanced_encryption'}
            </span>
            {security?.twoFactorAuth?.enabled ? 'Desativar' : 'Ativar'} 2FA
          </>
        )}
      </button>
    </div>
  );

  const renderSessionsSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Sessões Ativas
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gerencie onde você está conectado
          </p>
        </div>
        
        {security?.sessions && security.sessions.length > 1 && (
          <button
            onClick={handleTerminateAllSessions}
            disabled={loading || pendingAction === 'all-sessions'}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
          >
            {pendingAction === 'all-sessions' ? (
              <span className="material-icons animate-spin text-sm">refresh</span>
            ) : (
              <>
                <span className="material-icons mr-2 text-sm">logout</span>
                Encerrar Outras
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {security?.sessions?.map((session: UserSession) => (
          <div
            key={session.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex items-center">
                <span className="material-icons mr-2 text-gray-600 dark:text-gray-400">
                  {session.deviceInfo.includes('Mobile') ? 'smartphone' : 'computer'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.deviceInfo}
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Atual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.location} • {session.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Última atividade: {new Date(session.lastActivity).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            
            {!session.current && (
              <button
                onClick={() => handleSessionTerminate(session.id)}
                disabled={loading || pendingAction === session.id}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs transition-colors duration-200"
              >
                {pendingAction === session.id ? (
                  <span className="material-icons animate-spin text-xs">refresh</span>
                ) : (
                  'Encerrar'
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivitiesSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Atividade de Segurança
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Histórico de ações de segurança da conta
          </p>
        </div>
        
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
        >
          <span className="material-icons mr-2 text-sm">history</span>
          {showActivities ? 'Ocultar' : 'Ver Histórico'}
        </button>
      </div>

      {showActivities && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {security?.activities?.map((activity: SecurityActivity) => (
            <div
              key={activity.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.location} • {activity.ipAddress}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <span className={`
                  px-2 py-1 text-xs rounded-full
                  ${activity.type === SecurityActivityType.LOGIN 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : activity.type === SecurityActivityType.LOGOUT
                    ? 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }
                `}>
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Segurança
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas configurações de segurança e monitorize atividades
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="space-y-8">
          
          {/* Seção: Senha */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">lock</span>
              Senha
            </h4>
            {renderPasswordSection()}
          </div>

          {/* Seção: 2FA */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">security</span>
              Autenticação em Duas Etapas
            </h4>
            {render2FASection()}
          </div>

          {/* Seção: Sessões */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">devices</span>
              Sessões
            </h4>
            {renderSessionsSection()}
          </div>

          {/* Seção: Atividades */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-600">track_changes</span>
              Atividades
            </h4>
            {renderActivitiesSection()}
          </div>

        </div>
      </div>
    </div>
  );
}
