/**
 * @fileoverview API Constants
 * 
 * Constants related to API configuration, endpoints, and communication.
 * 
 * @version 1.0.0
 * @domain shared
 */

// ================================
// API Configuration
// ================================
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api/v1', // Will be configured per environment
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CONCURRENT_REQUESTS: 10,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Auth Headers
  AUTH_HEADER: 'Authorization',
  AUTH_PREFIX: 'Bearer',
  SESSION_HEADER: 'X-Session-ID',
  REQUEST_ID_HEADER: 'X-Request-ID',
} as const;

// ================================
// API Endpoints
// ================================
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHECK_EMAIL: '/auth/check-email',
    
    // Social Login
    GOOGLE_LOGIN: '/auth/google',
    FACEBOOK_LOGIN: '/auth/facebook',
    GITHUB_LOGIN: '/auth/github',
    
    // Two Factor
    ENABLE_2FA: '/auth/2fa/enable',
    DISABLE_2FA: '/auth/2fa/disable',
    VERIFY_2FA: '/auth/2fa/verify',
    GENERATE_BACKUP_CODES: '/auth/2fa/backup-codes',
  },
  
  // User Management
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/delete-account',
    PREFERENCES: '/users/preferences',
    SESSIONS: '/users/sessions',
    DEVICES: '/users/devices',
    UPLOAD_AVATAR: '/users/avatar',
    
    // Admin endpoints
    LIST: '/users',
    GET_BY_ID: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    SUSPEND: '/users/:id/suspend',
    ACTIVATE: '/users/:id/activate',
  },
  
  // File Management
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: '/files/:id/download',
    DELETE: '/files/:id',
    LIST: '/files',
    GET_SIGNED_URL: '/files/signed-url',
  },
  
  // System
  SYSTEM: {
    HEALTH: '/health',
    VERSION: '/version',
    CONFIG: '/config',
    STATS: '/stats',
    METRICS: '/metrics',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
    MONITORING: '/admin/monitoring',
  },
} as const;

// ================================
// HTTP Methods
// ================================
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

// ================================
// HTTP Status Codes
// ================================
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ================================
// Content Types
// ================================
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
  TEXT_HTML: 'text/html',
  TEXT_CSV: 'text/csv',
  XML: 'application/xml',
  PDF: 'application/pdf',
  
  // Images
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  IMAGE_GIF: 'image/gif',
  IMAGE_WEBP: 'image/webp',
  IMAGE_SVG: 'image/svg+xml',
} as const;

// ================================
// Request/Response Types
// ================================
export const REQUEST_TYPES = {
  // Request methods
  QUERY: 'query',
  MUTATION: 'mutation',
  
  // Request modes
  CORS: 'cors',
  NO_CORS: 'no-cors',
  SAME_ORIGIN: 'same-origin',
  
  // Credentials
  OMIT: 'omit',
  SAME_ORIGIN_CREDS: 'same-origin',
  INCLUDE: 'include',
  
  // Cache modes
  DEFAULT: 'default',
  NO_CACHE: 'no-cache',
  RELOAD: 'reload',
  FORCE_CACHE: 'force-cache',
  ONLY_IF_CACHED: 'only-if-cached',
} as const;

// ================================
// Error Codes
// ================================
export const API_ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  
  // Authorization Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  RESOURCE_FORBIDDEN: 'RESOURCE_FORBIDDEN',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  VALUE_TOO_LONG: 'VALUE_TOO_LONG',
  VALUE_TOO_SHORT: 'VALUE_TOO_SHORT',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_IN_USE: 'RESOURCE_IN_USE',
  RESOURCE_LIMIT_EXCEEDED: 'RESOURCE_LIMIT_EXCEEDED',
  
  // System Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

// ================================
// Cache Configuration
// ================================
export const CACHE_CONFIG = {
  // Cache keys prefix
  PREFIX: 'neuralcontent_cache_',
  
  // TTL values (in milliseconds)
  TTL: {
    SHORT: 60000, // 1 minute
    MEDIUM: 300000, // 5 minutes
    LONG: 900000, // 15 minutes
    VERY_LONG: 3600000, // 1 hour
    PERSISTENT: 86400000, // 24 hours
  },
  
  // Cache strategies
  STRATEGIES: {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only',
  },
  
  // Cache tags for invalidation
  TAGS: {
    USER: 'user',
    AUTH: 'auth',
    SETTINGS: 'settings',
    FILE: 'file',
    ADMIN: 'admin',
  },
} as const;

// ================================
// Rate Limiting
// ================================
export const RATE_LIMITS = {
  // Authentication endpoints
  LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 900000, // 15 minutes
  },
  
  // Password reset
  PASSWORD_RESET: {
    MAX_ATTEMPTS: 3,
    WINDOW_MS: 3600000, // 1 hour
  },
  
  // General API
  API_REQUESTS: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60000, // 1 minute
  },
  
  // File uploads
  FILE_UPLOAD: {
    MAX_UPLOADS: 10,
    WINDOW_MS: 600000, // 10 minutes
  },
} as const;

// ================================
// Pagination Constants
// ================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [5, 10, 20, 50, 100],
} as const;
