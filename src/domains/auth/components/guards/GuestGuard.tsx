/**
 * @fileoverview Guest Guard
 * 
 * Componente que protege rotas que só devem ser acessadas por usuários não autenticados.
 * Redireciona usuários autenticados para uma página específica.
 * 
 * @version 1.0.0
 * @domain auth
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/infrastructure/providers/AuthProvider';

// ============================================================================
// INTERFACE
// ============================================================================

interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GuestGuard: React.FC<GuestGuardProps> = ({
  children,
  fallback = null,
  redirectTo = '/dashboard',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    // Aguardar inicialização
    if (!isInitialized) return;

    // Se estiver autenticado, redirecionar
    if (isAuthenticated) {
      // Verificar se há um redirect parameter na URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect && redirect.startsWith('/')) {
        router.push(decodeURIComponent(redirect));
      } else {
        router.push(redirectTo);
      }
    }
  }, [isInitialized, isAuthenticated, router, redirectTo]);

  // Mostrar fallback durante carregamento
  if (!isInitialized || isLoading) {
    return fallback || <GuestGuardLoading />;
  }

  // Se estiver autenticado, não renderizar conteúdo
  if (isAuthenticated) {
    return fallback || null;
  }

  // Renderizar conteúdo para guests
  return <>{children}</>;
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const GuestGuardLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
    </div>
  </div>
);

export default GuestGuard;
