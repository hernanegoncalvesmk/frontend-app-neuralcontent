/**
 * @fileoverview Token Service
 * 
 * Serviço especializado para gerenciamento de tokens JWT.
 * Integra com o sistema de cookies e handling de refresh automático.
 * 
 * @version 1.0.0
 * @domain auth
 */

import { 
  getStoredTokens, 
  setStoredTokens, 
  clearStoredTokens, 
  isTokenExpired 
} from '@/lib/cookies';
import { authApi } from '../api/auth.api';
import type { TokenPair, TokenResponse } from '../types/auth.types';

// ============================================================================
// TOKEN SERVICE
// ============================================================================

export class TokenService {
  private static instance: TokenService;
  private refreshPromise: Promise<TokenResponse> | null = null;

  private constructor() {}

  /**
   * Singleton instance
   */
  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Definir tokens no storage
   */
  setTokens(tokens: TokenPair): void {
    setStoredTokens(tokens);
  }

  /**
   * Obter tokens do storage
   */
  getTokens(): TokenPair | null {
    const stored = getStoredTokens();
    if (!stored) return null;
    
    return {
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      expiresIn: stored.expiresIn || 3600, // Default 1 hora
      tokenType: stored.tokenType || 'Bearer',
    };
  }

  /**
   * Limpar todos os tokens
   */
  clearTokens(): void {
    clearStoredTokens();
    this.refreshPromise = null;
  }

  /**
   * Verificar se o token de acesso é válido
   */
  isAccessTokenValid(): boolean {
    const tokens = this.getTokens();
    if (!tokens?.accessToken) return false;
    return !isTokenExpired(tokens.accessToken);
  }

  /**
   * Verificar se o refresh token é válido
   */
  isRefreshTokenValid(): boolean {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) return false;
    return !isTokenExpired(tokens.refreshToken);
  }

  /**
   * Obter o token de acesso atual (válido)
   */
  getValidAccessToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens?.accessToken) return null;
    
    if (!isTokenExpired(tokens.accessToken)) {
      return tokens.accessToken;
    }
    
    return null;
  }

  /**
   * Renovar tokens automaticamente
   * Implementa singleton pattern para evitar múltiplas chamadas simultâneas
   */
  async refreshTokens(): Promise<TokenResponse | null> {
    // Se já existe uma promessa de refresh em andamento, aguardar ela
    if (this.refreshPromise) {
      try {
        return await this.refreshPromise;
      } catch {
        this.refreshPromise = null;
        return null;
      }
    }

    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      return null;
    }

    // Verificar se o refresh token ainda é válido
    if (isTokenExpired(tokens.refreshToken)) {
      this.clearTokens();
      return null;
    }

    // Criar nova promessa de refresh
    this.refreshPromise = this.performRefresh(tokens.refreshToken);

    try {
      const newTokens = await this.refreshPromise;
      
      // Salvar novos tokens
      this.setTokens({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: newTokens.expiresIn,
        tokenType: newTokens.tokenType,
      });

      this.refreshPromise = null;
      return newTokens;
    } catch (error) {
      console.error('Erro ao renovar tokens:', error);
      this.refreshPromise = null;
      this.clearTokens();
      return null;
    }
  }

  /**
   * Executar o refresh no backend
   */
  private async performRefresh(refreshToken: string): Promise<TokenResponse> {
    return await authApi.refreshToken({ refreshToken });
  }

  /**
   * Obter token de acesso válido (com refresh automático se necessário)
   */
  async getValidAccessTokenWithRefresh(): Promise<string | null> {
    // Primeiro, verificar se o token atual é válido
    const currentToken = this.getValidAccessToken();
    if (currentToken) {
      return currentToken;
    }

    // Se não for válido, tentar renovar
    const refreshResult = await this.refreshTokens();
    if (refreshResult) {
      return refreshResult.accessToken;
    }

    return null;
  }

  /**
   * Verificar se o usuário está autenticado (tokens válidos)
   */
  isAuthenticated(): boolean {
    return this.isAccessTokenValid() || this.isRefreshTokenValid();
  }

  /**
   * Decodificar payload do JWT (sem verificação de assinatura)
   * Usado apenas para extrair informações como ID do usuário, role, etc.
   */
  decodeTokenPayload(token?: string): any | null {
    const tokenToUse = token || this.getValidAccessToken();
    if (!tokenToUse) return null;

    try {
      const base64Url = tokenToUse.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  /**
   * Obter informações do usuário do token atual
   */
  getCurrentUserInfo(): {
    id?: string;
    email?: string;
    role?: string;
    permissions?: string[];
  } | null {
    const payload = this.decodeTokenPayload();
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || [],
    };
  }

  /**
   * Verificar se o usuário tem uma permissão específica
   */
  hasPermission(permission: string): boolean {
    const userInfo = this.getCurrentUserInfo();
    return userInfo?.permissions?.includes(permission) || false;
  }

  /**
   * Verificar se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    const userInfo = this.getCurrentUserInfo();
    return userInfo?.role === role;
  }

  /**
   * Obter tempo restante até expiração do token (em segundos)
   */
  getTokenTimeRemaining(): number {
    const payload = this.decodeTokenPayload();
    if (!payload?.exp) return 0;

    const now = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - now;
    return Math.max(0, remaining);
  }

  /**
   * Verificar se o token expira em breve (próximos 5 minutos)
   */
  willExpireSoon(thresholdMinutes: number = 5): boolean {
    const remaining = this.getTokenTimeRemaining();
    return remaining <= (thresholdMinutes * 60);
  }
}

// Export singleton instance
export const tokenService = TokenService.getInstance();
export default tokenService;
