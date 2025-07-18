/**
 * Service de Health Check para testar a conexão com API
 * Arquivo: src/services/health.service.ts
 * Autor: Neural Content Team
 * Data: 2025-01-17
 */

import apiClient from '@/lib/api/client';
import { ApiResponse } from '@/types/api';

export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  database: {
    connected: boolean;
    latency?: number;
  };
  cache: {
    connected: boolean;
    latency?: number;
  };
}

export const healthService = {
  /**
   * Verifica o status da API
   */
  async checkHealth(): Promise<ApiResponse<HealthCheckResponse>> {
    return apiClient.get('/health');
  },

  /**
   * Verifica o status do banco de dados
   */
  async checkDatabase(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get('/health/database');
  },

  /**
   * Verifica o status do cache
   */
  async checkCache(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get('/health/cache');
  },
};
