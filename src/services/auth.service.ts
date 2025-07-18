import { apiClient } from '@/lib/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  ChangePasswordRequest,
  AuthResponse,
  EmailVerificationRequest,
  RefreshTokenResponse
} from '@/types/auth.types';
import type { User } from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse['data']>('/auth/login', credentials);
  },

  // Registro
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse['data']>('/auth/register', userData);
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    return await apiClient.post<null>('/auth/logout');
  },

  // Esqueci minha senha
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/forgot-password', data);
  },

  // Redefinir senha
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/reset-password', data);
  },

  // Alterar senha
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.patch<{ message: string }>('/auth/change-password', data);
  },

  // Verificar email
  async verifyEmail(data: EmailVerificationRequest): Promise<ApiResponse<User>> {
    return await apiClient.post<User>('/auth/verify-email', data);
  },

  // Reenviar verificação de email
  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/resend-verification');
  },

  // Refresh token
  async refreshToken(): Promise<RefreshTokenResponse> {
    return await apiClient.post<RefreshTokenResponse['data']>('/auth/refresh');
  },

  // Obter perfil do usuário
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/auth/profile');
  },

  // Atualizar perfil
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return await apiClient.patch<User>('/auth/profile', data);
  },

  // Deletar conta
  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>('/auth/account');
  },

  // Verificar se email está disponível
  async checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return await apiClient.post<{ available: boolean }>('/auth/check-email', { email });
  },

  // Habilitar 2FA
  async enable2FA(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    return await apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/enable');
  },

  // Confirmar 2FA
  async confirm2FA(token: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return await apiClient.post<{ backupCodes: string[] }>('/auth/2fa/confirm', { token });
  },

  // Desabilitar 2FA
  async disable2FA(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/2fa/disable', { token });
  },

  // Verificar 2FA
  async verify2FA(token: string): Promise<ApiResponse<{ valid: boolean }>> {
    return await apiClient.post<{ valid: boolean }>('/auth/2fa/verify', { token });
  },
};