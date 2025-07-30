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
    // Use the same keys as middleware
    const accessToken = localStorage.getItem('access_token') || 
                       document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
    const refreshToken = localStorage.getItem('refresh_token') || 
                        document.cookie.split('; ').find(row => row.startsWith('refresh_token='))?.split('=')[1];
    
    if (accessToken && refreshToken) {
      return {
        accessToken,
        refreshToken,
        expiresIn: 3600, // Default 1 hour
        tokenType: 'Bearer'
      };
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
    // Store in localStorage and cookies (for middleware)
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    
    // Set cookies with expiration
    const expires = new Date(Date.now() + (tokens.expiresIn || 3600) * 1000).toUTCString();
    document.cookie = `access_token=${tokens.accessToken}; expires=${expires}; path=/; SameSite=Lax`;
    document.cookie = `refresh_token=${tokens.refreshToken}; expires=${expires}; path=/; SameSite=Lax`;
    
    console.log('🍪 Tokens salvos:', { accessToken: tokens.accessToken.substring(0, 20) + '...', refreshToken: tokens.refreshToken.substring(0, 20) + '...' });
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
}

export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Remove from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear cookies
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('🗑️ Tokens removidos');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}
