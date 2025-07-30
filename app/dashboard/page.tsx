/**
 * @fileoverview Dashboard Page - Estrutura Trezo
 * 
 * Página principal do dashboard seguindo estrutura do Trezo.
 * 
 * @version 1.0.0
 */

'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// DASHBOARD COMPONENTS - Estrutura Trezo
// ============================================================================

/**
 * Welcome Component
 */
function Welcome() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] mb-[25px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black dark:text-white text-[20px] md:text-[22px] lg:text-[24px] font-bold mb-[5px]">
            Bem-vindo, {user?.name || 'Usuário'}! 👋
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[16px]">
            Aqui está o que está acontecendo com seus projetos hoje.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Botão Sair */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg 
              className="mr-2 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Sair
          </button>
          
          <div className="hidden md:block">
            <div className="w-[60px] h-[60px] rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <svg className="w-[30px] h-[30px] text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stats Cards
 */
function StatsCards() {
  const stats = [
    {
      title: "Total de Conteúdos",
      value: "124",
      change: "+12%",
      positive: true,
      icon: "description"
    },
    {
      title: "Créditos Restantes", 
      value: "2,450",
      change: "-5%",
      positive: false,
      icon: "account_balance_wallet"
    },
    {
      title: "Projetos Ativos",
      value: "8",
      change: "+25%", 
      positive: true,
      icon: "folder"
    },
    {
      title: "AI Generations",
      value: "356",
      change: "+18%",
      positive: true,
      icon: "psychology"
    }
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] mb-[25px]">
          <div className="flex items-center justify-between mb-[15px]">
            <div className={`w-[50px] h-[50px] rounded-md flex items-center justify-center ${
              stat.positive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <svg className={`w-[24px] h-[24px] ${
                stat.positive ? 'text-green-500' : 'text-red-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {stat.icon === 'description' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                )}
                {stat.icon === 'account_balance_wallet' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                )}
                {stat.icon === 'folder' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                )}
                {stat.icon === 'psychology' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                )}
              </svg>
            </div>
            <span className={`text-[12px] font-medium px-[8px] py-[2px] rounded-full ${
              stat.positive 
                ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <h3 className="text-black dark:text-white text-[24px] font-bold mb-[5px]">
            {stat.value}
          </h3>
          <p className="text-gray-500 text-[14px]">
            {stat.title}
          </p>
        </div>
      ))}
    </>
  );
}

/**
 * Quick Actions
 */
function QuickActions() {
  const actions = [
    {
      title: "Criar Conteúdo",
      description: "Gerar novo conteúdo com IA",
      icon: "add_circle",
      color: "primary"
    },
    {
      title: "Ver Projetos", 
      description: "Acessar todos os projetos",
      icon: "folder_open",
      color: "blue"
    },
    {
      title: "Comprar Créditos",
      description: "Adicionar mais créditos",
      icon: "payment",
      color: "green"
    },
    {
      title: "Configurações",
      description: "Ajustar preferências",
      icon: "settings",
      color: "purple"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] mb-[25px]">
      <h3 className="text-black dark:text-white text-[18px] font-bold mb-[20px]">
        Ações Rápidas
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="text-left p-[15px] rounded-md border border-gray-100 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group"
          >
            <div className="flex items-center mb-[10px]">
              <div className={`w-[40px] h-[40px] rounded-md flex items-center justify-center mr-[12px] ${
                action.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20' :
                action.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
                action.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
                'bg-purple-50 dark:bg-purple-900/20'
              }`}>
                <svg className={`w-[20px] h-[20px] ${
                  action.color === 'primary' ? 'text-primary-500' :
                  action.color === 'blue' ? 'text-blue-500' :
                  action.color === 'green' ? 'text-green-500' :
                  'text-purple-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {action.icon === 'add_circle' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  )}
                  {action.icon === 'folder_open' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                  )}
                  {action.icon === 'payment' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  )}
                  {action.icon === 'settings' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  )}
                </svg>
              </div>
              <div>
                <h4 className="text-black dark:text-white text-[14px] font-medium group-hover:text-primary-500 transition-all">
                  {action.title}
                </h4>
                <p className="text-gray-500 text-[12px]">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Redirect se não autenticado
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Grid Layout - Estrutura Trezo */}
      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <Welcome />
        </div>
        
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="lg:grid lg:grid-cols-4 gap-[25px]">
        <StatsCards />
      </div>
    </>
  );
}
