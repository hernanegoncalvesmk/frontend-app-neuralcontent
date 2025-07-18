// ============================================================================
// NEURAL CONTENT - TIPOS DO PERFIL DO USUÁRIO
// ============================================================================

/**
 * Tipos para o sistema de perfil e configurações do usuário
 * 
 * @description Definições TypeScript para todas as operações de perfil
 * baseadas na API do backend NestJS com integração ao sistema de tradução
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

// ============================================================================
// ENUMS E CONSTANTES
// ============================================================================

/**
 * Tipos de notificação disponíveis
 */
export enum NotificationType {
  EMAIL = 'email',
  IN_APP = 'in_app',
  PUSH = 'push'
}

/**
 * Configurações de notificação
 */
export enum NotificationCategory {
  CREDITS = 'credits',
  SECURITY = 'security',
  SYSTEM = 'system',
  MARKETING = 'marketing'
}

/**
 * Tipos de tema
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

/**
 * Status da autenticação 2FA
 */
export enum TwoFactorStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  PENDING = 'pending'
}

/**
 * Tipos de atividade de segurança
 */
export enum SecurityActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  TWO_FACTOR_ENABLE = 'two_factor_enable',
  TWO_FACTOR_DISABLE = 'two_factor_disable',
  SESSION_TERMINATED = 'session_terminated'
}

// ============================================================================
// INTERFACES DE PERFIL
// ============================================================================

/**
 * Informações pessoais do usuário
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dados para atualização do perfil
 */
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

/**
 * Upload de avatar
 */
export interface AvatarUpload {
  file: File;
  preview?: string;
}

// ============================================================================
// INTERFACES DE CONFIGURAÇÕES
// ============================================================================

/**
 * Configurações de notificação do usuário
 */
export interface NotificationSettings {
  [NotificationCategory.CREDITS]: {
    [NotificationType.EMAIL]: boolean;
    [NotificationType.IN_APP]: boolean;
    [NotificationType.PUSH]: boolean;
  };
  [NotificationCategory.SECURITY]: {
    [NotificationType.EMAIL]: boolean;
    [NotificationType.IN_APP]: boolean;
    [NotificationType.PUSH]: boolean;
  };
  [NotificationCategory.SYSTEM]: {
    [NotificationType.EMAIL]: boolean;
    [NotificationType.IN_APP]: boolean;
    [NotificationType.PUSH]: boolean;
  };
  [NotificationCategory.MARKETING]: {
    [NotificationType.EMAIL]: boolean;
    [NotificationType.IN_APP]: boolean;
    [NotificationType.PUSH]: boolean;
  };
}

/**
 * Configurações de preferências do usuário
 */
export interface UserPreferences {
  language: string;
  timezone: string;
  theme: ThemeMode;
  notifications: NotificationSettings;
}

/**
 * Dados para atualização de preferências
 */
export interface UpdatePreferencesData {
  language?: string;
  timezone?: string;
  theme?: ThemeMode;
  notifications?: Partial<NotificationSettings>;
}

// ============================================================================
// INTERFACES DE SEGURANÇA
// ============================================================================

/**
 * Configurações de autenticação 2FA
 */
export interface TwoFactorAuth {
  enabled: boolean;
  status: TwoFactorStatus;
  email: string;
  enabledAt?: Date;
}

/**
 * Sessão ativa do usuário
 */
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  current: boolean;
}

/**
 * Atividade de segurança
 */
export interface SecurityActivity {
  id: string;
  userId: string;
  type: SecurityActivityType;
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Configurações de segurança
 */
export interface SecuritySettings {
  twoFactorAuth: TwoFactorAuth;
  sessions: UserSession[];
  activities: SecurityActivity[];
}

// ============================================================================
// INTERFACES DE API
// ============================================================================

/**
 * Resposta da API para perfil completo
 */
export interface ProfileResponse {
  profile: UserProfile;
  preferences: UserPreferences;
  security: SecuritySettings;
}

/**
 * Resposta para upload de avatar
 */
export interface AvatarUploadResponse {
  url: string;
  filename: string;
  size: number;
}

/**
 * Resposta para habilitação de 2FA
 */
export interface TwoFactorEnableResponse {
  success: boolean;
  message: string;
  backupCodes?: string[];
}

/**
 * Dados para verificação de 2FA
 */
export interface TwoFactorVerification {
  code: string;
  email: string;
}

/**
 * Filtros para atividades de segurança
 */
export interface SecurityActivityFilters {
  type?: SecurityActivityType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// ============================================================================
// INTERFACES DE COMPONENTES
// ============================================================================

/**
 * Props para o componente de perfil
 */
export interface ProfilePageProps {
  initialData?: ProfileResponse;
}

/**
 * Props para seção de informações pessoais
 */
export interface PersonalInfoSectionProps {
  profile: UserProfile;
  loading?: boolean;
  onUpdate: (data: UpdateProfileData) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
}

/**
 * Props para seção de configurações
 */
export interface PreferencesSectionProps {
  preferences: UserPreferences;
  loading?: boolean;
  onUpdate: (data: UpdatePreferencesData) => Promise<void>;
}

/**
 * Props para seção de segurança
 */
export interface SecuritySectionProps {
  security: SecuritySettings;
  loading?: boolean;
  onEnable2FA: () => Promise<void>;
  onDisable2FA: () => Promise<void>;
  onTerminateSession: (sessionId: string) => Promise<void>;
  onTerminateAllSessions: () => Promise<void>;
}

// ============================================================================
// INTERFACES DE ESTADO
// ============================================================================

/**
 * Estado da página de perfil
 */
export interface ProfilePageState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  security: SecuritySettings | null;
  loading: {
    profile: boolean;
    preferences: boolean;
    security: boolean;
    avatar: boolean;
    twoFactor: boolean;
  };
  activeTab: 'personal' | 'preferences' | 'security';
  errors: {
    profile?: string;
    preferences?: string;
    security?: string;
  };
}

/**
 * Contexto de tradução para perfil
 */
export interface ProfileTranslations {
  tabs: {
    personal: string;
    preferences: string;
    security: string;
  };
  personal: {
    title: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
    uploadAvatar: string;
    save: string;
  };
  preferences: {
    title: string;
    language: string;
    timezone: string;
    theme: string;
    notifications: string;
    save: string;
  };
  security: {
    title: string;
    twoFactor: string;
    sessions: string;
    activities: string;
    enable: string;
    disable: string;
    terminate: string;
  };
  messages: {
    success: string;
    error: string;
    loading: string;
  };
}

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

/**
 * Response padrão da API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Opções para lista de idiomas
 */
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

/**
 * Opções para lista de fusos horários
 */
export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

/**
 * Configuração de componente de upload
 */
export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
  multiple: boolean;
}

/**
 * Estado de validação de formulário
 */
export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}
