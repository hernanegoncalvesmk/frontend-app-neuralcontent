// ============================================================================
// NEURAL CONTENT - SERVIÇO DE PERFIL
// ============================================================================

/**
 * Serviço para operações de perfil do usuário
 * 
 * @description Integração com API do backend para operações de perfil,
 * configurações e segurança com sistema de tradução
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

import {
  UserProfile,
  UpdateProfileData,
  UserPreferences,
  UpdatePreferencesData,
  SecuritySettings,
  TwoFactorVerification,
  SecurityActivityFilters,
  ProfileResponse,
  AvatarUploadResponse,
  TwoFactorEnableResponse,
  ApiResponse,
  LanguageOption,
  TimezoneOption,
  UserSession,
  SecurityActivity
} from '@/types/profile.types';

// ============================================================================
// CONFIGURAÇÃO DA API
// ============================================================================

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;
    
    return {
      ...this.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro na requisição',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('token') 
        : null;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro no upload',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no upload',
      };
    }
  }
}

// ============================================================================
// SERVIÇO PRINCIPAL
// ============================================================================

class ProfileService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient();
  }

  // ============================================================================
  // OPERAÇÕES DE PERFIL
  // ============================================================================

  /**
   * Buscar perfil completo do usuário
   */
  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    return this.api.request<ProfileResponse>('/users/profile');
  }

  /**
   * Atualizar informações pessoais
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserProfile>> {
    return this.api.request<UserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Upload de avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<AvatarUploadResponse>> {
    return this.api.upload<AvatarUploadResponse>('/users/avatar', file);
  }

  /**
   * Remover avatar
   */
  async removeAvatar(): Promise<ApiResponse<void>> {
    return this.api.request<void>('/users/avatar', {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // OPERAÇÕES DE PREFERÊNCIAS
  // ============================================================================

  /**
   * Buscar preferências do usuário
   */
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return this.api.request<UserPreferences>('/users/preferences');
  }

  /**
   * Atualizar preferências
   */
  async updatePreferences(data: UpdatePreferencesData): Promise<ApiResponse<UserPreferences>> {
    return this.api.request<UserPreferences>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Buscar idiomas disponíveis
   */
  async getAvailableLanguages(): Promise<ApiResponse<LanguageOption[]>> {
    return this.api.request<LanguageOption[]>('/system/languages');
  }

  /**
   * Buscar fusos horários disponíveis
   */
  async getAvailableTimezones(): Promise<ApiResponse<TimezoneOption[]>> {
    return this.api.request<TimezoneOption[]>('/system/timezones');
  }

  // ============================================================================
  // OPERAÇÕES DE SEGURANÇA
  // ============================================================================

  /**
   * Buscar configurações de segurança
   */
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    return this.api.request<SecuritySettings>('/users/security');
  }

  /**
   * Habilitar autenticação 2FA
   */
  async enable2FA(): Promise<ApiResponse<TwoFactorEnableResponse>> {
    return this.api.request<TwoFactorEnableResponse>('/auth/2fa/enable', {
      method: 'POST',
    });
  }

  /**
   * Verificar código 2FA
   */
  async verify2FA(verification: TwoFactorVerification): Promise<ApiResponse<void>> {
    return this.api.request<void>('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify(verification),
    });
  }

  /**
   * Desabilitar autenticação 2FA
   */
  async disable2FA(code: string): Promise<ApiResponse<void>> {
    return this.api.request<void>('/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  /**
   * Buscar sessões ativas
   */
  async getActiveSessions(): Promise<ApiResponse<UserSession[]>> {
    return this.api.request<UserSession[]>('/users/sessions');
  }

  /**
   * Terminar sessão específica
   */
  async terminateSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.api.request<void>(`/users/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Terminar todas as outras sessões
   */
  async terminateAllSessions(): Promise<ApiResponse<void>> {
    return this.api.request<void>('/users/sessions/terminate-all', {
      method: 'POST',
    });
  }

  /**
   * Buscar atividades de segurança
   */
  async getSecurityActivities(filters?: SecurityActivityFilters): Promise<ApiResponse<SecurityActivity[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/users/security/activities${queryString ? `?${queryString}` : ''}`;
    
    return this.api.request<SecurityActivity[]>(endpoint);
  }

  // ============================================================================
  // OPERAÇÕES DE TRADUÇÃO
  // ============================================================================

  /**
   * Buscar traduções para o perfil
   */
  async getProfileTranslations(language: string): Promise<ApiResponse<Record<string, any>>> {
    return this.api.request<Record<string, any>>(`/translations/profile?lang=${language}`);
  }

  // ============================================================================
  // UTILITÁRIOS
  // ============================================================================

  /**
   * Validar upload de arquivo
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. O tamanho máximo é 5MB.',
      };
    }

    return { valid: true };
  }

  /**
   * Formatar tamanho de arquivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Detectar fuso horário do usuário
   */
  detectTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Detectar idioma do usuário
   */
  detectLanguage(): string {
    if (typeof window !== 'undefined') {
      return navigator.language.split('-')[0];
    }
    return 'pt';
  }

  /**
   * Formatar data de última atividade
   */
  formatLastActivity(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  }

  /**
   * Gerar preview de imagem
   */
  generateImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validar força da senha
   */
  validatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Use pelo menos 8 caracteres');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Inclua letras minúsculas');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Inclua letras maiúsculas');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Inclua números');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Inclua caracteres especiais');

    return {
      score,
      feedback,
      isValid: score >= 4,
    };
  }
}

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

export const profileService = new ProfileService();
export default profileService;
