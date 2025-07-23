export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

export function getStoredTokens(): StoredTokens | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try localStorage first
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Fallback to sessionStorage
    const sessionStored = sessionStorage.getItem('auth_tokens');
    if (sessionStored) {
      return JSON.parse(sessionStored);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return null;
  }
}

export function setStoredTokens(tokens: StoredTokens): void {
  if (typeof window === 'undefined') return;
  
  try {
    const tokenData = JSON.stringify(tokens);
    localStorage.setItem('auth_tokens', tokenData);
    sessionStorage.setItem('auth_tokens', tokenData);
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
}

export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('auth_tokens');
    sessionStorage.removeItem('auth_tokens');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}
