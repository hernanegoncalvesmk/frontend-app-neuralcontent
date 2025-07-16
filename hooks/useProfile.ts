// ============================================================================
// NEURAL CONTENT - HOOK DE PERFIL
// ============================================================================

/**
 * Hook customizado para gerenciamento de estado do perfil
 * 
 * @description Hook que centraliza todas as operações de perfil,
 * configurações e segurança com integração ao sistema de tradução
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UpdateProfileData,
  UserPreferences,
  UpdatePreferencesData,
  SecuritySettings,
  ProfilePageState,
  TwoFactorVerification,
  SecurityActivityFilters,
  LanguageOption,
  TimezoneOption,
  ApiResponse
} from '@/types/profile.types';
import { profileService } from '@/services/profile.service';

// ============================================================================
// INTERFACES DO HOOK
// ============================================================================

interface UseProfileOptions {
  autoLoad?: boolean;
  refreshInterval?: number;
}

interface UseProfileReturn {
  // Estado
  state: ProfilePageState;
  
  // Dados processados
  languages: LanguageOption[];
  timezones: TimezoneOption[];
  
  // Ações de perfil
  loadProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
  
  // Ações de preferências
  updatePreferences: (data: UpdatePreferencesData) => Promise<boolean>;
  changeLanguage: (language: string) => Promise<boolean>;
  changeTheme: (theme: string) => Promise<boolean>;
  
  // Ações de segurança
  enable2FA: () => Promise<boolean>;
  verify2FA: (verification: TwoFactorVerification) => Promise<boolean>;
  disable2FA: (code: string) => Promise<boolean>;
  terminateSession: (sessionId: string) => Promise<boolean>;
  terminateAllSessions: () => Promise<boolean>;
  loadSecurityActivities: (filters?: SecurityActivityFilters) => Promise<void>;
  
  // Ações de UI
  setActiveTab: (tab: 'personal' | 'preferences' | 'security') => void;
  clearErrors: () => void;
  
  // Utilitários
  isLoading: (section?: keyof ProfilePageState['loading']) => boolean;
  hasError: (section?: keyof ProfilePageState['errors']) => boolean;
  getError: (section: keyof ProfilePageState['errors']) => string | undefined;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const {
    autoLoad = true,
    refreshInterval = 0,
  } = options;

  // ============================================================================
  // ESTADO
  // ============================================================================

  const [state, setState] = useState<ProfilePageState>({
    profile: null,
    preferences: null,
    security: null,
    loading: {
      profile: false,
      preferences: false,
      security: false,
      avatar: false,
      twoFactor: false,
    },
    activeTab: 'personal',
    errors: {},
  });

  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);

  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const updateLoadingState = useCallback((
    key: keyof ProfilePageState['loading'], 
    value: boolean
  ) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: value,
      },
    }));
  }, []);

  const setError = useCallback((
    key: keyof ProfilePageState['errors'], 
    error: string
  ) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [key]: error,
      },
    }));
  }, []);

  const clearError = useCallback((key: keyof ProfilePageState['errors']) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [key]: undefined,
      },
    }));
  }, []);

  const handleApiResponse = useCallback(<T>(
    response: ApiResponse<T>,
    section: keyof ProfilePageState['errors']
  ): boolean => {
    if (response.success) {
      clearError(section);
      return true;
    } else {
      setError(section, response.error || 'Erro desconhecido');
      return false;
    }
  }, [clearError, setError]);

  // ============================================================================
  // CARREGAMENTO INICIAL
  // ============================================================================

  const loadProfile = useCallback(async () => {
    updateLoadingState('profile', true);
    
    try {
      const response = await profileService.getProfile();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          profile: response.data!.profile,
          preferences: response.data!.preferences,
          security: response.data!.security,
        }));
        clearError('profile');
      } else {
        setError('profile', response.error || 'Erro ao carregar perfil');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('profile', 'Erro ao carregar perfil');
    } finally {
      updateLoadingState('profile', false);
    }
  }, [updateLoadingState, setError, clearError]);

  const loadLanguages = useCallback(async () => {
    try {
      const response = await profileService.getAvailableLanguages();
      if (response.success && response.data) {
        setLanguages(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar idiomas:', error);
    }
  }, []);

  const loadTimezones = useCallback(async () => {
    try {
      const response = await profileService.getAvailableTimezones();
      if (response.success && response.data) {
        setTimezones(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar fusos horários:', error);
    }
  }, []);

  // ============================================================================
  // AÇÕES DE PERFIL
  // ============================================================================

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<boolean> => {
    updateLoadingState('profile', true);
    
    try {
      const response = await profileService.updateProfile(data);
      const success = handleApiResponse(response, 'profile');
      
      if (success && response.data) {
        setState(prev => ({
          ...prev,
          profile: response.data!,
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('profile', 'Erro ao atualizar perfil');
      return false;
    } finally {
      updateLoadingState('profile', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const uploadAvatar = useCallback(async (file: File): Promise<boolean> => {
    // Validar arquivo
    const validation = profileService.validateFile(file);
    if (!validation.valid) {
      setError('profile', validation.error!);
      return false;
    }

    updateLoadingState('avatar', true);
    
    try {
      const response = await profileService.uploadAvatar(file);
      const success = handleApiResponse(response, 'profile');
      
      if (success && response.data && state.profile) {
        setState(prev => ({
          ...prev,
          profile: {
            ...prev.profile!,
            avatar: response.data!.url,
          },
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      setError('profile', 'Erro ao fazer upload do avatar');
      return false;
    } finally {
      updateLoadingState('avatar', false);
    }
  }, [updateLoadingState, handleApiResponse, setError, state.profile]);

  const removeAvatar = useCallback(async (): Promise<boolean> => {
    updateLoadingState('avatar', true);
    
    try {
      const response = await profileService.removeAvatar();
      const success = handleApiResponse(response, 'profile');
      
      if (success && state.profile) {
        setState(prev => ({
          ...prev,
          profile: {
            ...prev.profile!,
            avatar: undefined,
          },
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      setError('profile', 'Erro ao remover avatar');
      return false;
    } finally {
      updateLoadingState('avatar', false);
    }
  }, [updateLoadingState, handleApiResponse, setError, state.profile]);

  // ============================================================================
  // AÇÕES DE PREFERÊNCIAS
  // ============================================================================

  const updatePreferences = useCallback(async (data: UpdatePreferencesData): Promise<boolean> => {
    updateLoadingState('preferences', true);
    
    try {
      const response = await profileService.updatePreferences(data);
      const success = handleApiResponse(response, 'preferences');
      
      if (success && response.data) {
        setState(prev => ({
          ...prev,
          preferences: response.data!,
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      setError('preferences', 'Erro ao atualizar preferências');
      return false;
    } finally {
      updateLoadingState('preferences', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const changeLanguage = useCallback(async (language: string): Promise<boolean> => {
    return updatePreferences({ language });
  }, [updatePreferences]);

  const changeTheme = useCallback(async (theme: string): Promise<boolean> => {
    return updatePreferences({ theme: theme as any });
  }, [updatePreferences]);

  // ============================================================================
  // AÇÕES DE SEGURANÇA
  // ============================================================================

  const enable2FA = useCallback(async (): Promise<boolean> => {
    updateLoadingState('twoFactor', true);
    
    try {
      const response = await profileService.enable2FA();
      const success = handleApiResponse(response, 'security');
      
      if (success) {
        // Recarregar configurações de segurança
        const securityResponse = await profileService.getSecuritySettings();
        if (securityResponse.success && securityResponse.data) {
          setState(prev => ({
            ...prev,
            security: securityResponse.data!,
          }));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao habilitar 2FA:', error);
      setError('security', 'Erro ao habilitar 2FA');
      return false;
    } finally {
      updateLoadingState('twoFactor', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const verify2FA = useCallback(async (verification: TwoFactorVerification): Promise<boolean> => {
    updateLoadingState('twoFactor', true);
    
    try {
      const response = await profileService.verify2FA(verification);
      const success = handleApiResponse(response, 'security');
      
      if (success) {
        // Recarregar configurações de segurança
        const securityResponse = await profileService.getSecuritySettings();
        if (securityResponse.success && securityResponse.data) {
          setState(prev => ({
            ...prev,
            security: securityResponse.data!,
          }));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao verificar 2FA:', error);
      setError('security', 'Erro ao verificar 2FA');
      return false;
    } finally {
      updateLoadingState('twoFactor', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const disable2FA = useCallback(async (code: string): Promise<boolean> => {
    updateLoadingState('twoFactor', true);
    
    try {
      const response = await profileService.disable2FA(code);
      const success = handleApiResponse(response, 'security');
      
      if (success) {
        // Recarregar configurações de segurança
        const securityResponse = await profileService.getSecuritySettings();
        if (securityResponse.success && securityResponse.data) {
          setState(prev => ({
            ...prev,
            security: securityResponse.data!,
          }));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao desabilitar 2FA:', error);
      setError('security', 'Erro ao desabilitar 2FA');
      return false;
    } finally {
      updateLoadingState('twoFactor', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const terminateSession = useCallback(async (sessionId: string): Promise<boolean> => {
    updateLoadingState('security', true);
    
    try {
      const response = await profileService.terminateSession(sessionId);
      const success = handleApiResponse(response, 'security');
      
      if (success && state.security) {
        setState(prev => ({
          ...prev,
          security: {
            ...prev.security!,
            sessions: prev.security!.sessions.filter(s => s.id !== sessionId),
          },
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
      setError('security', 'Erro ao terminar sessão');
      return false;
    } finally {
      updateLoadingState('security', false);
    }
  }, [updateLoadingState, handleApiResponse, setError, state.security]);

  const terminateAllSessions = useCallback(async (): Promise<boolean> => {
    updateLoadingState('security', true);
    
    try {
      const response = await profileService.terminateAllSessions();
      const success = handleApiResponse(response, 'security');
      
      if (success) {
        // Recarregar sessões
        const securityResponse = await profileService.getSecuritySettings();
        if (securityResponse.success && securityResponse.data) {
          setState(prev => ({
            ...prev,
            security: securityResponse.data!,
          }));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao terminar todas as sessões:', error);
      setError('security', 'Erro ao terminar todas as sessões');
      return false;
    } finally {
      updateLoadingState('security', false);
    }
  }, [updateLoadingState, handleApiResponse, setError]);

  const loadSecurityActivities = useCallback(async (filters?: SecurityActivityFilters) => {
    updateLoadingState('security', true);
    
    try {
      const response = await profileService.getSecurityActivities(filters);
      
      if (response.success && response.data && state.security) {
        setState(prev => ({
          ...prev,
          security: {
            ...prev.security!,
            activities: response.data!,
          },
        }));
        clearError('security');
      } else {
        setError('security', response.error || 'Erro ao carregar atividades');
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      setError('security', 'Erro ao carregar atividades');
    } finally {
      updateLoadingState('security', false);
    }
  }, [updateLoadingState, setError, clearError, state.security]);

  // ============================================================================
  // AÇÕES DE UI
  // ============================================================================

  const setActiveTab = useCallback((tab: 'personal' | 'preferences' | 'security') => {
    setState(prev => ({
      ...prev,
      activeTab: tab,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  // ============================================================================
  // UTILITÁRIOS
  // ============================================================================

  const isLoading = useCallback((section?: keyof ProfilePageState['loading']): boolean => {
    if (section) {
      return state.loading[section];
    }
    return Object.values(state.loading).some(loading => loading);
  }, [state.loading]);

  const hasError = useCallback((section?: keyof ProfilePageState['errors']): boolean => {
    if (section) {
      return !!state.errors[section];
    }
    return Object.values(state.errors).some(error => !!error);
  }, [state.errors]);

  const getError = useCallback((section: keyof ProfilePageState['errors']): string | undefined => {
    return state.errors[section];
  }, [state.errors]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (autoLoad) {
      loadProfile();
      loadLanguages();
      loadTimezones();
    }
  }, [autoLoad, loadProfile, loadLanguages, loadTimezones]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        loadProfile();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadProfile]);

  // ============================================================================
  // RETORNO
  // ============================================================================

  return {
    // Estado
    state,
    
    // Dados processados
    languages,
    timezones,
    
    // Ações de perfil
    loadProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    
    // Ações de preferências
    updatePreferences,
    changeLanguage,
    changeTheme,
    
    // Ações de segurança
    enable2FA,
    verify2FA,
    disable2FA,
    terminateSession,
    terminateAllSessions,
    loadSecurityActivities,
    
    // Ações de UI
    setActiveTab,
    clearErrors,
    
    // Utilitários
    isLoading,
    hasError,
    getError,
  };
}
