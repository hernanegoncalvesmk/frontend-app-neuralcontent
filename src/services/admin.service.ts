import { 
  AdminUser, 
  AdminMetrics, 
  AdminChartData, 
  AdminActivity, 
  AdminReport,
  AdminTranslation,
  AdminLanguage,
  AdminNotificationTemplate,
  AdminIntegration,
  AdminAuditLog,
  AdminUserFilters,
  AdminReportFilters,
  AdminAuditLogFilters,
  AdminUserStats,
  AdminRevenueStats,
  AdminUsageStats
// Temporary basic types for build compatibility
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Admin Service - Gestão administrativa
 * 
 * Cache Strategy:
 * - Métricas e estatísticas: Cache por 2 minutos (dados dinâmicos)
 * - Usuários e listas: Cache por 5 minutos (dados semi-estáticos)
 * - Configurações: Cache por 10 minutos (dados estáticos)
 */
class AdminService {
  // Cache TTL específico para diferentes tipos de dados
  private readonly METRICS_CACHE_TTL = 2 * 60 * 1000; // 2 minutos
  private readonly USERS_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly CONFIG_CACHE_TTL = 10 * 60 * 1000; // 10 minutos
  private readonly baseURL = '/admin';

  constructor() {
    // Base service implementation
  }

  // Basic request method
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    const data = await response.json();
    return data;
  }

  /**
   * Sobrescreve o método de cache para usar TTL específico do admin
   */
  private setCacheWithTTL<T>(key: string, data: ApiResponse<T>, ttl: number): void {
    this.setCache(key, data, ttl);
  }

  /**
   * Invalida cache específico do domínio admin
   */
  private invalidateAdminCache(pattern?: string): void {
    if (pattern) {
      this.clearCacheByPattern(`/admin${pattern}`);
    } else {
      this.clearCacheByPattern('/admin');
    }
  }

  // === DASHBOARD E MÉTRICAS ===
  async getMetrics(): Promise<AdminMetrics> {
    return this.request<AdminMetrics>('/metrics');
  }

  async getChartData(type: 'users' | 'revenue' | 'usage', period: string = '7d'): Promise<AdminChartData> {
    return this.request<AdminChartData>(`/charts/${type}?period=${period}`);
  }

  async getActivities(limit: number = 10): Promise<AdminActivity[]> {
    return this.request<AdminActivity[]>(`/activities?limit=${limit}`);
  }

  async getUserStats(period: string = '7d'): Promise<AdminUserStats[]> {
    return this.request<AdminUserStats[]>(`/stats/users?period=${period}`);
  }

  async getRevenueStats(period: string = '7d'): Promise<AdminRevenueStats[]> {
    return this.request<AdminRevenueStats[]>(`/stats/revenue?period=${period}`);
  }

  async getUsageStats(period: string = '7d'): Promise<AdminUsageStats[]> {
    return this.request<AdminUsageStats[]>(`/stats/usage?period=${period}`);
  }

  // === GESTÃO DE USUÁRIOS ===
  async getUsers(filters: AdminUserFilters = {}, page: number = 1, limit: number = 20): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value != null))
    });

    return this.request<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/users?${queryParams}`);
  }

  async getUser(userId: string): Promise<AdminUser> {
    return this.request<AdminUser>(`/users/${userId}`);
  }

  async updateUser(userId: string, data: Partial<AdminUser>): Promise<AdminUser> {
    return this.request<AdminUser>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async suspendUser(userId: string, reason?: string): Promise<void> {
    return this.request<void>(`/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async activateUser(userId: string): Promise<void> {
    return this.request<void>(`/users/${userId}/activate`, {
      method: 'POST',
    });
  }

  async bulkUpdateUsers(userIds: string[], action: 'suspend' | 'activate' | 'upgrade', data?: any): Promise<void> {
    return this.request<void>('/users/bulk', {
      method: 'POST',
      body: JSON.stringify({ userIds, action, data }),
    });
  }

  async getUserActivity(userId: string): Promise<AdminActivity[]> {
    return this.request<AdminActivity[]>(`/users/${userId}/activity`);
  }

  // === RELATÓRIOS ===
  async getReports(filters: AdminReportFilters = {}): Promise<AdminReport[]> {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, value]) => value != null))
    );

    return this.request<AdminReport[]>(`/reports?${queryParams}`);
  }

  async generateReport(type: string, format: string, filters: any): Promise<AdminReport> {
    return this.request<AdminReport>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, format, filters }),
    });
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/reports/${reportId}/download`);
    return response.blob();
  }

  // === TRADUÇÕES ===
  async getLanguages(): Promise<AdminLanguage[]> {
    return this.request<AdminLanguage[]>('/translations/languages');
  }

  async getTranslations(language: string, category?: string): Promise<AdminTranslation[]> {
    const queryParams = new URLSearchParams({ language });
    if (category) queryParams.append('category', category);
    
    return this.request<AdminTranslation[]>(`/translations?${queryParams}`);
  }

  async updateTranslation(translationId: string, value: string): Promise<AdminTranslation> {
    return this.request<AdminTranslation>(`/translations/${translationId}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async addLanguage(language: AdminLanguage): Promise<AdminLanguage> {
    return this.request<AdminLanguage>('/translations/languages', {
      method: 'POST',
      body: JSON.stringify(language),
    });
  }

  async translateWithAI(language: string, keys: string[]): Promise<{ [key: string]: string }> {
    return this.request<{ [key: string]: string }>('/translations/ai-translate', {
      method: 'POST',
      body: JSON.stringify({ language, keys }),
    });
  }

  // === INTEGRAÇÕES ===
  async getIntegrations(): Promise<AdminIntegration[]> {
    return this.request<AdminIntegration[]>('/integrations');
  }

  async updateIntegration(integrationId: string, config: any): Promise<AdminIntegration> {
    return this.request<AdminIntegration>(`/integrations/${integrationId}`, {
      method: 'PUT',
      body: JSON.stringify({ config }),
    });
  }

  async testIntegration(integrationId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/integrations/${integrationId}/test`, {
      method: 'POST',
    });
  }

  // === TEMPLATES DE NOTIFICAÇÃO ===
  async getNotificationTemplates(): Promise<AdminNotificationTemplate[]> {
    return this.request<AdminNotificationTemplate[]>('/notifications/templates');
  }

  async updateNotificationTemplate(templateId: string, data: Partial<AdminNotificationTemplate>): Promise<AdminNotificationTemplate> {
    return this.request<AdminNotificationTemplate>(`/notifications/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async testNotificationTemplate(templateId: string, recipient: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/notifications/templates/${templateId}/test`, {
      method: 'POST',
      body: JSON.stringify({ recipient }),
    });
  }

  // === LOGS DE AUDITORIA ===
  async getAuditLogs(filters: AdminAuditLogFilters = {}, page: number = 1, limit: number = 50): Promise<{
    logs: AdminAuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value != null))
    });

    return this.request<{
      logs: AdminAuditLog[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/audit-logs?${queryParams}`);
  }
}

// Instância singleton do serviço
export const adminService = new AdminService();
export default adminService;
