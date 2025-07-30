/**
 * @fileoverview useAuth Hook
 * 
 * Hook principal de autenticação que integra com AuthService e AuthProvider.
 * Fornece estado reativo e métodos de autenticação.
 * 
 * @version 2.0.0
 * @domain auth
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { useAuthContext } from '../providers/AuthProvider';
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
// HOOK RETURN INTERFACE
// ============================================================================

interface UseAuthReturn {
  // State
  user: UserSafeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
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
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    setUser,
    setError,
    setLoading,
    clearError,
  } = useAuthContext();

  // Effect para redirecionar após login bem-sucedido
  useEffect(() => {
    if (isInitialized && isAuthenticated && user && !isLoading) {
      // Verificar se não estamos já na rota do dashboard
      if (typeof window !== 'undefined' && window.location.pathname === '/auth/login') {
        console.log('🚀 useAuth: Usuário autenticado, redirecionando para dashboard');
        router.push('/dashboard');
      }
    }
  }, [isInitialized, isAuthenticated, user, isLoading, router]);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Iniciando login...');
      await authService.login(credentials);
      
      // Obter usuário atual do AuthService
      const user = authService.getCurrentUser();
      console.log('👤 Usuário logado:', user);
      setUser(user);
      
      // O redirecionamento será feito pelo useEffect quando o estado for atualizado
      console.log('✅ Login realizado com sucesso, aguardando redirecionamento...');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      setError(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  /**
   * Registro
   */
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
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
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser, router]);

  /**
   * Logout
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      await authService.logout();
      setUser(null);
      
      // Redirecionar para página de login
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, router]);

  /**
   * Esqueci a senha
   */
  const forgotPassword = useCallback(async (request: ForgotPasswordRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.forgotPassword(request);
    } catch (error: any) {
      setError(error.message || 'Erro ao solicitar reset de senha');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  /**
   * Resetar senha
   */
  const resetPassword = useCallback(async (request: ResetPasswordRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.resetPassword(request);
    } catch (error: any) {
      setError(error.message || 'Erro ao resetar senha');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  /**
   * Verificar email
   */
  const verifyEmail = useCallback(async (request: VerifyEmailRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.verifyEmail(request);
      
      // Atualizar usuário atual se necessário
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao verificar email');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, user, setUser]);

  /**
   * Alterar senha (usuário logado)
   */
  const changePassword = useCallback(async (request: ChangePasswordRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.changePassword(request);
    } catch (error: any) {
      setError(error.message || 'Erro ao alterar senha');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  /**
   * Atualizar dados do usuário
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const profile = await authService.getCurrentUserProfile();
      setUser(profile);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.response?.status === 401) {
        await logout();
      }
    }
  }, [setUser, logout]);

  /**
   * Atualizar usuário no estado
   */
  const updateUser = useCallback((newUser: UserSafeResponse): void => {
    setUser(newUser);
  }, [setUser]);

  /**
   * Validar sessão atual
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
   * Verificar permissões
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

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    
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
