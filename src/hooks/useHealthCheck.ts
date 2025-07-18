/**
 * Hook personalizado para verificar status da API
 * Arquivo: src/hooks/useHealthCheck.ts
 * Autor: Neural Content Team
 * Data: 2025-01-17
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { healthService, HealthCheckResponse } from '@/services/health.service';
import { ApiResponse } from '@/types/api';

export const useHealthCheck = () => {
  return useQuery<ApiResponse<HealthCheckResponse>>({
    queryKey: ['health'],
    queryFn: healthService.checkHealth,
    // Refetch a cada 30 segundos
    refetchInterval: 30000,
    // Não fazer refetch em foco para não sobrecarregar
    refetchOnWindowFocus: false,
    // Retry em caso de erro
    retry: 3,
    // Considerar dados obsoletos após 1 minuto
    staleTime: 60000,
  });
};

export const useDatabaseCheck = () => {
  return useQuery({
    queryKey: ['health', 'database'],
    queryFn: healthService.checkDatabase,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  });
};

export const useCacheCheck = () => {
  return useQuery({
    queryKey: ['health', 'cache'],
    queryFn: healthService.checkCache,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  });
};
