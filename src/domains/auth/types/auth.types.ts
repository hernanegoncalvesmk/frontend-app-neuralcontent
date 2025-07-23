/**
 * @fileoverview Auth Domain Types
 * 
 * Core type definitions for the authentication domain.
 * Includes auth requests, responses, and user-related types.
 * 
 * @version 1.0.0
 * @domain auth
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  MICROSOFT = 'microsoft',
  APPLE = 'apple'
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  provider: AuthProvider;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showLastSeen: boolean;
  };
}

// ============================================================================
// TOKEN TYPES
// ============================================================================

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  language?: string;
  referralCode?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  tokens?: TokenPair;
  timestamp: string;
}

export interface UserSafeResponse {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  language?: string;
  timezone?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  country?: string;
  language?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoginErrors extends FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterErrors extends FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export interface ResetPasswordErrors extends FormErrors {
  password?: string;
  confirmPassword?: string;
  token?: string;
  general?: string;
}

// ============================================================================
// DEVICE & SESSION TYPES
// ============================================================================

export interface DeviceInfo {
  deviceId?: string;
  deviceName?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  operatingSystem?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  isActive: boolean;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
}

// ============================================================================
// OAUTH TYPES
// ============================================================================

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
  responseType: 'code' | 'token';
}

export interface OAuthResponse {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

// ============================================================================
// GUARD TYPES
// ============================================================================

export interface GuardConfig {
  requireAuth: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type AuthEvent = 
  | 'login_attempt'
  | 'login_success' 
  | 'login_failure'
  | 'logout'
  | 'register_attempt'
  | 'register_success'
  | 'register_failure'
  | 'password_reset_request'
  | 'password_reset_success'
  | 'email_verification_sent'
  | 'email_verification_success'
  | 'token_refresh'
  | 'session_expired';

export interface AuthEventData {
  event: AuthEvent;
  userId?: string;
  email?: string;
  provider?: AuthProvider;
  deviceInfo?: DeviceInfo;
  timestamp: string;
  metadata?: Record<string, any>;
}
