// Tipos base para usuário - Alinhado com schema MySQL usr_users
export interface User {
  id: string;                           // CHAR(36) PRIMARY KEY
  email: string;                        // VARCHAR(255) UNIQUE NOT NULL
  name: string;                         // VARCHAR(255) NOT NULL
  username?: string;                    // VARCHAR(100) UNIQUE
  phone?: string;                       // VARCHAR(20)
  avatarUrl?: string;                   // avatar_url VARCHAR(500)
  role: UserRole;                       // ENUM('user', 'admin', 'moderator')
  status: UserStatus;                   // ENUM('active', 'inactive', 'suspended', 'pending')
  accountType: AccountType;             // ENUM('personal', 'business', 'enterprise')
  subscriptionStatus: SubscriptionStatus; // ENUM('trial', 'active', 'cancelled', 'expired')
  authProvider: AuthProvider;           // ENUM('email', 'google', 'facebook', 'microsoft', 'apple')
  isEmailVerified: boolean;             // email_verified_at IS NOT NULL
  isPhoneVerified: boolean;             // phone_verified_at IS NOT NULL
  language: string;                     // VARCHAR(10) DEFAULT 'pt-BR'
  timezone: string;                     // VARCHAR(50) DEFAULT 'America/Sao_Paulo'
  theme: ThemeType;                     // ENUM('light', 'dark', 'auto')
  totalPoints: number;                  // INT DEFAULT 0
  globalLevel: number;                  // INT DEFAULT 1
  companyName?: string;                 // VARCHAR(255)
  jobTitle?: string;                    // VARCHAR(100)
  createdAt: Date;                      // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;                      // TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  lastLoginAt?: Date;                   // TIMESTAMP NULL
}

export type UserRole = 'user' | 'admin' | 'moderator'; // Alinhado com schema MySQL
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'; // Alinhado com schema MySQL
export type AccountType = 'personal' | 'business' | 'enterprise'; // Alinhado com schema MySQL
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired'; // Alinhado com schema MySQL
export type AuthProvider = 'email' | 'google' | 'facebook' | 'microsoft' | 'apple'; // Alinhado com schema MySQL

// Tipos para planos
export interface UserPlan {
  id: string;
  name: string;
  type: PlanType;
  creditsPerMonth: number;
  features: string[];
  price: number;
  isActive: boolean;
  renewsAt?: Date;
  trialEndsAt?: Date;
}

export type PlanType = 'free' | 'basic' | 'premium' | 'enterprise';

// Tipos para preferências
export interface UserPreferences {
  language: string;
  timezone: string;
  theme: ThemeType;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export type ThemeType = 'light' | 'dark' | 'auto';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
  newsletter: boolean;
  creditAlerts: boolean;
  planExpiration: boolean;
}

export interface PrivacyPreferences {
  showProfile: boolean;
  allowAnalytics: boolean;
  allowCookies: boolean;
}

// Tipos para atualização de perfil
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateAvatarRequest {
  avatar: File;
}

// Tipos para estatísticas do usuário
export interface UserStats {
  totalCreditsUsed: number;
  contentGenerated: number;
  accountAge: number; // em dias
  lastActivity: Date;
  favoriteFeatures: string[];
}

// Tipos para histórico do usuário
export interface UserActivity {
  id: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type ActivityType = 
  | 'content_generated'
  | 'credits_purchased'
  | 'plan_upgraded'
  | 'profile_updated'
  | 'login'
  | 'logout'
  | 'password_changed';

// Tipos para créditos
export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balance: number;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type CreditTransactionType = 
  | 'purchase'
  | 'usage'
  | 'refund'
  | 'bonus'
  | 'plan_renewal'
  | 'admin_adjustment';

// Tipos para pagamentos
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: Date;
}

export type PaymentMethodType = 'credit_card' | 'pix' | 'boleto' | 'paypal';

export interface PurchaseRequest {
  planId?: string;
  creditsAmount?: number;
  paymentMethodId: string;
}

// Tipos para endereço
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Tipos para dados de faturamento
export interface BillingInfo {
  name: string;
  email: string;
  document: string; // CPF/CNPJ
  address: Address;
}

// Tipos para sessões ativas
export interface ActiveSession {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  isCurrentSession: boolean;
  lastActivity: Date;
  createdAt: Date;
}

// Tipos para convites/referências
export interface UserInvite {
  id: string;
  inviterId: string;
  email: string;
  status: InviteStatus;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

// Tipos para configurações de conta
export interface AccountSettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  dataRetention: number; // em dias
  autoLogout: number; // em minutos
}

// Tipos para dados de exportação
export interface UserDataExport {
  user: User;
  activities: UserActivity[];
  transactions: CreditTransaction[];
  preferences: UserPreferences;
  generatedAt: Date;
}

// Tipos para listagem de usuários (admin)
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: string;
  credits: number;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  plan?: PlanType;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para context do usuário
export interface UserContextValue {
  user: User | null;
  stats: UserStats | null;
  activities: UserActivity[];
  transactions: CreditTransaction[];
  isLoading: boolean;
  error: string | null;

  // Ações
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  purchaseCredits: (amount: number, paymentMethodId: string) => Promise<void>;
  upgradePlan: (planId: string, paymentMethodId: string) => Promise<void>;
  loadUserData: () => Promise<void>;
  exportUserData: () => Promise<UserDataExport>;
}

export default User;
