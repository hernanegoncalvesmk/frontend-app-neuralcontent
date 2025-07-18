/**
 * Helpers para tratamento de erros da API
 * Arquivo: src/lib/api/error-handler.ts
 * Autor: Neural Content Team
 * Data: 2025-01-17
 */

import { ApiError } from '@/src/types/api';

export class ApiErrorHandler {
  /**
   * Mapeia códigos de erro para mensagens amigáveis
   */
  private static readonly ERROR_MESSAGES: Record<string, string> = {
    // Erros de autenticação
    'INVALID_CREDENTIALS': 'Email ou senha incorretos',
    'USER_NOT_FOUND': 'Usuário não encontrado',
    'EMAIL_NOT_VERIFIED': 'Email não verificado. Verifique sua caixa de entrada.',
    'ACCOUNT_LOCKED': 'Conta temporariamente bloqueada. Tente novamente mais tarde.',
    'TOKEN_EXPIRED': 'Sessão expirada. Faça login novamente.',
    'INVALID_TOKEN': 'Token inválido. Faça login novamente.',
    'REFRESH_TOKEN_EXPIRED': 'Sessão expirada. Faça login novamente.',

    // Erros de validação
    'VALIDATION_FAILED': 'Dados inválidos. Verifique os campos preenchidos.',
    'EMAIL_ALREADY_EXISTS': 'Este email já está em uso',
    'WEAK_PASSWORD': 'Senha muito fraca. Use pelo menos 8 caracteres com letras e números.',
    'INVALID_EMAIL': 'Email inválido',

    // Erros de negócio
    'INSUFFICIENT_CREDITS': 'Créditos insuficientes para esta operação',
    'PLAN_NOT_FOUND': 'Plano não encontrado',
    'SUBSCRIPTION_NOT_ACTIVE': 'Assinatura não ativa',
    'FILE_TOO_LARGE': 'Arquivo muito grande. Tamanho máximo permitido excedido.',
    'INVALID_FILE_TYPE': 'Tipo de arquivo não permitido',

    // Erros de permissão
    'UNAUTHORIZED': 'Acesso negado. Faça login para continuar.',
    'FORBIDDEN': 'Você não tem permissão para realizar esta ação',
    'ADMIN_REQUIRED': 'Esta ação requer privilégios de administrador',

    // Erros de rede e servidor
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet e tente novamente.',
    'SERVER_ERROR': 'Erro interno do servidor. Tente novamente em alguns minutos.',
    'SERVICE_UNAVAILABLE': 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
    'TIMEOUT': 'Tempo limite excedido. Tente novamente.',

    // Erros de rate limiting
    'RATE_LIMIT_EXCEEDED': 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
    'TOO_MANY_REQUESTS': 'Muitas requisições. Tente novamente em alguns minutos.',
  };

  /**
   * Obtém mensagem amigável para erro
   */
  public static getErrorMessage(error: ApiError): string {
    // Verifica se existe uma mensagem específica para o código
    if (error.code && this.ERROR_MESSAGES[error.code]) {
      return this.ERROR_MESSAGES[error.code];
    }

    // Mensagens baseadas no status HTTP
    switch (error.status) {
      case 400:
        return 'Requisição inválida. Verifique os dados enviados.';
      case 401:
        return 'Acesso negado. Faça login para continuar.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 408:
        return 'Tempo limite excedido. Tente novamente.';
      case 409:
        return 'Conflito de dados. Verifique as informações.';
      case 422:
        return 'Dados inválidos. Verifique os campos preenchidos.';
      case 429:
        return 'Muitas tentativas. Aguarde um momento.';
      case 500:
        return 'Erro interno do servidor. Tente novamente em alguns minutos.';
      case 502:
        return 'Serviço temporariamente indisponível.';
      case 503:
        return 'Serviço em manutenção. Tente novamente mais tarde.';
      case 504:
        return 'Tempo limite do servidor excedido.';
      case 0:
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return error.message || 'Erro inesperado. Tente novamente.';
    }
  }

  /**
   * Verifica se o erro é temporário (pode ser tentado novamente)
   */
  public static isTemporaryError(error: ApiError): boolean {
    const temporaryStatuses = [408, 429, 500, 502, 503, 504];
    const temporaryCodes = [
      'NETWORK_ERROR',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE',
      'TIMEOUT',
      'RATE_LIMIT_EXCEEDED',
      'TOO_MANY_REQUESTS'
    ];

    return temporaryStatuses.includes(error.status) ||
           (error.code ? temporaryCodes.includes(error.code) : false);
  }

  /**
   * Verifica se o erro requer autenticação
   */
  public static requiresAuth(error: ApiError): boolean {
    const authStatuses = [401];
    const authCodes = [
      'TOKEN_EXPIRED',
      'INVALID_TOKEN',
      'REFRESH_TOKEN_EXPIRED',
      'UNAUTHORIZED'
    ];

    return authStatuses.includes(error.status) ||
           (error.code ? authCodes.includes(error.code) : false);
  }

  /**
   * Verifica se o erro é de validação
   */
  public static isValidationError(error: ApiError): boolean {
    const validationStatuses = [400, 422];
    const validationCodes = [
      'VALIDATION_FAILED',
      'INVALID_EMAIL',
      'WEAK_PASSWORD',
      'EMAIL_ALREADY_EXISTS'
    ];

    return validationStatuses.includes(error.status) ||
           (error.code ? validationCodes.includes(error.code) : false);
  }

  /**
   * Formata erro para exibição no toast/notificação
   */
  public static formatForToast(error: ApiError): {
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
  } {
    const message = this.getErrorMessage(error);
    
    if (this.isTemporaryError(error)) {
      return {
        title: 'Erro Temporário',
        message,
        type: 'warning'
      };
    }

    if (this.requiresAuth(error)) {
      return {
        title: 'Acesso Necessário',
        message,
        type: 'info'
      };
    }

    if (this.isValidationError(error)) {
      return {
        title: 'Dados Inválidos',
        message,
        type: 'warning'
      };
    }

    return {
      title: 'Erro',
      message,
      type: 'error'
    };
  }

  /**
   * Log de erro para desenvolvimento/debugging
   */
  public static logError(error: ApiError, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 API Error ${context ? `(${context})` : ''}`);
      console.error('Status:', error.status);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      if (error.details) {
        console.error('Details:', error.details);
      }
      console.groupEnd();
    }
  }
}

export default ApiErrorHandler;
