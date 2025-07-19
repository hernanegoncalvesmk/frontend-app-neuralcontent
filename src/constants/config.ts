// Configurações de ambiente
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// URLs da API e serviços
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
} as const;

// Configurações de autenticação
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: 'authToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  USER_DATA_STORAGE_KEY: 'userData',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas em ms
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes do token expirar
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 dias em ms
} as const;

// Configurações de tradução/internacionalização
export const I18N_CONFIG = {
  DEFAULT_LANGUAGE: 'pt-BR',
  FALLBACK_LANGUAGE: 'en-US',
  SUPPORTED_LANGUAGES: [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', isActive: true },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', isActive: true },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸', isActive: true },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷', isActive: true },
  ],
  CACHE_DURATION: 60 * 60 * 1000, // 1 hora
} as const;

// Configurações de tema
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light' as const,
  SUPPORTED_THEMES: ['light', 'dark', 'auto'] as const,
  STORAGE_KEY: 'theme-preference',
} as const;

// Configurações de paginação
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Configurações de upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB em bytes
  MAX_FILES_PER_UPLOAD: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  CHUNK_SIZE: 1024 * 1024, // 1MB por chunk
} as const;

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  AUTO_HIDE_DURATION: 5000, // 5 segundos
  MAX_NOTIFICATIONS: 10,
  POSITION: 'top-right' as const,
  ANIMATION_DURATION: 300,
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  MAX_CACHE_SIZE: 100, // máximo de 100 itens no cache
  STORAGE_PREFIX: 'nc_cache_',
} as const;

// Configurações de analytics
export const ANALYTICS_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  TRACKING_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  COOKIE_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  ANONYMIZE_IP: true,
} as const;

// Configurações de performance
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms para debounce em searches
  THROTTLE_DELAY: 1000, // ms para throttle em scroll/resize
  LAZY_LOADING_THRESHOLD: 100, // pixels antes do elemento aparecer
  IMAGE_QUALITY: 85, // qualidade de imagem (0-100)
} as const;

// Configurações de validação
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  EMAIL_DOMAIN_BLACKLIST: ['tempmail.com', '10minutemail.com'],
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Configurações de créditos
export const CREDITS_CONFIG = {
  MIN_PURCHASE: 100,
  MAX_PURCHASE: 10000,
  PURCHASE_INCREMENTS: [100, 500, 1000, 2500, 5000, 10000],
  LOW_BALANCE_THRESHOLD: 50,
  CRITICAL_BALANCE_THRESHOLD: 10,
} as const;

// Configurações de planos
export const PLANS_CONFIG = {
  FREE_CREDITS_PER_MONTH: 100,
  TRIAL_DURATION_DAYS: 7,
  BILLING_CYCLES: ['monthly', 'yearly'] as const,
  PRORATION_ENABLED: true,
} as const;

// Configurações de SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Neural Content - Gerador de Conteúdo com IA',
  TITLE_TEMPLATE: '%s | Neural Content',
  DEFAULT_DESCRIPTION: 'Gere conteúdo de alta qualidade com inteligência artificial. Textos, artigos, posts e muito mais de forma rápida e eficiente.',
  DEFAULT_KEYWORDS: ['IA', 'inteligência artificial', 'gerador de conteúdo', 'textos', 'marketing'],
  DEFAULT_IMAGE: '/images/og-image.jpg',
  TWITTER_HANDLE: '@neuralcontent',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralcontent.com',
} as const;

// Configurações de contato
export const CONTACT_CONFIG = {
  SUPPORT_EMAIL: 'suporte@neuralcontent.com',
  SALES_EMAIL: 'vendas@neuralcontent.com',
  ADMIN_EMAIL: 'admin@neuralcontent.com',
  PHONE: '+55 11 99999-9999',
  ADDRESS: 'São Paulo, SP - Brasil',
  BUSINESS_HOURS: 'Segunda a Sexta, 9h às 18h',
} as const;

// Configurações de segurança
export const SECURITY_CONFIG = {
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW: 15 * 60 * 1000, // 15 minutos
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hora
  EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  TWO_FA_CODE_EXPIRY: 5 * 60 * 1000, // 5 minutos
} as const;

// Configurações de logs
export const LOGGING_CONFIG = {
  LEVEL: ENV.IS_PRODUCTION ? 'error' : 'debug',
  CONSOLE_ENABLED: !ENV.IS_PRODUCTION,
  REMOTE_ENABLED: ENV.IS_PRODUCTION,
  MAX_LOG_SIZE: 1000, // máximo de logs mantidos em memória
} as const;

// Configurações de feature flags
export const FEATURE_FLAGS = {
  BETA_FEATURES: process.env.NEXT_PUBLIC_BETA_FEATURES === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  SOCIAL_AUTH: process.env.NEXT_PUBLIC_SOCIAL_AUTH === 'true',
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ADVANCED_ANALYTICS === 'true',
  CONTENT_EXPORT: process.env.NEXT_PUBLIC_CONTENT_EXPORT === 'true',
  TEAM_FEATURES: process.env.NEXT_PUBLIC_TEAM_FEATURES === 'true',
} as const;

// Configurações regionais
export const REGIONAL_CONFIG = {
  DEFAULT_TIMEZONE: 'America/Sao_Paulo',
  DEFAULT_CURRENCY: 'BRL',
  DEFAULT_LOCALE: 'pt-BR',
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm',
  CURRENCY_SYMBOL: 'R$',
} as const;

// Configurações de integração
export const INTEGRATION_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  GOOGLE_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
} as const;

// URLs importantes
export const IMPORTANT_URLS = {
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  COOKIE_POLICY: '/cookie-policy',
  SUPPORT_CENTER: '/support',
  DOCUMENTATION: '/docs',
  API_DOCS: '/api-docs',
  STATUS_PAGE: 'https://status.neuralcontent.com',
} as const;

// Versão da aplicação
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

// Configuração consolidada
export const CONFIG = {
  ENV,
  API_CONFIG,
  AUTH_CONFIG,
  I18N_CONFIG,
  THEME_CONFIG,
  PAGINATION_CONFIG,
  UPLOAD_CONFIG,
  NOTIFICATION_CONFIG,
  CACHE_CONFIG,
  ANALYTICS_CONFIG,
  PERFORMANCE_CONFIG,
  VALIDATION_CONFIG,
  CREDITS_CONFIG,
  PLANS_CONFIG,
  SEO_CONFIG,
  CONTACT_CONFIG,
  SECURITY_CONFIG,
  LOGGING_CONFIG,
  FEATURE_FLAGS,
  REGIONAL_CONFIG,
  INTEGRATION_CONFIG,
  IMPORTANT_URLS,
  APP_VERSION,
} as const;

export default CONFIG;
