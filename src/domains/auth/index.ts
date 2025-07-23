/**
 * @fileoverview Auth Domain - Public API
 * 
 * Barrel export file for the authentication domain.
 * Provides centralized access to all auth-related functionality.
 * 
 * @version 2.0.0
 * @domain auth
 */

// ============================================================================
// SERVICES
// ============================================================================
export * from './services/auth.service';
export * from './services/token.service';

// ============================================================================
// API
// ============================================================================
export * from './api/auth.api';

// ============================================================================
// HOOKS
// ============================================================================
export * from './hooks/useAuth';
export * from './hooks/useAuthForm';

// ============================================================================
// COMPONENTS
// ============================================================================
// Forms - ✅ IMPLEMENTED
export * from './components/LoginForm';
export * from './components/RegisterForm';
export * from './components/ForgotPasswordForm';
export * from './components/ResetPasswordForm';
export * from './components/VerifyEmailForm';

// Guards - ✅ IMPLEMENTED
export * from './components/ProtectedRoute';
export * from './components/guards/AuthGuard';
export * from './components/guards/GuestGuard';
export * from './components/guards/RoleGuard';

// Utility Components
export * from './components/AuthLanguageSelector';
export * from './components/CountrySelector';

// TODO: Implement remaining components
// export * from './components/providers/SocialLoginSection';
// export * from './components/providers/OAuthButton';

// ============================================================================
// TYPES
// ============================================================================
export * from './types/auth.types';
export * from './types/session.types';
export * from './types/oauth.types';

// ============================================================================
// UTILS - TODO: Implement
// ============================================================================
// export * from './utils/auth-utils';
// export * from './utils/validation-utils';
// export * from './utils/security-utils';
// export * from './utils/redirect-utils';

// ============================================================================
// VALIDATORS - TODO: Implement
// ============================================================================
// export * from './validators/login.validator';
// export * from './validators/register.validator';
// export * from './validators/password.validator';
// export * from './validators/email.validator';

// ============================================================================
// CONSTANTS - TODO: Implement
// ============================================================================
// export * from './constants/auth.constants';
// export * from './constants/validation.constants';
// export * from './constants/routes.constants';

// ============================================================================
// DEFAULT EXPORTS - TODO: Implement
// ============================================================================
// export { AuthService as default } from './services/auth.service';
