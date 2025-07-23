/**
 * @fileoverview Application Constants
 * 
 * Global application constants and configuration values.
 * 
 * @version 1.0.0
 * @domain shared
 */

// ================================
// Application Info
// ================================
export const APP_CONFIG = {
  name: 'NeuralContent',
  version: '1.0.0',
  description: 'Neural Content Management Platform',
  author: 'NeuralContent Team',
  support: {
    email: 'support@neuralcontent.com',
    phone: '+1-800-NEURAL',
    website: 'https://neuralcontent.com/support',
  },
} as const;

// ================================
// Environment Configuration
// ================================
export const ENV = {
  NODE_ENV: 'development', // Will be configured at build time
  IS_DEVELOPMENT: true,
  IS_PRODUCTION: false,
  IS_TEST: false,
} as const;

// ================================
// Default Configurations
// ================================
export const DEFAULTS = {
  // Pagination
  PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
  
  // Language & Localization
  LANGUAGE: 'en',
  TIMEZONE: 'UTC',
  CURRENCY: 'USD',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: '24h',
  
  // UI
  THEME: 'light',
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 60,
  
  // Timeouts & Intervals
  REQUEST_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  AUTO_LOGOUT_TIME: 3600000, // 1 hour
  SESSION_REFRESH_INTERVAL: 900000, // 15 minutes
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_COUNT: 5,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  
  // Cache
  CACHE_TTL: 300000, // 5 minutes
  LOCAL_STORAGE_TTL: 86400000, // 24 hours
  
  // Validation
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  
  // Rate Limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 900000, // 15 minutes
} as const;

// ================================
// Feature Flags
// ================================
export const FEATURES = {
  // Authentication
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_TWO_FACTOR: true,
  ENABLE_BIOMETRIC_LOGIN: false,
  ENABLE_SSO: true,
  
  // UI Features
  ENABLE_DARK_MODE: true,
  ENABLE_RTL_SUPPORT: false,
  ENABLE_ACCESSIBILITY: true,
  ENABLE_ANIMATIONS: true,
  
  // Advanced Features
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PWA: false,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_REPORTING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Admin Features
  ENABLE_ADMIN_PANEL: true,
  ENABLE_USER_MANAGEMENT: true,
  ENABLE_SYSTEM_MONITORING: true,
  
  // Experimental
  ENABLE_AI_FEATURES: false,
  ENABLE_BETA_FEATURES: false,
} as const;

// ================================
// URL and Routes
// ================================
export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  
  // Auth Routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  LOGOUT: '/auth/logout',
  
  // App Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin Routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ANALYTICS: '/admin/analytics',
  
  // Error Routes
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
} as const;

// ================================
// Storage Keys
// ================================
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id',
  
  // User Preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  TIMEZONE: 'timezone',
  SIDEBAR_STATE: 'sidebar_state',
  
  // Application State
  LAST_ROUTE: 'last_route',
  FORM_DRAFT: 'form_draft',
  SEARCH_HISTORY: 'search_history',
  
  // Cache
  API_CACHE: 'api_cache',
  USER_CACHE: 'user_cache',
  
  // Analytics
  ANALYTICS_ID: 'analytics_id',
  SESSION_START: 'session_start',
} as const;

// ================================
// Event Names
// ================================
export const EVENTS = {
  // Authentication Events
  LOGIN_SUCCESS: 'auth:login:success',
  LOGIN_FAILURE: 'auth:login:failure',
  LOGOUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session:expired',
  TOKEN_REFRESHED: 'auth:token:refreshed',
  
  // User Events
  USER_UPDATED: 'user:updated',
  PREFERENCES_CHANGED: 'user:preferences:changed',
  
  // UI Events
  THEME_CHANGED: 'ui:theme:changed',
  SIDEBAR_TOGGLED: 'ui:sidebar:toggled',
  MODAL_OPENED: 'ui:modal:opened',
  MODAL_CLOSED: 'ui:modal:closed',
  
  // Data Events
  DATA_LOADED: 'data:loaded',
  DATA_ERROR: 'data:error',
  DATA_UPDATED: 'data:updated',
  
  // System Events
  APP_INITIALIZED: 'app:initialized',
  ERROR_OCCURRED: 'app:error',
  OFFLINE: 'app:offline',
  ONLINE: 'app:online',
} as const;

// ================================
// Regex Patterns
// ================================
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  
  // Specific validations
  CREDIT_CARD: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
} as const;

// ================================
// HTTP Status Messages
// ================================
export const HTTP_STATUS_MESSAGES = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
} as const;

// ================================
// Query Keys (for React Query)
// ================================
export const QUERY_KEYS = {
  // User
  USER: 'user',
  USER_PROFILE: 'user-profile',
  USER_PREFERENCES: 'user-preferences',
  
  // Auth
  AUTH_SESSION: 'auth-session',
  AUTH_PERMISSIONS: 'auth-permissions',
  
  // Admin
  ADMIN_USERS: 'admin-users',
  ADMIN_ANALYTICS: 'admin-analytics',
  
  // System
  SYSTEM_CONFIG: 'system-config',
  FEATURE_FLAGS: 'feature-flags',
} as const;
