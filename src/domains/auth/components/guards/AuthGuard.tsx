/**
 * @fileoverview Auth Guard
 * 
 * Componente que protege rotas que requerem autenticação.
 * Redireciona usuários não autenticados para a página de login.
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

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireEmailVerified?: boolean;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  redirectTo = '/auth/login',
  requireEmailVerified = false,
  requiredPermissions = [],
  requiredRoles = [],
}) => {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    isInitialized,
    hasPermission,
    hasRole 
  } = useAuth();

  useEffect(() => {
    // Aguardar inicialização
    if (!isInitialized) return;

    // Se não estiver autenticado, redirecionar para login
    if (!isAuthenticated || !user) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`${redirectTo}?redirect=${currentPath}`);
      return;
    }

    // Verificar se email é obrigatório e não está verificado
    if (requireEmailVerified && !user.isEmailVerified) {
      router.push('/auth/verify-email');
      return;
    }

    // Verificar permissões obrigatórias
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      
      if (!hasAllPermissions) {
        router.push('/auth/unauthorized');
        return;
      }
    }

    // Verificar roles obrigatórias
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));
      
      if (!hasRequiredRole) {
        router.push('/auth/unauthorized');
        return;
      }
    }
  }, [
    isInitialized,
    isAuthenticated,
    user,
    requireEmailVerified,
    requiredPermissions,
    requiredRoles,
    router,
    redirectTo,
    hasPermission,
    hasRole,
  ]);

  // Mostrar fallback durante carregamento ou verificação
  if (!isInitialized || isLoading) {
    return fallback || <AuthGuardLoading />;
  }

  // Se não estiver autenticado, não renderizar conteúdo
  if (!isAuthenticated || !user) {
    return fallback || null;
  }

  // Verificar se email é obrigatório e não está verificado
  if (requireEmailVerified && !user.isEmailVerified) {
    return fallback || null;
  }

  // Verificar permissões
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      return fallback || <UnauthorizedMessage />;
    }
  }

  // Verificar roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      return fallback || <UnauthorizedMessage />;
    }
  }

  // Renderizar conteúdo protegido
  return <>{children}</>;
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const AuthGuardLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
    </div>
  </div>
);

// ============================================================================
// UNAUTHORIZED COMPONENT
// ============================================================================

const UnauthorizedMessage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="mb-4">
        <i className="material-symbols-outlined text-6xl text-red-500">lock</i>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Acesso Negado
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Voltar
      </button>
    </div>
  </div>
);

export default AuthGuard;
