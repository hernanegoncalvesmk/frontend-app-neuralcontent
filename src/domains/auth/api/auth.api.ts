/**
 * @fileoverview Auth API Client
 * 
 * API client específico para operações de autenticação.
 * Integra com os endpoints do backend NestJS.
 * 
 * @version 1.0.0
 * @domain auth
 */

import { api } from '@/lib/api';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  AuthResponse,
  UserSafeResponse,
  TokenResponse,
} from '../types/auth.types';

// Extend AxiosRequestConfig to include skipAuth
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipErrorHandling?: boolean;
  }
}

// ============================================================================
// AUTH API CLIENT
// ============================================================================

export const authApi = {
  /**
   * Login do usuário
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', {
      emailOrUsername: credentials.email, // Backend espera emailOrUsername
      password: credentials.password,
    }, {
      skipAuth: true, // Não precisa de token para login
    });
    return response.data;
  },

  /**
   * Registro de novo usuário
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData, {
      skipAuth: true, // Não precisa de token para registro
    });
    return response.data;
  },

  /**
   * Refresh do token de acesso
   */
  refreshToken: async (request: RefreshTokenRequest): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', request, {
      skipAuth: true, // Refresh não precisa de token válido
    });
    return response.data;
  },

  /**
   * Solicitar reset de senha
   */
  forgotPassword: async (request: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', request, {
      skipAuth: true,
    });
    return response.data;
  },

  /**
   * Resetar senha com token
   */
  resetPassword: async (request: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', request, {
      skipAuth: true,
    });
    return response.data;
  },

  /**
   * Verificar email com token
   */
  verifyEmail: async (request: VerifyEmailRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/verify-email', request, {
      skipAuth: true,
    });
    return response.data;
  },

  /**
   * Alterar senha (usuário logado)
   */
  changePassword: async (request: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', request);
    return response.data;
  },

  /**
   * Obter perfil do usuário logado
   */
  getProfile: async (): Promise<UserSafeResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Logout do usuário
   */
  logout: async (sessionToken?: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout', {
      sessionToken,
    });
    return response.data;
  },

  /**
   * Validar token atual
   */
  validateToken: async (): Promise<UserSafeResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default authApi;
