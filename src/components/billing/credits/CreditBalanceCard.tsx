// ============================================================================
// NEURAL CONTENT - COMPONENTE DE SALDO DE CRÉDITOS
// ============================================================================

/**
 * Componente para exibir saldo atual de créditos
 * 
 * @description Card principal que mostra o saldo, expiração e ações rápidas
 * seguindo os padrões visuais do tema Trezo
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { CreditBalance } from '@/types/credits.types';
import { creditsService } from '@/services/credits.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface CreditBalanceCardProps {
  balance: CreditBalance | null;
  loading?: boolean;
  onPurchase?: () => void;
  onViewHistory?: () => void;
  className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function CreditBalanceCard({
  balance,
  loading = false,
  onPurchase,
  onViewHistory,
  className = ''
}: CreditBalanceCardProps) {
  
  // ============================================================================
  // FUNÇÕES AUXILIARES
  // ============================================================================

  const isLowBalance = balance ? creditsService.isLowBalance(balance.balance) : false;
  const isExpiringSoon = balance?.expirationDate 
    ? creditsService.isExpiringSoon(balance.expirationDate) 
    : false;

  const getBalanceColor = () => {
    if (isLowBalance) return 'text-red-600 dark:text-red-400';
    if (isExpiringSoon) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getBalanceIcon = () => {
    if (isLowBalance) return 'warning';
    if (isExpiringSoon) return 'schedule';
    return 'account_balance_wallet';
  };

  const formatExpirationDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getDaysUntilExpiration = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
      p-6 lg:p-8 transition-all duration-300 hover:shadow-lg
      ${className}
    `}>
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-3 mr-4">
            <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Saldo de Créditos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sua conta atual
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {balance && (
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium flex items-center
            ${isLowBalance 
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
              : isExpiringSoon 
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            }
          `}>
            <span className="material-icons text-xs mr-1">
              {getBalanceIcon()}
            </span>
            {isLowBalance ? 'Saldo Baixo' : isExpiringSoon ? 'Expira em Breve' : 'Ativo'}
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ) : balance ? (
        <>
          {/* Saldo Principal */}
          <div className="text-center mb-6">
            <div className={`text-4xl lg:text-5xl font-bold mb-2 ${getBalanceColor()}`}>
              {creditsService.formatCredits(balance.balance)}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              créditos disponíveis
            </p>
          </div>

          {/* Informações de Expiração */}
          {balance.expirationDate && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons text-gray-600 dark:text-gray-400 mr-2">
                    schedule
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Expira em:
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatExpirationDate(balance.expirationDate)}
                  </div>
                  <div className={`text-xs ${isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {getDaysUntilExpiration(balance.expirationDate)} dias restantes
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alertas de Status */}
          {(isLowBalance || isExpiringSoon) && (
            <div className={`
              rounded-xl p-4 mb-6 flex items-start
              ${isLowBalance 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
              }
            `}>
              <span className={`
                material-icons mr-3 mt-0.5
                ${isLowBalance ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}
              `}>
                {isLowBalance ? 'warning' : 'info'}
              </span>
              <div className="flex-1">
                <h4 className={`
                  font-semibold mb-1
                  ${isLowBalance ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}
                `}>
                  {isLowBalance ? 'Saldo Baixo' : 'Créditos Expirando'}
                </h4>
                <p className={`
                  text-sm
                  ${isLowBalance ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'}
                `}>
                  {isLowBalance 
                    ? 'Considere comprar mais créditos para continuar usando todos os recursos.'
                    : 'Seus créditos expirarão em breve. Renove seu plano para não perdê-los.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onPurchase}
              className="
                bg-blue-600 hover:bg-blue-700 text-white 
                px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 transform hover:scale-105 active:scale-95
                flex items-center justify-center
              "
            >
              <span className="material-icons mr-2 text-lg">add_shopping_cart</span>
              Comprar Créditos
            </button>

            <button
              onClick={onViewHistory}
              className="
                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300 
                px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 transform hover:scale-105 active:scale-95
                flex items-center justify-center
                border border-gray-200 dark:border-gray-600
              "
            >
              <span className="material-icons mr-2 text-lg">history</span>
              Ver Histórico
            </button>
          </div>
        </>
      ) : (
        /* Estado de Erro/Sem Dados */
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-gray-600 dark:text-gray-400 text-2xl">
              error_outline
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Não foi possível carregar o saldo
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Verifique sua conexão e tente novamente.
          </p>
          <button
            onClick={onPurchase}
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-6 py-2 rounded-lg font-medium text-sm
              transition-colors
            "
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Última Atualização */}
      {balance?.lastUpdated && (
        <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Última atualização: {' '}
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(balance.lastUpdated)}
          </p>
        </div>
      )}
    </div>
  );
}
