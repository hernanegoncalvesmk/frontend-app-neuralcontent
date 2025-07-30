/**
 * @fileoverview Login Success Handler
 * 
 * Component para gerenciar redirecionamento após login bem-sucedido.
 * 
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/infrastructure/providers/AuthProvider';

export function LoginSuccessHandler() {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só redirecionar se estiver inicializado e autenticado
    if (isInitialized && isAuthenticated && user) {
      console.log('🚀 LoginSuccessHandler: Redirecionando usuário autenticado para dashboard');
      router.push('/dashboard');
    }
  }, [isInitialized, isAuthenticated, user, router]);

  return null; // Component não renderiza nada
}

export default LoginSuccessHandler;
