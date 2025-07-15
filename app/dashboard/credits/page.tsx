// ============================================================================
// NEURAL CONTENT - PÁGINA DE CRÉDITOS
// ============================================================================

/**
 * Página principal para gerenciamento de créditos
 * 
 * @description Implementação completa do PASSO 5.1 - Página de Créditos
 * com visualização de saldo, compra de pacotes, histórico e alertas
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useEffect } from 'react';
import { useCredits } from '@/hooks/useCredits';
import { creditsService } from '@/services/credits.service';

// Componentes
import CreditBalanceCard from '@/components/credits/CreditBalanceCard';
import CreditPackageCard from '@/components/credits/CreditPackageCard';
import CreditHistoryTable from '@/components/credits/CreditHistoryTable';
import CreditAlerts from '@/components/credits/CreditAlerts';

// Tipos
import { CreditPackage, CreditHistoryFilters } from '@/types/credits.types';

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

export default function CreditsPage() {
  
  // ============================================================================
  // HOOKS E ESTADO
  // ============================================================================

  const {
    state,
    stats,
    alerts,
    actions
  } = useCredits({
    autoRefresh: true,
    refreshInterval: 30000 // 30 segundos
  });

  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'packages' | 'history'>('overview');

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    loadPackages();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const loadPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await creditsService.getPackages();
      if (response.success && response.data) {
        setPackages(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handlePurchaseCredits = async (packageId?: string) => {
    if (packageId) {
      try {
        // Redirecionar para checkout ou abrir modal de pagamento
        window.location.href = `/checkout/credits/${packageId}`;
      } catch (error) {
        console.error('Erro ao iniciar compra:', error);
      }
    } else {
      // Ir para seção de pacotes
      setActiveSection('packages');
    }
  };

  const handleQuickPurchase = () => {
    setActiveSection('packages');
    // Scroll suave para a seção de pacotes
    setTimeout(() => {
      const packagesSection = document.getElementById('packages-section');
      packagesSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFilterChange = (filters: CreditHistoryFilters) => {
    actions.setFilters(filters);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSectionNavigation = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <div className="p-6">
        <nav className="flex space-x-8" aria-label="Sections">
          {[
            { id: 'overview', label: 'Visão Geral', icon: 'dashboard' },
            { id: 'packages', label: 'Comprar Créditos', icon: 'shopping_cart' },
            { id: 'history', label: 'Histórico', icon: 'history' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeSection === section.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="material-icons text-lg mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="space-y-8">
      {/* Alertas */}
      {state.balance && (
        <CreditAlerts
          balance={state.balance}
          onPurchaseCredits={handleQuickPurchase}
        />
      )}

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Saldo */}
        <div className="lg:col-span-2">
          <CreditBalanceCard
            balance={state.balance}
            loading={state.loading.balance}
            onPurchase={handleQuickPurchase}
          />
        </div>

        {/* Estatísticas Rápidas */}
        <div className="space-y-6">
          {/* Resumo do Mês */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resumo do Mês
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Créditos usados:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {creditsService.formatCredits(stats?.usedThisMonth || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Média diária:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {creditsService.formatCredits(stats?.averageDaily || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Projeção mensal:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {creditsService.formatCredits(stats?.projectedMonthly || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleQuickPurchase}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <span className="material-icons mr-2">add_shopping_cart</span>
                Comprar Créditos
              </button>
              <button
                onClick={() => setActiveSection('history')}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
              >
                <span className="material-icons mr-2">history</span>
                Ver Histórico
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackagesSection = () => (
    <div id="packages-section" className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Escolha seu Pacote de Créditos
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Selecione o pacote ideal para suas necessidades e economize com nossos descontos progressivos.
        </p>
      </div>

      {/* Grid de Pacotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packagesLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <CreditPackageCard
              key={i}
              package={{} as CreditPackage}
              loading={true}
              onPurchase={() => {}}
            />
          ))
        ) : (
          packages.map((pkg) => (
            <CreditPackageCard
              key={pkg.id}
              package={pkg}
              onPurchase={handlePurchaseCredits}
            />
          ))
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            💎 Por que escolher nossos créditos?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">flash_on</span>
              </div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Processamento Rápido</h4>
              <p className="text-blue-700 dark:text-blue-200 text-sm">IA otimizada para resultados em segundos</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">verified</span>
              </div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Qualidade Premium</h4>
              <p className="text-blue-700 dark:text-blue-200 text-sm">Conteúdo de alta qualidade garantido</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">support</span>
              </div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Suporte 24/7</h4>
              <p className="text-blue-700 dark:text-blue-200 text-sm">Ajuda sempre que precisar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Histórico de Transações
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe todas as suas movimentações de créditos
          </p>
        </div>
        <button
          onClick={actions.refreshHistory}
          disabled={state.loading.transactions}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
        >
          <span className={`material-icons mr-2 ${state.loading.transactions ? 'animate-spin' : ''}`}>
            refresh
          </span>
          Atualizar
        </button>
      </div>

      {/* Tabela de Histórico */}
      <CreditHistoryTable
        transactions={state.transactions}
        loading={state.loading.transactions}
        pagination={{
          currentPage: state.pagination.page,
          totalPages: Math.ceil(state.pagination.total / state.pagination.limit),
          totalItems: state.pagination.total,
          itemsPerPage: state.pagination.limit
        }}
        onPageChange={actions.changePage}
        onFilterChange={handleFilterChange}
      />
    </div>
  );

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  // Verifica se há algum erro crítico nos alertas
  const criticalError = alerts.find(alert => alert.severity === 'error');

  if (criticalError && state.loading.balance) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-red-100 dark:bg-red-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-red-600 dark:text-red-400 text-2xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Erro ao Carregar Créditos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {criticalError.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Principal */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Créditos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Controle seus créditos, compre pacotes e acompanhe seu histórico
          </p>
        </div>

        {/* Navegação de Seções */}
        {renderSectionNavigation()}

        {/* Conteúdo das Seções */}
        {activeSection === 'overview' && renderOverviewSection()}
        {activeSection === 'packages' && renderPackagesSection()}
        {activeSection === 'history' && renderHistorySection()}
      </div>
    </div>
  );
}
