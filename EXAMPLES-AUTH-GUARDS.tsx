/**
 * @fileoverview Examples of Auth Guards Usage
 * 
 * Exemplos práticos de como usar os guards de autenticação
 * em diferentes cenários do aplicativo.
 * 
 * @version 1.0.0
 * @domain auth
 */

import React from 'react';
import { 
  AuthGuard, 
  GuestGuard, 
  RoleGuard, 
  AdminGuard, 
  ModeratorGuard,
  SuperAdminGuard,
  PremiumGuard 
} from '@/domains/auth';
import { useAuth } from '@/infrastructure/providers/AuthProvider';

// ============================================================================
// EXEMPLO 1: PÁGINA DE DASHBOARD (REQUER AUTENTICAÇÃO)
// ============================================================================

export const DashboardPage: React.FC = () => {
  return (
    <AuthGuard 
      fallback={<div>Redirecionando para login...</div>}
      requireEmailVerified={true}
    >
      <div>
        <h1>Dashboard</h1>
        <p>Esta página só é acessível por usuários autenticados com email verificado.</p>
      </div>
    </AuthGuard>
  );
};

// ============================================================================
// EXEMPLO 2: PÁGINA DE LOGIN (APENAS PARA GUESTS)
// ============================================================================

export const LoginPage: React.FC = () => {
  return (
    <GuestGuard 
      fallback={<div>Redirecionando para dashboard...</div>}
      redirectTo="/dashboard"
    >
      <div>
        <h1>Login</h1>
        <p>Esta página só é acessível por usuários não autenticados.</p>
      </div>
    </GuestGuard>
  );
};

// ============================================================================
// EXEMPLO 3: PAINEL ADMINISTRATIVO (APENAS ADMINS)
// ============================================================================

export const AdminPanelPage: React.FC = () => {
  return (
    <AdminGuard fallback={<div>Acesso negado - Apenas admins</div>}>
      <div>
        <h1>Painel Administrativo</h1>
        <p>Esta página só é acessível por administradores.</p>
      </div>
    </AdminGuard>
  );
};

// ============================================================================
// EXEMPLO 4: ÁREA DE MODERAÇÃO (MODERADORES E ACIMA)
// ============================================================================

export const ModerationPage: React.FC = () => {
  return (
    <ModeratorGuard>
      <div>
        <h1>Moderação</h1>
        <p>Acesso para moderadores, admins e super admins.</p>
      </div>
    </ModeratorGuard>
  );
};

// ============================================================================
// EXEMPLO 5: CONFIGURAÇÕES AVANÇADAS (SUPER ADMIN APENAS)
// ============================================================================

export const SystemConfigPage: React.FC = () => {
  return (
    <SuperAdminGuard>
      <div>
        <h1>Configurações do Sistema</h1>
        <p>Apenas super administradores podem acessar esta área.</p>
      </div>
    </SuperAdminGuard>
  );
};

// ============================================================================
// EXEMPLO 6: FUNCIONALIDADES PREMIUM
// ============================================================================

export const PremiumFeaturesPage: React.FC = () => {
  return (
    <PremiumGuard>
      <div>
        <h1>Funcionalidades Premium</h1>
        <p>Acesso exclusivo para usuários premium.</p>
      </div>
    </PremiumGuard>
  );
};

// ============================================================================
// EXEMPLO 7: GUARD CUSTOMIZADO COM MÚLTIPLAS PERMISSÕES
// ============================================================================

export const EditorPage: React.FC = () => {
  return (
    <RoleGuard
      permissions={['edit_posts', 'publish_posts']}
      roles={['editor', 'admin']}
      requireAll={false} // Precisa de pelo menos uma role OU uma permissão
      fallback={
        <div className="text-center p-8">
          <h2>Acesso Restrito</h2>
          <p>Você precisa ser editor ou ter permissões de edição.</p>
        </div>
      }
    >
      <div>
        <h1>Editor de Conteúdo</h1>
        <p>Área para editores e pessoas com permissões de edição.</p>
      </div>
    </RoleGuard>
  );
};

// ============================================================================
// EXEMPLO 8: GUARD COM REDIRECIONAMENTO CUSTOMIZADO
// ============================================================================

export const BillingPage: React.FC = () => {
  return (
    <AuthGuard
      requireEmailVerified={true}
      redirectTo="/auth/verify-email"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p>Verificando acesso...</p>
          </div>
        </div>
      }
    >
      <div>
        <h1>Cobrança</h1>
        <p>Área de cobrança - requer email verificado.</p>
      </div>
    </AuthGuard>
  );
};

// ============================================================================
// EXEMPLO 9: COMPONENTE CONDICIONAL INLINE
// ============================================================================

export const ConditionalContent: React.FC = () => {
  return (
    <div>
      <h1>Página Pública</h1>
      <p>Este conteúdo é visível para todos.</p>
      
      {/* Conteúdo apenas para usuários autenticados */}
      <AuthGuard fallback={<p>Faça login para ver mais conteúdo.</p>}>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h2>Conteúdo Exclusivo</h2>
          <p>Este conteúdo só aparece para usuários logados.</p>
        </div>
      </AuthGuard>
      
      {/* Conteúdo apenas para admins */}
      <AdminGuard fallback={null}>
        <div className="mt-4 p-4 bg-red-50 rounded">
          <h2>Área Administrativa</h2>
          <p>Este conteúdo só aparece para administradores.</p>
        </div>
      </AdminGuard>
    </div>
  );
};

// ============================================================================
// EXEMPLO 10: HOOK DE PROTEÇÃO PROGRAMÁTICA
// ============================================================================

export const ProgrammaticGuardExample: React.FC = () => {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  
  // Verificação programática
  if (!isAuthenticated) {
    return <div>Você precisa estar logado.</div>;
  }
  
  if (!hasRole('premium') && !hasPermission('premium_access')) {
    return <div>Acesso premium necessário.</div>;
  }
  
  return (
    <div>
      <h1>Área Premium</h1>
      <p>Verificação programática funcionando!</p>
    </div>
  );
};
