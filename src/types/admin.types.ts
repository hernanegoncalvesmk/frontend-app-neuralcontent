// Admin Types - Temporary basic types for build compatibility

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminMetrics {
  users: number;
  revenue: number;
  growth: number;
  activeUsers: number;
}

export interface AdminChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export interface AdminActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
}

export interface AdminReport {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  data: Record<string, any>;
}

export interface AdminTranslation {
  id: string;
  key: string;
  language: string;
  value: string;
  context?: string;
}

export interface AdminLanguage {
  code: string;
  name: string;
  nativeName: string;
  isEnabled: boolean;
  completeness: number;
}

export interface AdminNotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables: string[];
}

export interface AdminIntegration {
  id: string;
  name: string;
  type: string;
  status: string;
  config: Record<string, any>;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface AdminUserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminReportFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  format?: string;
}

export interface AdminAuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface AdminUserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

export interface AdminRevenueStats {
  period: string;
  revenue: number;
  transactions: number;
  growth: number;
}

export interface AdminUsageStats {
  period: string;
  requests: number;
  users: number;
  features: Record<string, number>;
}
