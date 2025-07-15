// Tipos base para responses da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Tipos para paginação
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | number | boolean>;
}

// Tipos para filtros e ordenação
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
  value: string | number | boolean | (string | number)[];
}

export interface SearchConfig {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
}

// Tipos para uploads
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  hash?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Tipos para estatísticas e métricas
export interface StatsResponse {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  trend?: {
    data: number[];
    labels: string[];
  };
  icon?: string;
  color?: string;
}

export interface MetricsResponse {
  period: string;
  data: {
    [key: string]: number | string;
  };
  summary: {
    total: number;
    average: number;
    growth: number;
  };
}

// Tipos para logs e auditoria
export interface LogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
}

export interface AuditTrail {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  userId: string;
  userName: string;
  timestamp: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Tipos para notificações
export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
  autoHide?: boolean;
  duration?: number;
}

export interface NotificationAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
}

// Tipos para configurações
export interface AppConfig {
  features: FeatureFlags;
  limits: SystemLimits;
  integrations: IntegrationConfig;
  ui: UIConfig;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface SystemLimits {
  maxFileSize: number;
  maxFilesPerUpload: number;
  maxRequestsPerMinute: number;
  maxCreditsPerDay: number;
}

export interface IntegrationConfig {
  [service: string]: {
    enabled: boolean;
    config: Record<string, unknown>;
  };
}

export interface UIConfig {
  theme: string;
  language: string;
  dateFormat: string;
  timezone: string;
}

// Tipos para cache
export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  entries: number;
  hitRate: number;
}

// Tipos para interceptadores
export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onRequestError?: (error: Error) => Error | Promise<Error>;
}

export interface ResponseInterceptor {
  onResponse?: (response: ResponseData) => ResponseData | Promise<ResponseData>;
  onResponseError?: (error: Error) => Error | Promise<Error>;
}

export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  timeout?: number;
  retry?: boolean;
}

export interface ResponseData {
  status: number;
  headers: Record<string, string>;
  data: unknown;
}

// Tipos para sincronização
export interface SyncStatus {
  lastSync: string;
  status: 'idle' | 'syncing' | 'error' | 'success';
  progress?: number;
  error?: string;
}

export interface SyncConfig {
  enabled: boolean;
  interval: number;
  retryAttempts: number;
  batchSize: number;
}

export interface SyncResult {
  success: boolean;
  processed: number;
  errors: number;
  created: number;
  updated: number;
  deleted: number;
  changes: Record<string, unknown>;
  duration: number;
}

// Tipos para configuração de tabelas
export interface TableColumn {
  key: string;
  title: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown) => string;
}

// Enum para HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// Enum para códigos de erro
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

// Type guards
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as ApiError).success === false
  );
}

export function isApiResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response &&
    (response as ApiResponse<T>).success === true
  );
}

export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    isApiResponse(response) &&
    'meta' in response &&
    typeof (response as PaginatedResponse<T>).meta === 'object'
  );
}
