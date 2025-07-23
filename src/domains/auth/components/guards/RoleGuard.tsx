/**
 * @fileoverview Role Guard
 * 
 * Componente que protege rotas baseado em roles e permissões específicas.
 * Mais granular que o AuthGuard para controle de acesso avançado.
 * 
 * @version 1.0.0
 * @domain auth
 */

'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/infrastructure/providers/AuthProvider';
import { AuthGuard } from './AuthGuard';

// ============================================================================
// INTERFACE
// ============================================================================

interface RoleGuardProps {
  children: ReactNode;
  roles?: string | string[];
  permissions?: string | string[];
  requireAll?: boolean; // Se true, requer todas as roles/permissions. Se false, requer apenas uma
  fallback?: ReactNode;
  redirectTo?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback,
  redirectTo = '/auth/unauthorized',
}) => {
  const { hasRole, hasPermission } = useAuth();

  // Normalizar para arrays
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

  // Verificar roles
  const checkRoles = (): boolean => {
    if (requiredRoles.length === 0) return true;

    if (requireAll) {
      return requiredRoles.every(role => hasRole(role));
    } else {
      return requiredRoles.some(role => hasRole(role));
    }
  };

  // Verificar permissões
  const checkPermissions = (): boolean => {
    if (requiredPermissions.length === 0) return true;

    if (requireAll) {
      return requiredPermissions.every(permission => hasPermission(permission));
    } else {
      return requiredPermissions.some(permission => hasPermission(permission));
    }
  };

  // Verificar se tem acesso
  const hasAccess = checkRoles() && checkPermissions();

  return (
    <AuthGuard
      fallback={fallback}
      redirectTo={redirectTo}
      requiredRoles={requiredRoles}
      requiredPermissions={requiredPermissions}
    >
      {hasAccess ? children : (fallback || <UnauthorizedRole />)}
    </AuthGuard>
  );
};

// ============================================================================
// UNAUTHORIZED COMPONENT
// ============================================================================

const UnauthorizedRole: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="mb-4">
        <i className="material-symbols-outlined text-6xl text-orange-500">admin_panel_settings</i>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Permissão Insuficiente
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Você não possui o nível de acesso necessário para esta funcionalidade.
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

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * Guard para admins
 */
export const AdminGuard: React.FC<Omit<RoleGuardProps, 'roles'>> = (props) => (
  <RoleGuard {...props} roles={['admin', 'super_admin']} />
);

/**
 * Guard para moderadores
 */
export const ModeratorGuard: React.FC<Omit<RoleGuardProps, 'roles'>> = (props) => (
  <RoleGuard {...props} roles={['moderator', 'admin', 'super_admin']} />
);

/**
 * Guard para super admins
 */
export const SuperAdminGuard: React.FC<Omit<RoleGuardProps, 'roles'>> = (props) => (
  <RoleGuard {...props} roles={['super_admin']} />
);

/**
 * Guard para usuários premium
 */
export const PremiumGuard: React.FC<Omit<RoleGuardProps, 'permissions'>> = (props) => (
  <RoleGuard {...props} permissions={['premium_access']} />
);

export default RoleGuard;
