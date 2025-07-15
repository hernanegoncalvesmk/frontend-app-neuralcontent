/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';

export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  clearError: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: UseApiOptions
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiCall();
      setData(response.data);
      
      options?.onSuccess?.(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro na requisição');
      options?.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    clearError,
  };
}

export interface UsePaginatedApiReturn<T> extends Omit<UseApiReturn<T[]>, 'data'> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  params: PaginationParams;
  setParams: (params: Partial<PaginationParams>) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function usePaginatedApi<T>(
  apiCall: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  initialParams: PaginationParams = { page: 1, pageSize: 10 }
): UsePaginatedApiReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [params, setParamsState] = useState<PaginationParams>(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiCall(params);
      setData(response.data);
      setPagination(response.meta);
    } catch (err: any) {
      setError(err.message || 'Erro na requisição');
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, params]);

  const setParams = useCallback((newParams: Partial<PaginationParams>) => {
    setParamsState(prev => ({ ...prev, ...newParams }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      setParams({ page: pagination.page + 1 });
    }
  }, [pagination, setParams]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      setParams({ page: pagination.page - 1 });
    }
  }, [pagination, setParams]);

  const goToPage = useCallback((page: number) => {
    setParams({ page });
  }, [setParams]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    pagination,
    params,
    isLoading,
    error,
    execute,
    setParams,
    nextPage,
    prevPage,
    goToPage,
    clearError,
  };
}
