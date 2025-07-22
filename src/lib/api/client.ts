/**
 * Cliente HTTP configurado para Neural Content API
 * Arquivo: src/lib/api/client.ts
 * Autor: Neural Content Team
 * Data: 2025-01-17
 * 
 * Features:
 * - Interceptadores de requisição e resposta
 * - Refresh token automático
 * - Tratamento de erros padronizado
 * - Retry automático para falhas temporárias
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiResponse, ApiError, AuthTokens } from '@/types/api';

// Configuração base do cliente
const BASE_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Classe para gerenciar o cliente HTTP
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.client = axios.create(BASE_CONFIG);
    this.setupInterceptors();
    this.setupRetry();
  }

  /**
   * Configura retry automático para falhas temporárias
   */
  private setupRetry(): void {
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status !== undefined && error.response.status >= 500);
      },
    });
  }

  /**
   * Configura interceptadores de requisição e resposta
   */
  private setupInterceptors(): void {
    // Request interceptor - adiciona token de autorização
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - trata respostas e erros
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Se for erro 401 e não for tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Se já estiver renovando, adiciona à fila
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
            this.processQueue(error, null);
            this.clearStoredTokens();
            // Redirecionar para login
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Processa a fila de requisições após refresh token
   */
  private processQueue(error: Error | null, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Obtém token armazenado
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('neural_access_token');
  }

  /**
   * Obtém refresh token armazenado
   */
  private getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('neural_refresh_token');
  }

  /**
   * Armazena tokens
   */
  private storeTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('neural_access_token', tokens.accessToken);
    localStorage.setItem('neural_refresh_token', tokens.refreshToken);
  }

  /**
   * Remove tokens armazenados
   */
  private clearStoredTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('neural_access_token');
    localStorage.removeItem('neural_refresh_token');
  }

  /**
   * Renova token de acesso
   */
  private async refreshToken(): Promise<string> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        `${BASE_CONFIG.baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 10000 }
      );

      const tokens: AuthTokens = response.data.data;
      this.storeTokens(tokens);
      return tokens.accessToken;
    } catch (error) {
      this.clearStoredTokens();
      throw error;
    }
  }

  /**
   * Trata erros da API
   */
  private handleApiError(error: unknown): ApiError {
    const apiError: ApiError = {
      message: 'Erro interno do servidor',
      status: 500,
    };

    // Type guard para verificar se é um erro do axios
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status: number;
          data?: {
            message?: string;
            code?: string;
            details?: Record<string, unknown>;
          };
        };
        request?: unknown;
        message?: string;
      };

      if (axiosError.response) {
        // Erro com resposta do servidor
        apiError.status = axiosError.response.status;
        apiError.message = axiosError.response.data?.message || axiosError.message || 'Erro do servidor';
        apiError.code = axiosError.response.data?.code;
        apiError.details = axiosError.response.data?.details;
      } else if (axiosError.request) {
        // Erro de rede
        apiError.message = 'Erro de conexão com o servidor';
        apiError.status = 0;
      } else {
        // Outros erros
        apiError.message = axiosError.message || 'Erro desconhecido';
      }
    } else if (error instanceof Error) {
      apiError.message = error.message;
    }

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        original: error,
        processed: apiError
      });
    }

    return apiError;
  }

  /**
   * Métodos públicos da API
   */
  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Método para upload de arquivos
   */
  public async upload<T = unknown>(url: string, formData: FormData, onUploadProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });
    return response.data;
  }

  /**
   * Define tokens para autenticação
   */
  public setTokens(tokens: AuthTokens): void {
    this.storeTokens(tokens);
  }

  /**
   * Remove tokens (logout)
   */
  public clearTokens(): void {
    this.clearStoredTokens();
  }

  /**
   * Verifica se usuário está autenticado
   */
  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

// Instância singleton do cliente
const apiClient = new ApiClient();

export default apiClient;
