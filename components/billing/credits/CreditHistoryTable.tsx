// ============================================================================
// NEURAL CONTENT - COMPONENTE DE HISTÓRICO DE TRANSAÇÕES
// ============================================================================

/**
 * Componente para exibir o histórico de transações de créditos
 * 
 * @description Tabela responsiva com paginação, filtros e detalhes das transações
 * seguindo padrões visuais do Trezo com otimização para mobile
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState } from 'react';
import { 
  CreditTransaction, 
  CreditTransactionType, 
  CreditTransactionStatus,
  CreditHistoryFilters 
} from '@/types/credits.types';
import { creditsService } from '@/services/credits.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface CreditHistoryTableProps {
  transactions: CreditTransaction[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
  onFilterChange: (filters: CreditHistoryFilters) => void;
  className?: string;
}

// ============================================================================
// DADOS DE CONFIGURAÇÃO
// ============================================================================

const STATUS_CONFIG = {
  [CreditTransactionStatus.COMPLETED]: {
    label: 'Concluída',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900',
    icon: 'check_circle'
  },
  [CreditTransactionStatus.PENDING]: {
    label: 'Pendente',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    icon: 'schedule'
  },
  [CreditTransactionStatus.CANCELLED]: {
    label: 'Cancelada',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'cancel'
  },
  [CreditTransactionStatus.REFUNDED]: {
    label: 'Reembolsada',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: 'refresh'
  },
  [CreditTransactionStatus.FAILED]: {
    label: 'Falhou',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'error'
  }
} as const;

const TYPE_CONFIG = {
  [CreditTransactionType.PURCHASE]: {
    label: 'Compra',
    color: 'text-green-600 dark:text-green-400',
    icon: 'add_circle'
  },
  [CreditTransactionType.CONSUMPTION]: {
    label: 'Consumo',
    color: 'text-red-600 dark:text-red-400',
    icon: 'remove_circle'
  },
  [CreditTransactionType.BONUS]: {
    label: 'Bônus',
    color: 'text-purple-600 dark:text-purple-400',
    icon: 'star'
  },
  [CreditTransactionType.REFUND]: {
    label: 'Reembolso',
    color: 'text-blue-600 dark:text-blue-400',
    icon: 'undo'
  },
  [CreditTransactionType.TRANSFER_IN]: {
    label: 'Transferência In',
    color: 'text-green-600 dark:text-green-400',
    icon: 'call_received'
  },
  [CreditTransactionType.TRANSFER_OUT]: {
    label: 'Transferência Out',
    color: 'text-red-600 dark:text-red-400',
    icon: 'call_made'
  },
  [CreditTransactionType.EXPIRATION]: {
    label: 'Expiração',
    color: 'text-orange-600 dark:text-orange-400',
    icon: 'schedule'
  }
} as const;

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function CreditHistoryTable({
  transactions,
  loading = false,
  pagination,
  onPageChange,
  onFilterChange,
  className = ''
}: CreditHistoryTableProps) {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [filters, setFilters] = useState<CreditHistoryFilters>({});
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFilterChange = (newFilters: Partial<CreditHistoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const renderTransactionAmount = (transaction: CreditTransaction) => {
    const isPositive = [CreditTransactionType.PURCHASE, CreditTransactionType.BONUS, CreditTransactionType.REFUND, CreditTransactionType.TRANSFER_IN].includes(transaction.type);
    const sign = isPositive ? '+' : '-';
    const colorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {sign}{creditsService.formatCredits(Math.abs(transaction.amount))}
      </span>
    );
  };

  const formatTransactionDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  // ============================================================================
  // RENDER LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="space-y-4">
          {/* Header Loading */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Table Loading */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      
      {/* Header com Filtros */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Histórico de Transações
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Filtro por Tipo */}
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange({ type: e.target.value as CreditTransactionType || undefined })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>

            {/* Filtro por Status */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value as CreditTransactionStatus || undefined })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela / Lista */}
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-gray-400 text-2xl">receipt_long</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma transação encontrada
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Quando você realizar transações, elas aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-sm font-semibold text-gray-900 dark:text-white pb-3">Data</th>
                    <th className="text-left text-sm font-semibold text-gray-900 dark:text-white pb-3">Tipo</th>
                    <th className="text-left text-sm font-semibold text-gray-900 dark:text-white pb-3">Descrição</th>
                    <th className="text-right text-sm font-semibold text-gray-900 dark:text-white pb-3">Créditos</th>
                    <th className="text-center text-sm font-semibold text-gray-900 dark:text-white pb-3">Status</th>
                    <th className="text-center text-sm font-semibold text-gray-900 dark:text-white pb-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatTransactionDate(transaction.createdAt)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className={`material-icons text-lg mr-2 ${TYPE_CONFIG[transaction.type].color}`}>
                            {TYPE_CONFIG[transaction.type].icon}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {TYPE_CONFIG[transaction.type].label}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="py-4 text-right text-sm">
                        {renderTransactionAmount(transaction)}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${STATUS_CONFIG[transaction.status].bg} ${STATUS_CONFIG[transaction.status].color}
                        `}>
                          <span className="material-icons text-xs mr-1">
                            {STATUS_CONFIG[transaction.status].icon}
                          </span>
                          {STATUS_CONFIG[transaction.status].label}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => setSelectedTransaction(
                            selectedTransaction === transaction.id ? null : transaction.id
                          )}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className={`material-icons text-lg mr-2 ${TYPE_CONFIG[transaction.type].color}`}>
                        {TYPE_CONFIG[transaction.type].icon}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {TYPE_CONFIG[transaction.type].label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {formatTransactionDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderTransactionAmount(transaction)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {transaction.description}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${STATUS_CONFIG[transaction.status].bg} ${STATUS_CONFIG[transaction.status].color}
                    `}>
                      <span className="material-icons text-xs mr-1">
                        {STATUS_CONFIG[transaction.status].icon}
                      </span>
                      {STATUS_CONFIG[transaction.status].label}
                    </span>
                    
                    <button
                      onClick={() => setSelectedTransaction(
                        selectedTransaction === transaction.id ? null : transaction.id
                      )}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      {selectedTransaction === transaction.id ? 'Ocultar' : 'Detalhes'}
                    </button>
                  </div>

                  {/* Detalhes Expandidos */}
                  {selectedTransaction === transaction.id && transaction.metadata && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Detalhes da Transação:
                      </h5>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {Object.entries(transaction.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} transações
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {/* Números das páginas */}
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pageNum = i + Math.max(1, pagination.currentPage - 2);
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
