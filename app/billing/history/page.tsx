"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  invoiceId?: string;
}

interface FilterOptions {
  type: string;
  status: string;
  dateRange: string;
}

export default function BillingHistoryPage() {
  const { t } = useTranslation('billing');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'purchase',
        amount: 1000,
        description: 'Pacote Premium - 1000 créditos',
        date: '2025-07-15T10:30:00Z',
        status: 'completed',
        paymentMethod: 'Cartão de Crédito **** 1234',
        invoiceId: 'INV-001'
      },
      {
        id: '2',
        type: 'usage',
        amount: -150,
        description: 'Geração de conteúdo - Post Instagram',
        date: '2025-07-14T14:20:00Z',
        status: 'completed'
      },
      {
        id: '3',
        type: 'bonus',
        amount: 200,
        description: 'Bônus de boas-vindas',
        date: '2025-07-10T09:15:00Z',
        status: 'completed'
      },
      {
        id: '4',
        type: 'purchase',
        amount: 500,
        description: 'Pacote Básico - 500 créditos',
        date: '2025-07-08T16:45:00Z',
        status: 'completed',
        paymentMethod: 'PIX',
        invoiceId: 'INV-002'
      },
      {
        id: '5',
        type: 'usage',
        amount: -75,
        description: 'Criação de persona - Empreendedor Digital',
        date: '2025-07-07T11:30:00Z',
        status: 'completed'
      }
    ];
    
    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return 'shopping_cart';
      case 'usage': return 'remove_circle';
      case 'refund': return 'undo';
      case 'bonus': return 'card_giftcard';
      default: return 'info';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'usage': return 'text-red-600 bg-red-100';
      case 'refund': return 'text-blue-600 bg-blue-100';
      case 'bonus': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice: ${invoiceId}`);
    // Implement invoice download logic
  };

  const exportData = () => {
    console.log('Exporting billing history...');
    // Implement CSV/PDF export logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('billingHistory.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('billingHistory.description')}
          </p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <span className="material-icons mr-2 text-sm">download</span>
          {t('billingHistory.export')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder={t('billingHistory.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t('billingHistory.filters.allTypes')}</option>
            <option value="purchase">{t('billingHistory.filters.purchases')}</option>
            <option value="usage">{t('billingHistory.filters.usage')}</option>
            <option value="bonus">{t('billingHistory.filters.bonus')}</option>
            <option value="refund">{t('billingHistory.filters.refunds')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t('billingHistory.filters.allStatus')}</option>
            <option value="completed">{t('billingHistory.filters.completed')}</option>
            <option value="pending">{t('billingHistory.filters.pending')}</option>
            <option value="failed">{t('billingHistory.filters.failed')}</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{t('billingHistory.filters.allTime')}</option>
            <option value="7days">{t('billingHistory.filters.last7Days')}</option>
            <option value="30days">{t('billingHistory.filters.last30Days')}</option>
            <option value="90days">{t('billingHistory.filters.last90Days')}</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.transaction')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('billingHistory.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                        <span className="material-icons text-sm">
                          {getTypeIcon(transaction.type)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </div>
                        {transaction.paymentMethod && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {t(`billingHistory.types.${transaction.type}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} créditos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {t(`billingHistory.status.${transaction.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {transaction.invoiceId ? (
                      <button
                        onClick={() => downloadInvoice(transaction.invoiceId!)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        <span className="material-icons mr-1 text-sm">download</span>
                        {t('billingHistory.downloadInvoice')}
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-gray-400 text-6xl mb-4">receipt_long</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('billingHistory.noTransactions')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('billingHistory.noTransactionsDescription')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
