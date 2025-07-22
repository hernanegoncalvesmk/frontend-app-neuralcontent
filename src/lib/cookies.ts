import { AUTH_CONFIG } from '@/constants/config';
import type { AuthTokens } from '@/types/auth.types';
import type { User } from '@/types/user.types';

// Configurações de cookies
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Função para definir cookie
function setCookie(name: string, value: string, maxAge?: number): void {
  if (typeof document === 'undefined') return;

  const options = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${COOKIE_OPTIONS.path}`,
    `samesite=${COOKIE_OPTIONS.sameSite}`,
  ];

  if (maxAge) {
    options.push(`max-age=${maxAge}`);
  }

  if (COOKIE_OPTIONS.secure) {
    options.push('secure');
  }

  document.cookie = options.join('; ');
}

// Função para obter cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  return null;
}

// Função para remover cookie
function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_OPTIONS.path};`;
}

// Salvar tokens tanto em localStorage quanto em cookies
export function setTokens(tokens: AuthTokens): void {
  const maxAge = tokens.expiresIn; // tempo em segundos
  
  // localStorage (para compatibilidade)
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, tokens.accessToken);
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    
    const expirationTime = Date.now() + (tokens.expiresIn * 1000);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  }
  
  // Cookies (para middleware)
  setCookie(AUTH_CONFIG.TOKEN_STORAGE_KEY, tokens.accessToken, maxAge);
  setCookie(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken, maxAge);
}

// Obter tokens com fallback localStorage -> cookies
export function getStoredTokens(): AuthTokens | null {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expirationTime: string | null = null;

  // Tentar localStorage primeiro
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
    refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    expirationTime = localStorage.getItem('tokenExpiration');
  }

  // Fallback para cookies se localStorage não estiver disponível
  if (!accessToken) {
    accessToken = getCookie(AUTH_CONFIG.TOKEN_STORAGE_KEY);
    refreshToken = getCookie(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  }

  if (!accessToken || !refreshToken) {
    return null;
  }

  // Calcular expiração se não tiver no localStorage
  let expiresIn = 0;
  if (expirationTime) {
    expiresIn = Math.max(0, parseInt(expirationTime) - Date.now()) / 1000;
  } else {
    // Tentar extrair do token JWT
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      expiresIn = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
    } catch {
      expiresIn = 3600; // 1 hora como fallback
    }
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    tokenType: 'Bearer',
  };
}

// Limpar tokens de localStorage e cookies
export function clearStoredTokens(): void {
  // Limpar localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem(AUTH_CONFIG.USER_DATA_STORAGE_KEY);
  }

  // Limpar cookies
  removeCookie(AUTH_CONFIG.TOKEN_STORAGE_KEY);
  removeCookie(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
}

// Salvar dados do usuário
export function setUserData(userData: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_CONFIG.USER_DATA_STORAGE_KEY, JSON.stringify(userData));
  }
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

// Verificar se o token está expirado
export function isTokenExpired(): boolean {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) return true;

  try {
    const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Buffer de 5 minutos para renovação
    return now >= (payload.exp - 300);
  } catch {
    return true;
  }
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  return tokens !== null && !isTokenExpired();
}

// Obter estado completo de autenticação
export function getAuthState() {
  const tokens = getStoredTokens();
  const userData = getUserData();
  const authenticated = tokens !== null && !isTokenExpired();
  
  return {
    isAuthenticated: authenticated,
    isAdmin: userData?.role === 'admin' || userData?.role === 'moderator',
    isPremium: userData?.subscriptionStatus === 'active' && userData?.accountType !== 'personal',
    userData,
    tokens,
    timeRemaining: tokens ? Math.max(0, tokens.expiresIn * 1000) : 0,
    shouldRefresh: tokens ? tokens.expiresIn < 300 : false, // Renovar se < 5 minutos
  };
}
