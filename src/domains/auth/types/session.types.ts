/**
 * @fileoverview Session Types
 * 
 * Type definitions for session management in the auth domain.
 * 
 * @version 1.0.0
 * @domain auth
 */

import type { DeviceInfo, User } from './auth.types';

// ============================================================================
// SESSION TYPES
// ============================================================================

export interface SessionData {
  id: string;
  userId: string;
  user: User;
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
}

export interface SessionStorage {
  accessToken: string;
  refreshToken: string;
  user: User;
  sessionId: string;
  expiresAt: string;
}

export interface SessionConfig {
  maxAge: number; // in milliseconds
  renewBeforeExpiry: number; // in milliseconds  
  maxSessions: number;
  trackActivity: boolean;
  requireReauth: boolean;
}

// ============================================================================
// SESSION EVENTS
// ============================================================================

export type SessionEvent = 
  | 'session_created'
  | 'session_updated' 
  | 'session_expired'
  | 'session_revoked'
  | 'activity_tracked';

export interface SessionEventData {
  event: SessionEvent;
  sessionId: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
