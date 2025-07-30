/**
 * @fileoverview Auth Provider Component
 * 
 * Provider React para gerenciar estado global de autenticação.
 * Integra com AuthService e useAuth hook.
 * 
 * @version 1.0.0
 * @domain auth
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { UserSafeResponse } from '../types/auth.types';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface AuthContextType {
  user: UserSafeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  // Methods
  setUser: (user: UserSafeResponse | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSafeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed states
  const isAuthenticated = user !== null;

  /**
   * Inicializar autenticação ao carregar o provider
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 AuthProvider: Inicializando autenticação...');

        // Verificar se existem tokens no storage antes de fazer qualquer chamada
        const hasTokens = typeof window !== 'undefined' ? 
          (localStorage.getItem('access_token') || document.cookie.includes('access_token=')) : false;
        
        if (!hasTokens) {
          console.log('📝 AuthProvider: Nenhum token encontrado no storage');
          setUser(null);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        console.log('🔑 AuthProvider: Tokens encontrados, tentando restaurar autenticação...');

        // Tentar restaurar autenticação do storage
        const initializedUser = await authService.initializeAuth();
        
        if (initializedUser) {
          console.log('✅ AuthProvider: Usuário restaurado:', initializedUser.name);
          setUser(initializedUser);
        } else {
          console.log('❌ AuthProvider: Falha ao restaurar usuário');
          setUser(null);
        }
      } catch (error: any) {
        console.error('❌ AuthProvider: Erro ao inicializar autenticação:', error);
        setError('Erro ao carregar autenticação');
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Atualizar usuário
   */
  const updateUser = (newUser: UserSafeResponse | null) => {
    setUser(newUser);
    authService.setCurrentUser(newUser);
  };

  /**
   * Atualizar loading
   */
  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  /**
   * Limpar erro
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    setUser: updateUser,
    setError,
    setLoading: updateLoading,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// HOOK PARA USAR O CONTEXT
// ============================================================================

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export default AuthProvider;
