// Tipos para o painel administrativo
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'pending';
  plan: string;
  credits: number;
  extraCredits: number;
  createdAt: string;
  lastLogin: string;
  totalProducts: number;
  totalPersonas: number;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  totalCreditsUsed: number;
  totalExtraCreditsUsed: number;
  totalProducts: number;
  totalPersonas: number;
  revenueGrowth: number;
  userGrowth: number;
  creditsGrowth: number;
}

export interface AdminChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
}

export interface AdminActivity {
  id: string;
  type: 'user_created' | 'user_suspended' | 'plan_upgraded' | 'payment_received' | 'content_generated';
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'users' | 'revenue' | 'usage' | 'activity';
  format: 'excel' | 'pdf';
  status: 'generating' | 'ready' | 'failed';
  createdAt: string;
  downloadUrl?: string;
  filters: {
    startDate: string;
    endDate: string;
    userRole?: string;
    planType?: string;
  };
}

export interface AdminTranslation {
  id: string;
  key: string;
  language: string;
  value: string;
  category: string;
  isEdited: boolean;
  lastModified: string;
}

export interface AdminLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isActive: boolean;
  completionPercentage: number;
}

export interface AdminNotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  category: 'auth' | 'billing' | 'system' | 'marketing';
}

export interface AdminIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'payment' | 'email' | 'ai';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSync?: string;
  errorMessage?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

// Filtros para listagens
export interface AdminUserFilters {
  search?: string;
  role?: string;
  status?: string;
  plan?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminReportFilters {
  type?: string;
  status?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface AdminAuditLogFilters {
  action?: string;
  resource?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Estatísticas para gráficos
export interface AdminUserStats {
  period: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  suspendedUsers: number;
}

export interface AdminRevenueStats {
  period: string;
  revenue: number;
  transactions: number;
  averageOrderValue: number;
}

export interface AdminUsageStats {
  period: string;
  creditsUsed: number;
  extraCreditsUsed: number;
  productsGenerated: number;
  personasCreated: number;
}
