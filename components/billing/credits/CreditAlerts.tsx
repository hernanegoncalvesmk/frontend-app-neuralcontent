// ============================================================================
// NEURAL CONTENT - COMPONENTE DE ALERTAS DE CRÉDITOS
// ============================================================================

/**
 * Componente para exibir alertas e notificações relacionadas aos créditos
 * 
 * @description Sistema de alertas inteligente que monitora saldo baixo,
 * créditos próximos ao vencimento e sugestões de compra
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState } from 'react';
import { CreditBalance } from '@/types/credits.types';
import { creditsService } from '@/services/credits.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface CreditAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
  priority: number; // 1 = alta, 2 = média, 3 = baixa
}

interface CreditAlertsProps {
  balance: CreditBalance;
  lastUsage?: {
    amount: number;
    date: Date;
  };
  onPurchaseCredits?: () => void;
  onDismissAlert?: (alertId: string) => void;
  className?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function CreditAlerts({
  balance,
  lastUsage,
  onPurchaseCredits,
  onDismissAlert,
  className = ''
}: CreditAlertsProps) {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // ============================================================================
  // GERAÇÃO DE ALERTAS
  // ============================================================================

  const generateAlerts = (): CreditAlert[] => {
    const alerts: CreditAlert[] = [];
    const now = new Date();
    
    // Alerta de saldo baixo
    if (balance.balance <= 100) {
      const severity = balance.balance <= 20 ? 'error' : 'warning';
      alerts.push({
        id: 'low-balance',
        type: severity,
        title: balance.balance <= 20 ? 'Saldo Crítico!' : 'Saldo Baixo',
        message: `Você tem apenas ${creditsService.formatCredits(balance.balance)} créditos restantes. ${
          balance.balance <= 20 ? 'Recarregue agora para não interromper seu trabalho.' : 'Considere recarregar em breve.'
        }`,
        action: onPurchaseCredits ? {
          label: 'Comprar Créditos',
          onClick: onPurchaseCredits
        } : undefined,
        dismissible: balance.balance > 20,
        priority: balance.balance <= 20 ? 1 : 2
      });
    }

    // Alerta de expiração próxima
    if (balance.expirationDate) {
      const daysUntilExpiration = Math.ceil(
        (balance.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntilExpiration <= 7 && daysUntilExpiration > 0) {
        alerts.push({
          id: 'expiring-soon',
          type: daysUntilExpiration <= 3 ? 'error' : 'warning',
          title: 'Créditos Expirando',
          message: `Seus créditos expiram em ${daysUntilExpiration} dia${daysUntilExpiration !== 1 ? 's' : ''}. Use-os antes de perder!`,
          action: undefined,
          dismissible: true,
          priority: daysUntilExpiration <= 3 ? 1 : 2
        });
      } else if (daysUntilExpiration <= 0) {
        alerts.push({
          id: 'expired',
          type: 'error',
          title: 'Créditos Expirados',
          message: 'Seus créditos expiraram. Compre um novo pacote para continuar usando nossos serviços.',
          action: onPurchaseCredits ? {
            label: 'Comprar Créditos',
            onClick: onPurchaseCredits
          } : undefined,
          dismissible: false,
          priority: 1
        });
      }
    }

    // Alerta de primeiro uso
    if (balance.balance > 0 && !lastUsage) {
      alerts.push({
        id: 'first-use',
        type: 'info',
        title: 'Comece a Usar seus Créditos!',
        message: `Você tem ${creditsService.formatCredits(balance.balance)} créditos disponíveis. Que tal começar criando seu primeiro conteúdo?`,
        action: undefined,
        dismissible: true,
        priority: 3
      });
    }

    // Alerta de uso frequente (sugestão de pacote maior)
    if (lastUsage && balance.balance < 500) {
      const daysSinceLastUse = Math.ceil(
        (now.getTime() - lastUsage.date.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastUse <= 1 && lastUsage.amount >= 50) {
        alerts.push({
          id: 'suggest-upgrade',
          type: 'info',
          title: 'Usuário Ativo Detectado!',
          message: 'Você está usando bastante nossos serviços. Considere um pacote maior para economizar!',
          action: onPurchaseCredits ? {
            label: 'Ver Pacotes',
            onClick: onPurchaseCredits
          } : undefined,
          dismissible: true,
          priority: 3
        });
      }
    }

    // Sucesso - saldo recarregado recentemente
    const lastUpdated = new Date(balance.lastUpdated);
    const hoursAgo = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo <= 1 && balance.balance >= 1000) {
      alerts.push({
        id: 'purchase-success',
        type: 'success',
        title: 'Créditos Adicionados!',
        message: `Parabéns! Seus créditos foram adicionados com sucesso. Você agora tem ${creditsService.formatCredits(balance.balance)} créditos.`,
        action: undefined,
        dismissible: true,
        priority: 2
      });
    }

    return alerts
      .filter(alert => !dismissedAlerts.has(alert.id))
      .sort((a, b) => a.priority - b.priority);
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
    onDismissAlert?.(alertId);
  };

  // ============================================================================
  // CONFIGURAÇÃO VISUAL
  // ============================================================================

  const getAlertConfig = (type: CreditAlert['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'error',
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: 'warning',
          iconColor: 'text-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'info',
          iconColor: 'text-blue-500'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: 'check_circle',
          iconColor: 'text-green-500'
        };
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const alerts = generateAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {alerts.map((alert) => {
        const config = getAlertConfig(alert.type);
        
        return (
          <div
            key={alert.id}
            className={`
              relative rounded-lg border p-4 shadow-sm transition-all duration-300
              ${config.bg} ${config.border}
            `}
          >
            <div className="flex items-start">
              {/* Ícone */}
              <div className="flex-shrink-0">
                <span className={`material-icons ${config.iconColor} text-xl`}>
                  {config.icon}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="ml-3 flex-1">
                <h4 className={`text-sm font-semibold ${config.text} mb-1`}>
                  {alert.title}
                </h4>
                <p className={`text-sm ${config.text} opacity-90`}>
                  {alert.message}
                </p>

                {/* Ação */}
                {alert.action && (
                  <div className="mt-3">
                    <button
                      onClick={alert.action.onClick}
                      className={`
                        inline-flex items-center px-3 py-2 border border-transparent text-sm 
                        font-medium rounded-md shadow-sm transition-colors duration-200
                        ${alert.type === 'error' 
                          ? 'text-white bg-red-600 hover:bg-red-700' 
                          : alert.type === 'warning'
                          ? 'text-white bg-yellow-600 hover:bg-yellow-700'
                          : 'text-white bg-blue-600 hover:bg-blue-700'
                        }
                      `}
                    >
                      <span className="material-icons text-sm mr-2">
                        {alert.type === 'error' || alert.type === 'warning' ? 'add_shopping_cart' : 'arrow_forward'}
                      </span>
                      {alert.action.label}
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de Fechar */}
              {alert.dismissible && (
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className={`
                      inline-flex rounded-md p-1.5 transition-colors duration-200
                      ${config.text} hover:bg-black hover:bg-opacity-10 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                    `}
                  >
                    <span className="sr-only">Fechar</span>
                    <span className="material-icons text-lg">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* Indicador de Prioridade */}
            {alert.priority === 1 && (
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-600 rounded-l-lg"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
