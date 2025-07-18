// ============================================================================
// NEURAL CONTENT - COMPONENTES DE CRÉDITOS
// ============================================================================

/**
 * Exportações centralizadas dos componentes de créditos
 * 
 * @description Facilita a importação dos componentes relacionados ao
 * sistema de gerenciamento de créditos
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

// Componentes principais
export { default as CreditBalanceCard } from './CreditBalanceCard';
export { default as CreditPackageCard } from './CreditPackageCard';
export { default as CreditHistoryTable } from './CreditHistoryTable';
export { default as CreditAlerts } from './CreditAlerts';

// Tipos relacionados (re-export)
export type {
  CreditBalance,
  CreditTransaction,
  CreditPackage,
  CreditTransactionType,
  CreditTransactionStatus,
  CreditServiceType,
  CreditHistoryFilters
} from '@/types/credits.types';
