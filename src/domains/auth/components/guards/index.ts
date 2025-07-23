/**
 * @fileoverview Auth Guards - Index
 * 
 * Barrel export para todos os guards de autenticação.
 * 
 * @version 1.0.0
 * @domain auth
 */

export { AuthGuard, default as AuthGuardDefault } from './AuthGuard';
export { GuestGuard, default as GuestGuardDefault } from './GuestGuard';
export { 
  RoleGuard, 
  AdminGuard, 
  ModeratorGuard, 
  SuperAdminGuard, 
  PremiumGuard,
  default as RoleGuardDefault 
} from './RoleGuard';
