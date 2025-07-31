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
    // Filtrar apenas os campos que o backend espera
    const backendData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      agreeToTerms: userData.agreeToTerms,
      agreeToPrivacy: userData.agreeToPrivacy,
      language: userData.language,
      // confirmPassword não é enviado para o backend
    };
    
    const response = await api.post('/auth/register', backendData, {
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
   * Validar token de reset de senha
   */
  validateResetToken: async (request: { token: string }): Promise<void> => {
    await api.post('/auth/validate-reset-token', request, {
      skipAuth: true,
    });
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
   * Reenviar email de verificação
   */
  resendVerificationEmail: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/resend-verification-email', { email }, {
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
    const response = await api.get('/users/profile');
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
    const response = await api.get('/users/profile');
    return response.data;
  },
};

export default authApi;
