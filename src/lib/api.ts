import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosProgressEvent } from 'axios';
import { API_CONFIG } from '@/constants/config';
import { isTokenExpired, getStoredTokens, clearStoredTokens } from './cookies';
import type { ApiResponse, ApiError } from '@/domains/shared/types/api.types';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtém o idioma atual do usuário do localStorage
 */
function getCurrentUserLocale(): string {
  try {
    if (typeof window !== 'undefined') {
      // 1. Verifica localStorage
      const savedLanguage = localStorage.getItem('app-language');
      if (savedLanguage && ['pt', 'en', 'es', 'fr'].includes(savedLanguage)) {
        return savedLanguage;
      }
      
      // 2. Fallback para idioma do navegador
      const browserLanguage = navigator.language.split('-')[0];
      if (['pt', 'en', 'es', 'fr'].includes(browserLanguage)) {
        return browserLanguage;
      }
    }
    
    // 3. Default
    return 'pt';
  } catch {
    return 'pt';
  }
}

// Configuração base do axios
const axiosConfig = {
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Criar instância do axios
const api: AxiosInstance = axios.create(axiosConfig);

// Interface para configuração de request personalizada
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Interceptador de requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomRequestConfig;
    
    // Adicionar header de locale do usuário
    const userLocale = getCurrentUserLocale();
    config.headers = config.headers || {};
    config.headers['x-user-locale'] = userLocale;
    config.headers['Accept-Language'] = userLocale;
    
    // Adicionar token de autorização se não for explicitamente ignorado
    if (!customConfig.skipAuth) {
      const tokens = getStoredTokens();
      if (tokens?.accessToken && !isTokenExpired(tokens.accessToken)) {
        config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
    }

    // Log da requisição em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
        locale: userLocale, // Incluir locale no log
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptador de respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const customConfig = error.config as CustomRequestConfig;
    
    // Log do erro em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        hasResponse: !!error.response,
        hasRequest: !!error.request,
        fullError: error
      });
    }

    // Tratamento de token expirado
    if (error.response?.status === 401 && !customConfig?.skipAuth) {
      clearStoredTokens();
      // Redirecionar para login se não estiver já na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }

    // Se não deve pular o tratamento de erro, processar o erro
    if (!customConfig?.skipErrorHandling) {
      const apiError: ApiError = {
        success: false,
        message: getErrorMessage(error),
        code: getErrorCode(error),
        timestamp: new Date().toISOString(),
        statusCode: error.response?.status || 500,
      };

      // Adicionar erros de validação se existirem
      if (error.response?.data && typeof error.response.data === 'object') {
        const errorData = error.response.data as Record<string, unknown>;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          apiError.errors = errorData.errors as Array<{
            field: string;
            message: string;
            code: string;
          }>;
        }
      }

      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);

// Função para extrair mensagem de erro
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const errorData = error.response.data as Record<string, unknown>;
    if (typeof errorData.message === 'string') {
      return errorData.message;
    }
  }

  switch (error.response?.status) {
    case 400:
      return 'Dados inválidos fornecidos';
    case 401:
      return 'Acesso não autorizado';
    case 403:
      return 'Acesso negado';
    case 404:
      return 'Recurso não encontrado';
    case 409:
      return 'Conflito de dados';
    case 422:
      return 'Dados não podem ser processados';
    case 429:
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 500:
      return 'Erro interno do servidor';
    case 502:
      return 'Erro de gateway';
    case 503:
      return 'Serviço temporariamente indisponível';
    default:
      return error.message || 'Erro de conexão';
  }
}

// Função para extrair código de erro
function getErrorCode(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const errorData = error.response.data as Record<string, unknown>;
    if (typeof errorData.code === 'string') {
      return errorData.code;
    }
  }

  return `HTTP_${error.response?.status || 'NETWORK'}_ERROR`;
}

// Cliente API com métodos utilitários
export const apiClient = {
  // GET request
  async get<T>(url: string, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // POST request
  async post<T>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PUT request
  async put<T>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PATCH request
  async patch<T>(url: string, data?: unknown, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // DELETE request
  async delete<T>(url: string, config?: CustomRequestConfig): Promise<ApiResponse<T>> {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // Upload de arquivo
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: CustomRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    };

    const response = await api.post<ApiResponse<T>>(url, formData, uploadConfig);
    return response.data;
  },

  // Request com retry automático
  async withRetry<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = API_CONFIG.retryAttempts,
    delay: number = API_CONFIG.retryDelay
  ): Promise<ApiResponse<T>> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Não tentar novamente em erros de cliente (4xx)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            throw error;
          }
        }

        // Aguardar antes da próxima tentativa
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError!;
  },
};

// Exportar instância do axios para uso direto se necessário
export { api };

// Exportar configuração customizada
export type { CustomRequestConfig };

export default apiClient;
