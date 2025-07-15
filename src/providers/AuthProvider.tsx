'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { setTokens, setUserData, clearStoredTokens, getAuthState } from '@/lib/auth';
import type { User } from '@/types/user.types';
import type { LoginRequest, RegisterRequest } from '@/types/auth.types';

// Interface do contexto de autenticação
interface AuthContextType {
  // Estados
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Criar contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar estado de autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const authState = getAuthState();
        
        if (authState.isAuthenticated && authState.userData) {
          setUser(authState.userData);
          
          // Verificar se o token precisa ser renovado
          if (authState.shouldRefresh) {
            try {
              await authService.refreshToken();
            } catch (error) {
              console.error('Erro ao renovar token:', error);
              await logout();
              return;
            }
          }
          
          // Buscar dados atualizados do usuário
          try {
            await refreshUser();
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            // Se falhar ao buscar dados, manter os dados locais
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Função de login
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        // Salvar tokens e dados do usuário
        setTokens(response.data.tokens);
        setUserData(response.data.user);
        setUser(response.data.user);
        
        // Redirecionar para dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        // Salvar tokens e dados do usuário
        setTokens(response.data.tokens);
        setUserData(response.data.user);
        setUser(response.data.user);
        
        // Redirecionar para verificação de email ou dashboard
        if (!response.data.user.isEmailVerified) {
          router.push('/auth/verify-email');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Tentar fazer logout no servidor
      try {
        await authService.logout();
      } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error);
        // Continuar com logout local mesmo se servidor falhar
      }
      
      // Limpar dados locais
      clearStoredTokens();
      setUser(null);
      setError(null);
      
      // Redirecionar para login
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro durante logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar dados do usuário
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setUserData(response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      // Se erro 401, fazer logout
      if (error instanceof Error && error.message.includes('401')) {
        await logout();
      }
      throw error;
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    // Estados
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    
    // Ações
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export default AuthProvider;
