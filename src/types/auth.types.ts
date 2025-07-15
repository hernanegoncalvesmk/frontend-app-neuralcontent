// Tipos para requests de autenticação
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  birthDate: string;
  country: string;
  acceptTerms?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Tipos para responses de autenticação
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // em segundos
  tokenType: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}

// Tipos para validação de email
export interface EmailVerificationRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Tipos para autenticação social
export interface SocialAuthRequest {
  provider: 'google' | 'facebook' | 'github';
  token: string;
}

// Tipos para configurações de autenticação
export interface AuthConfig {
  enableRegistration: boolean;
  enableSocialAuth: boolean;
  enableEmailVerification: boolean;
  passwordMinLength: number;
  sessionTimeout: number; // em minutos
}

// Tipos para status de autenticação
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  lastActivity: Date | null;
}

// Tipos para usuário (importado de user.types.ts)
import type { User, UserRole } from './user.types';

// Tipos para sessão
export interface Session {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// Tipos para logs de autenticação
export interface AuthLog {
  id: string;
  userId: string;
  action: AuthAction;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
  createdAt: Date;
}

export type AuthAction = 
  | 'login'
  | 'logout'
  | 'register'
  | 'password_reset'
  | 'password_change'
  | 'email_verification'
  | 'token_refresh'
  | 'social_login';

// Tipos para permissões
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
}

// Tipos para middleware de autenticação
export interface AuthMiddlewareConfig {
  requireAuth: boolean;
  requireVerification: boolean;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
}

// Tipos para contexto de autenticação
export interface AuthContextValue {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;

  // Verificações
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}
