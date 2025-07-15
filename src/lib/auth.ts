import { AUTH_CONFIG } from '@/constants/config';
import type { AuthTokens } from '@/types/auth.types';
import type { User } from '@/types/user.types';

// Funções de gerenciamento de tokens
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, tokens.accessToken);
  localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  
  // Salvar tempo de expiração
  const expirationTime = Date.now() + (tokens.expiresIn * 1000);
  localStorage.setItem('tokenExpiration', expirationTime.toString());
}

// Obter tokens armazenados
export function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  const expirationTime = localStorage.getItem('tokenExpiration');
  
  if (!accessToken || !refreshToken || !expirationTime) {
    return null;
  }
  
  return {
    accessToken,
    refreshToken,
    expiresIn: Math.max(0, parseInt(expirationTime) - Date.now()) / 1000,
    tokenType: 'Bearer',
  };
}

// Obter token de acesso
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
}

// Obter token de refresh
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
}

// Verificar se o token está expirado
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;
  
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return true;
  
  const expiration = parseInt(expirationTime);
  const now = Date.now();
  
  // Considerar expirado 5 minutos antes do tempo real (buffer de segurança)
  return now >= (expiration - AUTH_CONFIG.REFRESH_THRESHOLD);
}

// Limpar tokens do localStorage
export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem(AUTH_CONFIG.USER_DATA_STORAGE_KEY);
}

// Salvar dados do usuário
export function setUserData(userData: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_CONFIG.USER_DATA_STORAGE_KEY, JSON.stringify(userData));
}

// Obter dados do usuário
export function getUserData(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(AUTH_CONFIG.USER_DATA_STORAGE_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

// Verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  return tokens !== null && !isTokenExpired();
}

// Verificar se é admin
export function isAdmin(): boolean {
  const userData = getUserData();
  const adminRoles = ['admin', 'moderator', 'super_admin'];
  return userData ? adminRoles.includes(userData.role) : false;
}

// Verificar se é usuário premium
export function isPremium(): boolean {
  const userData = getUserData();
  return userData?.plan?.type === 'premium' || userData?.plan?.type === 'enterprise';
}

// Verificar permissão específica
export function hasPermission(permission: string): boolean {
  const userData = getUserData();
  if (!userData) return false;
  
  // Admins têm todas as permissões
  if (userData.role === 'admin') return true;
  
  // Implementar lógica de permissões específicas aqui
  // Por enquanto, apenas verificação básica de role
  const userRole = userData.role;
  const adminRoles = ['admin', 'moderator', 'super_admin'];
  
  switch (permission) {
    case 'admin':
      return adminRoles.includes(userRole);
    case 'premium':
      return userData.plan?.type === 'premium' || userData.plan?.type === 'enterprise';
    default:
      return true; // Permissões básicas para usuários autenticados
  }
}

// Verificar se tem créditos suficientes
export function hasCredits(required: number = 1): boolean {
  const userData = getUserData();
  return (userData?.credits || 0) >= required;
}

// Obter tempo restante do token
export function getTokenTimeRemaining(): number {
  if (typeof window === 'undefined') return 0;
  
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return 0;
  
  const expiration = parseInt(expirationTime);
  const now = Date.now();
  
  return Math.max(0, expiration - now);
}

// Verificar se precisa renovar o token
export function shouldRefreshToken(): boolean {
  const timeRemaining = getTokenTimeRemaining();
  return timeRemaining > 0 && timeRemaining <= AUTH_CONFIG.REFRESH_THRESHOLD;
}

// Decodificar JWT (apenas o payload)
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Verificar se o token é válido (estrutura)
export function isValidToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    const payload = decodeJWT(token);
    return payload !== null && typeof payload.exp === 'number';
  } catch {
    return false;
  }
}

// Utilitário para logout completo
export function performLogout(): void {
  clearStoredTokens();
  
  // Limpar outros dados relacionados se necessário
  if (typeof window !== 'undefined') {
    // Limpar cache ou outros dados sensíveis
    sessionStorage.clear();
  }
}

// Verificar se está em ambiente SSR
export function isServerSide(): boolean {
  return typeof window === 'undefined';
}

// Hook para uso em componentes (função utilitária)
export function getAuthState() {
  return {
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isPremium: isPremium(),
    userData: getUserData(),
    tokens: getStoredTokens(),
    timeRemaining: getTokenTimeRemaining(),
    shouldRefresh: shouldRefreshToken(),
  };
}
