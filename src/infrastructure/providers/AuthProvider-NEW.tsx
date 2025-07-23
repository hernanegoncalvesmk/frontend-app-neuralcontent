/**
 * @fileoverview Auth Provider
 * 
 * Authentication context provider that manages user authentication state.
 * Now integrated with the new AuthService and backend.
 * 
 * @version 2.0.0
 * @domain auth
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/domains/auth/hooks/useAuth';
import type { UserSafeResponse } from '@/domains/auth/types/auth.types';

// ================================
// Context Types  
// ================================
interface AuthContextType {
  // State
  user: UserSafeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  
  // Password methods
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<void>;
  
  // User methods
  refreshUser: () => Promise<void>;
  updateUser: (user: UserSafeResponse) => void;
  
  // Session methods
  validateSession: () => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  
  // Utility methods
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  language?: string;
}

// ================================
// Context
// ================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================
// Provider Component
// ================================
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthHook();

  // Adapt the useAuth hook to match the expected interface
  const contextValue: AuthContextType = {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    error: auth.error,

    // Authentication methods - adapt signatures
    login: async (email: string, password: string) => {
      return auth.login({ email, password });
    },

    register: async (userData: RegisterData) => {
      return auth.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        acceptTerms: userData.acceptTerms,
        language: userData.language,
      });
    },

    logout: auth.logout,

    // Password methods - adapt signatures
    forgotPassword: async (email: string) => {
      return auth.forgotPassword({ email });
    },

    resetPassword: async (token: string, password: string) => {
      return auth.resetPassword({ token, password, confirmPassword: password });
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      return auth.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
    },

    // Email verification - adapt signature
    verifyEmail: async (token: string) => {
      return auth.verifyEmail({ token });
    },

    // User methods
    refreshUser: auth.refreshUser,
    updateUser: auth.updateUser,

    // Session methods
    validateSession: auth.validateSession,
    refreshTokens: auth.refreshTokens,

    // Utility methods
    clearError: auth.clearError,
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ================================
// Hook to use Auth Context
// ================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
