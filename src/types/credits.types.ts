// ============================================================================
// NEURAL CONTENT - TIPOS DE CRÉDITOS
// ============================================================================

/**
 * Tipos para o sistema de créditos
 * 
 * @description Definições TypeScript para todas as operações de créditos
 * baseadas na API do backend NestJS
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

// ============================================================================
// ENUMS E CONSTANTES
// ============================================================================

/**
 * Tipos de serviços que consomem créditos
 */
export enum CreditServiceType {
  EBOOK_GENERATION = 'ebook_generation',
  IMAGE_GENERATION = 'image_generation',
  CONTENT_GENERATION = 'content_generation',
  TRANSLATION = 'translation',
  AUDIO_GENERATION = 'audio_generation',
  OTHER = 'other'
}

/**
 * Status das transações de crédito
 */
export enum CreditTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

/**
 * Tipos de transação de crédito
 */
export enum CreditTransactionType {
  PURCHASE = 'purchase',
  CONSUMPTION = 'consumption',
  REFUND = 'refund',
  BONUS = 'bonus',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  EXPIRATION = 'expiration'
}

// ============================================================================
// INTERFACES BASE
// ============================================================================

/**
 * Saldo de créditos do usuário
 */
export interface CreditBalance {
  userId: string;
  balance: number;
  lastUpdated: Date;
  expirationDate?: Date;
}

/**
 * Transação de crédito
 */
export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  status: CreditTransactionStatus;
  amount: number;
  description: string;
  serviceType?: CreditServiceType;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Pacote de créditos para compra
 */
export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  isPopular?: boolean;
  bonusCredits?: number;
  validityDays?: number;
  features: string[];
  icon?: string;
}

// ============================================================================
// DTOs PARA API
// ============================================================================

/**
 * DTO para validar créditos
 */
export interface ValidateCreditsDto {
  userId: string;
  amount: number;
  serviceType: CreditServiceType;
}

/**
 * DTO para resposta de validação
 */
export interface ValidateCreditsResponseDto {
  valid: boolean;
  currentBalance: number;
  requiredAmount: number;
  missingAmount?: number;
  message: string;
}

/**
 * DTO para consumir créditos
 */
export interface ConsumeCreditsDto {
  userId: string;
  amount: number;
  serviceType: CreditServiceType;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * DTO para resposta de consumo
 */
export interface ConsumeCreditsResponseDto {
  success: boolean;
  transactionId: string;
  remainingBalance: number;
  message: string;
}

/**
 * DTO para adicionar créditos (admin)
 */
export interface AddCreditsDto {
  userId: string;
  amount: number;
  description: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * DTO para resposta de adição
 */
export interface AddCreditsResponseDto {
  success: boolean;
  transactionId: string;
  newBalance: number;
  message: string;
}

/**
 * DTO para transferir créditos
 */
export interface TransferCreditsDto {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description: string;
}

/**
 * DTO para resposta de transferência
 */
export interface TransferCreditsResponseDto {
  success: boolean;
  transactionId: string;
  fromUserBalance: number;
  toUserBalance: number;
  message: string;
}

/**
 * DTO para compra de créditos
 */
export interface PurchaseCreditsDto {
  packageId: string;
  paymentMethodId?: string;
  couponCode?: string;
}

/**
 * DTO para resposta de compra
 */
export interface PurchaseCreditsResponseDto {
  success: boolean;
  transactionId: string;
  credits: number;
  amount: number;
  paymentUrl?: string;
  message: string;
}

// ============================================================================
// INTERFACES PARA COMPONENTES
// ============================================================================

/**
 * Props para componentes de créditos
 */
export interface CreditCardProps {
  balance: CreditBalance;
  loading?: boolean;
  onPurchase?: () => void;
  onViewHistory?: () => void;
}

/**
 * Props para tabela de histórico
 */
export interface CreditHistoryTableProps {
  transactions: CreditTransaction[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  onFilter?: (filters: CreditHistoryFilters) => void;
}

/**
 * Props para cards de pacotes
 */
export interface CreditPackageCardProps {
  package: CreditPackage;
  loading?: boolean;
  onPurchase: (packageId: string) => void;
}

/**
 * Filtros para histórico
 */
export interface CreditHistoryFilters {
  type?: CreditTransactionType;
  status?: CreditTransactionStatus;
  serviceType?: CreditServiceType;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

/**
 * Estado da página de créditos
 */
export interface CreditsPageState {
  balance: CreditBalance | null;
  transactions: CreditTransaction[];
  packages: CreditPackage[];
  filters: CreditHistoryFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  loading: {
    balance: boolean;
    transactions: boolean;
    packages: boolean;
    purchase: boolean;
  };
  alerts: CreditAlert[];
}

/**
 * Alerta de créditos
 */
export interface CreditAlert {
  id: string;
  type: 'low_balance' | 'expiring_soon' | 'expired' | 'purchase_success' | 'purchase_failed';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  dismissed?: boolean;
}

/**
 * Estatísticas de créditos
 */
export interface CreditStats {
  totalCredits: number;
  usedThisMonth: number;
  averageDaily: number;
  projectedMonthly: number;
  mostUsedService: CreditServiceType;
  expiringCredits: number;
  daysUntilExpiration?: number;
}

/**
 * Dados para gráfico de consumo
 */
export interface CreditConsumptionChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

/**
 * Response padrão da API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Response paginado
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Configurações de créditos
 */
export interface CreditConfig {
  minPurchaseAmount: number;
  maxPurchaseAmount: number;
  defaultExpirationDays: number;
  lowBalanceThreshold: number;
  expirationWarningDays: number;
  serviceCosts: Record<CreditServiceType, number>;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
// Tipos já exportados individualmente acima
