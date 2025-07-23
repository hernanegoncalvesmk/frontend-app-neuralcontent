/**
 * @fileoverview API Types
 * 
 * Common type definitions for API communication and response handling.
 * 
 * @version 1.0.0
 * @domain shared
 */

// ================================
// Request/Response Base Types
// ================================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
  timestamp: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  field?: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  stack?: string;
  success?: boolean; // Add optional success property
  errors?: ValidationError[]; // Add errors property
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

// ================================
// Request Types
// ================================

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  validateStatus?: (status: number) => boolean;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: ResponseMeta;
}

// ================================
// HTTP Status Types
// ================================

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

// ================================
// Request Context Types
// ================================

export interface RequestContext {
  userId?: string;
  userRole?: string;
  sessionId?: string;
  requestId: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
  correlationId?: string;
}

export interface ApiRequestOptions {
  skipAuth?: boolean;
  skipValidation?: boolean;
  skipErrorHandling?: boolean;
  retryConfig?: RetryConfig;
  cacheConfig?: CacheConfig;
  context?: RequestContext;
}

export interface RetryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
  retryCondition?: (error: ApiError) => boolean;
}

export interface CacheConfig {
  ttl: number;
  key?: string;
  tags?: string[];
  skipCache?: boolean;
  refreshCache?: boolean;
}

// ================================
// File Upload Types
// ================================

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedAt: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  timeRemaining?: number;
}

// ================================
// Webhook Types
// ================================

export interface WebhookPayload<T = any> {
  event: string;
  data: T;
  timestamp: string;
  source: string;
  version: string;
  signature?: string;
}

export interface WebhookResponse {
  received: boolean;
  processed: boolean;
  message?: string;
  errors?: string[];
}
