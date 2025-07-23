/**
 * @fileoverview useAuth Hook
 * 
 * Hook principal de autenticação que integra com AuthService.
 * Fornece estado reativo e métodos de autenticação.
 * 
 * @version 1.0.0
 * @domain auth
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  UserSafeResponse,
} from '../types/auth.types';

// ============================================================================
// HOOK STATE INTERFACE
// ============================================================================

interface AuthState {
  user: UserSafeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  // Authentication methods
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  
  // Password methods
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<void>;
  changePassword: (request: ChangePasswordRequest) => Promise<void>;
  
  // Email verification
  verifyEmail: (request: VerifyEmailRequest) => Promise<void>;
  
  // User methods
  refreshUser: () => Promise<void>;
  updateUser: (user: UserSafeResponse) => void;
  
  // Session methods
  validateSession: () => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  
  // Utility methods
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  /**
   * Atualizar estado interno
   */
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Definir erro
   */
  const setError = useCallback((error: string | null) => {
    updateState({ error, isLoading: false });
  }, [updateState]);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Definir usuário e estado de autenticação
   */
  const setUser = useCallback((user: UserSafeResponse | null) => {
    authService.setCurrentUser(user);
    updateState({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      error: null,
    });
  }, [updateState]);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.login(credentials);
      
      // Obter usuário atual do AuthService
      const user = authService.getCurrentUser();
      setUser(user);
      
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
      throw error;
    }
  }, [updateState, setUser, setError, router]);

  /**
   * Registro
   */
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.register(userData);
      
      // Obter usuário atual do AuthService
      const user = authService.getCurrentUser();
      setUser(user);
      
      // Redirecionar para dashboard ou página de verificação
      if (user?.isEmailVerified) {
        router.push('/dashboard');
      } else {
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
      throw error;
    }
  }, [updateState, setUser, setError, router]);

  /**
   * Logout
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateState({ isLoading: true });
      
      await authService.logout();
      setUser(null);
      
      // Redirecionar para página de login
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      router.push('/auth/login');
    }
  }, [updateState, setUser, router]);

  /**
   * Esqueci a senha
   */
  const forgotPassword = useCallback(async (request: ForgotPasswordRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.forgotPassword(request);
      
      updateState({ isLoading: false });
    } catch (error: any) {
      setError(error.message || 'Erro ao solicitar reset de senha');
      throw error;
    }
  }, [updateState, setError]);

  /**
   * Resetar senha
   */
  const resetPassword = useCallback(async (request: ResetPasswordRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.resetPassword(request);
      
      updateState({ isLoading: false });
      
      // Redirecionar para login após reset bem-sucedido
      router.push('/auth/login?message=password-reset-success');
    } catch (error: any) {
      setError(error.message || 'Erro ao resetar senha');
      throw error;
    }
  }, [updateState, setError, router]);

  /**
   * Alterar senha
   */
  const changePassword = useCallback(async (request: ChangePasswordRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.changePassword(request);
      
      updateState({ isLoading: false });
    } catch (error: any) {
      setError(error.message || 'Erro ao alterar senha');
      throw error;
    }
  }, [updateState, setError]);

  /**
   * Verificar email
   */
  const verifyEmail = useCallback(async (request: VerifyEmailRequest): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      await authService.verifyEmail(request);
      
      // Atualizar usuário após verificação
      await refreshUser();
      
      // Redirecionar para dashboard após verificação
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao verificar email');
      throw error;
    }
  }, [updateState, setError, router]);

  /**
   * Atualizar dados do usuário
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      updateState({ isLoading: true, error: null });
      
      const user = await authService.getCurrentUserProfile();
      setUser(user);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      setError(error.message || 'Erro ao atualizar dados do usuário');
    }
  }, [updateState, setUser, setError]);

  /**
   * Atualizar usuário manualmente
   */
  const updateUser = useCallback((user: UserSafeResponse) => {
    setUser(user);
  }, [setUser]);

  /**
   * Validar sessão
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      return await authService.validateSession();
    } catch (error) {
      console.error('Erro ao validar sessão:', error);
      return false;
    }
  }, []);

  /**
   * Renovar tokens
   */
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      return await authService.refreshTokens();
    } catch (error) {
      console.error('Erro ao renovar tokens:', error);
      return false;
    }
  }, []);

  /**
   * Verificar permissão
   */
  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, []);

  /**
   * Verificar role
   */
  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  /**
   * Inicializar autenticação
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        updateState({ isLoading: true });
        
        const user = await authService.initializeAuth();
        setUser(user);
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setUser(null);
      } finally {
        updateState({ isInitialized: true });
      }
    };

    initializeAuth();
  }, [updateState, setUser]);

  /**
   * Auto-refresh de tokens
   */
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(async () => {
      // Verificar se o token expira em breve (próximos 5 minutos)
      if (tokenService.willExpireSoon(5)) {
        try {
          await refreshTokens();
        } catch (error) {
          console.error('Erro no auto-refresh:', error);
          await logout();
        }
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [state.isAuthenticated, refreshTokens, logout]);

  return {
    // State
    ...state,
    
    // Methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    refreshUser,
    updateUser,
    validateSession,
    refreshTokens,
    clearError,
    hasPermission,
    hasRole,
  };
};

export default useAuth;
