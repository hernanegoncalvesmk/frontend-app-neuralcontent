/**
 * @fileoverview Configuration Constants
 * 
 * Application configuration and constants.
 * 
 * @version 1.0.0
 */

// ================================
// Internationalization Config
// ================================
export const I18N_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'pt', 'es', 'fr'],
  fallbackLanguage: 'en',
  
  languages: [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  ],
} as const;

// ================================
// API Configuration
// ================================
export const API_CONFIG = {
  baseUrl: process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// ================================
// Authentication Configuration
// ================================
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  sessionTimeout: 3600000, // 1 hour
  refreshThreshold: 300000, // 5 minutes before expiry
  
  // OAuth providers
  enabledProviders: ['google', 'facebook', 'github'],
  
  // Password requirements
  passwordMinLength: 8,
  passwordRequirements: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
} as const;

// ================================
// Theme Configuration
// ================================
export const THEME_CONFIG = {
  defaultTheme: 'light',
  supportedThemes: ['light', 'dark', 'auto'],
  storageKey: 'theme',
  
  colors: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
  },
} as const;

// ================================
// UI Configuration
// ================================
export const UI_CONFIG = {
  // Layout
  sidebarWidth: 280,
  sidebarCollapsedWidth: 64,
  headerHeight: 64,
  footerHeight: 60,
  
  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Animation
  transitionDuration: 200,
  
  // Pagination
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  
  // File upload
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
} as const;

// ================================
// Feature Flags
// ================================
export const FEATURES = {
  enableDarkMode: true,
  enableI18n: true,
  enableOfflineMode: false,
  enablePWA: false,
  enableAnalytics: true,
  enableErrorReporting: true,
  enableDevTools: process?.env?.NODE_ENV === 'development',
} as const;

// ================================
// Routes Configuration
// ================================
export const ROUTES = {
  // Public routes
  home: '/',
  about: '/about',
  contact: '/contact',
  
  // Auth routes
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  
  // Protected routes
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  
  // Admin routes
  admin: '/admin',
  adminUsers: '/admin/users',
  adminSettings: '/admin/settings',
} as const;

// ================================
// Validation Configuration
// ================================
export const VALIDATION = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254,
  },
  
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-']+$/,
  },
  
  phone: {
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
  },
} as const;

// ================================
// Cache Configuration
// ================================
export const CACHE_CONFIG = {
  defaultTTL: 300000, // 5 minutes
  longTTL: 3600000, // 1 hour
  shortTTL: 60000, // 1 minute
  
  keys: {
    user: 'user_cache',
    settings: 'settings_cache',
    preferences: 'preferences_cache',
  },
} as const;

// ================================
// Error Messages
// ================================
export const ERROR_MESSAGES = {
  generic: 'An unexpected error occurred',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action',
  forbidden: 'Access forbidden',
  notFound: 'The requested resource was not found',
  validationFailed: 'Validation failed',
  serverError: 'Server error. Please try again later.',
  timeout: 'Request timeout. Please try again.',
} as const;

// ================================
// Success Messages
// ================================
export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully',
  created: 'Created successfully',
  updated: 'Updated successfully',
  deleted: 'Deleted successfully',
  loginSuccess: 'Logged in successfully',
  logoutSuccess: 'Logged out successfully',
  emailSent: 'Email sent successfully',
  passwordChanged: 'Password changed successfully',
} as const;
