"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/constants/routes';

const RedirectHandler: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Se usuário está logado, redirecionar para dashboard
        router.push(ROUTES.DASHBOARD);
      } else {
        // Se não está logado, redirecionar para login
        router.push(ROUTES.AUTH.LOGIN);
      }
    }
  }, [user, isLoading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Fallback (não deve ser exibido devido aos redirects acima)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Neural Content
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecionando...
        </p>
      </div>
    </div>
  );
};

export default RedirectHandler;
