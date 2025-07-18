// ============================================================================
// NEURAL CONTENT - SERVIÇO DE CRÉDITOS
// ============================================================================

/**
 * Serviço para gerenciamento de créditos
 * 
 * @description Fornece todas as funcionalidades de créditos integradas
 * com a API do backend NestJS
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

import {
  CreditBalance,
  CreditTransaction,
  CreditPackage,
  ValidateCreditsDto,
  ValidateCreditsResponseDto,
  ConsumeCreditsDto,
  ConsumeCreditsResponseDto,
  PurchaseCreditsDto,
  PurchaseCreditsResponseDto,
  CreditHistoryFilters,
  PaginatedResponse,
  ApiResponse,
  CreditStats,
  CreditConsumptionChart,
  CreditServiceType
} from '@/types/credits.types';

// ============================================================================
// CONFIGURAÇÃO DA API
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const CREDITS_ENDPOINT = '/credits';

/**
 * Cliente HTTP com configurações base
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: Record<string, string> = { ...this.defaultHeaders as Record<string, string> };
    
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }
}

// ============================================================================
// SERVIÇO DE CRÉDITOS
// ============================================================================

export class CreditsService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  // ============================================================================
  // MÉTODOS DE SALDO
  // ============================================================================

  /**
   * Obtém o saldo atual de créditos do usuário
   */
  async getBalance(): Promise<ApiResponse<CreditBalance>> {
    return this.apiClient.request<CreditBalance>(`${CREDITS_ENDPOINT}/my-balance`);
  }

  /**
   * Valida se o usuário tem créditos suficientes
   */
  async validateCredits(data: Omit<ValidateCreditsDto, 'userId'>): Promise<ApiResponse<ValidateCreditsResponseDto>> {
    return this.apiClient.request<ValidateCreditsResponseDto>(
      `${CREDITS_ENDPOINT}/my-validate`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // MÉTODOS DE CONSUMO
  // ============================================================================

  /**
   * Consome créditos do usuário
   */
  async consumeCredits(data: Omit<ConsumeCreditsDto, 'userId'>): Promise<ApiResponse<ConsumeCreditsResponseDto>> {
    return this.apiClient.request<ConsumeCreditsResponseDto>(
      `${CREDITS_ENDPOINT}/my-consume`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // MÉTODOS DE HISTÓRICO
  // ============================================================================

  /**
   * Obtém o histórico de transações do usuário
   */
  async getHistory(
    filters: CreditHistoryFilters = {},
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<CreditTransaction>>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: ((page - 1) * limit).toString(),
    });

    // Adicionar filtros aos parâmetros
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.serviceType) params.append('serviceType', filters.serviceType);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
    if (filters.search) params.append('search', filters.search);

    return this.apiClient.request<PaginatedResponse<CreditTransaction>>(
      `${CREDITS_ENDPOINT}/my-history?${params.toString()}`
    );
  }

  // ============================================================================
  // MÉTODOS DE COMPRA
  // ============================================================================

  /**
   * Obtém pacotes de créditos disponíveis
   */
  async getPackages(): Promise<ApiResponse<CreditPackage[]>> {
    return this.apiClient.request<CreditPackage[]>(`${CREDITS_ENDPOINT}/packages`);
  }

  /**
   * Inicia processo de compra de créditos
   */
  async purchaseCredits(data: PurchaseCreditsDto): Promise<ApiResponse<PurchaseCreditsResponseDto>> {
    return this.apiClient.request<PurchaseCreditsResponseDto>(
      `${CREDITS_ENDPOINT}/purchase`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================================================
  // MÉTODOS DE ESTATÍSTICAS
  // ============================================================================

  /**
   * Obtém estatísticas de uso de créditos
   */
  async getStats(period = '30d'): Promise<ApiResponse<CreditStats>> {
    return this.apiClient.request<CreditStats>(
      `${CREDITS_ENDPOINT}/my-stats?period=${period}`
    );
  }

  /**
   * Obtém dados para gráfico de consumo
   */
  async getConsumptionChart(period = '30d'): Promise<ApiResponse<CreditConsumptionChart>> {
    return this.apiClient.request<CreditConsumptionChart>(
      `${CREDITS_ENDPOINT}/my-chart?period=${period}`
    );
  }

  // ============================================================================
  // MÉTODOS UTILITÁRIOS
  // ============================================================================

  /**
   * Formata valor de créditos
   */
  formatCredits(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Formata valor monetário
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }

  /**
   * Calcula desconto percentual
   */
  calculateDiscount(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  /**
   * Verifica se o saldo está baixo
   */
  isLowBalance(balance: number, threshold = 100): boolean {
    return balance < threshold;
  }

  /**
   * Verifica se créditos expirarão em breve
   */
  isExpiringSoon(expirationDate: Date, warningDays = 7): boolean {
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= warningDays && diffDays >= 0;
  }

  /**
   * Obtém cor do status da transação
   */
  getTransactionStatusColor(status: string): string {
    const colors = {
      pending: 'text-yellow-600',
      completed: 'text-green-600',
      failed: 'text-red-600',
      cancelled: 'text-gray-600',
      refunded: 'text-blue-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  }

  /**
   * Obtém ícone do tipo de serviço
   */
  getServiceTypeIcon(serviceType: CreditServiceType): string {
    const icons = {
      [CreditServiceType.EBOOK_GENERATION]: 'book',
      [CreditServiceType.IMAGE_GENERATION]: 'image',
      [CreditServiceType.CONTENT_GENERATION]: 'edit',
      [CreditServiceType.TRANSLATION]: 'translate',
      [CreditServiceType.AUDIO_GENERATION]: 'headphones',
      [CreditServiceType.OTHER]: 'more_horiz',
    };
    return icons[serviceType] || 'help_outline';
  }

  /**
   * Obtém nome amigável do tipo de serviço
   */
  getServiceTypeName(serviceType: CreditServiceType): string {
    const names = {
      [CreditServiceType.EBOOK_GENERATION]: 'Geração de eBook',
      [CreditServiceType.IMAGE_GENERATION]: 'Geração de Imagem',
      [CreditServiceType.CONTENT_GENERATION]: 'Geração de Conteúdo',
      [CreditServiceType.TRANSLATION]: 'Tradução',
      [CreditServiceType.AUDIO_GENERATION]: 'Geração de Áudio',
      [CreditServiceType.OTHER]: 'Outros',
    };
    return names[serviceType] || 'Desconhecido';
  }
}

// ============================================================================
// DADOS MOCK PARA DESENVOLVIMENTO
// ============================================================================

/**
 * Dados mock para desenvolvimento e testes
 */
export const mockCreditsData = {
  balance: {
    userId: 'user-123',
    balance: 1500,
    lastUpdated: new Date(),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
  } as CreditBalance,

  packages: [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para começar',
      credits: 500,
      price: 29.90,
      originalPrice: 39.90,
      discount: 25,
      isPopular: false,
      bonusCredits: 0,
      validityDays: 365,
      features: [
        'Geração de eBooks',
        'Criação de conteúdo',
        'Suporte por email',
      ],
      icon: 'star_outline',
    },
    {
      id: 'professional',
      name: 'Profissional',
      description: 'Para criadores sérios',
      credits: 1500,
      price: 79.90,
      originalPrice: 99.90,
      discount: 20,
      isPopular: true,
      bonusCredits: 200,
      validityDays: 365,
      features: [
        'Tudo do Básico',
        'Geração de imagens',
        'Tradução automática',
        'Suporte prioritário',
      ],
      icon: 'star',
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Para grandes projetos',
      credits: 5000,
      price: 199.90,
      originalPrice: 299.90,
      discount: 33,
      isPopular: false,
      bonusCredits: 1000,
      validityDays: 365,
      features: [
        'Tudo do Profissional',
        'Geração de áudio',
        'API dedicada',
        'Gerente de conta',
      ],
      icon: 'star_rate',
    },
  ] as CreditPackage[],

  transactions: [
    {
      id: 'tx-1',
      userId: 'user-123',
      type: 'consumption' as any,
      status: 'completed' as any,
      amount: -50,
      description: 'Geração de eBook - "Como Aprender TypeScript"',
      serviceType: CreditServiceType.EBOOK_GENERATION,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'tx-2',
      userId: 'user-123',
      type: 'purchase' as any,
      status: 'completed' as any,
      amount: 1500,
      description: 'Compra de pacote Profissional',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ] as CreditTransaction[],
};

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const creditsService = new CreditsService();
