/**
 * Provider do React Query para gerenciamento de estado da API
 * Arquivo: src/providers/QueryProvider.tsx
 * Autor: Neural Content Team
 * Data: 2025-01-17
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Manter cache por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Retry 3 vezes em caso de erro
            retry: (failureCount, error: unknown) => {
              // Não fazer retry para erros de autenticação ou validação
              const errorStatus = error && typeof error === 'object' && 'status' in error ? 
                (error as { status: number }).status : 0;
              if (errorStatus === 401 || errorStatus === 403 || errorStatus === 422) {
                return false;
              }
              return failureCount < 3;
            },
            // Delay entre retries (exponencial)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry apenas para erros de rede
            retry: (failureCount, error: unknown) => {
              const errorStatus = error && typeof error === 'object' && 'status' in error ? 
                (error as { status: number }).status : 0;
              if (errorStatus >= 400 && errorStatus < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
        />
      )}
    </QueryClientProvider>
  );
}
