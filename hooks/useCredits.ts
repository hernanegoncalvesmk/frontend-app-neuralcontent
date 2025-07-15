// ============================================================================
// NEURAL CONTENT - HOOK DE CRÉDITOS
// ============================================================================

/**
 * Hook personalizado para gerenciamento de créditos
 * 
 * @description Fornece estado e operações para sistema de créditos
 * com cache, loading states e error handling
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CreditBalance,
  CreditTransaction,
  CreditPackage,
  CreditHistoryFilters,
  CreditsPageState,
  CreditAlert,
  CreditStats,
  CreditServiceType,
  PurchaseCreditsDto,
} from '@/types/credits.types';
import { creditsService, mockCreditsData } from '@/services/credits.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface UseCreditsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  useMockData?: boolean;
  initialFilters?: CreditHistoryFilters;
}

interface UseCreditsReturn {
  // Estado
  state: CreditsPageState;
  
  // Dados computados
  stats: CreditStats | null;
  alerts: CreditAlert[];
  
  // Ações
  actions: {
    refreshBalance: () => Promise<void>;
    refreshHistory: () => Promise<void>;
    refreshPackages: () => Promise<void>;
    refreshAll: () => Promise<void>;
    purchasePackage: (packageId: string, paymentMethodId?: string) => Promise<boolean>;
    consumeCredits: (amount: number, serviceType: CreditServiceType, description: string) => Promise<boolean>;
    validateCredits: (amount: number, serviceType: CreditServiceType) => Promise<boolean>;
    setFilters: (filters: CreditHistoryFilters) => void;
    changePage: (page: number) => void;
    dismissAlert: (alertId: string) => void;
  };
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useCredits(options: UseCreditsOptions = {}): UseCreditsReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 segundos
    useMockData = process.env.NODE_ENV === 'development',
    initialFilters = {},
  } = options;

  // ============================================================================
  // ESTADO
  // ============================================================================

  const [state, setState] = useState<CreditsPageState>({
    balance: null,
    transactions: [],
    packages: [],
    filters: initialFilters,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
    loading: {
      balance: false,
      transactions: false,
      packages: false,
      purchase: false,
    },
    alerts: [],
  });

  // ============================================================================
  // FUNÇÕES DE ATUALIZAÇÃO DE ESTADO
  // ============================================================================

  const updateLoadingState = useCallback((key: keyof CreditsPageState['loading'], value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: value,
      },
    }));
  }, []);

  const addAlert = useCallback((alert: Omit<CreditAlert, 'id' | 'timestamp'>) => {
    const newAlert: CreditAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts].slice(0, 5), // Máximo 5 alertas
    }));
  }, []);

  // ============================================================================
  // FUNÇÕES DE CARREGAMENTO DE DADOS
  // ============================================================================

  const refreshBalance = useCallback(async () => {
    updateLoadingState('balance', true);
    
    try {
      if (useMockData) {
        setState(prev => ({ ...prev, balance: mockCreditsData.balance }));
        return;
      }

      const response = await creditsService.getBalance();
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, balance: response.data! }));
        
        // Verificar alertas de saldo baixo
        if (creditsService.isLowBalance(response.data.balance)) {
          addAlert({
            type: 'low_balance',
            title: 'Saldo Baixo',
            message: `Você tem apenas ${creditsService.formatCredits(response.data.balance)} créditos restantes.`,
            severity: 'warning',
          });
        }
        
        // Verificar alertas de expiração
        if (response.data.expirationDate && creditsService.isExpiringSoon(response.data.expirationDate)) {
          addAlert({
            type: 'expiring_soon',
            title: 'Créditos Expirando',
            message: 'Seus créditos expirarão em breve. Considere renovar seu plano.',
            severity: 'warning',
          });
        }
      } else {
        addAlert({
          type: 'low_balance',
          title: 'Erro ao Carregar Saldo',
          message: response.error || 'Não foi possível carregar o saldo atual.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
      addAlert({
        type: 'low_balance',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        severity: 'error',
      });
    } finally {
      updateLoadingState('balance', false);
    }
  }, [useMockData, updateLoadingState, addAlert]);

  const refreshHistory = useCallback(async () => {
    updateLoadingState('transactions', true);
    
    try {
      if (useMockData) {
        setState(prev => ({ 
          ...prev, 
          transactions: mockCreditsData.transactions,
          pagination: { ...prev.pagination, total: mockCreditsData.transactions.length }
        }));
        return;
      }

      const response = await creditsService.getHistory(
        state.filters,
        state.pagination.page,
        state.pagination.limit
      );
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          transactions: response.data!.data,
          pagination: {
            ...prev.pagination,
            total: response.data!.pagination.total,
          },
        }));
      } else {
        addAlert({
          type: 'low_balance',
          title: 'Erro ao Carregar Histórico',
          message: response.error || 'Não foi possível carregar o histórico de transações.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      addAlert({
        type: 'low_balance',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        severity: 'error',
      });
    } finally {
      updateLoadingState('transactions', false);
    }
  }, [useMockData, state.filters, state.pagination.page, state.pagination.limit, updateLoadingState, addAlert]);

  const refreshPackages = useCallback(async () => {
    updateLoadingState('packages', true);
    
    try {
      if (useMockData) {
        setState(prev => ({ ...prev, packages: mockCreditsData.packages }));
        return;
      }

      const response = await creditsService.getPackages();
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, packages: response.data! }));
      } else {
        addAlert({
          type: 'low_balance',
          title: 'Erro ao Carregar Pacotes',
          message: response.error || 'Não foi possível carregar os pacotes disponíveis.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
      addAlert({
        type: 'low_balance',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        severity: 'error',
      });
    } finally {
      updateLoadingState('packages', false);
    }
  }, [useMockData, updateLoadingState, addAlert]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshBalance(),
      refreshHistory(),
      refreshPackages(),
    ]);
  }, [refreshBalance, refreshHistory, refreshPackages]);

  // ============================================================================
  // AÇÕES DE COMPRA E CONSUMO
  // ============================================================================

  const purchasePackage = useCallback(async (packageId: string, paymentMethodId?: string): Promise<boolean> => {
    updateLoadingState('purchase', true);
    
    try {
      if (useMockData) {
        // Simular sucesso para desenvolvimento
        setTimeout(() => {
          addAlert({
            type: 'purchase_success',
            title: 'Compra Realizada',
            message: 'Seus créditos foram adicionados com sucesso!',
            severity: 'success',
          });
          refreshBalance();
        }, 1500);
        return true;
      }

      const purchaseData: PurchaseCreditsDto = {
        packageId,
        paymentMethodId,
      };

      const response = await creditsService.purchaseCredits(purchaseData);
      
      if (response.success && response.data) {
        addAlert({
          type: 'purchase_success',
          title: 'Compra Realizada',
          message: `${creditsService.formatCredits(response.data.credits)} créditos adicionados com sucesso!`,
          severity: 'success',
        });
        
        // Redirecionar para URL de pagamento se necessário
        if (response.data.paymentUrl) {
          window.open(response.data.paymentUrl, '_blank');
        }
        
        // Atualizar saldo
        await refreshBalance();
        return true;
      } else {
        addAlert({
          type: 'purchase_failed',
          title: 'Erro na Compra',
          message: response.error || 'Não foi possível processar a compra.',
          severity: 'error',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao comprar pacote:', error);
      addAlert({
        type: 'purchase_failed',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        severity: 'error',
      });
      return false;
    } finally {
      updateLoadingState('purchase', false);
    }
  }, [useMockData, updateLoadingState, addAlert, refreshBalance]);

  const consumeCredits = useCallback(async (
    amount: number,
    serviceType: CreditServiceType,
    description: string
  ): Promise<boolean> => {
    try {
      if (useMockData) {
        // Simular consumo para desenvolvimento
        setState(prev => ({
          ...prev,
          balance: prev.balance ? { ...prev.balance, balance: prev.balance.balance - amount } : null,
        }));
        return true;
      }

      const response = await creditsService.consumeCredits({
        amount,
        serviceType,
        description,
      });
      
      if (response.success) {
        await refreshBalance();
        await refreshHistory();
        return true;
      } else {
        addAlert({
          type: 'low_balance',
          title: 'Erro ao Consumir Créditos',
          message: response.error || 'Não foi possível consumir os créditos.',
          severity: 'error',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao consumir créditos:', error);
      addAlert({
        type: 'low_balance',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor.',
        severity: 'error',
      });
      return false;
    }
  }, [useMockData, addAlert, refreshBalance, refreshHistory]);

  const validateCredits = useCallback(async (
    amount: number,
    serviceType: CreditServiceType
  ): Promise<boolean> => {
    try {
      if (useMockData) {
        return (state.balance?.balance || 0) >= amount;
      }

      const response = await creditsService.validateCredits({
        amount,
        serviceType,
      });
      
      return response.success && response.data ? response.data.valid : false;
    } catch (error) {
      console.error('Erro ao validar créditos:', error);
      return false;
    }
  }, [useMockData, state.balance?.balance]);

  // ============================================================================
  // AÇÕES DE NAVEGAÇÃO E FILTROS
  // ============================================================================

  const setFilters = useCallback((filters: CreditHistoryFilters) => {
    setState(prev => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, page: 1 }, // Reset para primeira página
    }));
  }, []);

  const changePage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      ),
    }));
  }, []);

  // ============================================================================
  // ESTATÍSTICAS COMPUTADAS
  // ============================================================================

  const stats = useMemo((): CreditStats | null => {
    if (!state.balance || state.transactions.length === 0) {
      return null;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisMonthTransactions = state.transactions.filter(tx => 
      new Date(tx.createdAt) >= thirtyDaysAgo && tx.amount < 0
    );
    
    const usedThisMonth = thisMonthTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const averageDaily = usedThisMonth / 30;
    const projectedMonthly = averageDaily * 30;
    
    // Encontrar serviço mais usado
    const serviceUsage = thisMonthTransactions.reduce((acc, tx) => {
      if (tx.serviceType) {
        acc[tx.serviceType] = (acc[tx.serviceType] || 0) + Math.abs(tx.amount);
      }
      return acc;
    }, {} as Record<CreditServiceType, number>);
    
    const mostUsedService = Object.entries(serviceUsage).reduce((a, b) => 
      serviceUsage[a[0] as CreditServiceType] > serviceUsage[b[0] as CreditServiceType] ? a : b
    )?.[0] as CreditServiceType;
    
    // Calcular créditos expirando
    const expiringCredits = state.balance.expirationDate && 
      creditsService.isExpiringSoon(state.balance.expirationDate) 
        ? state.balance.balance 
        : 0;
    
    const daysUntilExpiration = state.balance.expirationDate 
      ? Math.ceil((state.balance.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    return {
      totalCredits: state.balance.balance,
      usedThisMonth,
      averageDaily,
      projectedMonthly,
      mostUsedService: mostUsedService || CreditServiceType.OTHER,
      expiringCredits,
      daysUntilExpiration,
    };
  }, [state.balance, state.transactions]);

  // ============================================================================
  // EFEITOS
  // ============================================================================

  // Carregamento inicial
  useEffect(() => {
    refreshAll();
  }, []);

  // Atualizar histórico quando filtros ou página mudam
  useEffect(() => {
    refreshHistory();
  }, [state.filters, state.pagination.page]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshBalance();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshBalance]);

  // ============================================================================
  // RETORNO
  // ============================================================================

  return {
    state,
    stats,
    alerts: state.alerts.filter(alert => !alert.dismissed),
    actions: {
      refreshBalance,
      refreshHistory,
      refreshPackages,
      refreshAll,
      purchasePackage,
      consumeCredits,
      validateCredits,
      setFilters,
      changePage,
      dismissAlert,
    },
  };
}
