/**
 * @fileoverview User Types
 * 
 * Type definitions for user domain functionality.
 * 
 * @version 1.0.0
 * @domain user
 */

import type { BaseEntity, Status, Language } from '@/domains/shared/types/common.types';

// ================================
// User Core Types
// ================================

export interface User extends BaseEntity {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  language: Language;
  timezone?: string;
  country?: string;
  city?: string;
  status: UserStatus;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  lastActiveAt?: string;
  preferences: UserPreferences;
  profile: UserProfile;
  metadata: UserMetadata;
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
}

// ================================
// User Preferences
// ================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: Language;
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YYYY = 'MM/DD/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
  DD_MMM_YYYY = 'DD MMM YYYY',
}

export enum TimeFormat {
  H24 = '24h',
  H12 = '12h',
}

export interface NotificationPreferences {
  email: EmailNotificationSettings;
  push: PushNotificationSettings;
  inApp: InAppNotificationSettings;
  sms: SmsNotificationSettings;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  frequency: NotificationFrequency;
  types: EmailNotificationType[];
  unsubscribeToken?: string;
}

export interface PushNotificationSettings {
  enabled: boolean;
  types: PushNotificationType[];
  quiet_hours?: QuietHours;
}

export interface InAppNotificationSettings {
  enabled: boolean;
  types: InAppNotificationType[];
  soundEnabled: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface SmsNotificationSettings {
  enabled: boolean;
  types: SmsNotificationType[];
  phoneNumber?: string;
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NEVER = 'never',
}

export enum EmailNotificationType {
  SECURITY_ALERTS = 'security_alerts',
  ACCOUNT_UPDATES = 'account_updates',
  MARKETING = 'marketing',
  PRODUCT_UPDATES = 'product_updates',
  BILLING = 'billing',
  NEWSLETTER = 'newsletter',
}

export enum PushNotificationType {
  SECURITY_ALERTS = 'security_alerts',
  MESSAGES = 'messages',
  REMINDERS = 'reminders',
  UPDATES = 'updates',
}

export enum InAppNotificationType {
  SYSTEM = 'system',
  MESSAGES = 'messages',
  ALERTS = 'alerts',
  SUCCESS = 'success',
}

export enum SmsNotificationType {
  SECURITY_ALERTS = 'security_alerts',
  VERIFICATION = 'verification',
  EMERGENCY = 'emergency',
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

// ================================
// Privacy Preferences
// ================================

export interface PrivacyPreferences {
  profileVisibility: ProfileVisibility;
  searchableByEmail: boolean;
  searchableByPhone: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
  shareWithThirdParties: boolean;
  dataRetentionDays?: number;
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  FRIENDS_ONLY = 'friends_only',
  PRIVATE = 'private',
}

// ================================
// Accessibility Preferences
// ================================

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: FontSize;
  colorBlindnessType?: ColorBlindnessType;
}

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large',
}

export enum ColorBlindnessType {
  PROTANOPIA = 'protanopia',
  DEUTERANOPIA = 'deuteranopia',
  TRITANOPIA = 'tritanopia',
  ACHROMATOPSIA = 'achromatopsia',
}

// ================================
// User Profile
// ================================

export interface UserProfile {
  occupation?: string;
  company?: string;
  website?: string;
  socialLinks: SocialLinks;
  interests: string[];
  skills: string[];
  experience?: ExperienceLevel;
  education?: Education[];
  certifications?: Certification[];
  achievements?: Achievement[];
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  personal?: string;
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  gpa?: number;
  honors?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  dateEarned: string;
  category: AchievementCategory;
  points?: number;
  badgeUrl?: string;
}

export enum AchievementCategory {
  LEARNING = 'learning',
  CONTRIBUTION = 'contribution',
  MILESTONE = 'milestone',
  RECOGNITION = 'recognition',
  SPECIAL = 'special',
}

// ================================
// User Metadata
// ================================

export interface UserMetadata {
  registrationSource: RegistrationSource;
  referralCode?: string;
  referredBy?: string;
  marketingSource?: string;
  firstLoginAt?: string;
  loginCount: number;
  sessionCount: number;
  totalTimeSpent: number; // in minutes
  featuresUsed: string[];
  tags: string[];
  notes?: string;
  customFields: Record<string, any>;
}

export enum RegistrationSource {
  WEBSITE = 'website',
  MOBILE_APP = 'mobile_app',
  SOCIAL_LOGIN = 'social_login',
  INVITATION = 'invitation',
  API = 'api',
  IMPORT = 'import',
  ADMIN = 'admin',
}

// ================================
// User Request/Response Types
// ================================

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  language?: Language;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  marketingConsent?: boolean;
  referralCode?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  language?: Language;
  timezone?: string;
  country?: string;
  city?: string;
  avatar?: string;
}

export interface UpdateUserPreferencesRequest {
  theme?: 'light' | 'dark' | 'auto';
  language?: Language;
  timezone?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  currency?: string;
  notifications?: Partial<NotificationPreferences>;
  privacy?: Partial<PrivacyPreferences>;
  accessibility?: Partial<AccessibilityPreferences>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserResponse {
  user: User;
  permissions: string[];
  subscription?: UserSubscription;
  statistics?: UserStatistics;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ================================
// User Subscription (if applicable)
// ================================

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  features: string[];
  limits: SubscriptionLimits;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  LIFETIME = 'lifetime',
}

export interface SubscriptionLimits {
  storage: number; // in bytes
  apiCalls: number; // per month
  users: number;
  projects: number;
  customFields: Record<string, number>;
}

// ================================
// User Statistics
// ================================

export interface UserStatistics {
  totalLogins: number;
  totalSessions: number;
  totalTimeSpent: number; // in minutes
  lastLoginAt?: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
  streakDays: number;
  longestStreakDays: number;
  activityScore: number;
  engagementLevel: EngagementLevel;
}

export enum EngagementLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

// ================================
// User Search and Filter Types
// ================================

export interface UserSearchQuery {
  query?: string;
  roles?: UserRole[];
  statuses?: UserStatus[];
  languages?: Language[];
  countries?: string[];
  registrationSource?: RegistrationSource[];
  dateRange?: {
    field: 'createdAt' | 'lastLoginAt' | 'updatedAt';
    start: string;
    end: string;
  };
  hasSubscription?: boolean;
  isVerified?: boolean;
  hasTwoFactor?: boolean;
}

export interface UserSortOptions {
  field: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' | 'firstName' | 'lastName';
  direction: 'asc' | 'desc';
}
