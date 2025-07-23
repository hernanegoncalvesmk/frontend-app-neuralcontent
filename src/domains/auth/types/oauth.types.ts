/**
 * @fileoverview OAuth Types
 * 
 * Type definitions for OAuth/Social login functionality.
 * 
 * @version 1.0.0
 * @domain auth
 */

import type { ReactNode } from 'react';

// ============================================================================
// OAUTH PROVIDER TYPES
// ============================================================================

export type OAuthProvider = 'google' | 'facebook' | 'microsoft' | 'apple';

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope: string[];
  responseType: 'code' | 'token';
  grantType: 'authorization_code' | 'implicit';
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export interface OAuthProviderConfigs {
  google: OAuthProviderConfig;
  facebook: OAuthProviderConfig;
  microsoft: OAuthProviderConfig;
  apple: OAuthProviderConfig;
}

// ============================================================================
// OAUTH FLOW TYPES
// ============================================================================

export interface OAuthAuthorizationRequest {
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  nonce?: string;
}

export interface OAuthAuthorizationResponse {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
  errorUri?: string;
}

export interface OAuthTokenRequest {
  grantType: string;
  code?: string;
  redirectUri?: string;
  clientId: string;
  clientSecret?: string;
  refreshToken?: string;
}

export interface OAuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  scope?: string;
  idToken?: string;
}

// ============================================================================
// USER INFO TYPES
// ============================================================================

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  locale?: string;
  verified?: boolean;
  provider: OAuthProvider;
}

export interface GoogleUserInfo extends OAuthUserInfo {
  googleId: string;
  picture?: string;
  emailVerified: boolean;
}

export interface FacebookUserInfo extends OAuthUserInfo {
  facebookId: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface MicrosoftUserInfo extends OAuthUserInfo {
  microsoftId: string;
  userPrincipalName?: string;
  displayName?: string;
}

export interface AppleUserInfo extends OAuthUserInfo {
  appleId: string;
  realUserStatus?: number;
}

// ============================================================================
// OAUTH BUTTON TYPES
// ============================================================================

export interface OAuthButtonProps {
  provider: OAuthProvider;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

// ============================================================================
// OAUTH ERROR TYPES
// ============================================================================

export interface OAuthError {
  error: string;
  errorDescription?: string;
  errorUri?: string;
  state?: string;
  provider: OAuthProvider;
}

export type OAuthErrorCode = 
  | 'invalid_request'
  | 'unauthorized_client'
  | 'access_denied'
  | 'unsupported_response_type'
  | 'invalid_scope'
  | 'server_error'
  | 'temporarily_unavailable'
  | 'user_cancelled'
  | 'popup_blocked'
  | 'network_error';

// ============================================================================
// OAUTH STATE TYPES
// ============================================================================

export interface OAuthState {
  provider: OAuthProvider;
  returnUrl?: string;
  nonce: string;
  timestamp: number;
}
