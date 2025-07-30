/**
 * @fileoverview useAuth Hook - Mock Version
 * 
 * Hook de autenticação que usa dados mockados para desenvolvimento
 * 
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { mockUser } from '../services/mock-auth.service';
import type { UserSafeResponse } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<UserSafeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
      setIsInitialized(true);
      console.log('🎭 Mock Auth: Usuário mockado carregado', mockUser);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error: null,
    
    // Mock methods
    login: async () => {
      console.log('🎭 Mock Auth: Login simulado');
      setUser(mockUser);
    },
    
    logout: async () => {
      console.log('🎭 Mock Auth: Logout simulado');
      setUser(null);
    },
    
    register: async () => {
      console.log('🎭 Mock Auth: Registro simulado');
      setUser(mockUser);
    },
    
    // Outros métodos mockados
    forgotPassword: async () => console.log('🎭 Mock Auth: Forgot password'),
    resetPassword: async () => console.log('🎭 Mock Auth: Reset password'),
    changePassword: async () => console.log('🎭 Mock Auth: Change password'),
    verifyEmail: async () => console.log('🎭 Mock Auth: Verify email'),
    refreshUser: async () => console.log('🎭 Mock Auth: Refresh user'),
    updateUser: () => console.log('🎭 Mock Auth: Update user'),
    validateSession: async () => true,
    refreshTokens: async () => true,
  };
};
