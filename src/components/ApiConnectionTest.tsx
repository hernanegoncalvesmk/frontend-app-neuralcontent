/**
 * Componente para testar conexão com API
 * Arquivo: src/components/ApiConnectionTest.tsx
 * Autor: Neural Content Team
 * Data: 2025-01-17
 */

'use client';

import { useHealthCheck } from '@/src/hooks/useHealthCheck';

export default function ApiConnectionTest() {
  const { data, isLoading, error, isError } = useHealthCheck();

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-700">Testando conexão com API...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">❌</span>
          <div>
            <h3 className="text-red-800 font-medium">Erro na conexão com API</h3>
            <p className="text-red-700 text-sm mt-1">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">✅</span>
          <div>
            <h3 className="text-green-800 font-medium">API Conectada com Sucesso!</h3>
            <div className="text-green-700 text-sm mt-1 space-y-1">
              <p>Status: {data.data.status}</p>
              <p>Ambiente: {data.data.environment}</p>
              <p>Uptime: {Math.round(data.data.uptime)}s</p>
              <p>
                Database: {data.data.database.connected ? '✅ Conectado' : '❌ Desconectado'}
              </p>
              <p>
                Cache: {data.data.cache.connected ? '✅ Conectado' : '❌ Desconectado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
