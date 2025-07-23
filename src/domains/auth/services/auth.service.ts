/**
 * @fileoverview Auth Service
 * 
 * Serviço principal de autenticação que integra com o backend.
 * Gerencia login, registro, logout e estado de autenticação.
 * 
 * @version 1.0.0
 * @domain auth
 */

import { authApi } from '../api/auth.api';
import { tokenService } from './token.service';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ChangePasswordRequest,
  AuthResponse,
  UserSafeResponse,
  User,
} from '../types/auth.types';

// ============================================================================
// AUTH SERVICE
// ============================================================================

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserSafeResponse | null = null;

  private constructor() {}

  /**
   * Singleton instance
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Mapear User para UserSafeResponse
   */
  private mapUserToSafeResponse(user: User): UserSafeResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: undefined, // Backend não retorna username no User base
      avatarUrl: user.avatar,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: false, // Default, backend pode não ter esse campo
      language: user.preferences?.language,
      timezone: undefined, // Backend pode não ter esse campo
      lastLoginAt: user.lastLogin,
      createdAt: user.createdAt,
    };
  }

  /**
   * Login do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.login(credentials);
      
      // Salvar tokens se o login foi bem-sucedido
      if (response.tokens) {
        tokenService.setTokens(response.tokens);
      }

      // Salvar dados do usuário
      if (response.user) {
        this.currentUser = this.mapUserToSafeResponse(response.user);
      }

      return response;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  /**
   * Registro de novo usuário
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.register(userData);
      
      // Se o registro inclui login automático
      if (response.tokens) {
        tokenService.setTokens(response.tokens);
      }

      if (response.user) {
        this.currentUser = this.mapUserToSafeResponse(response.user);
      }

      return response;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  }

  /**
   * Logout do usuário
   */
  async logout(): Promise<void> {
    try {
      // Tentar fazer logout no backend
      const tokens = tokenService.getTokens();
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }
    } catch (error) {
      console.error('Erro no logout do backend:', error);
      // Continue com o logout local mesmo se houver erro no backend
    } finally {
      // Sempre limpar estado local
      tokenService.clearTokens();
      this.currentUser = null;
    }
  }

  /**
   * Esqueci a senha
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      return await authApi.forgotPassword(request);
    } catch (error: any) {
      console.error('Erro ao solicitar reset de senha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao solicitar reset de senha');
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    try {
      return await authApi.resetPassword(request);
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao resetar senha');
    }
  }

  /**
   * Verificar email
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      const response = await authApi.verifyEmail(request);
      
      // Atualizar usuário atual se necessário
      if (this.currentUser) {
        this.currentUser.isEmailVerified = true;
      }
      
      return response;
    } catch (error: any) {
      console.error('Erro ao verificar email:', error);
      throw new Error(error.response?.data?.message || 'Erro ao verificar email');
    }
  }

  /**
   * Alterar senha (usuário logado)
   */
  async changePassword(request: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      return await authApi.changePassword(request);
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  }

  /**
   * Obter perfil do usuário atual
   */
  async getCurrentUserProfile(): Promise<UserSafeResponse | null> {
    try {
      if (!tokenService.isAuthenticated()) {
        return null;
      }

      const profile = await authApi.getProfile();
      this.currentUser = profile;
      return profile;
    } catch (error: any) {
      console.error('Erro ao obter perfil:', error);
      
      // Se houve erro de autenticação, limpar estado
      if (error.response?.status === 401) {
        await this.logout();
      }
      
      return null;
    }
  }

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return tokenService.isAuthenticated();
  }

  /**
   * Obter usuário atual do cache
   */
  getCurrentUser(): UserSafeResponse | null {
    return this.currentUser;
  }

  /**
   * Atualizar usuário atual
   */
  setCurrentUser(user: UserSafeResponse | null): void {
    this.currentUser = user;
  }

  /**
   * Validar sessão atual (verificar se tokens são válidos)
   */
  async validateSession(): Promise<boolean> {
    try {
      if (!tokenService.isAuthenticated()) {
        return false;
      }

      // Tentar obter perfil para validar token
      const profile = await this.getCurrentUserProfile();
      return profile !== null;
    } catch (error) {
      console.error('Sessão inválida:', error);
      await this.logout();
      return false;
    }
  }

  /**
   * Renovar tokens automaticamente
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const result = await tokenService.refreshTokens();
      return result !== null;
    } catch (error) {
      console.error('Erro ao renovar tokens:', error);
      await this.logout();
      return false;
    }
  }

  /**
   * Inicializar autenticação (verificar estado persistido)
   */
  async initializeAuth(): Promise<UserSafeResponse | null> {
    try {
      if (!tokenService.isAuthenticated()) {
        return null;
      }

      // Verificar se o token ainda é válido
      if (!tokenService.isAccessTokenValid()) {
        // Tentar renovar
        const refreshed = await this.refreshTokens();
        if (!refreshed) {
          return null;
        }
      }

      // Obter perfil do usuário
      return await this.getCurrentUserProfile();
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      await this.logout();
      return null;
    }
  }

  /**
   * Verificar permissões do usuário
   */
  hasPermission(permission: string): boolean {
    return tokenService.hasPermission(permission);
  }

  /**
   * Verificar role do usuário
   */
  hasRole(role: string): boolean {
    return tokenService.hasRole(role);
  }

  /**
   * Obter informações básicas do token
   */
  getTokenInfo() {
    return tokenService.getCurrentUserInfo();
  }

  /**
   * Verificar se o token expira em breve
   */
  willTokenExpireSoon(thresholdMinutes: number = 5): boolean {
    return tokenService.willExpireSoon(thresholdMinutes);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;
