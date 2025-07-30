/**
 * @fileoverview Mock Auth Service
 * 
 * Serviço de autenticação mockado para desenvolvimento sem backend
 * 
 * @version 1.0.0
 */

import type { UserSafeResponse } from '../types/auth.types';

export const mockUser: UserSafeResponse = {
  id: 'mock-user-123',
  email: 'usuario@neuralcontent.com',
  name: 'João da Silva',
  username: 'joao.silva',
  avatarUrl: undefined,
  role: 'USER' as any,
  status: 'ACTIVE' as any,
  isEmailVerified: true,
  isPhoneVerified: false,
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
};

export const mockAuthService = {
  getCurrentUser: () => mockUser,
  isAuthenticated: () => true,
  isLoading: () => false,
  isInitialized: () => true,
  
  // Métodos mockados que retornam promises
  login: async () => ({ user: mockUser, tokens: null }),
  logout: async () => { console.log('Mock logout'); },
  register: async () => ({ user: mockUser, tokens: null }),
  
  // Eventos mockados
  onAuthStateChange: (callback: (user: UserSafeResponse | null) => void) => {
    // Simula usuário logado após um pequeno delay
    setTimeout(() => callback(mockUser), 100);
    return () => {}; // cleanup function
  }
};
